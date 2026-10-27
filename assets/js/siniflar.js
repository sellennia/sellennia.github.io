// Sınıflar: assets/data/siniflar.json'u okur, her sınıfı güç/çeviklik ve beceri çubuklarıyla kart olarak çizer.
// Üstteki beceri düğmesine basılınca o beceriye sahip sınıflar kalır ve en yüksekten sıralanır.

(function () {
  var list = document.getElementById("class-list");
  if (!list) return;

  var chipsBox = document.getElementById("class-skills");
  var status = document.getElementById("class-status");
  var groups = [], current = "";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function level(c, skill) {
    for (var i = 0; i < c.s.length; i++) if (c.s[i][0] === skill) return c.s[i][1];
    return 0;
  }

  function attr(label, value) {
    var d = el("div");
    d.appendChild(el("dt", null, label));
    d.appendChild(el("dd", null, String(value)));
    return d;
  }

  function card(c) {
    var li = el("li", "class-card");
    var head = el("div", "class-head");
    var h = el("h3", null, c.n);
    h.lang = "en";
    head.appendChild(h);
    if (c.tr !== c.n) head.appendChild(el("span", "class-tr", c.tr));
    li.appendChild(head);

    var dl = el("dl", "class-attr");
    dl.appendChild(attr("Güç", c.str));
    dl.appendChild(attr("Çeviklik", c.agi));
    li.appendChild(dl);

    var ul = el("ul", "class-bars");
    ul.setAttribute("aria-label", "Beceriler");
    c.s.forEach(function (s) {
      var row = el("li");
      row.dataset.skill = s[0];
      var name = el("span", "class-skill", s[0]);
      name.lang = "en";
      row.appendChild(name);
      var bar = el("span", "class-bar");
      bar.setAttribute("aria-hidden", "true");
      var fill = el("i");
      fill.style.width = s[1] * 10 + "%";
      bar.appendChild(fill);
      row.appendChild(bar);
      row.appendChild(el("b", null, String(s[1])));
      ul.appendChild(row);
    });
    li.appendChild(ul);
    return li;
  }

  function show(skill) {
    current = skill;
    chipsBox.querySelectorAll(".chip").forEach(function (b) {
      var on = b.dataset.skill === skill;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var total = 0;
    groups.forEach(function (g) {
      var items = g.items.slice();
      if (skill) {
        // Becerisi olanlar en yüksekten, eşitlerde listedeki sırayla
        items.sort(function (a, b) { return level(b.c, skill) - level(a.c, skill) || a.i - b.i; });
      }
      var visible = 0;
      items.forEach(function (it) {
        var on = !skill || level(it.c, skill) > 0;
        it.li.hidden = !on;
        it.li.querySelectorAll(".class-bars li").forEach(function (r) {
          r.classList.toggle("is-hit", r.dataset.skill === skill);
        });
        g.ol.appendChild(it.li);
        if (on) visible++;
      });
      g.box.hidden = visible === 0;
      total += visible;
    });
    status.hidden = !skill;
    status.textContent = skill ? total + " sınıfta " + skill + " var, yüksekten düşüğe." : "";
  }

  fetch("../../assets/data/siniflar.json")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (data) {
      var skills = {};
      data.forEach(function (g) {
        var box = el("section", "class-group");
        box.id = g.id;
        box.setAttribute("aria-labelledby", g.id + "-t");
        var h = el("h2", null, g.title);
        h.id = g.id + "-t";
        box.appendChild(h);
        var ol = el("ul", "class-grid");
        var items = g.classes.map(function (c, i) {
          c.s.forEach(function (s) { skills[s[0]] = Math.max(skills[s[0]] || 0, s[1]); });
          var li = card(c);
          ol.appendChild(li);
          return { c: c, li: li, i: i };
        });
        box.appendChild(ol);
        list.appendChild(box);
        groups.push({ box: box, ol: ol, items: items });
      });

      var all = el("button", "chip", "Hepsi");
      all.type = "button";
      all.dataset.skill = "";
      chipsBox.appendChild(all);
      Object.keys(skills).sort().forEach(function (s) {
        var b = el("button", "chip", s);
        b.type = "button";
        b.lang = "en";
        b.dataset.skill = s;
        chipsBox.appendChild(b);
      });
      chipsBox.addEventListener("click", function (e) {
        var b = e.target.closest(".chip");
        if (b) show(b.dataset.skill === current ? "" : b.dataset.skill);
      });
      show("");
    })
    .catch(function () {
      status.hidden = false;
      status.textContent = "Sınıflar yüklenemedi. Sayfayı yenilemeyi dene.";
    });
})();
