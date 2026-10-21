/* 明湖國小五年級上學期｜原創數學練習題庫
 * 教材單元名稱依臺北市官方五上康軒數學數位教材目錄核對：
 * https://tten.tp.edu.tw/Login/Downment?grade=5&spid=625c176d-8a1e-4d65-b845-b548c4f84e06&subject=Mathematics
 * 第五組為第八單元「整數四則運算」提前練習；第六組為跨單元原創應用。
 * 題目皆為原創，不重製課本題目。小數以整數千分位運算，避免浮點誤差。
 */
(function () {
  'use strict';
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const factors = n => Array.from({ length: n }, (_, i) => i + 1).filter(x => n % x === 0);
  const dec = n => `${n < 0 ? '-' : ''}${Math.floor(Math.abs(n) / 1000)}.${String(Math.abs(n) % 1000).padStart(3, '0')}`;
  const fraction = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };
  const units = [];
  function unit(id, title, subtitle, scope) {
    const u = { id, subject: 'math', title, subtitle, scope, questions: [] };
    units.push(u); return u;
  }
  function add(u, stem, correct, candidates, explanation, tag) {
    const value = String(correct);
    const wrong = [...new Set(candidates.map(String))].filter(v => v !== value).slice(0, 3);
    if (wrong.length !== 3) throw new Error(`選項不足：${stem}`);
    const answer = u.questions.length % 4;
    const options = wrong.slice(); options.splice(answer, 0, value);
    u.questions.push({ id: `${u.id}-${String(u.questions.length + 1).padStart(2, '0')}`, stem, options, answer, explanation, tag });
  }
  function number(u, stem, correct, candidates, explanation, tag, format = String) {
    if (!Number.isInteger(correct)) throw new Error(`正解不是精確整數：${stem}`);
    const values = candidates.filter(Number.isInteger).concat([correct + 1, correct + 2, correct + 3, correct + 4]);
    add(u, stem, format(correct), values.map(format), explanation, tag);
  }

  const d = unit('ma-1', '第一單元｜多位小數與加減', '讀懂千分位，精準計算與檢查生活中的小數。', '五上康軒第一單元：多位小數與加減');
  for (let t = 0; t < 3; t++) {
    let a = 43725 + t * 9163, b = 18648 + t * 3177, c = 7596 + t * 1289;
    number(d, `${dec(a)}＋${dec(b)}＝？`, a + b, [a + b - 1000, a + b + 100, a + b - 10], `小數點對齊，從千分位開始相加：${dec(a)}＋${dec(b)}＝${dec(a + b)}。每滿十就向左進一。`, '小數加法', dec);
    a = 80304 + t * 10097; b = 47869 + t * 3114;
    number(d, `${dec(a)}－${dec(b)}＝？`, a - b, [a - b + 1000, a - b - 100, a - b + 10], `小數點對齊，位數不足時補 0；逐位退位相減：${dec(a)}－${dec(b)}＝${dec(a - b)}。`, '小數退位減法', dec);
    a = 27368 + t * 4371; b = 9467 + t * 1206; c = 15879 + t * 2893;
    number(d, `${dec(a)}＋${dec(b)}＋${dec(c)}＝？`, a + b + c, [a + b + c - 1000, a + b + c + 100, a + b], `先算前兩項：${dec(a)}＋${dec(b)}＝${dec(a + b)}；再加 ${dec(c)}，得到 ${dec(a + b + c)}。`, '三個小數相加', dec);
    a = 100000 + t * 17000; b = 28475 + t * 1926; c = 19686 + t * 2647;
    number(d, `${dec(a)}－（${dec(b)}＋${dec(c)}）＝？`, a - b - c, [a - b + c, a - b - c + 1000, a - b - c - 100], `先算括號：${dec(b)}＋${dec(c)}＝${dec(b + c)}；再算 ${dec(a)}－${dec(b + c)}＝${dec(a - b - c)}。`, '小數括號計算', dec);
    a = 32678 + t * 2741; b = 78516 + t * 5653;
    number(d, `□＋${dec(a)}＝${dec(b)}，□ 是多少？`, b - a, [b + a, b - a + 1000, b - a - 100], `用和減去已知的加數：□＝${dec(b)}－${dec(a)}＝${dec(b - a)}。代回相加可驗算。`, '小數未知數', dec);
    a = 42785 + t * 3196; b = 19648 + t * 2187; c = 12579 + t * 1482;
    number(d, `登山隊原有 ${dec(a)} 公升飲水，上午用掉 ${dec(b)} 公升，下午又補充 ${dec(c)} 公升。現在有幾公升？`, a - b + c, [a - b - c, a + b - c, a - b + c + 1000], `先扣掉用水：${dec(a)}－${dec(b)}＝${dec(a - b)}；再加補充量：${dec(a - b)}＋${dec(c)}＝${dec(a - b + c)} 公升。`, '情境｜水量增減', dec);
    a = 500000 + t * 100000; b = 178650 + t * 12570; c = 96370 + t * 8530;
    number(d, `小安帶 ${dec(a)} 元，買材料花 ${dec(b)} 元，再買工具花 ${dec(c)} 元。剩下多少元？`, a - b - c, [a - b + c, a - b - c + 10000, a - b - c - 1000], `先算總花費：${dec(b)}＋${dec(c)}＝${dec(b + c)}；再算 ${dec(a)}－${dec(b + c)}＝${dec(a - b - c)} 元。`, '情境｜購物找零', dec);
    a = 18000 + t * 3500; b = 4675 + t * 389; c = 5838 + t * 427;
    number(d, `一捲緞帶長 ${dec(a)} 公尺，先剪下 ${dec(b)} 公尺，再剪下 ${dec(c)} 公尺。還剩幾公尺？`, a - b - c, [a - b + c, a - b - c + 1000, b + c], `剪掉的總長為 ${dec(b)}＋${dec(c)}＝${dec(b + c)}；剩下 ${dec(a)}－${dec(b + c)}＝${dec(a - b - c)} 公尺。`, '情境｜長度分配', dec);
    a = 23785 + t * 2683; b = 18496 + t * 1987; c = 50000 + t * 5000;
    number(d, `貨車最多可載 ${dec(c)} 公斤。已放入 ${dec(a)} 公斤與 ${dec(b)} 公斤的貨物，還可載幾公斤？`, c - a - b, [c - a + b, c - a - b + 1000, a + b], `目前載重為 ${dec(a)}＋${dec(b)}＝${dec(a + b)}；可再載 ${dec(c)}－${dec(a + b)}＝${dec(c - a - b)} 公斤。`, '情境｜載重餘額', dec);
    a = 12685 + t * 1473; b = 8476 + t * 938; c = 5729 + t * 817;
    number(d, `單車活動第一段騎 ${dec(a)} 公里，第二段比第一段少 ${dec(b)} 公里，第三段騎 ${dec(c)} 公里。全程幾公里？`, a + (a - b) + c, [a + b + c, a - b + c, a + (a - b) + c + 1000], `第二段為 ${dec(a)}－${dec(b)}＝${dec(a - b)} 公里；全程 ${dec(a)}＋${dec(a - b)}＋${dec(c)}＝${dec(a + (a - b) + c)} 公里。`, '情境｜分段路程', dec);
  }

  const f = unit('ma-2', '第二單元｜因數與公因數', '用因數、最大公因數解決分組、切割與鋪排問題。', '五上康軒第二單元：因數與公因數');
  for (let t = 0; t < 3; t++) {
    let n = [72, 108, 120][t], fs = factors(n);
    number(f, `${n} 共有幾個正因數？`, fs.length, [fs.length - 2, fs.length + 2, fs.length - 1], `${n} 的正因數為 ${fs.join('、')}，共有 ${fs.length} 個。可由乘積配對逐組找出，避免重複。`, '列舉因數');
    n = [84, 126, 150][t]; let good = [14, 21, 25][t];
    add(f, `下列哪個數是 ${n} 的因數？`, good, [good + 1, good + 2, good + 3].filter(x => n % x !== 0).concat([n - 1, n - 2, n - 3]).filter(x => n % x !== 0), `${n}÷${good}＝${n / good}，沒有餘數，所以 ${good} 是 ${n} 的因數；其餘選項都不能整除 ${n}。`, '因數整除判斷');
    let lo = [6, 9, 12][t], hi = [9, 12, 16][t]; n = [72, 90, 156][t];
    const eligible = factors(n).filter(x => x > lo && x < hi);
    if (eligible.length !== 1) throw new Error('因數區間不唯一');
    number(f, `${n} 的某個因數大於 ${lo} 且小於 ${hi}，這個因數是多少？`, eligible[0], [lo + 1, hi - 1, hi - 2, lo + 2], `先找 ${n} 的正因數：${factors(n).join('、')}。其中大於 ${lo} 且小於 ${hi} 的只有 ${eligible[0]}。`, '因數與範圍');
    let a = [84, 126, 144][t], b = [126, 168, 216][t], g = gcd(a, b);
    number(f, `${a} 和 ${b} 的最大公因數是多少？`, g, [g / 2, g * 2, g + 6], `${a}＝${g}×${a / g}，${b}＝${g}×${b / g}；${a / g} 和 ${b / g} 互質，所以最大公因數為 ${g}。`, '最大公因數');
    a = [96, 108, 180][t]; b = [144, 180, 252][t]; g = gcd(a, b); fs = factors(g);
    number(f, `${a} 和 ${b} 一共有幾個正公因數？`, fs.length, [fs.length - 1, fs.length + 2, g], `先找最大公因數 ${g}，再列出 ${g} 的正因數：${fs.join('、')}。這些就是兩數的公因數，共 ${fs.length} 個。`, '公因數的個數');
    a = [84, 108, 144][t]; b = [126, 180, 216][t]; g = gcd(a, b);
    number(f, `老師有 ${a} 枝鉛筆和 ${b} 個橡皮擦，要全部分成最多個相同禮包，每包的鉛筆數相同、橡皮擦數也相同。最多可分幾包？`, g, [g / 2, g * 2, gcd(a, b) + 6], `包數必須同時整除 ${a} 和 ${b}，所以取最大公因數 ${g}。每包有 ${a / g} 枝鉛筆與 ${b / g} 個橡皮擦。`, '情境｜最多相同禮包');
    a = [168, 192, 225][t]; b = [120, 144, 150][t]; g = gcd(a, b);
    number(f, `長方形牆面長 ${a} 公分、寬 ${b} 公分，用相同且最大的正方形磁磚完全鋪滿，不切割磁磚。每片磁磚的邊長幾公分？`, g, [g / 2, g * 2, g + 12], `邊長必須同時整除長與寬；${a} 和 ${b} 的最大公因數是 ${g}，所以最大邊長是 ${g} 公分。可鋪成 ${a / g}×${b / g} 片。`, '情境｜最大正方形');
    a = [156, 180, 210][t]; b = [234, 252, 294][t]; g = gcd(a, b);
    number(f, `兩條彩帶分別長 ${a} 公分與 ${b} 公分，全部剪成等長且盡可能長的小段。總共剪成幾段？`, a / g + b / g, [g, a / g, a / g + b / g + 1], `最長小段為最大公因數 ${g} 公分。兩條分別剪成 ${a / g} 段與 ${b / g} 段，合計 ${a / g}＋${b / g}＝${a / g + b / g} 段。`, '情境｜等長切割段數');
    a = [72, 96, 120][t]; b = [120, 160, 192][t]; g = gcd(a, b);
    number(f, `有 ${a} 位男生和 ${b} 位女生，全部分成最多個相同小隊，每隊男生數相同、女生數也相同。每隊一共幾人？`, a / g + b / g, [g, a / g + b / g + 1, a / g + b / g - 1], `最多分成 ${g} 隊。每隊男生 ${a}÷${g}＝${a / g} 人，女生 ${b}÷${g}＝${b / g} 人，共 ${a / g + b / g} 人。`, '情境｜分隊後每隊人數');
    a = [96, 126, 144][t]; b = [144, 210, 240][t]; g = gcd(a, b);
    const limit = [20, 30, 40][t], valid = factors(g).filter(x => x <= limit), groups = Math.max(...valid);
    number(f, `花店有 ${a} 朵紅花與 ${b} 朵黃花，要用完全部花做成相同花束，且花束數不得超過 ${limit} 束。最多可做幾束？`, groups, [g, groups + 1, groups - 1, groups * 2], `花束數須是 ${a}、${b} 的公因數。最大公因數為 ${g}，它的因數為 ${factors(g).join('、')}；其中不超過 ${limit} 的最大值是 ${groups}，所以最多 ${groups} 束。`, '情境｜有限制的平均分配');
  }

  const m = unit('ma-3', '第三單元｜倍數與公倍數', '找出共同週期、最少數量與符合條件的倍數。', '五上康軒第三單元：倍數與公倍數');
  for (let t = 0; t < 3; t++) {
    let a = [18, 24, 28][t], b = [24, 36, 42][t], l = lcm(a, b);
    number(m, `${a} 和 ${b} 的最小公倍數是多少？`, l, [a * b, gcd(a, b), l * 2], `先找最大公因數 ${gcd(a, b)}，再算 ${a}×${b}÷${gcd(a, b)}＝${l}，所以最小公倍數為 ${l}。`, '最小公倍數');
    a = [18, 24, 35][t]; let lower = [250, 410, 600][t], v = Math.ceil(lower / a) * a;
    number(m, `大於或等於 ${lower} 的 ${a} 的倍數中，最小的是多少？`, v, [v - a, v + a, lower], `${lower}÷${a}＝${Math.floor(lower / a)} 餘 ${lower % a}，所以取下一個整數倍：${a}×${Math.ceil(lower / a)}＝${v}。`, '指定範圍的倍數');
    a = [12, 15, 18][t]; b = [18, 20, 24][t]; l = lcm(a, b); let upper = [300, 500, 650][t], count = Math.floor(upper / l);
    number(m, `從 1 到 ${upper}（包含 ${upper}）之間，${a} 和 ${b} 的正公倍數共有幾個？`, count, [count + 1, count - 1, Math.floor(upper / a)], `最小公倍數為 ${l}；正公倍數為 ${l}×1、${l}×2……。${upper}÷${l} 的整數商是 ${count}，所以共有 ${count} 個。`, '範圍內公倍數個數');
    a = [16, 21, 27][t]; b = [24, 28, 36][t]; l = lcm(a, b);
    add(m, `下列哪個數同時是 ${a} 和 ${b} 的倍數？`, l * 3, [l * 3 + a, l * 3 - b, l * 3 + 1].filter(x => x % a !== 0 || x % b !== 0).concat([l * 3 + 2, l * 3 + 3]).filter(x => x % a !== 0 || x % b !== 0), `${l * 3}÷${a}＝${l * 3 / a}，${l * 3}÷${b}＝${l * 3 / b}，兩次都整除，所以 ${l * 3} 是兩數的公倍數。`, '公倍數整除判斷');
    a = [8, 12, 15][t]; b = [12, 18, 20][t]; let c = [18, 30, 24][t]; l = lcm(lcm(a, b), c);
    number(m, `${a}、${b}、${c} 三個數的最小公倍數是多少？`, l, [l / 2, l * 2, a * b * c], `先算 ${a} 和 ${b} 的最小公倍數 ${lcm(a, b)}，再和 ${c} 求最小公倍數，得到 ${l}。`, '三數最小公倍數');
    a = [18, 24, 28][t]; b = [30, 36, 42][t]; l = lcm(a, b);
    const startHour = 8, hour = startHour + Math.floor(l / 60), minute = l % 60, time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    add(m, `兩個提醒器分別每 ${a} 分鐘與每 ${b} 分鐘響一次。上午 08:00 同時響過，下一次同時響是幾點？`, time, [`${String(startHour + Math.floor(a / 60)).padStart(2, '0')}:${String(a % 60).padStart(2, '0')}`, `${String(hour + 1).padStart(2, '0')}:${String(minute).padStart(2, '0')}`, `${String(hour).padStart(2, '0')}:${String((minute + 10) % 60).padStart(2, '0')}`], `兩個提醒器再次同時響要等最小公倍數 ${l} 分鐘，也就是 ${Math.floor(l / 60)} 小時 ${l % 60} 分。08:00 加上這段時間為 ${time}。`, '情境｜共同提醒時間');
    a = [16, 18, 24][t]; b = [24, 30, 36][t]; l = lcm(a, b); upper = [300, 400, 500][t]; count = Math.floor(upper / l);
    number(m, `甲、乙公車分別每 ${a} 分鐘、每 ${b} 分鐘發車。兩車在 07:00 同時發車，之後 ${upper} 分鐘內（包含終點，排除 07:00）又同時發車幾次？`, count, [count + 1, count - 1, Math.floor(upper / a)], `每隔 ${l} 分鐘會同時發車。排除開始時刻後，只算 ${l}、${l * 2}……分鐘，${upper}÷${l} 的整數商是 ${count}，所以再同時發車 ${count} 次。`, '情境｜同時發車次數');
    a = [18, 24, 28][t]; b = [30, 40, 42][t]; l = lcm(a, b);
    number(m, `A 款貼紙每包 ${a} 張，B 款每包 ${b} 張。兩款都只能整包買，買到的 A、B 張數要一樣且都大於 0。最少共買幾張貼紙？`, l * 2, [l, a + b, l * 2 + a + b], `每款的最少相同張數是 ${a} 和 ${b} 的最小公倍數 ${l}；兩款合計 ${l}＋${l}＝${l * 2} 張。`, '情境｜整包購買總量');
    a = [24, 30, 36][t]; b = [40, 42, 48][t]; l = lcm(a, b); lower = [500, 600, 700][t]; v = Math.ceil(lower / l) * l;
    number(m, `佈置一條長度至少 ${lower} 公分的直線，可以剛好排滿每段 ${a} 公分的紙條，也能剛好排滿每段 ${b} 公分的紙條。這條線最短幾公分？`, v, [l, v - l, v + l], `長度必須是 ${a}、${b} 的公倍數，最小公倍數為 ${l}。依序比較它的倍數，第一個不小於 ${lower} 的是 ${v} 公分。`, '情境｜至少長度的共同倍數');
    a = [6, 8, 10][t]; b = [8, 12, 15][t]; c = [15, 18, 24][t]; l = lcm(lcm(a, b), c);
    number(m, `三盞裝飾燈分別每 ${a} 秒、${b} 秒、${c} 秒閃一次。現在同時閃亮，至少再過幾秒才會三盞又同時閃亮？`, l, [l / 2, l * 2, a + b + c], `先求 ${a} 和 ${b} 的最小公倍數 ${lcm(a, b)}，再與 ${c} 求最小公倍數，結果為 ${l} 秒。這是三個週期首次重合的時間。`, '情境｜三個共同週期');
  }

  const r = unit('ma-4', '第四單元｜擴分、約分與通分', '理解等值分數，練習最簡分數、最小公分母及大小比較。', '五上康軒第四單元：擴分、約分與通分');
  for (let t = 0; t < 3; t++) {
    let n = [7, 11, 13][t], den = [12, 18, 20][t], k = [5, 4, 6][t];
    number(r, `將 ${n}/${den} 擴分成分母為 ${den * k} 的等值分數，分子應是多少？`, n * k, [n + k, n * k - 1, n * k + k], `分母由 ${den} 乘以 ${k} 變成 ${den * k}，分子也要乘以 ${k}：${n}×${k}＝${n * k}，所以是 ${n * k}/${den * k}。`, '擴分求分子');
    n = [84, 126, 144][t]; den = [126, 210, 252][t]; const g = gcd(n, den);
    add(r, `把 ${n}/${den} 約成最簡分數，答案是？`, fraction(n, den), [fraction(n + 1, den), fraction(n - 1, den), fraction(n, den + 1)], `分子、分母的最大公因數是 ${g}，同除以 ${g}：${n}÷${g}＝${n / g}，${den}÷${g}＝${den / g}，得到 ${fraction(n, den)}。`, '最簡分數');
    let a = [8, 12, 18][t], b = [15, 35, 25][t];
    number(r, `把 ${[3, 5, 7][t]}/${a} 和 ${[7, 9, 11][t]}/${b} 通分，最小公分母是多少？`, lcm(a, b), [a * b, a + b, Math.max(a, b), lcm(a, b) * 2], `最小公分母就是 ${a} 和 ${b} 的最小公倍數：${a}×${b}÷${gcd(a, b)}＝${lcm(a, b)}。`, '最小公分母');
    const pairs = [[3, 8, 5, 12], [4, 9, 5, 11], [7, 15, 9, 20]], [an, ad, bn, bd] = pairs[t];
    const sign = an * bd < bn * ad ? '＜' : an * bd > bn * ad ? '＞' : '＝', common = lcm(ad, bd);
    add(r, `比較 ${an}/${ad} ○ ${bn}/${bd}，○ 應填哪個符號？`, sign, ['＜', '＞', '＝', '無法判斷'].filter(x => x !== sign), `通分成 ${an * (common / ad)}/${common} 和 ${bn * (common / bd)}/${common}。同分母時比分子，所以 ${an}/${ad} ${sign} ${bn}/${bd}。`, '異分母分數比較');
    n = [5, 7, 11][t]; den = [14, 18, 24][t]; k = [3, 4, 5][t];
    add(r, `下列哪個分數與 ${n}/${den} 相等？`, `${n * k}/${den * k}`, [`${n * k}/${den * k + 1}`, `${n * k + 1}/${den * k}`, `${n + k}/${den + k}`], `分子、分母同乘以 ${k}，分數大小不變：${n}/${den}＝${n * k}/${den * k}。只改分子、只改分母，或同加一個數，都不是擴分。`, '等值分數辨識');
    const race = [[5, 8, 7, 12], [7, 10, 11, 15], [8, 15, 5, 9]], [rn, rd, sn, sd] = race[t];
    const winner = rn * sd > sn * rd ? '小明' : '小華', rc = lcm(rd, sd);
    add(r, `同一條跑道，小明已跑全程的 ${rn}/${rd}，小華已跑全程的 ${sn}/${sd}。誰跑得較遠？`, winner, ['小明', '小華', '兩人一樣遠', '分母不同就不能比較'].filter(x => x !== winner), `兩人以相同全程為基準。通分為 ${rn * rc / rd}/${rc} 和 ${sn * rc / sd}/${rc}，比較分子可知 ${winner} 跑得較遠。`, '情境｜相同基準的進度比較');
    let total = [120, 144, 180][t], used = [84, 108, 126][t];
    add(r, `一箱有 ${total} 瓶果汁，活動用了 ${used} 瓶。用掉的瓶數占整箱的幾分之幾？請選最簡分數。`, fraction(used, total), [fraction(total - used, total), fraction(used - 1, total), fraction(used + 1, total)], `用掉的比例是 ${used}/${total}。分子、分母同除以最大公因數 ${gcd(used, total)}，得到 ${fraction(used, total)}。`, '情境｜部分與全體約分');
    n = [7, 11, 13][t]; den = [12, 15, 18][t]; total = [48, 60, 72][t];
    number(r, `禮堂共有 ${total} 個座位，已坐滿全部座位的 ${n}/${den}。已有幾個座位坐了人？`, n * total / den, [n, total - n * total / den, n * total / den + total / den], `把 ${n}/${den} 擴分成分母 ${total}：分子、分母同乘以 ${total / den}，得到 ${n * total / den}/${total}，所以已有 ${n * total / den} 個座位坐人。`, '情境｜等值分數換算座位');
    a = [12, 15, 18][t]; b = [20, 24, 30][t]; n = [7, 11, 13][t]; let other = [9, 13, 17][t], cm = lcm(a, b);
    number(r, `兩塊同樣大的披薩，甲吃了 ${n}/${a}，乙吃了 ${other}/${b}。用最小公分母通分後，甲的分子是多少？`, n * cm / a, [n, n * cm / a + cm / a, other * cm / b], `最小公分母是 ${a} 和 ${b} 的最小公倍數 ${cm}。甲的分母乘以 ${cm / a}，分子也要乘以 ${cm / a}，得到 ${n * cm / a}/${cm}。`, '情境｜通分後的分子');
    const between = [
      { lo: '1/2', hi: '3/4', correct: '5/8', wrong: ['2/5', '4/5', '1/4'], detail: '通分成十六分之一：1/2＝8/16，5/8＝10/16，3/4＝12/16，所以 8/16＜10/16＜12/16。' },
      { lo: '2/5', hi: '3/5', correct: '1/2', wrong: ['1/3', '2/3', '3/4'], detail: '通分成十分之一：2/5＝4/10，1/2＝5/10，3/5＝6/10，所以 4/10＜5/10＜6/10。' },
      { lo: '2/3', hi: '5/6', correct: '3/4', wrong: ['1/2', '3/5', '7/8'], detail: '通分成十二分之一：2/3＝8/12，3/4＝9/12，5/6＝10/12，所以 8/12＜9/12＜10/12。' }
    ][t];
    add(r, `量杯刻度以 1 公升為整體，水量要大於 ${between.lo} 公升且小於 ${between.hi} 公升。下列哪個水量符合？`, between.correct, between.wrong, between.detail, '情境｜分數區間判斷');
  }

  const o = unit('ma-5', '整數四則運算｜基礎加強', '先乘除、後加減，括號優先；練習三步計算與生活應用。', '提前練習：五上康軒第八單元「整數四則運算」');
  for (let t = 0; t < 3; t++) {
    let a = 347 + t * 68, b = 258 + t * 47, c = 16 + t * 3, e = 1180 + t * 265, ans = (a + b) * c - e;
    number(o, `（${a}＋${b}）×${c}－${e}＝？`, ans, [a + b * c - e, (a + b) * c + e, ans - 100], `先算括號：${a}＋${b}＝${a + b}；再乘 ${c} 得 ${ (a + b) * c}；最後減 ${e} 得 ${ans}。`, '三步四則｜括號優先');
    b = 24 + t * 3; let q = 48 + t * 7; a = b * q; c = 18 + t * 3; e = 375 + t * 98; ans = a / b * c + e;
    number(o, `${a}÷${b}×${c}＋${e}＝？`, ans, [a / (b * c) + e, a / b * (c + e), ans + 100], `乘除同級由左到右：${a}÷${b}＝${q}，${q}×${c}＝${q * c}；最後加 ${e}，得到 ${ans}。`, '三步四則｜乘除由左到右');
    a = 126 + t * 13; b = 37 + t * 4; c = 100 - b; ans = a * (b + c);
    number(o, `${a}×${b}＋${a}×${c}＝？（試著用簡便算法）`, ans, [a * b + c, a * (b + c - 1), a * (b + c + 1)], `兩項有共同乘數 ${a}，可寫成 ${a}×（${b}＋${c}）＝${a}×100＝${ans}。`, '分配律簡算');
    a = 168 + t * 37; b = 24 + t * 6; c = 36 + t * 5; ans = b * c - a;
    number(o, `（□＋${a}）÷${b}＝${c}，□ 是多少？`, ans, [b * c + a, c + a - b, ans + b], `逆推：□＋${a}＝${c}×${b}＝${c * b}，所以 □＝${c * b}－${a}＝${ans}。`, '逆推未知數');
    a = 9600 + t * 2300; b = 214 + t * 31; c = 146 + t * 29; e = 18 + t * 2; ans = a - (b + c) * e;
    number(o, `${a}－［（${b}＋${c}）×${e}］＝？`, ans, [a - b - c * e, a - b + c * e, ans + 1000], `先算內括號：${b}＋${c}＝${b + c}；再算 ${b + c}×${e}＝${(b + c) * e}；最後 ${a}－${(b + c) * e}＝${ans}。`, '多層括號');
    a = 18000 + t * 4200; b = 185 + t * 27; c = 48 + t * 6; e = 1260 + t * 380; ans = a - b * c - e;
    number(o, `班級有 ${a} 元，買 ${c} 本每本 ${b} 元的筆記本，再付運費及包材費 ${e} 元。還剩多少元？`, ans, [a - b - c - e, a - b * c + e, ans + b], `筆記本共 ${b}×${c}＝${b * c} 元；剩款 ${a}－${b * c}－${e}＝${ans} 元。`, '情境｜採購預算');
    a = 38 + t * 4; b = 125 + t * 15; c = 3 + t; e = 210 + t * 20; ans = a * b + c * e;
    number(o, `校外教學有 ${a} 位學生，每人門票 ${b} 元；另有 ${c} 位家長，每人門票 ${e} 元。門票總共多少元？`, ans, [(a + c) * b, (a + c) * e, ans + b], `學生票 ${a}×${b}＝${a * b} 元；家長票 ${c}×${e}＝${c * e} 元；合計 ${a * b}＋${c * e}＝${ans} 元。`, '情境｜兩種單價合計');
    a = 36 + t * 8; b = 24 + t * 6; c = 175 + t * 23; e = 2800 + t * 560; ans = a * b * c - e;
    number(o, `工廠出貨 ${a} 箱，每箱 ${b} 個零件，每個售 ${c} 元。扣除總運費 ${e} 元後，實收多少元？`, ans, [a * b * c + e, a * b + c - e, ans - a * b], `零件共 ${a}×${b}＝${a * b} 個；貨款 ${a * b}×${c}＝${a * b * c} 元；扣運費後為 ${ans} 元。`, '情境｜三步乘加減');
    a = 48 + t * 7; b = 36 + t * 5; c = 17 + t * 4; e = 125 + t * 25; ans = (a - c) * b - e;
    number(o, `倉庫原有 ${a} 箱飲料，每箱 ${b} 瓶。先送出 ${c} 箱，又零售 ${e} 瓶。倉庫還有多少瓶？`, ans, [(a - c) * b + e, a * b - c - e, ans + b], `整箱剩 ${a}－${c}＝${a - c} 箱；有 ${(a - c) * b} 瓶；再減零售 ${e} 瓶，剩 ${ans} 瓶。`, '情境｜整箱與零售');
    a = 168 + t * 24; b = 7 + t; c = 9 + t; e = 35 + t * 6; ans = a / b * c + e;
    number(o, `自行車隊前 ${b} 天共騎 ${a} 公里，每天距離相同。接著 ${c} 天仍照原本每天的距離騎，最後再多騎 ${e} 公里。只算「接著 ${c} 天加最後一段」，共幾公里？`, ans, [a + e, (b + c) * (a / b) + e, ans - e], `原本每天 ${a}÷${b}＝${a / b} 公里；接著 ${c} 天共 ${a / b}×${c}＝${a / b * c} 公里；再加 ${e}，共 ${ans} 公里。`, '情境｜先求單位量再計算');
  }

  const w = unit('ma-6', '多步驟生活應用｜綜合加強', '讀出已知條件，選對運算，逐步解決實際問題。', '原創綜合：小數、因倍數、分數與整數四則');
  for (let t = 0; t < 3; t++) {
    let students = [48, 54, 60][t], each = [285, 320, 345][t], ticket = [125, 140, 155][t], bus = students * (each - ticket) + 2400, grant = 2400;
    number(w, `校外教學有 ${students} 位學生，遊覽車共 ${bus} 元，每人門票 ${ticket} 元，學校補助 ${grant} 元。其餘由學生平均分攤，每人付多少元？`, each, [(bus + students * ticket) / students, bus / students, each + ticket], `門票共 ${students}×${ticket}＝${students * ticket} 元；扣補助後總費用 ${bus}＋${students * ticket}－${grant}＝${students * each} 元；平均每人 ${students * each}÷${students}＝${each} 元。`, '情境｜費用分攤');
    let boxes = 18 + t * 4, perBox = 24 + t * 6, grams = 125 + t * 25, packaging = 2160 + t * 480, net = boxes * perBox * grams;
    number(w, `一批餅乾有 ${boxes} 箱，每箱 ${perBox} 包，每包餅乾淨重 ${grams} 公克。全部包裝材料重 ${packaging} 公克。連包裝總重幾公克？`, net + packaging, [net - packaging, boxes * perBox + grams + packaging, net + packaging + grams], `總包數 ${boxes}×${perBox}＝${boxes * perBox} 包；餅乾淨重 ${boxes * perBox}×${grams}＝${net} 公克；加包裝得 ${net + packaging} 公克。`, '情境｜箱、包與重量');
    let capacity = 12000 + t * 2400, initial = 8750 + t * 1800, usePerDay = 675 + t * 95, days = 4 + t, refill = 1600 + t * 350, now = initial - usePerDay * days + refill;
    number(w, `水塔容量 ${capacity} 公升，原有 ${initial} 公升。連續 ${days} 天每天用 ${usePerDay} 公升，之後補入 ${refill} 公升。距離裝滿還差幾公升？`, capacity - now, [now, capacity - initial + usePerDay * days + refill, capacity - now + usePerDay], `用水共 ${usePerDay}×${days}＝${usePerDay * days} 公升；現有 ${initial}－${usePerDay * days}＋${refill}＝${now} 公升；還差 ${capacity}－${now}＝${capacity - now} 公升。`, '情境｜容量與缺額');
    let pages = [456, 540, 648][t], read = [28, 32, 36][t], firstDays = 6, remainingDays = [8, 6, 9][t], remaining = pages - read * firstDays, perDay = remaining / remainingDays;
    number(w, `一本書有 ${pages} 頁，小如先連續 ${firstDays} 天每天讀 ${read} 頁。剩下的要在 ${remainingDays} 天內每天讀一樣多讀完，每天應讀幾頁？`, perDay, [pages / remainingDays, perDay + read, perDay - 1], `已讀 ${read}×${firstDays}＝${read * firstDays} 頁；剩 ${pages}－${read * firstDays}＝${remaining} 頁；每天 ${remaining}÷${remainingDays}＝${perDay} 頁。`, '情境｜閱讀進度逆推');
    let correct = 24 + t * 4, wrong = 6 + t, scorePer = 8 + t * 2, penalty = 3 + t, bonus = 35 + t * 15, score = correct * scorePer - wrong * penalty + bonus;
    number(w, `闖關答對一題得 ${scorePer} 分，答錯一題扣 ${penalty} 分。小宇答對 ${correct} 題、答錯 ${wrong} 題，另獲全勤加分 ${bonus} 分。他最後得幾分？`, score, [correct * scorePer + wrong * penalty + bonus, correct * scorePer - wrong * penalty, score + penalty], `答對得 ${correct}×${scorePer}＝${correct * scorePer} 分；答錯扣 ${wrong}×${penalty}＝${wrong * penalty} 分；最後 ${correct * scorePer}－${wrong * penalty}＋${bonus}＝${score} 分。`, '情境｜得分、扣分與加分');
    let length = [240, 300, 360][t], width = [168, 210, 252][t], edge = gcd(length, width), tileCount = length / edge * (width / edge), spare = 5 + t * 2;
    number(w, `長 ${length} 公分、寬 ${width} 公分的牆面，用最大且相同的正方形磁磚不切割鋪滿。另多買 ${spare} 片備用，共要買幾片？`, tileCount + spare, [edge + spare, tileCount, tileCount + spare + 1], `最大邊長為最大公因數 ${edge} 公分；鋪滿需（${length}÷${edge}）×（${width}÷${edge}）＝${tileCount} 片；加備用 ${spare} 片，共 ${tileCount + spare} 片。`, '情境｜最大公因數與片數');
    let packA = [18, 24, 30][t], packB = [30, 36, 42][t], same = lcm(packA, packB), priceA = [85, 110, 135][t], priceB = [125, 150, 175][t], cost = same / packA * priceA + same / packB * priceB;
    number(w, `鉛筆每包 ${packA} 枝、每包 ${priceA} 元；橡皮擦每包 ${packB} 個、每包 ${priceB} 元。兩種都整包買，數量要相同且是最少的正數量。總共花幾元？`, cost, [same / packA * priceA, same / packB * priceB, cost + priceA], `最少各買最小公倍數 ${same} 個。鉛筆 ${same / packA} 包共 ${same / packA * priceA} 元；橡皮擦 ${same / packB} 包共 ${same / packB * priceB} 元；合計 ${cost} 元。`, '情境｜最小公倍數與購物');
    let total = [480, 630, 720][t], numerator = [3, 4, 5][t], denominator = [8, 9, 12][t], giveaway = [48, 56, 65][t], sold = total / denominator * numerator, left = total - sold - giveaway;
    number(w, `文具店原有 ${total} 枝鉛筆，上午賣出全部的 ${numerator}/${denominator}，下午另外送出 ${giveaway} 枝。還剩幾枝？`, left, [sold - giveaway, total - sold + giveaway, total - giveaway], `先把全部平均分成 ${denominator} 份，每份 ${total}÷${denominator}＝${total / denominator} 枝；上午售 ${total / denominator}×${numerator}＝${sold} 枝；剩 ${total}－${sold}－${giveaway}＝${left} 枝。`, '情境｜全體的幾分之幾');
    let route = 50000 + t * 7500, first = 18675 + t * 2153, second = 12786 + t * 1764, remain = route - first - second;
    number(w, `步道全長 ${dec(route)} 公里，上午走 ${dec(first)} 公里，下午比上午少走 ${dec(second)} 公里。走完上午與下午後，還剩幾公里？`, route - first - (first - second), [remain, route - first + second, route - first - (first - second) + 1000], `下午走 ${dec(first)}－${dec(second)}＝${dec(first - second)} 公里；兩段共 ${dec(first)}＋${dec(first - second)}＝${dec(first + first - second)} 公里；剩 ${dec(route - first - (first - second))} 公里。`, '情境｜比較量與剩餘路程', dec);
    let start = 135 + t * 28, earnDays = 5 + t, earn = 8 + t * 2, redeemCost = 25 + t * 5, redeemCount = 3 + t, points = start + earnDays * earn - redeemCount * redeemCost;
    number(w, `小晴原有 ${start} 點，接下來 ${earnDays} 天每天得到 ${earn} 點。之後兌換 ${redeemCount} 份禮物，每份扣 ${redeemCost} 點。現在有幾點？`, points, [start + earnDays * earn + redeemCount * redeemCost, start + earnDays - redeemCount * redeemCost, points + redeemCost], `新增 ${earnDays}×${earn}＝${earnDays * earn} 點；兌換扣 ${redeemCount}×${redeemCost}＝${redeemCount * redeemCost} 點；餘額 ${start}＋${earnDays * earn}－${redeemCount * redeemCost}＝${points} 點。`, '情境｜點數收支');
  }

  const ids = new Set();
  for (const u of units) {
    if (u.questions.length !== 30) throw new Error(`${u.id} 題數錯誤`);
    if (u.questions.filter(q => q.tag.startsWith('情境')).length < 10) throw new Error(`${u.id} 情境題不足`);
    if (new Set(u.questions.map(q => q.tag)).size < 6) throw new Error(`${u.id} 題型不足`);
    for (const q of u.questions) {
      if (ids.has(q.id) || q.options.length !== 4 || new Set(q.options).size !== 4 || !Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3 || !q.explanation) throw new Error(`題目結構錯誤：${q.id}`);
      ids.add(q.id);
    }
  }
  window.MATH_UNITS = units;
})();
