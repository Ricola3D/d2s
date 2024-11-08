import { isEqual, cloneDeep } from "lodash";

import { getConstantData } from "./constants";
import * as types from "./types";
import { nameRegex } from "./utils";
import { Quality } from "./types";

enum ItemType {
  Armor = 0x01,
  Shield = 0x02, //treated the same as armor... only here to be able to parse nokkas jsons
  Weapon = 0x03,
  Other = 0x04,
}

//do nice stuff
//combine group properties (all resists/all stats) and build friendly strings for a ui
//enhanced def/durability/weapon damage.
//lookup socketed compact items (runes/gems) properties for the slot they are in
//compute attributes like str/resists/etc..
export function enhanceAttributes(char: types.ID2S, mod: string, version: number, config?: types.IConfig): void {
  enhanceItems(char.items, mod, version, char.attributes, config);
  enhanceItems([char.golem_item], mod, version, char.attributes, config);
  enhanceItems(char.merc_items, mod, version, char.attributes, config);
  enhanceItems(char.corpse_items, mod, version, char.attributes, config);
  //enhancePlayerAttributes(char, mod, version, config);
}

export function enhancePlayerAttributes(char: types.ID2S, mod: string, version: number, config?: types.IConfig): void {
  const constants = getConstantData(mod, version);
  const items = char.items.filter((item) => {
    return item.location_id === 1 && item.equipped_id !== 13 && item.equipped_id !== 14;
  });

  char.item_bonuses = ([] as types.IMagicProperty[]).concat
    .apply(
      [],
      items.map((item) => _allAttributes(item /*, constants*/)),
    )
    .filter((attribute) => attribute != null);
  char.item_bonuses = _groupAttributes(char.item_bonuses, constants);
  char.displayed_item_bonuses = _enhanceAttributeDescription(char.item_bonuses, constants, char.attributes, config);
}

export function enhanceItems(
  items: types.IItem[],
  mod: string,
  version: number,
  attributes: types.IAttributes = {
    level: 1,
    strength: 0,
    dexterity: 0,
    vitality: 0,
    energy: 0,
  },
  config?: types.IConfig,
  parent?: types.IItem,
): void {
  if (!items) {
    return;
  }
  for (const item of items) {
    if (!item) {
      continue;
    }
    if (item.socketed_items && item.socketed_items.length) {
      enhanceItems(item.socketed_items, mod, version, attributes, config, item);
    }
    enhanceItem(item, mod, version, attributes, config, parent);
  }
}

