"""Cache one complete rendition per English text in the site's fixed British voice."""
import datetime,hashlib,json,os,pathlib,subprocess,tempfile,unicodedata
import numpy as np
import soundfile as sf
import onnxruntime as ort
ort.set_default_logger_severity(3)
from kokoro_onnx import Kokoro

ROOT=pathlib.Path(__file__).resolve().parents[1]
CACHE=pathlib.Path(os.environ.get('SONA_ENGLISH_MODEL_DIR',str(pathlib.Path.home()/'.cache/sona-british-voice')))
NODE=pathlib.Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
VOICE='bf_emma'
PROFILE='single-v2'
MODEL_SHA='f3a290d384fbb27966d462905c71a46cef9e5fd00516b40df32a0b4afe77ac96'
VOICES_SHA='bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d'
MANIFEST=ROOT/'audio/english-manifest.json'

def norm(s):
 return ''.join(c for c in unicodedata.normalize('NFD',s.strip().lower()) if not unicodedata.combining(c)).replace('’',"'")

def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def render_once(engine,text):
 # Never repeat the text, append spoken context, or cut between utterances.
 audio,rate=engine.create(text,voice=VOICE,speed=1.0,lang='en-gb',trim=False,sentence_pause=0,clause_pause=0)
 audio=np.asarray(audio,dtype=np.float32).ravel()
 if rate!=24000 or len(audio)<2400 or not np.isfinite(audio).all() or np.max(np.abs(audio))<.005:
  raise RuntimeError('Invalid English audio: '+text)
 # Trim only outer silence, preserving quiet consonants and natural decay.
 hop=round(rate*.01)
 energy=np.array([np.sqrt(np.mean(audio[i:i+hop]**2)) for i in range(0,len(audio),hop)])
 active=np.flatnonzero(energy>max(.0001,float(energy.max())*.003))
 if not len(active):raise RuntimeError('Silent English audio: '+text)
 start=max(0,int(active[0])*hop-round(rate*.06))
 end=min(len(audio),(int(active[-1])+1)*hop+round(rate*.08))
 audio=audio[start:end]
 peak=float(np.max(np.abs(audio)))
 if peak>.98:audio=audio*(.98/peak)
 return audio,rate

def main():
 source="const fs=require('fs'),vm=require('vm');let c={window:{}};vm.runInNewContext(fs.readFileSync('lessons.js','utf8'),c);console.log(JSON.stringify(c.window.LESSONS));"
 lessons=json.loads(subprocess.check_output([str(NODE),'-e',source],cwd=ROOT))
 lessons+=json.loads((ROOT/'daily.json').read_text())['days']
 texts={norm(w['en']):w['en'] for d in lessons for w in [*d['words'],d]}
 manifest=json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {'version':1,'provider':'Kokoro-82M','voice':VOICE,'language':'en-GB','gender':'female','entries':{}}
 if manifest.get('voice')!=VOICE:raise RuntimeError('Unexpected English voice registry; inspect before switching.')
 manifest['profile']=PROFILE
 pending=[]
 for key,text in texts.items():
  e=manifest['entries'].get(key)
  if e and e.get('profile')==PROFILE and e.get('modelSha256')==MODEL_SHA and (ROOT/e['file']).is_file() and digest(ROOT/e['file'])==e.get('sha256'):continue
  pending.append((key,text))
 if not pending:
  print(json.dumps({'generated':0,'available':len(manifest['entries']),'voice':VOICE,'profile':PROFILE}));return
 model=CACHE/'kokoro-v1.0.fp16.onnx';voices=CACHE/'voices-v1.0.bin'
 if digest(model)!=MODEL_SHA or digest(voices)!=VOICES_SHA:raise RuntimeError('English model/voice checksum mismatch; do not generate.')
 engine=Kokoro(str(model),str(voices))
 for i,(key,text) in enumerate(pending):
  audio,rate=render_once(engine,text)
  stem='en-gb-emma-'+hashlib.sha256(('en-GB:'+VOICE+':'+PROFILE+':'+MODEL_SHA+':'+key).encode()).hexdigest()[:20]
  target=ROOT/'audio'/f'{stem}.m4a'
  with tempfile.TemporaryDirectory(prefix='sona-english-') as temp:
   wav=pathlib.Path(temp)/'speech.wav';sf.write(wav,audio,rate)
   dest=pathlib.Path(temp)/'speech.m4a'
   subprocess.run(['/usr/bin/afconvert',str(wav),str(dest),'-f','m4af','-d','aac','-b','64000'],check=True,capture_output=True)
   target.write_bytes(dest.read_bytes())
  manifest['entries'][key]={'file':'audio/'+target.name,'text':text,'voice':VOICE,'language':'en-GB','gender':'female','provider':'Kokoro-82M','modelSha256':MODEL_SHA,'profile':PROFILE,'source':'https://huggingface.co/hexgrad/Kokoro-82M','license':'Apache-2.0','seconds':len(audio)/rate,'sha256':digest(target)}
  manifest['updatedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat()
  temp_manifest=MANIFEST.with_suffix('.json.tmp');temp_manifest.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');temp_manifest.replace(MANIFEST)
  if (i+1)%10==0:print(json.dumps({'generated':i+1,'total':len(pending)}),flush=True)
 print(json.dumps({'generated':len(pending),'available':len(manifest['entries']),'voice':VOICE,'profile':PROFILE}),flush=True)

if __name__=='__main__':main()
