(function(){
  // Nav hairline once the page has scrolled.
  var nav = document.getElementById('nav');
  var onScroll = function(){ nav.classList.toggle('scrolled', window.scrollY > 8); };
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  // Product menu: hover opens it on desktop (CSS); a click toggles it for touch and keyboards.
  document.querySelectorAll('.menu > button').forEach(function(btn){
    var menu = btn.parentNode;
    btn.addEventListener('click', function(){
      var open = menu.toggleAttribute('data-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function(e){
      if (!menu.contains(e.target)) { menu.removeAttribute('data-open'); btn.setAttribute('aria-expanded','false'); }
    });
    menu.addEventListener('keydown', function(e){ if (e.key === 'Escape') { menu.removeAttribute('data-open'); btn.setAttribute('aria-expanded','false'); btn.focus(); } });
  });

  // Scroll-driven showcase: the step nearest the middle of the viewport owns the window.
  var win = document.getElementById('stage-win');
  var steps = Array.prototype.slice.call(document.querySelectorAll('#steps .step'));
  if (win && steps.length && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting || win.dataset.state === e.target.dataset.state) return;
        win.dataset.state = e.target.dataset.state;
        steps.forEach(function(s){ s.classList.toggle('on', s === e.target); });
      });
    }, {rootMargin:'-45% 0px -45% 0px', threshold:0});
    steps.forEach(function(s){ io.observe(s); });
  }

  // Docs / FAQ side nav: highlight the section in view.
  var toc = document.getElementById('toc');
  if (toc && 'IntersectionObserver' in window){
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var byId = {};
    links.forEach(function(a){ byId[a.getAttribute('href').slice(1)] = a; });
    var tio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        links.forEach(function(a){ a.classList.remove('on'); });
        var a = byId[e.target.id]; if (a) a.classList.add('on');
      });
    }, {rootMargin:'-20% 0px -70% 0px', threshold:0});
    Object.keys(byId).forEach(function(id){ var el = document.getElementById(id); if (el) tio.observe(el); });
  }

  var reduce = window.matchMedia ? matchMedia('(prefers-reduced-motion:reduce)').matches : false;

  // Sections and cards arrive as you reach them, staggered inside each group.
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (reveals.length){
    if (reduce || !('IntersectionObserver' in window)){
      reveals.forEach(function(n){ n.classList.add('in'); });
    } else {
      var rio = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (!e.isIntersecting) return;
          rio.unobserve(e.target);
          e.target.classList.add('in');
        });
      }, {rootMargin:'0px 0px -12% 0px', threshold:0.08});
      reveals.forEach(function(n){ rio.observe(n); });
      document.querySelectorAll('[data-stagger]').forEach(function(group){
        Array.prototype.slice.call(group.children).forEach(function(child, i){
          if (child.hasAttribute('data-reveal')) child.style.setProperty('--d', (i * 0.07) + 's');
        });
      });
    }
  }

  // A hairline that tracks how far down the page you are.
  var prog = document.querySelector('.prog');
  if (prog && !reduce){
    var onProg = function(){
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
    };
    onProg(); window.addEventListener('scroll', onProg, {passive:true});
    window.addEventListener('resize', onProg);
  }

  // The showcase rail fills as the steps scroll past.
  var rail = document.querySelector('.steps .rail');
  var stepsWrap = document.getElementById('steps');
  if (rail && stepsWrap && !reduce){
    var onRail = function(){
      var r = stepsWrap.getBoundingClientRect();
      var mid = window.innerHeight * 0.5;
      var p = (mid - r.top) / r.height;
      rail.style.height = Math.max(0, Math.min(1, p)) * r.height + 'px';
    };
    onRail(); window.addEventListener('scroll', onRail, {passive:true});
    window.addEventListener('resize', onRail);
  }

  // Numbers count up once, when their strip comes into view.
  var counts = Array.prototype.slice.call(document.querySelectorAll('.count[data-to]'));
  if (counts.length && 'IntersectionObserver' in window && !reduce){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var node = e.target;
        var to = parseFloat(node.dataset.to);
        var suffix = node.dataset.suffix || '';
        var t0 = performance.now(), dur = 1100;
        (function step(now){
          var k = Math.min(1, (now - t0) / dur);
          var eased = 1 - Math.pow(1 - k, 3);
          node.textContent = Math.round(to * eased).toLocaleString('en-US').replace(/,/g, ' ') + suffix;
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, {threshold:0.5});
    counts.forEach(function(n){ cio.observe(n); });
  }

  // The hero window picks up a soft highlight from the pointer.
  var glowHost = document.querySelector('.hero-stage');
  if (glowHost && !reduce && matchMedia('(pointer:fine)').matches){
    glowHost.addEventListener('pointermove', function(e){
      var r = glowHost.getBoundingClientRect();
      glowHost.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
      glowHost.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      glowHost.classList.add('lit');
    });
    glowHost.addEventListener('pointerleave', function(){ glowHost.classList.remove('lit'); });
  }

  // Product video: show it once the file actually loads; otherwise keep the placeholder.
  var v = document.getElementById('demo'), ph = document.getElementById('demo-ph');
  if (v && ph){
    v.addEventListener('loadedmetadata', function(){ v.hidden = false; ph.hidden = true; });
    ph.addEventListener('click', function(){ v.hidden = false; v.play && v.play().catch(function(){ v.hidden = true; }); });
  }
})();
