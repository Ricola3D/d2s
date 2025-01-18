/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const { readString } = require('../utils.js');

function decodeCharStatsFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, 'charstats.bin');

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 208) {
      console.log('WARNING: expected line length is 208, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { '*Comment': 'The following are in fourths' };

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 header (CHAR[32])
      item.class = readString(lineBuffer, 0, 32);

      // 32-47 class (CHAR[16])
      item.class = readString(lineBuffer, 32, 16);

      // 48 str
      item.str = lineBuffer.readUint8(48);

      // 49 dex
      item.dex = lineBuffer.readUint8(49);

      // 50 int
      item.int = lineBuffer.readUint8(50);

      // 51 vit
      item.vit = lineBuffer.readUint8(51);

      // 52 stamina
      item.stamina = lineBuffer.readUint8(52);

      // 53 hpadd
      item.hpadd = lineBuffer.readUint8(53);

      // 54 ManaRegen (Uint8)
      item.ManaRegen = lineBuffer.readUint8(54);

      // 55 Unknown
      //item.unknown55 = lineBuffer.readUint8(55)

      // 56-59 ToHitFactor
      item.ToHitFactor = lineBuffer.readInt32LE(56);

      // 60 WalkVelocity
      item.WalkVelocity = lineBuffer.readUint8(60);

      // 61 RunVelocity
      item.RunVelocity = lineBuffer.readUint8(61);

      // 62 RunDrain
      item.RunDrain = lineBuffer.readUint8(62);

      // 63 LifePerLevel
      item.LifePerLevel = lineBuffer.readUint8(63);

      // 64 StaminaPerLevel
      item.StaminaPerLevel = lineBuffer.readUint8(64);

      // 65 ManaPerLevel
      item.ManaPerLevel = lineBuffer.readUint8(65);

      // 66 LifePerVitality
      item.LifePerVitality = lineBuffer.readUint8(66);

      // 67 StaminaPerVitality
      item.StaminaPerVitality = lineBuffer.readUint8(67);

      // 68 ManaPerMagic
      item.ManaPerMagic = lineBuffer.readUint8(68);

      // 69 BlockFactor
      item.BlockFactor = lineBuffer.readUint8(69);

      // 70-71 Padding

      // 72-75 baseWClass (CHAR[4])
      item.baseWClass = readString(lineBuffer, 72, 4);

      // 76 StatPerLevel
      item.StatPerLevel = lineBuffer.readUint8(76);

      // 77 SkillPerLevel
      item.SkillsPerLevel = lineBuffer.readUint8(77);

      // 78-79 LightRadius
      item.LightRadius = lineBuffer.readUint16LE(78);

      // 80-83 MinimumCastingDelay
      item.MinimumCastingDelay = lineBuffer.readUint32LE(80);

      // 84-85 StrAllSkills (little endian)
      item.StrAllSkills1 = lineBuffer.readUint16LE(84);

      // 86-87 StrSkillTab1 (little endian)
      item.StrSkillTab1 = lineBuffer.readUint16LE(86);

      // 88-89 StrSkillTab2 (little endian)
      item.StrSkillTab2 = lineBuffer.readUint16LE(88);

      // 90-91 StrSkillTab3 (little endian)
      item.StrSkillTab3 = lineBuffer.readUint16LE(90);

      // 92-93 StrClassOnly
      item.StrClassOnly = lineBuffer.readUint16LE(92);

      // 94-95 Padding

      // 96-175 item0..10 (7bits each, 1bit of padding)
      {
        let offset = 96;
        for (let i = 1; i <= 10; i++) {
          // item (CHAR[4])
          item[`item${i}`] = readString(lineBuffer, offset, 4);
          offset += 4;
          // item loc
          item[`item${i}loc`] = lineBuffer.readUint8(offset);
          offset += 1;
          // item count
          item[`item${i}count`] = lineBuffer.readUint8(offset);
          offset += 1;
          // item quality
          item[`item${i}quality`] = lineBuffer.readUint8(offset);
          offset += 1;
          // 1bit Padding
          offset += 1;
        }
      }

      // 176-177 StartSkill
      item.StartSkill = lineBuffer.readUint16LE(176);

      // 178-197 Skill 1..10 (2bits each)
      {
        let offset = 178;
        for (let i = 1; i <= 10; i++) {
          item[`Skill${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 198-199 Padding

      // 200-203 HealthPotionPercent
      item.HealthPotionPercent = lineBuffer.readUint32LE(200);

      // 204-207 ManaPotionPercent
      item.ManaPotionPercent = lineBuffer.readUint32LE(204);

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeCharStatsFile,
};
