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

  // Tambur menü: her sekmeye seçili olana uzaklığını yaz, seçili olanı ortaya getir.
  var drum = document.querySelector(".drum ul");
  var cur = drum && drum.querySelector("a[aria-current]");
  if (cur) {
    var items = Array.prototype.slice.call(drum.children);
    var at = items.indexOf(cur.parentNode);
    items.forEach(function (li, i) {
      li.style.setProperty("--d", i - at);
      li.style.setProperty("--ad", Math.abs(i - at));
    });
    var center = function () {
      if (window.matchMedia("(min-width: 1000px)").matches) {
        // Dikey: seçili sekme ekranın ortasında dursun
        drum.style.setProperty("--shift", (drum.offsetHeight / 2 - (cur.offsetTop + cur.offsetHeight / 2)) + "px");
      } else {
        drum.style.removeProperty("--shift");
        drum.scrollLeft = cur.offsetLeft + cur.offsetWidth / 2 - drum.clientWidth / 2;
      }
    };
    center();
    window.addEventListener("resize", center);
    if (document.fonts) document.fonts.ready.then(center);
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
