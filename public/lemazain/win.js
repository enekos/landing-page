(function(){
var I = {
  helm:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="8" r="3"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3M3.4 3.4l2.1 2.1M10.5 10.5l2.1 2.1M3.4 12.6l2.1-2.1M10.5 5.5l2.1-2.1"/></svg>',
  back:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m10 3-5 5 5 5"/></svg>',
  fwd:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 3 5 5-5 5"/></svg>',
  gauge:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2.5 11a5.5 5.5 0 1 1 11 0"/><path d="m8 11 2.5-3"/></svg>',
  steth:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 2v4a3 3 0 0 0 6 0V2M7 9v2a3 3 0 0 0 6 0V9"/><circle cx="13" cy="7.5" r="1.3"/></svg>',
  box:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1 14 4v8l-6 3-6-3V4z" opacity=".85"/></svg>',
  stack:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 2 14 5 8 8 2 5z"/><path d="m2 8 6 3 6-3M2 11l6 3 6-3"/></svg>',
  svc:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="3.5" cy="12" r="1.6"/><circle cx="12.5" cy="12" r="1.6"/><circle cx="8" cy="3.5" r="1.6"/><path d="M4.5 10.6 7 5M11.5 10.6 9 5M5 12h6"/></svg>',
  node:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2.5" y="2" width="11" height="5" rx="1"/><rect x="2.5" y="9" width="11" height="5" rx="1"/></svg>',
  bell:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 11V7a4 4 0 0 1 8 0v4l1.5 1.5h-11zM6.5 14h3"/></svg>',
  cert:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2.5" width="12" height="8" rx="1"/><circle cx="8" cy="12.5" r="1.8"/></svg>',
  key:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="5" cy="8" r="2.5"/><path d="M7.5 8H14M12 8v2.5"/></svg>',
  search:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>',
  lock:'<svg viewBox="0 0 16 16" fill="currentColor" style="width:10px;height:10px"><rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  term:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m3 5 3 3-3 3M8 11h5"/></svg>',
  logs:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 4h10M3 8h7M3 12h9"/></svg>'
};

var pods = [
  ['api-gateway-7c9d4b6f5-2xkqp','payments','2/2','Running','0','3d4h','212m','418Mi',''],
  ['api-gateway-7c9d4b6f5-9mfzt','payments','2/2','Running','0','3d4h','198m','402Mi','sel'],
  ['checkout-worker-5f7b8c9d4-hq2lm','payments','1/1','Running','1','19h','84m','256Mi',''],
  ['checkout-worker-5f7b8c9d4-kx8vn','payments','0/1','CrashLoopBackOff','14','19h','—','—','bad'],
  ['ledger-0','payments','1/1','Running','0','12d','56m','1.2Gi',''],
  ['ledger-1','payments','1/1','Running','0','12d','61m','1.1Gi',''],
  ['ledger-2','payments','0/1','Pending','0','7m','—','—','warn'],
  ['refunds-api-6d8f9b7c5-p4w2r','payments','1/1','Running','0','2d1h','33m','188Mi',''],
  ['refunds-api-6d8f9b7c5-z7t6s','payments','1/1','Running','0','2d1h','29m','181Mi',''],
  ['fraud-scorer-84c6d5b9f-t3n8q','payments','1/1','Running','0','5h12m','640m','2.3Gi',''],
  ['fraud-scorer-84c6d5b9f-w9k2d','payments','1/1','OOMKilled','6','5h12m','—','—','bad'],
  ['webhooks-dispatch-0','payments','1/1','Running','0','8d','12m','96Mi',''],
  ['webhooks-dispatch-1','payments','1/1','Running','0','8d','14m','98Mi',''],
  ['rates-sync-28771940-bz9km','payments','0/1','Completed','0','41m','—','—',''],
  ['statement-render-6b9c7d8f4-q2wlx','payments','1/1','Running','0','1d7h','91m','612Mi','']
];

function rows(){
  return pods.map(function(p){
    return '<tr class="'+p[8]+'"><td class="n"><i></i>'+p[0]+'</td><td class="hide-s">'+p[1]+'</td><td class="m">'+p[2]+'</td><td><span class="pill">'+p[3]+'</span></td><td class="m rs r">'+p[4]+'</td><td class="m hide-s">'+p[5]+'</td><td class="m r hide-s">'+p[6]+'</td><td class="m r hide-s">'+p[7]+'</td></tr>';
  }).join('');
}

var tpl = function(){ return ''+
  '<div class="k-tint"></div>'+
  '<div class="k-top">'+
    '<div class="k-lights"><i></i><i></i><i></i></div>'+
    '<span class="k-tab stg on" style="--c:#2E9E5B"><i></i>eu-staging</span>'+
    '<span class="k-tab prod"><i></i>eu-prod <em>PROD</em></span>'+
    '<span class="k-tab" style="--c:#7A3BB0"><i></i>us-east-batch</span>'+
    '<span class="k-sep"></span>'+
    '<span class="k-ico">'+I.back+'</span><span class="k-ico">'+I.fwd+'</span>'+
    '<span class="k-ns">▢ payments ▾</span>'+
    '<span class="k-sp"></span>'+
    '<span class="k-jump">'+'<span style="width:11px;height:11px;display:inline-grid">'+I.search+'</span>Jump to anything<b>⌘K</b></span>'+
    '<span class="k-lock">'+I.lock+'<span class="rw">Writes on</span><span class="ro">Read-only</span></span>'+
  '</div>'+
  '<div class="k-body">'+
    '<aside class="k-side">'+
      '<div class="k-ctx"><s>'+I.helm+'</s><div>eu-staging<small>v1.35 · 214 nodes</small></div></div>'+
      '<div class="k-find">Find a kind</div>'+
      '<div class="k-nav">'+I.gauge+'Overview</div>'+
      '<div class="k-nav" data-n="problems">'+I.steth+'Problems<b>7</b></div>'+
      '<div class="k-nav">'+I.stack+'Helm Releases</div>'+
      '<h6>Pinned</h6>'+
      '<div class="k-nav on" data-n="pods">'+I.box+'Pod</div>'+
      '<div class="k-nav">'+I.stack+'Deployment</div>'+
      '<div class="k-nav">'+I.stack+'StatefulSet</div>'+
      '<div class="k-nav">'+I.svc+'Service</div>'+
      '<div class="k-nav">'+I.node+'Node</div>'+
      '<div class="k-nav">'+I.bell+'Event</div>'+
      '<div class="k-nav">'+I.key+'Secret</div>'+
      '<h6>Custom resources</h6>'+
      '<div class="k-nav">'+I.cert+'<div>Certificate<small>cert-manager.io</small></div></div>'+
      '<div class="k-nav">'+I.cert+'<div>KafkaTopic<small>kafka.strimzi.io</small></div></div>'+
    '</aside>'+
    '<section class="k-main">'+
      '<div class="k-head">'+
        '<div class="k-title"><span style="width:13px;height:13px;color:#5B8DEF;display:inline-grid">'+I.box+'</span><h4>Pod</h4><code>v1</code><span class="k-count">1,284</span><span class="k-live"><i></i>live</span></div>'+
        '<div class="k-filter">'+
          '<div class="k-q"><span style="width:11px;height:11px;display:inline-grid">'+I.search+'</span><span class="ph">Filter · ns:  app=web  is:problem  -exclude</span><span class="typed"><span class="t">is:</span>problem <span class="t">-</span>job</span><span class="caret"></span></div>'+
          '<span class="k-chip all">All</span><span class="k-chip prob">Problems<b>3</b></span><span class="k-chip">Failing<b style="background:rgba(229,84,75,.16);color:#E5544B">2</b></span>'+
        '</div>'+
      '</div>'+
      '<div class="k-grid"><table><colgroup><col style="width:34%"><col class="hide-s" style="width:11%"><col style="width:8%"><col style="width:17%"><col style="width:9%"><col class="hide-s" style="width:8%"><col class="hide-s" style="width:7%"><col class="hide-s" style="width:8%"></colgroup>'+
        '<thead><tr><th>Name</th><th class="hide-s">Namespace</th><th>Ready</th><th>Status</th><th class="r">Restarts</th><th class="hide-s">Age</th><th class="r hide-s">CPU</th><th class="r hide-s">Memory</th></tr></thead>'+
        '<tbody>'+rows()+'</tbody></table></div>'+
      '<div class="k-prob">'+
        '<div class="k-ph">'+
          '<div class="k-title"><span style="width:13px;height:13px;color:#5B8DEF;display:inline-grid">'+I.steth+'</span><h4>Problems</h4><code>in payments · scanned 12s ago</code></div>'+
          '<div class="k-tiles"><div class="cr"><small>Critical</small><b>3</b></div><div class="wa"><small>Warning</small><b>4</b></div><div><small>Info</small><b>1</b></div><div><small>Warning events</small><b>38</b></div></div>'+
        '</div>'+
        '<div class="k-groups">'+
          '<div class="k-group"><div class="k-gh"><i></i>CrashLoopBackOff <em>1</em><span>container keeps exiting — check Logs with Previous on</span></div>'+
            '<div class="k-f"><b>checkout-worker-5f7b8c9d4-kx8vn</b><small>payments</small><span>14 restarts · back-off 5m0s restarting failed container</span><em>19h</em></div></div>'+
          '<div class="k-group"><div class="k-gh"><i></i>RolloutStuck <em>1</em><span>progress deadline exceeded</span></div>'+
            '<div class="k-f"><b>checkout-worker</b><small>payments</small><span>ReplicaSet "checkout-worker-5f7b8c9d4" has timed out progressing</span><em>18h</em></div></div>'+
          '<div class="k-group"><div class="k-gh w"><i></i>OOMKilled <em>1</em><span>memory limit is too low for the workload</span></div>'+
            '<div class="k-f"><b>fraud-scorer-84c6d5b9f-w9k2d</b><small>payments</small><span>scorer was killed for memory · 6 restarts</span><em>5h</em></div></div>'+
          '<div class="k-group"><div class="k-gh w"><i></i>Unschedulable <em>1</em><span>no node fits the requests, selectors or taints</span></div>'+
            '<div class="k-f"><b>ledger-2</b><small>payments</small><span>0/214 nodes are available: 3 Insufficient memory, 211 node(s) had untolerated taint</span><em>7m</em></div></div>'+
        '</div>'+
      '</div>'+
    '</section>'+
    '<aside class="k-insp">'+
      '<div class="k-ih"><h5>api-gateway-7c9d4b6f5-9mfzt</h5>'+
        '<div class="k-pills"><span>payments</span><span class="g">Running</span><span class="g">2/2 ready</span><span class="a">↗ ReplicaSet api-gateway-7c9d4b6f5</span></div></div>'+
      '<div class="k-tabs"><span class="ov">Overview</span><span>YAML</span><span>Events</span><span class="lg">Logs</span><span>Shell</span></div>'+
      '<div class="k-logbar"><span class="on">All containers</span><span>Warn +</span><span>Follow</span><span style="margin-left:auto;background:none">2,418 lines</span></div>'+
      '<div class="k-cards">'+
        '<div class="k-card"><h6>Pod</h6><dl class="k-kv"><dt>Node</dt><dd class="l">gke-eu-pool-b-3f9d-k2lm</dd><dt>Pod IP</dt><dd>10.44.7.19</dd><dt>QoS</dt><dd>Burstable</dd><dt>CPU now</dt><dd>198m</dd><dt>Memory</dt><dd>402Mi</dd></dl></div>'+
        '<div class="k-card"><h6>Containers · 2</h6><dl class="k-kv"><dt>gateway</dt><dd>ghcr.io/acme/gateway:4.18.2</dd><dt>linkerd-proxy</dt><dd>cr.l5d.io/proxy:edge-25.9</dd></dl></div>'+
        '<div class="k-card"><h6>Conditions</h6><dl class="k-kv"><dt style="color:#3DBA6E">True</dt><dd>Ready</dd><dt style="color:#3DBA6E">True</dt><dd>ContainersReady</dd><dt style="color:#3DBA6E">True</dt><dd>PodScheduled</dd></dl></div>'+
      '</div>'+
      '<div class="k-logs"></div>'+
    '</aside>'+
  '</div>'+
  '<div class="k-status"><i></i>eu-staging · v1.35.4<span class="sp"></span><span>Jump <kbd>⌘K</kbd></span><span>Filter <kbd>⌘F</kbd></span><span>Back <kbd>⌘[</kbd></span><span class="hide-s">214 nodes · 612 cores · 2.4Ti</span></div>'+
  '<div class="k-dim"></div>'+
  '<div class="k-pal">'+
    '<div class="k-pq"><span style="width:14px;height:14px;color:#646B79;display:inline-grid">'+I.search+'</span>chk wrk<span class="caret"></span></div>'+
    '<div class="k-modes"><span class="on">All</span><span>&gt; Actions</span><span># Namespaces</span><span>@ Contexts</span><span>! Problems</span></div>'+
    '<div class="k-pr on">'+I.box+'<div><b>checkout-worker-5f7b8c9d4-kx8vn</b><small>Pod · payments</small></div><em>Object</em></div>'+
    '<div class="k-pr">'+I.stack+'<div><b>checkout-worker</b><small>Deployment · payments</small></div><em>Object</em></div>'+
    '<div class="k-pr" style="color:#F5C542">'+I.steth+'<div><b>checkout-worker-5f7b8c9d4-kx8vn</b><small>CrashLoopBackOff · Pod · payments</small></div><em>Problem</em></div>'+
    '<div class="k-pr">'+I.logs+'<div><b>Logs of checkout-worker-5f7b8c9d4-kx8vn</b><small>stream, filter, save</small></div><em>Action</em></div>'+
    '<div class="k-pr">'+I.term+'<div><b>Shell into checkout-worker-5f7b8c9d4-kx8vn</b><small>exec</small></div><em>Action</em></div>'+
  '</div>'+
  '<div class="k-sheet">'+
    '<h5>Delete 3 pods?</h5><small>on eu-prod — production</small>'+
    '<div class="lst">checkout-worker-5f7b8c9d4-kx8vn<br>fraud-scorer-84c6d5b9f-w9k2d<br>ledger-2</div>'+
    '<div style="font-size:11px;color:#9AA1AF">Type <b style="color:#E6E8EE">delete 3</b> to confirm</div>'+
    '<div class="in">delete<span class="caret" style="display:inline-block;width:1px;height:11px;background:#5B8DEF;margin-left:1px;vertical-align:-1px;animation:kblink 1s steps(1) infinite"></span></div>'+
    '<div class="btns"><span>Cancel</span><span class="del">Delete 3</span></div>'+
  '</div>';
};

var logLines = [
  ['c','gateway','info','GET /v2/payments/intents 200 18ms trace=7f3c…'],
  ['c2','linkerd-proxy','info','outbound: connected dst=ledger.payments.svc:8080'],
  ['c','gateway','info','POST /v2/payments/confirm 200 42ms trace=a91d…'],
  ['c','gateway','w','WARN upstream slow: fraud-scorer p99=880ms'],
  ['c','gateway','info','GET /healthz 200 1ms'],
  ['c2','linkerd-proxy','info','inbound: HTTP/2 conn accepted from 10.44.3.8'],
  ['c','gateway','e','ERROR refund 7c21 rejected: ledger timeout after 2s'],
  ['c','gateway','info','POST /v2/refunds 202 61ms trace=0b4e…'],
  ['c','gateway','info','GET /v2/payments/intents 200 16ms trace=2d77…'],
  ['c2','linkerd-proxy','w','WARN retry budget 20% used for fraud-scorer'],
  ['c','gateway','info','POST /v2/payments/confirm 200 39ms trace=c3f0…']
];

var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;

document.querySelectorAll('[data-kwin]').forEach(function(host){
  host.innerHTML = tpl();
  var logs = host.querySelector('.k-logs');
  var li = 0;
  function pushLog(){
    var l = logLines[li++ % logLines.length];
    var d = document.createElement('div');
    var cls = l[2] === 'e' ? 'e' : l[2] === 'w' ? 'w' : '';
    var text = l[3].replace('fraud-scorer', '<mark>fraud-scorer</mark>');
    d.innerHTML = '<span class="'+l[0]+'">['+l[1]+']</span> <span class="'+cls+'">'+text+'</span>';
    logs.appendChild(d);
    while (logs.children.length > 26) logs.removeChild(logs.firstChild);
  }
  for (var k = 0; k < 18; k++) pushLog();

  if (reduce) return;
  setInterval(function(){ if (host.dataset.state === 'logs') pushLog(); }, 650);

  var flip = host.querySelectorAll('tbody tr')[6];
  var states = [['0/1','ContainerCreating','warn'],['1/1','Running',''],['0/1','Pending','warn']];
  var si = 0;
  setInterval(function(){
    if (host.dataset.state !== 'pods') return;
    var s = states[si++ % states.length];
    flip.className = s[2] + ' flash';
    flip.children[2].textContent = s[0];
    flip.querySelector('.pill').textContent = s[1];
    flip.children[5].textContent = s[1] === 'Running' ? '8m' : '7m';
  }, 2600);

  if (host.hasAttribute('data-cycle')) {
    var order = ['pods','filter','inspect','logs','palette','problems'];
    var oi = 0;
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(e){ visible = e[0].isIntersecting; }).observe(host);
    }
    setInterval(function(){
      if (!visible || document.hidden) return;
      oi = (oi + 1) % order.length;
      host.dataset.state = order[oi];
    }, 3800);
  }
});
})();
