(function(){
var REDUCE = window.matchMedia ? matchMedia('(prefers-reduced-motion:reduce)').matches : false;
var STOP = {};

function el(tag, cls, txt){
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (txt != null) n.textContent = txt;
  return n;
}
function rnd(a, b){ return a + Math.random() * (b - a); }
function fmt(n, dec){
  var s = (dec ? n.toFixed(dec) : String(Math.round(n)));
  var p = s.split('.');
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return p.join('.');
}

function clock(){
  var c = {dead:false, paused:false};
  c.sleep = function(ms){
    return new Promise(function(res, rej){
      var left = ms, last = performance.now();
      (function tick(){
        if (c.dead) return rej(STOP);
        var now = performance.now();
        if (!c.paused) left -= now - last;
        last = now;
        if (left <= 0) return res();
        requestAnimationFrame(tick);
      })();
    });
  };
  c.stop = function(){ c.dead = true; };
  return c;
}

function gate(node, c){
  if (!('IntersectionObserver' in window)) return;
  var seen = true;
  var apply = function(){ c.paused = document.hidden || !seen; };
  var io = new IntersectionObserver(function(es){ seen = es[0].isIntersecting; apply(); }, {threshold:0.12});
  io.observe(node);
  document.addEventListener('visibilitychange', apply);
}

function onceVisible(node, fn){
  if (!node) return;
  if (!('IntersectionObserver' in window)) return fn();
  var io = new IntersectionObserver(function(es){
    if (!es[0].isIntersecting) return;
    io.disconnect();
    fn();
  }, {threshold:0.25, rootMargin:'0px 0px -8% 0px'});
  io.observe(node);
}

/* ------------------------------------------------------------------ hero */

var QUERIES = [{
  tab:'revenue by customer',
  lines:[
    [['kw','SELECT'],[0,' c.'],['ac','columns · customers c'],[0,'email, '],['fn','count'],[0,'(*) '],['kw','AS'],[0,' orders,']],
    [[0,'       '],['fn','sum'],[0,'(o.total_cents) / '],['num','100.0'],[0,' '],['kw','AS'],[0,' revenue']],
    [['kw','FROM'],[0,' orders o']],
    [['kw','JOIN'],[0,' customers c '],['kw','ON'],[0,' c.id = o.customer_id']],
    [['kw','WHERE'],[0,' o.placed_at > '],['fn','now'],[0,'() - '],['kw','interval'],[0,' '],['str','\'30 days\'']],
    [['kw','GROUP BY'],[0,' c.email']],
    [['kw','ORDER BY'],[0,' revenue '],['kw','DESC']]
  ],
  ghost:' LIMIT 20;',
  ghostTokens:[['kw',' LIMIT'],['num',' 20'],[0,';']],
  head:['email','orders','revenue'],
  widths:['44%','16%','20%'],
  dec:[null,0,2],
  sort:2,
  rows:[
    ['ane.etxeberria@example.com',14,4812],
    ['l.moreau@example.fr',9,3205.5],
    ['studio@kaltenbach.de',6,2970],
    ['m.rossi@example.it',11,2418.9],
    ['hello@northlab.co',3,1860],
    ['j.okafor@example.com',7,1533.2],
    ['ops@ferrytickets.eu',5,1402.75],
    ['p.svensson@example.se',4,1118]
  ],
  arrivals:[['crew@bidaia.eus',2,1275.4],['t.nakamura@example.jp',1,3940]],
  ms:41
},{
  tab:'refunds by day',
  lines:[
    [['kw','SELECT'],[0,' '],['fn','date_trunc'],[0,'('],['str','\'day\''],[0,', o.'],['ac','columns · orders o'],[0,'placed_at) '],['kw','AS'],[0,' day,']],
    [[0,'       '],['fn','count'],[0,'(*) '],['kw','FILTER'],[0,' ('],['kw','WHERE'],[0,' o.status = '],['str','\'refunded\''],[0,') '],['kw','AS'],[0,' refunds,']],
    [[0,'       '],['fn','count'],[0,'(*) '],['kw','AS'],[0,' orders']],
    [['kw','FROM'],[0,' orders o']],
    [['kw','WHERE'],[0,' o.placed_at > '],['fn','now'],[0,'() - '],['kw','interval'],[0,' '],['str','\'7 days\'']],
    [['kw','GROUP BY'],[0,' 1 '],['kw','ORDER BY'],[0,' 1 '],['kw','DESC']]
  ],
  ghost:'',
  head:['day','refunds','orders'],
  widths:['44%','16%','20%'],
  dec:[null,0,0],
  sort:null,
  rows:[
    ['2026-09-13',2,184],
    ['2026-09-12',5,311],
    ['2026-09-11',3,298],
    ['2026-09-10',1,276],
    ['2026-09-09',4,289],
    ['2026-09-08',2,241],
    ['2026-09-07',0,118]
  ],
  arrivals:[],
  ms:28
}];

var AGENT = {
  ask:'mark the pending orders older than 30 days as overdue',
  tools:['describe_table orders','sample_rows orders','run_query'],
  say:'Seven orders match, across three customers. Marking them is a write, so it is a proposal — nothing runs until you approve it.',
  sql:[
    ['kw','UPDATE'],[0,' public.orders\n   '],['kw','SET'],[0,' status = '],['str','\'overdue\''],[0,'\n '],
    ['kw','WHERE'],[0,' status = '],['str','\'pending\''],[0,'\n   '],['kw','AND'],[0,' placed_at < now() - '],
    ['kw','interval'],[0,' '],['str','\'30 days\''],[0,';']
  ]
};

function hero(win){
  var c = clock();
  gate(win, c);

  var q = function(name){ return win.querySelector('[data-el="' + name + '"]'); };
  var code = q('code'), rhead = q('rhead'), rrows = q('rrows'), ac = q('ac');
  var rcount = q('rcount'), rms = q('rms'), run = q('run'), qtab = q('qtab');
  var msgs = q('msgs'), ask = q('ask'), scount = q('scount'), spend = q('spend');
  var editor = win.querySelector('.editor');
  var rtable = rrows.closest('table');
  var browse = q('browse-rows-body');
  var browseHTML = browse.innerHTML;
  var askHTML = ask.innerHTML;

  var jtag = el('span', 'jtag');
  win.querySelector('.status .right').before(jtag);

  function seg(cls, text){
    var s = el('span', cls || null);
    s.textContent = text;
    return s;
  }

  async function typeCode(spec){
    code.textContent = '';
    var caret = el('span', 'caret hot');
    code.appendChild(caret);
    for (var i = 0; i < spec.lines.length; i++){
      if (i){ code.insertBefore(document.createTextNode('\n'), caret); }
      var ln = el('span', 'ln', String(i + 1));
      code.insertBefore(ln, caret);
      var line = spec.lines[i];
      for (var j = 0; j < line.length; j++){
        var cls = line[j][0], text = line[j][1];
        if (cls === 'ac'){ await suggest(caret, text); continue; }
        var s = seg(cls || null, '');
        code.insertBefore(s, caret);
        for (var k = 0; k < text.length; k++){
          s.textContent += text[k];
          await c.sleep(text[k] === ' ' ? rnd(5, 11) : rnd(8, 19));
        }
      }
    }
    if (spec.ghost){
      await c.sleep(300);
      var ghost = el('span', 'ghost', spec.ghost);
      code.appendChild(ghost);
      var hint = el('span', 'tab-hint', 'Tab');
      code.appendChild(hint);
      await c.sleep(1150);
      hint.remove();
      ghost.remove();
      (spec.ghostTokens || [[0, spec.ghost]]).forEach(function(t){
        code.insertBefore(seg(t[0] || null, t[1]), caret);
      });
      code.appendChild(caret);
      await c.sleep(320);
    }
    caret.classList.remove('hot');
  }

  async function suggest(caret, label){
    ac.querySelector('.ac-h').textContent = label;
    ac.hidden = false;
    ac.classList.add('in');
    ac.style.left = Math.min(caret.offsetLeft, editor.clientWidth - 210) + 'px';
    ac.style.top = (caret.offsetTop + caret.offsetHeight + 5) + 'px';
    var items = ac.querySelectorAll('li');
    await c.sleep(560);
    items[0].classList.remove('on');
    items[1].classList.add('on');
    await c.sleep(340);
    items[1].classList.remove('on');
    items[0].classList.add('on');
    await c.sleep(420);
    ac.classList.remove('in');
    ac.hidden = true;
  }

  function shape(spec){
    var cg = rtable.querySelector('colgroup');
    cg.innerHTML = '';
    spec.widths.forEach(function(w){
      var col = document.createElement('col');
      col.style.width = w;
      cg.appendChild(col);
    });
    cg.appendChild(document.createElement('col'));
    var tr = rtable.querySelector('thead tr');
    tr.innerHTML = '';
    spec.head.forEach(function(h){ tr.appendChild(el('th', null, h)); });
    tr.appendChild(el('th'));
  }

  function rowFor(spec, data){
    var tr = el('tr');
    data.forEach(function(v, i){
      var td = el('td', spec.dec[i] == null ? null : 'num');
      td.textContent = spec.dec[i] == null ? v : fmt(v, spec.dec[i]);
      tr.appendChild(td);
    });
    tr.appendChild(el('td'));
    tr._data = data.slice();
    return tr;
  }

  function flip(reorder){
    var rows = Array.prototype.slice.call(rrows.children);
    var before = rows.map(function(r){ return r.offsetTop; });
    reorder();
    rows.forEach(function(r, i){
      var d = before[i] - r.offsetTop;
      if (!d) return;
      r.classList.remove('flip');
      r.style.transform = 'translateY(' + d + 'px)';
      requestAnimationFrame(function(){
        r.classList.add('flip');
        r.style.transform = '';
      });
    });
  }

  function resort(spec){
    if (spec.sort == null) return;
    flip(function(){
      Array.prototype.slice.call(rrows.children)
        .sort(function(a, b){ return b._data[spec.sort] - a._data[spec.sort]; })
        .forEach(function(r){ rrows.appendChild(r); });
    });
  }

  async function execute(spec){
    run.classList.add('press');
    await c.sleep(220);
    run.classList.remove('press');
    rhead.classList.remove('live');
    rhead.classList.add('busy');
    rcount.textContent = 'running';
    rrows.innerHTML = '';
    var t = 0;
    for (var i = 0; i < 7; i++){
      t += rnd(3, 8);
      rms.textContent = Math.round(t) + ' ms';
      await c.sleep(40);
    }
    rhead.classList.remove('busy');
    for (var r = 0; r < spec.rows.length; r++){
      var tr = rowFor(spec, spec.rows[r]);
      tr.classList.add('rowin');
      rrows.appendChild(tr);
      rcount.textContent = (r + 1) + (r ? ' rows' : ' row');
      await c.sleep(62);
    }
    rms.textContent = spec.ms + ' ms';
    scount.textContent = spec.rows.length + ' of ' + spec.rows.length + ' rows';
  }

  async function liveTicks(spec){
    rhead.classList.add('live');
    var n = spec.rows.length;
    var pool = spec.arrivals.slice();
    for (var i = 0; i < 4; i++){
      await c.sleep(rnd(1250, 1750));
      var fresh = pool.length && i > 1 && Math.random() < 0.55;
      if (fresh){
        var data = pool.shift();
        var tr = rowFor(spec, data);
        tr.classList.add('rowin', 'rowfresh');
        rrows.appendChild(tr);
        n++;
        resort(spec);
        setTimeout(function(row){ return function(){ row.classList.remove('rowfresh'); }; }(tr), 2200);
      } else {
        var rows = Array.prototype.slice.call(rrows.children);
        var pick = rows[Math.floor(rnd(0, Math.min(rows.length, 4)))];
        var ci = spec.sort == null ? 2 : spec.sort;
        var step = spec.dec[ci] ? rnd(40, 260) : 1;
        pick._data[ci] += step;
        pick.children[ci].textContent = fmt(pick._data[ci], spec.dec[ci]);
        pick.children[ci].classList.remove('bump');
        void pick.children[ci].offsetWidth;
        pick.children[ci].classList.add('bump');
        if (spec.sort != null && spec.dec[1] === 0 && ci !== 1){
          pick._data[1] += 1;
          pick.children[1].textContent = fmt(pick._data[1], 0);
        }
        resort(spec);
      }
      rcount.textContent = n + ' rows';
      rms.textContent = Math.round(rnd(18, 52)) + ' ms';
      scount.textContent = n + ' of ' + n + ' rows';
    }
    await c.sleep(600);
    rhead.classList.remove('live');
  }

  async function typeInto(node, text, lo, hi){
    node.textContent = '';
    for (var i = 0; i < text.length; i++){
      node.textContent += text[i];
      await c.sleep(text[i] === ' ' ? rnd(8, 18) : rnd(lo, hi));
    }
  }

  async function agentAct(){
    win.dataset.state = 'agent';
    scount.textContent = '16 of 1,248 rows';
    await c.sleep(650);
    msgs.innerHTML = '';
    ask.innerHTML = '';
    var typed = el('span');
    ask.appendChild(typed);
    ask.appendChild(el('span', 'caret'));
    await typeInto(typed, AGENT.ask, 16, 34);
    await c.sleep(420);
    ask.innerHTML = askHTML;

    var u = el('div', 'u', AGENT.ask);
    msgs.appendChild(u);
    await c.sleep(420);

    var a = el('div', 'a');
    msgs.appendChild(a);
    var think = el('div', 'think');
    think.innerHTML = '<i></i><i></i><i></i>';
    a.appendChild(think);
    await c.sleep(900);
    think.remove();

    var tools = el('div', 'tools');
    a.appendChild(tools);
    for (var i = 0; i < AGENT.tools.length; i++){
      var chip = el('span', 'run', AGENT.tools[i]);
      tools.appendChild(chip);
      await c.sleep(rnd(400, 620));
      chip.className = 'done';
    }
    await c.sleep(300);

    var line = el('span');
    a.appendChild(line);
    await typeInto(line, AGENT.say, 6, 13);
    await c.sleep(320);

    var card = el('div', 'propose');
    card.innerHTML =
      '<div class="ph"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7">' +
      '<path d="M8 2l6 3v4c0 3.3-2.4 5.4-6 6-3.6-.6-6-2.7-6-6V5z"/></svg>Needs your approval<em>propose_write</em></div>';
    var pre = el('pre', 'sql');
    card.appendChild(pre);
    var acts = el('div', 'pacts');
    acts.innerHTML = '<span class="ok">Approve</span><span>Decline</span><span>Edit SQL</span>';
    card.appendChild(acts);
    var done = el('div', 'done');
    done.innerHTML = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" style="width:11px;height:11px"><path d="M3 8.5l3 3 7-7"/></svg>Approved · 7 rows written · journaled';
    card.appendChild(done);
    msgs.appendChild(card);

    for (var s = 0; s < AGENT.sql.length; s++){
      var sp = seg(AGENT.sql[s][0] || null, '');
      pre.appendChild(sp);
      var txt = AGENT.sql[s][1];
      for (var k = 0; k < txt.length; k++){
        sp.textContent += txt[k];
        await c.sleep(txt[k] === ' ' || txt[k] === '\n' ? rnd(4, 9) : rnd(7, 15));
      }
    }

    await c.sleep(850);
    acts.firstChild.classList.add('press');
    await c.sleep(200);
    card.classList.add('approved');
    await c.sleep(250);

    var pend = browse.querySelectorAll('.pill.pending');
    for (var p = 0; p < pend.length; p++){
      var cell = pend[p].closest('td');
      pend[p].className = 'pill overdue';
      pend[p].textContent = 'overdue';
      cell.classList.add('wrote');
      await c.sleep(180);
    }
    jtag.innerHTML = 'UPDATE orders · 7 rows journaled · <u>Undo ⌘Z</u>';
    jtag.classList.add('in');
    await c.sleep(2100);
  }

  async function reset(){
    win.dataset.state = 'query';
    jtag.classList.remove('in');
    browse.innerHTML = browseHTML;
    msgs.innerHTML = '';
    ask.innerHTML = askHTML;
    spend.textContent = '3 pending changes';
    await c.sleep(500);
  }

  async function loop(){
    var i = 0;
    while (true){
      var spec = QUERIES[i % QUERIES.length];
      qtab.textContent = spec.tab;
      shape(spec);
      rrows.innerHTML = '';
      rcount.textContent = '';
      rms.textContent = '';
      await c.sleep(350);
      await typeCode(spec);
      await c.sleep(250);
      await execute(spec);
      await liveTicks(spec);
      await c.sleep(500);
      await agentAct();
      await reset();
      i++;
    }
  }

  loop().catch(function(e){ if (e !== STOP) throw e; });
}

/* ------------------------------------------------- showcase micro-scenes */

function showcase(win){
  var c = null;
  var msgs = win.querySelector('[data-el="msgs"]');
  var msgsHTML = msgs ? msgs.innerHTML : '';
  var gin = win.querySelector('[data-el="gtype"]');
  var grun = win.querySelector('[data-el="grun"]');

  function play(state){
    if (c) c.stop();
    c = clock();
    gate(win, c);
    var k = c;
    (async function(){
      if (state === 'agent' && msgs){
        msgs.innerHTML = msgsHTML;
        var chips = msgs.querySelectorAll('.tools span');
        for (var i = 0; i < chips.length; i++) chips[i].className = 'run';
        await k.sleep(500);
        for (var j = 0; j < chips.length; j++){
          await k.sleep(460);
          chips[j].className = 'done';
        }
      }
      if (state === 'guard' && gin && grun){
        grun.classList.remove('armed');
        var body = gin.firstChild;
        body.textContent = '';
        await k.sleep(700);
        var word = 'orders';
        for (var n = 0; n < word.length; n++){
          body.textContent += word[n];
          await k.sleep(150);
        }
        await k.sleep(250);
        grun.classList.add('armed');
      }
    })().catch(function(e){ if (e !== STOP) throw e; });
  }

  var last = win.dataset.state;
  play(last);
  new MutationObserver(function(){
    if (win.dataset.state === last) return;
    last = win.dataset.state;
    play(last);
  }).observe(win, {attributes:true, attributeFilter:['data-state']});
}

/* ------------------------------------------------------------ terminal */

var TERM = [
  ['p','$ '],['','claude mcp add taula -- taula-mcp\n'],
  ['g','Added stdio MCP server taula\n\n'],
  ['p','> '],['','which tables reference customers?\n'],
  ['c','  list_connections · list_tables · describe_table\n'],
  ['','  orders.customer_id, invoices.customer_id,\n  support_tickets.customer_id → customers.id\n\n'],
  ['p','> '],['','how many orders shipped last week?\n'],
  ['c','  query (read-only gate passed · 2,000 row cap)\n'],
  ['','  2,481 rows in orders where status = \'shipped\'\n  and shipped_at ≥ 2026-09-01\n']
];

function terminal(node){
  var c = clock();
  gate(node, c);
  node.setAttribute('aria-hidden', 'true');
  node.textContent = '';
  var caret = el('span', 'tcaret');
  node.appendChild(caret);
  (async function(){
    for (var i = 0; i < TERM.length; i++){
      var cls = TERM[i][0], text = TERM[i][1];
      var s = el('span', cls || null, '');
      node.insertBefore(s, caret);
      for (var j = 0; j < text.length; j++){
        s.textContent += text[j];
        await c.sleep(text[j] === '\n' ? rnd(160, 320) : (cls === 'p' ? 40 : rnd(6, 20)));
      }
    }
  })().catch(function(e){ if (e !== STOP) throw e; });
}

/* ---------------------------------------------------------- gate rows */

function gateDemo(node){
  var c = clock();
  var rows = node.querySelectorAll('.gate-row');
  (async function(){
    for (var i = 0; i < rows.length; i++){
      await c.sleep(i ? 620 : 400);
      rows[i].classList.add('judged');
    }
  })().catch(function(e){ if (e !== STOP) throw e; });
}

/* --------------------------------------------------------- loop rail */

function loopRail(node){
  var c = clock();
  gate(node, c);
  var nodes = node.querySelectorAll('.node');
  if (!nodes.length) return;
  (async function(){
    var i = 0;
    while (true){
      nodes.forEach(function(n){ n.classList.remove('on'); });
      nodes[i % nodes.length].classList.add('on');
      await c.sleep(1500);
      i++;
    }
  })().catch(function(e){ if (e !== STOP) throw e; });
}

/* ------------------------------------------------------- mini demos */

function demoGhost(node){
  var c = clock();
  gate(node, c);
  (async function(){
    while (true){
      node.innerHTML = '<span class="lbl">Ghost text · Tab accepts</span>';
      var body = el('span');
      node.appendChild(body);
      var caret = el('span', 'caret');
      node.appendChild(caret);
      var parts = [['kw','SELECT'],[0,' * '],['kw','FROM'],[0,' orders\n'],['kw','WHERE'],[0,' status = '],['str','\'pending\'']];
      for (var i = 0; i < parts.length; i++){
        var s = el('span', parts[i][0] || null, '');
        body.appendChild(s);
        var t = parts[i][1];
        for (var j = 0; j < t.length; j++){ s.textContent += t[j]; await c.sleep(rnd(18, 40)); }
      }
      await c.sleep(600);
      var ghost = el('span', 'ghost', '\n  AND placed_at < now() - interval \'30 days\'');
      body.appendChild(ghost);
      await c.sleep(1700);
      ghost.className = '';
      await c.sleep(2600);
    }
  })().catch(function(e){ if (e !== STOP) throw e; });
}

function demoRewrite(node){
  var c = clock();
  gate(node, c);
  (async function(){
    while (true){
      node.innerHTML = '<span class="lbl">⌘I · rewrite the selection</span>';
      var line = el('span', '', '');
      node.appendChild(line);
      var caret = el('span', 'caret');
      node.appendChild(caret);
      await c.sleep(500);
      var instr = 'count distinct customers instead';
      for (var i = 0; i < instr.length; i++){ line.textContent += instr[i]; await c.sleep(rnd(22, 46)); }
      caret.remove();
      await c.sleep(700);
      var diff = el('div');
      diff.style.marginTop = '10px';
      diff.innerHTML = '<span class="was">count(*) AS orders</span>\n<span class="now">count(DISTINCT o.customer_id) AS customers</span>';
      node.appendChild(diff);
      await c.sleep(1800);
      var ok = el('div');
      ok.style.marginTop = '10px';
      ok.innerHTML = '<span class="ok">✓ Applied · ⌘Z puts it back</span>';
      node.appendChild(ok);
      await c.sleep(2600);
    }
  })().catch(function(e){ if (e !== STOP) throw e; });
}

function demoApprove(node){
  var c = clock();
  gate(node, c);
  (async function(){
    while (true){
      node.innerHTML = '<span class="lbl">propose_write · your call</span>';
      var body = el('span');
      node.appendChild(body);
      var parts = [['kw','UPDATE'],[0,' orders '],['kw','SET'],[0,' status = '],['str','\'overdue\''],[0,'\n '],['kw','WHERE'],[0,' status = '],['str','\'pending\'']];
      for (var i = 0; i < parts.length; i++){
        var s = el('span', parts[i][0] || null, '');
        body.appendChild(s);
        var t = parts[i][1];
        for (var j = 0; j < t.length; j++){ s.textContent += t[j]; await c.sleep(rnd(16, 34)); }
      }
      await c.sleep(700);
      var acts = el('div');
      acts.style.marginTop = '10px';
      acts.innerHTML = '<span class="ok" style="background:rgba(61,186,110,.18);padding:3px 9px;border-radius:6px">Approve</span>';
      node.appendChild(acts);
      await c.sleep(1600);
      var res = el('div');
      res.style.marginTop = '8px';
      res.innerHTML = '<span class="ok">✓ 7 rows · journaled · ⌘Z to undo</span>';
      node.appendChild(res);
      await c.sleep(2800);
    }
  })().catch(function(e){ if (e !== STOP) throw e; });
}

/* -------------------------------------------------------------- boot */

function boot(){
  var live = document.querySelector('.win[data-live]');
  if (live && !REDUCE) hero(live);

  var stage = document.getElementById('stage-win');
  if (stage && !REDUCE) showcase(stage);

  if (!REDUCE){
    var term = document.getElementById('mcpterm');
    if (term) onceVisible(term, function(){ terminal(term); });
    var g = document.getElementById('gatelist');
    if (g) onceVisible(g, function(){ gateDemo(g); });
    var rail = document.getElementById('looprail');
    if (rail) onceVisible(rail, function(){ loopRail(rail); });
    var d1 = document.getElementById('demo-ghost');
    if (d1) onceVisible(d1, function(){ demoGhost(d1); });
    var d2 = document.getElementById('demo-rewrite');
    if (d2) onceVisible(d2, function(){ demoRewrite(d2); });
    var d3 = document.getElementById('demo-approve');
    if (d3) onceVisible(d3, function(){ demoApprove(d3); });
  } else {
    var all = document.querySelectorAll('.gate-row');
    for (var i = 0; i < all.length; i++) all[i].classList.add('judged');
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
