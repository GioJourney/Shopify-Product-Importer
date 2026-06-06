const XLSX = require('xlsx');
const { normalizeRow } = require('./normalizer');

function readExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('Il file non contiene fogli leggibili.');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  return rows.map((row, index) => normalizeRow(row, index + 2));
}

module.exports = { readExcelFile };
