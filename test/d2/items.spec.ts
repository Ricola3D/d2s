import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';
import { readItems, readItem, writeItem, newItem } from '../../src/d2/items';
import * as types from '../../src/d2/types';
import { BitReader } from '../../src/binary/bitreader';
import { read } from '../../src/d2/d2s';
// import { enhanceItems } from "../../src/d2/attribute_enhancer";

describe('items', () => {
  const config = {
    extendedStash: false,
  } as types.IConfig;

  it('should read "simple" item 1.15', async () => {
    const buffer = new Uint8Array([16, 0, 160, 0, 5, 228, 4, 79, 180, 0]);
    const reader = new BitReader(buffer);
    const item = await readItem(reader, 'vanilla', 0x61, config);

    expect(item.type).to.eq('hp5');
  });

  it('should read "simple" item', async () => {
    //hp1 from game
    const buffer = new Uint8Array([74, 77, 16, 32, 34, 0, 0, 8, 0, 128, 6, 23, 3, 2]);
    const reader = new BitReader(buffer);
    const item = await readItem(reader, 'vanilla', 0x60, config);
    expect(item.type).to.eq('hp1');
    expect(item.simple_item).to.eq(true);
  });

  it('should write "simple" item', async () => {
    const item = Object.assign(newItem(), {
      identified: true,
      socketed: false,
      new: true,
      is_ear: false,
      starter_item: true,
      simple_item: true,
      ethereal: false,
      personalized: false,
      given_runeword: false,
      location_id: 2,
      equipped_id: 0,
      position_x: 0,
      position_y: 0,
      alt_position_id: 0,
      type: 'hp1',
      type_id: 4,
      nr_of_items_in_sockets: 0,
      version: '0',
    }) as types.IItem;
    const bytes = await writeItem(item, 'vanilla', 0x60, config);
    expect(bytes).to.eql(new Uint8Array([74, 77, 16, 32, 162, 0, 0, 8, 0, 128, 6, 23, 3, 2]));
  });

  it('should read item list', async () => {
    //barb starter items; 4 pots, tp, id, hand axe, shield
    // prettier-ignore
    const buffer = new Uint8Array([74,77,8,0,74,77,16,32,162,0,101,8,0,128,6,23,3,2,74,77,16,32,162,0,101,8,2,128,6,23,3,2,74,77,16,32,162,0,101,8,4,128,6,23,3,2,74,77,16,32,162,0,101,8,6,128,6,23,3,2,74,77,16,32,162,0,101,0,114,66,55,55,6,2,74,77,16,32,162,0,101,0,82,146,54,55,6,2,74,77,16,32,130,0,101,132,8,128,22,134,7,2,73,10,205,163,128,128,131,195,127,74,77,16,32,130,0,101,164,10,32,86,55,6,2,13,71,163,205,128,224,1,12,12,254,3,
    ]);
    const reader = new BitReader(buffer);
    const items = await readItems(reader, 'vanilla', 0x60, config);
    expect(items.length).to.eq(8);
  });

  it('should read item list from 99 version saves', async () => {
    const inputBuffer = fs.readFileSync(path.join(__dirname, '../../examples/chars/99/Barbarian.d2s'));
    const char = await read(inputBuffer, 'vanilla', config);
    expect(char.header.version).to.eq(99);
    expect(char.items.length).to.eq(86);
  });
});
