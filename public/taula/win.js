// The app window mockup. Decorative: rendered into every [data-win] host; data-state picks the scene.
(function(){
var TBL = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M2 7h12M7 7v6"/></svg>';

// The app's single chrome row (UnifiedTopBar): traffic lights, connection tabs,
// the active session's six views, then Database / Assistant / the local-AI
// switch. Mirrored from Sources/Taula/Views/ContentView.swift — keep in sync.
var ICO_GRID = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="2"/><path d="M2 6.5h12M6.7 6.5v7"/></svg>';
var ICO_STRUCT = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="2"/><path d="M5 6h.01M5 8.5h.01M5 11h.01M8 6h4M8 8.5h4M8 11h4"/></svg>';
var ICO_QUERY = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2.5" width="12" height="11" rx="2"/><path d="m5.5 6 2.5 2.5L5.5 11M9.5 11h2"/></svg>';
var ICO_OBJECTS = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 1.8 14 4.5v7L8 14.2 2 11.5v-7z"/><path d="M2 4.5 8 7.2l6-2.7M8 7.2v7"/></svg>';
var ICO_RELS = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="4" cy="4" r="1.6"/><circle cx="12" cy="4" r="1.6"/><circle cx="8" cy="12" r="1.6"/><path d="M5.3 5 7 10.4M10.7 5 9 10.4M5.6 4h4.8"/></svg>';
var ICO_ACT = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1.5 8h3l1.5-4 3 8 1.5-4h4"/></svg>';
var ICO_WRENCH = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M10.5 2.5a3.5 3.5 0 0 0-4.6 4.4L2 10.8V14h3.2l3.9-3.9a3.5 3.5 0 0 0 4.4-4.6l-2.6 2.6-2.4-.7-.7-2.4z"/></svg>';
var ICO_SPARK = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 2l1.2 3.3L12.5 6.5 9.2 7.7 8 11 6.8 7.7 3.5 6.5l3.3-1.2z"/></svg>';
var ICO_CHEV = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="m4 6 4 4 4-4"/></svg>';

var tpl = `
  <div class="tint"></div>
  <div class="topbar">
    <div class="lights"><i></i><i></i><i></i></div>
    <div class="sess">
      <span class="on"><i></i>shop_prod</span>
      <span><i></i>analytics.sqlite</span>
      <span><i></i>edge-d1</span>
      <span class="plus">+</span>
    </div>
    <span class="tb-sep"></span>
    <div class="views">
      <span data-pill="data">${ICO_GRID}<b class="lb">Data</b></span>
      <span data-pill="structure">${ICO_STRUCT}<b class="lb">Structure</b></span>
      <span data-pill="query">${ICO_QUERY}<b class="lb">Query</b></span>
      <span data-pill="objects">${ICO_OBJECTS}<b class="lb">Objects</b></span>
      <span data-pill="relations">${ICO_RELS}<b class="lb">Relations</b></span>
      <span data-pill="activity">${ICO_ACT}<b class="lb">Activity</b></span>
    </div>
    <span class="dbmenu">${ICO_WRENCH}<b>Database</b>${ICO_CHEV}</span>
    <span class="assist">${ICO_SPARK}<b>Assistant</b></span>
    <span class="ai"><i class="track"><i class="dot"></i></i><b class="lb">Local AI</b></span>
  </div>
  <div class="body">
    <aside class="side">
      <div class="conn"><b>shop_prod</b><small>PostgreSQL 16 · 38 tables</small></div>
      <div class="filter"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg>Filter tables</div>
      <h6>public</h6>
      <ul>
        <li>${TBL}customers</li>
        <li>${TBL}invoices</li>
        <li>${TBL}order_items</li>
        <li class="on">${TBL}orders</li>
        <li>${TBL}products</li>
        <li>${TBL}shipments</li>
        <li>${TBL}support_tickets</li>
      </ul>
      <h6>billing</h6>
      <ul>
        <li>${TBL}payments</li>
        <li>${TBL}refunds</li>
      </ul>
    </aside>

    <section class="main">
      <div class="toolbar">
        <span class="tname">orders</span>
        <div class="where"><b>WHERE</b> placed_at &gt; now() - interval '7 days'</div>
        <span class="meta"><em data-el="browse-rows">1,248</em> rows <em>·</em> <em>12 ms</em></span>
      </div>
      <div class="grid">
        <table>
          <colgroup><col style="width:9%"><col style="width:17%"><col style="width:14%"><col style="width:15%"><col style="width:10%"><col style="width:20%"><col></colgroup>
          <thead><tr>
            <th>id<span class="k">🔑</span></th>
            <th>customer_id<span class="fk">↗</span></th>
            <th>status</th>
            <th>total_cents<span class="t">int8</span></th>
            <th>currency</th>
            <th>placed_at<span class="t">timestamptz</span></th>
            <th>note</th>
          </tr></thead>
          <tbody data-el="browse-rows-body">
            <tr><td class="num">10432</td><td class="fk">88213</td><td class="pend"><span class="old"><span class="pill pending">pending</span></span><span class="new"><span class="pill shipped">shipped</span></span></td><td class="num">12 900</td><td>EUR</td><td>2026-09-11 08:14</td><td class="null">NULL</td></tr>
            <tr><td class="num">10433</td><td class="fk">40017</td><td><span class="pill paid">paid</span></td><td class="num">4 350</td><td>EUR</td><td>2026-09-11 08:20</td><td>gift wrap</td></tr>
            <tr><td class="num">10434</td><td class="fk">88213</td><td><span class="pill shipped">shipped</span></td><td class="num">27 800</td><td>EUR</td><td>2026-09-11 09:02</td><td class="null">NULL</td></tr>
            <tr><td class="num">10435</td><td class="fk">51940</td><td><span class="pill paid">paid</span></td><td class="num pend"><span class="old">1 290</span><span class="new">12 900</span></td><td>EUR</td><td>2026-09-11 09:31</td><td>price fixed by hand</td></tr>
            <tr><td class="num">10436</td><td class="fk">23388</td><td><span class="pill refunded">refunded</span></td><td class="num">8 990</td><td>USD</td><td>2026-09-11 10:05</td><td>duplicate of 10431</td></tr>
            <tr class="del"><td class="num">10437</td><td class="fk">23388</td><td><span class="pill pending">pending</span></td><td class="num">8 990</td><td>USD</td><td>2026-09-11 10:05</td><td class="null">NULL</td></tr>
            <tr><td class="num">10438</td><td class="fk">77102</td><td><span class="pill paid">paid</span></td><td class="num">3 200</td><td>GBP</td><td>2026-09-11 11:48</td><td class="null">NULL</td></tr>
            <tr><td class="num">10439</td><td class="fk">40017</td><td><span class="pill shipped">shipped</span></td><td class="num">15 600</td><td>EUR</td><td>2026-09-11 12:12</td><td class="null">NULL</td></tr>
            <tr><td class="num">10440</td><td class="fk">19005</td><td><span class="pill paid">paid</span></td><td class="num">62 000</td><td>EUR</td><td>2026-09-11 13:40</td><td>B2B, net 30</td></tr>
            <tr><td class="num">10441</td><td class="fk">88213</td><td><span class="pill pending">pending</span></td><td class="num">2 150</td><td>EUR</td><td>2026-09-11 14:03</td><td class="null">NULL</td></tr>
            <tr><td class="num">10442</td><td class="fk">51940</td><td><span class="pill shipped">shipped</span></td><td class="num">9 400</td><td>EUR</td><td>2026-09-11 14:52</td><td class="null">NULL</td></tr>
            <tr><td class="num">10443</td><td class="fk">23388</td><td><span class="pill pending">pending</span></td><td class="num">18 300</td><td>EUR</td><td>2026-09-11 15:26</td><td>awaiting stock</td></tr>
            <tr><td class="num">10444</td><td class="fk">77102</td><td><span class="pill paid">paid</span></td><td class="num">5 750</td><td>GBP</td><td>2026-09-11 16:09</td><td class="null">NULL</td></tr>
            <tr><td class="num">10445</td><td class="fk">40017</td><td><span class="pill paid">paid</span></td><td class="num">31 200</td><td>EUR</td><td>2026-09-11 16:41</td><td>split shipment</td></tr>
            <tr><td class="num">10446</td><td class="fk">19005</td><td><span class="pill refunded">refunded</span></td><td class="num">2 400</td><td>USD</td><td>2026-09-11 17:03</td><td>wrong size</td></tr>
            <tr><td class="num">10447</td><td class="fk">88213</td><td><span class="pill shipped">shipped</span></td><td class="num">7 890</td><td>EUR</td><td>2026-09-11 17:35</td><td class="null">NULL</td></tr>
          </tbody>
        </table>
      </div>

      <div class="editor">
        <div class="qtabs">
          <span class="on" data-el="qtab">revenue by customer</span><span>slow shipments</span><span>+</span>
          <span class="run" data-el="run">Run <kbd>⌘⏎</kbd></span>
        </div>
<pre class="code" data-el="code"><span class="ln">1</span><span class="kw">SELECT</span> c.email, <span class="fn">count</span>(*) <span class="kw">AS</span> orders,
<span class="ln">2</span>       <span class="fn">sum</span>(o.total_cents) / <span class="num">100.0</span> <span class="kw">AS</span> revenue
<span class="ln">3</span><span class="kw">FROM</span> orders o
<span class="ln">4</span><span class="kw">JOIN</span> customers c <span class="kw">ON</span> c.id = o.customer_id
<span class="ln">5</span><span class="kw">WHERE</span> o.placed_at &gt; <span class="fn">now</span>() - <span class="kw">interval</span> <span class="str">'30 days'</span>
<span class="ln">6</span><span class="kw">GROUP BY</span> c.email
<span class="ln">7</span><span class="kw">ORDER BY</span> revenue <span class="kw">DESC</span><span class="caret"></span><span class="ghost"> LIMIT 20;</span></pre>
        <div class="ac" data-el="ac" hidden>
          <div class="ac-h">columns · customers c</div>
          <ul>
            <li class="on"><i>abc</i>email<em>text</em></li>
            <li><i>123</i>id<em>int8</em></li>
            <li><i>abc</i>tier<em>text</em></li>
            <li><i>cal</i>created_at<em>tstz</em></li>
          </ul>
        </div>
        <div class="rhead" data-el="rhead">
          <span class="ok" data-el="rdot">●</span> <b data-el="rcount">8 rows</b> <span data-el="rms">41 ms</span> <span>shop_prod</span>
          <span class="livetag" data-el="livetag"><i></i>live · refresh 2s</span>
        </div>
        <div class="grid">
          <table>
            <colgroup><col style="width:44%"><col style="width:16%"><col style="width:20%"><col></colgroup>
            <thead><tr><th>email</th><th>orders</th><th>revenue</th><th></th></tr></thead>
            <tbody data-el="rrows">
              <tr><td>ane.etxeberria@example.com</td><td class="num">14</td><td class="num">4 812.00</td><td></td></tr>
              <tr><td>l.moreau@example.fr</td><td class="num">9</td><td class="num">3 205.50</td><td></td></tr>
              <tr><td>studio@kaltenbach.de</td><td class="num">6</td><td class="num">2 970.00</td><td></td></tr>
              <tr><td>m.rossi@example.it</td><td class="num">11</td><td class="num">2 418.90</td><td></td></tr>
              <tr><td>hello@northlab.co</td><td class="num">3</td><td class="num">1 860.00</td><td></td></tr>
              <tr><td>j.okafor@example.com</td><td class="num">7</td><td class="num">1 533.20</td><td></td></tr>
              <tr><td>ops@ferrytickets.eu</td><td class="num">5</td><td class="num">1 402.75</td><td></td></tr>
              <tr><td>p.svensson@example.se</td><td class="num">4</td><td class="num">1 118.00</td><td></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="erd">
        <svg viewBox="0 0 640 340" aria-hidden="true">
          <path class="edge on" d="M 250 96 C 200 96, 210 78, 160 78"/>
          <path class="edge on" d="M 390 110 C 430 110, 420 84, 470 84"/>
          <path class="edge" d="M 470 112 C 440 112, 440 232, 470 232"/>
          <path class="edge" d="M 250 124 C 200 124, 220 262, 160 262"/>
          <g transform="translate(40 40)">
            <rect class="box" width="120" height="96" rx="6"/><rect class="head" width="120" height="22" rx="6"/>
            <text class="tn" x="10" y="15">customers</text>
            <text class="k" x="10" y="40">id</text><text x="98" y="40" text-anchor="end">int8</text>
            <text x="10" y="56">email</text><text x="98" y="56" text-anchor="end">text</text>
            <text x="10" y="72">created_at</text><text x="98" y="72" text-anchor="end">tstz</text>
            <text x="10" y="88">tier</text><text x="98" y="88" text-anchor="end">text</text>
          </g>
          <g transform="translate(250 60)">
            <rect class="box on" width="140" height="112" rx="6"/><rect class="head" width="140" height="22" rx="6"/>
            <text class="tn" x="10" y="15">orders</text>
            <text class="k" x="10" y="40">id</text><text x="128" y="40" text-anchor="end">int8</text>
            <text x="10" y="56">customer_id ↗</text><text x="128" y="56" text-anchor="end">int8</text>
            <text x="10" y="72">status</text><text x="128" y="72" text-anchor="end">text</text>
            <text x="10" y="88">total_cents</text><text x="128" y="88" text-anchor="end">int8</text>
            <text x="10" y="104">placed_at</text><text x="128" y="104" text-anchor="end">tstz</text>
          </g>
          <g transform="translate(470 40)">
            <rect class="box" width="130" height="96" rx="6"/><rect class="head" width="130" height="22" rx="6"/>
            <text class="tn" x="10" y="15">order_items</text>
            <text class="k" x="10" y="40">id</text><text x="118" y="40" text-anchor="end">int8</text>
            <text x="10" y="56">order_id ↗</text><text x="118" y="56" text-anchor="end">int8</text>
            <text x="10" y="72">product_id ↗</text><text x="118" y="72" text-anchor="end">int8</text>
            <text x="10" y="88">qty</text><text x="118" y="88" text-anchor="end">int4</text>
          </g>
          <g transform="translate(470 200)">
            <rect class="box" width="130" height="80" rx="6"/><rect class="head" width="130" height="22" rx="6"/>
            <text class="tn" x="10" y="15">products</text>
            <text class="k" x="10" y="40">id</text><text x="118" y="40" text-anchor="end">int8</text>
            <text x="10" y="56">sku</text><text x="118" y="56" text-anchor="end">text</text>
            <text x="10" y="72">price_cents</text><text x="118" y="72" text-anchor="end">int8</text>
          </g>
          <g transform="translate(40 230)">
            <rect class="box" width="120" height="64" rx="6"/><rect class="head" width="120" height="22" rx="6"/>
            <text class="tn" x="10" y="15">invoices</text>
            <text class="k" x="10" y="40">id</text><text x="98" y="40" text-anchor="end">int8</text>
            <text x="10" y="56">order_id ↗</text><text x="98" y="56" text-anchor="end">int8</text>
          </g>
          <g transform="translate(590 300)">
            <rect class="zoom" x="-52" width="24" height="24" rx="5"/><text x="-40" y="16" text-anchor="middle" style="fill:var(--w-text-2);font-size:13px">−</text>
            <rect class="zoom" x="-24" width="24" height="24" rx="5"/><text x="-12" y="16" text-anchor="middle" style="fill:var(--w-text-2);font-size:13px">+</text>
          </g>
        </svg>
      </div>

      <div class="journal">
        <header><b>Change journal</b><span>shop_prod · every commit, with its inverse</span></header>
        <div class="jwrap">
          <ul class="jlist">
            <li class="on"><span class="jt">09:41</span><span class="jk up">UPDATE</span><span class="jx">orders · 2 rows</span><span class="ju">Undo</span></li>
            <li><span class="jt">09:38</span><span class="jk del">DELETE</span><span class="jx">orders · 1 row</span><span class="ju">Undo</span></li>
            <li><span class="jt">09:22</span><span class="jk ins">INSERT</span><span class="jx">products · 1 row</span><span class="ju">Undo</span></li>
            <li><span class="jt">09:04</span><span class="jk snap">SNAPSHOT</span><span class="jx">orders_2026_09_11</span><span class="ju">Restore</span></li>
          </ul>
          <div class="jdetail">
            <small>Inverse of the selected entry</small>
<pre class="code"><span class="kw">UPDATE</span> public.orders <span class="kw">SET</span> status = <span class="str">'pending'</span> <span class="kw">WHERE</span> id = <span class="num">10432</span>;
<span class="kw">UPDATE</span> public.orders <span class="kw">SET</span> total_cents = <span class="num">1290</span> <span class="kw">WHERE</span> id = <span class="num">10435</span>;</pre>
            <div class="jfoot"><span>Captured before the write ran</span><span class="go">Undo <kbd>⌘Z</kbd></span></div>
          </div>
        </div>
      </div>

      <div class="guard" role="dialog" aria-label="Guardrail">
        <div class="gicon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M12 8v5M12 16v.5"/></svg></div>
        <header><b>This DELETE has no WHERE clause</b><span>shop_prod is marked <em>production</em></span></header>
<pre class="code"><span class="kw">DELETE FROM</span> public.orders;</pre>
        <p class="gwarn">It would remove all <b>1,248</b> rows. Taula will snapshot the table first.</p>
        <div class="gtype">Type <b>orders</b> to confirm <span class="gin" data-el="gtype">order<span class="caret"></span></span></div>
        <footer><span>Cancel <kbd>Esc</kbd></span><span class="go danger" data-el="grun">Run anyway</span></footer>
      </div>

      <div class="sheet" role="dialog" aria-label="Review changes">
        <header><b>Review changes</b><span data-el="sheet-count">3 statements · orders</span></header>
<pre class="code" data-el="sheet-sql"><span class="kw">UPDATE</span> public.orders <span class="kw">SET</span> status = <span class="str">'shipped'</span> <span class="kw">WHERE</span> id = <span class="num">10432</span>;
<span class="kw">UPDATE</span> public.orders <span class="kw">SET</span> total_cents = <span class="num">12900</span> <span class="kw">WHERE</span> id = <span class="num">10435</span>;
<span class="del"><span class="kw">DELETE FROM</span> public.orders <span class="kw">WHERE</span> id = <span class="num">10437</span>;</span></pre>
        <footer><span>Discard</span><span class="go" data-el="commit">Commit <kbd>⌘S</kbd></span></footer>
      </div>

      <div class="dim"></div>
      <div class="cmd" role="dialog" aria-label="Command bar">
        <div class="in"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="7" cy="7" r="4.5"/><path d="m10.5 10.5 3 3"/></svg><span data-el="cmdq">ord</span><span class="caret"></span></div>
        <ul data-el="cmdlist">
          <li class="on">${TBL}<mark>ord</mark>ers<span class="kind">table · public</span></li>
          <li>${TBL}<mark>ord</mark>er_items<span class="kind">table · public</span></li>
          <li><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3h10v10H3zM6 6h4M6 9h3"/></svg><mark>Ord</mark>ers last 7 days<span class="kind">snippet</span></li>
          <li><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/></svg>select * from <mark>ord</mark>ers where status = 'refunded'<span class="kind">history</span></li>
          <li><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3v10M3 8h10"/></svg>Insert row into <mark>ord</mark>ers<span class="kind">action</span></li>
          <li><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h10M3 8h10M3 12h6"/></svg>Snapshot <mark>ord</mark>ers<span class="kind">action</span></li>
        </ul>
      </div>
    </section>

    <aside class="agent">
      <header>Assistant <span class="model"><i></i>Qwen3 4B, local</span></header>
      <div class="msgs" data-el="msgs">
        <div class="u">which customers have unpaid orders older than 30 days?</div>
        <div class="a">
          <div class="tools"><span class="done">describe_table orders</span><span class="done">describe_table customers</span><span class="done">run_query</span></div>
<pre class="sql"><span class="kw">SELECT</span> c.email, <span class="kw">count</span>(*) <span class="kw">AS</span> unpaid
<span class="kw">FROM</span> orders o <span class="kw">JOIN</span> customers c <span class="kw">ON</span> c.id = o.customer_id
<span class="kw">WHERE</span> o.status = <span class="str">'pending'</span>
  <span class="kw">AND</span> o.placed_at &lt; now() - <span class="kw">interval</span> <span class="str">'30 days'</span>
<span class="kw">GROUP BY</span> c.email <span class="kw">ORDER BY</span> unpaid <span class="kw">DESC</span>;</pre>
          <div class="acts"><span class="go">Insert</span><span>Run</span><span>Copy</span></div>
          <div class="mini"><table>
            <thead><tr><th>email</th><th>unpaid</th></tr></thead>
            <tbody>
              <tr><td>ops@ferrytickets.eu</td><td class="num">4</td></tr>
              <tr><td>m.rossi@example.it</td><td class="num">2</td></tr>
              <tr><td>hello@northlab.co</td><td class="num">1</td></tr>
            </tbody>
          </table></div>
          <span>Three customers. Want me to mark these as overdue? That is a write, so I would show you the UPDATE first.</span>
        </div>
      </div>
      <div class="ask" data-el="ask">Ask about shop_prod <kbd>⌘L</kbd></div>
    </aside>
  </div>
  <div class="status">
    <span data-el="stable">orders</span>
    <span data-el="scount">16 of 1,248 rows</span>
    <span class="pendc" data-el="spend">3 pending changes</span>
    <span class="right"><span>Commit <kbd>⌘S</kbd></span><span>Search <kbd>⌘K</kbd></span></span>
  </div>
`;

var NOTE_COL = '.main > .grid col:nth-child(7), .main > .grid th:nth-child(7), .main > .grid td:nth-child(7)';

// The app collapses view labels when the strip runs out of room (only the
// active view keeps its word; Database and Assistant keep theirs — they are
// actions). A flex container's scrollWidth ignores main-axis overflow, so
// measure the children's boxes against the strip's content edge instead.
function setCompact(host){
  var tb = host.querySelector('.topbar');
  if (!tb) return;
  tb.dataset.compact = '0';
  var limit = tb.getBoundingClientRect().right - parseFloat(getComputedStyle(tb).paddingRight);
  var over = false;
  tb.querySelectorAll('*').forEach(function(el){
    if (!over && el.getBoundingClientRect().right > limit + 0.5) over = true;
  });
  if (over) tb.dataset.compact = '1';
}

function roomForNote(host){
  var cs = getComputedStyle(host);
  var rendered = host.getBoundingClientRect().width;
  var content = rendered / (parseFloat(cs.zoom) || 1);
  return rendered >= 700 && content / (parseFloat(cs.fontSize) || 12.5) >= 58;
}

function fill(host){
  var note = !host.hasAttribute('data-narrow') || roomForNote(host);
  host.dataset.note = note ? '1' : '0';
  host.innerHTML = tpl;
  setCompact(host);
  if (!note) host.querySelectorAll(NOTE_COL).forEach(function(n){ n.remove(); });
}

document.querySelectorAll('[data-win]').forEach(fill);
document.dispatchEvent(new CustomEvent('taula:windows'));

// Web fonts change text widths; re-measure once they are in.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function(){
    document.querySelectorAll('[data-win]').forEach(setCompact);
  });
}

var refit;
window.addEventListener('resize', function(){
  clearTimeout(refit);
  refit = setTimeout(function(){
    document.querySelectorAll('[data-win]').forEach(setCompact);
    document.querySelectorAll('[data-win][data-narrow]:not([data-live])').forEach(function(host){
      if ((host.dataset.note === '1') !== roomForNote(host)) fill(host);
    });
  }, 200);
});
})();
