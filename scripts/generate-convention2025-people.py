#!/usr/bin/env python3
"""Generate src/seed/data/convention2025People.ts from the 2025 brochure PDF."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = Path.home() / 'Downloads/Brochure-Convention-FFC-Ricerca-2025.pdf'
OUT_PATH = ROOT / 'src/seed/data/convention2025People.ts'

ABSTRACTS_META = [
    (1, 'Kaftrio in the real life'),
    (2, 'FFC#2/2024'),
    (3, 'FFC#9/2024'),
    (4, 'MindKids-CF'),
    (5, 'FFC#14/2024'),
    (6, 'FFC#1/2024'),
    (7, 'FFC#3/2024'),
    (8, 'FFC#2/2023'),
    (9, 'Molecules 3.0 for CF'),
    (10, 'GMSG#1/2022'),
    (11, 'GenDel-CF'),
    (12, 'FFC#11/2024'),
    (13, 'FFC#12/2024'),
    (14, 'FFC#13/2024'),
    (15, 'FFC#15/2023'),
    (16, 'GMRF#1/2024'),
    (17, 'FFC#4/2024'),
    (18, 'De-risking GY'),
    (19, 'FFC#9/2023'),
    (20, 'FFC#12/2023'),
    (21, 'FFC#10/2024'),
    (22, 'CFaCore'),
    (23, 'CFDB'),
    (24, 'SCP'),
    (25, 'FFC#1/2025'),
    (26, 'FFC#2/2025'),
    (27, 'FFC#3/2025'),
    (28, 'FFC#4/2025'),
    (29, 'FFC#5/2025'),
    (30, 'FFC#6/2025'),
    (31, 'GMSG#1/2025'),
    (32, 'FFC#7/2025'),
    (33, 'FFC#10/2025'),
    (34, 'FFC#13/2025'),
    (35, 'FFC#8/2025'),
    (36, 'FFC#9/2025'),
    (37, 'FFC#12/2025'),
    (38, 'FFC#6/2024'),
    (39, 'FFC#16/2023'),
    (40, 'GMRF#1/2023'),
    (41, 'FFC#15/2022'),
    (42, 'FFC#5/2024'),
    (43, 'FFC#7/2024'),
    (44, 'FFC#8/2024'),
    (45, 'FFC#15/2024'),
    (46, 'FFC#6/2023'),
    (47, 'FFC#7/2023'),
    (48, 'FFC#8/2023'),
    (49, 'FFC#13/2023'),
    (50, 'FFC#3/2023'),
    (51, 'GMSG#1/2023'),
    (52, 'GMSG#1/2024'),
    (53, 'FFC#14/2023'),
    (54, 'FFC#5/2023'),
]

NAME_ALIASES = {
    'Daniela Cirillo': ('Daniela Maria', 'Cirillo'),
    'Nicola I. Loré': ('Nicola Ivan', 'Lorè'),
    'Luis J. V. Galietta': ('Luis J. V.', 'Galietta'),
    'Luis J. V . Galietta': ('Luis J. V.', 'Galietta'),
    'Sheref S. Mansy': ('Sheref', 'Mansy'),
    'Carlos M. Farinha': ('Carlos M.', 'Farinha'),
    'Santiago Ramón-García': ('Santiago', 'Ramón-García'),
    "Ivana d'Angelo": ('Ivana', "d'Angelo"),
    'Margarida D. Amaral': ('Margarida', 'Amaral'),
    'Ida De Fino': ('Ida', 'De Fino'),
}

INVALID_NAME_RE = re.compile(
    r'Conclusions|Essential|methods|Preliminary|Background|compounds|activity|synthetic|results|strategies|clinical|infected|research a total|antibiofilm|screening against',
    re.I,
)

INST_ALIASES = {
    'Division of Immunology, Transplantation and Infectious Disease, IRCCS San Raffaele Scientific Institute, Milan, Italy': 'IRCCS San Raffaele Scientific Institute, Milan',
    'Infection and Cystic Fibrosis Unit, IRCCS San Raffaele Scientific Institute, Milan, Italy': 'IRCCS San Raffaele Scientific Institute, Milan',
    'Infections and Cystic Fibrosis Unit, Division of Immunology, Transplantation and Infectious Diseases, IRCCS San Raffaele Scientific Institute, Milan, Italy': 'IRCCS San Raffaele Scientific Institute, Milan',
    'Emerging Bacterial Pathogens Unit, Division of Immunology, Transplantation and Infectious Disease, IRCCS San Raffaele Scientific Institute, Milan, Italy': 'IRCCS San Raffaele Scientific Institute, Milan',
    'Emerging Bacterial Pathogens Unit, IRCCS San Raffaele Scientific Institute, Milan, Italy': 'IRCCS San Raffaele Scientific Institute, Milan',
    'Emerging Bacteria Pathogens Unit, IRCCS San Raffaele Scientific Institute, Milan, Italy': 'IRCCS San Raffaele Scientific Institute, Milan',
    'IRCCS G. Gaslini Institute, Genoa, Italy': 'IRCCS G. Gaslini Institute, Genoa',
    'Cystic Fibrosis Center, IRCCS G. Gaslini Institute, Genoa, Italy': 'IRCCS G. Gaslini Institute, Genoa',
    'IRCCS Ospedale Policlinico San Martino, Genoa, Italy': 'IRCCS Ospedale Policlinico San Martino, Genoa',
    'Fondazione Istituto Italiano di Tecnologia (IIT), Genoa, Italy': 'Fondazione Istituto Italiano di Tecnologia (IIT), Genoa',
    'University of Genoa, Italy': 'University of Genoa',
    'University of Bologna, Italy': 'University of Bologna',
    'University of Bologna, Rimini campus, Italy': 'University of Bologna, Rimini campus',
    'University of Milan, Italy': 'University of Milan',
    'Department of Food, Environmental and Nutritional Sciences, University of Milan, Italy': 'University of Milan',
    'University of Padova, Italy': 'University of Padova',
    'University of Padua, Italy': 'University of Padova',
    'Department of Molecular Medicine, University of Padua, Italy': 'University of Padova',
    'Department of Biomedical Sciences, University of Padua, Italy': 'University of Padova',
    'Department of Biomedical Sciences, University of Padua, Padua, Italy': 'University of Padova',
    'Department of Pharmaceutical Sciences, University of Padua, Italy': 'University of Padova',
    'University of Pavia, Italy': 'University of Pavia',
    'Department of Biology and Biotechnology Lazzaro Spallanzani, University of Pavia, Italy': 'University of Pavia',
    'University of Ferrara, Italy': 'University of Ferrara',
    'Department of Life Sciences and Biotechnology, University of Ferrara, Italy': 'University of Ferrara',
    'University of Zaragoza, Spain': 'University of Zaragoza',
    'Department of Microbiology, Faculty of Medicine, University of Zaragoza, Spain': 'University of Zaragoza',
    'Research and Development Agency of Aragón (ARAID) Foundation, Spain': 'University of Zaragoza',
    'Telethon Institute of Genetics and Medicine (TIGEM), Pozzuoli (NA), Italy': 'Telethon Institute of Genetics and Medicine (TIGEM), Pozzuoli',
    'UOC Genetica Medica, IRCCS Istituto G. Gaslini, Genoa, Italy': 'IRCCS G. Gaslini Institute, Genoa',
    'UOC Genetica Medica, IRCCS G. Gaslini Institute, Genoa, Italy': 'IRCCS G. Gaslini Institute, Genoa',
    'Fondazione per la Ricerca sulla Fibrosi Cistica, ETS, Verona, Italy': 'FFC Ricerca scientific direction, Clinical Research Area',
    'BioISI - Biosystems and Integrative Sciences Institute, University of Lisbon, Portugal': 'University of Lisbon',
    'Faculty of Sciences, Cystic Fibrosis Research Lab, BioISI– Biosystems & Integrative Sciences Institute, University of Lisbon, Portugal': 'University of Lisbon',
    'ICGEB, Trieste, Italy': 'International Centre for Genetic Engineering and Biotechnology (ICGEB), Trieste',
    'Department for Cellular, Computational and Integrative Biology (CIBIO), University of Trento, Italy': 'University of Trento',
    'SINTEF Trondheim, Norway': 'SINTEF, Trondheim',
    'Department of Biotechnology and Nanomedicine, SINTEF Trondheim, Norway': 'SINTEF, Trondheim',
    'Regional Cystic Fibrosis Center, Messina, Italy': 'Regional Cystic Fibrosis Center, Messina',
    'Bakh Institute of Biochemistry, Russian Academy of Science, Moscow, Russia': 'Bakh Institute of Biochemistry, Russian Academy of Science, Moscow',
    'Department of Physiology, McGill University, Montréal, Canada': 'McGill University, Montreal',
}

ITALIAN_REGIONS = {
    'Messina': 'Sicilia',
    'Milan': 'Lombardia',
    'Genoa': 'Liguria',
    'Verona': 'Veneto',
    'Rome': 'Lazio',
    'Roma': 'Lazio',
    'Pozzuoli': 'Campania',
    'Ferrara': 'Emilia-Romagna',
    'Padua': 'Veneto',
    'Pavia': 'Lombardia',
    'Pisa': 'Toscana',
    'Bologna': 'Emilia-Romagna',
    'Perugia': 'Umbria',
    'Naples': 'Campania',
    'Trieste': 'Friuli-Venezia Giulia',
    'Chieti': 'Abruzzo',
    'Ancona': 'Marche',
    'Trento': 'Trentino-Alto Adige',
    'Potenza': 'Basilicata',
    'Rimini': 'Emilia-Romagna',
    'Foggia': 'Puglia',
    'Florence': 'Toscana',
}

NAME_PART = r"[A-Za-zÀ-ÖØ-öø-ÿĀ-žŁłŃñÓóÚúÜüÁáÉéÍíÑñ\.'\-]+"
AUTHOR_RE = re.compile(rf"({NAME_PART}(?:\s+{NAME_PART})+)\s*(\d+(?:,\s*\d+)*)")


def code_pattern(code: str) -> str:
    if code == 'FFC#9/2023':
        return r'\(FFC#9/2023,\s*concluded'
    if code == 'FFC#10/2025':
        return r'\(FFC#/?10/2025,\s*new\)'
    if code == 'CFaCore':
        return r'Facility \(CFaCore\)'
    if code == 'CFDB':
        return r'\(CFDB\)'
    if code == 'SCP':
        return r'Cell Cultures Service\s*\n?\s*\(SCP\)'
    return rf'\({re.escape(code)},\s*(?:new|ongoing|concluded)\)'


def extract_block(text: str, n: int, code: str) -> str | None:
    if code in ('CFaCore', 'CFDB', 'SCP'):
        return extract_facility_block(text, code)
    match = re.search(code_pattern(code), text, re.I)
    if not match:
        return None
    before = text[max(0, match.start() - 1200) : match.start()]
    num_matches = list(re.finditer(rf'(?:^|\n){n}\s*\n', before))
    return before[num_matches[-1].start() :] if num_matches else before[-600:]


def extract_facility_block(text: str, code: str) -> str | None:
    if code == 'CFaCore':
        match = re.search(r'Facility \(CFaCore\)\s*\n(?:\d+\n)?(.{0,700})', text, re.S)
    elif code == 'CFDB':
        match = re.search(r'\(CFDB\)\s*\n(?:\d+\n)?(.{0,900})', text, re.S)
    elif code == 'SCP':
        match = re.search(r'\(SCP\)\s*\n(?:\d+\n)?(.{0,700})', text, re.S)
    else:
        return None
    return match.group(0) if match else None


def join_institution_lines(block: str) -> str:
    lines = block.split('\n')
    inst_lines: list[str] = []
    started = False
    for line in lines:
        stripped = line.strip()
        if not started:
            if re.match(r'^\d+[A-Za-z]', stripped):
                started = True
                inst_lines.append(stripped)
            continue
        if re.match(r'^\([A-Za-z#][^)]*,\s*(?:new|ongoing|concluded)', stripped):
            break
        if stripped in ('Background', 'Hypothesis', 'Objectives', 'Resources and services', 'Flash Presentation:'):
            break
        if started and stripped.startswith('Flash Presentation'):
            break
        inst_lines.append(stripped)
    return re.sub(r'\s+', ' ', ' '.join(inst_lines)).strip()


def parse_institutions(raw: str) -> dict[int, str]:
    institutions: dict[int, str] = {}
    if not raw:
        return institutions
    for part in re.split(r'\s*[–\-]\s*(?=\d+[A-Za-z])', raw):
        match = re.match(r'^(\d+)\s*(.+)$', part.strip())
        if match:
            institutions[int(match.group(1))] = match.group(2).strip()
    return institutions


def valid_author_name(name: str) -> bool:
    if len(name) > 48 or len(name) < 5:
        return False
    if INVALID_NAME_RE.search(name):
        return False
    if name.count(' ') > 5:
        return False
    parts = name.split()
    if len(parts) < 2:
        return False
    if len(parts[-1]) < 2:
        return False
    return bool(parts[0][0].isupper())


def parse_authors_from_block(block: str) -> list[dict]:
    lines = block.split('\n')
    author_lines: list[str] = []
    for line in lines:
        if re.match(r'^\d+[A-Za-z]', line.strip()):
            break
        author_lines.append(line)
    blob = re.sub(r'\n(?![A-ZÀ-Ö\(])', ' ', '\n'.join(author_lines))
    blob = re.sub(r'^\s*\d+\s*', '', blob)
    authors: list[dict] = []
    seen: set[str] = set()
    for match in AUTHOR_RE.finditer(blob):
        name = re.sub(r'\s+', ' ', match.group(1)).strip().rstrip(',')
        if not valid_author_name(name) or name in seen:
            continue
        seen.add(name)
        nums = [int(x.strip()) for x in match.group(2).split(',')]
        authors.append({'name': name, 'affiliations': nums})
    return authors


def is_institution_line(line: str) -> bool:
    return bool(
        re.search(
            r'\b(IRCCS|University|Department|Institute|Foundation|Faculty|Unit,|Italy|Spain|Portugal)\b',
            line,
        )
    )


def parse_unnumbered_authors(block: str) -> list[dict]:
    lines = block.split('\n')
    for index, line in enumerate(lines):
        if not re.match(r'^\d+\s*$', line.strip()) or index + 1 >= len(lines):
            continue
        name_parts: list[str] = []
        for candidate in lines[index + 1 :]:
            stripped = candidate.strip()
            if not stripped or re.match(r'^\d+[A-Za-z]', stripped):
                break
            if stripped.startswith('Flash Presentation') or is_institution_line(stripped):
                break
            name_parts.append(stripped)
        names_line = re.sub(r'\n(?![A-Z])', ' ', ' '.join(name_parts))
        names = re.split(r',\s*|\s+and\s+', names_line)
        authors = [{'name': name.strip(), 'affiliations': [1]} for name in names if valid_author_name(name.strip())]
        if authors:
            return authors
    return []


def parse_shared_institution(block: str) -> str | None:
    lines = block.split('\n')
    for index, line in enumerate(lines):
        stripped = line.strip()
        if re.match(r'^\d+[A-Za-z]', stripped):
            return None
        if index > 0 and re.search(
            r'(Italy|Spain|Portugal|Belgium|Norway|Russia|Canada|United Kingdom|Hungary|USA)$',
            stripped,
        ):
            return re.sub(r'\s+', ' ', stripped).strip()
    return None


def normalize_inst(name: str | None) -> str | None:
    if not name:
        return None
    cleaned = re.sub(r'\s+', ' ', name).strip().rstrip(',')
    return INST_ALIASES.get(cleaned, cleaned)


def canonical_name(full_name: str) -> tuple[str, str, str]:
    if full_name in NAME_ALIASES:
        first, last = NAME_ALIASES[full_name]
        return first, last, f'{first} {last}'
    parts = full_name.strip().split()
    if len(parts) == 1:
        return parts[0], parts[0], full_name
    first = ' '.join(parts[:-1])
    last = parts[-1]
    return first, last, f'{first} {last}'


def infer_country_region(name: str) -> tuple[str, str | None]:
    if ', Hungary' in name or name.endswith('Hungary'):
        return 'Hungary', None
    if ', USA' in name or 'Florida, USA' in name:
        return 'United States', None
    if ', Spain' in name or 'Zaragoza' in name:
        return 'Spain', None
    if ', Portugal' in name or 'Lisbon' in name:
        return 'Portugal', None
    if ', Belgium' in name or 'Leuven' in name:
        return 'Belgium', None
    if ', Norway' in name or 'Trondheim' in name:
        return 'Norway', None
    if ', Canada' in name or 'Montreal' in name or 'Montréal' in name:
        return 'Canada', None
    if ', United Kingdom' in name or 'Bristol' in name:
        return 'United Kingdom', None
    if ', Russia' in name or 'Moscow' in name:
        return 'Russia', None
    if ', Germany' in name or 'Münster' in name:
        return 'Germany', None
    if 'Italy' in name:
        region = next((reg for city, reg in ITALIAN_REGIONS.items() if city in name), None)
        return 'Italy', region
    return 'Italy', None


def ts_str(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def main() -> int:
    if not PDF_PATH.is_file():
        print(f'PDF not found: {PDF_PATH}', file=sys.stderr)
        return 1

    reader = PdfReader(str(PDF_PATH))
    text = '\n'.join((page.extract_text() or '') for page in reader.pages[9:60])

    abstract_authors: dict[int, list[dict]] = {}
    all_inst: set[str] = set()
    people: dict[str, dict] = {}

    for n, code in ABSTRACTS_META:
        block = extract_block(text, n, code)
        if not block:
            raise SystemExit(f'missing abstract block {n} ({code})')

        if code == 'CFaCore':
            authors = parse_unnumbered_authors(block)
            shared = 'IRCCS San Raffaele Scientific Institute, Milan'
            institutions = {1: shared}
        else:
            institutions = {k: normalize_inst(v) for k, v in parse_institutions(join_institution_lines(block)).items()}
            authors = parse_authors_from_block(block)
            shared = normalize_inst(parse_shared_institution(block)) if not institutions else None

        rows: list[dict] = []
        for author in authors:
            inst = institutions.get(author['affiliations'][0]) or shared
            if inst:
                all_inst.add(inst)
            first, last, canonical = canonical_name(author['name'])
            rows.append(
                {
                    'name': author['name'],
                    'firstName': first,
                    'lastName': last,
                    'institution': inst,
                }
            )
            if canonical not in people and inst:
                people[canonical] = {'firstName': first, 'lastName': last, 'institution': inst}

        abstract_authors[n] = rows

    for n in (22, 23, 24):
        print(n, len(abstract_authors[n]), [row['firstName'] + ' ' + row['lastName'] for row in abstract_authors[n]])

    inst_records: list[dict] = []
    for name in sorted(all_inst):
        country, region = infer_country_region(name)
        record = {'name': name, 'country': country}
        if region:
            record['region'] = region
        inst_records.append(record)

    alias_lines = [
        'export const BROCHURE_NAME_ALIASES: Record<string, { firstName: string; lastName: string }> = {'
    ]
    for key, (first, last) in sorted(NAME_ALIASES.items()):
        alias_lines.append(f'  {ts_str(key)}: {{ firstName: {ts_str(first)}, lastName: {ts_str(last)} }},')
    alias_lines.append('}')

    inst_lines = ['export const BROCHURE_INSTITUTIONS: SeedInstitution[] = [']
    for record in inst_records:
        line = f"  {{ name: {ts_str(record['name'])}, country: {ts_str(record['country'])}"
        if record.get('region'):
            line += f", region: {ts_str(record['region'])}"
        inst_lines.append(line + ' },')
    inst_lines.append(']')

    people_lines = ['export const BROCHURE_PEOPLE: SeedPerson[] = [']
    for canonical in sorted(people.keys(), key=lambda key: (people[key]['lastName'], people[key]['firstName'])):
        person = people[canonical]
        people_lines.append(
            f"  {{ firstName: {ts_str(person['firstName'])}, lastName: {ts_str(person['lastName'])}, institution: {ts_str(person['institution'])} }},"
        )
    people_lines.append(']')

    abs_lines = ['export const ABSTRACT_AUTHOR_LISTS: Record<number, BrochureAbstractAuthor[]> = {']
    for n in sorted(abstract_authors):
        abs_lines.append(f'  {n}: [')
        for row in abstract_authors[n]:
            inst_field = f", institution: {ts_str(row['institution'])}" if row['institution'] else ''
            abs_lines.append(
                f"    {{ brochureName: {ts_str(row['name'])}, firstName: {ts_str(row['firstName'])}, lastName: {ts_str(row['lastName'])}{inst_field} }},"
            )
        abs_lines.append('  ],')
    abs_lines.append('}')

    output = f"""import type {{ SeedInstitution }} from '@/seed/data/convention2025'

export type SeedPerson = {{
  firstName: string
  lastName: string
  institution?: string
}}

export type BrochureAbstractAuthor = {{
  /** Name as printed in the brochure (before alias normalisation). */
  brochureName: string
  firstName: string
  lastName: string
  institution?: string
}}

/** Brochure display names mapped to canonical People first/last names. */
{chr(10).join(alias_lines)}

/** Institutions parsed from brochure author affiliation lists (2025 oral abstracts). */
{chr(10).join(inst_lines)}

/** People with primary institution from brochure superscript affiliations. */
{chr(10).join(people_lines)}

/** Full author lists per abstract (brochure order), with resolved institution names. */
{chr(10).join(abs_lines)}
"""

    OUT_PATH.write_text(output, encoding='utf-8')
    print(f'Wrote {OUT_PATH} ({len(people)} people, {len(all_inst)} institutions)')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
