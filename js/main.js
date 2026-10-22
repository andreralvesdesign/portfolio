/* André Alves — comportamento do site (idioma, menu, aparecer ao fazer scroll) */
(function () {
  var doc = document, root = doc.documentElement;
  root.classList.add("js");

  /* ---------- idioma PT / EN ---------- */
  doc.querySelectorAll("[data-en]").forEach(function (n) { n.setAttribute("data-pt", n.innerHTML); });
  var currentLang = "pt";
  function translateIn(scope, l) {      // consulta fresca: os textos "escritos" são recriados no fim da animação
    var list = [].slice.call(scope.querySelectorAll("[data-en]"));
    if (scope.getAttribute && scope.hasAttribute("data-en")) list.push(scope);
    list.forEach(function (n) { n.innerHTML = n.getAttribute(l === "en" ? "data-en" : "data-pt"); });
  }
  function applyLang(l) {
    currentLang = l === "en" ? "en" : "pt";
    translateIn(doc, l);
    root.lang = l === "en" ? "en" : "pt-PT";
    doc.querySelectorAll("[data-aria-en]").forEach(function (n) {
      if (!n._ariaPt) n._ariaPt = n.getAttribute("aria-label");
      n.setAttribute("aria-label", l === "en" ? n.getAttribute("data-aria-en") : n._ariaPt);
    });
    var cur = doc.querySelector(".lang-current"), lb = doc.querySelector(".lang-btn");
    if (cur) cur.textContent = l === "en" ? "English" : "Português";
    if (lb) {
      var fl = lb.querySelector(".lang-flag"); if (fl) fl.src = lb.getAttribute(l === "en" ? "data-flag-en" : "data-flag-pt");
      lb.setAttribute("aria-label", l === "en" ? "Change language to Português" : "Mudar idioma para English");
    }
    try { localStorage.setItem("lang", l); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  if (saved === "en") applyLang("en");

  var btn = doc.querySelector(".lang-btn");
  function closeLang() {}
  if (btn) btn.addEventListener("click", function () { applyLang(currentLang === "en" ? "pt" : "en"); });   // clicar passa logo para o idioma seguinte
  doc.addEventListener("click", function (e) {
    var b = e.target.closest("[data-set-lang]");
    if (b) { applyLang(b.getAttribute("data-set-lang")); closeMenu(); }
  });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeLang(); closeMenu(); } });

  /* ---------- texto a "escrever" ----------
     cada letra aparece em sequência; curto (<= 0,7 s) mesmo em parágrafos longos.
     No fim volta ao texto original, para a composição final ser exatamente a normal. */
  var typers = [].slice.call(doc.querySelectorAll("[data-type]"));
  if (typers.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var splitText = function (el) {
      var walker = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT), nodesT = [], n;
      while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodesT.push(n);
      var chars = [];
      nodesT.forEach(function (tn) {
        var frag = doc.createDocumentFragment();
        tn.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(doc.createTextNode(part)); return; }
          var w = doc.createElement("span"); w.style.cssText = "display:inline-block;white-space:nowrap";
          Array.from(part).forEach(function (ch) {
            var c = doc.createElement("span"); c.className = "c"; c.textContent = ch; w.appendChild(c); chars.push(c);
          });
          frag.appendChild(w);
        });
        tn.parentNode.replaceChild(frag, tn);
      });
      return chars;
    };
    // blocos de texto que "pertencem juntos" (data-type-group) escrevem-se como um só texto contínuo:
    // as letras de todos os elementos do bloco ficam numa única sequência, do primeiro ao último
    var groups = [];
    typers.forEach(function (el) {
      var key = el.closest("[data-type-group]") || el, g = null;
      groups.forEach(function (x) { if (x.key === key) g = x; });
      if (!g) { g = { key: key, els: [] }; groups.push(g); }
      g.els.push(el);
    });
    groups.forEach(function (g) {
      var all = [];
      g.els.forEach(function (el) { el._orig = el.innerHTML; all = all.concat(splitText(el)); });
      var cap = g.els.length > 1 ? 1.2 : 0.7;
      g.total = Math.min(cap, all.length * 0.035);
      all.forEach(function (c, i) { c.style.setProperty("--cd", (all.length > 1 ? i * g.total / (all.length - 1) : 0).toFixed(3) + "s"); });
    });
    groups.forEach(function (g) { g.els.forEach(function (el) { var f = el.querySelector(".c"); if (f) el.style.setProperty("--bd", f.style.getPropertyValue("--cd") || "0s"); }); });
    root.classList.add("typing-on");
    var play = function (g) {
      if (g.started) return; g.started = true;
      requestAnimationFrame(function () { requestAnimationFrame(function () { g.els.forEach(function (el) { el.classList.add("go"); }); }); });
      setTimeout(function () { g.els.forEach(function (el) { if (el.querySelector(".c")) { el.innerHTML = el._orig; translateIn(el, currentLang); } el.classList.add("typed"); el.classList.remove("go"); }); }, (g.total + 0.5) * 1000);
    };
    var tio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        tio.unobserve(e.target);
        groups.forEach(function (g) { if (g.els.indexOf(e.target) > -1) play(g); });
      });
    }, { rootMargin: "0px 0px -5% 0px" }) : null;
    groups.forEach(function (g) { if (tio) tio.observe(g.els[0]); else play(g); });
    // segurança: se nada disparar, mostra o texto normal
    setTimeout(function () { typers.forEach(function (el) { if (!el.classList.contains("go") && el.querySelector(".c") && !el._done) { el.classList.add("go"); } }); }, 3000);
  }

  /* ---------- scroll suave (Lenis) ----------
     só com rato/trackpad (no telemóvel mantém o scroll nativo); desligado com movimento reduzido */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({ duration: 1.5, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(performance.now());
  }

  /* ---------- círculos flutuantes: voltar ao topo + contacto ---------- */
  var toTop = doc.querySelector("[data-to-top]");
  if (toTop) {
    var topShown = false, topTick = false;
    var updateTop = function () {
      var show = window.scrollY > 500;
      if (show === topShown) return;
      topShown = show; toTop.classList.toggle("show", show);
      toTop.tabIndex = show ? 0 : -1; toTop.setAttribute("aria-hidden", show ? "false" : "true");
    };
    window.addEventListener("scroll", function () {
      if (topTick) return; topTick = true;
      requestAnimationFrame(function () { topTick = false; updateTop(); });
    }, { passive: true });
    toTop.addEventListener("click", function () { if (lenis) lenis.scrollTo(0, { duration: 1.8 }); else window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
    toTop.tabIndex = -1; toTop.setAttribute("aria-hidden", "true");
    updateTop();
  }

  var dlg = doc.getElementById("contact");
  if (dlg && dlg.showModal) {
    var cform = dlg.querySelector("form"), cstatus = dlg.querySelector(".contact-status"), csend = dlg.querySelector(".contact-send"), cfocus = null;
    var T = function (pt, en) { return root.lang === "en" ? en : pt; };
    var setStatus = function (kind, text, html) {
      cstatus.className = "contact-status" + (kind ? " " + kind : "");
      if (html) cstatus.innerHTML = text; else cstatus.textContent = text;
    };
    doc.querySelectorAll("[data-open-contact]").forEach(function (b) {
      b.addEventListener("click", function () {
        cfocus = b; setStatus("", ""); doc.body.style.overflow = "hidden"; if (lenis) lenis.stop(); dlg.showModal(); cform.email.focus();
      });
    });
    dlg.querySelector("[data-close-contact]").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });      // clique fora do formulário
    dlg.addEventListener("close", function () { doc.body.style.overflow = ""; if (lenis) lenis.start(); if (cfocus) cfocus.focus(); });

    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = cform.email.value.trim(), msg = cform.message.value.trim(), to = cform.getAttribute("data-to");
      cform.email.removeAttribute("aria-invalid"); cform.message.removeAttribute("aria-invalid");
      var bad = [];
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.push(cform.email);
      if (!msg) bad.push(cform.message);
      if (bad.length) {
        bad.forEach(function (f) { f.setAttribute("aria-invalid", "true"); });
        setStatus("err", T("Verifique o endereço de email e a mensagem.", "Please check your email address and message."));
        bad[0].focus(); return;
      }
      if (cform._gotcha && cform._gotcha.value) return;                                       // campo-armadilha para robôs
      var subject = T("Mensagem enviada através do portefólio", "Message sent through the portfolio");
      var endpoint = cform.getAttribute("data-endpoint");
      if (!endpoint) {                                                                         // sem serviço ligado: abre o programa de email
        location.href = "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(msg + "\n\n— " + email);
        setStatus("ok", T("A abrir a sua aplicação de email…", "Opening your email application…"));
        return;
      }
      csend.disabled = true; setStatus("", T("A enviar a mensagem…", "Sending your message…"));
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(Object.assign({ name: T("Contacto através do portefólio", "Portfolio enquiry"), email: email, message: msg, _subject: subject, subject: subject, _replyto: email }, cform.getAttribute("data-key") ? { access_key: cform.getAttribute("data-key") } : {})) })
        .then(function (r) { if (!r.ok) throw new Error("x"); setStatus("ok", T("Mensagem enviada com sucesso. Obrigado pelo contacto.", "Message sent successfully. Thank you for getting in touch.")); cform.reset(); })
        .catch(function () {
          setStatus("err", T("Não foi possível enviar a mensagem. Tente novamente ou escreva diretamente para ", "The message could not be sent. Please try again or write directly to ") + '<a href="mailto:' + to + '">' + to + "</a>", true);
        })
        .then(function () { csend.disabled = false; });
    });
  }

  /* ---------- grão de película animado na imagem de topo ----------
     O shader é o do original (Squarespace, efeito "film grain"), tal e qual: o brilho de cada pixel é modulado
     por ruído simplex novo a cada imagem (intensidade em data-grain, em %; velocidade 100: uTime sobe 0,01 por imagem).
     Desenhado em WebGL; sem WebGL ou com movimento reduzido fica a imagem normal (ou, com o gradiente, uma camada de ruído 2D). */
  (function () {
    var hero = doc.querySelector(".project-hero[data-grain]");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var img = hero.querySelector("img.hero-media, video.hero-media"), isVideo = !!img && img.tagName === "VIDEO";   // a imagem de topo pode ser uma imagem ou um vídeo
    if (!img) return;
    var intensity = parseFloat(hero.getAttribute("data-grain")) / 100;
    var focal = (hero.getAttribute("data-focal") || "50,50").split(",").map(function (v) { return parseFloat(v) / 100; });
    // Reserva sem WebGL (ou quando o browser não deixa ler a imagem, p.ex. ao abrir os ficheiros diretamente do disco):
    // camadas de ruído em mosaico, trocadas várias vezes por segundo, misturadas com a imagem.
    function fallbackGrain() {
      var tiles = [], N = 8, S = 256;
      for (var k = 0; k < N; k++) {
        var c2 = doc.createElement("canvas"); c2.width = c2.height = S;
        var x = c2.getContext("2d"), d = x.createImageData(S, S);
        for (var i = 0; i < d.data.length; i += 4) { var vv = 128 + (Math.random() + Math.random() - 1) * 110; d.data[i] = d.data[i + 1] = d.data[i + 2] = vv; d.data[i + 3] = 255; }
        x.putImageData(d, 0, 0); tiles.push("url(" + c2.toDataURL("image/png") + ")");
      }
      var g = doc.createElement("div"); g.className = "hero-grain hero-grain-css"; g.setAttribute("aria-hidden", "true");
      g.style.opacity = String(intensity * 0.5);
      hero.appendChild(g);
      var n = 0, vis = true, timer = 0;
      function tick() { n++; g.style.backgroundImage = tiles[n % N]; g.style.backgroundPosition = (Math.random() * S | 0) + "px " + (Math.random() * S | 0) + "px"; }
      function run() { if (!timer) timer = setInterval(function () { if (vis) tick(); }, 42); }
      tick(); run();
      if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(hero);
    }
    if (hero.querySelector(".hero-gradient")) { fallbackGrain(); return; }   // com o gradiente animado, o grão vai por cima de tudo
    var cv = doc.createElement("canvas");
    cv.className = "hero-grain"; cv.setAttribute("aria-hidden", "true");
    var gl = cv.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false });
    if (!gl) { fallbackGrain(); return; }
    // vUv = coordenadas da imagem já com o enquadramento "cover" + ponto focal (calculadas no vértice)
    var vs = "attribute vec2 p; uniform vec2 uRes; uniform vec2 uImgSize; uniform vec2 uFocal; varying vec2 vUv;" +
      "void main(){ gl_Position = vec4(p, 0.0, 1.0);" +
      "  float scale = max(uRes.x / uImgSize.x, uRes.y / uImgSize.y);" +
      "  vec2 d = uImgSize * scale; vec2 off = (uRes - d) * uFocal;" +
      "  vec2 px = vec2((0.5 * p.x + 0.5) * uRes.x, (0.5 - 0.5 * p.y) * uRes.y);" +
      "  vUv = (px - off) / d; vUv.y = 1.0 - vUv.y; }";
    var fs = "precision highp float;" + "\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec3 mod289_692612174(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289_692612174(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute_692612174(vec4 x) {\n     return mod289_692612174(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt_692612174(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n  {\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D_692612174 = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g_692612174 = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g_692612174;\n  vec3 i1 = min( g_692612174.xyz, l.zxy );\n  vec3 i2 = max( g_692612174.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D_692612174.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289_692612174(i);\n  vec4 p = permute_692612174( permute_692612174( permute_692612174(\n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D_692612174.wyz - D_692612174.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1_692612174 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0_692612174 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1_692612174.xy,h.z);\n  vec3 p3 = vec3(a1_692612174.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt_692612174(vec4(dot(p0_692612174,p0_692612174), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0_692612174 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0_692612174,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n  }\n\n#define V_SEED_X 12.9898\n#define V_SEED_Y 78.233\n#define R_SEED 43758.5453\n\nuniform sampler2D uImage;\nuniform float uDepth;\nuniform float uNoise;\nuniform float uTime;\nuniform vec2 uResolution;\n\nvarying vec2 vUv;\n\nfloat luma(vec4 color) {\n  return dot(color.rgb, vec3(0.299, 0.587, 0.114));\n}\n\nfloat rand(vec2 co){\n  return fract(sin(dot(co.xy, vec2(V_SEED_X, V_SEED_Y))) * R_SEED);\n}\n\nfloat filmGrain(vec2 uv) {\n  float random = rand(uv + uTime);\n  return snoise(vec3(uv, random) + random);\n}\n\nvoid main (void) {\n  vec4 origin = texture2D(uImage, vUv);\n  float grain = filmGrain(vUv * uResolution);\n  vec3 color = origin.rgb;\n\n  color *= 1.0 + (grain * uNoise * (-1.0 + uDepth + luma(origin) * 0.75));\n\n  vec4 tx = vec4(color, origin.a);\n  tx.xyz *= tx.a;\n\n  gl_FragColor = tx;\n}\n";
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) { fallbackGrain(); return; }
    var prog = gl.createProgram(); gl.attachShader(prog, v); gl.attachShader(prog, f); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { fallbackGrain(); return; }
    gl.useProgram(prog);
    var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ["uImage", "uRes", "uResolution", "uImgSize", "uFocal", "uTime", "uNoise", "uDepth"].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });
    var tex = gl.createTexture(), ready = false, visible = true, raf = 0, time = 0;
    function resize() {
      var r = hero.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      cv.width = Math.max(1, Math.round(r.width * dpr)); cv.height = Math.max(1, Math.round(r.height * dpr));
      gl.viewport(0, 0, cv.width, cv.height);
    }
    function frame() {
      raf = 0; if (!ready || !visible) return;
      if (isVideo && img.readyState >= 2) { gl.bindTexture(gl.TEXTURE_2D, tex); try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); } catch (e) {} }   // vídeo: a imagem do vídeo entra no shader a cada imagem
      time += 1e-4 * 100;                                                              // velocidade 100, como no original (uTime += 1e-4 * speed por imagem)
      gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform2f(U.uResolution, cv.width, cv.height); gl.uniform2f(U.uImgSize, isVideo ? img.videoWidth : img.naturalWidth, isVideo ? img.videoHeight : img.naturalHeight);
      gl.uniform2f(U.uFocal, focal[0], focal[1]); gl.uniform1f(U.uTime, time);
      gl.uniform1f(U.uNoise, 0.01 * (intensity * 100)); gl.uniform1f(U.uDepth, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(frame);
    }
    function start() { if (!raf) raf = requestAnimationFrame(frame); }
    function load() {
      if (isVideo ? !img.videoWidth : !img.naturalWidth) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img); } catch (e) { ready = false; fallbackGrain(); return; }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(U.uImage, 0);
      hero.appendChild(cv); resize(); ready = true; start();
    }
    if (isVideo) { if (img.readyState >= 2) load(); else img.addEventListener("loadeddata", load); }   // vídeo: o poster fica à vista até haver a primeira imagem
    else if (img.complete) load(); else img.addEventListener("load", load);
    window.addEventListener("resize", function () { if (ready) resize(); });
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }).observe(hero);   // só desenha quando está à vista
  })();

  /* ---------- imagens com vídeo do Vimeo: o play troca a imagem pelo leitor, no mesmo espaço ----------
     O leitor fica sempre ativo (controlos ao passar o rato), mas uma camada transparente cobre a parte de cima
     para a roda do rato continuar a fazer scroll suave por cima do vídeo; um clique nessa camada faz play/pausa.
     A faixa de baixo fica livre para os controlos do próprio leitor. */
  var vimeoSdk = null;
  function loadVimeoSdk() {
    if (!vimeoSdk) vimeoSdk = new Promise(function (resolve) {
      if (window.Vimeo) return resolve(window.Vimeo);
      var s = doc.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@vimeo/player@2.29.0/dist/player.min.js";
      s.onload = function () { resolve(window.Vimeo); };
      s.onerror = function () { resolve(null); };
      doc.head.appendChild(s);
    });
    return vimeoSdk;
  }
  doc.querySelectorAll(".play-btn[data-vimeo]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.parentNode, f = doc.createElement("iframe");
      f.className = "vimeo-frame";
      f.src = "https://player.vimeo.com/video/" + btn.getAttribute("data-vimeo") + "?autoplay=1&dnt=1&title=0&byline=0&portrait=0";
      f.allow = "autoplay; fullscreen; picture-in-picture";
      f.setAttribute("allowfullscreen", "");
      f.title = "Vídeo";
      box.appendChild(f); btn.remove();
      if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;   // em ecrãs de toque não há scroll suave: o leitor fica livre
      var shield = doc.createElement("div");
      shield.className = "vimeo-shield"; shield.setAttribute("aria-hidden", "true");
      box.appendChild(shield);
      loadVimeoSdk().then(function (V) {
        if (!V) { shield.remove(); return; }   // sem o SDK, o leitor fica livre (controlos normais)
        var player; try { player = new V.Player(f); } catch (e) { shield.remove(); return; }
        shield.addEventListener("click", function () {
          player.getPaused().then(function (p) { return p ? player.play() : player.pause(); }).catch(function () {});
        });
      });
    });
  });

  /* ---------- menu do telemóvel ---------- */
  var burger = doc.querySelector(".burger"), mobile = doc.querySelector(".mobile-menu");
  function closeMenu() {
    if (!mobile || mobile.hidden) return;
    mobile.hidden = true; burger.setAttribute("aria-expanded", "false"); doc.body.classList.remove("menu-open"); if (lenis) lenis.start();
  }
  if (burger) burger.addEventListener("click", function () {
    var open = mobile.hidden;
    mobile.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    doc.body.classList.toggle("menu-open", open);
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
  });

  /* ---------- aparecer suavemente ao entrar no ecrã ---------- */
  var items = doc.querySelectorAll(".fade");
  // cascata: elementos lado a lado (ou em sequência no mesmo bloco) entram uns a seguir aos outros
  items.forEach(function (n) {
    var sibs = [].filter.call(n.parentNode.children, function (c) { return c.classList.contains("fade"); });
    var i = sibs.indexOf(n);
    if (n.parentNode.classList.contains("portfolio-grid")) i = i % 2;   // na grelha da home a cascata é por coluna
    if (sibs.length > 1 && i > 0 && !n.classList.contains("clip")) n.style.setProperty("--d", Math.min(i * 0.09, 0.36) + "s");   // imagens/vídeos (clip) entram todos ao mesmo tempo
  });
  // ao entrar numa página: tudo o que já está à vista (textos, cabeçalho, imagem de topo) aparece de imediato, em corte seco;
  // só as imagens/vídeos (clip) e o que está mais abaixo animam ao aparecer
  items.forEach(function (n) {
    if (n.classList.contains("clip")) return;
    if (n.getBoundingClientRect().top < window.innerHeight) {
      n.style.transition = "none";
      n.classList.add("in");
      requestAnimationFrame(function () { requestAnimationFrame(function () { n.style.transition = ""; }); });
    }
  });
  if ("IntersectionObserver" in window) {
    var fired = false;
    var io = new IntersectionObserver(function (es) {
      fired = true;
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -5% 0px" });
    items.forEach(function (n) { io.observe(n); });
    // segurança: se o browser nunca chegar a avisar, mostra tudo (nada fica invisível)
    setTimeout(function () { if (!fired) items.forEach(function (n) { n.classList.add("in"); }); }, 2500);
  } else {
    items.forEach(function (n) { n.classList.add("in"); });
  }

  /* carrossel dos logos: abranda suavemente ao passar o rato e volta à velocidade normal ao sair */
  var logos = doc.querySelector(".logos");
  if (logos && logos.getAnimations) {
    var rate = 1, target = 1, raf = 0;
    function setRate(r) {
      logos.querySelectorAll(".marquee-track").forEach(function (t) {
        t.getAnimations().forEach(function (a) { a.playbackRate = r; });
      });
    }
    function step() {
      rate += (target - rate) * 0.08;                       // aproximação suave, sem saltos
      if (Math.abs(target - rate) < 0.005) rate = target;
      setRate(rate);
      raf = rate === target ? 0 : requestAnimationFrame(step);
    }
    function slowTo(r) { target = r; if (!raf) raf = requestAnimationFrame(step); }
    logos.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") slowTo(0.25); });
    logos.addEventListener("pointerleave", function () { slowTo(1); });
  }

  /* vídeos: só tocam quando estão visíveis (poupa bateria e dados) */
  if ("IntersectionObserver" in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
        else e.target.pause();
      });
    }, { rootMargin: "700px 0px" });   // começam a carregar e a tocar antes de chegarem ao ecrã, para já estarem a andar quando a imagem se revela
    doc.querySelectorAll("video:not([data-sync])").forEach(function (v) { vio.observe(v); });
  }

  /* vídeos sincronizados (antes e depois): os do mesmo grupo têm exatamente a mesma duração.
     São descarregados INTEIROS (~1 MB cada) em segundo plano logo depois de a página abrir e tocam a partir da memória:
     arrancam juntos, sem paragens para carregar. Depois só se corrigem com um pequeno acelerar/abrandar, nunca com saltos. */
  var syncGroups = {};
  doc.querySelectorAll("video[data-sync]").forEach(function (v) {
    var k = v.getAttribute("data-sync"); (syncGroups[k] = syncGroups[k] || []).push(v);
  });
  Object.keys(syncGroups).forEach(function (k) {
    var vids = syncGroups[k], running = false, timer = 0, startedAt = 0, loading = null;
    function fetchOne(v) {
      var url = v.getAttribute("data-src");
      return fetch(url, { priority: "low" }).then(function (r) { if (!r.ok) throw new Error("http"); return r.blob(); }).then(function (blob) {
        return new Promise(function (resolve) {
          v.preload = "auto";
          v.addEventListener("canplaythrough", function f() { v.removeEventListener("canplaythrough", f); resolve(); });
          v.src = URL.createObjectURL(blob); v.load();
        });
      });
    }
    function loadAll() {
      if (!loading) loading = Promise.all(vids.map(fetchOne)).catch(function () {   // sem fetch/blob: carrega pelo método normal
        vids.forEach(function (v) { if (!v.getAttribute("src")) { v.preload = "auto"; v.src = v.getAttribute("data-src"); } });
        return new Promise(function (resolve) { setTimeout(resolve, 2500); });
      });
      return loading;
    }
    function playAll() { vids.forEach(function (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }); }
    function startAll() {
      if (running) return; running = true;
      loadAll().then(function () {
        if (!running) return;
        try { vids.forEach(function (v) { v.currentTime = 0; v.playbackRate = 1; }); } catch (e) {}
        playAll(); startedAt = Date.now();
        timer = setInterval(check, 400);
      });
    }
    function stopAll() { running = false; clearInterval(timer); vids.forEach(function (v) { v.pause(); v.playbackRate = 1; }); }
    function check() {
      if (Date.now() - startedAt < 1500) return;                   // deixa estabilizar logo depois de arrancar
      var master = vids[0], dur = master.duration || 1;
      vids.slice(1).forEach(function (v) {
        if (v.paused && !v.ended) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        var d = v.currentTime - master.currentTime;                // >0: está à frente do primeiro
        if (d > dur / 2) d -= dur; else if (d < -dur / 2) d += dur; // o vídeo repete, por isso a diferença é circular
        if (Math.abs(d) > 0.6) { try { v.currentTime = master.currentTime; } catch (e) {} v.playbackRate = 1; }   // desvio grande (raro): um único salto
        else if (Math.abs(d) > 0.06) v.playbackRate = 1 - Math.max(-0.08, Math.min(0.08, d * 0.5));            // desvio pequeno: acelera ou abranda um pouco
        else v.playbackRate = 1;
      });
    }
    window.addEventListener("load", function () { setTimeout(loadAll, 1200); });   // descarrega já em segundo plano, antes de chegares lá abaixo
    if ("IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.target._vis = e.isIntersecting; });
        if (vids.some(function (v) { return v._vis; })) startAll(); else stopAll();
      }, { rootMargin: "400px 0px" });
      vids.forEach(function (v) { sio.observe(v); });
    } else startAll();
  });
})();
