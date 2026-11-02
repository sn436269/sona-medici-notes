"""Generate the site's fixed British female voice locally; never use device voices."""
import hashlib,json,os,pathlib,subprocess,tempfile,unicodedata,datetime
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT=pathlib.Path(__file__).resolve().parents[1]
CACHE=pathlib.Path(os.environ.get('SONA_ENGLISH_MODEL_DIR',str(pathlib.Path.home()/'.cache/sona-british-voice')))
NODE=pathlib.Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node'
VOICE='bf_emma'
MODEL_SHA='ae315a79b623f244700e4afb9246c46a26066782e049ba174bf3ba433970ee9c'
MANIFEST=ROOT/'audio/english-manifest.json'
def norm(s):
 return ''.join(c for c in unicodedata.normalize('NFD',s.strip().lower()) if not unicodedata.combining(c)).replace('’',"'")
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
source="const fs=require('fs'),vm=require('vm');let c={window:{}};vm.runInNewContext(fs.readFileSync('lessons.js','utf8'),c);console.log(JSON.stringify(c.window.LESSONS));"
lessons=json.loads(subprocess.check_output([str(NODE),'-e',source],cwd=ROOT))
lessons+=json.loads((ROOT/'daily.json').read_text())['days']
texts={norm(w['en']):w['en'] for d in lessons for w in [*d['words'],d]}
manifest=json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {'version':1,'provider':'Kokoro-82M','voice':VOICE,'language':'en-GB','gender':'female','entries':{}}
if manifest.get('voice')!=VOICE:raise RuntimeError('Unexpected English voice registry; preserve existing files and inspect before switching.')
pending=[]
for key,text in texts.items():
 entry=manifest['entries'].get(key)
 if entry and entry.get('profile')=='context-v1' and entry.get('modelSha256')==MODEL_SHA and (ROOT/entry['file']).is_file() and digest(ROOT/entry['file'])==entry.get('sha256'):continue
 pending.append((key,text))
if not pending:
 print(json.dumps({'generated':0,'available':len(manifest['entries']),'voice':VOICE}));raise SystemExit
model=CACHE/'kokoro-v1.0.int8.onnx'
voices=CACHE/'voices-v1.0.bin'
if digest(model)!=MODEL_SHA:raise RuntimeError('English model checksum mismatch; do not generate.')
if digest(voices)!='bca610b8308e8d99f32e6fe4197e7ec01679264efed0cac9140fe9c29f1fbf7d':raise RuntimeError('English voice checksum mismatch; do not generate.')
k=Kokoro(str(model),str(voices))
for i,(key,text) in enumerate(pending):
 # The model's author recommends contextualizing very short utterances.
 # Synthesize three instances, then use exported phoneme timings to retain
 # exactly the middle instance, bounded by the surrounding pauses.
 unit=text.strip()
 if unit[-1] not in '.!?':unit+='.'
 for repeats in (3,5):
  raw,rate,times=k.create_timed(' '.join([unit]*repeats),voice=VOICE,speed=1.0,lang='en-gb',trim=False,sentence_pause=0,clause_pause=0)
  marks=[j for j,t in enumerate(times) if t.phoneme in '.!?']
  if len(marks)!=repeats:raise RuntimeError('Unexpected sentence boundaries: '+text)
  middle=repeats//2
  def boundary(mark):
   j=marks[mark]
   nxt=next(t for t in times[j+1:] if t.phoneme!=' ')
   return round((times[j].end+nxt.start)*.5*rate)
  left=boundary(middle-1);right=boundary(middle)
  audio=raw[left:right]
  if len(audio)>=2400 and np.isfinite(audio).all() and np.max(np.abs(audio))>=.005:break
 if rate!=24000 or len(audio)<2400 or not np.isfinite(audio).all() or np.max(np.abs(audio))<.005:raise RuntimeError('Invalid English audio: '+text)
 stem='en-gb-emma-'+hashlib.sha256(('en-GB:'+VOICE+':context-v1:'+MODEL_SHA+':'+key).encode()).hexdigest()[:20]
 target=ROOT/'audio'/f'{stem}.m4a'
 with tempfile.TemporaryDirectory(prefix='sona-english-') as temp:
  wav=pathlib.Path(temp)/'speech.wav';sf.write(wav,audio,rate)
  dest=pathlib.Path(temp)/'speech.m4a'
  subprocess.run(['/usr/bin/afconvert',str(wav),str(dest),'-f','m4af','-d','aac','-b','64000'],check=True,capture_output=True)
  target.write_bytes(dest.read_bytes())
 manifest['entries'][key]={'file':'audio/'+target.name,'text':text,'voice':VOICE,'language':'en-GB','gender':'female','provider':'Kokoro-82M','modelSha256':MODEL_SHA,'profile':'context-v1','source':'https://huggingface.co/hexgrad/Kokoro-82M','license':'Apache-2.0','seconds':len(audio)/rate,'sha256':digest(target)}
 manifest['updatedAt']=datetime.datetime.now(datetime.timezone.utc).isoformat()
 temporary=MANIFEST.with_suffix('.json.tmp');temporary.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');temporary.replace(MANIFEST)
 if (i+1)%10==0:print(json.dumps({'generated':i+1,'total':len(pending)}),flush=True)
print(json.dumps({'generated':len(pending),'available':len(manifest['entries']),'voice':VOICE}),flush=True)
