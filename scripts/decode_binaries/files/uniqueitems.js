/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");

const { readString } = require("../utils.js");

function decodeUniqueItemsFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, "setitems.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 444) {
      console.log("WARNING: expected line length is 444, but actual is " + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {};

      item.name = readString(lineBuffer, 0, 32);

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeUniqueItemsFile,
};
