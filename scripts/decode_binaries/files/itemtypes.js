/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");

const { readString } = require("../utils.js");

function decodeItemTypesFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, "itemtypes.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;
    console.log("Line count " + lineCount);

    if (lineLength != 228) {
      console.log("WARNING: expected line length is 228, but actual is " + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { "*eol": 0 };

      // 0-3 Code (Char[4])
      item.Code = readString(lineBuffer, 0, 4);

      // 4-5 Equiv1
      item.Equiv1 = lineBuffer.readUint16LE(5);

      // 6-7 Equiv1
      item.Equiv2 = lineBuffer.readUint16LE(6);

      // 8 Repair
      item.Repair = lineBuffer.readUint8(8);

      // 9 Body
      item.Body = lineBuffer.readUint8(9);

      // 10 BodyLoc1
      item.BodyLoc1 = lineBuffer.readUint8(10);

      // 11 BodyLoc2
      item.BodyLoc2 = lineBuffer.readUint8(11);

      // 12-13 Shoots
      item.Shoots = lineBuffer.readUint16LE(12);

      // 14-15 Quiver
      item.Quiver = lineBuffer.readUint16LE(14);

      // 16 Throwable
      item.Throwable = lineBuffer.readUint8(16);

      // 17 Reload
      item.Reload = lineBuffer.readUint8(17);

      // 18 ReEquip
      item.ReEquip = lineBuffer.readUint8(18);

      // 19 AutoStack
      item.AutoStack = lineBuffer.readUint8(19);

      // 20 Magic
      item.Magic = lineBuffer.readUint8(20);

      // 21 Rare
      item.Rare = lineBuffer.readUint8(21);

      // 22 Normal
      item.Normal = lineBuffer.readUint8(22);

      // 23 Charm
      item.Charm = lineBuffer.readUint8(23);

      // 24 Gem
      item.Gem = lineBuffer.readUint8(24);

      // 25 Beltable
      item.Beltable = lineBuffer.readUint8(25);

      // 26 MaxSockets1
      item.MaxSockets1 = lineBuffer.readUint8(26);

      // 27 MaxSocketsLevelThreshold1
      item.MaxSocketsLevelThreshold1 = lineBuffer.readUint8(27);

      // 28 MaxSocketsLevelThreshold2
      item.MaxSocketsLevelThreshold2 = lineBuffer.readUint8(28);

      // 29 TreasureClass
      item.TreasureClass = lineBuffer.readUint8(29);

      // 30 Rarity
      item.Rarity = lineBuffer.readUint8(30);

      // 31 StaffMods
      item.StaffMods = lineBuffer.readUint8(31);

      // 32 CostFormula
      item.CostFormula = lineBuffer.readUint8(32);

      // 33 Class
      item.Class = lineBuffer.readUint8(33);

      // 34 StorePage
      item.StorePage = lineBuffer.readUint8(34);

      // 35 VarInvGfx
      item.VarInvGfx = lineBuffer.readUint8(35);

      // 36-227 InvGfx1..6 (CHAR[32] each)
      {
        let offset = 36;
        for (let i = 1; i <= 6; i++) {
          item[`InvGfx${i}`] = readString(lineBuffer, offset, 32);
          offset += 32;
        }
      }

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeItemTypesFile,
};
