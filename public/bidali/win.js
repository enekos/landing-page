// The bidali window mockup. Decorative: rendered into every [data-bwin] host; data-state picks the scene.
(function(){
var REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

var I = {
  send:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M14.5 1.5 1.8 6.6l4.9 2 2 4.9z"/><path d="M14.5 1.5 6.7 8.6" stroke="#2A63D6" stroke-width="1.2"/></svg>',
  folder:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1.8 4.2v8h12.4V5.6H7.6L6.2 4.2z"/></svg>',
  chev:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m4 6 4 4 4-4"/></svg>',
  search:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>',
  plus:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 3v10M3 8h10"/></svg>',
  play:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/><path d="M6.6 5.6v4.8L10.4 8z" fill="currentColor"/></svg>',
  side:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.8" y="2.8" width="12.4" height="10.4" rx="1.5"/><path d="M6 2.8v10.4"/></svg>',
  split:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="1.8" y="2.8" width="12.4" height="10.4" rx="1.5"/><path d="M8 2.8v10.4"/></svg>',
  filter:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2.5 4h11M4.5 8h7M6.5 12h3"/></svg>',
  dl:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2v8M4.5 6.8 8 10.3l3.5-3.5M2.5 13.5h11"/></svg>'
};

var J = [
  ['{'],
  ['  <span class="k">"id"</span>: <span class="n">1</span>,'],
  ['  <span class="k">"name"</span>: <span class="s">"Ane Etxeberria"</span>,'],
  ['  <span class="k">"email"</span>: <span class="s">"ane@example.com"</span>,'],
  ['  <span class="k">"roles"</span>: [<span class="s">"admin"</span>, <span class="s">"editor"</span>],'],
  ['  <span class="k">"address"</span>: {'],
  ['    <span class="k">"city"</span>: <span class="s">"Donostia"</span>,'],
  ['    <span class="k">"country"</span>: <span class="s">"ES"</span>'],
  ['  },'],
  ['  <span class="k">"active"</span>: <span class="b">true</span>,'],
  ['  <span class="k">"created_at"</span>: <span class="s">"2026-09-30T08:14:02Z"</span>'],
  ['}']
];

var RUN = [
  ['get','Health','200','12','1/1'],
  ['post','Login','200','48','2/2'],
  ['get','List users','200','31','3/3'],
  ['get','Get user','200','4','3/3'],
  ['post','Create user','201','27','4/4'],
  ['put','Update user','200','22','2/2'],
  ['get','List invoices','500','118','1/3'],
  ['del','Delete user','—','—','skipped']
];

function sideReqs(){
  var rows = [['get','List users','',2],['get','Get user','on get-user',3],['post','Create user','',4],['put','Update user','',5],['del','Delete user','',7]];
  return rows.map(function(r){
    return '<div class="b-req '+r[2]+'"><span class="m '+r[0]+'">'+r[0].toUpperCase()+'</span><span>'+r[1]+'</span><i class="r" data-r="'+r[3]+'"></i></div>';
  }).join('');
}

function html(){
  return ''+
'<div class="b-tint"></div>'+
'<div class="b-top">'+
  '<span class="b-lights"><i></i><i></i><i></i></span>'+
  '<span class="b-logo">'+I.send+'</span>'+
  '<span class="b-tab"><span class="m get">GET</span>List users</span>'+
  '<span class="b-tab on get-user"><span class="m get">GET</span>Get user<span class="x">✕</span></span>'+
  '<span class="b-tab"><span class="m post">POST</span>Create user<span class="dot"></span></span>'+
  '<span class="b-tab on new"><span class="m post">POST</span>Create invoice<span class="dot"></span></span>'+
  '<span class="b-sp"></span>'+
  '<span class="b-ico">'+I.plus+'</span>'+
  '<span class="b-env"><i></i><span data-el="envname">local</span></span>'+
  '<span class="b-ico">'+I.play+'</span><span class="b-ico">'+I.side+'</span><span class="b-ico">'+I.split+'</span>'+
'</div>'+
'<div class="b-body">'+
  '<aside class="b-side">'+
    '<div class="b-find">'+I.search+'Filter requests<span class="kbd" style="margin-left:auto">⌘K</span></div>'+
    '<div class="b-col">'+I.chev+'acme api<small>.bru</small></div>'+
    '<div class="b-req"><span class="m get">GET</span><span>Health</span><i class="r" data-r="0"></i></div>'+
    '<div class="b-req"><span class="m post">POST</span><span>Login</span><i class="r" data-r="1"></i></div>'+
    '<div class="b-folder">'+I.folder+'Users</div>'+
    sideReqs()+
    '<div class="b-folder">'+I.folder+'Billing</div>'+
    '<div class="b-req"><span class="m get">GET</span><span>List invoices</span><i class="r" data-r="6"></i></div>'+
    '<div class="b-req new"><span class="m post">POST</span><span>Create invoice</span><i></i></div>'+
    '<h6>Collections</h6>'+
    '<div class="b-col other">'+I.folder+'payments<small>git</small></div>'+
    '<div class="b-col other">'+I.folder+'search<small>git</small></div>'+
    '<div class="b-col other">'+I.folder+'webhooks<small>git</small></div>'+
  '</aside>'+

  '<section class="b-main">'+
    '<div class="b-url">'+
      '<div class="b-field" data-el="field"><span class="m get" data-el="method">GET</span><span class="u" data-el="url"><span class="var">{{baseUrl}}</span>/users/<span class="pathp">:id</span></span></div>'+
      '<span class="b-send" data-el="send">'+I.send+'Send</span>'+
    '</div>'+
    '<div class="b-crumb" data-el="crumb">acme api / Users › <span class="mono">https://api.acme.dev/v2/users/1</span></div>'+
    '<div class="b-split">'+
      '<div class="b-pane">'+
        '<div class="b-tabs" data-el="reqtabs"><span data-t="params">Params<b>1</b></span><span data-t="body">Body</span><span>Headers<b>3</b></span><span>Auth</span><span>Vars</span><span data-t="script">Script<b>•</b></span><span>Assert<b>3</b></span><span data-t="tests">Tests<b>3</b></span><span>Docs</span></div>'+
        '<div class="b-panel" data-p="params">'+
          '<div class="b-k">Query<em>disabled rows stay in the file</em></div>'+
          '<div class="kv"><i class="c"></i><span>expand</span><span>address</span><i class="c off"></i><span>fields</span><span>id,name</span></div>'+
          '<div class="b-k" style="margin-top:6px">Path<em>:segments in the URL</em></div>'+
          '<div class="kv"><i class="c"></i><span class="pathp">:id</span><span><span class="var">{{firstUserId}}</span></span></div>'+
          '<div class="b-k" style="margin-top:6px">Assert</div>'+
          '<div class="kv"><i class="c"></i><span>res.status</span><span>eq 200</span><i class="c"></i><span>res.body.email</span><span>isString</span><i class="c"></i><span>res.responseTime</span><span>lt 300</span></div>'+
        '</div>'+
        '<div class="b-panel" data-p="script">'+
          '<div class="b-k">Post response<em>Bruno\'s script API</em></div>'+
'<pre class="code"><span class="ln">1</span><span class="kw">const</span> first = res.body.items[<span class="n">0</span>];\n<span class="ln">2</span>bru.<span class="fn">setVar</span>(<span class="s">"firstUserId"</span>, first.id);\n<span class="ln">3</span>bru.<span class="fn">setNextRequest</span>(<span class="s">"Get user"</span>);</pre>'+
          '<div class="b-k" style="margin-top:4px">Tests</div>'+
'<pre class="code"><span class="ln">1</span><span class="fn">test</span>(<span class="s">"status is 200"</span>, () => {\n<span class="ln">2</span>  <span class="fn">expect</span>(res.status).to.<span class="fn">equal</span>(<span class="n">200</span>);\n<span class="ln">3</span>});\n<span class="ln">4</span><span class="fn">test</span>(<span class="s">"has an address"</span>, () => {\n<span class="ln">5</span>  <span class="fn">expect</span>(res.body).to.have.<span class="fn">property</span>(<span class="s">"address"</span>);\n<span class="ln">6</span>});</pre>'+
        '</div>'+
        '<div class="b-panel" data-p="body">'+
          '<div class="b-k">JSON<em>from the pasted curl</em></div>'+
'<pre class="code"><span class="ln">1</span>{\n<span class="ln">2</span>  <span class="k">"customer"</span>: <span class="s">"cus_8Hq2"</span>,\n<span class="ln">3</span>  <span class="k">"amount"</span>: <span class="n">4900</span>,\n<span class="ln">4</span>  <span class="k">"currency"</span>: <span class="s">"eur"</span>\n<span class="ln">5</span>}</pre>'+
          '<div class="b-k" style="margin-top:4px">Headers</div>'+
          '<div class="kv"><i class="c"></i><span>Authorization</span><span>Bearer <span class="var">{{token}}</span></span><i class="c"></i><span>Content-Type</span><span>application/json</span><i class="c"></i><span>Idempotency-Key</span><span><span class="var">{{$guid}}</span></span></div>'+
        '</div>'+
      '</div>'+
      '<div class="b-pane">'+
        '<div class="b-status" data-el="status"><span class="chip ok">200 OK</span><span>4 ms</span><span>312 B</span><span class="dim">http/2</span><span class="t">09:41:12</span></div>'+
        '<div class="b-tabs" data-el="restabs"><span data-t="rbody">Body</span><span>Headers<b>9</b></span><span>Cookies</span><span data-t="timeline">Timeline</span><span data-t="rtests">Tests<b class="ok">3/3</b></span><span>Console<b>1</b></span></div>'+
        '<div class="b-panel" data-p="rbody" style="padding-top:0">'+
          '<div class="b-rbar" style="padding:6px 0 0"><span class="seg"><span class="on">Pretty</span><span>Raw</span><span>Preview</span></span><span class="filter">'+I.filter+'res.body.address.city</span></div>'+
          '<pre class="code json" data-el="json"></pre>'+
        '</div>'+
        '<div class="b-panel" data-p="rtests">'+
          '<div class="tests" data-el="tests">'+
            '<div class="test"><i>✓</i><span>status is 200</span><em>test</em></div>'+
            '<div class="test"><i>✓</i><span>has an address</span><em>test</em></div>'+
            '<div class="test"><i>✓</i><span>res.responseTime lt 300</span><em>assert</em></div>'+
          '</div>'+
          '<div class="vars" data-el="vars">bru.setVar · <span class="var">firstUserId</span> = <span style="color:var(--num)">1</span><span style="margin-left:auto" class="dim">runtime</span></div>'+
          '<div class="b-k" style="margin-top:4px">Console</div>'+
          '<pre class="code"><span class="c">[post-response] next → "Get user"</span></pre>'+
        '</div>'+
        '<div class="b-panel" data-p="timeline">'+
          '<div class="wf" data-el="wf">'+
            '<span>DNS</span><span class="bar"><i style="--x:0%;--w:6%;--c:#7FDBCA"></i></span><em>3 ms</em>'+
            '<span>Connect</span><span class="bar"><i style="--x:6%;--w:10%;--c:#82AAFF"></i></span><em>8 ms</em>'+
            '<span>TLS</span><span class="bar"><i style="--x:16%;--w:22%;--c:#C792EA"></i></span><em>21 ms</em>'+
            '<span>Waiting</span><span class="bar"><i style="--x:38%;--w:54%;--c:#F5A524"></i></span><em>64 ms</em>'+
            '<span>Download</span><span class="bar"><i style="--x:92%;--w:8%;--c:#3DBA6E"></i></span><em>4 ms</em>'+
            '<span class="tot">Total</span><span class="tot"></span><em class="tot">100 ms</em>'+
          '</div>'+
          '<div class="b-k" style="margin-top:4px">Request as sent<em>TLS 1.3 · h2 · 104.18.12.7</em></div>'+
          '<pre class="code sent"><span class="kw">GET</span> /v2/users/1?expand=address <span class="dim">HTTP/2</span>\n<span class="k">authorization</span>: Bearer eyJhbGciOi…\n<span class="k">accept</span>: application/json\n<span class="k">user-agent</span>: bidali/0.1.0</pre>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</section>'+

  '<section class="b-over b-run">'+
    '<div class="b-oh"><h4>Runner</h4><span class="dim">acme api · env <b style="color:var(--w-text)">local</b> · sequence</span><span class="sp"></span><span class="btn">Tags: smoke</span><span class="btn">JUnit</span><span class="btn pri">'+I.play+'Run again</span></div>'+
    '<div class="prog"><i data-el="prog"></i></div>'+
    '<div class="grid" data-el="grid">'+
      '<div class="row hd"><span>#</span><span>Method</span><span>Request</span><span>Status</span><span>Time</span><span>Tests</span></div>'+
      RUN.map(function(r, i){
        var bad = r[2] === '500';
        var skip = r[4] === 'skipped';
        return '<div class="row'+(bad ? ' fail' : '')+'"><span class="n">'+(i + 1)+'</span><span class="m '+r[0]+'">'+r[0].toUpperCase()+'</span><span>'+r[1]+'</span>'+
          '<span class="st '+(skip ? '' : bad ? 'bad' : 'ok')+'">'+r[2]+'</span><span class="ms">'+(r[3] === '—' ? '—' : r[3]+' ms')+'</span>'+
          '<span class="ts'+(bad ? ' bad' : '')+(skip ? ' skip' : '')+'">'+(skip ? 'bail' : r[4])+'</span></div>';
      }).join('')+
    '</div>'+
    '<div class="fail-note" data-el="failnote">✕ List invoices · expect(res.status).to.equal(200) — got 500 · bail: stopped before Delete user</div>'+
    '<div class="sum" data-el="sum"><b class="ok">6 passed</b><b class="bad">1 failed</b><b>1 skipped</b><b>262 ms</b><span style="margin-left:auto" class="dim">$ bidali run . --env local --reporter junit</span></div>'+
  '</section>'+

  '<section class="b-over b-envs">'+
    '<div class="b-oh"><h4>Environments</h4><span class="dim">environments/*.bru · secrets never written to the collection</span></div>'+
    '<div class="envgrid">'+
      '<div class="envlist"><span class="on" style="--c:#3DBA6E"><i></i>local</span><span style="--c:#F5A524"><i></i>staging</span><span style="--c:#E5544B"><i></i>production</span><span style="--c:var(--w-text-3)"><i></i>.env</span></div>'+
      '<div class="envbody">'+
        '<div class="vtable">'+
          '<div><span>Name</span><span>Value</span><span></span></div>'+
          '<div class="hl" data-el="vbase"><span>baseUrl</span><span>https://api.acme.dev/v2</span><span class="tag pub">var</span></div>'+
          '<div><span>token</span><span class="sec">••••••••••••</span><span class="tag">secret</span></div>'+
          '<div><span>tenant</span><span>acme-eu</span><span class="tag pub">var</span></div>'+
          '<div><span>stripeKey</span><span><span class="var">{{process.env.STRIPE_KEY}}</span></span><span class="tag pub">.env</span></div>'+
          '<div><span>runId</span><span><span class="var">{{$timestamp}}</span></span><span class="tag pub">dynamic</span></div>'+
        '</div>'+
        '<div class="prec" data-el="prec">Wins:<span>runtime</span>›<span>request</span>›<span>folder</span>›<span class="target">environment</span>›<span>collection</span>›<span>global</span></div>'+
        '<p class="note">Secrets live in <span class="mono">~/.local/state/bidali/secrets.json</span> (0600), never in a <span class="mono">.bru</span> file, so the collection is safe to commit.</p>'+
      '</div>'+
    '</div>'+
  '</section>'+

  '<div class="b-scrim"></div>'+
  '<div class="b-pal">'+
    '<div class="b-pin">'+I.search+'<span data-el="pq"></span><span class="caret"></span><span class="scope" style="margin-left:auto">all</span></div>'+
    '<div class="b-pgrp"><h6>Requests</h6>'+
      '<div class="b-pit on"><span class="m get">GET</span><span>Get <mark>user</mark></span><span class="p">Users</span><span class="kbd">⌘↩ send</span></div>'+
      '<div class="b-pit"><span class="m get">GET</span><span>List <mark>user</mark>s</span><span class="p">Users</span></div>'+
      '<div class="b-pit"><span class="m put">PUT</span><span>Update <mark>user</mark></span><span class="p">Users</span></div>'+
    '</div>'+
    '<div class="b-pgrp"><h6>Actions</h6>'+
      '<div class="b-pit"><span class="p">&gt;</span>Copy as curl, variables resolved<span class="kbd">⌘⇧C</span></div>'+
      '<div class="b-pit"><span class="p">&gt;</span>Run folder Users<span class="kbd">⌘R</span></div>'+
    '</div>'+
    '<div class="b-pgrp"><h6>Environments</h6>'+
      '<div class="b-pit"><span class="p">@</span>staging<span class="p">acme api</span></div>'+
    '</div>'+
    '<div class="b-pfoot"><span>↑↓ move</span><span>↩ open</span><span>⌘↩ open &amp; send</span><span>&gt; actions · @ envs · : collections</span></div>'+
  '</div>'+
  '<div class="toast" data-el="toast"><i></i>curl pasted → new request in Billing</div>'+
'</div>'+
'<div class="b-foot"><span class="mono">~/code/acme-api</span><span class="hide">git · main</span><span class="sp"></span><span class="hide">2 runtime vars</span><span class="hide">3 cookies</span><span>Send <span class="kbd">⌘↩</span></span><span>Palette <span class="kbd">⌘K</span></span><span class="hide">bidali 0.1.0</span></div>';
}

var STOP = {};
function clock(){
  var dead = false, timers = [];
  return {
    sleep:function(ms){ return new Promise(function(res, rej){ if (dead) return rej(STOP); timers.push(setTimeout(function(){ dead ? rej(STOP) : res(); }, REDUCE ? 0 : ms)); }); },
    stop:function(){ dead = true; timers.forEach(clearTimeout); }
  };
}

var URL_GET = '<span class="var">{{baseUrl}}</span>/users/<span class="pathp">:id</span>';
var CURL = "curl -X POST https://api.acme.dev/v2/invoices -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' -d '{\"customer\":\"cus_8Hq2\",\"amount\":4900}'";

function mount(host){
  host.innerHTML = html();
  var $ = function(n){ return host.querySelector('[data-el="'+n+'"]'); };
  var json = $('json');
  json.innerHTML = J.map(function(l){ return '<span class="l">'+l[0]+'</span>'; }).join('\n');
  var lines = json.querySelectorAll('.l');
  var c = null;

  function tabs(req, res){
    $('reqtabs').querySelectorAll('span[data-t]').forEach(function(s){ s.classList.toggle('on', s.dataset.t === req); });
    $('restabs').querySelectorAll('span[data-t]').forEach(function(s){ s.classList.toggle('on', s.dataset.t === res); });
    host.querySelectorAll('.b-panel').forEach(function(p){ p.classList.toggle('on', p.dataset.p === req || p.dataset.p === res); });
  }
  function status(html){ $('status').innerHTML = html; }
  var OK = '<span class="chip ok">200 OK</span><span>4 ms</span><span>312 B</span><span class="dim">http/2</span><span class="t">09:41:12</span>';
  function getRequest(){
    host.classList.remove('pasted');
    $('field').classList.remove('paste');
    $('method').className = 'm get'; $('method').textContent = 'GET';
    $('url').innerHTML = URL_GET;
    $('crumb').innerHTML = 'acme api / Users › <span class="mono">https://api.acme.dev/v2/users/1?expand=address</span>';
    $('toast').classList.remove('in');
  }
  function fill(on){ lines.forEach(function(l){ l.classList.toggle('in', on); }); }

  async function press(k){
    $('send').classList.add('press');
    await k.sleep(160);
    $('send').classList.remove('press');
  }

  var scenes = {
    request: async function(k){
      getRequest(); tabs('params', 'rbody'); fill(false);
      status('<span class="chip wait">Sending…</span>');
      await k.sleep(700);
      await press(k);
      await k.sleep(260);
      status(OK);
      for (var i = 0; i < lines.length; i++){ lines[i].classList.add('in'); await k.sleep(55); }
    },
    scripts: async function(k){
      getRequest(); tabs('script', 'rtests'); fill(true); status(OK);
      var t = $('tests').children;
      for (var i = 0; i < t.length; i++) t[i].classList.remove('done');
      $('vars').classList.remove('in');
      await k.sleep(600);
      await press(k);
      for (var j = 0; j < t.length; j++){ await k.sleep(380); t[j].classList.add('done'); }
      await k.sleep(400);
      $('vars').classList.add('in');
    },
    timeline: async function(k){
      getRequest(); tabs('params', 'timeline'); fill(true); status(OK);
      $('wf').classList.remove('in');
      await k.sleep(450);
      $('wf').classList.add('in');
    },
    runner: async function(k){
      var rows = $('grid').querySelectorAll('.row:not(.hd)');
      var marks = host.querySelectorAll('.b-req .r');
      rows.forEach(function(r){ r.classList.remove('done', 'cur'); });
      marks.forEach(function(m){ m.className = 'r'; m.textContent = ''; });
      $('prog').style.setProperty('--p', '0%');
      $('failnote').classList.remove('in'); $('sum').classList.remove('in');
      await k.sleep(500);
      for (var i = 0; i < rows.length; i++){
        var mark = host.querySelector('.b-req .r[data-r="'+i+'"]');
        rows[i].classList.add('cur');
        if (mark){ mark.className = 'r run show'; mark.textContent = '•'; }
        await k.sleep(i === 6 ? 520 : 260);
        rows[i].classList.remove('cur'); rows[i].classList.add('done');
        var bad = i === 6, skip = i === 7;
        if (mark){ mark.className = 'r show ' + (bad ? 'bad' : skip ? '' : 'ok'); mark.textContent = bad ? '✕' : skip ? '' : '✓'; }
        $('prog').style.setProperty('--p', Math.round((i + 1) / rows.length * 100) + '%');
        if (bad){ await k.sleep(200); $('failnote').classList.add('in'); }
      }
      await k.sleep(250);
      $('sum').classList.add('in');
    },
    env: async function(k){
      var p = $('prec').querySelectorAll('span');
      p.forEach(function(s){ s.classList.remove('in', 'win'); });
      $('vbase').classList.remove('flash');
      await k.sleep(500);
      for (var i = 0; i < p.length; i++){
        p[i].classList.add('in');
        await k.sleep(220);
        if (p[i].classList.contains('target')){ p[i].classList.add('win'); $('vbase').classList.add('flash'); break; }
      }
      await k.sleep(700);
      for (var j = 0; j < p.length; j++) p[j].classList.add('in');
    },
    palette: async function(k){
      getRequest(); tabs('params', 'rbody'); fill(true); status(OK);
      var q = $('pq'); q.textContent = '';
      var items = host.querySelectorAll('.b-pit');
      items.forEach(function(it, i){ it.classList.toggle('on', i === 0); });
      await k.sleep(450);
      var word = 'user';
      for (var i = 0; i < word.length; i++){ q.textContent += word[i]; await k.sleep(140); }
      await k.sleep(900);
      items[0].classList.remove('on'); items[3].classList.add('on');
      await k.sleep(800);
      items[3].classList.remove('on'); items[0].classList.add('on');
    },
    curl: async function(k){
      getRequest(); tabs('params', 'rbody'); fill(false);
      status('<span class="chip wait">No response yet</span>');
      await k.sleep(600);
      $('field').classList.add('paste');
      $('method').className = 'm'; $('method').textContent = '⌘V';
      var u = $('url');
      u.textContent = '';
      var step = REDUCE ? CURL.length : 6;
      for (var i = 0; i < CURL.length; i += step){ u.textContent = CURL.slice(0, i + step); await k.sleep(16); }
      await k.sleep(500);
      host.classList.add('pasted');
      $('field').classList.remove('paste');
      $('method').className = 'm post'; $('method').textContent = 'POST';
      u.innerHTML = '<span class="var">{{baseUrl}}</span>/invoices';
      $('crumb').innerHTML = 'acme api / Billing › <span class="mono">https://api.acme.dev/v2/invoices</span>';
      tabs('body', 'rbody');
      $('toast').classList.add('in');
      await k.sleep(1100);
      await press(k);
      await k.sleep(200);
      status('<span class="chip ok">201 Created</span><span>27 ms</span><span>188 B</span><span class="dim">http/2</span><span class="t">09:41:40</span>');
      json.innerHTML = '<span class="l in">{</span>\n<span class="l in">  <span class="k">"id"</span>: <span class="s">"in_1Q7x"</span>,</span>\n<span class="l in">  <span class="k">"status"</span>: <span class="s">"draft"</span>,</span>\n<span class="l in">  <span class="k">"amount"</span>: <span class="n">4900</span></span>\n<span class="l in">}</span>';
      await k.sleep(1400);
      $('toast').classList.remove('in');
    }
  };

  function play(state){
    if (c) c.stop();
    c = clock();
    if (state !== 'curl'){
      json.innerHTML = J.map(function(l){ return '<span class="l">'+l[0]+'</span>'; }).join('\n');
      lines = json.querySelectorAll('.l');
    }
    var run = scenes[state] || scenes.request;
    run(c).catch(function(e){ if (e !== STOP) throw e; });
  }

  function compact(){ host.classList.toggle('compact', host.clientWidth < 640); }
  compact();
  window.addEventListener('resize', compact);

  var last = host.dataset.state;
  play(last);
  new MutationObserver(function(){
    if (host.dataset.state === last) return;
    last = host.dataset.state;
    play(last);
  }).observe(host, {attributes:true, attributeFilter:['data-state']});
}

function boot(){ document.querySelectorAll('[data-bwin]').forEach(mount); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
})();
