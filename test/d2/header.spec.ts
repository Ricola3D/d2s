import { expect } from 'chai';
import { readSkills, writeSkills } from '../../src/d2/skills';
import { readHeader, writeHeader, fixHeader, writeHeaderData, readHeaderData } from '../../src/d2/header';
import { writeAttributes, readAttributes } from '../../src/d2/attributes';
import * as types from '../../src/d2/types';
import { BitReader } from '../../src/binary/bitreader';
import { BitWriter } from '../../src/binary/bitwriter';
import * as fs from 'fs';
import * as path from 'path';
import { vanilla_constants_96 } from '../../public/d2/vanilla_constants_96.bundle.js';
describe('header', () => {
  xit('should make all char classes w/ custom charm', async () => {
    for (const c of vanilla_constants_96.classes) {
      const writer = new BitWriter();
      const inputBuffer = fs.readFileSync(path.join(__dirname, `../../examples/chars/97/${c.n}.d2s`));
      const reader = new BitReader(inputBuffer);
      const d2s = {} as types.ID2S;
      await readHeader(d2s, reader);
      writer.WriteArray(await writeHeader(d2s));

      // make lvl 99 w/ quests/wp/diff
      await readHeaderData(d2s, reader, 'vanilla');
      d2s.header.progression = 15;
      d2s.header.level = 99;
      d2s.header.status.ladder = true;

      for (const i of ['quests_normal', 'quests_nm', 'quests_hell']) {
        for (const j of ['act_i', 'act_ii', 'act_iii', 'act_iv', 'act_v']) {
          ((d2s.header[i as keyof types.IHeader] as types.IQuests)[j as keyof types.IQuests] as types.IActQuests).introduced = true;
          ((d2s.header[i as keyof types.IHeader] as types.IQuests)[j as keyof types.IQuests] as types.IActQuests).completed = true;
        }
        (d2s.header[i as keyof types.IHeader] as types.IQuests).act_iii.the_guardian.b0_is_completed = true;
        (d2s.header[i as keyof types.IHeader] as types.IQuests).act_iv.terrors_end.b0_is_completed = true;
      }

      for (const i of ['normal', 'nm', 'hell']) {
        d2s.header.waypoints[i as keyof types.IWaypointData].act_i.rogue_encampement = true;
        d2s.header.waypoints[i as keyof types.IWaypointData].act_iii.kurast_docks = true;
        d2s.header.waypoints[i as keyof types.IWaypointData].act_iv.the_pandemonium_fortress = true;
        d2s.header.waypoints[i as keyof types.IWaypointData].act_v.harrogath = true;
      }
      for (const d of ['normal', 'nm', 'hell']) {
        const typed_d = d as keyof types.IWaypointData;
        for (const a in d2s.header.waypoints[typed_d]) {
          if (!['unk_align', 'unk_last'].includes(a)) {
            const typed_a = a as keyof types.IWaypoints;
            for (const z in d2s.header.waypoints[typed_d][typed_a]) {
              switch (a) {
                case 'act_i':
                  const act_i_z = z as keyof types.IActIWaypoints;
                  (d2s.header.waypoints[typed_d][typed_a] as types.IActIWaypoints)[act_i_z] = true;
                case 'act_ii':
                  const act_ii_z = z as keyof types.IActIIWaypoints;
                  (d2s.header.waypoints[typed_d][typed_a] as types.IActIIWaypoints)[act_ii_z] = true;
                  break;
                case 'act_iii':
                  const act_iii_z = z as keyof types.IActIIIWaypoints;
                  (d2s.header.waypoints[typed_d][typed_a] as types.IActIIIWaypoints)[act_iii_z] = true;
                  break;
                case 'act_iv':
                  const act_iv_z = z as keyof types.IActIVWaypoints;
                  (d2s.header.waypoints[typed_d][typed_a] as types.IActIVWaypoints)[act_iv_z] = true;
                  break;
                case 'act_v':
                  const act_v_z = z as keyof types.IActVWaypoints;
                  (d2s.header.waypoints[typed_d][typed_a] as types.IActVWaypoints)[act_v_z] = true;
                  break;
              }
            }
          }
        }
      }

      writer.WriteArray(await writeHeaderData(d2s, vanilla_constants_96));

      await readAttributes(d2s, reader, 'vanilla');
      d2s.attributes.experience = 3520485254;
      d2s.attributes.level = 99;
      d2s.attributes.statpts = 0x3ff;
      d2s.attributes.newskills = 0xff;
      d2s.attributes.gold = 990000;
      d2s.attributes.goldbank = 2500000;
      writer.WriteArray(await writeAttributes(d2s, vanilla_constants_96));

      await readSkills(d2s, reader, 'vanilla');
      for (const s of d2s.skills) {
        s.points = 20;
      }
      writer.WriteArray(await writeSkills(d2s));
      //console.log(writer.offset);

      writer.SeekByte(853);
      const itemsHeaderAndCount = new Uint8Array([74, 77, 1, 0]);
      // prettier-ignore
      const charm = new Uint8Array([16,0,128,0,5,228,68,216,79,120,250,137,117,89,210,96,199,72,92,218,243,193,252,199,252,211,252,1,252,5,248,11,248,15,248,159,248,71,65,83,252,171,160,43,254,89,208,22,255,46,168,136,127,196,79,226,191,196,191,163,255,163,63,164,127,164,191,164,255,164,63,165,127,165,127,210,88,74,99,45,141,197,52,86,211,63,167,127,79,255,160,254,97,251,179,253,127,158,101,161,140,195,251,195,216,248,254,3,
      ]);
      const endBytes = new Uint8Array([74, 77, 0, 0, 106, 102, 107, 102, 0]);
      writer.WriteArray(itemsHeaderAndCount);
      writer.WriteArray(charm);
      writer.WriteArray(endBytes);

      // const end = writer.offset;
      await fixHeader(writer);

      for (const f of [
        `${process.env['USERPROFILE']}/Saved Games/Diablo II Resurrected Tech Alpha/${d2s.header.name}.d2s`,
        `${process.env['USERPROFILE']}/Saved Games/Diablo II Resurrected Tech Alpha/${d2s.header.name}.ctl`,
        `${process.env['USERPROFILE']}/Saved Games/Diablo II Resurrected Tech Alpha/${d2s.header.name}.ma0`,
        `${process.env['USERPROFILE']}/Saved Games/Diablo II Resurrected Tech Alpha/${d2s.header.name}.ma1`,
        `${process.env['USERPROFILE']}/Saved Games/Diablo II Resurrected Tech Alpha/${d2s.header.name}.map`,
        `${process.env['USERPROFILE']}/Saved Games/Diablo II Resurrected Tech Alpha/${d2s.header.name}.key`,
      ]) {
        if (fs.existsSync(f)) fs.unlinkSync(f);
      }
      fs.writeFileSync(
        `${process.env['USERPROFILE']}/Saved Games/Diablo II Resurrected Tech Alpha/${d2s.header.name}.d2s`,
        writer.ToArray(),
      );
    }
  });

  it('should calulcate checksum', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, '../../examples/chars/96/simple.d2s'));
    const writer = new BitWriter().WriteArray(inputBuffer);
    const pre = writer.SeekByte(0x000c).PeekBytes(4);
    await fixHeader(writer);
    const post = writer.SeekByte(0x000c).PeekBytes(4);
    expect(new DataView(pre.buffer).getUint32(0)).to.eq(new DataView(post.buffer).getUint32(0));
  });

  it('should read', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, '../../examples/chars/96/simple.d2s'));
    const reader = new BitReader(inputBuffer);
    const d2s = {} as types.ID2S;
    await readHeader(d2s, reader);
    await readHeaderData(d2s, reader, 'vanilla');
    expect(d2s.header.version).to.eq(96);
  });

  it('should write', async () => {
    const json = fs.readFileSync(path.join(__dirname, '../../examples/chars/96/simple.json'), 'utf-8');
    const d2s = JSON.parse(json);
    const outputBuffer = new BitWriter();
    outputBuffer.WriteArray(await writeHeader(d2s));
    outputBuffer.WriteArray(await writeHeaderData(d2s, vanilla_constants_96));
    expect(outputBuffer.length / 8).to.eq(765);
  });
});
