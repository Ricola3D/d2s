/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const { readString } = require('../utils.js');

function decodeArmorFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, 'armor.bin');
  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 436) {
      console.log('WARNING: expected line length is 436, but actual is ' + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { '*quivered': 0 };

      // item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 flippyfile (CHAR[32])
      item.flippyfile = readString(lineBuffer, 0, 32);

      // 32-63 invfile (CHAR[32])
      item.invfile = readString(lineBuffer, 32, 32);

      // 64-95 uniqueinvfile (CHAR[32])
      item.uniqueinvfile = readString(lineBuffer, 64, 32);

      // 96-127 setinvfile (CHAR[32])
      item.setinvfile = readString(lineBuffer, 96, 32);

      // 128-131 code (CHAR[4])
      item.code = readString(lineBuffer, 128, 4);

      // 132-135 normcode (CHAR[4])
      item.normcode = readString(lineBuffer, 132, 4);

      // 136-139 ubercode (CHAR[4])
      item.ubercode = readString(lineBuffer, 136, 4);

      // 140-143 ultracode (CHAR[4])
      item.ultracode = readString(lineBuffer, 140, 4);

      // 144-147 alternategfx (CHAR[4])
      item.alternategfx = readString(lineBuffer, 144, 4);

      // 148-151 Padding (pSpell)

      // 152-179 Filling (all bytes value 255)

      // 180-187 Padding

      // 188-191 Filling (all bytes value 255)

      // 192-207 Padding

      // 208-211 TMogType
      item.TMogType = readString(lineBuffer, 208, 4);

      // 212-215 minac
      item.minac = lineBuffer.readUint32LE(212);

      // 216-219 maxac
      item.maxac = lineBuffer.readUint32LE(216);

      // 220-223 gamble cost
      item['gamble cost'] = lineBuffer.readUint32LE(220);

      // 224-227 speed
      item.speed = lineBuffer.readUint32LE(224);

      // 228-231 bitfield1
      item.bitfield1 = lineBuffer.readUint32LE(228);

      // 232-235 cost
      item.cost = lineBuffer.readUint32LE(232);

      // 236-239 minstack
      item.minstack = lineBuffer.readUint32LE(236);

      // 240-243 maxstack
      item.maxstack = lineBuffer.readUint32LE(240);

      // 244-247 Padding

      // 248-251 gemoffset
      item.gemoffset = lineBuffer.readUint32LE(248);

      // 252-253 name
      item.name = lineBuffer.readUint16LE(252);

      // 254 version
      item.version = lineBuffer.readUint8(254);

      // 255 Padding

      // 256-257 auto prefix
      item['auto prefix'] = lineBuffer.readUint16LE(256);

      // 258-259 missiletype
      item.missiletype = lineBuffer.readUint16LE(258);

      // 260 rarity
      item.rarity = lineBuffer.readUint8(260);

      // 261 level
      item.level = lineBuffer.readUint8(261);

      // 262 ShowLevel
      item.ShowLevel = lineBuffer.readUint8(262);

      // 263 mindam
      item.mindam = lineBuffer.readUint8(263);

      // 264 maxdam
      item.maxdam = lineBuffer.readUint8(264);

      // 265-268 Padding

      // 269-270 StrBonus
      item.StrBonus = lineBuffer.readUint16LE(269);

      // 271-272 DexBonus
      item.DexBonus = lineBuffer.readUint16LE(271);

      // 273-274 reqstr
      item.reqstr = lineBuffer.readUint16LE(273);

      // 275-276 reqdex
      item.reqdex = lineBuffer.readUint16LE(275);

      // 277 Padding (previously absorbs)

      // 278 invwidth
      item.invwidth = lineBuffer.readUint8(278);

      // 279 invheight
      item.invheight = lineBuffer.readUint8(279);

      // 280 block
      item.block = lineBuffer.readUint8(280);

      // 281 durability
      item.durability = lineBuffer.readUint8(281);

      // 282 nodurability
      item.nodurability = lineBuffer.readUint8(282);

      // 283 Padding

      // 284 component
      item.component = lineBuffer.readUint8(284);

      // 285 rArm
      item.rArm = lineBuffer.readUint8(285);

      // 286 lArm
      item.lArm = lineBuffer.readUint8(286);

      // 287 Torso
      item.Torso = lineBuffer.readUint8(287);

      // 288 Legs
      item.Legs = lineBuffer.readUint8(288);

      // 289 rSPad
      item.rSPad = lineBuffer.readUint8(289);

      // 290 lSPad
      item.lSPad = lineBuffer.readUint8(290);

      // 291 Padding
      item.padding291 = lineBuffer.readUint8(291);

      // 292 useable
      item.useable = lineBuffer.readUint16LE(292);

      // 293 Padding
      item.padding293 = lineBuffer.readUint8(293);

      // 294-295 type
      item.type = lineBuffer.readUint16LE(294);

      // 296-297 type2
      item.type2 = lineBuffer.readUint16LE(296);

      // 298-299 Padding
      item.padding298 = lineBuffer.readUint16LE(298);

      // 300-301 dropsound
      item.dropsound = lineBuffer.readUint16LE(300);

      // 302-303 usesound
      item.usesound = lineBuffer.readUint16LE(302);

      // 304 dropsfxframe
      item.dropsfxframe = lineBuffer.readUint8(304);

      // 305 unique
      item.unique = lineBuffer.readUint8(305);

      // 306 quest
      item.quest = lineBuffer.readUint8(306);

      // 307 questdiffcheck
      item.questdiffcheck = lineBuffer.readUint8(307);

      // 308 transparent
      item.transparent = lineBuffer.readUint8(308);

      // 309 transtbl
      item.transtbl = lineBuffer.readUint8(309);

      // 310 Padding

      // 311 lightradius
      item.lightradius = lineBuffer.readUint8(311);

      // 312-313 belt
      item.belt = lineBuffer.readUint16LE(312);

      // 314 stackable
      item.stackable = lineBuffer.readUint8(314);

      // 315 spawnable
      item.spawnable = lineBuffer.readUint8(315);

      // 316 Padding

      // 317 durwarning
      item.durwarning = lineBuffer.readUint8(317);

      // 318 qntwarning
      item.qntwarning = lineBuffer.readUint8(318);

      // 319 hasinv
      item.hasinv = lineBuffer.readUint8(319);

      // 320 gemsockets
      item.gemsockets = lineBuffer.readUint8(320);

      // 321 Transmogrify
      item.Transmogrify = lineBuffer.readUint8(321);

      // 322 TMogMin
      item.TMogMin = lineBuffer.readUint8(322);

      // 323 TMogMax
      item.TMogMax = lineBuffer.readUint8(323);

      // 324 Filling (byte values 255)

      // 325 Padding

      // 326 gemapplytype
      item.gemapplytype = lineBuffer.readUint8(326);

      // 327 levelreq
      item.levelreq = lineBuffer.readUint8(327);

      // 328 magic lvl
      item['magic lvl'] = lineBuffer.readUint8(328);

      // 329 Transform
      item.Transform = lineBuffer.readUint8(329);

      // 330 InvTrans
      item.InvTrans = lineBuffer.readUint8(330);

      // 331 compactsave
      item.compactsave = lineBuffer.readUint8(331);

      // 332 SkipName
      item.SkipName = lineBuffer.readUint8(332);

      // 333 Nameable
      item.Nameable = lineBuffer.readUint8(333);

      {
        let offset = 334;
        let PNJs = [
          'Akara',
          'Gheed',
          'Charsi',
          'Fara',
          'Lysander',
          'Drognan',
          'Hralti',
          'Alkor',
          'Ormus',
          'Elzix',
          'Asheara',
          'Cain',
          'Halbu',
          'Jamella',
          'Malah',
          'Larzuk',
          'Drehya',
        ];
        // PNJ Min
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + 'Min'] = lineBuffer.readUint8(offset);
          offset += 1;
        }
        // PNJ Max
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + 'Max'] = lineBuffer.readUint8(offset);
          offset += 1;
        }
        // PNJ MagicMin
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + 'MagicMin'] = lineBuffer.readUint8(offset);
          offset += 1;
        }
        // PNJ MagicMax
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + 'MagicMax'] = lineBuffer.readUint8(offset);
          offset += 1;
        }
        // PNJ MagicLvl
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + 'MagicLvl'] = lineBuffer.readUint8(offset);
          offset += 1;
        }
      }

      // 420-423 NightmareUpgrade
      item.NightmareUpgrade = readString(lineBuffer, 420, 4);

      // 424-427 HellUpgrade
      item.HellUpgrade = readString(lineBuffer, 424, 4);

      // 428 PermStoreItem
      item.PermStoreItem = lineBuffer.readUint8(428);

      // 429-431 Padding

      // 432 diablocloneweight
      item.diablocloneweight = lineBuffer.readUint8(432);

      // 433-435 Padding

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }

  return items;
}

module.exports = {
  decodeArmorFile,
};
