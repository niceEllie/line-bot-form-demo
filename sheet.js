const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("../credentials.json");
require("dotenv").config();

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

async function accessSheet() {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
}

exports.appendRow = async (values) => {
  const sheet = await accessSheet();
  await sheet.addRow(values);
};

exports.updateStatusByBrand = async (brandName, columnName, newValue) => {
  const sheet = await accessSheet();
  const rows = await sheet.getRows();
  const targetRow = rows.find(row => row["品牌名稱"] === brandName);
  if (targetRow) {
    targetRow[columnName] = newValue;
    await targetRow.save();
  }
};