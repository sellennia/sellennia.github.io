// Mobil menü ve galeri büyütme penceresi.

(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
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
