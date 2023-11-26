/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");

const utf8Decoder = new TextDecoder()

const inputDir = "C:/Program Files (x86)/Diablo II Resurrected/mods/ReMoDDeD/ReMoDDeD.mpq/data/global/excel"
const outputDir = "C:/Program Files (x86)/Diablo II Resurrected/mods/ReMoDDeD/ReMoDDeD.mpq/data/global/excel"

const data = {}
const columns = {}

// --------------------------------------------------
// --------------------------------------------------
// input
// --------------------------------------------------
// --------------------------------------------------

function readString(buffer, byteOffset, length) {
  return utf8Decoder.decode(buffer.subarray(byteOffset, byteOffset + length)).replace(/\0/g, '').trim()
}

// -------------------------
// armor.txt
function decodeArmorFile() {
  let items = []
  const inputFile = path.join(inputDir, "armor.bin");
  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 436) {
      console.log("WARNING: expected line length is 436, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { "*quivered": 0 }

      // item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 flippyfile (CHAR[32])
      item.flippyfile = readString(lineBuffer, 0, 32)

      // 32-63 invfile (CHAR[32])
      item.invfile = readString(lineBuffer, 32, 32)

      // 64-95 uniqueinvfile (CHAR[32])
      item.uniqueinvfile = readString(lineBuffer, 64, 32)

      // 96-127 setinvfile (CHAR[32])
      item.setinvfile = readString(lineBuffer, 96, 32)

      // 128-131 code (CHAR[4])
      item.code = readString(lineBuffer, 128, 4)

      // 132-135 normcode (CHAR[4])
      item.normcode = readString(lineBuffer, 132, 4)

      // 136-139 ubercode (CHAR[4])
      item.ubercode = readString(lineBuffer, 136, 4)
  
      // 140-143 ultracode (CHAR[4])
      item.ultracode = readString(lineBuffer, 140, 4)
  
      // 144-147 alternategfx (CHAR[4])
      item.alternategfx = readString(lineBuffer, 144, 4)  

      // 148-151 Padding (pSpell)

      // 152-179 Filling (all bytes value 255)
      
      // 180-187 Padding

      // 188-191 Filling (all bytes value 255)

      // 192-207 Padding

      // 208-211 TMogType
      item.TMogType = readString(lineBuffer, 208, 4)
  
      // 212-215 minac
      item.minac = lineBuffer.readUint32LE(212)

      // 216-219 maxac
      item.maxac = lineBuffer.readUint32LE(216)

      // 220-223 gamble cost
      item["gamble cost"] = lineBuffer.readUint32LE(220)
  
      // 224-227 speed
      item.speed = lineBuffer.readUint32LE(224)

      // 228-231 bitfield1
      item.bitfield1 = lineBuffer.readUint32LE(228)
      
      // 232-235 cost
      item.cost = lineBuffer.readUint32LE(232)

      // 236-239 minstack
      item.minstack = lineBuffer.readUint32LE(236)

      // 240-243 maxstack
      item.maxstack = lineBuffer.readUint32LE(240)

      // 244-247 Padding

      // 248-251 gemoffset
      item.gemoffset = lineBuffer.readUint32LE(248)

      // 252-253 name
      item.name = lineBuffer.readUint16LE(252)

      // 254 version
      item.version = lineBuffer.readUint8(254)

      // 255 Padding

      // 256-257 auto prefix
      item["auto prefix"] = lineBuffer.readUint16LE(256)
  
      // 258-259 missiletype
      item.missiletype = lineBuffer.readUint16LE(258)

      // 260 rarity
      item.rarity = lineBuffer.readUint8(260)

      // 261 level
      item.level = lineBuffer.readUint8(261)

      // 262 ShowLevel
      item.ShowLevel = lineBuffer.readUint8(262)

      // 263 mindam
      item.mindam = lineBuffer.readUint8(263)

      // 264 maxdam
      item.maxdam = lineBuffer.readUint8(264)

      // 265-268 Padding
  
      // 269-270 StrBonus
      item.StrBonus = lineBuffer.readUint16LE(269)
      
      // 271-272 DexBonus
      item.DexBonus = lineBuffer.readUint16LE(271)

      // 273-274 reqstr
      item.reqstr = lineBuffer.readUint16LE(273)

      // 275-276 reqdex
      item.reqdex = lineBuffer.readUint16LE(275)

      // 277 Padding (previously absorbs)

      // 278 invwidth
      item.invwidth = lineBuffer.readUint8(278)

      // 279 invheight
      item.invheight = lineBuffer.readUint8(279)
  
      // 280 block
      item.block = lineBuffer.readUint8(280)

      // 281 durability
      item.durability = lineBuffer.readUint8(281)

      // 282 nodurability
      item.nodurability = lineBuffer.readUint8(282)

      // 283 Padding

      // 284 component
      item.component = lineBuffer.readUint8(284)

      // 285 rArm
      item.rArm = lineBuffer.readUint8(285)

      // 286 lArm
      item.lArm = lineBuffer.readUint8(286)

      // 287 Torso
      item.Torso = lineBuffer.readUint8(287)

      // 288 Legs
      item.Legs = lineBuffer.readUint8(288)

      // 289 rSPad
      item.rSPad = lineBuffer.readUint8(289)

      // 290 lSPad
      item.lSPad = lineBuffer.readUint8(290)

      // 291 Padding
      item.padding291 = lineBuffer.readUint8(291)

      // 292 useable
      item.useable = lineBuffer.readUint16LE(292)

      // 293 Padding
      item.padding293 = lineBuffer.readUint8(293)
  
      // 294-295 type
      item.type = lineBuffer.readUint16LE(294)

      // 296-297 type2
      item.type2 = lineBuffer.readUint16LE(296)

      // 298-299 Padding
      item.padding298 = lineBuffer.readUint16LE(298)

      // 300-301 dropsound
      item.dropsound = lineBuffer.readUint16LE(300)

      // 302-303 usesound
      item.usesound = lineBuffer.readUint16LE(302)

      // 304 dropsfxframe
      item.dropsfxframe = lineBuffer.readUint8(304)

      // 305 unique
      item.unique = lineBuffer.readUint8(305)

      // 306 quest
      item.quest = lineBuffer.readUint8(306)

      // 307 questdiffcheck
      item.questdiffcheck = lineBuffer.readUint8(307)

      // 308 transparent
      item.transparent = lineBuffer.readUint8(308)
      
      // 309 transtbl
      item.transtbl = lineBuffer.readUint8(309)
      
      // 310 Padding
      
      // 311 lightradius
      item.lightradius = lineBuffer.readUint8(311)

      // 312-313 belt
      item.belt = lineBuffer.readUint16LE(312)

      // 314 stackable
      item.stackable = lineBuffer.readUint8(314)

      // 315 spawnable
      item.spawnable = lineBuffer.readUint8(315)

      // 316 Padding
  
      // 317 durwarning
      item.durwarning = lineBuffer.readUint8(317)

      // 318 qntwarning
      item.qntwarning = lineBuffer.readUint8(318)
      
      // 319 hasinv
      item.hasinv = lineBuffer.readUint8(319)

      // 320 gemsockets
      item.gemsockets = lineBuffer.readUint8(320)

      // 321 Transmogrify
      item.Transmogrify = lineBuffer.readUint8(321)

      // 322 TMogMin
      item.TMogMin = lineBuffer.readUint8(322)

      // 323 TMogMax
      item.TMogMax = lineBuffer.readUint8(323)

      // 324 Filling (byte values 255)
      
      // 325 Padding

      // 326 gemapplytype
      item.gemapplytype = lineBuffer.readUint8(326)

      // 327 levelreq
      item.levelreq = lineBuffer.readUint8(327)

      // 328 magic lvl
      item["magic lvl"] = lineBuffer.readUint8(328)

      // 329 Transform
      item.Transform = lineBuffer.readUint8(329)

      // 330 InvTrans
      item.InvTrans = lineBuffer.readUint8(330)
  
      // 331 compactsave
      item.compactsave = lineBuffer.readUint8(331)

      // 332 SkipName
      item.SkipName = lineBuffer.readUint8(332)

      // 333 Nameable
      item.Nameable = lineBuffer.readUint8(333)

      {
        let offset = 334
        let PNJs = [
          "Akara",
          "Gheed",
          "Charsi",
          "Fara",
          "Lysander",
          "Drognan",
          "Hralti",
          "Alkor",
          "Ormus",
          "Elzix",
          "Asheara",
          "Cain",
          "Halbu",
          "Jamella",
          "Malah",
          "Larzuk",
          "Drehya",
        ]
        // PNJ Min
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "Min"] = lineBuffer.readUint8(offset)
          offset += 1
        }
        // PNJ Max
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "Max"] = lineBuffer.readUint8(offset)
          offset += 1
        }
        // PNJ MagicMin
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "MagicMin"] = lineBuffer.readUint8(offset)
          offset += 1
        }
        // PNJ MagicMax
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "MagicMax"] = lineBuffer.readUint8(offset)
          offset += 1
        }
        // PNJ MagicLvl
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "MagicLvl"] = lineBuffer.readUint8(offset)
          offset += 1
        }
      }

      // 420-423 NightmareUpgrade
      item.NightmareUpgrade = readString(lineBuffer, 420, 4)

      // 424-427 HellUpgrade
      item.HellUpgrade = readString(lineBuffer, 424, 4)

      // 428 PermStoreItem
      item.PermStoreItem = lineBuffer.readUint8(428)

      // 429-431 Padding

      // 432 diablocloneweight
      item.diablocloneweight = lineBuffer.readUint8(432)

      // 433-435 Padding

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }

  return items
}
data.armor = decodeArmorFile()

