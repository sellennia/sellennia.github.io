// Zanaat listesi: assets/data/craft.json'u okur, arama ve süzgeçlerle kartları gösterir.
// JSON'u tools/craft_to_json.py üretiyor.

(function () {
  var grid = document.getElementById("craft-grid");
  if (!grid) return;

  var q = document.getElementById("craft-q");
  var matSel = document.getElementById("craft-mat");
  var skillSel = document.getElementById("craft-skill");
  var levelSel = document.getElementById("craft-level");
  var sortSel = document.getElementById("craft-sort");
  var catsBox = document.getElementById("craft-cats");
  var count = document.getElementById("craft-count");

  var base = "../../assets/";
  var data, cards = [], activeCat = -1;
  var fmt = new Intl.NumberFormat("tr-TR");

  // Arama Türkçe büyük-küçük harften etkilenmesin (İ/ı dahil)
  function norm(s) { return s.toLocaleLowerCase("tr-TR").replace(/ı/g, "i"); }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function buildCats() {
    var all = el("button", "chip is-on", "Hepsi (" + data.items.length + ")");
    all.type = "button";
    all.dataset.cat = "-1";
    catsBox.appendChild(all);
    data.categories.forEach(function (name, i) {
      var n = data.items.filter(function (it) { return it.c === i; }).length;
      var b = el("button", "chip", name + " (" + n + ")");
      b.type = "button";
      b.dataset.cat = String(i);
      catsBox.appendChild(b);
    });
    catsBox.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      activeCat = Number(b.dataset.cat);
      catsBox.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("is-on", c === b); });
      update();
    });
  }

  function buildCard(it) {
    var li = el("li", "craft-card");
    var pic = el("div", "craft-pic");
    if (it.i) {
      var img = el("img");
      img.src = base + "img/rp/craft/" + it.i;
      img.alt = "";
      img.width = 96;
      img.height = 96;
      img.loading = "lazy";
      img.decoding = "async";
      pic.appendChild(img);
    } else {
      pic.appendChild(el("span", "craft-nopic", "görsel yok"));
    }
    li.appendChild(pic);

    var body = el("div", "craft-body");
    body.appendChild(el("span", "craft-cat", data.categories[it.c]));
    var h = el("h3", null, it.n);
    h.lang = "en";
    body.appendChild(h);

    var mats = el("ul", "craft-mats");
    mats.setAttribute("aria-label", "Malzemeler");
    it.m.forEach(function (m) {
      var mi = el("li", null, (m[0] > 1 ? m[0] + "× " : "") + m[1]);
      mi.lang = "en";
      mats.appendChild(mi);
    });
    body.appendChild(mats);

    var foot = el("div", "craft-foot");
    foot.appendChild(el("span", "craft-skill", it.s.length ? it.s.map(function (s) { return s[0] + " " + s[1]; }).join(" ya da ") : "Beceri gerekmez"));
    foot.appendChild(el("span", "craft-price", fmt.format(it.p)));
    body.appendChild(foot);
    li.appendChild(body);

    return {
      li: li,
      item: it,
      // Arama sadece eşya adında; malzemeler ayrı süzgeçte
      words: norm(it.n).split(/[\s'-]+/)
    };
  }

  function update() {
    var words = norm(q.value.trim()).split(/\s+/).filter(Boolean);
    var mat = matSel.value;
    var skill = skillSel.value;
    var level = levelSel.value ? Number(levelSel.value) : null;
    var sort = sortSel.value;

    var shown = cards.filter(function (c) {
      var it = c.item;
      if (activeCat >= 0 && it.c !== activeCat) return false;
      // Her aranan kelime, adın bir kelimesinin başıyla eşleşmeli ("bar" Barbed'i bulur, Short Iron Bar malzemesini değil)
      for (var w = 0; w < words.length; w++) {
        if (!c.words.some(function (nw) { return nw.indexOf(words[w]) === 0; })) return false;
      }
      if (mat && !it.m.some(function (m) { return m[1] === mat; })) return false;
      if (skill === "-") return it.s.length === 0;
      if (skill || level) {
        // Becerisiz tarifleri herkes yapabilir; seviye seçiliyse onlar da görünsün
        if (!it.s.length) return !skill;
        return it.s.some(function (s) {
          return (!skill || s[0] === skill) && (!level || s[1] <= level);
        });
      }
      return true;
    });

    shown.sort(function (a, b) {
      if (sort === "name") return a.item.n.localeCompare(b.item.n, "en");
      return sort === "-price" ? b.item.p - a.item.p : a.item.p - b.item.p;
    });

    var frag = document.createDocumentFragment();
    shown.forEach(function (c) { frag.appendChild(c.li); });
    grid.replaceChildren(frag);
    count.textContent = shown.length ? shown.length + " tarif" : "Bu süzgeçlere uyan tarif yok.";
  }

  fetch(base + "data/craft.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (json) {
      data = json;
      cards = data.items.map(buildCard);
      buildCats();
      var mats = {};
      data.items.forEach(function (it) { it.m.forEach(function (m) { mats[m[1]] = (mats[m[1]] || 0) + 1; }); });
      Object.keys(mats).sort().forEach(function (m) {
        var o = el("option", null, m + " (" + mats[m] + ")");
        o.value = m;
        o.lang = "en";
        matSel.appendChild(o);
      });
      [q, matSel, skillSel, levelSel, sortSel].forEach(function (c) { c.addEventListener("input", update); });
      update();
    })
    .catch(function () {
      count.textContent = "Liste yüklenemedi. Sayfayı yenilemeyi dene.";
    });
})();
