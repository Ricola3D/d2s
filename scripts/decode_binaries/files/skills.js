/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const path = require("path");

const { readString } = require("../utils.js");

function decodeSkillsFile(inputDir) {
  let items = [];
  const inputFile = path.join(inputDir, "skills.bin");

  if (fs.existsSync(inputFile)) {
    const fileBuffer = fs.readFileSync(inputFile);

    const lineCount = fileBuffer.readUInt32LE(0);
    const lineLength = (fileBuffer.byteLength - 4) / lineCount;

    if (lineLength != 692) {
      console.log("WARNING: expected line length is 444, but actual is " + lineLength);
    }

    let lineStart = 4; // We skip 4 first bytes
    let lineIndex = 0;
    while (lineIndex < lineCount) {
      const lineBuffer = fileBuffer.subarray(lineStart, lineStart + lineLength);

      // const lineUint8Array = new Uint8Array(lineBuffer.byteLength);
      // lineBuffer.copy(lineUint8Array, 0, 0, lineBuffer.byteLength);

      let item = {};

      item.bytes = lineBuffer.reduce((acc, byte) => acc + " " + byte, "");

      // 0-1 Id
      item.Id = lineBuffer.readUint16LE(0);

      // 2-33 Skill (CHAR[32])
      item.Skill = readString(lineBuffer, 2, 32);

      // 34-35 Padding ?
      //item.padding34 = lineBuffer.readUInt8(34)
      //item.padding35 = lineBuffer.readUInt8(35)

      // 36-43 Combined bits
      let bits = lineBuffer.readUInt8(36);
      /* b0 - prgstack */ item.prgstack = !!(bits & (1 << 7));
      /* b1 - periodic */ item.periodic = !!(bits & (1 << 6));
      /* b2 - aura */ item.aura = !!(bits & (1 << 5));
      /* b3 - passive */ item.passive = !!(bits & (1 << 4));
      /* b4 - finishing */ item.finishing = !!(bits & (1 << 3));
      /* b5 - progressive */ item.progressive = !!(bits & (1 << 2));
      /* b6 - lob */ item.lob = !!(bits & (1 << 1));
      /* b7 - decquant */ item.decquant = !!(bits & 1);

      bits = lineBuffer.readUInt8(37);
      /* b8 - immediate */ item.immediate = !!(bits & (1 << 7));
      /* b9 - weaponsnd */ item.weaponsnd = !!(bits & (1 << 6));
      /* b10 - stsounddelay */ item.stsounddelay = !!(bits & (1 << 5));
      /* b11 - stsuccessonly */ item.stsuccessonly = !!(bits & (1 << 4));
      /* b12 - repeat */ item.repeat = !!(bits & (1 << 3));
      /* b13 - InGame */ item.InGame = !!(bits & (1 << 2));
      /* b14 - Kick */ item.Kick = !!(bits & (1 << 1));
      /* b15 - InTown */ item.InTown = !!(bits & 1);

      bits = lineBuffer.readUInt8(38);
      /* b16 - SearchOpenXY */ item.SearchOpenXY = !!(bits & (1 << 7));
      /* b17 - SearchEnemyNear */ item.SearchEnemyNear = !!(bits & (1 << 6));
      /* b18 - SearchEnemyXY */ item.SearchEnemyXY = !!(bits & (1 << 5));
      /* b19 - TargetableOnly */ item.TargetableOnly = !!(bits & (1 << 4));
      /* b20 - UseAttackRate */ item.UseAttackRate = !!(bits & (1 << 3));
      /* b21 - durability */ item.durability = !!(bits & (1 << 2));
      /* b22 - enhanceable */ item.enhanceable = !!(bits & (1 << 1));
      /* b23 - noammo */ item.noammo = !!(bits & 1);

      bits = lineBuffer.readUInt8(39);
      /* b24 - interrupt */ item.interrupt = !!(bits & (1 << 7));
      /* b25 - leftskill */ item.leftskill = !!(bits & (1 << 6));
      /* b26 - ItemTgtDo */ item.ItemTgtDo = !!(bits & (1 << 5));
      /* b27 - AttackNoMana */ item.AttackNoMana = !!(bits & (1 << 4));
      /* b28 - TargetItem */ item.TargetItem = !!(bits & (1 << 3));
      /* b29 - TargetAlly */ item.TargetAlly = !!(bits & (1 << 2));
      /* b30 - TargetPet */ item.TargetPet = !!(bits & (1 << 1));
      /* b31 - TargetCorpse */ item.TargetCorpse = !!(bits & 1);

      bits = lineBuffer.readUInt8(40);
      /* b32 - rightskill */ item.rightskill = !!(bits & (1 << 7));
      /* b33 - warp */ item.warp = !!(bits & (1 << 6));
      /* b34 - usemanaondo */ item.usemanaondo = !!(bits & (1 << 5));
      /* b35 - scroll */ item.scroll = !!(bits & (1 << 4));
      /* b36 - ItemCltCheckStart */ item.ItemCltCheckStart = !!(bits & (1 << 3));
      /* b37 - ItemCheckStart */ item.ItemCheckStart = !!(bits & (1 << 2));
      /* ?b38 - ItemUseRestrict */ item.ItemUseRestrict = !!(bits & (1 << 1));
      /* b39 - TgtPlaceCheck */ item.TgtPlaceCheck = !!(bits & 1);

      bits = lineBuffer.readUInt8(41);
      /* b40 - XX */ //item.b40 = !!(bits & (1 << 7))
      /* b41 - XX */ //item.b41 = !!(bits & (1 << 6))
      /* b42 - XX */ //item.b42 = !!(bits & (1 << 5))
      /* b43 - XX */ //item.b43 = !!(bits & (1 << 4))
      /* b44 - ClearSelectedOnHold */ item.ClearSelectedOnHold = !!(bits & (1 << 3));
      /* b45 - ContinueCastUnselected */ item.ContinueCastUnselected = !!(bits & (1 << 2));
      /* b46 - KeepCursorStateOnKill */ item.KeepCursorStateOnKill = !!(bits & (1 << 1));
      /* b47 - alwayshit */ item.alwayshit = !!(bits & 1);

      bits = lineBuffer.readUInt8(42);
      /* b48 - XX */ //item.b48 = !!(bits & (1 << 7))
      /* b49 - XX */ //item.b49 = !!(bits & (1 << 6))
      /* b50 - XX */ //item.b50 = !!(bits & (1 << 5))
      /* b51 - XX */ //item.b51 = !!(bits & (1 << 4))
      /* b52 - XX */ //item.b52 = !!(bits & (1 << 3))
      /* b53 - XX */ //item.b53 = !!(bits & (1 << 2))
      /* b54 - XX */ //item.b54 = !!(bits & (1 << 1))
      /* b55 - XX */ //item.b55 = !!(bits & 1)

      bits = lineBuffer.readUInt8(43);
      /* b56 - XX */ //item.b56 = !!(bits & (1 << 7))
      /* b57 - XX */ //item.b57 = !!(bits & (1 << 6))
      /* b58 - XX */ //item.b58 = !!(bits & (1 << 5))
      /* b59 - XX */ //item.b59 = !!(bits & (1 << 4))
      /* b60 - XX */ //item.b60 = !!(bits & (1 << 3))
      /* b61 - XX */ //item.b61 = !!(bits & (1 << 2))
      /* b62 - XX */ //item.b62 = !!(bits & (1 << 1))
      /* b63 - XX */ //item.b63 = !!(bits & 1)

      // 44 charclass
      item.charclass = lineBuffer.readUint8(44);

      // 45-47 Padding ?
      //item.padding45 = readString(lineBuffer, 45, 3)

      // 48 anim (plrmode)
      item.anim = lineBuffer.readUint8(48);

      // 49 monanim (plrmode)
      item.monanim = lineBuffer.readUint8(49);

      // 50 seqtrans (plrmode)
      item.seqtrans = lineBuffer.readUint8(50);

      // 51 seqnum
      item.seqnum = lineBuffer.readUint8(51);

      // 52 range (0=none, 1=h2h, 2=rng, 3=both)
      item.range = lineBuffer.readUint8(52);

      // 53 SelectProc
      item.SelectProc = lineBuffer.readUint8(53);

      // 54-55 seqinput
      item.seqinput = lineBuffer.readUint16LE(54);

      // 56-61 itypea1..2 (0, 33=spea, 45=weap, 46=melee, 47=miss, 48=thro, 67=h2h) (Uint16 each)
      {
        let offset = 56;
        for (let i = 1; i <= 3; i++) {
          item[`itypea${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 62-67 itypeb1..2 (0, 38=tpot, ) (Uint16 each)
      {
        let offset = 62;
        for (let i = 1; i <= 3; i++) {
          item[`itypeb${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 68-71 etypea1..2 (Uint16 each)
      {
        let offset = 68;
        for (let i = 1; i <= 2; i++) {
          item[`etypea${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 72-75 etypeb1..2 (Uint16 each)
      {
        let offset = 72;
        for (let i = 1; i <= 2; i++) {
          item[`etypeb${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 76-77 srvstfunc
      item.srvstfunc = lineBuffer.readUint16LE(76);

      // 78-79 srvdofunc
      item.srvdofunc = lineBuffer.readUint16LE(78);

      // 80-85 srvprgfunc1..3 (Uint16 each)
      {
        let offset = 80;
        for (let i = 1; i <= 3; i++) {
          item[`srvprgfunc${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      // 86-87 Padding ?
      item.padding86 = lineBuffer.readUint16LE(86);

      // 88-99 prgcalc1..3 (Uint32 each)
      {
        let offset = 88;
        for (let i = 1; i <= 3; i++) {
          item[`prgcalc${i}`] = lineBuffer.readUint32LE(offset);
          offset += 4;
        }
      }

      // 100-101 prgdam
      item.prgdam = lineBuffer.readUint16LE(100);

      // 102-103 srvmissile
      item.srvmissile = lineBuffer.readUint16LE(102);

      // 104-105 srvmissilea
      item.srvmissilea = lineBuffer.readUint16LE(104);

      // 106-107 srvmissileb
      item.srvmissileb = lineBuffer.readUint16LE(106);

      // 108-109 srvmissilec
      item.srvmissilec = lineBuffer.readUint16LE(108);

      // 110-111 srvoverlay
      item.srvoverlay = lineBuffer.readUint16LE(110);

      //     unsigned int vaurafilter;
      // 112-115 aurafilter
      item.aurafilter = lineBuffer.readUint32LE(112);

      // 116-127 aurastat1..6
      {
        let offset = 116;
        for (let i = 1; i <= 6; i++) {
          item[`aurastat${i}`] = lineBuffer.readUint32LE(offset); // ItemStatCost
          offset += 2;
        }
      }

      //     unsigned int vauralencalc;      //skillscode
      // 128-131 auralencalc
      item.auralencalc = lineBuffer.readUint32LE(128); // skillscode

      //     unsigned int vaurarangecalc;
      // 132-135 aurarangecalc
      item.aurarangecalc = lineBuffer.readUint32LE(132);

      // 136-159 aurastatcalc1..6 (Uint32 each)
      {
        let offset = 136;
        for (let i = 1; i <= 6; i++) {
          item[`aurastatcalc${i}`] = lineBuffer.readUint32LE(offset); // skillscode
          offset += 4;
        }
      }

      //     unsigned short vaurastate;  //state
      // 160-161 aurastate
      item.aurastate = lineBuffer.readUint16LE(160); // state

      //     unsigned short vauratargetstate;
      // 162-163 auratargetstate
      item.auratargetstate = lineBuffer.readUint16LE(162); // state

      // 164-169 auraevent1..3 (Uint16 each)
      {
        let offset = 164;
        for (let i = 1; i <= 3; i++) {
          item[`auraevent${i}`] = lineBuffer.readUint16LE(offset); // event
          offset += 2;
        }
      }

      // 170-175 auraeventfunc1..3 (Uint16 each)
      {
        let offset = 170;
        for (let i = 1; i <= 3; i++) {
          item[`auraeventfunc${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      //     unsigned short vauratgtevent;
      // 176-177 auratgtevent
      item.auratgtevent = lineBuffer.readUint16LE(176); // event

      //     unsigned short vauratgteventfunc;
      // 178-179 auratgteventfunc
      item.auratgteventfunc = lineBuffer.readUint16LE(178);

      //     unsigned short vpassivestate;
      // 180-181 passivestate
      item.passivestate = lineBuffer.readUint16LE(180); // State

      //     unsigned short vpassiveitype;
      // 182-183 passiveitype
      item.passiveitype = lineBuffer.readUint16LE(182); // itemtypes

      // 184-193 passivestat1..5 (Uint16 each)
      {
        let offset = 184;
        for (let i = 1; i <= 5; i++) {
          item[`passivestat${i}`] = lineBuffer.readUint16LE(offset); // ItemStatCost
          offset += 2;
        }
      }

      // 194-195 Padding 40

      // 196-215 passivecalc1-5 (Uint32 each)
      {
        let offset = 196;
        for (let i = 1; i <= 5; i++) {
          item[`passivecalc${i}`] = lineBuffer.readUint32LE(offset); // skilldcode
          offset += 4;
        }
      }

      //     unsigned short vpassiveevent;
      // 216-217 passiveevent
      item.passiveevent = lineBuffer.readUint16LE(216); // event

      //     unsigned short vpassiveeventfunc;
      // 218-219 passiveeventfunc
      item.passiveeventfunc = lineBuffer.readUint16LE(218);

      //     unsigned short vsummon;
      // 220-221 summon
      item.summon = lineBuffer.readUint16LE(220); // MonStats

      //     unsigned char vpettype;
      // 222 pettype
      item.pettype = lineBuffer.readUint8(222); // PetType

      //     unsigned char vsummode; 
      // 223 summode
      item.summode = lineBuffer.readUint8(223); // MonMode

      //     unsigned int vpetmax;   
      // 224-227 petmax
      item.petmax = lineBuffer.readUint32LE(224); // skillscode

      // 228-237 sumskill1..5 (Uint16 each)
      {
        let offset = 228;
        for (let i = 1; i <= 5; i++) {
          item[`sumskill${i}`] = lineBuffer.readUint32LE(offset); // skills
          offset += 2;
        }
      }

      //     unsigned short iPadding51;
      // 238-239 Padding (Uint16 each)

      // 240-259 sumsk1calc-5
      {
        let offset = 240;
        for (let i = 1; i <= 5; i++) {
          item[`sumsk${i}calc`] = lineBuffer.readUint32LE(offset); //skillscode
          offset += 4;
        }
      }

      //     unsigned short vsumumod;
      // 260-261 sumumod
      item.sumumod = lineBuffer.readUint16LE(260);
      
      //     unsigned short vsumoverlay;
      // 262-263 sumoverlay
      item.sumoverlay = lineBuffer.readUint16LE(262); // overlay

      //     unsigned short vcltmissile; 
      // 264-265 cltmissile
      item.cltmissile = lineBuffer.readUint16LE(264); // missiles

      //     unsigned short vcltmissilea;
      // 266-267 cltmissilea
      item.cltmissilea = lineBuffer.readUint16LE(266); // missiles

      //     unsigned short vcltmissileb;
      // 268-269 cltmissileb
      item.cltmissileb = lineBuffer.readUint16LE(268); // missiles

      //     unsigned short vcltmissilec;
      // 270-271 cltmissilec
      item.cltmissilec = lineBuffer.readUint16LE(270); // missiles

      //     unsigned short vcltmissiled;
      // 272-273 cltmissiled
      item.cltmissiled = lineBuffer.readUint16LE(272); // missiles

      //     unsigned short vcltstfunc;
      // 274-275 cltstfunc
      item.cltstfunc = lineBuffer.readUint16LE(274);

      //     unsigned short vcltdofunc;
      // 276-277 cltdofunc
      item.cltdofunc = lineBuffer.readUint16LE(276);

      // 278-283 cltprgfunc1-3
      {
        let offset = 278;
        for (let i = 1; i <= 3; i++) {
          item[`cltprgfunc${i}`] = lineBuffer.readUint16LE(offset);
          offset += 2;
        }
      }

      //     unsigned short vstsound;
      // 284-285 stsound
      item.stsound = lineBuffer.readUint16LE(284); // sounds

      //     unsigned short vstsoundclass;
      // 286-287 stsoundclass
      item.stsoundclass = lineBuffer.readUint16LE(286); // sounds

      //     unsigned short vdosound;
      // 288-289 dosound
      item.dosound = lineBuffer.readUint16LE(288); // sounds

      //     unsigned short vdosoundmyspa;
      // 290-291 dosoundmyspa
      item.dosoundmyspa = lineBuffer.readUint16LE(290); // sounds

      //     unsigned short vdosoundmyspb;
      // 292-293 dosoundmyspb
      item.dosoundmyspb = lineBuffer.readUint16LE(292); // sounds

      //     unsigned short vcastoverlay;
      // 294-295 castoverlay
      item.castoverlay = lineBuffer.readUint16LE(294); // overlay

      //     unsigned short vtgtoverlay;
      // 296-297 tgtoverlay
      item.tgtoverlay = lineBuffer.readUint16LE(296); // overlay

      //     unsigned short vtgtsound;
      // 298-299 tgtsound
      item.tgtsound = lineBuffer.readUint16LE(298); // sounds

      //     unsigned short vprgoverlay;
      // 300-301 prgoverlay
      item.prgoverlay = lineBuffer.readUint16LE(300); // overlay

      //     unsigned short vprgsound;
      // 302-303 prgsound
      item.prgsound = lineBuffer.readUint16LE(302); // sounds

      //     unsigned short vcltoverlaya;
      // 304-305 cltoverlaya
      item.cltoverlaya = lineBuffer.readUint16LE(304); // overlay

      //     unsigned short vcltoverlayb;
      // 306-307 cltoverlayb
      item.cltoverlayb = lineBuffer.readUint16LE(306); // overlay

      // 308-319 cltcalc1..3
      {
        let offset = 308;
        for (let i = 1; i <= 3; i++) {
          item[`cltcalc${i}`] = lineBuffer.readUint32LE(offset); // skillscode
          offset += 4;
        }
      }

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

      lineStart += lineLength;
      lineIndex++;
      items.push(item);
    }
  }
  return items;
}

module.exports = {
  decodeSkillsFile,
};