// Bound values (inclusive min and max)
function boundValue(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function enhanceItem(
  item: types.IItem,
  mod: string,
  version: number,
  attributes: types.IAttributes = {
    level: 1,
    strength: 0,
    dexterity: 0,
    vitality: 0,
    energy: 0,
  },
  config?: types.IConfig,
  parent?: types.IItem,
): void {
  const constants = getConstantData(mod, version);
  if (parent) {
    //socket item.
    const pt = constants.armor_items[parent.type] || constants.weapon_items[parent.type] || constants.other_items[parent.type];
    const t = constants.other_items[item.type];
    if (t.m) {
      item.magic_attributes = _compactAttributes(t.m[pt.gt], constants);
    }
  }
  // Enforce level is between 1 and 99
  item.level = boundValue(item.level, 1, 99);

  // Ensure coherence of other attributes with quality
  item.given_runeword = item.quality <= Quality.Superior && item.runeword_id ? 1 : 0;
  if (item.given_runeword) {
    item.runeword_name = constants.runewords[item.runeword_id] ? constants.runewords[item.runeword_id].n : "";
  } else {
    item.given_runeword = 0;
    item.runeword_id = 0;
    item.runeword_name = "";
    item.runeword_attributes = [];
  }
  if (item.quality !== Quality.Magic) {
    item.magic_prefix = 0;
    item.magic_suffix = 0;
  }
  if (item.quality === Quality.Rare || item.quality === Quality.Crafted) {
    item.rare_name = constants.rare_names[item.rare_name_id] ? constants.rare_names[item.rare_name_id].n : "";
    item.rare_name2 = constants.rare_names[item.rare_name_id2] ? constants.rare_names[item.rare_name_id2].n : "";
  } else {
    item.rare_name_id = 0;
    item.rare_name = "";
    item.rare_name_id2 = 0;
    item.rare_name2 = "";
    item.magical_name_ids = [0, 0, 0, 0, 0, 0];
  }
  if (item.quality === Quality.Set) {
    item.set_name = constants.set_items[item.set_id] ? constants.set_items[item.set_id].n : "";
  } else {
    item.set_id = 0;
    item.set_name = "";
    item.set_attributes = [];
  }
  if (item.quality === Quality.Unique) {
    item.unique_name = constants.unq_items[item.unique_id] ? constants.unq_items[item.unique_id].n : "";
  } else {
    item.unique_id = 0;
    item.unique_name = "";
  }
  if (item.quality !== Quality.Magic && item.quality !== Quality.Unique) {
    item.personalized = 0;
    item.personalized_name = "";
  }

  let details = null;

  // Set type_id
  // Also for armors: set defense_rating to the max
  // Also for weapons: set base_damage
  if (constants.armor_items[item.type]) {
    details = constants.armor_items[item.type];
    item.type_id = ItemType.Armor;
    if (details.maxac) {
      if (item.ethereal == 0) {
        item.defense_rating = details.maxac;
      } else if (item.ethereal == 1) {
        item.defense_rating = Math.floor(details.maxac * 1.5);
      }
    }
  } else if (constants.weapon_items[item.type]) {
    details = constants.weapon_items[item.type];
    item.type_id = ItemType.Weapon;
    const base_damage = {} as types.IWeaponDamage;
    if (item.ethereal == 0) {
      if (details.mind) base_damage.mindam = details.mind;
      if (details.maxd) base_damage.maxdam = details.maxd;
      if (details.min2d) base_damage.twohandmindam = details.min2d;
      if (details.max2d) base_damage.twohandmaxdam = details.max2d;
    } else if (item.ethereal == 1) {
      if (details.mind) base_damage.mindam = Math.floor(details.mind * 1.5);
      if (details.maxd) base_damage.maxdam = Math.floor(details.maxd * 1.5);
      if (details.min2d) base_damage.twohandmindam = Math.floor(details.min2d * 1.5);
      if (details.max2d) base_damage.twohandmaxdam = Math.floor(details.max2d * 1.5);
    }
    item.base_damage = base_damage;
  } else if (constants.other_items[item.type]) {
    item.type_id = ItemType.Other;
    details = constants.other_items[item.type];
  }

  if (details) {
    if (details.n) item.type_name = details.n;
    if (details.rs) item.reqstr = details.rs;
    if (details.rd) item.reqdex = details.rd;
    if (details.i) item.inv_file = details.i;
    if (details.hdi) item.hd_inv_file = details.hdi;
    if (details.ih) item.inv_height = details.ih;
    if (details.iw) item.inv_width = details.iw;
    if (details.it) item.inv_transform = details.it;
    if (details.iq) item.item_quality = details.iq;
    if (details.c) item.categories = details.c;
    if (details.durability) {
      if (item.ethereal == 0) {
        item.current_durability = details.durability;
        item.max_durability = details.durability;
      } else if (item.ethereal == 1) {
        item.current_durability = details.durability - Math.ceil(details.durability / 2) + 1;
        item.max_durability = details.durability - Math.ceil(details.durability / 2) + 1;
      }
    }
    // Enforce total_nr_of_sockets between 0 and max for this item type
    item.total_nr_of_sockets = boundValue(item.total_nr_of_sockets, 0, details.gs || item.inv_width * item.inv_height);

    // Enforce coherence between total_nr_of_sockets & socketed
    if (item.total_nr_of_sockets > 0) {
      item.socketed = 1;
    } else {
      item.socketed = 0;
    }

    // Enforce nr_of_items_in_sockets & socketed_items inferior or equal to total_nr_of_sockets
    item.nr_of_items_in_sockets = boundValue(item.nr_of_items_in_sockets, 0, item.total_nr_of_sockets);
    item.socketed_items = (item.socketed_items || []).slice(0, item.nr_of_items_in_sockets);

    // Enforce personalization validity, and coherence between personalized_name & personalized
    if (item.personalized_name && item.personalized_name.length) {
      // Check it is valid
      const valid = nameRegex.test(item.personalized_name);
      if (!valid) {
        item.personalized_name = "";
        item.personalized = 0;
      } else {
        item.personalized = 1;
      }
    } else {
      item.personalized = 0;
    }

    // Multiple_pictures: ensure coherence with base item type
    if (details.ig && details.ig.length && !item.multiple_pictures) {
      // Activate multiple pictures
      item.multiple_pictures = 1;
      item.picture_id = 0;
    } else if (!details.ig && item.multiple_pictures) {
      item.multiple_pictures = 0; // Type changed to a not-multiple pictures one
      item.picture_id = 0;
    }

    // Set inv_file, hd_inv_file & transform_color
    if (item.multiple_pictures && details.ig && details.ig.length && details.ig[item.picture_id]) {
      item.inv_file = details.ig[item.picture_id];
    }
    if (item.multiple_pictures && details.hdig && details.hdig.length && details.hdig[item.picture_id]) {
      item.hd_inv_file = details.hdig[item.picture_id];
    }
    if (item.magic_prefix || item.magic_suffix) {
      if (item.magic_prefix && constants.magic_prefixes[item.magic_prefix]?.tc) {
        item.transform_color = constants.magic_prefixes[item.magic_prefix].tc;
      }
      if (item.magic_suffix && constants.magic_suffixes[item.magic_suffix]?.tc) {
        item.transform_color = constants.magic_suffixes[item.magic_suffix].tc;
      }
    } else if (item.quality == Quality.Rare && item.magical_name_ids) {
      for (let i = 0; i < 6; i++) {
        const id = item.magical_name_ids[i];
        if (id) {
          if (i % 2 == 0 && constants.magic_prefixes[id] && constants.magic_prefixes[id]?.tc) {
            // even is prefixes
            item.transform_color = constants.magic_prefixes[id].tc;
          } else if (constants.magic_suffixes[id] && constants.magic_suffixes[id]?.tc) {
            // odd is suffixes
            item.transform_color = constants.magic_suffixes[id].tc;
          }
        }
      }
    } else if (item.unique_id) {
      const unq = constants.unq_items[item.unique_id];
      if (details.ui) {
        item.inv_file = details.ui;
      }
      if (unq && unq.i) {
        item.inv_file = unq.i;
      }
      if (unq && unq.hdi) {
        item.hd_inv_file = unq.hdi;
      }
      if (unq && unq.tc) item.transform_color = unq.tc;
    } else if (item.set_id) {
      const set = constants.set_items[item.set_id];
      if (details.ui) {
        item.inv_file = details.ui;
      }
      if (set && set.i) {
        item.inv_file = set.i;
      }
      if (set && set.hdi) {
        item.hd_inv_file = set.hdi;
      }
      if (set && set.tc) item.transform_color = set.tc;
    }
  }

  // Set read-only attributes useful for display in hero editors
  if (item.magic_attributes || item.runeword_attributes || item.socketed_items) {
    // Just the intrinsec attributes
    item.displayed_magic_attributes = _enhanceAttributeDescription(item.magic_attributes, constants, attributes, config);

    // Just the runeword attributes
    item.displayed_runeword_attributes = _enhanceAttributeDescription(item.runeword_attributes, constants, attributes, config);

    // Just the socketed attributes
    item.socketed_attributes = _groupAttributes(_socketedAttributes(item /*, constants*/), constants);
    item.displayed_socketed_attributes = _enhanceAttributeDescription(item.socketed_attributes, constants, attributes, config);

    // All attributes together
    item.combined_magic_attributes = _groupAttributes(_allAttributes(item /*, constants*/), constants);
    item.displayed_combined_magic_attributes = _enhanceAttributeDescription(item.combined_magic_attributes, constants, attributes, config);
  }
}

function _enhanceAttributeDescription(
  _magic_attributes: types.IMagicProperty[],
  constants: types.IConstantData,
  attributes: types.IAttributes = {
    level: 1,
    strength: 0,
    dexterity: 0,
    vitality: 0,
    energy: 0,
  },
  config?: types.IConfig,
): types.IMagicProperty[] {
  if (!_magic_attributes) return [];

  // const magic_attributes: types.IMagicProperty[] = [..._magic_attributes.map((attr) => ({ ...attr }))];
  const magic_attributes: types.IMagicProperty[] = cloneDeep(_magic_attributes);
  const groupsCount: number[] = [];
  const groupsSize: number[] = [];
  const groupsVal: number[] = [];
  for (const magical_attribute of magic_attributes) {
    const itemStatDef = constants.magical_properties[magical_attribute.id];
    const v = magical_attribute.values[magical_attribute.values.length - 1];
    if (itemStatDef.dg) {
      // Save the value of the 1st occurence (to compare with others)
      if (!groupsVal[itemStatDef.dg]) {
        groupsVal[itemStatDef.dg] = v;
        groupsCount[itemStatDef.dg] = 1;
        groupsSize[itemStatDef.dg] = constants.magical_properties.filter((prop) => prop && prop.dg && prop.dg == itemStatDef.dg).length; // Compute group size
      } else if (groupsVal[itemStatDef.dg] === v) {
        // Increment count only if values are identical
        groupsCount[itemStatDef.dg]++;
      }
    }
  }
  for (const magical_attribute of magic_attributes) {
    const itemStatDef = constants.magical_properties[magical_attribute.id];
    if (itemStatDef == null) {
      throw new Error(`Cannot find Magical Property for id: ${magical_attribute.id}`);
    }
    let v = magical_attribute.values[magical_attribute.values.length - 1];

    if (itemStatDef.ob && itemStatDef.ob in attributes) {
      switch (itemStatDef.o) {
        case 1: {
          v = Math.floor((attributes[itemStatDef.ob] * v) / 100);
          break;
        }
        case 2:
        case 3:
        case 4:
        case 5: {
          v = Math.floor((attributes[itemStatDef.ob] * v) / 2 ** itemStatDef.op);
          break;
        }
        default: {
          break;
        }
      }
      magical_attribute.op_stats = itemStatDef.os;
      magical_attribute.op_value = v;
    }

    let descFunc = itemStatDef.dF;
    let descString;
    if (v >= 0) {
      if (itemStatDef.dP) {
        descString = itemStatDef.dP;
      } else if (itemStatDef.dN) {
        // Fallback
        descString = itemStatDef.dN;
      }
    } else if (v < 0) {
      if (itemStatDef.dN) {
        descString = itemStatDef.dN;
      } else if (itemStatDef.dP) {
        // Fallback
        descString = itemStatDef.dP;
      }
    } else {
      descString = "Missing description";
    }
    //hack for d2r...?
    if (magical_attribute.id == 39 || magical_attribute.id == 41 || magical_attribute.id == 43 || magical_attribute.id == 45) {
      descString = itemStatDef.dP;
    }
    let descVal = itemStatDef.dV;
    let desc2 = itemStatDef.d2;
    if (itemStatDef.dg && groupsCount[itemStatDef.dg] == groupsSize[itemStatDef.dg]) {
      v = groupsVal[itemStatDef.dg];
      descString = v >= 0 ? itemStatDef.dgP : itemStatDef.dgN ? itemStatDef.dgN : itemStatDef.dgP;
      descVal = itemStatDef.dgV;
      descFunc = itemStatDef.dgF;
      desc2 = itemStatDef.dg2;
    }
    if (itemStatDef.np) {
      //damage range or enhanced damage.
      let count = 0;
      descString = itemStatDef.dR;

      if (itemStatDef.s === "coldmindam") {
        const seconds = Math.round(magical_attribute.values[2] / 25);
        magical_attribute.values[2] = seconds;
      }

      if (itemStatDef.s === "poisonmindam") {
        //poisonmindam see https://user.xmission.com/~trevin/DiabloIIv1.09_Magic_Properties.shtml for reference
        const min = Math.round((magical_attribute.values[0] * magical_attribute.values[2]) / 256);
        const max = Math.round((magical_attribute.values[1] * magical_attribute.values[2]) / 256);
        const seconds = Math.round(magical_attribute.values[2] / 25);
        magical_attribute.values = [min, max, seconds];
      }

      if (magical_attribute.values[0] === magical_attribute.values[1]) {
        count++;
        descString = itemStatDef.dE;
        //TODO. why???
        if (itemStatDef.s === "item_maxdamage_percent") {
          descString = `+%d% ${descString.replace(/}/gi, "").replace(/%\+?d%%/gi, "")}`;
        }
      }
      magical_attribute.description = descString.replace(/%d/gi, () => {
        const v = magical_attribute.values[count++];
        return v;
      });
    } else {
      _descFunc(magical_attribute, constants, v, descFunc, descVal, descString, desc2);
    }
  }

  if (config?.sortProperties) {
    //sort using sort order from game.
    magic_attributes.sort((a, b) => constants.magical_properties[b.id].so - constants.magical_properties[a.id].so);
  }

  for (let i = magic_attributes.length - 1; i >= 1; i--) {
    for (let j = i - 1; j >= 0; j--) {
      if (magic_attributes[i].description === magic_attributes[j].description) {
        magic_attributes[j].visible = false;
      }
    }
  }

  return magic_attributes;
}

function _compactAttributes(mods: types.GemModList, constants: types.IConstantData): types.IMagicProperty[] {
  const magic_attributes = [] as types.IMagicProperty[];
  for (const mod of mods) {
    const properties = constants.properties[mod.m] || [];
    for (let i = 0; i < properties.length; i++) {
      const propertyDef = properties[i];
      let stat = propertyDef.s;
      switch (propertyDef.f) {
        case 5: {
          stat = "mindamage";
          break;
        }
        case 6: {
          stat = "maxdamage";
          break;
        }
        case 7: {
          stat = "item_maxdamage_percent";
          break;
        }
        case 20: {
          stat = "item_indesctructible";
          break;
        }
        default: {
          break;
        }
      }
      const id = _itemStatCostFromStat(stat, constants);
      // const itemStatDef = constants.magical_properties[id];
      if (propertyDef.np) i += propertyDef.np;
      const v = [mod.min, mod.max];
      if (mod.p) {
        v.push(mod.p);
      }
      magic_attributes.push({
        id: id,
        values: v,
        name: propertyDef.s,
      } as types.IMagicProperty);
    }
  }
  return magic_attributes;
}

function _descFunc(
  attribute: types.IMagicProperty,
  constants: types.IConstantData,
  v: number,
  descFunc: number,
  descVal: number,
  descString: string,
  desc2: string,
) {
  if (!descFunc) {
    return;
  }
  const sign = v >= 0 ? "+" : "";
  let value = null;
  switch (descFunc) {
    case 1:
    // +[value] [string1]
    case 6:
    // +[value] [string1] [string2]
    case 12: {
      // +[value] [string1]
      value = `${sign}${v}`;
      break;
    }
    case 2:
    // [value]% [string1]
    case 7: {
      // [value]% [string1] [string2]
      value = `${v}%`;
      break;
    }
    case 3:
    // [value] [string1]
    case 9: {
      // [value] [string1] [string2]
      value = `${v}`;
      break;
    }
    case 4:
    // +[value]% [string1]
    case 8: {
      // +[value]% [string1] [string2]
      value = `${sign}${v}%`;
      break;
    }
    case 5:
    // [value*100/128]% [string1]
    case 10: {
      // [value*100/128]% [string1] [string2]
      if (descString.indexOf("%%") < 0) {
        value = `${(v * 100) / 128}%`;
      } else {
        value = (v * 100) / 128;
      }
      break;
    }
    case 11: {
      // Repairs 1 Durability In [100 / value] Seconds
      attribute.description = descString.replace(/%d/, (v / 100).toString());
      break;
    }
    case 13: {
      // +[value] to [class] Skill Levels
      const clazz = constants.classes[attribute.values[0]];
      attribute.description = `${sign}${v} ${clazz.as}`;
      break;
    }
    case 14: {
      // +[value] to [skilltab] Skill Levels ([class] Only)
      const clazz = constants.classes[attribute.values[1]];
      const skillTabStr = clazz.ts[attribute.values[0]];
      descString = _sprintf(skillTabStr, v);
      attribute.description = `${descString} ${clazz.co}`;
      break;
    }
    case 15: {
      // [chance]% to cast [slvl] [skill] on [event]
      const skillId = attribute.values[1] || -1;
      const skill = constants.skills[skillId];
      let skillStr = "";
      if (skill) {
        skillStr = skill.s;
        if (skillId > 5 && !skill.c) skillStr += " (item)";
      } else {
        skillStr = `Unknown_Skill_${skillId}`;
      }
      descString = _sprintf(descString, attribute.values[2], attribute.values[0], skillStr);
      attribute.description = `${descString}`;
      break;
    }
    case 16: {
      // Level [sLvl] [skill] Aura When Equipped
      const skillId = attribute.values[0] || -1;
      const skill = constants.skills[skillId];
      let skillStr = "";
      if (skill) {
        skillStr = skill.s;
        if (skillId > 5 && !skill.c) skillStr += " (item)";
      } else {
        skillStr = `Unknown_Skill_${skillId}`;
      }
      attribute.description = descString.replace(/%d/, v.toString());
      attribute.description = attribute.description.replace(/%s/, skillStr);
      break;
    }
    case 17: {
      // [value] [string1] (Increases near [time])
      attribute.description = `${v} ${descString} (Increases near [time])`;
      break;
    }
    case 18: {
      // [value]% [string1] (Increases near [time])
      attribute.description = `${v}% ${descString} (Increases near [time])`;
      break;
    }
    case 19: {
      // [value * -1]% [string1]
      attribute.description = _sprintf(descString, v.toString());
      break;
    }
    case 20: {
      // [value * -1]% [string1]
      value = `${v * -1}%`;
      break;
    }
    case 21: {
      // [value * -1] [string1]
      value = `${v * -1}`;
      break;
    }
    case 22: {
      // [value]% [string1] [montype] (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
      attribute.description = `${v}% ${descString} [montype]`;
      break;
    }
    case 23: {
      // [value]% [string1] [monster]
      attribute.description = `${v}% ${descString} [monster]]`;
      break;
    }
    case 24: {
      // Level [lvl] [skill] ([curr]/[max] charges)
      const skillLevel = attribute.values[0] || 0;
      const skillId = attribute.values[1] || -1;
      const curCharges = attribute.values[2] || 0;
      const maxCharges = attribute.values[3] || 0;
      const skill = constants.skills[skillId];
      let skillStr = "";
      if (skill) {
        skillStr = skill.s;
        if (skillId > 5 && !skill.c) skillStr += " (item)";
      } else {
        skillStr = `Unknown_Skill_${skillId}`;
      }
      attribute.description = _sprintf(descString, skillLevel, skillStr, curCharges, maxCharges);
      break;
    }
    case 27: {
      // +[value] to [skill] ([class] Only)
      const skillId = attribute.values[0] || -1;
      const skill = constants.skills[skillId];
      let skillStr = "";
      let clazzStr = "";
      if (skill) {
        skillStr = skill.s;
        if (skillId > 5 && !skill.c) skillStr += " (item)";
        const clazz = _classFromCode(skill.c, constants);
        clazzStr = clazz ? clazz.co : "(Unknown_Class)";
      } else {
        skillStr = `Unknown_Skill_${skillId}`;
      }
      if (descString) {
        attribute.description = _sprintf(descString, v, skillStr, clazzStr);
      } else {
        attribute.description = `${sign}${v} to ${skillStr} ${clazzStr}`;
      }
      break;
    }
    case 28: {
      // +[value] to [skill]
      const skillId = attribute.values[0] || -1;
      const skill = constants.skills[skillId];
      let skillStr = "";
      if (skill) {
        skillStr = skill.s;
        if (skillId > 5 && !skill.c) skillStr += " (item)";
      } else {
        skillStr = `Unknown_Skill_${skillId}`;
      }
      attribute.description = `${sign}${v} to ${skillStr}`;
      break;
    }
    case 29: {
      // Diablo regex
      attribute.description = _sprintf(descString, v.toString());
      break;
    }
    default: {
      throw new Error(`No handler for descFunc: ${descFunc}`);
    }
  }
  if (value) {
    descVal = descVal ? descVal : 0;
    switch (descVal) {
      case 0: {
        attribute.description = _sprintf(descString, value);
        break;
      }
      case 1: {
        attribute.description = `${value} ${descString}`;
        break;
      }
      case 2: {
        attribute.description = `${descString} ${value}`;
        break;
      }
      default: {
        throw new Error(`No handler for descVal: ${descVal}`);
      }
    }
  }
  if (desc2) {
    attribute.description += ` ${desc2}`;
  }
}

function _sprintf(str: string, ...args: any[]): string {
  let i = 0;
  return str
    .replace(/%\+?d|%\+?s/gi, (m) => {
      let v = args[i++].toString();
      if (m.indexOf("+") >= 0) {
        v = "+" + v;
      }
      return v;
    })
    .replace("%%", "%");
}

function _itemStatCostFromStat(stat: string, constants: types.IConstantData): number {
  return constants.magical_properties.findIndex((e) => e && e.s === stat);
}

function _classFromCode(code: string, constants: types.IConstantData): any {
  return constants.classes.filter((e) => e.c === code)[0];
}

function _socketedAttributes(item: types.IItem /*, constants: types.IConstantData*/): types.IMagicProperty[] {
  let socketed_attributes = [] as types.IMagicProperty[];
  if (item.socketed_items) {
    for (const i of item.socketed_items) {
      if (i.magic_attributes) {
        socketed_attributes = socketed_attributes.concat(cloneDeep(i.magic_attributes));
      }
    }
  }
  return socketed_attributes;
}

function _allAttributes(item: types.IItem /*, constants: types.IConstantData*/): types.IMagicProperty[] {
  const socketed_attributes = _socketedAttributes(item /*, constants*/);
  const magic_attributes = item.magic_attributes || [];
  //const set_attributes = item.set_attributes || [];
  const runeword_attributes = item.runeword_attributes || [];
  return [
    ...cloneDeep(magic_attributes),
    //...cloneDeep(JSON.stringify(set_attributes),
    ...cloneDeep(runeword_attributes),
    ...cloneDeep(socketed_attributes),
  ].filter((attribute) => attribute != null);
}

function _groupAttributes(all_magical_attributes: types.IMagicProperty[], constants: types.IConstantData): types.IMagicProperty[] {
  const combined_magical_attributes = [] as types.IMagicProperty[];
  for (const magical_attribute of all_magical_attributes) {
    const itemStatDef = constants.magical_properties[magical_attribute.id];
    const combined_magical_attribute = combined_magical_attributes.find((attr) => {
      // Id must be the same
      if (attr.id !== magical_attribute.id) return false;

      if (itemStatDef.sP) {
        // Param(s) & Value(s)
        if (itemStatDef.e === 2 || itemStatDef.e === 2 || itemStatDef.dF === 14) {
          // e2 - "%d%% Chance to cast level %d [Skill] on [...]": to combine, skill id and level must be the same. Values = [level, skillId, chances%]
          // e3 - "Level %d [Skill] (%d/%d Charges)": to combine, skill id and level must be the same. Values = [level, skillId, currentCharges, maxCharges]
          // dF14 - "%+d to [Tab] Skill Levels ([Class] only)": to combine, tab & class must be the same. Values = [tabId, classId, bonusPts]
          if (attr.values[0] !== magical_attribute.values[0]) return false;
          if (attr.values[1] !== magical_attribute.values[1]) return false;
        } else if (itemStatDef.s === "state") {
          // Identical states are merged, different ones are not combined
          if (!isEqual(attr.values, magical_attribute.values)) return false;
        } else {
          /*if (propertyDef.e === 1 || [13, 16, 19, 22, 23].includes(propertyDef.dF))*/
          // There is 1 Param and 1 Value, generaly to combine Value must be the same
          // e1   - "%+d to [Skill]": to combine, skill must be the same. Values = [skillId, bonusPts]
          // dF13 - "%+d to [Amazon] Skills": to combine, tab must be the same. Values = [classId, bonusPts]
          // dF16 - "Level %d [Skill] Aura When Equipped": to combine, skill must be the same. Values = [SkillId, auraLevel]
          // dF19 - "%+d to [Elemental] Skills": to combine, element must be the same. Values = [elementId, bonusPts]
          // dF22 - "%d%% to Attack Rating versus"/"%d%% to Dage versus": to combine, monster must be the same. Values = [monsterTypeId, bonus%]
          // dF23 - "%0%% Reanimate as: %1": to combine, skill must be the same. Values = [monsterTypeId, chances%]
          // dF27 - "%+d to [Skill] ([Class] only)". Values = [skillId, bonusPts]
          // dF28 - "%+d to [Skill]". Values = [skillId, bonusPts]
          if (attr.values[0] !== magical_attribute.values[0]) return false;
        }
      }

      // Just value
      return true;
    });

    if (combined_magical_attribute) {
      if (itemStatDef.np) {
        //+ Damage props. Values = [Min, Max, (Length)]
        // Sum for Min & Max, Max for Length
        combined_magical_attribute.values[0] += magical_attribute.values[0];
        combined_magical_attribute.values[1] += magical_attribute.values[1];
        if (combined_magical_attribute.values[2] && magical_attribute.values[2]) {
          combined_magical_attribute.values[2] = Math.max(combined_magical_attribute.values[2], magical_attribute.values[2]);
        }
      } else if (itemStatDef.sP) {
        // Param(s) & Value(s)
        if (itemStatDef.e === 2 || itemStatDef.dF === 14) {
          // e2 - "%d%% Chance to cast level %d [Skill] on [...]": sum chances%. Values = [level, skillId, chances%]
          // dF14 - "%+d to [Tab] Skill Levels ([Class] only)": sum bonus pts. Values = [tabId, classId, bonusPts]
          combined_magical_attribute.values[2] += magical_attribute.values[2];
        } else if (itemStatDef.e === 3) {
          // e3 - "Level %d [Skill] (%d/%d Charges)": sum current & max charges. Values = [level, skillId, currentCharges, maxCharges]
          combined_magical_attribute.values[2] += magical_attribute.values[2];
          combined_magical_attribute.values[3] += magical_attribute.values[3];
        } else if (itemStatDef.s === "state") {
          // Identical states are combined with no change
        } else {
          /*if (propertyDef.e === 1 || [13, 16, 19, 22, 23].includes(propertyDef.dF))*/
          // There is 1 Param and 1 Value, generaly we sum Params
          // e1   - "%+d to [Skill]": to combine, skill must be the same. Values = [skillId, bonusPts]
          // dF13 - "%+d to [Amazon] Skills": to combine, tab must be the same. Values = [classId, bonusPts]
          // dF16 - "Level %d [Skill] Aura When Equipped": to combine, skill must be the same. Values = [SkillId, auraLevel]
          // dF19 - "%+d to [Elemental] Skills": to combine, element must be the same. Values = [elementId, bonusPts]
          // dF22 - "%d%% to Attack Rating versus"/"%d%% to Dage versus": to combine, monster must be the same. Values = [monsterTypeId, bonus%]
          // dF23 - "%0%% Reanimate as: %1": to combine, skill must be the same. Values = [monsterTypeId, chances%]
          // dF27 - "%+d to [Skill] ([Class] only)". Values = [skillId, bonusPts]
          // dF28 - "%+d to [Skill]". Values = [skillId, bonusPts]
          combined_magical_attribute.values[1] += magical_attribute.values[1];
        }
      } else {
        // Just 1 Value: sum it
        combined_magical_attribute.values[0] += magical_attribute.values[0];
      }
    } else {
      combined_magical_attributes.push({
        id: magical_attribute.id,
        values: magical_attribute.values,
        name: magical_attribute.name,
      } as types.IMagicProperty);
    }
  }
  return combined_magical_attributes;
}
