"""Title-case public catalogue product names. Turkish İ/ı aware. Does not read prices."""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parent.parent
UP = str.maketrans("abcçdefgğhıijklmnoöprsştuüvyz", "ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ")
DOWN = str.maketrans("ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ", "abcçdefgğhıijklmnoöprsştuüvyz")
UNIT = re.compile(r"^(gr|g|kg|ml|mm|cm|m|lt|oz|cl)$", re.I)
ACRO = re.compile(r"^[A-Z0-9][A-Z0-9+\-/]*$")


def tr_lower(text):
    return "".join(ch.translate(DOWN) if ch in DOWN else ch.lower() for ch in text)


def urun_kelime(word):
    if not word:
        return word
    if UNIT.match(word):
        return word.lower()
    if ACRO.match(word) and re.search(r"[A-Z]", word) and len(word) > 1:
        return word
    if word[0].isdigit():
        return word
    first = word[0].translate(UP) if word[0] in UP else word[0].upper()
    return first + tr_lower(word[1:])


def urun_adi_yazi(satir):
    parts = []
    for part in str(satir or "").split(" · "):
        toks = re.split(r"(\s+)", part)
        parts.append("".join(tok if tok.isspace() else urun_kelime(tok) for tok in toks))
    return " · ".join(parts)


def main():
    path = ROOT / "public" / "katalog.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    changed = 0
    samples = []
    for row in data["urunler"]:
        titled = urun_adi_yazi(row["satir"])
        if titled != row["satir"]:
            if len(samples) < 15:
                samples.append((row["satir"], titled))
            row["satir"] = titled
            changed += 1
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"katalog {changed}/{len(data['urunler'])}")
    for old, new in samples:
        print("-", old)
        print("+", new)

    expand = ROOT / "tools" / "expand_catalog.py"
    src = expand.read_text(encoding="utf-8")
    out = []
    in_fam = False
    for line in src.splitlines(True):
        if line.startswith("families = ["):
            in_fam = True
        if in_fam and line.strip() == "]":
            in_fam = False
        if in_fam and "|" in line:

            def title_quoted(match):
                quote, inner = match.group(1), match.group(2)
                if "|" not in inner:
                    return match.group(0)
                return quote + "|".join(urun_adi_yazi(name) for name in inner.split("|")) + quote

            line = re.sub(r"""(['"])([^'"]*\|[^'"]*)\1""", title_quoted, line)
        out.append(line)
    expand.write_text("".join(out), encoding="utf-8")
    print("expand_catalog names titled")


if __name__ == "__main__":
    main()
