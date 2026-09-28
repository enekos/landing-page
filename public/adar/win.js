(function(){
var I = {
  branch:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M5 2.5v11"/><path d="M11 4.5c0 4-6 3.5-6 7"/><circle cx="11" cy="3.5" r="1.3"/></svg>',
  back:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m10 3-5 5 5 5"/></svg>',
  fwd:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m6 3 5 5-5 5"/></svg>',
  eye:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z"/><circle cx="8" cy="8" r="2"/></svg>',
  pull:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="4" cy="3.5" r="1.5"/><circle cx="4" cy="12.5" r="1.5"/><circle cx="12" cy="12.5" r="1.5"/><path d="M4 5v6M12 11V6.5A2 2 0 0 0 10 4.5H7.5M9 3l-1.5 1.5L9 6"/></svg>',
  chat:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h9v6H6l-3 2.5V9H2z"/><path d="M11 6h3v5.5h-1V13l-2-1.5H8"/></svg>',
  merge:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="4" cy="3.5" r="1.5"/><circle cx="4" cy="12.5" r="1.5"/><circle cx="12" cy="8" r="1.5"/><path d="M4 5v6M4 5c0 3 3 3 6.5 3"/></svg>',
  book:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 2.5h8.5v11H4a1 1 0 0 1-1-1z"/><path d="M3 11.5a1 1 0 0 1 1-1h7.5"/></svg>',
  bell:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 11V7a4 4 0 0 1 8 0v4l1.5 1.5h-11zM6.5 14h3"/></svg>',
  search:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>',
  refresh:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M13 8a5 5 0 1 1-1.5-3.5M13 2.5v3h-3"/></svg>',
  file:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 1.5h5l3.5 3.5v9.5H4z"/><path d="M9 1.5V5h3.5"/></svg>',
  folder:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M1.5 4h5l1.5 1.5h6.5v7.5h-13z"/></svg>',
  term:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m3 5 3 3-3 3M8 11h5"/></svg>',
  spark:'<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8 6.6 6.6z"/></svg>',
  check:'<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8.5l3 3 7-7"/></svg>'
};

var prs = [
  ['Retry ledger writes with idempotency keys','acme/payments','482','MR','#B98BE0','g','Approved','ap','2h','+141','−11','sel'],
  ['Drop the legacy checkout redirect','acme/web','1290','JT','#6FB3E0','r','Changes','ch','3h','+12','−380',''],
  ['Pin the base image to a digest','acme/infra','77','SL','#F5C542','p','Review','rv','5h','+4','−4',''],
  ['Stream the refunds report as CSV','acme/payments','479','AK','#3DBA6E','g','Review','rv','1d','+208','−36',''],
  ['Rate-limit the public search endpoint','acme/api','3316','NB','#E5544B','g','Approved','ap','1d','+57','−6',''],
  ['Move feature flags to the config service','acme/web','1284','MR','#B98BE0','p','Draft','dr','2d','+96','−140',''],
  ['Batch webhook deliveries per merchant','acme/payments','471','OP','#5B8DEF','g','Review','rv','3d','+312','−48','']
];

function avatar(ini, c){ return '<span class="a-av" style="--c:'+c+'">'+ini+'</span>'; }

function list(){
  return prs.map(function(p){
    return '<div class="a-row '+p[11]+'"><span class="a-dot '+p[5]+'"></span><div class="a-rt"><b>'+p[0]+'</b><small>'+p[1]+' <em>#'+p[2]+'</em> · '+p[8]+'</small></div>'+
      '<div class="a-rm">'+avatar(p[3],p[4])+'<span class="a-rv '+p[7]+'">'+p[6]+'</span><span class="a-ad"><i>'+p[9]+'</i> <s>'+p[10]+'</s></span></div></div>';
  }).join('');
}

var diff = [
  ['h','@@ -41,6 +41,17 @@ export async function writeEntry(entry: Entry) {'],
  ['c','41','41','  const tx = await ledger.begin();'],
  ['d','42','','  await tx.insert(entry);'],
  ['d','43','','  return tx.commit();'],
  ['a','','42','  const key = idempotencyKey(entry);'],
  ['a','','43','  for (let attempt = 0; attempt < 4; attempt++) {'],
  ['a','','44','    try {'],
  ['a','','45','      await tx.insert(entry, { key });'],
  ['a','','46','      return await tx.commit();'],
  ['a','','47','    } catch (err) {'],
  ['a','','48','      if (!isRetryable(err)) throw err;'],
  ['a','','49','      await sleep(backoff(attempt));'],
  ['a','','50','    }'],
  ['a','','51','  }'],
  ['c','44','52','}'],
  ['h','@@ -88,6 +99,7 @@ function isRetryable(err: unknown) {'],
  ['c','88','99','  if (err instanceof LockTimeout) return true;'],
  ['a','','100','  if (err instanceof SerializationFailure) return true;']
];

function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function diffLines(){
  return diff.map(function(d){
    if (d[0] === 'h') return '<div class="a-dl h"><span></span><span></span><code>'+esc(d[1])+'</code></div>';
    var code = esc(d[3]).replace(/\b(const|await|return|for|let|try|catch|if|throw|function|instanceof|export|async)\b/g,'<i>$1</i>');
    return '<div class="a-dl '+d[0]+'"><span>'+d[1]+'</span><span>'+d[2]+'</span><code>'+code+'</code></div>';
  }).join('');
}

var tree = [
  ['d1','src'],['d2','ledger'],['f3','write.ts','m','M'],['f3','idempotency.ts','n','new'],['f3','entry.ts'],
  ['d2','refunds'],['f3','report.ts','b','↓'],['f3','csv.ts','b','↓'],['d1','test'],['f2','ledger.test.ts','m','M'],['f1','package.json'],['f1','README.md']
];

function treeRows(){
  return tree.map(function(t){
    var ico = t[0][0] === 'd' ? I.folder : I.file;
    return '<div class="a-tr l'+t[0].slice(1)+(t[1]==='write.ts'?' on':'')+'">'+ico+'<span>'+t[1]+'</span>'+(t[3]?'<em class="'+t[2]+'">'+t[3]+'</em>':'')+'</div>';
  }).join('');
}

var blame = [
  ['c4d29aa','opetit','1y','export async function writeEntry(entry: Entry) {',''],
  ['c4d29aa','opetit','1y','  const tx = await ledger.begin();',''],
  ['9f3c1ab','mreyes','2h','  const key = idempotencyKey(entry);','n'],
  ['9f3c1ab','mreyes','2h','  for (let attempt = 0; attempt < 4; attempt++) {','n'],
  ['9f3c1ab','mreyes','2h','    try {','n'],
  ['3e81d07','akowal','4mo','      await tx.insert(entry, { key });',''],
  ['3e81d07','akowal','4mo','      return await tx.commit();',''],
  ['9f3c1ab','mreyes','2h','    } catch (err) {','n'],
  ['9f3c1ab','mreyes','2h','      if (!isRetryable(err)) throw err;','n'],
  ['9f3c1ab','mreyes','2h','      await sleep(backoff(attempt));','n'],
  ['9f3c1ab','mreyes','2h','    }','n'],
  ['c4d29aa','opetit','1y','  }','']
];

function blameRows(){
  return blame.map(function(b, i){
    return '<div class="a-bl '+b[4]+'"><span class="s">'+b[0]+'</span><span class="u">'+b[1]+'</span><span class="t">'+b[2]+'</span><span class="ln">'+(40+i)+'</span><code>'+esc(b[3]).replace(/ /g,'&nbsp;')+'</code></div>';
  }).join('');
}

var tpl = function(){ return ''+
  '<div class="a-tint"></div>'+
  '<div class="a-top">'+
    '<div class="a-lights"><i></i><i></i><i></i></div>'+
    '<span class="a-ico">'+I.back+'</span><span class="a-ico">'+I.fwd+'</span>'+
    '<span class="a-crumb"><b>acme/payments</b> <em>#482</em></span>'+
    '<span class="a-sp"></span>'+
    '<span class="a-jump"><span class="i">'+I.search+'</span>Jump to repo, PR, file…<b>⌘K</b></span>'+
    '<span class="a-ico">'+I.refresh+'</span>'+
    '<span class="a-ico a-bell">'+I.bell+'<i>3</i></span>'+
  '</div>'+
  '<div class="a-body">'+
    '<aside class="a-side">'+
      '<div class="a-me">'+avatar('ES','#5B8DEF')+'<div>enekos<small>14 open · 6 to review</small></div></div>'+
      '<div class="a-nav on">'+I.eye+'Review requests<b class="hot">6</b></div>'+
      '<div class="a-nav">'+I.pull+'My pull requests<b>8</b></div>'+
      '<div class="a-nav">'+I.chat+'Involved<b>11</b></div>'+
      '<div class="a-nav">'+I.merge+'Recently merged<b>23</b></div>'+
      '<h6>Repositories</h6>'+
      '<div class="a-nav">'+I.book+'<div>payments<small>acme</small></div></div>'+
      '<div class="a-nav">'+I.book+'<div>web<small>acme</small></div></div>'+
      '<div class="a-nav">'+I.book+'<div>infra<small>acme</small></div></div>'+
      '<h6>Notifications</h6>'+
      '<div class="a-nav act">'+I.bell+'Activity<b class="hot">3</b></div>'+
    '</aside>'+
    '<section class="a-list">'+
      '<div class="a-lh"><h4>Review requests</h4><span class="a-count">6</span><span class="a-live"><i></i>synced 4s ago</span></div>'+
      '<div class="a-filter"><span class="i">'+I.search+'</span>Filter · title, repo, @author, label</div>'+
      '<div class="a-rows">'+list()+'</div>'+
    '</section>'+
    '<section class="a-det">'+
      '<div class="a-dh">'+
        '<h5>Retry ledger writes with idempotency keys</h5>'+
        '<div class="a-pills"><span class="o">Open</span><span class="g">Approved</span><span class="g">Checks green</span><span class="m">mreyes/ledger-retry → main</span></div>'+
      '</div>'+
      '<div class="a-tabs"><span class="t-conv">Conversation<b>14</b></span><span class="t-files">Files<b>3</b></span><span class="t-checks">Checks<b>5</b></span><span class="t-code">Code</span><span class="t-term">Terminal</span></div>'+
      '<div class="a-panes">'+
        '<div class="a-pane p-conv">'+
          '<div class="a-cm">'+avatar('MR','#B98BE0')+'<div><h6>mreyes <small>opened 2h ago</small></h6><p>A lock timeout on the ledger dropped refunds on the floor. Writes now carry an idempotency key and retry up to four times with backoff.</p><ul><li class="x">'+I.check+'Keys derived per entry</li><li class="x">'+I.check+'Retries on lock and serialization failures</li><li><span class="bx"></span>Load test against staging</li></ul></div></div>'+
          '<div class="a-ev g">'+I.check+'<span><b>akowal</b> approved these changes</span><em>40m</em></div>'+
          '<div class="a-cm">'+avatar('AK','#3DBA6E')+'<div><h6>akowal <small>on idempotency.ts:28</small></h6><p>Two refunds of the same amount on the same order would share a key. Worth adding the refund id?</p></div></div>'+
          '<div class="a-ev">'+I.pull+'<span><b>mreyes</b> pushed 1 commit <code>9f3c1ab</code></span><em>12m</em></div>'+
        '</div>'+
        '<div class="a-pane p-files">'+
          '<div class="a-fl"><span class="on">src/ledger/write.ts <i>+24</i> <s>−2</s></span><span>idempotency.ts <i>+79</i></span><span class="hide-s">ledger.test.ts <i>+38</i> <s>−9</s></span></div>'+
          '<div class="a-diff">'+diffLines()+'</div>'+
        '</div>'+
        '<div class="a-pane p-checks">'+
          '<div class="a-grade"><b>Green</b><span>4 passed · 1 running. Graded per check, so a re-run that passed counts as a pass.</span></div>'+
          '<div class="a-ck"><i class="g"></i><b>ci / lint</b><span>eslint, tsc</span><em>42s</em></div>'+
          '<div class="a-ck"><i class="g"></i><b>ci / test</b><span>failed, then passed on re-run</span><em class="rr">re-run ✓</em></div>'+
          '<div class="a-ck"><i class="p"></i><b>ci / e2e</b><span>shard 3 of 4</span><em>4m 10s</em></div>'+
          '<div class="a-ck"><i class="g"></i><b>codeql</b><span>no new alerts</span><em>2m 31s</em></div>'+
          '<div class="a-ck"><i class="g"></i><b>deploy-preview</b><span>pr-482.preview.acme.dev</span><em>1m 05s</em></div>'+
        '</div>'+
        '<div class="a-pane p-code">'+
          '<div class="a-xh"><span class="loc">~/src/payments</span><span class="w">4 behind main</span><span class="hide-s">19 files differ</span><span class="sp"></span><span class="on">Blame</span><span>Remote</span></div>'+
          '<div class="a-xb"><div class="a-tree">'+treeRows()+'</div><div class="a-blame">'+blameRows()+'</div></div>'+
        '</div>'+
        '<div class="a-pane p-term">'+
          '<div class="a-th"><span class="on">'+I.spark+'Claude Code</span><span>'+I.term+'Shell</span><span class="sp"></span><em>worktree · pr-482 @ 9f3c1ab</em></div>'+
          '<div class="a-tt"></div>'+
        '</div>'+
      '</div>'+
    '</section>'+
  '</div>'+
  '<div class="a-status"><i></i>github.com · enekos<span class="sp"></span><span>Next <kbd>j</kbd><kbd>k</kbd></span><span>Jump <kbd>⌘K</kbd></span><span class="hide-s">Approve <kbd>⇧⌘A</kbd></span><span class="hide-s">Agent <kbd>⇧⌘R</kbd></span></div>'+
  '<div class="a-dim"></div>'+
  '<div class="a-pal">'+
    '<div class="a-pq"><span class="i">'+I.search+'</span>ledger<span class="caret"></span></div>'+
    '<div class="a-modes"><span class="on">All</span><span>@ Repos</span><span># PRs</span><span>/ Files</span><span>&gt; Actions</span></div>'+
    '<div class="a-pr on">'+I.pull+'<div><b>Retry <mark>ledger</mark> writes with idempotency keys</b><small>acme/payments #482 · mreyes</small></div><em>PR</em></div>'+
    '<div class="a-pr">'+I.file+'<div><b>src/<mark>ledger</mark>/write.ts</b><small>in the loaded diff of #482</small></div><em>File</em></div>'+
    '<div class="a-pr">'+I.book+'<div><b>acme/<mark>ledger</mark>-migrations</b><small>repository · 3 open</small></div><em>Repo</em></div>'+
    '<div class="a-pr">'+I.spark+'<div><b>Review with Claude Code</b><small>on a worktree at the PR head</small></div><em>Action</em></div>'+
  '</div>'+
  '<div class="a-notes">'+
    '<div class="a-note"><span class="ap">'+I.branch+'</span><div><b>adar · 3 updates</b><p>Approved · payments#482<br>Checks red · web#1290<br>Merged · infra#77</p></div><em>now</em></div>'+
    '<div class="a-note"><span class="ap">'+I.branch+'</span><div><b>Changes requested · web#1290</b><p>jtorres: the redirect is still linked from the receipts email.</p></div><em>2m</em></div>'+
  '</div>';
};

var termLines = [
  ['p','~/…/worktrees/acme-payments-pr-482 $ claude "$(cat review.md)"'],
  ['d','  pr.diff  pr.md  pr.json    ADAR_PR=acme/payments#482'],
  ['s','● Reading pr.md and pr.diff: 3 files, +141 −11'],
  ['s','● Running the ledger tests in the worktree'],
  ['g','  ✓ 38 passed (4.1s)'],
  ['w','● idempotency.ts:28  the key hashes amount + order id, so two'],
  ['w','  refunds of the same amount on one order collide.'],
  ['w','● write.ts:49  backoff has no jitter; every writer retries in'],
  ['w','  lockstep after a ledger restart.'],
  ['s','● No test for a key reused after its 24h expiry.'],
  ['g','✓ Drafted 3 review comments. Post them? [y/N]']
];

var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;

document.querySelectorAll('[data-awin]').forEach(function(host){
  host.innerHTML = tpl();
  var tt = host.querySelector('.a-tt');
  var ti = 0;
  function pushTerm(){
    var l = termLines[ti++];
    var d = document.createElement('div');
    d.className = l[0];
    d.textContent = l[1];
    tt.appendChild(d);
  }
  function fillTerm(n){ tt.innerHTML = ''; ti = 0; while (ti < n) pushTerm(); }

  if (reduce) { fillTerm(termLines.length); return; }
  fillTerm(2);
  setInterval(function(){
    if (host.dataset.state !== 'agent') { if (ti !== 2) fillTerm(2); return; }
    if (ti < termLines.length) pushTerm();
  }, 480);

  var rowsEl = host.querySelectorAll('.a-row');
  var sel = 0;
  function select(i){ rowsEl[sel].classList.remove('sel'); sel = i; rowsEl[sel].classList.add('sel'); }
  setInterval(function(){
    if (host.dataset.state !== 'inbox') { if (sel !== 0) select(0); return; }
    select((sel + 1) % 3);
  }, 1100);

  if (host.hasAttribute('data-cycle')) {
    var order = ['inbox','diff','checks','agent','palette','notify'];
    var oi = 0;
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function(e){ visible = e[0].isIntersecting; }).observe(host);
    }
    setInterval(function(){
      if (!visible || document.hidden) return;
      oi = (oi + 1) % order.length;
      host.dataset.state = order[oi];
    }, 4200);
  }
});
})();
