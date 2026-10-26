# Sellennia Studios web sitesi

Sellennia projelerinin tanıtım sitesi. Derleme adımı yok: düz HTML, CSS ve biraz JavaScript. GitHub Pages dosyaları olduğu gibi yayınlar.

## Yapı

| Yol | İçerik |
|---|---|
| `index.html` | Ana sayfa |
| `sellennia-rp/index.html` | Sellennia-RP tanıtımı ve komutlar |
| `sellennia-rp/katil/index.html` | Sunucuya katılım rehberi |
| `sellennia-helpers/index.html` | Sellennia's Helpers modu |
| `404.html` | Bulunamayan sayfalar |
| `assets/css/style.css` | Tüm stiller (renkler en üstte) |
| `assets/js/main.js` | Mobil menü ve galeri büyütme |
| `assets/img/rp/` | Sellennia-RP ekran görüntüleri ve arması (`logo.png`) |
| `assets/img/helpers/` | Mod görselleri |
| `assets/img/logo.svg` | Sellennia logosu (site simgesi de bu) |
| `brand/` | Logo dosyaları: GitHub profil resmi (yazılı logo, koyu zemin), yazılı logo (şeffaf ve koyu zeminli), yazısız gezegen SVG. Sellennia-RP için iki taslak: kalkanlı arma ve yıpranmış sancak (şeffaf ve koyu zeminli; sitede şu an sancak var). `brand/src/lockup-arc.html` yazılı logonun, `brand/src/rp-crest.html` ve `rp-banner.html` RP taslaklarının kaynağı; PNG'ler Edge ile ekran görüntüsü alınarak üretildi |
| `.nojekyll` | GitHub Pages'in Jekyll çalıştırmamasını sağlar |

Yerelde bakmak için klasörde `python -m http.server 8080` çalıştırıp tarayıcıda `http://localhost:8080` adresini aç. (Dosyaya çift tıklamak da sayfayı açar ama menüdeki klasör bağlantıları o şekilde çalışmaz.)

## Ekran görüntüsü eklemek

1. Resmi JPG olarak `assets/img/rp/` klasörüne koy, yanına 640×480'lik `-thumb.jpg` küçük hâlini ekle. Discord listesi, isimler gibi kişisel şeyleri kırp.
2. Sayfadaki galeride bir `<figure class="shot">` bloğunu kopyalayıp dosya adlarını ve açıklamayı değiştir.

## İngilizce eklemek

Türkçe kökte durur. İngilizce sayfalar aynı yapıyla `en/` altına gelir (`en/index.html`, `en/sellennia-rp/` ...). Sonra her sayfanın `<head>` kısmına `hreflang="en"` bağlantısı ve menüye dil seçici eklenir.

## Siteye konmayacaklar

Sunucu IP'si, giriş/admin/panel şifreleri, SteamID'ler, sunucu ve bulut hesap bilgileri, özel repoların bağlantıları. Her commit öncesi bunları tara.
