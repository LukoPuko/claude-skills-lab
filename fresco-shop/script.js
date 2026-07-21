(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
   * Product data
   * ------------------------------------------------------------------- */

  var COLORS = [
    {
      id: 'slate',
      label: 'Slate',
      hex: '#4b5560',
      note: 'Standard. Anthrazit mit Slate Blue Akzenten.',
      image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ass4iKdEY6esxC3X2TBHE2ggP4/hf_20260717_102103_e07d62df-47a1-4be1-a756-7550796a200d.png'
    },
    {
      id: 'onyx',
      label: 'Onyx',
      hex: '#17181b',
      note: 'Tiefes Schwarz.',
      image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ass4iKdEY6esxC3X2TBHE2ggP4/hf_20260717_102854_d98d81cf-d658-4d3f-8068-88ca8a51a2d9.png'
    },
    {
      id: 'stone',
      label: 'Stone',
      hex: '#c9c7bf',
      note: 'Helles Steingrau.',
      image: 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ass4iKdEY6esxC3X2TBHE2ggP4/hf_20260717_102900_30c83086-e2c9-4db6-9e56-368cd19979c7.png'
    }
  ];

  var SIZES = [
    { id: 's', label: 'S', volume: '25L', price: 44.99 },
    { id: 'm', label: 'M', volume: '35L', price: 49.99, isDefault: true },
    { id: 'l', label: 'L', volume: '45L', price: 54.99 }
  ];

  var FEATURES = [
    {
      tag: 'Merkmal 01',
      title: 'Wasserdichtes Handtuchfach',
      body: 'IPX5 getestet mit Rolltop Verschluss. Das nasse Handtuch reist getrennt vom restlichen Gepäck, ohne dass Feuchtigkeit durchdringt.'
    },
    {
      tag: 'Merkmal 02',
      title: 'Ladeanschluss und LED Anzeige',
      body: 'USB-C Ladeanschluss mit rund drei Wochen Akkulaufzeit. Die LED Statusanzeige am Griff zeigt Akkustand und UV-C Zyklus auf einen Blick.'
    },
    {
      tag: 'Merkmal 03',
      title: 'Eingebaute UV-C Desinfektion',
      body: 'Ein Knopfdruck startet einen 10 Minuten Zyklus, der 99,9% der Keime im Innenraum reduziert. Kein Ausräumen nötig.'
    },
    {
      tag: 'Merkmal 04',
      title: 'Belüftetes Schuhfach',
      body: 'Eigenes Fach mit Lochblende, komplett getrennt vom Hauptfach. Luft zirkuliert, Gerüche bleiben draußen.'
    },
    {
      tag: 'Merkmal 05',
      title: 'Gekühltes Getränkefach',
      body: 'Isoliertes Fach hält Getränke spürbar länger kühl, direkt neben dem Hauptfach zugänglich.'
    }
  ];

  var GLB_URL = 'https://d3u0tzju9qaucj.cloudfront.net/7d051b5a-7bfe-49fe-a484-24e7b3a9458a/bbcfab8b-4936-4df2-a155-a20e1f9e1856.glb';
  var CART_STORAGE_KEY = 'fresco-cart-v1';

  /* ---------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------- */

  function euro(n) {
    return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  }

  function byId(id) { return document.getElementById(id); }

  function findColor(id) {
    for (var i = 0; i < COLORS.length; i++) if (COLORS[i].id === id) return COLORS[i];
    return COLORS[0];
  }
  function findSize(id) {
    for (var i = 0; i < SIZES.length; i++) if (SIZES[i].id === id) return SIZES[i];
    return SIZES[0];
  }

  /* ---------------------------------------------------------------------
   * Shop configurator state
   * ------------------------------------------------------------------- */

  var state = {
    color: COLORS[0].id,
    size: (SIZES.filter(function (s) { return s.isDefault; })[0] || SIZES[0]).id,
    qty: 1
  };

  var cart = [];

  function loadCart() {
    try {
      var raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) cart = JSON.parse(raw) || [];
    } catch (e) { cart = []; }
  }
  function saveCart() {
    try { window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }

  /* ---------------------------------------------------------------------
   * Shop configurator: render + interaction
   * ------------------------------------------------------------------- */

  var swatchesEl = byId('swatches');
  var swatchCaptionEl = byId('swatchCaption');
  var sizesEl = byId('sizes');
  var qtyValEl = byId('qtyVal');
  var unitTotalEl = byId('unitTotal');
  var shopPreviewEl = byId('shopPreview');
  var addFeedbackEl = byId('addFeedback');

  function renderSwatches() {
    swatchesEl.innerHTML = '';
    COLORS.forEach(function (c) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'swatch' + (c.id === state.color ? ' active' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', c.id === state.color ? 'true' : 'false');
      btn.setAttribute('aria-label', c.label);
      btn.dataset.color = c.id;
      var fill = document.createElement('span');
      fill.className = 'fill';
      fill.style.background = c.hex;
      btn.appendChild(fill);
      btn.addEventListener('click', function () {
        state.color = c.id;
        renderSwatches();
        updateShopPreview();
      });
      swatchesEl.appendChild(btn);
    });
    var active = findColor(state.color);
    swatchCaptionEl.innerHTML = '<strong>' + active.label + '</strong>. ' + active.note;
  }

  function renderSizes() {
    sizesEl.innerHTML = '';
    SIZES.forEach(function (s) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'size-opt' + (s.id === state.size ? ' active' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', s.id === state.size ? 'true' : 'false');
      btn.dataset.size = s.id;
      btn.innerHTML =
        '<span class="s-label">' + s.label + '</span>' +
        '<span class="s-meta mono">' + s.volume + '</span>' +
        '<span class="s-price mono">' + euro(s.price) + '</span>';
      btn.addEventListener('click', function () {
        state.size = s.id;
        renderSizes();
        updateShopPreview();
      });
      sizesEl.appendChild(btn);
    });
  }

  function updateShopPreview() {
    var imgs = shopPreviewEl.querySelectorAll('img');
    for (var i = 0; i < imgs.length; i++) {
      imgs[i].classList.toggle('active', imgs[i].dataset.color === state.color);
    }
    var size = findSize(state.size);
    unitTotalEl.textContent = euro(size.price * state.qty);
  }

  function setQty(next) {
    state.qty = Math.max(1, Math.min(9, next));
    qtyValEl.textContent = String(state.qty);
    updateShopPreview();
  }

  byId('qtyMinus').addEventListener('click', function () { setQty(state.qty - 1); });
  byId('qtyPlus').addEventListener('click', function () { setQty(state.qty + 1); });

  var addFeedbackTimer;
  byId('addToCartBtn').addEventListener('click', function () {
    var color = findColor(state.color);
    var size = findSize(state.size);
    var lineId = color.id + '-' + size.id;
    var existing = cart.filter(function (item) { return item.id === lineId; })[0];
    if (existing) {
      existing.qty += state.qty;
    } else {
      cart.push({
        id: lineId,
        colorId: color.id,
        colorLabel: color.label,
        colorHex: color.hex,
        sizeLabel: size.label,
        volume: size.volume,
        unitPrice: size.price,
        qty: state.qty
      });
    }
    saveCart();
    renderCart();
    openCart();

    addFeedbackEl.classList.add('show');
    clearTimeout(addFeedbackTimer);
    addFeedbackTimer = setTimeout(function () { addFeedbackEl.classList.remove('show'); }, 2400);
  });

  /* ---------------------------------------------------------------------
   * Cart drawer
   * ------------------------------------------------------------------- */

  var cartOverlay = byId('cartOverlay');
  var cartDrawer = byId('cartDrawer');
  var cartItemsEl = byId('cartItems');
  var cartSubtotalEl = byId('cartSubtotal');
  var cartCountEl = byId('cartCount');
  var checkoutBtn = byId('checkoutBtn');

  function cartTotalQty() {
    return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }
  function cartSubtotal() {
    return cart.reduce(function (sum, item) { return sum + item.qty * item.unitPrice; }, 0);
  }

  function renderCart() {
    var totalQty = cartTotalQty();
    cartCountEl.textContent = String(totalQty);
    cartCountEl.classList.toggle('show', totalQty > 0);
    checkoutBtn.disabled = cart.length === 0;

    if (cart.length === 0) {
      cartItemsEl.innerHTML =
        '<div class="cart-empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h8.2a2 2 0 0 0 2-1.6L21 8H6"/></svg>' +
        '<p>Dein Warenkorb ist leer.</p>' +
        '</div>';
      cartSubtotalEl.textContent = euro(0);
      return;
    }

    cartItemsEl.innerHTML = '';
    cart.forEach(function (item) {
      var row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML =
        '<span class="swatch-chip" style="background:' + item.colorHex + '"></span>' +
        '<div class="cart-item-body">' +
        '<div class="name">FRESCO</div>' +
        '<div class="meta">' + item.colorLabel + ', Größe ' + item.sizeLabel + ' (' + item.volume + ')</div>' +
        '<div class="cart-item-actions">' +
        '<div class="qty-stepper">' +
        '<button type="button" data-action="dec" aria-label="Menge verringern">−</button>' +
        '<span class="qty-val mono">' + item.qty + '</span>' +
        '<button type="button" data-action="inc" aria-label="Menge erhöhen">+</button>' +
        '</div>' +
        '<span class="cart-item-price mono">' + euro(item.qty * item.unitPrice) + '</span>' +
        '</div>' +
        '<button type="button" class="cart-item-remove" data-action="remove">Entfernen</button>' +
        '</div>';

      row.querySelector('[data-action="dec"]').addEventListener('click', function () {
        item.qty -= 1;
        if (item.qty <= 0) cart = cart.filter(function (i) { return i.id !== item.id; });
        saveCart(); renderCart();
      });
      row.querySelector('[data-action="inc"]').addEventListener('click', function () {
        item.qty += 1;
        saveCart(); renderCart();
      });
      row.querySelector('[data-action="remove"]').addEventListener('click', function () {
        cart = cart.filter(function (i) { return i.id !== item.id; });
        saveCart(); renderCart();
      });

      cartItemsEl.appendChild(row);
    });

    cartSubtotalEl.textContent = euro(cartSubtotal());
  }

  function openCart() {
    cartOverlay.classList.add('open');
    cartDrawer.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    cartOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
  }

  byId('cartOpenBtn').addEventListener('click', openCart);
  byId('cartCloseBtn').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', function () {
    closeCart();
    closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeCart(); closeModal(); }
  });

  /* ---------------------------------------------------------------------
   * Checkout (demo only, no real payment)
   * ------------------------------------------------------------------- */

  var checkoutModal = byId('checkoutModal');
  var modalOrderNumberEl = byId('modalOrderNumber');

  function openModal() { checkoutModal.classList.add('open'); }
  function closeModal() { checkoutModal.classList.remove('open'); }

  checkoutBtn.addEventListener('click', function () {
    if (cart.length === 0) return;
    var orderNumber = 'DEMO ' + Math.floor(100000 + Math.random() * 900000);
    modalOrderNumberEl.textContent = 'Bestellnummer ' + orderNumber;
    cart = [];
    saveCart();
    renderCart();
    closeCart();
    openModal();
  });
  byId('modalCloseBtn').addEventListener('click', closeModal);

  /* ---------------------------------------------------------------------
   * Feature explorer
   * ------------------------------------------------------------------- */

  var hotspots = Array.prototype.slice.call(document.querySelectorAll('.hotspot'));
  var explorerDetailEl = byId('explorerDetail');

  function renderFeature(index) {
    var f = FEATURES[index];
    explorerDetailEl.innerHTML =
      '<span class="tag mono">' + f.tag + '</span>' +
      '<h3>' + f.title + '</h3>' +
      '<p>' + f.body + '</p>' +
      '<div class="explorer-nav" id="explorerDots"></div>';

    var dotsEl = byId('explorerDots');
    FEATURES.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'explorer-dot' + (i === index ? ' active' : '');
      dot.textContent = String(i + 1);
      dot.setAttribute('aria-label', FEATURES[i].title);
      dot.addEventListener('click', function () { setActiveFeature(i); });
      dotsEl.appendChild(dot);
    });
  }

  function setActiveFeature(index) {
    hotspots.forEach(function (h) {
      h.classList.toggle('active', Number(h.dataset.feature) === index);
    });
    renderFeature(index);
  }

  hotspots.forEach(function (h) {
    h.addEventListener('click', function () { setActiveFeature(Number(h.dataset.feature)); });
  });

  /* ---------------------------------------------------------------------
   * Mobile nav toggle
   * ------------------------------------------------------------------- */

  var navToggle = byId('navToggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? '' : 'flex';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '64px';
      navLinks.style.right = '20px';
      navLinks.style.flexDirection = 'column';
      navLinks.style.background = 'rgba(10,12,16,0.92)';
      navLinks.style.border = '1px solid rgba(234,238,243,0.14)';
      navLinks.style.borderRadius = '16px';
      navLinks.style.padding = '8px';
      navLinks.style.backdropFilter = 'blur(16px)';
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { navLinks.style.display = ''; });
    });
  }

  /* ---------------------------------------------------------------------
   * Reveal on scroll
   * ------------------------------------------------------------------- */

  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------
   * Init
   * ------------------------------------------------------------------- */

  loadCart();
  renderSwatches();
  renderSizes();
  updateShopPreview();
  setQty(1);
  renderCart();
  renderFeature(0);

  /* ---------------------------------------------------------------------
   * 3D hero viewer (loaded dynamically; failures fall back to a static
   * product photo without affecting the rest of the page).
   * ------------------------------------------------------------------- */

  (function initViewer() {
    var wrap = byId('viewerWrap');
    var stage = byId('viewerStage');
    if (!wrap || !stage) return;

    function showFallback() {
      wrap.classList.add('loaded');
      wrap.classList.add('fallback');
    }

    if (!window.WebGLRenderingContext) { showFallback(); return; }

    var THREE_URL = 'https://unpkg.com/three@0.160.0/build/three.module.js';
    var GLTF_LOADER_URL = 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
    var ORBIT_CONTROLS_URL = 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';
    var ROOM_ENV_URL = 'https://unpkg.com/three@0.160.0/examples/jsm/environments/RoomEnvironment.js';

    Promise.all([
      import(/* webpackIgnore: true */ THREE_URL),
      import(/* webpackIgnore: true */ GLTF_LOADER_URL),
      import(/* webpackIgnore: true */ ORBIT_CONTROLS_URL),
      import(/* webpackIgnore: true */ ROOM_ENV_URL)
    ]).then(function (mods) {
      var THREE = mods[0];
      var GLTFLoader = mods[1].GLTFLoader;
      var OrbitControls = mods[2].OrbitControls;
      var RoomEnvironment = mods[3].RoomEnvironment;

      var width = stage.clientWidth || 480;
      var height = stage.clientHeight || 480;

      var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      stage.appendChild(renderer.domElement);

      var scene = new THREE.Scene();
      var camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
      camera.position.set(0, 0.15, 3.2);

      var pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      var key = new THREE.DirectionalLight(0xffffff, 1.15);
      key.position.set(3, 4, 2);
      scene.add(key);
      var rim = new THREE.DirectionalLight(0x5d84ac, 0.55);
      rim.position.set(-3, 1.5, -2);
      scene.add(rim);
      scene.add(new THREE.AmbientLight(0xffffff, 0.4));

      var controls = new OrbitControls(camera, renderer.domElement);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = Math.PI / 2 - 0.55;
      controls.maxPolarAngle = Math.PI / 2 + 0.45;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.rotateSpeed = 0.7;
      controls.autoRotate = !prefersReduced;
      controls.autoRotateSpeed = 1.0;

      var resumeTimer;
      controls.addEventListener('start', function () {
        controls.autoRotate = false;
        clearTimeout(resumeTimer);
      });
      controls.addEventListener('end', function () {
        if (prefersReduced) return;
        resumeTimer = setTimeout(function () { controls.autoRotate = true; }, 2200);
      });

      var loader = new GLTFLoader();
      loader.load(
        GLB_URL,
        function (gltf) {
          var model = gltf.scene;
          var box = new THREE.Box3().setFromObject(model);
          var size = new THREE.Vector3();
          box.getSize(size);
          var center = new THREE.Vector3();
          box.getCenter(center);
          model.position.sub(center);
          var maxDim = Math.max(size.x, size.y, size.z) || 1;
          model.scale.setScalar(1.7 / maxDim);
          scene.add(model);
          wrap.classList.add('loaded');
        },
        undefined,
        function (err) {
          console.warn('FRESCO: 3D Modell konnte nicht geladen werden, zeige Foto.', err);
          showFallback();
        }
      );

      function resize() {
        var w = stage.clientWidth, h = stage.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
      if ('ResizeObserver' in window) {
        new ResizeObserver(resize).observe(stage);
      } else {
        window.addEventListener('resize', resize);
      }

      var running = true;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          running = entries[0].isIntersecting;
        }, { threshold: 0.05 }).observe(stage);
      }

      function tick() {
        requestAnimationFrame(tick);
        if (!running) return;
        controls.update();
        renderer.render(scene, camera);
      }
      tick();
    }).catch(function (err) {
      console.warn('FRESCO: 3D Viewer konnte nicht geladen werden, zeige Foto.', err);
      showFallback();
    });
  })();

})();
