import * as types from "./types";
import { BitReader } from "../binary/bitreader";
import { BitWriter } from "../binary/bitwriter";
import { getConstantData } from "./constants";

//todo use constants.magical_properties and csvBits
export function readAttributes(char: types.ID2S, reader: BitReader, mod: string): void {
  const constants = getConstantData(mod, char.header.version);
  char.attributes = {
    // For optional values, set default
    unused_stats: 0,
    unused_skill_points: 0,
    experience: 0,
    gold: 0,
    stashed_gold: 0,
    killtrack: 0,
    deathtrack: 0,
    unused210: 0,
    unused211: 0,
  } as types.IAttributes;
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
        unused_stats: 0,
        unused_skill_points: 0,
        current_hp: +classData.vit + +classData.hpadd,
        max_hp: +classData.vit + +classData.hpadd,
        current_mana: +classData.int,
        max_mana: +classData.int,
        current_stamina: +classData.stam,
        max_stamina: +classData.stam,
        level: 1,
        experience: 0,
        gold: 0,
        stashed_gold: 0,
        killtrack: 0,
        deathtrack: 0,
        unused210: 0,
        unused211: 0,
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
    char.attributes[Attributes[field.s]] = reader.ReadUInt32(size);
    //current_hp - max_stamina need to be bit shifted
    if (id >= 6 && id <= 11) {
      char.attributes[Attributes[field.s]] >>>= 8;
    }
    bitoffset += size;
    id = reader.ReadUInt16(9);
  }

  reader.Align();
}

export async function writeAttributes(char: types.ID2S, constants: types.IConstantData): Promise<Uint8Array> {
  const writer = new BitWriter();
  writer.WriteString("gf", 2); //0x0000 [attributes header = 0x67, 0x66 "gf"]
  const attributeIds = Array.from(Array(16).keys()).concat([210, 211]);
  for (const i of attributeIds) {
    const property = constants.magical_properties[i];
    if (property === undefined) {
      throw new Error(`Invalid attribute: ${property}`);
    }
    let value = char.attributes[Attributes[property.s]];
    if (!value) {
      continue;
    }
    const size = property.cB;
    if (i >= 6 && i <= 11) {
      value <<= 8;
    }
    writer.WriteUInt16(i, 9);
    writer.WriteUInt32(value, size);
  }
  writer.WriteUInt16(0x1ff, 9);
  writer.Align();
  return writer.ToArray();
}

//nokkas names
const Attributes = {
  strength: "strength",
  energy: "energy",
  dexterity: "dexterity",
  vitality: "vitality",
  statpts: "unused_stats",
  newskills: "unused_skill_points",
  hitpoints: "current_hp",
  maxhp: "max_hp",
  mana: "current_mana",
  maxmana: "max_mana",
  stamina: "current_stamina",
  maxstamina: "max_stamina",
  level: "level",
  experience: "experience",
  gold: "gold",
  goldbank: "stashed_gold",
  killtrack: "killtrack",
  deathtrack: "deathtrack",
  unused210: "unused210",
  unused211: "unused211",
};
