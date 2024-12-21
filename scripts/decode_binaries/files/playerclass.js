/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");

const { readString } = require("../utils.js");

function decodePlayerClassFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, "playerclass.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 52) {
      console.log("WARNING: expected line length is 52, but actual is " + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {};

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 Player Class
      item["Player Class"] = readString(lineBuffer, 0, 32);

      // 32-47 Padding

      // Code 48-51
      item.Code = readString(lineBuffer, 48, 4);

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodePlayerClassFile,
};
