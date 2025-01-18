/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

const { readString } = require('../utils.js');

function decodeMiscFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, 'misc.bin');

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

      let item = {};

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 flippyfile (CHAR[32])
      item.flippyfile = readString(lineBuffer, 0, 32);

      // 32-63 invfile (CHAR[32])
      item.invfile = readString(lineBuffer, 32, 32);

      // 64-95 uniqueinvfile (CHAR[32])
      item.uniqueinvfile = readString(lineBuffer, 64, 32);

      // 96-127 Padding (setinvfileCHAR[32])

      // 128-131 code (CHAR[4])
      item.code = readString(lineBuffer, 128, 4);

      // 132-135 Padding (normcode CHAR[4])
      item.normcode = readString(lineBuffer, 132, 4);

      // 136-139 Padding (ubercode CHAR[4])
      item.ubercode = readString(lineBuffer, 136, 4);

      // 140-143 Padding (ultracode CHAR[4])
      item.ultracode = readString(lineBuffer, 140, 4);

      // 144-147 alternategfx (CHAR[4])
      item.alternategfx = readString(lineBuffer, 144, 4);

      // 148-151 pSpell
      item.pSpell = lineBuffer.readUint32LE(148);

      // 152-153 state
      item.state = lineBuffer.readUint16LE(152);

      // 154-155 cstate1
      item.cstate1 = lineBuffer.readUint16LE(154);

      // 156-157 cstate2
      item.cstate2 = lineBuffer.readUint16LE(156);

      // 158-159 stat1
      item.stat1 = lineBuffer.readUint16LE(158);

      // 160-161 stat2
      item.stat2 = lineBuffer.readUint16LE(160);

      // 162-163 stat3
      item.stat3 = lineBuffer.readUint16LE(162);

      // 164-167 calc1
      item.calc1 = lineBuffer.readUint32LE(164);

      // 168-171 calc2
      item.calc2 = lineBuffer.readUint32LE(168);

      // 172-175 calc3
      item.calc3 = lineBuffer.readUint32LE(172);

      // 176-179 len
      item.len = lineBuffer.readUint32LE(176);

      // 180-181 spelldesc
      item.spelldesc = lineBuffer.readUint16LE(180);

      // 182-183 spelldescstr
      item.spelldescstr = lineBuffer.readUint16LE(182);

      // 184-185 spelldescstr2
      item.spelldescstr2 = lineBuffer.readUint16LE(184);

      // 186-187 Padding

      // 188-189 spelldesccalc
      item.spelldesccalc = lineBuffer.readUint32LE(188);

      // 192 spelldesccolor
      item.spelldesccolor = lineBuffer.readUint32LE(192);

      // 193-185 Padding

      // 196-199 BetterGem
      item.BetterGem = readString(lineBuffer, 196, 4);

      // 200-207 Padding

      // 208-211 TMogType
      item.TMogType = readString(lineBuffer, 208, 4);

      // 212-219 Padding

      // 220-223 gamble cost
      item['gamble cost'] = lineBuffer.readUint32LE(220);

      // 224 speed
      item.speed = lineBuffer.readUint8(224);

      // 225-227 Padding

      // 228 bitfield1
      item.bitfield1 = lineBuffer.readUint8(228);

      // 229-231 Padding

      // 232-235 cost
      item.cost = lineBuffer.readUint32LE(232);

      // 236-239 minstack
      item.minstack = lineBuffer.readUint32LE(236);

      // 240-243 maxstack
      item.maxstack = lineBuffer.readUint32LE(240);

      // 244-247 spawnstack
      item.spawnstack = lineBuffer.readUint32LE(244);

      // 248-249 gemoffset
      item.gemoffset = lineBuffer.readUint16LE(248);

      // 250-251 Padding

      // 252-253 namestr
      item.namestr = lineBuffer.readUint16LE(252);

      // 254 version
      item.version = lineBuffer.readUint8(254);

      // 255 Padding

      // 256-257 auto prefix
      item['auto prefix'] = lineBuffer.readUint16LE(256);

      // 258 missiletype
      item.missiletype = lineBuffer.readUint8(258);

      // 259 Padding

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

      // 265-277 Padding

      // 278 invwidth
      item.invwidth = lineBuffer.readUint8(278);

      // 279 invwidth
      item.invheight = lineBuffer.readUint8(279);

      // 280-281 Padding

      // 282 nodurability
      item.nodurability = lineBuffer.readUint8(282);

      // 283 Padding

      // 284 component
      item.component = lineBuffer.readUint8(284);

      // 285-291 Padding

      // 292 useable
      item.useable = lineBuffer.readUint16LE(292);

      // 293 Padding

      // 294-295 type
      item.type = lineBuffer.readUint16LE(294);

      // 296-297 type2
      item.type2 = lineBuffer.readUint16LE(296);

      // 298-299 Padding

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

      // 312 belt
      item.belt = lineBuffer.readUint8(312);

      // 313 autobelt
      item.autobelt = lineBuffer.readUint8(313);

      // 314 stackable
      item.stackable = lineBuffer.readUint8(314);

      // 315 spawnable
      item.spawnable = lineBuffer.readUint8(315);

      // 316 spellicon
      item.spellicon = lineBuffer.readUint8(316);

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
      item.filling324 = lineBuffer.readUint8(324);

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

      // 429 multibuy
      item.multibuy = lineBuffer.readUint8(429);

      // 430-431 Padding

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
  decodeMiscFile,
};
