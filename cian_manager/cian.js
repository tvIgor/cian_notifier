"use strict"

const fetch = require("node-fetch");
const xlsx = require("xlsx");
//const fs = require("fs");

const regRes = process.env.CIAN_REQUEST.match(/(?<=").*(?=")/);
if (regRes && regRes.length)
  process.env.CIAN_REQUEST = regRes[0];

function findColumn(sheet, name) {
  for (let col = 0;; ++col) {
    const cell_ref = xlsx.utils.encode_cell({c: col, r: 0});
    const cell = sheet[cell_ref];
    if (!cell || !cell.v) 
      break; 

    if (cell.v == name)
      return col;
  }

  return null;
}

module.exports.getOffers = async function getOffers() {
  const offers = [];

  const response = await fetch(process.env.CIAN_REQUEST);
  const buffer = await response.buffer();
  //const buffer = fs.readFileSync("C:\\Users\\tvigo\\ProgrammingProjects\\JS\\cian_notifier\\cian_manager\\offers.xlsx");

  const workbook = xlsx.read(buffer, {type:'buffer'});  

  const mainSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[mainSheetName];
  
  if (sheet) {  
    const linkCol = findColumn(sheet, "Ссылка на объявление");

    for (let row = 1;; ++row) {
      const linkCell = sheet[xlsx.utils.encode_cell({c: linkCol, r: row})];
      if (!linkCell || !linkCell.v) break;
      offers.push({
        link: linkCell.v
      });
    }
  }

  return offers;
}
