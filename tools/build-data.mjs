#!/usr/bin/env node
// Build script: parse the manuscript + research markdown into a single data.js
// consumed by the Static SPA. Run: node tools/build-data.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const read = (p) => readFileSync(resolve(ROOT, p), 'utf8');

// strip inline citation markers like [1], [12], [1, 2], [1][2]
const stripCites = (s) =>
  s.replace(/\s*(?:\[\d+(?:\s*,\s*\d+)*\])+/g, '').replace(/[ \t]{2,}/g, ' ').trim();

const cleanLine = (s) => s.replace(/\s+$/g, '');

// Split a markdown body into bullet items and paragraphs.
function parseBlocks(lines) {
  const blocks = [];
  let para = [];
  let list = null;
  const flushPara = () => {
    if (para.length) { blocks.push({ type: 'p', text: stripCites(para.join(' ')) }); para = []; }
  };
  const flushList = () => {
    if (list) { blocks.push({ type: 'ul', items: list.map(stripCites) }); list = null; }
  };
  for (const raw of lines) {
    const line = cleanLine(raw);
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara();
      list = list || [];
      list.push(line.replace(/^\s*[-*]\s+/, ''));
    } else if (/^\s*\d+\.\s+/.test(line)) {
      flushPara();
      list = list || [];
      list.push(line.replace(/^\s*\d+\.\s+/, ''));
    } else if (line.trim() === '') {
      flushPara(); flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara(); flushList();
  return blocks;
}

// Generic: split a concatenated structured file into records by a filename marker regex.
// Each record: leading "# <Type>: Title", then "## Section" subsections.
function parseRecords(text, markerRe, categoryRe) {
  const lines = text.split('\n');
  const records = [];
  let category = null;
  let cur = null;
  let section = null;
  const closeSection = () => {
    if (cur && section) { cur.sections.push(section); section = null; }
  };
  const closeRecord = () => {
    closeSection();
    if (cur) { records.push(cur); cur = null; }
  };
  for (let i = 0; i < lines.length; i++) {
    const line = cleanLine(lines[i]);
    if (categoryRe && categoryRe.test(line)) {
      category = line.replace(categoryRe, '$1').trim();
      continue;
    }
    if (markerRe.test(line)) {
      // filename marker -> next non-empty line should be the title heading
      closeRecord();
      cur = { category, title: '', sections: [], _buf: [] };
      continue;
    }
    if (cur && /^#\s+/.test(line) && !cur.title) {
      cur.title = line.replace(/^#\s+[^:]*:\s*/, '').replace(/^#\s+/, '').trim();
      continue;
    }
    if (cur && /^###\s+/.test(line)) {
      // sub-subsection inside a section (e.g. "### In Autism:")
      if (section) section.lines.push(line); // keep, handled later
      continue;
    }
    if (cur && /^##\s+/.test(line)) {
      closeSection();
      section = { heading: line.replace(/^##\s+/, '').replace(/\s*:?\s*$/, '').trim(), lines: [] };
      continue;
    }
    if (cur && section) section.lines.push(line);
  }
  closeRecord();
  // finalize sections -> blocks
  for (const r of records) {
    for (const s of r.sections) { s.blocks = parseBlocks(s.lines); delete s.lines; }
    delete r._buf;
  }
  return records;
}

const sectionBy = (rec, name) => rec.sections.find((s) => s.heading.toLowerCase() === name.toLowerCase());
const textOf = (sec) => sec ? sec.blocks.filter((b) => b.type === 'p').map((b) => b.text).join(' ') : '';
const listOf = (sec) => {
  if (!sec) return [];
  const ul = sec.blocks.find((b) => b.type === 'ul');
  return ul ? ul.items : [];
};

// ---------- CHAPTERS ----------
const chapterFiles = [
  ['sensory-processing', 'manuscript/chapters/static-ch1-sensory-processing.md', 'SENSORY'],
  ['social-processing', 'manuscript/chapters/static-ch2-social-processing.md', 'OUTPUT'],
  ['executive-function', 'manuscript/chapters/static-ch3-executive-function.md', 'PROCESSING'],
  ['emotional-processing', 'manuscript/chapters/static-ch4-emotional-processing.md', 'PROCESSING'],
  ['capacity-model', 'manuscript/chapters/static-ch5-capacity-model.md', 'LOAD'],
  ['masking-mechanics', 'manuscript/chapters/static-ch6-masking-mechanics.md', 'LOAD'],
];

function parseChapter([id, path, signal], idx) {
  const text = read(path);
  const lines = text.split('\n');
  let title = '', subtitle = '';
  const sections = [];
  let section = null;
  const close = () => { if (section) { section.blocks = parseBlocks(section.lines); delete section.lines; sections.push(section); section = null; } };
  for (const raw of lines) {
    const line = cleanLine(raw);
    if (/^#\s+Chapter/i.test(line)) { title = line.replace(/^#\s+Chapter\s*\d+:\s*/i, '').trim(); continue; }
    if (/^##\s+/.test(line) && !subtitle && sections.length === 0 && !section) { subtitle = line.replace(/^##\s+/, '').trim(); continue; }
    if (/^###\s+/.test(line)) { close(); section = { heading: line.replace(/^###\s+/, '').trim(), lines: [] }; continue; }
    if (line.trim() === '---') continue;
    if (/^\*Chapter|^\*Part/i.test(line)) continue; // drop "next chapter" pointer
    if (section) section.lines.push(line);
  }
  close();
  // pull simple truth + opening out for the card/summary
  const truthSec = sections.find((s) => /simple truth/i.test(s.heading));
  const openingSec = sections.find((s) => /^opening$/i.test(s.heading));
  const simpleTruth = truthSec ? truthSec.blocks.filter((b) => b.type === 'p').map((b) => b.text).join(' ') : '';
  return {
    id, number: idx + 1, signal, title, subtitle, simpleTruth,
    openingFirst: openingSec ? (openingSec.blocks.find((b) => b.type === 'p') || {}).text || '' : '',
    sections,
  };
}
const chapters = chapterFiles.map(parseChapter);

// ---------- BEHAVIORS ----------
const behaviorsRaw = parseRecords(
  read('research/extraction/BEHAVIOURS _structured.md'),
  /^behavior-\d+[\w-]*\.md\s*$/,
  /^####\s+(.*)$/,
);
const behaviors = behaviorsRaw.filter((r) => r.title).map((r, i) => ({
  id: 'behavior-' + (i + 1),
  category: r.category || 'Other',
  title: r.title,
  observable: textOf(sectionBy(r, 'Observable Pattern')),
  scenarios: listOf(sectionBy(r, 'Common Scenarios')),
  mechanism: textOf(sectionBy(r, 'Neurological Mechanism')),
  systems: listOf(sectionBy(r, 'Key Systems Involved')),
  variability: textOf(sectionBy(r, 'Variability Notes')),
}));

// ---------- DIFFERENTIALS ----------
const diffRaw = parseRecords(
  read('research/extraction/DIFFERENTIALS_structured.md'),
  /^differential-[\w-]*\.md\s*$/,
  null,
);
// Distinct Mechanisms holds "### In Autism" / "### In X" — recover those from raw section lines.
function splitDistinct(rec) {
  const sec = rec.sections.find((s) => /distinct mechanisms/i.test(s.heading));
  // re-read raw: we dropped ### lines; re-parse from original text instead
  return sec;
}
const differentials = diffRaw.filter((r) => r.title).map((r, i) => ({
  id: 'diff-' + (i + 1),
  title: r.title,
  overlap: textOf(sectionBy(r, 'Overlapping Presentations')),
  differentiators: listOf(sectionBy(r, 'Key Differentiators')),
  matters: textOf(sectionBy(r, 'Why This Matters')),
  cooccur: textOf(sectionBy(r, 'Can Co-occur')),
}));

// Distinct mechanisms need the ### subheads; do a targeted second pass.
(function fillDistinct() {
  const text = read('research/extraction/DIFFERENTIALS_structured.md');
  const chunks = text.split(/^differential-[\w-]*\.md\s*$/m).slice(1);
  chunks.forEach((chunk, i) => {
    if (!differentials[i]) return;
    const m = chunk.split(/^##\s+Distinct Mechanisms\s*$/m)[1];
    if (!m) return;
    const stop = m.split(/^##\s+Key Differentiators/m)[0];
    const parts = stop.split(/^###\s+/m).slice(1);
    differentials[i].distinct = parts.map((p) => {
      const nl = p.indexOf('\n');
      const label = p.slice(0, nl).replace(/:?\s*$/, '').trim();
      const body = stripCites(p.slice(nl + 1).replace(/\*\*/g, '').replace(/\n+/g, ' ').trim());
      return { label, body };
    });
  });
})();

// ---------- STRATEGIES ----------
const stratRaw = parseRecords(
  read('research/extraction/STRATEGIES_structured.md'),
  /^strategy-[\w-]*\.md\s*$/,
  /^####\s+(.*)$/,
);
const TIMING = ['Immediate', 'Preventive', 'Recovery'];
const strategies = stratRaw.filter((r) => r.title).map((r, i) => {
  const whenItems = listOf(sectionBy(r, 'When to Use'));
  const timing = TIMING.filter((t) => whenItems.some((w) => new RegExp('^' + t, 'i').test(w)));
  const evRaw = textOf(sectionBy(r, 'Effectiveness Evidence'));
  let evidence = 'Anecdotal';
  if (/^high/i.test(evRaw)) evidence = 'Strong';
  else if (/^moderate/i.test(evRaw)) evidence = 'Moderate';
  else if (/^low|emerging|anecdot/i.test(evRaw)) evidence = 'Emerging';
  return {
    id: 'strategy-' + (i + 1),
    category: r.category || 'Other',
    title: r.title,
    what: textOf(sectionBy(r, 'What It Is')),
    timing,
    mechanism: textOf(sectionBy(r, 'How It Works')) || textOf(sectionBy(r, 'How It Works (Mechanism)')),
    steps: listOf(sectionBy(r, 'Implementation Steps')),
    variations: listOf(sectionBy(r, 'Variations')),
    evidence,
    bestFor: listOf(sectionBy(r, 'Works Best For')),
    caveat: textOf(sectionBy(r, 'May Not Work If')),
  };
});

// ---------- SCENARIOS ----------
const scenRaw = parseRecords(
  read('research/extraction/SCENARIOS_structured.md'),
  /^scenario-[\w-]*\.md\s*$/,
  null,
);
const scenarios = scenRaw.filter((r) => r.title).map((r, i) => ({
  id: 'scenario-' + (i + 1),
  title: r.title,
  situation: textOf(sectionBy(r, 'The Situation')),
  neuro: textOf(sectionBy(r, "What's Happening Neurologically")) || textOf(sectionBy(r, 'What’s Happening Neurologically')),
  warnings: listOf(sectionBy(r, 'Warning Signs Visible Here')),
  variations: listOf(sectionBy(r, 'Variations')),
}));

// ---------- EMIT ----------
const out = { chapters, behaviors, differentials, strategies, scenarios };
const banner = '/* AUTO-GENERATED by tools/build-data.mjs — do not edit by hand. */\n';
const js = banner + 'window.STATIC_DATA = ' + JSON.stringify(out) + ';\n';
mkdirSync(resolve(ROOT, 'assets/site'), { recursive: true });
writeFileSync(resolve(ROOT, 'assets/site/data.js'), js);

console.log('Wrote assets/site/data.js');
console.log('  chapters:', chapters.length);
console.log('  behaviors:', behaviors.length, '(categories:', [...new Set(behaviors.map(b=>b.category))].join(', '), ')');
console.log('  differentials:', differentials.length);
console.log('  strategies:', strategies.length, '(categories:', [...new Set(strategies.map(s=>s.category))].join(', '), ')');
console.log('  scenarios:', scenarios.length);