// -------------------------
// charstats.txt
function decodeCharStatsFile() {
  let items = []
  const inputFile = path.join(inputDir, "charstats.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 208) {
      console.log("WARNING: expected line length is 208, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { "*Comment": "The following are in fourths" }

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 header (CHAR[32])
      item.class = readString(lineBuffer, 0, 32)

      // 32-47 class (CHAR[16])
      item.class = readString(lineBuffer, 32, 16)

      // 48 str
      item.str = lineBuffer.readUint8(48)

      // 49 dex
      item.dex = lineBuffer.readUint8(49)

      // 50 int
      item.int = lineBuffer.readUint8(50)

      // 51 vit
      item.vit = lineBuffer.readUint8(51)

      // 52 stamina
      item.stamina = lineBuffer.readUint8(52)

      // 53 hpadd
      item.hpadd = lineBuffer.readUint8(53)

      // 54 ManaRegen (Uint8)
      item.ManaRegen = lineBuffer.readUint8(54)

      // 55 Unknown
      //item.unknown55 = lineBuffer.readUint8(55)

      // 56-59 ToHitFactor
      item.ToHitFactor = lineBuffer.readInt32LE(56)

      // 60 WalkVelocity
      item.WalkVelocity = lineBuffer.readUint8(60)

      // 61 RunVelocity
      item.RunVelocity = lineBuffer.readUint8(61)

      // 62 RunDrain
      item.RunDrain = lineBuffer.readUint8(62)

      // 63 LifePerLevel
      item.LifePerLevel = lineBuffer.readUint8(63)

      // 64 StaminaPerLevel
      item.StaminaPerLevel = lineBuffer.readUint8(64)

      // 65 ManaPerLevel
      item.ManaPerLevel = lineBuffer.readUint8(65)

      // 66 LifePerVitality
      item.LifePerVitality = lineBuffer.readUint8(66)

      // 67 StaminaPerVitality
      item.StaminaPerVitality = lineBuffer.readUint8(67)

      // 68 ManaPerMagic
      item.ManaPerMagic = lineBuffer.readUint8(68)

      // 69 BlockFactor
      item.BlockFactor = lineBuffer.readUint8(69)

      // 70-71 Padding

      // 72-75 baseWClass (CHAR[4])
      item.baseWClass = readString(lineBuffer, 72, 4)

      // 76 StatPerLevel
      item.StatPerLevel = lineBuffer.readUint8(76)

      // 77 SkillPerLevel
      item.SkillsPerLevel = lineBuffer.readUint8(77)

      // 78-79 LightRadius
      item.LightRadius = lineBuffer.readUint16LE(78)

      // 80-83 MinimumCastingDelay
      item.MinimumCastingDelay = lineBuffer.readUint32LE(80)

      // 84-85 StrAllSkills (little endian)
      item.StrAllSkills1 = lineBuffer.readUint16LE(84)

      // 86-87 StrSkillTab1 (little endian)
      item.StrSkillTab1 = lineBuffer.readUint16LE(86)

      // 88-89 StrSkillTab2 (little endian)
      item.StrSkillTab2 = lineBuffer.readUint16LE(88)

      // 90-91 StrSkillTab3 (little endian)
      item.StrSkillTab3 = lineBuffer.readUint16LE(90)

      // 92-93 StrClassOnly
      item.StrClassOnly = lineBuffer.readUint16LE(92)

      // 94-95 Padding

      // 96-175 item0..10 (7bits each, 1bit of padding)
      {
        let offset = 96
        for (let i = 1; i <=10; i++) {
          // item (CHAR[4])
          item[`item${i}`] = readString(lineBuffer, offset, 4)
          offset += 4
          // item loc
          item[`item${i}loc`] = lineBuffer.readUint8(offset)
          offset += 1
          // item count
          item[`item${i}count`] = lineBuffer.readUint8(offset)
          offset += 1
          // item quality
          item[`item${i}quality`] = lineBuffer.readUint8(offset)
          offset += 1
          // 1bit Padding
          offset += 1
        }
      }

      // 176-177 StartSkill
      item.StartSkill = lineBuffer.readUint16LE(176)

      // 178-197 Skill 1..10 (2bits each)
      {
        let offset = 178
        for (let i = 1; i <=10; i++) {
          item[`Skill${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 198-199 Padding

      // 200-203 HealthPotionPercent
      item.HealthPotionPercent = lineBuffer.readUint32LE(200)

      // 204-207 ManaPotionPercent
      item.ManaPotionPercent = lineBuffer.readUint32LE(204)

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.charstats = decodeCharStatsFile()

// gems.txt
function decodeGemsFile() {
  let items = []
  const inputFile = path.join(inputDir, "gems.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 192) {
      console.log("WARNING: expected line length is 192, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {}

      // 0-31 name
      item.name = readString(lineBuffer, 0, 32)

      // 32-39 letter
      item.letter = readString(lineBuffer, 0, 8)

      // 40-43 letter
      item.code = lineBuffer.readUint32LE(40)

      // 44-45 letter
      item.code = lineBuffer.readUint16LE(44)

      // 46 nummods
      item.nummods = lineBuffer.readUint8(46)

      // 47 transform
      item.transform = lineBuffer.readUint8(47)

      // 48-95 weaponMod1..3 (Uint32 + Uint32 + Int32 + Int32 each)
      {
        for (let i = 1; i <= 3; i++) {
          let offset = 48
          item[`weaponMod${i}Code`] = lineBuffer.readUint32LE(offset)
          offset += 4

          item[`weaponMod${i}Param`] = lineBuffer.readUint32LE(offset)
          offset += 4

          item[`weaponMod${i}Min`] = lineBuffer.readInt32LE(offset)
          offset += 4

          item[`weaponMod${i}Max`] = lineBuffer.readInt32LE(offset)
          offset += 4
        }
      }

      // 96-143 helmMod1..3 (Uint32 + Uint32 + Int32 + Int32 each)
      {
        for (let i = 1; i <= 3; i++) {
          let offset = 96
          item[`helmMod${i}Code`] = lineBuffer.readUint32LE(offset)
          offset += 4

          item[`helmMod${i}Param`] = lineBuffer.readUint32LE(offset)
          offset += 4

          item[`helmMod${i}Min`] = lineBuffer.readInt32LE(offset)
          offset += 4

          item[`helmMod${i}Max`] = lineBuffer.readInt32LE(offset)
          offset += 4
        }
      }

      // 144-191 shieldMod1..3 (Uint32 + Uint32 + Int32 + Int32 each)
      {
        for (let i = 1; i <= 3; i++) {
          let offset = 96
          item[`shieldMod${i}Code`] = lineBuffer.readUint32LE(offset)
          offset += 4

          item[`shieldMod${i}Param`] = lineBuffer.readUint32LE(offset)
          offset += 4

          item[`shieldMod${i}Min`] = lineBuffer.readInt32LE(offset)
          offset += 4

          item[`shieldMod${i}Max`] = lineBuffer.readInt32LE(offset)
          offset += 4
        }
      }

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.gems = decodeGemsFile()

// itemstatcost.txt
function decodeItemStatCodeFile() {
  let items = []
  const inputFile = path.join(inputDir, "itemstatcost.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 324) {
      console.log("WARNING: expected line length is 324, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { advdisplay: "", "*eol": 0 }

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-3 *ID
      item["*ID"] = lineBuffer.readUint32LE(0)

      // 4 - 5 Combined bits
      let bits = lineBuffer.readUint16LE(4)
      /* b0 - padding */
      /* b1 - padding */
      /* b2 - padding */
      /* b3 - direct */ item.direct = !!(bits & (1 << 4))
      /* b4 - itemspecific */ item.itemspecific = !!(bits & (1 << 3))
      /* b5 - damagerelated */ item.damagerelated = !!(bits & (1 << 2))
      /* b6 - Signed */ item.Signed = !!(bits & (1 << 1))
      /* b7 - Send Other */ item["Send Other"] = !!(bits & 1)

      /* b8 - padding */
      /* b9 - UpdateAnimRate */ item.UpdateAnimRate = !!(bits & (1 << 8))
      /* b10 - fMin */ item.fMin = !!(bits & (1 << 9))
      /* b11 - fCallback */ item.fCallback = !!(bits & (1 << 10))
      /* b12 - Saved */ item.Saved = !!(bits & (1 << 11))
      /* b13 - CSvSigned */ item.CSvSigned = !!(bits & (1 << 12))
      /* b14 - padding */
      /* b15 - padding */
      
      // 6-7 Padding

      // 8 Send Bits
      item["Send Bits"] = lineBuffer.readUint8(8)
      
      // 9 Send Param Bits
      item["Send Param Bits"] = lineBuffer.readUint8(9)

      // 10 CSvBits
      item.CSvBits = lineBuffer.readUint8(10)

      // 11 CSvParam
      item.CSvParam = lineBuffer.readUint8(11)

      // 12-15 Multiply
      item.Multiply = lineBuffer.readInt32LE(12)

      // 16-19 Add
      item.Add = lineBuffer.readUint32LE(16)

      // 20 ValShift
      item.ValShift = lineBuffer.readUint8(20)

      // 21 Save Bits
      item["Save Bits"] = lineBuffer.readUint8(21)

      // 22 1.09-Save Bits
      item["1.09-Save Bits"] = lineBuffer.readUint8(22)
      
      // 23 Unknown
      item.unknown23 = lineBuffer.readUint8(23)

      // 24-27 Save Add
      item["Save Add"] = lineBuffer.readInt32LE(24)
      
      // 28-31 1.09-Save Add
      item["1.09-Save Add"] = lineBuffer.readInt32LE(28)

      // 32-35 Save Param Bits
      item["Save Param Bits"] = lineBuffer.readUint32LE(32)
      
      // 36-39 Padding
      
      // 40-43
      item.MinAccr = lineBuffer.readUint32LE(40)
      
      // 44 Encode
      item.Encode = lineBuffer.readUint8(44)
      
      // 45 Unknown
      item.unknown45 = lineBuffer.readUint8(45)
      
      // 46-47 maxstat
      item.maxstat = lineBuffer.readUint16LE(46)
      
      // 48-49 descpriority
      item.descpriority = lineBuffer.readUint16LE(48)

      // 50 descfunc
      item.descfunc = lineBuffer.readUint8(50)

      // 51 descfunc
      item.descval = lineBuffer.readUint8(51)

      // 52-53 descstrpos
      item.descstrpos = lineBuffer.readUint16LE(52)

      // 54-55 descstrneg
      item.descstrneg = lineBuffer.readUint16LE(54)

      // 56-57 descstr2
      item.descstr2 = lineBuffer.readUint16LE(56)
      
      // 58-59 dgrp
      item.dgrp = lineBuffer.readUint16LE(58)
      
      // 60 dgrpfunc
      item.dgrpfunc = lineBuffer.readUint8(60)

      // 61 dgrpval
      item.dgrpval = lineBuffer.readUint8(60)
      
      // 62-63 dgrpstrpos
      item.dgrpstrpos = lineBuffer.readUint16LE(62)
      
      // 64-65 dgrpstrneg
      item.dgrpstrneg = lineBuffer.readUint16LE(64)
      
      // 66-67 dgrpstr2
      item.dgrpstr2 = lineBuffer.readUint16LE(66)
      
      // 68-69 itemevent1
      item.itemevent1 = lineBuffer.readUint16LE(68)

      // 70-71 itemevent2
      item.itemevent2 = lineBuffer.readUint16LE(70)

      // 72-73 itemeventfunc1
      item.itemeventfunc1 = lineBuffer.readUint16LE(72)

      // 74-75 itemeventfunc2
      item.itemeventfunc2 = lineBuffer.readUint16LE(74)

      // 76-79 keepzero
      item.keepzero = lineBuffer.readUint32LE(76)

      // 80 op
      item.op = lineBuffer.readUint8(80)

      // 81 op param
      item["op param"] = lineBuffer.readUint8(81)
      
      // 82-83 op param
      item["op base"] = lineBuffer.readUint16LE(82)

      // 84-85 op param
      item["op stat1"] = lineBuffer.readUint16LE(84)

      // 86-87 op param
      item["op stat2"] = lineBuffer.readUint16LE(86)

      // 88-89 op param
      item["op stat3"] = lineBuffer.readUint16LE(88)
      
      // 90-314 Padding
      
      // 316-319 stuff
      item.stuff = lineBuffer.readUint32LE(316)
      
      // 320-323 Padding

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.itemstatcost = decodeItemStatCodeFile()

// itemtypes.txt
function decodeItemTypesFile() {
  let items = []
  const inputFile = path.join(inputDir, "itemtypes.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount
    console.log("Line count " + lineCount)

    if (lineLength != 228) {
      console.log("WARNING: expected line length is 228, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { "*eol": 0 }

      // 0-3 Code (Char[4])
      item.Code = readString(lineBuffer, 0, 4)

      // 4-5 Equiv1
      item.Equiv1 = lineBuffer.readUint16LE(5)

      // 6-7 Equiv1
      item.Equiv2 = lineBuffer.readUint16LE(6)

      // 8 Repair
      item.Repair = lineBuffer.readUint8(8)

      // 9 Body
      item.Body = lineBuffer.readUint8(9)

      // 10 BodyLoc1
      item.BodyLoc1 = lineBuffer.readUint8(10)

      // 11 BodyLoc2
      item.BodyLoc2 = lineBuffer.readUint8(11)

      // 12-13 Shoots
      item.Shoots = lineBuffer.readUint16LE(12)

      // 14-15 Quiver
      item.Quiver = lineBuffer.readUint16LE(14)

      // 16 Throwable
      item.Throwable = lineBuffer.readUint8(16)

      // 17 Reload
      item.Reload = lineBuffer.readUint8(17)

      // 18 ReEquip
      item.ReEquip = lineBuffer.readUint8(18)

      // 19 AutoStack
      item.AutoStack = lineBuffer.readUint8(19)

      // 20 Magic
      item.Magic = lineBuffer.readUint8(20)

      // 21 Rare
      item.Rare = lineBuffer.readUint8(21)

      // 22 Normal
      item.Normal = lineBuffer.readUint8(22)

      // 23 Charm
      item.Charm = lineBuffer.readUint8(23)

      // 24 Gem
      item.Gem = lineBuffer.readUint8(24)

      // 25 Beltable
      item.Beltable = lineBuffer.readUint8(25)

      // 26 MaxSockets1
      item.MaxSockets1 = lineBuffer.readUint8(26)

      // 27 MaxSocketsLevelThreshold1
      item.MaxSocketsLevelThreshold1 = lineBuffer.readUint8(27)

      // 28 MaxSocketsLevelThreshold2
      item.MaxSocketsLevelThreshold2 = lineBuffer.readUint8(28)

      // 29 TreasureClass
      item.TreasureClass = lineBuffer.readUint8(29)

      // 30 Rarity
      item.Rarity = lineBuffer.readUint8(30)

      // 31 StaffMods
      item.StaffMods = lineBuffer.readUint8(31)

      // 32 CostFormula
      item.CostFormula = lineBuffer.readUint8(32)

      // 33 Class
      item.Class = lineBuffer.readUint8(33)

      // 34 StorePage
      item.StorePage = lineBuffer.readUint8(34)

      // 35 VarInvGfx
      item.VarInvGfx = lineBuffer.readUint8(35)

      // 36-227 InvGfx1..6 (CHAR[32] each)
      {
        let offset = 36
        for (let i = 1; i <= 6; i++) {
          item[`InvGfx${i}`] = readString(lineBuffer, offset, 32)
          offset += 32
        }
      }

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.itemtypes = decodeItemTypesFile()

// -------------------------
// magicprefix.txt
// magicsuffix.txt
function decodeMagicAffixFile(prefixOrSuffix) {
  let items = []
  const inputFile = path.join(inputDir, `magic${prefixOrSuffix}.bin`);

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 140) {
      console.log("WARNING: expected line length is 140, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {}

      // item.bytes = lineUint8Array.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 Name (CHAR[32])
      item.Name = readString(lineBuffer, 0, 32)

      // 32-33 padding (Uint16)

      // 34-35 version (Uint16)
      item.version = lineBuffer.readUint16LE(34)

      // 36-83 mod1..3 (Uint32 + Int32 + Int32 + Int32 each)
      {
        let offset = 36
        for (let i = 1; i <= 3; i++) {
          item[`mod${i}code`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`mod${i}param`] = lineBuffer.readInt32LE(offset)
          offset += 4
          item[`mod${i}min`] = lineBuffer.readInt32LE(offset)
          offset += 4
          item[`mod${i}max`] = lineBuffer.readInt32LE(offset)
          offset += 4
        }
      }

      // 84-85 spawnable (Uin16)
      item.spawnable = lineBuffer.readUint16LE(84)

      // 86-87 transformcolor
      item.transformcolor = lineBuffer.readUint16LE(86)

      // 88-89 level
      item.level = lineBuffer.readUint16LE(88)

      // 90-91 paddin90
      //item.paddin90 = lineBuffer.readUint16LE(88)

      // 92-95 group
      item.group = lineBuffer.readUint32LE(92)

      // 96-99 maxlevel
      item.maxlevel = lineBuffer.readUint32LE(96)

      // 100 rare (Uint8)
      item.rare = lineBuffer.readUint8(100)

      // 101 levelreq
      item.levelreq = lineBuffer.readUint8(101)

      // 102 classspecific
      item.classspecific = lineBuffer.readUint8(102)

      // 103 class
      item.class = lineBuffer.readUint8(103)

      // 104 Class Level Req
      item.classlevelreq = lineBuffer.readUint16LE(104)

      // 106-119 itype1..7
      {
        let offset = 106
        for (let i = 1; i <= 7; i++) {
          item[`itype${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 120-129 etype1..5
      {
        let offset = 120
        for (let i = 1; i <= 5; i++) {
          item[`etype${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 130-131 frequency
      item.frequency = lineBuffer.readUint16LE(130)

      // 132-135 multiply
      item.multiply = lineBuffer.readUint32LE(132)

      // 136-139 add
      item.add = lineBuffer.readUint32LE(136)

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.magicprefix = decodeMagicAffixFile("prefix")
data.magicsuffix = decodeMagicAffixFile("suffix")

// misc.txt
function decodeMiscFile() {
  let items = []
  const inputFile = path.join(inputDir, "misc.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 436) {
      console.log("WARNING: expected line length is 436, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {}

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 flippyfile (CHAR[32])
      item.flippyfile = readString(lineBuffer, 0, 32)

      // 32-63 invfile (CHAR[32])
      item.invfile = readString(lineBuffer, 32, 32)

      // 64-95 uniqueinvfile (CHAR[32])
      item.uniqueinvfile = readString(lineBuffer, 64, 32)

      // 96-127 Padding (setinvfileCHAR[32])

      // 128-131 code (CHAR[4])
      item.code = readString(lineBuffer, 128, 4)

      // 132-135 Padding (normcode CHAR[4])
      item.normcode = readString(lineBuffer, 132, 4)

      // 136-139 Padding (ubercode CHAR[4])
      item.ubercode = readString(lineBuffer, 136, 4)
  
      // 140-143 Padding (ultracode CHAR[4])
      item.ultracode = readString(lineBuffer, 140, 4)
  
      // 144-147 alternategfx (CHAR[4])
      item.alternategfx = readString(lineBuffer, 144, 4)  

      // 148-151 pSpell
      item.pSpell = lineBuffer.readUint32LE(148)

      // 152-153 state
      item.state = lineBuffer.readUint16LE(152)

      // 154-155 cstate1
      item.cstate1 = lineBuffer.readUint16LE(154)

      // 156-157 cstate2
      item.cstate2 = lineBuffer.readUint16LE(156)

      // 158-159 stat1
      item.stat1 = lineBuffer.readUint16LE(158)

      // 160-161 stat2
      item.stat2 = lineBuffer.readUint16LE(160)

      // 162-163 stat3
      item.stat3 = lineBuffer.readUint16LE(162)

      // 164-167 calc1
      item.calc1 = lineBuffer.readUint32LE(164)

      // 168-171 calc2
      item.calc2 = lineBuffer.readUint32LE(168)

      // 172-175 calc3
      item.calc3 = lineBuffer.readUint32LE(172)

      // 176-179 len
      item.len = lineBuffer.readUint32LE(176)

      // 180-181 spelldesc
      item.spelldesc = lineBuffer.readUint16LE(180)

      // 182-183 spelldescstr
      item.spelldescstr = lineBuffer.readUint16LE(182)

      // 184-185 spelldescstr2
      item.spelldescstr2 = lineBuffer.readUint16LE(184)

      // 186-187 Padding

      // 188-189 spelldesccalc
      item.spelldesccalc = lineBuffer.readUint32LE(188)

      // 192 spelldesccolor
      item.spelldesccolor = lineBuffer.readUint32LE(192)

      // 193-185 Padding

      // 196-199 BetterGem
      item.BetterGem = readString(lineBuffer, 196, 4)

      // 200-207 Padding

      // 208-211 TMogType
      item.TMogType = readString(lineBuffer, 208, 4)

      // 212-219 Padding

      // 220-223 gamble cost
      item["gamble cost"] = lineBuffer.readUint32LE(220)

      // 224 speed
      item.speed = lineBuffer.readUint8(224)

      // 225-227 Padding

      // 228 bitfield1
      item.bitfield1 = lineBuffer.readUint8(228)

      // 229-231 Padding

      // 232-235 cost
      item.cost = lineBuffer.readUint32LE(232)

      // 236-239 minstack
      item.minstack = lineBuffer.readUint32LE(236)

      // 240-243 maxstack
      item.maxstack = lineBuffer.readUint32LE(240)

      // 244-247 spawnstack
      item.spawnstack = lineBuffer.readUint32LE(244)

      // 248-249 gemoffset
      item.gemoffset = lineBuffer.readUint16LE(248)

      // 250-251 Padding

      // 252-253 namestr
      item.namestr = lineBuffer.readUint16LE(252)

      // 254 version
      item.version = lineBuffer.readUint8(254)

      // 255 Padding

      // 256-257 auto prefix
      item["auto prefix"] = lineBuffer.readUint16LE(256)

      // 258 missiletype
      item.missiletype = lineBuffer.readUint8(258)

      // 259 Padding

      // 260 rarity
      item.rarity = lineBuffer.readUint8(260)

      // 261 level
      item.level = lineBuffer.readUint8(261)

      // 262 ShowLevel
      item.ShowLevel = lineBuffer.readUint8(262)

      // 263 mindam
      item.mindam = lineBuffer.readUint8(263)

      // 264 maxdam
      item.maxdam = lineBuffer.readUint8(264)

      // 265-277 Padding

      // 278 invwidth
      item.invwidth = lineBuffer.readUint8(278)

      // 279 invwidth
      item.invheight = lineBuffer.readUint8(279)

      // 280-281 Padding

      // 282 nodurability
      item.nodurability = lineBuffer.readUint8(282)

      // 283 Padding

      // 284 component
      item.component = lineBuffer.readUint8(284)

      // 285-291 Padding

      // 292 useable
      item.useable = lineBuffer.readUint16LE(292)

      // 293 Padding
  
      // 294-295 type
      item.type = lineBuffer.readUint16LE(294)

      // 296-297 type2
      item.type2 = lineBuffer.readUint16LE(296)

      // 298-299 Padding

      // 300-301 dropsound
      item.dropsound = lineBuffer.readUint16LE(300)

      // 302-303 usesound
      item.usesound = lineBuffer.readUint16LE(302)

      // 304 dropsfxframe
      item.dropsfxframe = lineBuffer.readUint8(304)

      // 305 unique
      item.unique = lineBuffer.readUint8(305)

      // 306 quest
      item.quest = lineBuffer.readUint8(306)

      // 307 questdiffcheck
      item.questdiffcheck = lineBuffer.readUint8(307)

      // 308 transparent
      item.transparent = lineBuffer.readUint8(308)
      
      // 309 transtbl
      item.transtbl = lineBuffer.readUint8(309)
      
      // 310 Padding
      
      // 311 lightradius
      item.lightradius = lineBuffer.readUint8(311)

      // 312 belt
      item.belt = lineBuffer.readUint8(312)

      // 313 autobelt
      item.autobelt = lineBuffer.readUint8(313)

      // 314 stackable
      item.stackable = lineBuffer.readUint8(314)

      // 315 spawnable
      item.spawnable = lineBuffer.readUint8(315)

      // 316 spellicon
      item.spellicon = lineBuffer.readUint8(316)
  
      // 317 durwarning
      item.durwarning = lineBuffer.readUint8(317)

      // 318 qntwarning
      item.qntwarning = lineBuffer.readUint8(318)
      
      // 319 hasinv
      item.hasinv = lineBuffer.readUint8(319)

      // 320 gemsockets
      item.gemsockets = lineBuffer.readUint8(320)

      // 321 Transmogrify
      item.Transmogrify = lineBuffer.readUint8(321)

      // 322 TMogMin
      item.TMogMin = lineBuffer.readUint8(322)

      // 323 TMogMax
      item.TMogMax = lineBuffer.readUint8(323)

      // 324 Filling (byte values 255)
      item.filling324 = lineBuffer.readUint8(324)
      
      // 325 Padding

      // 326 gemapplytype
      item.gemapplytype = lineBuffer.readUint8(326)

      // 327 levelreq
      item.levelreq = lineBuffer.readUint8(327)

      // 328 magic lvl
      item["magic lvl"] = lineBuffer.readUint8(328)

      // 329 Transform
      item.Transform = lineBuffer.readUint8(329)

      // 330 InvTrans
      item.InvTrans = lineBuffer.readUint8(330)
  
      // 331 compactsave
      item.compactsave = lineBuffer.readUint8(331)

      // 332 SkipName
      item.SkipName = lineBuffer.readUint8(332)

      // 333 Nameable
      item.Nameable = lineBuffer.readUint8(333)

      {
        let offset = 334
        let PNJs = [
          "Akara",
          "Gheed",
          "Charsi",
          "Fara",
          "Lysander",
          "Drognan",
          "Hralti",
          "Alkor",
          "Ormus",
          "Elzix",
          "Asheara",
          "Cain",
          "Halbu",
          "Jamella",
          "Malah",
          "Larzuk",
          "Drehya",
        ]
        // PNJ Min
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "Min"] = lineBuffer.readUint8(offset)
          offset += 1
        }
        // PNJ Max
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "Max"] = lineBuffer.readUint8(offset)
          offset += 1
        }
        // PNJ MagicMin
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "MagicMin"] = lineBuffer.readUint8(offset)
          offset += 1
        }
        // PNJ MagicMax
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "MagicMax"] = lineBuffer.readUint8(offset)
          offset += 1
        }
        // PNJ MagicLvl
        for (let i = 0; i < 17; i++) {
          item[PNJs[i] + "MagicLvl"] = lineBuffer.readUint8(offset)
          offset += 1
        }
      }

      // 420-423 NightmareUpgrade
      item.NightmareUpgrade = readString(lineBuffer, 420, 4)

      // 424-427 HellUpgrade
      item.HellUpgrade = readString(lineBuffer, 424, 4)

      // 428 PermStoreItem
      item.PermStoreItem = lineBuffer.readUint8(428)

      // 429 multibuy
      item.multibuy = lineBuffer.readUint8(429)

      // 430-431 Padding

      // 432 diablocloneweight
      item.diablocloneweight = lineBuffer.readUint8(432)

      // 433-435 Padding

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.misc = decodeMiscFile()

// playerclass.txt
function decodePlayerClassFile() {
  let items = []
  const inputFile = path.join(inputDir, "playerclass.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 52) {
      console.log("WARNING: expected line length is 52, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {}

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-31 Player Class
      item["Player Class"] = readString(lineBuffer, 0, 32)

      // 32-47 Padding

      // Code 48-51
      item.Code = readString(lineBuffer, 48, 4)

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.playerclass = decodePlayerClassFile()

// properties.txt
function decodePropertiesFile() {
  let items = []
  const inputFile = path.join(inputDir, "properties.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 46) {
      console.log("WARNING: expected line length is 46, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { 
        "*Enabled": 1,
        "*Tooltip": "",
        "*Parameter": "",
        "*Min": "",
        "*Max": "",
        "*Notes": "",
        "*eol": ""
      }

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-1 code
      item.code = lineBuffer.readUint16LE(0)

      // 2-8 set1-7 (Uint8 each)
      {
        let offset = 2
        for (let i = 1; i <= 7; i++) {
          item[`set${i}`] = lineBuffer.readUint8(offset)
          offset += 1
        }
      }

      // 9 Padding

      // 10-23 val1-7 (Uint16 each)
      {
        let offset = 10
        for (let i = 1; i <= 7; i++) {
          item[`val${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 24-30 func1-7 (Uint8 each)
      {
        let offset = 24
        for (let i = 1; i <= 7; i++) {
          item[`func${i}`] = lineBuffer.readUint8(offset)
          offset += 1
        }
      }

      // 31 Padding

      // 32-45 stat1-7 (Uint16 each)
      {
        let offset = 32
        for (let i = 1; i <= 7; i++) {
          item[`stat${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.properties = decodePropertiesFile()

// rareprefix.txt
// raresuffix.txt
function decodeRareAffixFile(prefixOrSuffix) {
  let items = []
  const inputFile = path.join(inputDir, `rare${prefixOrSuffix}.bin`);

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 72) {
      console.log("WARNING: expected line length is 72, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {}

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-13 Padding

      // 14-15 version
      item.version = lineBuffer.readUint16LE(14)

      // 16-29 itype1..7 (Uint16 each)
      {
        let offset = 16
        for (let i = 1; i <= 7; i++) {
          item[`itype${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 30-37 etype (Uint16 each)
      {
        let offset = 30
        for (let i = 1; i <= 4; i++) {
          item[`etype${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 38-69 name
      item.name = readString(lineBuffer, 38, 32)

      // 70-71 Padding

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.rareprefix = decodeRareAffixFile("prefix")
data.raresuffix = decodeRareAffixFile("suffix")


// runes.txt
function decodeRunesFile() {
  let items = []
  const inputFile = path.join(inputDir, "runes.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 228) {
      console.log("WARNING: expected line length is 46, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {}

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-63 Name
      item.Name = readString(lineBuffer, 0, 64)

      // 64-65 firstLadderSeason
      item.firstLadderSeason = lineBuffer.readUint16LE(64)

      // 66-67 lastLadderSeason
      item.lastLadderSeason = lineBuffer.readUint16LE(66)

      // 68 complete
      item.complete = lineBuffer.readUint8(68)

      // 69 server
      item.server = lineBuffer.readUint8(69)

      // 70-73 Padding

      // 74 - 85 itype1..6 (Uint16 each)
      {
        let offset = 74
        for (let i = 1; i <= 6; i++) {
          item[`itype${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 86-91 etype1..3 (Uint16 each)
      {
        let offset = 86
        for (let i = 1; i <= 3; i++) {
          item[`etype${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 92-115 Rune1..6 (Uint32 each)
      {
        let offset = 92
        for (let i = 1; i <= 6; i++) {
          item[`Rune${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // 116-227
      {
        let offset = 116
        for (let i = 1; i <= 7; i++) {
          item[`vT1Code${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`vT1Param${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`vT1Min${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`vT1Max${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.runes = decodeRunesFile()

// setitems.txt
function decodeSetItemsFile() {
  let items = []
  const inputFile = path.join("C:/Program Files (x86)/Diablo II Resurrected/Data/global/excel" /*inputDir*/, "setitems.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 444) {
      console.log("WARNING: expected line length is 444, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { "*ID": lineIndex, "*ItemName": "", "*eol": ""}

      //item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-1 SetItemId
      item.SetItemId = lineBuffer.readUint16LE(0)

      // 2-33 index
      item.index = readString(lineBuffer, 2, 32)

      // 34-35 Padding
      item.padding34 = lineBuffer.readUint16LE(34)

      // 36-39 Padding
      item.padding36 = lineBuffer.readUint32LE(36)

      // 40-43 item
      item.item = readString(lineBuffer, 40, 4)

      // 44-47
      item.set = lineBuffer.readUint32LE(44)

      // 48-49 Padding
      item.lvl = lineBuffer.readUint16LE(48)

      // 50-51 Padding
      item["level req"] = lineBuffer.readUint16LE(50)

      // 52-55
      item.rarity = lineBuffer.readUint32LE(52)

      // 56-59
      item["cost mult"] = lineBuffer.readUint32LE(56)

      // 60-63
      item["cost add"] = lineBuffer.readUint32LE(60)

      // 64 chrtransform
      item.chrtransform = lineBuffer.readUint8(64)

      // 65 chrtransform
      item.invtransform = lineBuffer.readUint8(65)

      // 66-97 flippyfile
      item.flippyfile = readString(lineBuffer, 66, 32)

      // 98-129 invfile
      item.invfile = readString(lineBuffer, 98, 32)

      // 130-131 dropsound
      item.dropsound = lineBuffer.readUint16LE(130)

      // 132-133 dropsound
      item.usesound = lineBuffer.readUint16LE(132)

      // 134 dropsfxframe
      item.dropsfxframe = lineBuffer.readUint8(134)

      // 135 add func
      item["add func"] = lineBuffer.readUint8(135)

      // 136-279 prop1..9
      {
        let offset = 136
        for (let i = 1; i <= 9; i++) {
          item[`prop${1}`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`par${1}`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`min${1}`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`max${1}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // 280-439
      {
        let offset = 280
        for (let i = 1; i <= 5; i++) {
          item[`aprop${1}a`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`apar${1}a`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`amin${1}a`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`amax${1}a`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`aprop${1}b`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`apar${1}b`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`amin${1}b`] = lineBuffer.readUint32LE(offset)
          offset += 4
          item[`amax${1}b`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // diablocloneweight
      item.diablocloneweight = lineBuffer.readUint8(440)

      // 441-443 Padding

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.setitems = decodeSetItemsFile()

// skilldesc.txt
function decodeSkillDescFile() {
  let items = []
  const inputFile = path.join(inputDir, "skilldesc.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 300) {
      console.log("WARNING: expected line length is 444, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = { "*eol": 0 }

      item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-1 SkillDesc
      item.SkillDesc = lineBuffer.readUint16LE(0)

      // 2 SkillPage
      item.SkillPage = lineBuffer.readUint8(2)

      // 3 SkillRow
      item.SkillRow = lineBuffer.readUint8(3)

      // 4 SkillColumn
      item.SkillColumn = lineBuffer.readUint8(4)

      // 5 ListRow
      item.ListRow = lineBuffer.readUint8(5)

      // 6 IconCel
      item.IconCel = lineBuffer.readUint8(6)

      // 7 HireableIconCel
      item.HireableIconCel = lineBuffer.readUint8(7)

      // 8-9 str name
      //0-9999 string.txt 10000-19999 patchstring.txt 20000- expansionstring.txt
      item["str name"] = lineBuffer.readUint16LE(8)
    
      // 10-11 str short
      item["str short"] = lineBuffer.readUint16LE(10)

      // 12-13 str long
      item["str long"] = lineBuffer.readUint16LE(12)

      // 14-15 str alt
      item["str alt"] = lineBuffer.readUint16LE(14)

      // 16-17 descdam
      item.descdam = lineBuffer.readUint16LE(16)

      // 18-19 descatt
      item.descatt = lineBuffer.readUint16LE(18)

      // 20-23 ddam calc1 (skilldesccode)
      item["ddam calc1"] = lineBuffer.readUint32LE(20)

      // 24-27 ddam calc2 (skilldesccode)
      item["ddam calc2"] = lineBuffer.readUint32LE(24)

      // 28 p1dmelem
      item.p1dmelem = lineBuffer.readUint8(28)

      // 29 p2dmelem
      item.p2dmelem = lineBuffer.readUint8(29)

      // 30 p3dmelem
      item.p3dmelem = lineBuffer.readUint8(30)

      // 31 Padding

      // 32-35 p1dmmin
      item.p1dmmin = lineBuffer.readUint32LE(32)

      // 36-39 p2dmmin
      item.p2dmmin = lineBuffer.readUint32LE(36)

      // 40-43 p3dmmin
      item.p3dmmin = lineBuffer.readUint32LE(40)

      // 44-47 p1dmmax
      item.p1dmmax = lineBuffer.readUint32LE(44)

      // 48-51 p2dmmax
      item.p2dmmax = lineBuffer.readUint32LE(48)

      // 52-55 p3dmmax
      item.p3dmmax = lineBuffer.readUint32LE(52)

      // 56-57 descmissile1
      item.descmissile1 = lineBuffer.readUint16LE(56)

      // 58-59 descmissile2
      item.descmissile2 = lineBuffer.readUint16LE(58)

      // 60-61 descmissile3
      item.descmissile3 = lineBuffer.readUint16LE(60)

      // 62-67 descline1..6
      {
        let offset = 62
        for (let i = 1; i <= 6; i++) {
          item[`descline${i}`] = lineBuffer.readUint8(offset)
          offset++
        }
      }

      // 68-72 dsc2line1..5
      {
        let offset = 68
        for (let i = 1; i <= 5; i++) {
          item[`dsc2line${i}`] = lineBuffer.readUint8(offset)
          offset++
        }
      }

      // 73-79 dsc3line1..7
      {
        let offset = 73
        for (let i = 1; i <= 7; i++) {
          item[`dsc3line${i}`] = lineBuffer.readUint8(offset)
          offset++
        }
      }

      // 80-91 desctexta1..6
      {
        let offset = 80
        for (let i = 1; i <= 6; i++) {
          item[`desctexta${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 92-99 dsc2texta1..5
      {
        let offset = 92
        for (let i = 1; i <= 5; i++) {
          item[`dsc2texta${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 102-115 dsc3texta1..7
      {
        let offset = 102
        for (let i = 1; i <= 7; i++) {
          item[`dsc3texta${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 116-127 desctextb1..6
      {
        let offset = 116
        for (let i = 1; i <= 6; i++) {
          item[`desctextb${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 128-137 dsc2textb1..5
      {
        let offset = 128
        for (let i = 1; i <= 5; i++) {
          item[`dsc2textb${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 138-151 dsc3textb1..7
      {
        let offset = 138
        for (let i = 1; i <= 7; i++) {
          item[`dsc3textb${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 152-175 desccalca1..6
      {
        let offset = 152
        for (let i = 1; i <= 6; i++) {
          item[`desccalca${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // 176-195 dsc2calca1..5
      {
        let offset = 176
        for (let i = 1; i <= 5; i++) {
          item[`dsc2calca${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // 196-223 dsc3calca1..7
      {
        let offset = 196
        for (let i = 1; i <= 7; i++) {
          item[`dsc3calca1${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // 224-247 desccalcb1..6
      {
        let offset = 224
        for (let i = 1; i <= 6; i++) {
          item[`desccalcb${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // 248-267 dsc2calcb1..5
      {
        let offset = 248
        for (let i = 1; i <= 5; i++) {
          item[`dsc2calcb${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // 268-295 dsc3calcb1..7
      {
        let offset = 268
        for (let i = 1; i <= 7; i++) {
          item[`dsc3calcb${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // 296-297 item proc text
      item["item proc text"] = lineBuffer.readUint16LE(296)

      // 298 item proc descline count
      item["item proc descline count"] = lineBuffer.readUint8(298)

      // 299 Padding

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.skilldesc = decodeSkillDescFile()

// skills.txt
function decodeSkillsFile() {
  let items = []
  const inputFile = path.join("C:/Program Files (x86)/Diablo II Resurrected/Data/global/excel" /*inputDir*/, "skills.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 692) {
      console.log("WARNING: expected line length is 444, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {}

      item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "")

      // 0-1 Id
      item.Id = lineBuffer.readUint16LE(0)

      // 2-33 Skill (CHAR[32])
      item.Skill = readString(lineBuffer, 2, 32)

      // 34-35 Padding ?
      //item.padding34 = lineBuffer.readUInt8(34)
      //item.padding35 = lineBuffer.readUInt8(35)

      // 36-43 Combined bits
      let bits = lineBuffer.readUInt8(36)
      /* b0 - prgstack */ item.prgstack = !!(bits & (1 << 7))
      /* b1 - periodic */ item.periodic = !!(bits & (1 << 6))
      /* b2 - aura */ item.aura = !!(bits & (1 << 5))
      /* b3 - passive */ item.passive = !!(bits & (1 << 4))
      /* b4 - finishing */ item.finishing = !!(bits & (1 << 3))
      /* b5 - progressive */ item.progressive = !!(bits & (1 << 2))
      /* b6 - lob */ item.lob = !!(bits & (1 << 1))
      /* b7 - decquant */ item.decquant = !!(bits & 1)

      bits = lineBuffer.readUInt8(37)
      /* b8 - immediate */ item.immediate = !!(bits & (1 << 7))
      /* b9 - weaponsnd */ item.weaponsnd = !!(bits & (1 << 6))
      /* b10 - stsounddelay */ item.stsounddelay = !!(bits & (1 << 5))
      /* b11 - stsuccessonly */ item.stsuccessonly = !!(bits & (1 << 4))
      /* b12 - repeat */ item.repeat = !!(bits & (1 << 3))
      /* b13 - InGame */ item.InGame = !!(bits & (1 << 2))
      /* b14 - Kick */ item.Kick = !!(bits & (1 << 1))
      /* b15 - InTown */ item.InTown = !!(bits & 1)

      bits = lineBuffer.readUInt8(38)
      /* b16 - SearchOpenXY */ item.SearchOpenXY = !!(bits & (1 << 7))
      /* b17 - SearchEnemyNear */ item.SearchEnemyNear = !!(bits & (1 << 6))
      /* b18 - SearchEnemyXY */ item.SearchEnemyXY = !!(bits & (1 << 5))
      /* b19 - TargetableOnly */ item.TargetableOnly = !!(bits & (1 << 4))
      /* b20 - UseAttackRate */ item.UseAttackRate = !!(bits & (1 << 3))
      /* b21 - durability */ item.durability = !!(bits & (1 << 2))
      /* b22 - enhanceable */ item.enhanceable = !!(bits & (1 << 1))
      /* b23 - noammo */ item.noammo = !!(bits & 1)

      bits = lineBuffer.readUInt8(39)
      /* b24 - interrupt */ item.interrupt = !!(bits & (1 << 7))
      /* b25 - leftskill */ item.leftskill = !!(bits & (1 << 6))
      /* b26 - ItemTgtDo */ item.ItemTgtDo = !!(bits & (1 << 5))
      /* b27 - AttackNoMana */ item.AttackNoMana = !!(bits & (1 << 4))
      /* b28 - TargetItem */ item.TargetItem = !!(bits & (1 << 3))
      /* b29 - TargetAlly */ item.TargetAlly = !!(bits & (1 << 2))
      /* b30 - TargetPet */ item.TargetPet = !!(bits & (1 << 1))
      /* b31 - TargetCorpse */ item.TargetCorpse = !!(bits & 1)

      bits = lineBuffer.readUInt8(40)
      /* b32 - rightskill */ item.rightskill = !!(bits & (1 << 7))
      /* b33 - warp */ item.warp = !!(bits & (1 << 6))
      /* b34 - usemanaondo */ item.usemanaondo = !!(bits & (1 << 5))
      /* b35 - scroll */ item.scroll = !!(bits & (1 << 4))
      /* b36 - ItemCltCheckStart */ item.ItemCltCheckStart = !!(bits & (1 << 3))
      /* b37 - ItemCheckStart */ item.ItemCheckStart = !!(bits & (1 << 2))
      /* ?b38 - ItemUseRestrict */ item.ItemUseRestrict = !!(bits & (1 << 1))
      /* b39 - TgtPlaceCheck */ item.TgtPlaceCheck = !!(bits & 1)

      bits = lineBuffer.readUInt8(41)
      /* b40 - XX */ //item.b40 = !!(bits & (1 << 7))
      /* b41 - XX */ //item.b41 = !!(bits & (1 << 6))
      /* b42 - XX */ //item.b42 = !!(bits & (1 << 5))
      /* b43 - XX */ //item.b43 = !!(bits & (1 << 4))
      /* b44 - ClearSelectedOnHold */ item.ClearSelectedOnHold = !!(bits & (1 << 3))
      /* b45 - ContinueCastUnselected */ item.ContinueCastUnselected = !!(bits & (1 << 2))
      /* b46 - KeepCursorStateOnKill */ item.KeepCursorStateOnKill = !!(bits & (1 << 1))
      /* b47 - alwayshit */ item.alwayshit = !!(bits & 1)

      bits = lineBuffer.readUInt8(42)
      /* b48 - XX */ //item.b48 = !!(bits & (1 << 7))
      /* b49 - XX */ //item.b49 = !!(bits & (1 << 6))
      /* b50 - XX */ //item.b50 = !!(bits & (1 << 5))
      /* b51 - XX */ //item.b51 = !!(bits & (1 << 4))
      /* b52 - XX */ //item.b52 = !!(bits & (1 << 3))
      /* b53 - XX */ //item.b53 = !!(bits & (1 << 2))
      /* b54 - XX */ //item.b54 = !!(bits & (1 << 1))
      /* b55 - XX */ //item.b55 = !!(bits & 1)

      bits = lineBuffer.readUInt8(43)
      /* b56 - XX */ //item.b56 = !!(bits & (1 << 7))
      /* b57 - XX */ //item.b57 = !!(bits & (1 << 6))
      /* b58 - XX */ //item.b58 = !!(bits & (1 << 5))
      /* b59 - XX */ //item.b59 = !!(bits & (1 << 4))
      /* b60 - XX */ //item.b60 = !!(bits & (1 << 3))
      /* b61 - XX */ //item.b61 = !!(bits & (1 << 2))
      /* b62 - XX */ //item.b62 = !!(bits & (1 << 1))
      /* b63 - XX */ //item.b63 = !!(bits & 1)

      // 44 charclass
      item.charclass = lineBuffer.readUint8(44)

      // 45-47 Padding ?
      //item.padding45 = readString(lineBuffer, 45, 3)

      // 48 anim (plrmode)
      item.anim = lineBuffer.readUint8(48)

      // 49 monanim (plrmode)
      item.monanim = lineBuffer.readUint8(49)

      // 50 seqtrans (plrmode)
      item.seqtrans = lineBuffer.readUint8(50)

      // 51 seqnum
      item.seqnum = lineBuffer.readUint8(51)

      // 52 range (0=none, 1=h2h, 2=rng, 3=both)
      item.range = lineBuffer.readUint8(52)

      // 53 SelectProc
      item.SelectProc = lineBuffer.readUint8(53)

      // 54-55 seqinput
      item.seqinput = lineBuffer.readUint16LE(54)

      // 56-61 itypea1..2 (0, 33=spea, 45=weap, 46=melee, 47=miss, 48=thro, 67=h2h) (Uint16 each)
      {
        let offset = 56
        for (let i = 1; i <= 3; i++) {
          item[`itypea${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 62-67 itypeb1..2 (0, 38=tpot, ) (Uint16 each)
      {
        let offset = 62
        for (let i = 1; i <= 3; i++) {
          item[`itypeb${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 68-71 etypea1..2 (Uint16 each)
      {
        let offset = 68
        for (let i = 1; i <= 2; i++) {
          item[`etypea${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 72-75 etypeb1..2 (Uint16 each)
      {
        let offset = 72
        for (let i = 1; i <= 2; i++) {
          item[`etypeb${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 76-77 srvstfunc
      item.srvstfunc = lineBuffer.readUint16LE(76)

      // 78-79 srvdofunc
      item.srvdofunc = lineBuffer.readUint16LE(78)

      // 80-85 srvprgfunc1..3 (Uint16 each)
      {
        let offset = 80
        for (let i = 1; i <= 3; i++) {
          item[`srvprgfunc${i}`] = lineBuffer.readUint16LE(offset)
          offset += 2
        }
      }

      // 86-87 Padding ?
      item.padding86 = lineBuffer.readUint16LE(86)

      // 88-99 prgcalc1..3 (Uint32 each)
      {
        let offset = 88
        for (let i = 1; i <= 3; i++) {
          item[`prgcalc${i}`] = lineBuffer.readUint32LE(offset)
          offset += 4
        }
      }

      // 100-101 prgdam
      item.prgdam = lineBuffer.readUint16LE(100)

      // 102-103 srvmissile
      item.srvmissile = lineBuffer.readUint16LE(102)

      // 104-105 srvmissilea
      item.srvmissilea = lineBuffer.readUint16LE(104)

      // 106-107 srvmissileb
      item.srvmissileb = lineBuffer.readUint16LE(106)

      // 108-109 srvmissilec
      item.srvmissilec = lineBuffer.readUint16LE(108)

      // 110-111 srvoverlay
      item.srvoverlay = lineBuffer.readUint16LE(110)

      //     unsigned int vaurafilter;

      //     unsigned short vaurastat1;  //ItemStatCost
      //     unsigned short vaurastat2;  //ItemStatCost
      //     unsigned short vaurastat3;  //ItemStatCost
      //     unsigned short vaurastat4;  //ItemStatCost
      //     unsigned short vaurastat5;  //ItemStatCost
      //     unsigned short vaurastat6;  //ItemStatCost

      //     unsigned int vauralencalc;      //skillscode
      //     unsigned int vaurarangecalc;
      //     unsigned int vaurastatcalc1;
      //     unsigned int vaurastatcalc2;
      //     unsigned int vaurastatcalc3;
      //     unsigned int vaurastatcalc4;
      //     unsigned int vaurastatcalc5;
      //     unsigned int vaurastatcalc6;

      //     unsigned short vaurastate;  //state
      //     unsigned short vauratargetstate;    //state

      //     unsigned short vauraevent1; //event
      //     unsigned short vauraevent2; //event

      //     unsigned short vauraevent3; //event
      //     unsigned short vauraeventfunc1;

      //     unsigned short vauraeventfunc2;
      //     unsigned short vauraeventfunc3;

      //     unsigned short vauratgtevent;   //event
      //     unsigned short vauratgteventfunc;

      //     unsigned short vpassivestate;   //state
      //     unsigned short vpassiveitype;   //itemtypes

      //     unsigned short vpassivestat1;   //ItemStatCost
      //     unsigned short vpassivestat2;   //ItemStatCost

      //     unsigned short vpassivestat3;   //ItemStatCost
      //     unsigned short vpassivestat4;   //ItemStatCost

      //     unsigned short vpassivestat5;   //ItemStatCost
      //     unsigned short iPadding40;

      //     unsigned int vpassivecalc1; //skillscode
      //     unsigned int vpassivecalc2;
      //     unsigned int vpassivecalc3;
      //     unsigned int vpassivecalc4;
      //     unsigned int vpassivecalc5;

      //     unsigned short vpassiveevent;   //events
      //     unsigned short vpassiveeventfunc;

      //     unsigned short vsummon; //MonStats
      //     unsigned char vpettype; //PetType
      //     unsigned char vsummode; //MonMode

      //     unsigned int vpetmax;   //skillscode

      //     unsigned short vsumskill1;  //skills
      //     unsigned short vsumskill2;  //skills

      //     unsigned short vsumskill3;  //skills
      //     unsigned short vsumskill4;  //skills

      //     unsigned short vsumskill5;  //skills
      //     unsigned short iPadding51;

      //     unsigned int vsumsk1calc;   //skillscode
      //     unsigned int vsumsk2calc;
      //     unsigned int vsumsk3calc;
      //     unsigned int vsumsk4calc;
      //     unsigned int vsumsk5calc;

      //     unsigned short vsumumod;
      //     unsigned short vsumoverlay; //overlay

      //     unsigned short vcltmissile; //missiles
      //     unsigned short vcltmissilea;    //missiles
      //     unsigned short vcltmissileb;    //missiles
      //     unsigned short vcltmissilec;    //missiles

      //     unsigned short vcltmissiled;    //missiles
      //     unsigned short vcltstfunc;

      //     unsigned short vcltdofunc;
      //     unsigned short vcltprgfunc1;

      //     unsigned short vcltprgfunc2;
      //     unsigned short vcltprgfunc3;

      //     unsigned short vstsound;    //sounds
      //     unsigned short vstsoundclass;   //sounds

      //     unsigned short vdosound;    //sounds
      //     unsigned short vdosoundmyspa; //sounds

      //     unsigned short vdosoundmyspb; //sounds
      //     unsigned short vcastoverlay;    //overlay

      //     unsigned short vtgtoverlay; //overlay
      //     unsigned short vtgtsound;    //sounds

      //     unsigned short vprgoverlay; //overlay
      //     unsigned short vprgsound;   //sounds

      //     unsigned short vcltoverlaya;    //overlay
      //     unsigned short vcltoverlayb;    //overlay

      //     unsigned int vcltcalc1; //skillscode
      //     unsigned int vcltcalc2;
      //     unsigned int vcltcalc3;

      //     unsigned char vItemTarget;
      //     unsigned char iPadding72;
      //     unsigned short vItemCastSound;  //sounds

      //     unsigned short vItemCastOverlay;    //overlay
      //     unsigned short iPadding73;

      //     unsigned int vperdelay; //skillscode

      //     unsigned short vmaxlvl;
      //     unsigned short vResultFlags;

      //     unsigned int vHitFlags;
      //     unsigned int vHitClass;

      //     unsigned int vcalc1;    //skillscode
      //     unsigned int vcalc2;
      //     unsigned int vcalc3;
      //     unsigned int vcalc4;

      //     int vParam1;
      //     int vParam2;
      //     int vParam3;
      //     int vParam4;
      //     int vParam5;
      //     int vParam6;
      //     int vParam7;
      //     int vParam8;

      //     unsigned short vweapsel;
      //     unsigned short vItemEffect;

      //     unsigned short vItemCltEffect;
      //     unsigned short iPadding91;

      //     unsigned int vskpoints; //skillscode

      //     unsigned short vreqlevel;
      //     unsigned short vreqstr;

      //     unsigned short vreqdex;
      //     unsigned short vreqint;

      //     unsigned short vreqvit;
      //     unsigned short vreqskill1;  //skills

      //     unsigned short vreqskill2;  //skills
      //     unsigned short vreqskill3;  //skills

      //     unsigned short vstartmana;
      //     unsigned short vminmana;

      //     unsigned short vmanashift;
      //     unsigned short vmana;

      //     short vlvlmana;
      //     unsigned char vattackrank;
      //     unsigned char vLineOfSight;

      //     unsigned int vdelay;    //skillscode

      //     unsigned short vskilldesc;  //skilldesc
      //     unsigned short iPadding101;

      //     unsigned int vToHit;
      //     unsigned int vLevToHit;

      //     unsigned int vToHitCalc;    //skillscode

      //     unsigned char vHitShift;
      //     unsigned char vSrcDam;
      //     unsigned short iPadding105;

      //     unsigned int vMinDam;
      //     unsigned int vMaxDam;
      //     unsigned int vMinLevDam1;
      //     unsigned int vMinLevDam2;

      //     unsigned int vMinLevDam3;
      //     unsigned int vMinLevDam4;
      //     unsigned int vMinLevDam5;
      //     unsigned int vMaxLevDam1;
      //     unsigned int vMaxLevDam2;
      //     unsigned int vMaxLevDam3;
      //     unsigned int vMaxLevDam4;
      //     unsigned int vMaxLevDam5;

      //     unsigned int vDmgSymPerCalc;    //skillscode

      //     unsigned short vEType;  //elemtypes
      //     unsigned short iPadding119;

      //     unsigned int vEMin;
      //     unsigned int vEMax;
      //     unsigned int vEMinLev1;
      //     unsigned int vEMinLev2;
      //     unsigned int vEMinLev3;
      //     unsigned int vEMinLev4;
      //     unsigned int vEMinLev5;
      //     unsigned int vEMaxLev1;
      //     unsigned int vEMaxLev2;
      //     unsigned int vEMaxLev3;
      //     unsigned int vEMaxLev4;
      //     unsigned int vEMaxLev5;

      //     unsigned int vEDmgSymPerCalc;   //skillscode
      //     unsigned int vELen;
      //     unsigned int vELevLen1;
      //     unsigned int vELevLen2;
      //     unsigned int vELevLen3;
      //     unsigned int vELenSymPerCalc;   //skillscode

      //     unsigned short vrestrict;
      //     unsigned short vState1;     //states

      //     unsigned short vState2;     //states
      //     unsigned short vState3;     //states

      //     unsigned short vaitype;
      //     short vaibonus;
      //     unsigned int vcostmyspmult;
      //     unsigned int vcostmyspadd;

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.skills = decodeSkillsFile()

// uniqueitems.txt
function decodeUniqueItemsFile() {
  let items = []
  const inputFile = path.join(inputDir, "setitems.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 444) {
      console.log("WARNING: expected line length is 444, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {}

      item.name = readString(lineBuffer, 0, 32)

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.uniqueitems = decodeUniqueItemsFile()

// weapons.txt
function decodeWeaponsFile() {
  let items = []
  const inputFile = path.join(inputDir, "weapons.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0)
    const lineLength = (fileBuffer.byteLength - 4) / lineCount

    if (lineLength != 436) {
      console.log("WARNING: expected line length is 436, but actual is " + lineLength)
    }

    let lineStart = 4 // We skip 4 first bytes
    let lineIndex = 0
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength)

      const lineUint8Array = new Uint8Array(lineBuffer.byteLength)
      lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {}

      item.name = readString(lineBuffer, 0, 32)

      lineStart += lineLength
      lineIndex++
      items.push(item)
    }
  }
  return items
}
data.weapons = decodeWeaponsFile()

// --------------------------------------------------
// --------------------------------------------------
// Links resolution
// --------------------------------------------------
// --------------------------------------------------


// --------------------------------------------------
// --------------------------------------------------
// output
// --------------------------------------------------
// --------------------------------------------------
function buildExcel(lines, columns) {
  let text = columns.join("\t") + "\r\n" // Header
  lines.forEach(line => {
    let lineText = ""
    columns.forEach(col => {
      lineText += "\t"
      //if (line[col] != undefined) {
        lineText += line[col]
      //}
    })
    lineText = lineText.slice(1) // Remove the first tab

    text += lineText + "\r\n"
  })
  return text
}

function writeOutput (iOutputPath, iSection, iData, iColumns) {
  const jsonFile = path.join(iOutputPath, iSection + ".json");
  const txtFile = path.join(iOutputPath, iSection + ".txt");
  fs.writeFileSync(txtFile, buildExcel(iData[iSection], iColumns[iSection]));
  fs.writeFileSync(jsonFile, JSON.stringify(iData[iSection], null, '\t'));
  console.log(`- "${iSection}.txt" and "${iSection}.json" updated.`);
}

console.log(`In dir "${outputDir}":`);

columns.armor = [
  "name",
  "version",
  "compactsave",
  "rarity",
  "spawnable",
  "minac",
  "maxac",
  "speed",
  "reqstr",
  "reqdex",
  "block",
  "durability",
  "nodurability",
  "level",
  "ShowLevel",
  "levelreq",
  "cost",
  "gamble cost",
  "code",
  "namestr",
  "magic lvl",
  "auto prefix",
  "alternategfx",
  "normcode",
  "ubercode",
  "ultracode",
  "component",
  "invwidth",
  "invheight",
  "hasinv",
  "gemsockets",
  "gemapplytype",
  "flippyfile",
  "invfile",
  "uniqueinvfile",
  "setinvfile",
  "rArm",
  "lArm",
  "Torso",
  "Legs",
  "rSPad",
  "lSPad",
  "useable",
  "stackable",
  "minstack",
  "maxstack",
  "spawnstack",
  "Transmogrify",
  "TMogType",
  "TMogMin",
  "TMogMax",
  "type",
  "type2",
  "dropsound",
  "dropsfxframe",
  "usesound",
  "unique",
  "transparent",
  "transtbl",
  "*quivered",
  "lightradius",
  "belt",
  "quest",
  "questdiffcheck",
  "missiletype",
  "durwarning",
  "qntwarning",
  "mindam",
  "maxdam",
  "StrBonus",
  "DexBonus",
  "gemoffset",
  "bitfield1",
  "CharsiMin",
  "CharsiMax",
  "CharsiMagicMin",
  "CharsiMagicMax",
  "CharsiMagicLvl",
  "GheedMin",
  "GheedMax",
  "GheedMagicMin",
  "GheedMagicMax",
  "GheedMagicLvl",
  "AkaraMin",
  "AkaraMax",
  "AkaraMagicMin",
  "AkaraMagicMax",
  "AkaraMagicLvl",
  "FaraMin",
  "FaraMax",
  "FaraMagicMin",
  "FaraMagicMax",
  "FaraMagicLvl",
  "LysanderMin",
  "LysanderMax",
  "LysanderMagicMin",
  "LysanderMagicMax",
  "LysanderMagicLvl",
  "DrognanMin",
  "DrognanMax",
  "DrognanMagicMin",
  "DrognanMagicMax",
  "DrognanMagicLvl",
  "HratliMin",
  "HratliMax",
  "HratliMagicMin",
  "HratliMagicMax",
  "HratliMagicLvl",
  "AlkorMin",
  "AlkorMax",
  "AlkorMagicMin",
  "AlkorMagicMax",
  "AlkorMagicLvl",
  "OrmusMin",
  "OrmusMax",
  "OrmusMagicMin",
  "OrmusMagicMax",
  "OrmusMagicLvl",
  "ElzixMin",
  "ElzixMax",
  "ElzixMagicMin",
  "ElzixMagicMax",
  "ElzixMagicLvl",
  "AshearaMin",
  "AshearaMax",
  "AshearaMagicMin",
  "AshearaMagicMax",
  "AshearaMagicLvl",
  "CainMin",
  "CainMax",
  "CainMagicMin",
  "CainMagicMax",
  "CainMagicLvl",
  "HalbuMin",
  "HalbuMax",
  "HalbuMagicMin",
  "HalbuMagicMax",
  "HalbuMagicLvl",
  "JamellaMin",
  "JamellaMax",
  "JamellaMagicMin",
  "JamellaMagicMax",
  "JamellaMagicLvl",
  "LarzukMin",
  "LarzukMax",
  "LarzukMagicMin",
  "LarzukMagicMax",
  "LarzukMagicLvl",
  "MalahMin",
  "MalahMax",
  "MalahMagicMin",
  "MalahMagicMax",
  "MalahMagicLvl",
  "AnyaMin",
  "AnyaMax",
  "AnyaMagicMin",
  "AnyaMagicMax",
  "AnyaMagicLvl",
  "Transform",
  "InvTrans",
  "SkipName",
  "NightmareUpgrade",
  "HellUpgrade",
  "Nameable",
  "PermStoreItem",
  "diablocloneweight"
];
writeOutput(outputDir, "armor", data, columns);

columns.charstats = [
  "class",
  "str",
  "dext",
  "int",
  "vit",
  "stamina",
  "hpadd",
  "ManaRegen",
  "ToHitFactor",
  "WalkVelocity",
  "RunVelocity",
  "RunDrain",
  "*Comment",
  "LifePerLevel",
  "StaminaPerLevel",
  "ManaPerLevel",
  "LifePerVitality",
  "StaminaPerVitality",
  "ManaPerMagic",
  "StatPerLevel",
  "SkillsPerLevel",
  "LightRadius",
  "BlockFactor",
  "MinimumCastingDelay",
  "StartSkill",
  "Skill 1",
  "Skill 2",
  "Skill 3",
  "Skill 4",
  "Skill 5",
  "Skill 6",
  "Skill 7",
  "Skill 8",
  "Skill 9",
  "Skill 10",
  "StrAllSkills",
  "StrSkillTab1",
  "StrSkillTab2",
  "StrSkillTab3",
  "StrClassOnly",
  "HealthPotionPercent",
  "ManaPotionPercent",
  "baseWClass",
  "item1",
  "item1loc",
  "item1count",
  "item1quality",
  "item2",
  "item2loc",
  "item2count",
  "item2quality",
  "item3",
  "item3loc",
  "item3count",
  "item3quality",
  "item4",
  "item4loc",
  "item4count",
  "item4quality",
  "item5",
  "item5loc",
  "item5count",
  "item5quality",
  "item6",
  "item6loc",
  "item6count",
  "item6quality",
  "item7",
  "item7loc",
  "item7count",
  "item7quality",
  "item8",
  "item8loc",
  "item8count",
  "item8quality",
  "item9",
  "item9loc",
  "item9count",
  "item9quality",
  "item10",
  "item10loc",
  "item10count",
  "item10quality"
];
writeOutput(outputDir, "charstats", data, columns);

columns.gems = [
  "name",
  "letter",
  "transform",
  "code",
  "weaponMod1Code",
  "weaponMod1Param",
  "weaponMod1Min",
  "weaponMod1Max",
  "weaponMod2Code",
  "weaponMod2Param",
  "weaponMod2Min",
  "weaponMod2Max",
  "weaponMod3Code",
  "weaponMod3Param",
  "weaponMod3Min",
  "weaponMod3Max",
  "helmMod1Code",
  "helmMod1Param",
  "helmMod1Min",
  "helmMod1Max",
  "helmMod2Code",
  "helmMod2Param",
  "helmMod2Min",
  "helmMod2Max",
  "helmMod3Code",
  "helmMod3Param",
  "helmMod3Min",
  "helmMod3Max",
  "shieldMod1Code",
  "shieldMod1Param",
  "shieldMod1Min",
  "shieldMod1Max",
  "shieldMod2Code",
  "shieldMod2Param",
  "shieldMod2Min",
  "shieldMod2Max",
  "shieldMod3Code",
  "shieldMod3Param",
  "shieldMod3Min",
  "shieldMod3Max"
]
writeOutput(outputDir, "gems", data, columns);

columns.itemstatcost = [
  "Stat",
  "*ID",
  "Send Other",
  "Signed",
  "Send Bits",
  "Send Param Bits",
  "UpdateAnimRate",
  "Saved",
  "CSvSigned",
  "CSvBits",
  "CSvParam",
  "fCallback",
  "fMin",
  "MinAccr",
  "Encode",
  "Add",
  "Multiply",
  "ValShift",
  "1.09-Save Bits",
  "1.09-Save Add",
  "Save Bits",
  "Save Add",
  "Save Param Bits",
  "keepzero",
  "op",
  "op param",
  "op base",
  "op stat1",
  "op stat2",
  "op stat3",
  "direct",
  "maxstat",
  "damagerelated",
  "itemevent1",
  "itemeventfunc1",
  "itemevent2",
  "itemeventfunc2",
  "descpriority",
  "descfunc",
  "descval",
  "descstrpos",
  "descstrneg",
  "descstr2",
  "dgrp",
  "dgrpfunc",
  "dgrpval",
  "dgrpstrpos",
  "dgrpstrneg",
  "dgrpstr2",
  "stuff",
  "advdisplay",
  "*eol"
]
writeOutput(outputDir, "itemstatcost", data, columns);

columns.itemtypes = [
  "ItemType",
  "Code",
  "Equiv1",
  "Equiv2",
  "Repair",
  "Body",
  "BodyLoc1",
  "BodyLoc2",
  "Shoots",
  "Quiver",
  "Throwable",
  "Reload",
  "ReEquip",
  "AutoStack",
  "Magic",
  "Rare",
  "Normal",
  "Beltable",
  "MaxSockets1",
  "MaxSocketsLevelThreshold1",
  "MaxSockets2",
  "MaxSocketsLevelThreshold2",
  "MaxSockets3",
  "TreasureClass",
  "Rarity",
  "StaffMods",
  "Class",
  "VarInvGfx",
  "InvGfx1",
  "InvGfx2",
  "InvGfx3",
  "InvGfx4",
  "InvGfx5",
  "InvGfx6",
  "StorePage",
  "*eol"
]
writeOutput(outputDir, "itemtypes", data, columns);

columns.magicprefix = [
  "Name",
  "version",
  "spawnable",
  "rare",
  "level",
  "maxlevel",
  "levelreq",
  "classspecific",
  "class",
  "classlevelreq",
  "frequency",
  "group",
  "mod1code",
  "mod1param",
  "mod1min",
  "mod1max",
  "mod2code",
  "mod2param",
  "mod2min",
  "mod2max",
  "mod3code",
  "mod3param",
  "mod3min",
  "mod3max",
  "transformcolor",
  "itype1",
  "itype2",
  "itype3",
  "itype4",
  "itype5",
  "itype6",
  "itype7",
  "etype1",
  "etype2",
  "etype3",
  "etype4",
  "etype5",
  "multiply",
  "add"
];
columns.magicsuffix = columns.magicprefix 
writeOutput(outputDir, "magicprefix", data, columns);
writeOutput(outputDir, "magicsuffix", data, columns);

columns.misc = [
  "name",
  "compactsave",
  "version",
  "level",
  "ShowLevel",
  "levelreq",
  "reqstr",
  "reqdex",
  "rarity",
  "spawnable",
  "speed",
  "nodurability",
  "cost",
  "gamble cost",
  "code",
  "alternategfx",
  "namestr",
  "component",
  "invwidth",
  "invheight",
  "hasinv",
  "gemsockets",
  "gemapplytype",
  "flippyfile",
  "invfile",
  "uniqueinvfile",
  "Transmogrify",
  "TMogType",
  "TMogMin",
  "TMogMax",
  "useable",
  "type",
  "type2",
  "dropsound",
  "dropsfxframe",
  "usesound",
  "unique",
  "transparent",
  "transtbl",
  "lightradius",
  "belt",
  "autobelt",
  "stackable",
  "minstack",
  "maxstack",
  "spawnstack",
  "quest",
  "questdiffcheck",
  "missiletype",
  "spellicon",
  "pSpell",
  "state",
  "cstate1",
  "cstate2",
  "len",
  "stat1",
  "calc1",
  "stat2",
  "calc2",
  "stat3",
  "calc3",
  "spelldesc",
  "spelldescstr",
  "spelldescstr2",
  "spelldesccalc",
  "spelldesccolor",
  "durwarning",
  "qntwarning",
  "gemoffset",
  "BetterGem",
  "bitfield1",
  "CharsiMin",
  "CharsiMax",
  "CharsiMagicMin",
  "CharsiMagicMax",
  "CharsiMagicLvl",
  "GheedMin",
  "GheedMax",
  "GheedMagicMin",
  "GheedMagicMax",
  "GheedMagicLvl",
  "AkaraMin",
  "AkaraMax",
  "AkaraMagicMin",
  "AkaraMagicMax",
  "AkaraMagicLvl",
  "FaraMin",
  "FaraMax",
  "FaraMagicMin",
  "FaraMagicMax",
  "FaraMagicLvl",
  "LysanderMin",
  "LysanderMax",
  "LysanderMagicMin",
  "LysanderMagicMax",
  "LysanderMagicLvl",
  "DrognanMin",
  "DrognanMax",
  "DrognanMagicMin",
  "DrognanMagicMax",
  "DrognanMagicLvl",
  "HratliMin",
  "HratliMax",
  "HratliMagicMin",
  "HratliMagicMax",
  "HratliMagicLvl",
  "AlkorMin",
  "AlkorMax",
  "AlkorMagicMin",
  "AlkorMagicMax",
  "AlkorMagicLvl",
  "OrmusMin",
  "OrmusMax",
  "OrmusMagicMin",
  "OrmusMagicMax",
  "OrmusMagicLvl",
  "ElzixMin",
  "ElzixMax",
  "ElzixMagicMin",
  "ElzixMagicMax",
  "ElzixMagicLvl",
  "AshearaMin",
  "AshearaMax",
  "AshearaMagicMin",
  "AshearaMagicMax",
  "AshearaMagicLvl",
  "CainMin",
  "CainMax",
  "CainMagicMin",
  "CainMagicMax",
  "CainMagicLvl",
  "HalbuMin",
  "HalbuMax",
  "HalbuMagicMin",
  "HalbuMagicMax",
  "HalbuMagicLvl",
  "MalahMin",
  "MalahMax",
  "MalahMagicMin",
  "MalahMagicMax",
  "MalahMagicLvl",
  "LarzukMin",
  "LarzukMax",
  "LarzukMagicMin",
  "LarzukMagicMax",
  "LarzukMagicLvl",
  "AnyaMin",
  "AnyaMax",
  "AnyaMagicMin",
  "AnyaMagicMax",
  "AnyaMagicLvl",
  "JamellaMin",
  "JamellaMax",
  "JamellaMagicMin",
  "JamellaMagicMax",
  "JamellaMagicLvl",
  "Transform",
  "InvTrans",
  "SkipName",
  "NightmareUpgrade",
  "HellUpgrade",
  "mindam",
  "maxdam",
  "PermStoreItem",
  "multibuy",
  "Nameable",
  "diablocloneweight"
]
writeOutput(outputDir, "misc", data, columns)

columns.playerclass = [
  "Player Class",
  "Code"
]
writeOutput(outputDir, "playerclass", data, columns)

columns.properties = [
  "code",
  "*Enabled",
  "func1",
  "stat1",
  "set1",
  "val1",
  "func2",
  "stat2",
  "set2",
  "val2",
  "func3",
  "stat3",
  "set3",
  "val3",
  "func4",
  "stat4",
  "set4",
  "val4",
  "func5",
  "stat5",
  "set5",
  "val5",
  "func6",
  "stat6",
  "set6",
  "val6",
  "func7",
  "stat7",
  "set7",
  "val7",
  "*Tooltip",
  "*Parameter",
  "*Min",
  "*Max",
  "*Notes",
  "*eol"
]
writeOutput(outputDir, "properties", data, columns)

columns.rareprefix = [
  "name",
	"version",
	"itype1",
	"itype2",
	"itype3",
	"itype4",
	"itype5",
	"itype6",
	"itype7",
	"etype1",
	"etype2",
	"etype3",
	"etype4"
]
columns.raresuffix = columns.rareprefix
writeOutput(outputDir, "rareprefix", data, columns);
writeOutput(outputDir, "raresuffix", data, columns);

columns.runes = [
  "Name",
  "*Rune Name",
  "complete",
  "firstLadderSeason",
  "lastLadderSeason",
  "*Patch Release",
  "itype1",
  "itype2",
  "itype3",
  "itype4",
  "itype5",
  "itype6",
  "etype1",
  "etype2",
  "etype3",
  "*RunesUsed",
  "Rune1",
  "Rune2",
  "Rune3",
  "Rune4",
  "Rune5",
  "Rune6",
  "T1Code1",
  "T1Param1",
  "T1Min1",
  "T1Max1",
  "T1Code2",
  "T1Param2",
  "T1Min2",
  "T1Max2",
  "T1Code3",
  "T1Param3",
  "T1Min3",
  "T1Max3",
  "T1Code4",
  "T1Param4",
  "T1Min4",
  "T1Max4",
  "T1Code5",
  "T1Param5",
  "T1Min5",
  "T1Max5",
  "T1Code6",
  "T1Param6",
  "T1Min6",
  "T1Max6",
  "T1Code7",
  "T1Param7",
  "T1Min7",
  "T1Max7",
  "*eol"
]
writeOutput(outputDir, "runes", data, columns);

columns.setitems = [
	"index",
	"*ID",
	"set",
	"item",
	"*ItemName",
	"rarity",
	"lvl",
	"lvl req",
	"chrtransform",
	"invtransform",
	"invfile",
	"flippyfile",
	"dropsound",
	"dropsfxframe",
	"usesound",
	"cost mult",
	"cost add",
	"add func",
	"prop1",
	"par1",
	"min1",
	"max1",
	"prop2",
	"par2",
	"min2",
	"max2",
	"prop3",
	"par3",
	"min3",
	"max3",
	"prop4",
	"par4",
	"min4",
	"max4",
	"prop5",
	"par5",
	"min5",
	"max5",
	"prop6",
	"par6",
	"min6",
	"max6",
	"prop7",
	"par7",
	"min7",
	"max7",
	"prop8",
	"par8",
	"min8",
	"max8",
	"prop9",
	"par9",
	"min9",
	"max9",
	"aprop1a",
	"apar1a",
	"amin1a",
	"amax1a",
	"aprop1b",
	"apar1b",
	"amin1b",
	"amax1b",
	"aprop2a",
	"apar2a",
	"amin2a",
	"amax2a",
	"aprop2b",
	"apar2b",
	"amin2b",
	"amax2b",
	"aprop3a",
	"apar3a",
	"amin3a",
	"amax3a",
	"aprop3b",
	"apar3b",
	"amin3b",
	"amax3b",
	"aprop4a",
	"apar4a",
	"amin4a",
	"amax4a",
	"aprop4b",
	"apar4b",
	"amin4b",
	"amax4b",
	"aprop5a",
	"apar5a",
	"amin5a",
	"amax5a",
	"aprop5b",
	"apar5b",
	"amin5b",
	"amax5b",
	"diablocloneweight",
	"*eol"
]
writeOutput(outputDir, "setitems", data, columns);

columns.skilldesc = [
  "skilldesc",
  "SkillPage",
  "SkillRow",
  "SkillColumn",
  "ListRow",
  "IconCel",
  "HireableIconCel",
  "str name",
  "str short",
  "str long",
  "str alt",
  "descdam",
  "ddam calc1",
  "ddam calc2",
  "p1dmelem",
  "p1dmmin",
  "p1dmmax",
  "p2dmelem",
  "p2dmmin",
  "p2dmmax",
  "p3dmelem",
  "p3dmmin",
  "p3dmmax",
  "descatt",
  "descmissile1",
  "descmissile2",
  "descmissile3",
  "descline1",
  "desctexta1",
  "desctextb1",
  "desccalca1",
  "desccalcb1",
  "descline2",
  "desctexta2",
  "desctextb2",
  "desccalca2",
  "desccalcb2",
  "descline3",
  "desctexta3",
  "desctextb3",
  "desccalca3",
  "desccalcb3",
  "descline4",
  "desctexta4",
  "desctextb4",
  "desccalca4",
  "desccalcb4",
  "descline5",
  "desctexta5",
  "desctextb5",
  "desccalca5",
  "desccalcb5",
  "descline6",
  "desctexta6",
  "desctextb6",
  "desccalca6",
  "desccalcb6",
  "dsc2line1",
  "dsc2texta1",
  "dsc2textb1",
  "dsc2calca1",
  "dsc2calcb1",
  "dsc2line2",
  "dsc2texta2",
  "dsc2textb2",
  "dsc2calca2",
  "dsc2calcb2",
  "dsc2line3",
  "dsc2texta3",
  "dsc2textb3",
  "dsc2calca3",
  "dsc2calcb3",
  "dsc2line4",
  "dsc2texta4",
  "dsc2textb4",
  "dsc2calca4",
  "dsc2calcb4",
  "dsc2line5",
  "dsc2texta5",
  "dsc2textb5",
  "dsc2calca5",
  "dsc2calcb5",
  "dsc3line1",
  "dsc3texta1",
  "dsc3textb1",
  "dsc3calca1",
  "dsc3calcb1",
  "dsc3line2",
  "dsc3texta2",
  "dsc3textb2",
  "dsc3calca2",
  "dsc3calcb2",
  "dsc3line3",
  "dsc3texta3",
  "dsc3textb3",
  "dsc3calca3",
  "dsc3calcb3",
  "dsc3line4",
  "dsc3texta4",
  "dsc3textb4",
  "dsc3calca4",
  "dsc3calcb4",
  "dsc3line5",
  "dsc3texta5",
  "dsc3textb5",
  "dsc3calca5",
  "dsc3calcb5",
  "dsc3line6",
  "dsc3texta6",
  "dsc3textb6",
  "dsc3calca6",
  "dsc3calcb6",
  "dsc3line7",
  "dsc3texta7",
  "dsc3textb7",
  "dsc3calca7",
  "dsc3calcb7",
  "item proc text",
  "item proc descline count",
  "*eol"
]
writeOutput(outputDir, "skilldesc", data, columns);

columns.skills = [
  "skill",
  "*Id",
  "charclass",
  "skilldesc",
  "srvstfunc",
  "srvdofunc",
  "srvstopfunc",
  "prgstack",
  "srvprgfunc1",
  "srvprgfunc2",
  "srvprgfunc3",
  "prgcalc1",
  "prgcalc2",
  "prgcalc3",
  "prgdam",
  "srvmissile",
  "decquant",
  "lob",
  "srvmissilea",
  "srvmissileb",
  "srvmissilec",
  "useServerMissilesOnRemoteClients",
  "srvoverlay",
  "aurafilter",
  "aurastate",
  "auratargetstate",
  "auralencalc",
  "aurarangecalc",
  "aurastat1",
  "aurastatcalc1",
  "aurastat2",
  "aurastatcalc2",
  "aurastat3",
  "aurastatcalc3",
  "aurastat4",
  "aurastatcalc4",
  "aurastat5",
  "aurastatcalc5",
  "aurastat6",
  "aurastatcalc6",
  "auraevent1",
  "auraeventfunc1",
  "auraevent2",
  "auraeventfunc2",
  "auraevent3",
  "auraeventfunc3",
  "passivestate",
  "passiveitype",
  "passivereqweaponcount",
  "passivestat1",
  "passivecalc1",
  "passivestat2",
  "passivecalc2",
  "passivestat3",
  "passivecalc3",
  "passivestat4",
  "passivecalc4",
  "passivestat5",
  "passivecalc5",
  "passivestat6",
  "passivecalc6",
  "passivestat7",
  "passivecalc7",
  "passivestat8",
  "passivecalc8",
  "passivestat9",
  "passivecalc9",
  "passivestat10",
  "passivecalc10",
  "passivestat11",
  "passivecalc11",
  "passivestat12",
  "passivecalc12",
  "passivestat13",
  "passivecalc13",
  "passivestat14",
  "passivecalc14",
  "summon",
  "pettype",
  "petmax",
  "summode",
  "sumskill1",
  "sumsk1calc",
  "sumskill2",
  "sumsk2calc",
  "sumskill3",
  "sumsk3calc",
  "sumskill4",
  "sumsk4calc",
  "sumskill5",
  "sumsk5calc",
  "sumumod",
  "sumoverlay",
  "stsuccessonly",
  "stsound",
  "stsoundclass",
  "stsounddelay",
  "weaponsnd",
  "dosound",
  "dosound a",
  "dosound b",
  "tgtoverlay",
  "tgtsound",
  "prgoverlay",
  "prgsound",
  "castoverlay",
  "cltoverlaya",
  "cltoverlayb",
  "cltstfunc",
  "cltdofunc",
  "cltstopfunc",
  "cltprgfunc1",
  "cltprgfunc2",
  "cltprgfunc3",
  "cltmissile",
  "cltmissilea",
  "cltmissileb",
  "cltmissilec",
  "cltmissiled",
  "cltcalc1",
  "*cltcalc1 desc",
  "cltcalc2",
  "*cltcalc2 desc",
  "cltcalc3",
  "*cltcalc3 desc",
  "warp",
  "immediate",
  "enhanceable",
  "attackrank",
  "noammo",
  "range",
  "weapsel",
  "itypea1",
  "itypea2",
  "itypea3",
  "etypea1",
  "etypea2",
  "itypeb1",
  "itypeb2",
  "itypeb3",
  "etypeb1",
  "etypeb2",
  "anim",
  "seqtrans",
  "monanim",
  "seqnum",
  "seqinput",
  "durability",
  "UseAttackRate",
  "LineOfSight",
  "TargetableOnly",
  "SearchEnemyXY",
  "SearchEnemyNear",
  "SearchOpenXY",
  "SelectProc",
  "TargetCorpse",
  "TargetPet",
  "TargetAlly",
  "TargetItem",
  "AttackNoMana",
  "TgtPlaceCheck",
  "KeepCursorStateOnKill",
  "ContinueCastUnselected",
  "ClearSelectedOnHold",
  "ItemEffect",
  "ItemCltEffect",
  "ItemTgtDo",
  "ItemTarget",
  "ItemUseRestrict",
  "ItemCheckStart",
  "ItemCltCheckStart",
  "ItemCastSound",
  "ItemCastOverlay",
  "skpoints",
  "reqlevel",
  "maxlvl",
  "reqstr",
  "reqdex",
  "reqint",
  "reqvit",
  "reqskill1",
  "reqskill2",
  "reqskill3",
  "restrict",
  "State1",
  "State2",
  "State3",
  "localdelay",
  "globaldelay",
  "leftskill",
  "rightskill",
  "repeat",
  "alwayshit",
  "usemanaondo",
  "startmana",
  "minmana",
  "manashift",
  "mana",
  "lvlmana",
  "interrupt",
  "InTown",
  "aura",
  "periodic",
  "perdelay",
  "finishing",
  "prgchargestocast",
  "prgchargesconsumed",
  "passive",
  "progressive",
  "scroll",
  "calc1",
  "*calc1 desc",
  "calc2",
  "*calc2 desc",
  "calc3",
  "*calc3 desc",
  "calc4",
  "*calc4 desc",
  "calc5",
  "*calc5 desc",
  "calc6",
  "*calc6 desc",
  "Param1",
  "*Param1 Description",
  "Param2",
  "*Param2 Description",
  "Param3",
  "*Param3 Description",
  "Param4",
  "*Param4 Description",
  "Param5",
  "*Param5 Description",
  "Param6",
  "*Param6 Description",
  "Param7",
  "*Param7 Description",
  "Param8",
  "*Param8 Description",
  "Param9",
  "*Param9 Description",
  "Param10",
  "*Param10 Description2",
  "Param11",
  "*Param11 Description",
  "Param12",
  "*Param12 Description",
  "InGame",
  "ToHit",
  "LevToHit",
  "ToHitCalc",
  "ResultFlags",
  "HitFlags",
  "HitClass",
  "Kick",
  "HitShift",
  "SrcDam",
  "MinDam",
  "MinLevDam1",
  "MinLevDam2",
  "MinLevDam3",
  "MinLevDam4",
  "MinLevDam5",
  "MaxDam",
  "MaxLevDam1",
  "MaxLevDam2",
  "MaxLevDam3",
  "MaxLevDam4",
  "MaxLevDam5",
  "DmgSymPerCalc",
  "EType",
  "EMin",
  "EMinLev1",
  "EMinLev2",
  "EMinLev3",
  "EMinLev4",
  "EMinLev5",
  "EMax",
  "EMaxLev1",
  "EMaxLev2",
  "EMaxLev3",
  "EMaxLev4",
  "EMaxLev5",
  "EDmgSymPerCalc",
  "ELen",
  "ELevLen1",
  "ELevLen2",
  "ELevLen3",
  "ELenSymPerCalc",
  "aitype",
  "aibonus",
  "cost mult",
  "cost add",
  "*eol"
]
writeOutput(outputDir, "skills", data, columns);