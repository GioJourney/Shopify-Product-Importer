const XLSX = require('xlsx');
const { normalizeRow } = require('./normalizer');
const { ERROR_CODES, codedError } = require('../shared/error-codes');

function readExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw codedError(ERROR_CODES.NO_READABLE_SHEETS, 'Il file non contiene fogli leggibili.');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  return rows.map((row, index) => normalizeRow(row, index + 2));
}

module.exports = { readExcelFile };
