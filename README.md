# Sellennia Studios

Sellennia Studios'un tanıtım sitesi: **https://sellennia.github.io/**

Arkadaşlarımızla oynadığımız oyunlar için kurduğumuz sunucular ve yazdığımız modlar:

- **Sellennia Roleplay**: Mount & Blade: Warband için Persistent Kingdoms rol yapma sunucusu
- **Sellennia's Helpers**: Hearts of Iron IV modu

## Yapı

Derleme adımı yok; düz HTML, CSS ve biraz JavaScript. GitHub Pages dosyaları olduğu gibi yayınlıyor.

| Yol | İçerik |
|---|---|
| `index.html` | Ana sayfa |
| `sellennia-rp/` | Sellennia Roleplay sayfası; `nasil-girilir/` katılım rehberi, `zanaat/` aranabilir zanaat listesi, `uretim/` üretim rehberi |
| `sellennia-helpers/` | Sellennia's Helpers sayfası |
| `404.html` | Bulunamayan sayfalar |
| `assets/css/style.css` | Stiller (renkler en üstte) |
| `assets/js/main.js` | Mobil menü, galeri büyütme |
| `assets/js/craft.js` | Zanaat listesinin arama ve süzgeçleri |
| `assets/js/uretim.js` | Üretim rehberini çizer |
| `assets/data/` | Zanaat tarifleri ve üretim adımları |
| `assets/img/` | Site görselleri |
| `brand/` | Logo dosyaları; `brand/src/` içinde logoların kaynak HTML'leri |

## Yerelde açmak

```bash
python -m http.server 8080
```

Sonra tarayıcıda `http://localhost:8080` adresini aç.

## Ekran görüntüsü eklemek

1. Resmi JPG olarak ilgili `assets/img/` klasörüne koy, yanına 640×480'lik `-thumb.jpg` küçük hâlini ekle.
2. Sayfadaki galeride bir `<figure class="shot">` bloğunu kopyalayıp dosya adlarını ve açıklamayı değiştir.

## İngilizce

Türkçe sayfalar kökte. İngilizce eklenince aynı yapıyla `en/` altına gelecek.

---

Bu site TaleWorlds Entertainment'ın ya da Paradox Interactive'in resmî bir sitesi değildir. Mount & Blade: Warband TaleWorlds Entertainment'a, Hearts of Iron IV Paradox Interactive'e aittir.
