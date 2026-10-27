// Üretim rehberi: assets/data/uretim.json'u okur, her adımı "girdi → tezgâh → ürün" kartı olarak çizer.
// Üstte bölüm sekmeleri ve arama var; arama bütün bölümlerde eşya ve tezgâh adlarına bakar.
// JSON, sitedeki yerel tools/uretim_to_site.py ile mb-mod'daki docs/uretim.json'dan üretiliyor.

(function () {
  var list = document.getElementById("prod-list");
  if (!list) return;

  var tabsBox = document.getElementById("prod-tabs");
  var q = document.getElementById("prod-q");
  var status = document.getElementById("prod-status");
  var img = "../../assets/img/rp/craft/";
  var sections = [], current = "";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function norm(s) { return s.toLocaleLowerCase("tr-TR").replace(/ı/g, "i"); }

  // Tek bir ikon: eşya ya da tezgâh. Zanaat'ta malzeme olan ürünler oraya bağlanır.
  function tile(name, icon, count, kind, link) {
    var t = el(link ? "a" : "div", "prod-tile " + kind);
    if (link) {
      t.href = "../zanaat/?malzeme=" + encodeURIComponent(name);
      t.title = name + " isteyen tarifleri zanaat listesinde göster";
    }
    t.dataset.name = norm(name);
    var pic = el("span", "prod-pic");
    var im = el("img");
    im.src = img + icon + ".webp";
    im.alt = "";
    im.width = 64;
    im.height = 64;
    im.loading = "lazy";
    im.decoding = "async";
    pic.appendChild(im);
    if (count > 1) pic.appendChild(el("span", "prod-count", "×" + count));
    t.appendChild(pic);
    var label = el("span", "prod-label", name);
    if (kind !== "station") label.lang = "en";
    t.appendChild(label);
    return t;
  }

  function group(items, joiner, isOutput) {
    var g = el("div", "prod-group");
    items.forEach(function (x, i) {
      if (i) g.appendChild(el("span", "prod-join", joiner));
      g.appendChild(tile(x.n, x.id, x.k, "item", isOutput && x.z));
    });
    return g;
  }

  function step(s) {
    var card = el("li", "prod-step");
    var flow = el("div", "prod-flow");
    if (s.in.length) {
      flow.appendChild(group(s.in, s.or ? "ya da" : "+", false));
      flow.appendChild(el("span", "prod-arrow", "→"));
    }
    flow.appendChild(tile(s.st.n, s.st.i, 1, "station", false));
    flow.appendChild(el("span", "prod-arrow", "→"));
    flow.appendChild(group(s.out, "+", true));
    card.appendChild(flow);
    var meta = [s.skill, s.note].filter(Boolean).join(" · ");
    if (meta) card.appendChild(el("p", "prod-meta", meta));
    return card;
  }

  // Aranan kelimelerin her biri, kartın bir eşya ya da tezgâh adındaki bir kelimenin başıyla eşleşmeli
  function matches(tileEl, words) {
    var parts = tileEl.dataset.name.split(/[\s'-]+/);
    return words.every(function (w) { return parts.some(function (p) { return p.indexOf(w) === 0; }); });
  }

  function tab(id, label, n) {
    var b = el("button", "prod-tab");
    b.type = "button";
    b.setAttribute("role", "tab");
    b.dataset.id = id;
    b.appendChild(el("span", null, label));
    b.appendChild(el("span", "prod-tab-n", String(n)));
    return b;
  }

  function show(id, fromHash) {
    current = id;
    tabsBox.querySelectorAll(".prod-tab").forEach(function (b) {
      var on = b.dataset.id === id;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      // Telefonda sekmeler yana kayıyor; seçili olan görünür yere gelsin
      if (on) tabsBox.scrollLeft = Math.max(0, b.offsetLeft - tabsBox.offsetLeft - 16);
    });
    if (!fromHash) history.replaceState(null, "", id ? "#" + id : location.pathname + location.search);
    update();
  }

  function update() {
    var words = norm(q.value.trim()).split(/\s+/).filter(Boolean);
    var total = 0;
    sections.forEach(function (sec) {
      var visible = 0;
      sec.cards.forEach(function (c) {
        var tiles = c.querySelectorAll(".prod-tile");
        var hit = false;
        tiles.forEach(function (t) {
          var m = words.length > 0 && matches(t, words);
          t.classList.toggle("is-hit", m);
          if (m) hit = true;
        });
        var on = words.length ? hit : true;
        c.hidden = !on;
        if (on) visible++;
      });
      // Arama varken bütün bölümlere bakılır; yoksa sadece seçili sekme
      var show = words.length ? visible > 0 : (!current || current === sec.id);
      sec.box.hidden = !show;
      if (show) total += visible;
    });
    tabsBox.classList.toggle("is-dim", words.length > 0);
    status.hidden = !words.length;
    status.textContent = words.length
      ? (total ? total + " adımda geçiyor" : "Bu adla bir eşya ya da tezgâh yok.")
      : "";
  }

  fetch("../../assets/data/uretim.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var all = 0;
      data.forEach(function (sec) {
        var box = el("section", "prod-section");
        box.id = sec.id;
        box.setAttribute("aria-labelledby", sec.id + "-t");
        var h = el("h2", null, sec.title);
        h.id = sec.id + "-t";
        box.appendChild(h);
        box.appendChild(el("p", "prod-intro", sec.intro));
        var ol = el("ol", "prod-steps");
        var cards = sec.steps.map(step);
        cards.forEach(function (c) { ol.appendChild(c); });
        box.appendChild(ol);
        list.appendChild(box);
        sections.push({ id: sec.id, box: box, cards: cards });
        all += sec.steps.length;
      });

      tabsBox.appendChild(tab("", "Hepsi", all));
      data.forEach(function (sec) { tabsBox.appendChild(tab(sec.id, sec.title, sec.steps.length)); });
      tabsBox.addEventListener("click", function (e) {
        var b = e.target.closest(".prod-tab");
        if (!b) return;
        if (q.value) q.value = "";
        show(b.dataset.id);
      });
      q.addEventListener("input", update);
      window.addEventListener("hashchange", function () { show(location.hash.slice(1), true); });

      // Adres bir bölümle açıldıysa (örn. #maden) o sekme, yoksa ilk bölüm
      var start = location.hash.slice(1);
      show(sections.some(function (s) { return s.id === start; }) ? start : sections[0].id, true);
    })
    .catch(function () {
      status.textContent = "Rehber yüklenemedi. Sayfayı yenilemeyi dene.";
    });
})();
