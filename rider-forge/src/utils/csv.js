// Utilidades simples para CSV de Input List

const CSV_HEADERS = [
  'canal',
  'fonte',
  'microDi',
  'stand',
  'phantom'
];

export function inputsToCSV(inputs) {
  const rows = Array.isArray(inputs) ? inputs : [];
  const header = CSV_HEADERS.join(',');
  const body = rows.map(r => {
    const values = [
      (r.canal || '').toString().replaceAll('"', '""'),
      (r.fonte || '').toString().replaceAll('"', '""'),
      (r.microDi || '').toString().replaceAll('"', '""'),
      (r.stand || '').toString().replaceAll('"', '""'),
      r.phantom ? 'true' : 'false'
    ];
    return values.map(v => `"${v}"`).join(',');
  }).join('\n');
  return `${header}\n${body}`;
}

export function csvToInputs(csvText) {
  const text = (csvText || '').trim();
  if (!text) return [];
  const lines = text.split(/\r?\n/);
  const header = lines.shift();
  const headerCols = header.split(',').map(h => h.trim().replace(/^\"|\"$/g, ''));
  const colIndex = (name) => headerCols.findIndex(h => h.toLowerCase() === name.toLowerCase());
  const idx = {
    canal: colIndex('canal'),
    fonte: colIndex('fonte'),
    microDi: colIndex('microDi'),
    stand: colIndex('stand'),
    phantom: colIndex('phantom')
  };
  const parseCell = (cell) => cell.replace(/^\"|\"$/g, '').replaceAll('""', '"');
  const inputs = lines.filter(l => l.trim().length > 0).map((line, i) => {
    const cols = splitCsvLine(line);
    const input = {
      id: Date.now() + i,
      canal: parseCell(cols[idx.canal] || ''),
      fonte: parseCell(cols[idx.fonte] || ''),
      microDi: parseCell(cols[idx.microDi] || ''),
      stand: parseCell(cols[idx.stand] || ''),
      phantom: ((cols[idx.phantom] || '').toLowerCase().includes('true'))
    };
    // Se não veio canal, atribuir sequencial
    if (!input.canal) input.canal = (i + 1).toString();
    return input;
  });
  return inputs;
}

function splitCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { // escaped quote
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

export default { inputsToCSV, csvToInputs };


