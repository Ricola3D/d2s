import * as types from "./types";
import { BitReader } from "../binary/bitreader";
import { BitWriter } from "../binary/bitwriter";
import { getConstantData } from "./constants";

//todo use constants.magical_properties and csvBits
export function readAttributes(char: types.ID2S, reader: BitReader, mod: string): void {
  const constants = getConstantData(mod, char.header.version);

  // Stats = magical_properties with "Saved" = 1.
  // There are report that only stat ids 0 to 255 can be saved. It doesn't work for stats 256-510.
  const attributeIds = constants.magical_properties.filter((val, idx) => val && val.c && idx < 256).map((val, idx) => idx);

  // Initial values
  char.attributes = attributeIds.reduce((acc, curr) => {
    const attr = constants.magical_properties[curr];
    acc[attr.s] = 0; // Add the attribute with value 0
    return acc;
  }, {} as types.IAttributes);

  const header = reader.ReadString(2); //0x0000 [attributes header = 0x67, 0x66 "gf"]
  if (header != "gf") {
    // header is not present in first save after char is created
    if (char.header.level === 1) {
      const classData = constants.classes.find((c) => c.n === char.header.class).a;

      char.attributes = {
        strength: +classData.str,
        energy: +classData.int,
        dexterity: +classData.dex,
        vitality: +classData.vit,
        statpts: 0,
        newskills: 0,
        hitpoints: +classData.vit + +classData.hpadd,
        maxhp: +classData.vit + +classData.hpadd,
        mana: +classData.int,
        maxmana: +classData.int,
        stamina: +classData.stam,
        maxstamina: +classData.stam,
        level: 1,
        experience: 0,
        gold: 0,
        goldbank: 0,
      };

      return;
    }

    throw new Error(`Attribute header 'gf' not found at position ${reader.offset - 2 * 8}`);
  }
  let bitoffset = 0;
  let id = reader.ReadUInt16(9);
  //read till 0x1ff end of attributes is found
  while (id != 0x1ff) {
    bitoffset += 9;
    const field = constants.magical_properties[id];
    if (field === undefined) {
      throw new Error(`Invalid attribute id: ${id}`);
    }
    const size = field.cB;
    if (size === undefined) {
      throw new Error(`Missing CSV save bits for id: ${id}`);
    }
    char.attributes[field.s] = reader.ReadUInt32(size);
    if (field.cVS) {
      //hitpoints - maxstamina need to be bit shifted
      char.attributes[field.s] >>>= field.cVS;
    }

    // Next attribute
    bitoffset += size;
    id = reader.ReadUInt16(9);
  }

  reader.Align();
}

export async function writeAttributes(char: types.ID2S, constants: types.IConstantData): Promise<Uint8Array> {
  const writer = new BitWriter();
  writer.WriteString("gf", 2); //0x0000 [attributes header = 0x67, 0x66 "gf"]

  // Stats = magical_properties with "Saved" = 1.
  // There are report that only stat ids 0 to 255 can be saved. It doesn't work for stats 256-510.
  const attributeIds = constants.magical_properties.filter((val, idx) => val && val.c && idx < 256).map((val, idx) => idx);

  for (const i of attributeIds) {
    const property = constants.magical_properties[i];
    if (property === undefined) {
      throw new Error(`Invalid attribute: ${property}`);
    }
    let value = char.attributes[property.s];
    if (!value) {
      continue;
    }
    const size = property.cB;
    if (size === undefined) {
      throw new Error(`Missing CSV save bits for attribute: ${property}`);
    }
    if (property.cVS) {
      value <<= property.cVS;
    }
    writer.WriteUInt16(i, 9);
    writer.WriteUInt32(value, size);
  }
  writer.WriteUInt16(0x1ff, 9); // Attribute 511 is reserved for end tag
  writer.Align();
  return writer.ToArray();
}
