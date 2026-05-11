import json
import re
import time
from pathlib import Path

from deep_translator import GoogleTranslator


TOKEN_RE = re.compile(r"(\{[^{}]+\}|<[^>]+>|•|#[0-9]+|\d{1,2}:\d{2}|\d+)")


def protect(text: str):
    mapping: dict[str, str] = {}

    def replace(match: re.Match[str]) -> str:
        key = f"__TK{len(mapping)}__"
        mapping[key] = match.group(0)
        return key

    return TOKEN_RE.sub(replace, text), mapping


def restore(text: str, mapping: dict[str, str]) -> str:
    for key, value in mapping.items():
        text = text.replace(key, value)
    return text


def collect_strings(value, out: set[str]):
    if isinstance(value, dict):
        for val in value.values():
            collect_strings(val, out)
    elif isinstance(value, list):
        for val in value:
            collect_strings(val, out)
    elif isinstance(value, str):
        out.add(value)


def translate_all_strings(strings: list[str], lang: str) -> dict[str, str]:
    translator = GoogleTranslator(source="en", target=lang)
    result: dict[str, str] = {}

    for i in range(0, len(strings), 40):
        batch = strings[i : i + 40]
        protected_batch = []
        mappings = []
        for text in batch:
            protected, mapping = protect(text)
            protected_batch.append(protected)
            mappings.append(mapping)

        translated_batch = translator.translate_batch(protected_batch)
        for original, translated, mapping in zip(batch, translated_batch, mappings):
            result[original] = restore(translated, mapping)
        time.sleep(0.4)

    return result


def rebuild(value, translated_map: dict[str, str]):
    if isinstance(value, dict):
        return {k: rebuild(v, translated_map) for k, v in value.items()}
    if isinstance(value, list):
        return [rebuild(v, translated_map) for v in value]
    if isinstance(value, str):
        return translated_map.get(value, value)
    return value


def main():
    root = Path(__file__).resolve().parents[1]
    en = json.loads((root / "messages" / "en.json").read_text(encoding="utf-8"))
    all_strings: set[str] = set()
    collect_strings(en, all_strings)
    ordered_strings = sorted(all_strings)

    ta_map = translate_all_strings(ordered_strings, "ta")
    si_map = translate_all_strings(ordered_strings, "si")
    ta = rebuild(en, ta_map)
    si = rebuild(en, si_map)

    (root / "messages" / "ta.json").write_text(
        json.dumps(ta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (root / "messages" / "si.json").write_text(
        json.dumps(si, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    print(f"Translated {len(ordered_strings)} unique strings.")


if __name__ == "__main__":
    main()
