// Mobil menü, sancak hareketi ve galeri büyütme penceresi.

(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // Tambur menü: sekmeleri bir yayın üstüne dizer; seçili olan yayın tepesinde (--t = 0) durur.
  // Roleplay ana sayfasında Genel bakış'ın bölümleri de aynı yayda, küçük boyda; sayfa kaydıkça okunan bölüm tepeye gelir,
  // geçilenler (is-done) yay üstünde sıkışıp yığılır. --t açı, --ad tepeye uzaklık (sekme cinsinden); CSS yayı çiziyor.
  var tabs = document.querySelector(".drum .tabs");
  if (tabs) {
    var tabItems = Array.prototype.slice.call(tabs.children);
    var wide = window.matchMedia("(min-width: 1000px)");
    var cur = tabs.querySelector(":scope > li > a[aria-current]") || tabItems[0].querySelector("a");
    cur.classList.add("is-on");
    var STEP = 11, SUB = 7, DONE = 2.5; // sayfa, bölüm ve yığılmış bölüm aralığı (derece)
    // Yayın uçları sıkışır: 35°'den sonrası daha dar dizilir ki uzaktaki sayfalar ekrandan taşmasın
    var bend = function (t) { var a = Math.abs(t); return (t < 0 ? -1 : 1) * (a <= 35 ? a : 35 + (a - 35) * 0.4); };

    var anchor = cur.parentNode;
    // Geçilen bölümler (is-done) ve ikiden fazla ilerideki bölümler (is-later) çentik olarak yığılır; sayfalar tepeye yakın kalsın
    var stacked = function (li) { return li.classList.contains("is-done") || li.classList.contains("is-later"); };
    var place = function () {
      var at = 0, pos = [];
      tabItems.forEach(function (li, i) {
        if (i) {
          var prev = tabItems[i - 1];
          var sub = li.classList.contains("sub") || prev.classList.contains("sub");
          // Yığında iki çentik arası dar; yığının başı ve sonu biraz daha açık
          var done = (stacked(li) ? 1 : 0) + (stacked(prev) ? 1 : 0);
          at += done === 2 ? DONE : done === 1 ? SUB * 0.75 : sub ? SUB : STEP;
        }
        pos.push(at);
      });
      var zero = pos[tabItems.indexOf(anchor)];
      tabItems.forEach(function (li, i) {
        var t = bend(pos[i] - zero);
        li.style.setProperty("--t", t + "deg");
        li.style.setProperty("--ad", Math.abs(t) / STEP);
        // Sayfalar hep tıklanabilir kalır; sadece uzaktaki bölümler kapanır
        li.classList.toggle("is-far", li.classList.contains("sub") && Math.abs(t) > STEP * 4.5);
      });
    };

    // Yatay şeritte seçili sekmeyi ortaya kaydır (masaüstünde yay CSS'te)
    var center = function (smooth) {
      if (wide.matches) return;
      var r = cur.parentNode.getBoundingClientRect(), box = tabs.getBoundingClientRect();
      tabs.scrollBy({ left: r.left + r.width / 2 - (box.left + box.width / 2), behavior: smooth ? "smooth" : "auto" });
    };

    var secs = tabItems.filter(function (li) { return li.classList.contains("sub"); }).map(function (li) {
      return { li: li, el: document.getElementById(li.querySelector("a").dataset.sec) };
    }).filter(function (x) { return x.el; });

    if (secs.length) {
      tabs.closest(".drum").classList.add("has-secs");
      var now = -2;
      // Ekranın üst üçte birini geçen son bölüm okunan bölümdür
      var spy = function () {
        var line = window.innerHeight / 3, k = -1;
        secs.forEach(function (x, i) { if (x.el.getBoundingClientRect().top <= line) k = i; });
        if (k === now) return;
        now = k;
        secs.forEach(function (x, i) {
          x.li.classList.toggle("is-done", i < k);
          x.li.classList.toggle("is-now", i === k);
          x.li.classList.toggle("is-later", i > k + 2);
        });
        anchor = k >= 0 ? secs[k].li : cur.parentNode;
        place();
        center(true);
      };
      window.addEventListener("scroll", spy, { passive: true });
      spy();
    } else {
      place();
    }
    center(false);
    setTimeout(function () { tabs.classList.add("is-ready"); }, 100);
    window.addEventListener("resize", function () { center(false); });
    if (document.fonts) document.fonts.ready.then(function () { center(false); });
  }

  // Hareketi azaltmak isteyenlerde sancağın dalgalanmasını durdur.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("svg.flag").forEach(function (svg) { svg.pauseAnimations(); });
  }

  // data-lightbox özelliği olan bağlantılar resmi sayfadan çıkmadan büyük gösterir.
  var links = document.querySelectorAll("a[data-lightbox]");
  if (!links.length || typeof HTMLDialogElement !== "function") return;

  var dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.innerHTML = '<button type="button" aria-label="Kapat">&times;</button><img alt=""><p></p>';
  document.body.appendChild(dialog);

  var img = dialog.querySelector("img");
  var caption = dialog.querySelector("p");

  dialog.querySelector("button").addEventListener("click", function () { dialog.close(); });
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });

  links.forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var thumb = link.querySelector("img");
      img.src = link.getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      caption.textContent = link.getAttribute("data-caption") || "";
      dialog.showModal();
    });
  });
})();
