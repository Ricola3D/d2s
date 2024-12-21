/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");

const utf8Decoder = new TextDecoder();

function readString(buffer, byteOffset, length) {
  return utf8Decoder
    .decode(buffer.subarray(byteOffset, byteOffset + length))
    .replace(/\0/g, "")
    .trim();
}

function buildExcel(lines, columns) {
  let text = columns.join("\t") + "\r\n"; // Header
  lines.forEach((line) => {
    let lineText = "";
    columns.forEach((col) => {
      lineText += "\t";
      //if (line[col] != undefined) {
      lineText += line[col];
      //}
    });
    lineText = lineText.slice(1); // Remove the first tab

    text += lineText + "\r\n";
  });
  return text;
}

function writeOutput(iOutputPath, iSection, iData, iColumns) {
  const jsonFile = path.join(iOutputPath, `${iSection}.json`);
  const txtFile = path.join(iOutputPath, `_${iSection}.txt`);
  fs.writeFileSync(txtFile, buildExcel(iData[iSection], iColumns[iSection]));
  fs.writeFileSync(jsonFile, JSON.stringify(iData[iSection], null, "\t"));
  console.log(`- "${iSection}.txt" and "${iSection}.json" updated.`);
}

module.exports = {
  readString,
  writeOutput,
};
