"""mb-mod/docs/craft-listesi.md tablosunu sitenin kullandığı JSON'a çevirir.

Kullanım: python -I tools/craft_to_json.py <craft-listesi.md> <craft-img klasörü>
Çıktı: assets/data/craft.json ve assets/img/rp/craft/*.webp
"""
import json
import re
import shutil
import sys
from pathlib import Path

md_path, img_dir = Path(sys.argv[1]), Path(sys.argv[2])
root = Path(__file__).resolve().parent.parent
out_img = root / "assets" / "img" / "rp" / "craft"
out_img.mkdir(parents=True, exist_ok=True)

# Kaynak tablodaki bazı kategori adları sitede daha anlaşılır yazılıyor
RENAME = {"Cıvata (arbalet oku)": "Arbalet oku"}

categories, items = [], []
category = None
for line in md_path.read_text(encoding="utf-8").splitlines():
    head = re.match(r"^## (.+?) \(\d+\)$", line)
    if head:
        category = RENAME.get(head.group(1), head.group(1))
        categories.append(category)
        continue
    if not (category and line.startswith("|")) or line.startswith("| |") or line.startswith("|---"):
        continue
    cells = [c.strip() for c in line.strip("|").split("|")]
    if len(cells) != 5:
        continue
    img_cell, name, materials, skill, price = cells
    src = re.search(r'src="[^"]*?([^/"]+\.webp)"', img_cell)
    img = None
    if src and (img_dir / src.group(1)).exists():
        img = src.group(1)
        shutil.copy2(img_dir / img, out_img / img)
    skills = []
    for part in skill.split("/"):
        m = re.match(r"\s*(\S+)\s+(\d+)\s*$", part)
        if m:
            skills.append([m.group(1), int(m.group(2))])
    mats = []
    for part in materials.split(","):
        m = re.match(r"\s*(?:(\d+)×\s*)?(.+?)\s*$", part)
        mats.append([int(m.group(1) or 1), m.group(2)])
    items.append({"c": categories.index(category), "n": name, "i": img, "m": mats, "s": skills, "p": int(price)})

data = {"categories": categories, "items": items}
(root / "assets" / "data" / "craft.json").write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
print(len(categories), "kategori,", len(items), "tarif,", sum(1 for i in items if i["i"]), "görselli")
