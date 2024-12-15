/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const _ = require("lodash")

//special stats. read the next N properties.
//seems to be hardcode in d2 and not in itemstatcost
const item_property_stat_count = {
  item_maxdamage_percent: { numprops: 2, rangestr: "strModMinDamageRange", equalstr: "strModEnhancedDamage" },
  firemindam: { numprops: 2, rangestr: "strModFireDamageRange", equalstr: "strModFireDamage" },
  lightmindam: { numprops: 2, rangestr: "strModLightningDamageRange", equalstr: "strModLightningDamage" },
  magicmindam: { numprops: 2, rangestr: "strModMagicDamageRange", equalstr: "strModMagicDamage" },
  coldmindam: { numprops: 3, rangestr: "strModColdDamageRange", equalstr: "strModColdDamage" },
  poisonmindam: { numprops: 3, rangestr: "strModPoisonDamageRange", equalstr: "strModPoisonDamage" },
};

const EItemQuality = {
  normal: 0,
  exceptional: 1,
  elite: 2,
}

// In D2R, item definitions are overrided by files from "hd\items" and "hd\global\ui\items"
function getBaseItemSection(constants, itemCode) {
  let section = null;
  if (constants.weapon_items[itemCode] != undefined) {
    section = "weapon_items";
  } else if (constants.armor_items[itemCode] != undefined) {
    section = "armor_items";
  } else if (constants.other_items[itemCode] != undefined) {
    section = "other_items";
  }
  return section
}

function D2RPostTreatment(input_dir, constants) {
  // Missing items data
  if (constants.other_items.r34 && constants.other_items.r34.n && constants.other_items.r34.n == "Di Rune") {
    constants.other_items.r34.m = [
      [
        {
          code: "r34",
          type: "weapon",
          m: "ex-attacks",
          min: 2,
          max: 2
        }
      ],
      [
        {
          code: "r34",
          type: "helm",
          m: "ex-missiles",
          min: 2,
          max: 2
        }
      ],
      [
        {
          code: "r34",
          type: "shield",
          m: "sum-ex",
          min: 2,
          max: 2
        }
      ]
    ];
  }

  if (constants.other_items.r35 && constants.other_items.r35.n && constants.other_items.r35.n == "Ab Rune") {
    constants.other_items.r35.m = [
      [
        {
          code: "r35",
          type: "weapon",
          m: "weight-capacity",
          min: 3,
          max: 3
        }
      ],
      [
        {
          code: "r35",
          type: "helm",
          m: "weight-capacity",
          min: 3,
          max: 3
        }
      ],
      [
        {
          code: "r35",
          type: "shield",
          m: "weight-capacity",
          min: 3,
          max: 3
        }
      ]
    ];
  }
  // ------------------

  // HD overrides
  let subFolders = {
    "weapon_items": "weapon",
    "armor_items": "armor",
    "other_items": "misc"
  }
  const items_override_file_path = path.join(__dirname, `${input_dir}/hd/items/items.json`);
  if (fs.existsSync(items_override_file_path)) {
    // item override file exists, apply it (particularly HD UI images)
    const itemOverrides = JSON.parse(fs.readFileSync(items_override_file_path, 'utf8'));
    {
      // Item types
      for (let itemOverride of itemOverrides) {
        // The matching item code
        const itemCode = Object.keys(itemOverride)[0];
        
        // Retrieve the item section
        let baseItemSection = getBaseItemSection(constants, itemCode);
        if (baseItemSection) {
          // Check if an override .sprite image exist
          const inventoryImage = path.normalize(`${subFolders[baseItemSection]}/${itemOverride[itemCode].asset}`).replaceAll("\\", "/")
          const inventoryImageAbsolutePath = path.join(__dirname, `${input_dir}/hd/global/ui/items/${inventoryImage}.sprite`);
          
          // Add the ".hdi" attribute in game constants
          if (fs.existsSync(inventoryImageAbsolutePath)) {
            constants[baseItemSection][itemCode].hdi = inventoryImage
          }

          // Check if multiple images
          if (! /\d$/.test(inventoryImage) ) { // Except if image already ends with a number
            if (itemCode == "gpw")
              continue; // Skip. perfect_diamond1..6 files are for jewels. I don't know why Blizzard mixed the names...

            if (itemCode == "vip")
              continue; // Skip. All files are identical, plus it's an unique.

            for (let i = 1; ; i++) {
              const invGfxPath = path.join(__dirname, `${input_dir}/hd/global/ui/items/${inventoryImage}${i}.sprite`);
              if (fs.existsSync(invGfxPath)) {
                if (i == 1) {
                  constants[baseItemSection][itemCode].hdig = []
                }
                constants[baseItemSection][itemCode].hdig.push(`${inventoryImage}${i}`)
              } else {
                break;
              }
            }
          }
        }
      }
    }

    // Uniques/sets
    for (let category of [{ name: "uniques", section: "unq_items", short: "u "}, { name: "sets", section: "set_items", short: "s" }]) {
      const uniqOrSet_override_file_path = path.join(__dirname, `${input_dir}/hd/items/${category.name}.json`);
      if (fs.existsSync(uniqOrSet_override_file_path)) {
        //file exists. It contains inventory image override for some unique items
        const uniqOrSetOverrides = JSON.parse(fs.readFileSync(uniqOrSet_override_file_path, 'utf8'));
        for (let uniqOrSetOverride of uniqOrSetOverrides) {
          // The matching item code
          const itemSnakeCaseIndex = Object.keys(uniqOrSetOverride)[0]; // Matches the index column of uniqueitems.txt, and a strings.json key, but with snake case
          if (itemSnakeCaseIndex == "rainbow_facet")
            continue; // There is no HD image for jewels, it puts diamond instead
  
          // There can be multiple matches for an index
          constants[category.section].forEach(item => {
            if (_.snakeCase(item.index) == itemSnakeCaseIndex) {
              // It's a match !
              let baseItemSection = getBaseItemSection(constants, item.c)
              if (baseItemSection) {
                // Check if an override .sprite image exist
                const inventoryImage = path.normalize(`${subFolders[baseItemSection]}/${uniqOrSetOverride[itemSnakeCaseIndex].normal}`)
                const inventoryImageAbsolutePath = path.join(__dirname, `${input_dir}/hd/global/ui/items/${inventoryImage}.sprite`);
                // Add the ".hdi" attribute in game constants
                if (fs.existsSync(inventoryImageAbsolutePath)) {
                  item.hdi = inventoryImage.replaceAll("\\", "/");
                }
              }
            }
          })
        }
      }
    }
  }
  // ------------
}

// Post treatment for ReMoDDeD
function ReMoDDeDPostTreatment(input_dir, constants) {
  // Make some hidden properties visible
  let visibilityChanges = [
    { section: "magical_properties", key:  92, from: "item_levelreq", assign: { s: "item_extra_level_req", so: 999, dF: 19, dP: "Req levels %+d (Enhances)", dN: "Req levels %d (Enhances)" } },
    { section: "magical_properties", key: 126, from: "item_elemskill", assign: { so: 157, dF: 19, dP: "%+d to Elemental Skills" } },
    { section: "magical_properties", key: 370, from: "Soul_Ama", assign: { so: 999, dF: 19, dP: "Amazon Soul Tier: %d" } },
    { section: "magical_properties", key: 371, from: "Soul_Sor", assign: { so: 999, dF: 19, dP: "Sorceress Soul Tier: %d" } },
    { section: "magical_properties", key: 372, from: "Soul_Nec", assign: { so: 999, dF: 19, dP: "Necromancer Soul Tier: %d" } },
    { section: "magical_properties", key: 373, from: "Soul_Pal", assign: { so: 999, dF: 19, dP: "Paladin Soul Tier: %d" } },
    { section: "magical_properties", key: 374, from: "Soul_Bar", assign: { so: 999, dF: 19, dP: "Barbarian Soul Tier: %d" } },
    { section: "magical_properties", key: 375, from: "Soul_Dru", assign: { so: 999, dF: 19, dP: "Druid Soul Tier: %d" } },
    { section: "magical_properties", key: 376, from: "Soul_Ass", assign: { so: 999, dF: 19, dP: "Assassin Soul Tier: %d" } },
    { section: "magical_properties", key: 412, from: "Soul_Level", assign: { so: 999, dF: 19, dP: "Soul Count: %d" } },
  ]
  for (change of visibilityChanges) {
    if (constants[change.section][change.key].s == change.from) {
      Object.assign(constants[change.section][change.key], change.assign)
    }
    else {
      console.log(`WARN: Magical Property ${change.key} changed to "${constants[change.section][change.key].s}"`)
    }
  }

  // Change some names
  let nameChanges = []
  for (let i = 0; i < 40; i++) {
    key = `K${(1+i).toString().padStart(2, "0")}`
    nameChanges.push({ section: "stackables", key: key, from: "Scroll of Torment", to: `Scroll of Torment<br>Level ${11+i} of Icy Hell` })
    nameChanges.push({ section: "other_items", key: key, from: "Scroll of Torment", to: `Scroll of Torment<br>Level ${11+i} of Icy Hell` })
  }
  for (let i = 0; i < 40; i++) {
    key = `K${(41+i).toString().padStart(2, "0")}`
    nameChanges.push({ section: "stackables", key: key, from: "Scroll of Torment", to: `Scroll of Torment<br>Level ${11+i} of Torment Trial` })
    nameChanges.push({ section: "other_items", key: key, from: "Scroll of Torment", to: `Scroll of Torment<br>Level ${11+i} of Torment Trial` })
  }
  nameChanges = nameChanges.concat([
    { section: "stackables", key: "key", from: " ±", to: "Key" },
    { section: "stackables", key: "b65", from: "Socket Remover", to: "Premium Socket Remover" },
    { section: "other_items", key: "vps", from: " ³ ", to: "Stamina Potion" },
    { section: "other_items", key: "yps", from: " ³ ", to: "Antidote Potion" },
    { section: "other_items", key: "rvs", from: " ³ ", to: "Rejuvenation Potion" },
    { section: "other_items", key: "rvl", from: " ¸ ", to: "Full Rejuvenation Potion" },
    { section: "other_items", key: "wms", from: " ³ ", to: "Thawing Potion" },
    { section: "other_items", key: "tsc", from: " ¯ ", to: "Scroll of Town Portal" },
    { section: "other_items", key: "isc", from: " ¯ ", to: "Scroll of Identify" },
    { section: "other_items", key: "key", from: " ±", to: "Key" },
    { section: "other_items", key: "gcv", from: "¶ ", to: "Chipped Amethyst" },
    { section: "other_items", key: "gfv", from: "¶ ", to: "Flawed Amethyst" },
    { section: "other_items", key: "gsv", from: "¶ ", to: "Amethyst" },
    { section: "other_items", key: "gzv", from: "¶ ", to: "Flawless Amethyst" },
    { section: "other_items", key: "gpv", from: "¶ ", to: "Perfect Amethyst" },
    { section: "other_items", key: "gcy", from: "¶ ", to: "Chipped Topaz" },
    { section: "other_items", key: "gfy", from: "¶ ", to: "Flawed Topaz" },
    { section: "other_items", key: "gsy", from: "¶ ", to: "Topaz" },
    { section: "other_items", key: "gly", from: "¶ ", to: "Flawless Topaz" },
    { section: "other_items", key: "gpy", from: "¶ ", to: "Perfect Topaz" },
    { section: "other_items", key: "gcb", from: "¶ ", to: "Chipped Sapphire" },
    { section: "other_items", key: "gfb", from: "¶ ", to: "Flawed Sapphire" },
    { section: "other_items", key: "gsb", from: "¶ ", to: "Sapphire" },
    { section: "other_items", key: "glb", from: "¶ ", to: "Flawless Sapphire" },
    { section: "other_items", key: "gpb", from: "¶ ", to: "Perfect Sapphire" },
    { section: "other_items", key: "gcg", from: "¶ ", to: "Chipped Emerald" },
    { section: "other_items", key: "gfg", from: "¶ ", to: "Flawed Emerald" },
    { section: "other_items", key: "gsg", from: "¶ ", to: "Emerald" },
    { section: "other_items", key: "glg", from: "¶ ", to: "Flawless Emerald" },
    { section: "other_items", key: "gpg", from: "¶ ", to: "Perfect Emerald" },
    { section: "other_items", key: "gcr", from: "¶ ", to: "Chipped Ruby" },
    { section: "other_items", key: "gfr", from: "¶ ", to: "Flawed Ruby" },
    { section: "other_items", key: "gsr", from: "¶ ", to: "Ruby" },
    { section: "other_items", key: "glr", from: "¶ ", to: "Flawless Ruby" },
    { section: "other_items", key: "gpr", from: "¶ ", to: "Perfect Ruby" },
    { section: "other_items", key: "gcw", from: "¶ ", to: "Chipped Diamond" },
    { section: "other_items", key: "gfw", from: "¶ ", to: "Flawed Diamond" },
    { section: "other_items", key: "gsw", from: "¶ ", to: "Diamond" },
    { section: "other_items", key: "glw", from: "¶ ", to: "Flawless Diamond" },
    { section: "other_items", key: "gpw", from: "¶ ", to: "Perfect Diamond" },
    { section: "other_items", key: "hp1", from: " ³ ", to: "Minor Healing Potion" },
    { section: "other_items", key: "hp2", from: " ³ ", to: "Light Healing Potion" },
    { section: "other_items", key: "hp3", from: " ³ ", to: "Healing Potion" },
    { section: "other_items", key: "hp4", from: " ¸ ", to: "Greater Healing Potion" },
    { section: "other_items", key: "hp5", from: " ¸ ", to: "Super Healing Potion" },
    { section: "other_items", key: "mp1", from: " ³ ", to: "Minor Mana Potion" },
    { section: "other_items", key: "mp2", from: " ³ ", to: "Light Mana Potion" },
    { section: "other_items", key: "mp3", from: " ³ ", to: "Mana Potion" },
    { section: "other_items", key: "mp4", from: " ¸ ", to: "Greater Mana Potion" },
    { section: "other_items", key: "mp5", from: " ¸ ", to: "Super Mana Potion" },
    { section: "other_items", key: "skc", from: " ¹ ", to: "Chipped Skull" },
    { section: "other_items", key: "skf", from: " ¹ ", to: "Flawed Skull" },
    { section: "other_items", key: "sku", from: " ¹ ", to: "Skull" },
    { section: "other_items", key: "skl", from: " ¹ ", to: "Flawless Skull" },
    { section: "other_items", key: "skz", from: " ¹ ", to: "Perfect Skull" },
    { section: "other_items", key: "r01", from: "⅐ El", to: "El Rune" },
    { section: "other_items", key: "r02", from: "⅑ Eld", to: "Eld Rune" },
    { section: "other_items", key: "r03", from: "⅒ Tir", to: "Tir Rune" },
    { section: "other_items", key: "r04", from: "⅓ Nef", to: "Nef Rune" },
    { section: "other_items", key: "r05", from: "⅔ Eth", to: "Eth Rune" },
    { section: "other_items", key: "r06", from: "⅕ Ith", to: "Ith Rune" },
    { section: "other_items", key: "r07", from: "⅖ Tal", to: "Tal Rune" },
    { section: "other_items", key: "r08", from: "⅗ Ral", to: "Ral Rune" },
    { section: "other_items", key: "r09", from: "⅘ Ort", to: "Ort Rune" },
    { section: "other_items", key: "r10", from: "⅙ Thul", to: "Thul Rune" },
    { section: "other_items", key: "r11", from: "⅚ Amn", to: "Amn Rune" },
    { section: "other_items", key: "r12", from: "⅛ Sol", to: "Sol Rune" },
    { section: "other_items", key: "r13", from: "⅜ Shael", to: "Shael Rune" },
    { section: "other_items", key: "r14", from: "⅝ Dol", to: "Dol Rune" },
    { section: "other_items", key: "r15", from: "⅞ Hel", to: "Hel Rune" },
    { section: "other_items", key: "r16", from: "⅟ Io", to: "Io Rune" },
    { section: "other_items", key: "r17", from: "Ⅰ Lum", to: "Lum Rune" },
    { section: "other_items", key: "r18", from: "Ⅱ Ko", to: "Ko Rune" },
    { section: "other_items", key: "r19", from: "Ⅲ Fal", to: "Fal Rune" },
    { section: "other_items", key: "r20", from: "Ⅳ Lem", to: "Lem Rune" },
    { section: "other_items", key: "r21", from: "Ⅴ Pul", to: "Pul Rune" },
    { section: "other_items", key: "r22", from: "Ⅵ Um", to: "Um Rune" },
    { section: "other_items", key: "r23", from: "Ⅶ Mal", to: "Mal Rune" },
    { section: "other_items", key: "r24", from: "Ⅷ Ist", to: "Ist Rune" },
    { section: "other_items", key: "r25", from: "Ⅸ Gul", to: "Gul Rune" },
    { section: "other_items", key: "r26", from: "Ⅹ Vex", to: "Vex Rune" },
    { section: "other_items", key: "r27", from: "Ⅺ Ohm", to: "Ohm Rune" },
    { section: "other_items", key: "r28", from: "Ⅻ Lo", to: "Lo Rune" },
    { section: "other_items", key: "r29", from: "Ⅼ Sur", to: "Sur Rune" },
    { section: "other_items", key: "r30", from: "Ⅽ Ber", to: "Ber Rune" },
    { section: "other_items", key: "r31", from: "Ⅾ Jah", to: "Jah Rune" },
    { section: "other_items", key: "r32", from: "Ⅿ Cham", to: "Cham Rune" },
    { section: "other_items", key: "r33", from: "ⅰ Zod", to: "Zod Rune" },
    { section: "other_items", key: "a10", from: "Codex of Gluttony", to: "Codex of Gluttony 1:1" },
    { section: "other_items", key: "a11", from: "Codex of Gluttony", to: "Codex of Gluttony 1:2" },
    { section: "other_items", key: "a12", from: "Codex of Gluttony", to: "Codex of Gluttony 1:3" },
    { section: "other_items", key: "a13", from: "Codex of Gluttony", to: "Codex of Gluttony 1:4" },
    { section: "other_items", key: "a14", from: "Codex of Gluttony", to: "Codex of Gluttony 1:5" },
    { section: "other_items", key: "a15", from: "Codex of Gluttony", to: "Codex of Gluttony 1:6" },
    { section: "other_items", key: "a16", from: "Codex of Gluttony", to: "Codex of Gluttony 1:7" },
    { section: "other_items", key: "a17", from: "Codex of Lust", to: "Codex of Lust 2:1" },
    { section: "other_items", key: "a18", from: "Codex of Lust", to: "Codex of Lust 2:2" },
    { section: "other_items", key: "a19", from: "Codex of Lust", to: "Codex of Lust 2:3" },
    { section: "other_items", key: "a20", from: "Codex of Lust", to: "Codex of Lust 2:4" },
    { section: "other_items", key: "a21", from: "Codex of Lust", to: "Codex of Lust 2:5" },
    { section: "other_items", key: "a22", from: "Codex of Lust", to: "Codex of Lust 2:6" },
    { section: "other_items", key: "a23", from: "Codex of Lust", to: "Codex of Lust 2:7" },
    { section: "other_items", key: "a24", from: "Codex of Greed", to: "Codex of Greed 3:1" },
    { section: "other_items", key: "a25", from: "Codex of Greed", to: "Codex of Greed 3:2" },
    { section: "other_items", key: "a26", from: "Codex of Greed", to: "Codex of Greed 3:3" },
    { section: "other_items", key: "a27", from: "Codex of Greed", to: "Codex of Greed 3:4" },
    { section: "other_items", key: "a28", from: "Codex of Greed", to: "Codex of Greed 3:5" },
    { section: "other_items", key: "a29", from: "Codex of Greed", to: "Codex of Greed 3:6" },
    { section: "other_items", key: "a30", from: "Codex of Greed", to: "Codex of Greed 3:7" },
    { section: "other_items", key: "a31", from: "Codex of Wrath", to: "Codex of Wrath 4:1" },
    { section: "other_items", key: "a32", from: "Codex of Wrath", to: "Codex of Wrath 4:2" },
    { section: "other_items", key: "a33", from: "Codex of Wrath", to: "Codex of Wrath 4:3" },
    { section: "other_items", key: "a34", from: "Codex of Wrath", to: "Codex of Wrath 4:4" },
    { section: "other_items", key: "a35", from: "Codex of Wrath", to: "Codex of Wrath 4:5" },
    { section: "other_items", key: "a36", from: "Codex of Wrath", to: "Codex of Wrath 4:6" },
    { section: "other_items", key: "a37", from: "Codex of Wrath", to: "Codex of Wrath 4:7" },
    { section: "other_items", key: "a38", from: "Codex of Sloth", to: "Codex of Sloth 5:1" },
    { section: "other_items", key: "a39", from: "Codex of Sloth", to: "Codex of Sloth 5:2" },
    { section: "other_items", key: "a40", from: "Codex of Sloth", to: "Codex of Sloth 5:3" },
    { section: "other_items", key: "a41", from: "Codex of Sloth", to: "Codex of Sloth 5:4" },
    { section: "other_items", key: "a42", from: "Codex of Sloth", to: "Codex of Sloth 5:5" },
    { section: "other_items", key: "a43", from: "Codex of Sloth", to: "Codex of Sloth 5:6" },
    { section: "other_items", key: "a44", from: "Codex of Sloth", to: "Codex of Sloth 5:7" },
    { section: "other_items", key: "a45", from: "Codex of Vanity", to: "Codex of Vanity 6:1" },
    { section: "other_items", key: "a46", from: "Codex of Vanity", to: "Codex of Vanity 6:2" },
    { section: "other_items", key: "a47", from: "Codex of Vanity", to: "Codex of Vanity 6:3" },
    { section: "other_items", key: "a48", from: "Codex of Vanity", to: "Codex of Vanity 6:4" },
    { section: "other_items", key: "a49", from: "Codex of Vanity", to: "Codex of Vanity 6:5" },
    { section: "other_items", key: "a50", from: "Codex of Vanity", to: "Codex of Vanity 6:6" },
    { section: "other_items", key: "a51", from: "Codex of Vanity", to: "Codex of Vanity 6:7" },
    { section: "other_items", key: "a52", from: "Codex of Hubris", to: "Codex of Hubris 7:1" },
    { section: "other_items", key: "a53", from: "Codex of Hubris", to: "Codex of Hubris 7:2" },
    { section: "other_items", key: "a54", from: "Codex of Hubris", to: "Codex of Hubris 7:3" },
    { section: "other_items", key: "a55", from: "Codex of Hubris", to: "Codex of Hubris 7:4" },
    { section: "other_items", key: "a56", from: "Codex of Hubris", to: "Codex of Hubris 7:5" },
    { section: "other_items", key: "a57", from: "Codex of Hubris", to: "Codex of Hubris 7:6" },
    { section: "other_items", key: "a58", from: "Codex of Hubris", to: "Codex of Hubris 7:7" },
    { section: "other_items", key: "a59", from: "Large Charm", to: "Gula's Testament of Gluttony" },
    { section: "other_items", key: "a60", from: "Large Charm", to: "Luxuria's Testament of Lust" },
    { section: "other_items", key: "a61", from: "Large Charm", to: "Avaritia's Testament of Greed" },
    { section: "other_items", key: "a62", from: "Large Charm", to: "Ira's Testament of Wrath" },
    { section: "other_items", key: "a63", from: "Large Charm", to: "Acedia's Testament of Sloth" },
    { section: "other_items", key: "a64", from: "Large Charm", to: "Vanagloria's Testament of Vanity" },
    { section: "other_items", key: "a65", from: "Large Charm", to: "Superbia's Testament of Hubris" },
    { section: "other_items", key: "b65", from: "Socket Remover", to: "Premium Socket Remover" },
  ])
  for (change of nameChanges) {
    if (constants[change.section][change.key].n == change.from) {
      constants[change.section][change.key].n = change.to
    } else {
      console.log(`WARN: name of misc "${change.key}" changed to "${constants[change.section][change.key].n}"`)
    }
  }
  function removeEbSymbol(item) {
    if (item.n && item.n.startsWith("ⅲ")) {
      item.n = item.n.slice(2)
    }
  }
  for (const key in constants.stackables) {
    removeEbSymbol(constants.stackables[key])
  }
  for (const key in constants.weapon_items) {
    removeEbSymbol(constants.weapon_items[key])
  }
  for (const key in constants.armor_items) {
    removeEbSymbol(constants.armor_items[key])
  }
  constants.unq_items.forEach(item => removeEbSymbol(item))
  constants.set_items.forEach(item => removeEbSymbol(item))
}
  
// Function to convert the Diablo 2 casc data to a single file.
// Expect a dictionary whose keys are filenames (without the path), and values the text within the file.
// Required files are:
//  Strings (for versions 96 and prior)
//    local/lng/eng/string.txt
//    local/lng/eng/patchstring.txt
//    local/lng/eng/expansionstring.txt
//  Strings (for version 99)
//    local/lng/strings/item-gems.json
//    local/lng/strings/item-modifiers.json
//    local/lng/strings/item-nameaffixes.json
//    local/lng/strings/item-names.json
//    local/lng/strings/item-runes.json
//    local/lng/strings/skills.json
//  Datas (for any versions)
//    global/excel/CharStats.txt
//    global/excel/PlayerClass.txt
//    global/excel/SkillDesc.txt
//    global/excel/Skills.txt
//    global/excel/RareSuffix.txt
//    global/excel/RarePrefix.txt
//    global/excel/MagicPrefix.txt
//    global/excel/MagicSuffix.txt
//    global/excel/Properties.txt
//    global/excel/ItemStatCost.txt
//    global/excel/Runes.txt
//    global/excel/SetItems.txt
//    global/excel/UniqueItems.txt
//    global/excel/ItemTypes.txt
//    global/excel/Armor.txt
//    global/excel/Weapons.txt
//    global/excel/Misc.txt
//    global/excel/Gems.txt
function makeBundle(buffers) {
  const constants = {};
  let strings = {};
  if (_hasKey(buffers, "local/lng/strings/item-modifiers.json")) {
    // Method for version 99 (better)
    strings =                        _readJSONStrings(_getKey(buffers, "local/lng/strings/item-gems.json"));
    strings = Object.assign(strings, _readJSONStrings(_getKey(buffers, "local/lng/strings/item-modifiers.json")));
    strings = Object.assign(strings, _readJSONStrings(_getKey(buffers, "local/lng/strings/item-nameaffixes.json")));
    strings = Object.assign(strings, _readJSONStrings(_getKey(buffers, "local/lng/strings/item-names.json")));
    strings = Object.assign(strings, _readJSONStrings(_getKey(buffers, "local/lng/strings/item-runes.json")));
    strings = Object.assign(strings, _readJSONStrings(_getKey(buffers, "local/lng/strings/skills.json")));
  } else {
    // Method for versions 96 and prior
    strings =                        _readStrings(_getKey(buffers, "local/lng/eng/string.txt"));
    strings = Object.assign(strings, _readStrings(_getKey(buffers, "local/lng/eng/expansionstring.txt")));
    strings = Object.assign(strings, _readStrings(_getKey(buffers, "local/lng/eng/patchstring.txt")));
  }

  constants.classes = _readClasses(_getArray(buffers, "global/excel/CharStats.txt"), _getArray(buffers, "global/excel/PlayerClass.txt"), strings);
  const skillDescs = _readSkillDesc(_getArray(buffers, "global/excel/SkillDesc.txt"), strings);
  constants.skills = _readSkills(_getArray(buffers, "global/excel/skills.txt"), skillDescs, strings);
  constants.rare_names = [null].concat(_readRareNames(_getArray(buffers, "global/excel/RareSuffix.txt"), 1, strings));
  constants.rare_names = constants.rare_names.concat(
    _readRareNames(_getArray(buffers, "global/excel/RarePrefix.txt"), constants.rare_names.length, strings)
  );
  constants.magic_prefixes = _readMagicNames(_getArray(buffers, "global/excel/MagicPrefix.txt"), strings);
  constants.magic_suffixes = _readMagicNames(_getArray(buffers, "global/excel/MagicSuffix.txt"), strings);
  constants.properties = _readProperties(_getArray(buffers, "global/excel/Properties.txt"), strings);
  constants.magical_properties = _readItemStatCosts(_getArray(buffers, "global/excel/ItemStatCost.txt"), strings);
  constants.runewords = _readRunewords(_getArray(buffers, "global/excel/Runes.txt"), strings);
  constants.set_items = _readSetOrUnqItems(_getArray(buffers, "global/excel/SetItems.txt"), strings);
  constants.unq_items = _readSetOrUnqItems(_getArray(buffers, "global/excel/UniqueItems.txt"), strings);
  const item_types = _readTypes(_getArray(buffers, "global/excel/ItemTypes.txt"), strings);
  const armor_items = _readItems(_getArray(buffers, "global/excel/Armor.txt"), item_types, strings);
  const weapon_items = _readItems(_getArray(buffers, "global/excel/Weapons.txt"), item_types, strings);
  const other_items = _readItems(_getArray(buffers, "global/excel/Misc.txt"), item_types, strings);

  constants.stackables = {};
  [...armor_items, ...weapon_items, ...other_items]
    .filter((item) => item.s === 1)
    .map((item) => (constants.stackables[item.code] = { n: item.n }));
  constants.armor_items = {};
  armor_items.map((item) => {
    constants.armor_items[item.code] = item;
    delete item.code;
  });
  constants.weapon_items = {};
  weapon_items.map((item) => {
    constants.weapon_items[item.code] = item;
    delete item.code;
  });
  constants.other_items = {};
  other_items.map((item) => {
    constants.other_items[item.code] = item;
    delete item.code;
  });
  _readGems(constants.other_items, _getArray(buffers, "global/excel/Gems.txt"), strings);

  return constants;
}

function _getArray(files, find) {
  return _readTsv(_getKey(files, find));
}

function _getKey(files, find) {
  const key = Object.keys(files).find((key) => key.toLowerCase() === find.toLowerCase());
  if (!key) {
    throw new Error(`Cannot find file: ${find}`);
  }
  return files[key];
}

function _hasKey(files, find) {
  return Object.keys(files).find((key) => key.toLowerCase() === find.toLowerCase()) != null;
}

function _readTsv(file) {
  const lines = file.split(/\r?\n/).map((line) => line.split(/\t/));
  const header = lines[0];
  return {
    header: header,
    lines: lines,
  };
}

function formatString(string) {
  // Remove Color codes
  // ÿc1 = Red
  // ÿc2 = Blue
  // ÿc3 = Green
  // ÿc4 = Gold
  // ÿc8 = Orange
  // ÿc- = White
  // ÿc: = Dark Green
  // ÿc0 = white
  // ÿc5 = grey
  // ÿc6 = black
  // ÿc7 = gold
  // ÿc9 = Yellow
  // ÿc; = Purple 

  // Remove EB special character

  // Replace \n by <br>
  return string.replace(/ÿc./gi, "").replace(/\n/g, "<br>")
}

function _readStrings(file) {
  const result = {};
  file
    .split(/\r?\n/)
    .map((line) => line.split(/\t/))
    .map((line) => {
      if (!result[line[0]]) {
        result[line[0]] = formatString(line[1]);
      }
    });
  return result;
}

function _readJSONStrings(file) {
  const result = {};
  //remove BOM
  if (file.charCodeAt(0) === 0xfeff) {
    file = file.slice(1);
  }
  const data = JSON.parse(file);
  for (const str of data) {
    result[str.Key] = formatString(str.enUS);
  }
  return result;
}

function _readClasses(tsv, tsv2, strings) {
  const arr = [];
  const cClass = tsv.header.indexOf("class");
  // str	dex	int	vit	tot	stamina
  const cStr = tsv.header.indexOf("str");
  const cDex = tsv.header.indexOf("dex");
  const cInt = tsv.header.indexOf("int");
  const cVit = tsv.header.indexOf("vit");
  const cStam = tsv.header.indexOf("stamina");
  const cHpadd = tsv.header.indexOf("hpadd");
  const cLifePerLvl = tsv.header.indexOf("LifePerLevel");
  const cStamPerLvl = tsv.header.indexOf("StaminaPerLevel");
  const cManaPerLvl = tsv.header.indexOf("ManaPerLevel");
  const cLifePerVit = tsv.header.indexOf("LifePerVitality");
  const cStamPerVit = tsv.header.indexOf("StaminaPerVitality");
  const cManaPerMag = tsv.header.indexOf("ManaPerMagic");
  const cAllSkills = tsv.header.indexOf("StrAllSkills");
  const cSkillTab1 = tsv.header.indexOf("StrSkillTab1");
  const cSkillTab2 = tsv.header.indexOf("StrSkillTab2");
  const cSkillTab3 = tsv.header.indexOf("StrSkillTab3");
  const cClassOnly = tsv.header.indexOf("StrClassOnly");
  const cCode = tsv2.header.indexOf("Code");
  let id = 0;
  for (let i = 1; i < tsv.lines.length; i++) {
    const clazz = tsv.lines[i][cClass];
    if (clazz && clazz != "Expansion") {
      arr[id] = {
        id,
        n: clazz,
        c: tsv2.lines[i][cCode],
        as: strings[tsv.lines[i][cAllSkills]],
        ts: [strings[tsv.lines[i][cSkillTab1]], strings[tsv.lines[i][cSkillTab2]], strings[tsv.lines[i][cSkillTab3]]],
        co: strings[tsv.lines[i][cClassOnly]],
        s: {
          lpl: +tsv.lines[i][cLifePerLvl],
          mpl: +tsv.lines[i][cManaPerLvl],
          spl: +tsv.lines[i][cStamPerLvl],
          lpv: +tsv.lines[i][cLifePerVit],
          spv: +tsv.lines[i][cStamPerVit],
          mpe: +tsv.lines[i][cManaPerMag],
        },
        a: {
          str: +tsv.lines[i][cStr],
          dex: +tsv.lines[i][cDex],
          int: +tsv.lines[i][cInt],
          vit: +tsv.lines[i][cVit],
          stam: +tsv.lines[i][cStam],
          hpadd: tsv.lines[i][cHpadd],
        },
      };
      id++;
    }
  }
  return arr;
}

function _readSkillDesc(tsv, strings) {
  const arr = {};
  const cSkillDesc = tsv.header.indexOf("skilldesc");
  const cStrName = tsv.header.indexOf("str name");
  for (let i = 1; i < tsv.lines.length; i++) {
    const id = tsv.lines[i][cSkillDesc];
    const skillStrName = tsv.lines[i][cStrName];
    if (id && skillStrName) {
      arr[id] = strings[skillStrName];
    }
  }
  return arr;
}

function _readSkills(tsv, skillDescs/*, strings*/) {
  const arr = [];
  const cSkillDesc = tsv.header.indexOf("skilldesc");
  let cId = tsv.header.indexOf("Id");
  if (cId < 0) {
    cId = tsv.header.indexOf("*Id");
  }
  const cCharclass = tsv.header.indexOf("charclass");
  for (let i = 1; i < tsv.lines.length; i++) {
    const id = +tsv.lines[i][cId];
    const skillDesc = tsv.lines[i][cSkillDesc];
    if (skillDesc) {
      const o = {};
      o.id = id;
      if (skillDescs[skillDesc]) o.s = skillDescs[skillDesc];
      if (tsv.lines[i][cCharclass]) o.c = tsv.lines[i][cCharclass];
      arr[id] = o;
    }
  }
  return arr;
}

function _readRareNames(tsv, idx, strings) {
  const arr = [];
  const cName = tsv.header.indexOf("name");
  let id = idx;
  for (let i = 1; i < tsv.lines.length; i++) {
    const name = tsv.lines[i][cName];
    if (name) {
      arr[id - idx] = {
        id,
        // index: id - idx,
        n: strings[name],
      };
      id++;
    }
  }
  return arr;
}

function _readMagicNames(tsv, strings) {
  const arr = [];
  const cName = tsv.header.indexOf("Name");
  const cTransformcolor = tsv.header.indexOf("transformcolor");
  let id = 1;
  for (let i = 1; i < tsv.lines.length; i++) {
    const name = tsv.lines[i][cName];
    if (name != "Expansion") {
      const o = {};
      o.id = id;
      o.n = strings[name];
      if (tsv.lines[i][cTransformcolor]) o.tc = tsv.lines[i][cTransformcolor];
      arr[id] = o;
      id++;
    }
  }
  return arr;
}

function _readProperties(tsv/*, strings*/) {
  const arr = {};
  const cCode = tsv.header.indexOf("code");
  const cStats = [];
  for (let j = 1; j <= 7; j++) {
    cStats[j] = {};
    cStats[j].cStat = tsv.header.indexOf(`stat${j}`);
    cStats[j].cFunc = tsv.header.indexOf(`func${j}`);
  }
  for (let i = 1; i < tsv.lines.length; i++) {
    const code = tsv.lines[i][cCode];
    if (code != "Expansion") {
      const property = [];
      //propertyDef.code = code;
      for (let j = 1; j <= 7; j++) {
        const stat = tsv.lines[i][cStats[j].cStat];
        const func = tsv.lines[i][cStats[j].cFunc];
        if (!stat && !func) {
          break;
        }
        const s = {};
        if (stat) s.s = stat;
        if (func) s.f = +func;
        property[j - 1] = s;
      }
      if (property.length) {
        arr[code] = property;
      }
    }
  }
  return arr;
}

function _readRunewords(tsv, strings) {
  let arr = [];
  const cName = tsv.header.indexOf("Name");
  for (let i = 1; i < tsv.lines.length; i++) {
    const name = tsv.lines[i][cName];
    if (name) {
      let index = +name.substring(8); // In LoD runewords were in disorder in the runes.txt file. So we use index to sort them back.
      arr[index] = {
        index, // Just for safe keep
        n: strings[tsv.lines[i][cName]],
      };
    }
  }
  // Ids will be calculated from index after removing nulls. They're 1-indexed
  arr = arr.filter(item => !!item) // Remove nulls/undefined
  let id = 1;
  for (let i = 0; i < arr.length; i++) {
    arr[i].id = id++;
  }
  arr.unshift(null) // So that array index matches id. Easier for later searchs
  return arr;
}

function _readTypes(tsv/*, strings*/) {
  const arr = {};
  const cCode = tsv.header.indexOf("Code");
  const cItemType = tsv.header.indexOf("ItemType");
  const cEquiv1 = tsv.header.indexOf("Equiv1");
  const cEquiv2 = tsv.header.indexOf("Equiv2");
  const cInvGfx = [];
  for (let i = 1; i <= 6; i++) {
    cInvGfx.push(tsv.header.indexOf(`InvGfx${i}`));
  }
  for (let i = 1; i < tsv.lines.length; i++) {
    const code = tsv.lines[i][cCode];
    if (code) {
      const o = {code};
      const invgfx = [];
      for (let j = 0; j <= 6; j++) {
        if (tsv.lines[i][cInvGfx[j]]) invgfx[j] = tsv.lines[i][cInvGfx[j]];
      }
      o.ig = invgfx;
      o.eq1 = tsv.lines[i][cEquiv1];
      o.eq2 = tsv.lines[i][cEquiv2];
      o.n = tsv.lines[i][cItemType];
      o.c = [o.n];
      arr[code] = o;
    }
  }

  for (const k of Object.keys(arr)) {
    arr[k].c = [..._resolvetItemTypeCategories(arr, k)];
    if (arr[k] !== undefined && arr[arr[k].eq1] !== undefined) {
      arr[k].eq1n = arr[arr[k].eq1].n;
    }

    if (arr[k] !== undefined && arr[arr[k].eq2] !== undefined) {
      arr[k].eq2n = arr[arr[k].eq2].n;
    }
  }

  return arr;
}

function _resolvetItemTypeCategories(arr, key) {
  let res = [];
  if (arr[key] !== undefined) {
    res = [arr[key].n, ..._resolvetItemTypeCategories(arr, arr[key].eq1), ..._resolvetItemTypeCategories(arr, arr[key].eq2)];
  }
  return res;
}

function _readItems(tsv, itemtypes, strings) {
  const arr = [];
  const cCode = tsv.header.indexOf("code");
  const cNameStr = tsv.header.indexOf("namestr");
  const cStackable = tsv.header.indexOf("stackable");
  const cMaxStack = tsv.header.indexOf("maxstack");
  const cSpawnStack = tsv.header.indexOf("spawnstack");
  const cMinac = tsv.header.indexOf("minac");
  const cMaxac = tsv.header.indexOf("maxac");
  const cDurability = tsv.header.indexOf("durability");
  const cMindam = tsv.header.indexOf("mindam");
  const cMaxdam = tsv.header.indexOf("maxdam");
  const cTwoHandMindam = tsv.header.indexOf("2handmindam");
  const cTwoHandMaxdam = tsv.header.indexOf("2handmaxdam");
  const cMinmisdam = tsv.header.indexOf("minmisdam");
  const cMaxmisdam = tsv.header.indexOf("maxmisdam");
  const cReqstr = tsv.header.indexOf("reqstr");
  const cReqdex = tsv.header.indexOf("reqdex");
  const cHasinv = tsv.header.indexOf("hasinv");
  const cGemSockets = tsv.header.indexOf("gemsockets")
  const cGemapplytype = tsv.header.indexOf("gemapplytype");
  const cInvfile = tsv.header.indexOf("invfile");
  const cUniqueInvfile = tsv.header.indexOf("uniqueinvfile");
  const cSetInvfile = tsv.header.indexOf("setinvfile");
  const cInvwidth = tsv.header.indexOf("invwidth");
  const cInvheight = tsv.header.indexOf("invheight");
  const cInvtransform = tsv.header.indexOf("InvTrans");
  const cType = tsv.header.indexOf("type");
  const cNormCode = tsv.header.indexOf("normcode");
  const cUberCode = tsv.header.indexOf("ubercode");
  const cUltraCode = tsv.header.indexOf("ultracode");

  for (let i = 1; i < tsv.lines.length; i++) {
    const code = tsv.lines[i][cCode];
    if (code) {
      const item = {};
      item.code = code;
      item.nc = tsv.lines[i][cNormCode];
      item.exc = tsv.lines[i][cUberCode];
      item.elc = tsv.lines[i][cUltraCode];
      item.iq =
        item.code === item.exc
          ? EItemQuality.exceptional
          : item.code === item.elc
          ? EItemQuality.elite
          : EItemQuality.normal;
      item.n = strings[tsv.lines[i][cNameStr]];
      if (tsv.lines[i][cStackable] && +tsv.lines[i][cStackable] > 0) {
        item.s = 1;
        if (tsv.lines[i][cMaxStack] &&  +tsv.lines[i][cMaxStack]> 0) item.smax = +tsv.lines[i][cMaxStack];
        if (tsv.lines[i][cSpawnStack] &&  +tsv.lines[i][cSpawnStack]> 0) item.sspawn = +tsv.lines[i][cSpawnStack];
      }
      if (tsv.lines[i][cMinac] && +tsv.lines[i][cMinac] > 0) item.minac = +tsv.lines[i][cMinac];
      if (tsv.lines[i][cMaxac] && +tsv.lines[i][cMaxac] > 0) item.maxac = +tsv.lines[i][cMaxac];
      if (tsv.lines[i][cDurability]) item.durability = +tsv.lines[i][cDurability];
      if (tsv.lines[i][cMindam] && +tsv.lines[i][cMindam] > 0) item.mind = +tsv.lines[i][cMindam];
      if (tsv.lines[i][cMaxdam] && +tsv.lines[i][cMaxdam] > 0) item.maxd = +tsv.lines[i][cMaxdam];
      if (tsv.lines[i][cTwoHandMindam] && +tsv.lines[i][cTwoHandMindam] > 0) item.min2d = +tsv.lines[i][cTwoHandMindam];
      if (tsv.lines[i][cTwoHandMaxdam] && +tsv.lines[i][cTwoHandMaxdam] > 0) item.max2d = +tsv.lines[i][cTwoHandMaxdam];
      if (tsv.lines[i][cMinmisdam] && +tsv.lines[i][cMinmisdam] > 0) item.minmd = +tsv.lines[i][cMinmisdam];
      if (tsv.lines[i][cMaxmisdam] && +tsv.lines[i][cMaxmisdam] > 0) item.maxmd = +tsv.lines[i][cMaxmisdam];
      if (tsv.lines[i][cReqstr]) item.rs = +tsv.lines[i][cReqstr];
      if (tsv.lines[i][cReqdex]) item.rd = +tsv.lines[i][cReqdex];
      if (tsv.lines[i][cHasinv]) item.hi = +tsv.lines[i][cHasinv];
      if (tsv.lines[i][cGemSockets]) item.gs = +tsv.lines[i][cGemSockets];
      if (tsv.lines[i][cGemapplytype]) item.gt = +tsv.lines[i][cGemapplytype];
      if (tsv.lines[i][cInvfile] && tsv.lines[i][cInvfile]) item.i = tsv.lines[i][cInvfile];
      if (tsv.lines[i][cUniqueInvfile]) item.ui = tsv.lines[i][cUniqueInvfile];
      if (tsv.lines[i][cSetInvfile]) item.si = tsv.lines[i][cSetInvfile];
      if (tsv.lines[i][cInvwidth]) item.iw = +tsv.lines[i][cInvwidth];
      if (tsv.lines[i][cInvheight]) item.ih = +tsv.lines[i][cInvheight];
      if (tsv.lines[i][cInvtransform]) item.it = +tsv.lines[i][cInvtransform];
      const type = itemtypes[tsv.lines[i][cType]];
      if (type && type.ig) {
        item.ig = type.ig;
        item.eq1n = type.eq1n;
        item.eq2n = type.eq2n;
        item.c = type.c;
      }
      arr.push(item);
    }
  }
  return arr;
}

function _readGems(miscItems, tsv/*, strings*/) {
  const cCode = tsv.header.indexOf("code");
  const types = ["weapon", "helm", "shield"];
  const cols = {};
  for (const type of types) {
    cols[type] = [];
    for (let j = 1; j <= 3; j++) {
      cols[type][j] = {};
      cols[type][j].cMod = tsv.header.indexOf(`${type}Mod${j}Code`);
      cols[type][j].cParam = tsv.header.indexOf(`${type}Mod${j}Param`);
      cols[type][j].cMin = tsv.header.indexOf(`${type}Mod${j}Min`);
      cols[type][j].cMax = tsv.header.indexOf(`${type}Mod${j}Max`);
    }
  }
  for (let i = 1; i < tsv.lines.length; i++) {
    const code = tsv.lines[i][cCode];
    if (code && code != "Expansion") {
      const item = miscItems[code];
      for (let k = 0; k < 3; k++) {
        const type = types[k];
        for (let j = 1; j <= 3; j++) {
          const mod = tsv.lines[i][cols[type][j].cMod];
          if (!mod) {
            break;
          }
          if (j == 1) {
            if (!item.m) item.m = [];
            item.m[k] = [];
          }
          const m = {code, type};
          m.m = mod;
          if (tsv.lines[i][cols[type][j].cParam]) m.p = +tsv.lines[i][cols[type][j].cParam];
          if (tsv.lines[i][cols[type][j].cMin]) m.min = +tsv.lines[i][cols[type][j].cMin];
          if (tsv.lines[i][cols[type][j].cMax]) m.max = +tsv.lines[i][cols[type][j].cMax];
          item.m[k].push(m);
        }
      }
    }
  }
}

function _readSetOrUnqItems(tsv, strings) {
  const arr = [];
  const cIndex = tsv.header.indexOf("index");
  const cInvfile = tsv.header.indexOf("invfile");
  let cCode = tsv.header.indexOf("code");
  if (cCode < 0) cCode = tsv.header.indexOf("item");
  const cInvtransform = tsv.header.indexOf("invtransform");
  let id = 0;
  for (let i = 1; i < tsv.lines.length; i++) {
    const index = tsv.lines[i][cIndex];
    if (index && index != "Expansion") {
      const o = {};
      o.id = id;
      o.index = index
      o.n = strings[tsv.lines[i][cIndex]];
      if (tsv.lines[i][cInvfile]) o.i = tsv.lines[i][cInvfile];
      if (tsv.lines[i][cCode]) o.c = tsv.lines[i][cCode];
      if (tsv.lines[i][cInvtransform]) o.tc = tsv.lines[i][cInvtransform];
      arr[id] = o;
      id++;
    }
  }
  return arr;
}

function _readItemStatCosts(tsv, strings) {
  const arr = [];
  const cStat = tsv.header.indexOf("Stat");
  let cId = tsv.header.indexOf("ID");
  if (cId < 0) {
    cId = tsv.header.indexOf("*ID");
  }
  const cCSvSaved = tsv.header.indexOf("Saved");
  const cCSvBits = tsv.header.indexOf("CSvBits");
  const cCSvParam = tsv.header.indexOf("CSvParam");
  const cCSvSigned = tsv.header.indexOf("CSvSigned");
  const cValShift = tsv.header.indexOf("ValShift");

  const cEncode = tsv.header.indexOf("Encode");
  const cSigned = tsv.header.indexOf("Signed");
  const cSaveBits = tsv.header.indexOf("Save Bits");
  const cSaveAdd = tsv.header.indexOf("Save Add");
  const cSaveParamBits = tsv.header.indexOf("Save Param Bits");
  const cDescPriority = tsv.header.indexOf("descpriority");
  const cDescFunc = tsv.header.indexOf("descfunc");
  const cDescVal = tsv.header.indexOf("descval");
  const cDescstrpos = tsv.header.indexOf("descstrpos");
  const cDescstrneg = tsv.header.indexOf("descstrneg");
  const cDescstr2 = tsv.header.indexOf("descstr2");
  const cDgrp = tsv.header.indexOf("dgrp");
  const cDgrpFunc = tsv.header.indexOf("dgrpfunc");
  const cDgrpVal = tsv.header.indexOf("dgrpval");
  const cDgrpstrpos = tsv.header.indexOf("dgrpstrpos");
  const cDgrpstrneg = tsv.header.indexOf("dgrpstrneg");
  const cDgrpstr2 = tsv.header.indexOf("dgrpstr2");
  const cOp = tsv.header.indexOf("op");
  const cOpParam = tsv.header.indexOf("op param");
  const cOpBase = tsv.header.indexOf("op base");
  const cOpStat1 = tsv.header.indexOf("op stat1");
  const cOpStat2 = tsv.header.indexOf("op stat2");
  const cOpStat3 = tsv.header.indexOf("op stat3");
  for (let i = 1; i < tsv.lines.length; i++) {
    const id = +tsv.lines[i][cId];
    const stat = tsv.lines[i][cStat];
    if (stat) {
      const o = {};
      o.id = id;
      o.s = stat;
      if (tsv.lines[i][cCSvSaved]) o.c = +tsv.lines[i][cCSvSaved];
      if (tsv.lines[i][cCSvBits]) o.cB = +tsv.lines[i][cCSvBits];
      if (tsv.lines[i][cCSvParam]) o.cP = +tsv.lines[i][cCSvParam];
      if (tsv.lines[i][cCSvSigned]) o.cS = +tsv.lines[i][cCSvSigned];
      if (tsv.lines[i][cEncode]) o.e = +tsv.lines[i][cEncode];
      if (tsv.lines[i][cValShift]) o.cVS = +tsv.lines[i][cValShift];
      if (tsv.lines[i][cSigned]) o.sS = +tsv.lines[i][cSigned];
      if (tsv.lines[i][cSaveBits]) o.sB = +tsv.lines[i][cSaveBits];
      if (tsv.lines[i][cSaveAdd]) o.sA = +tsv.lines[i][cSaveAdd];
      if (tsv.lines[i][cSaveParamBits]) o.sP = +tsv.lines[i][cSaveParamBits];
      if (tsv.lines[i][cDescPriority]) o.so = +tsv.lines[i][cDescPriority];
      if (tsv.lines[i][cDescFunc]) o.dF = +tsv.lines[i][cDescFunc];
      if (tsv.lines[i][cDescVal]) o.dV = +tsv.lines[i][cDescVal];
      if (tsv.lines[i][cDescstrpos]) o.dP = strings[tsv.lines[i][cDescstrpos]];
      if (tsv.lines[i][cDescstrneg]) o.dN = strings[tsv.lines[i][cDescstrneg]];
      if (tsv.lines[i][cDescstr2]) o.d2 = strings[tsv.lines[i][cDescstr2]];
      if (tsv.lines[i][cDgrp]) o.dg = +tsv.lines[i][cDgrp];
      if (tsv.lines[i][cDgrpFunc]) o.dgF = +tsv.lines[i][cDgrpFunc];
      if (tsv.lines[i][cDgrpVal]) o.dgV = +tsv.lines[i][cDgrpVal];
      if (tsv.lines[i][cDgrpstrpos]) o.dgP = strings[tsv.lines[i][cDgrpstrpos]];
      if (tsv.lines[i][cDgrpstrneg]) o.dN = strings[tsv.lines[i][cDgrpstrneg]];
      if (tsv.lines[i][cDgrpstr2]) o.dg2 = strings[tsv.lines[i][cDgrpstr2]];
      if (tsv.lines[i][cOp]) o.o = +tsv.lines[i][cOp];
      if (tsv.lines[i][cOpParam]) o.op = +tsv.lines[i][cOpParam];
      if (tsv.lines[i][cOpBase]) o.ob = tsv.lines[i][cOpBase];
      if (tsv.lines[i][cOpStat1]) o.os = [tsv.lines[i][cOpStat1]];
      if (tsv.lines[i][cOpStat2]) o.os[1] = tsv.lines[i][cOpStat2];
      if (tsv.lines[i][cOpStat3]) o.os[2] = tsv.lines[i][cOpStat3];

      const dmgstatrange = item_property_stat_count[stat];
      if (dmgstatrange) {
        o.np = dmgstatrange.numprops;
        o.dR = strings[dmgstatrange.rangestr];
        o.dE = strings[dmgstatrange.equalstr];
      }
      arr[id] = o;
    }
  }
  return arr;
}

function createBundle(mod, version, output_dir, output_prefix, modPostTreatmentFunction) {
  const input_dir = `../public/d2/game_data/${mod}/version_${version}/`;
  const output_name = `${mod}_constants_${version}`;
  
  // Failsafe to generate even if some files are missing
  const alt_input_dir = mod == "vanilla" ? null : `../public/d2/game_data/vanilla/version_${version}/`;
  
  const input_files = [
    // Strings for versions 96 and prior
    "local/lng/eng/string.txt",
    "local/lng/eng/patchstring.txt",
    "local/lng/eng/expansionstring.txt",
    // Strings for version 99
    "local/lng/strings/item-gems.json",
    "local/lng/strings/item-modifiers.json",
    "local/lng/strings/item-nameaffixes.json",
    "local/lng/strings/item-names.json",
    "local/lng/strings/item-runes.json",
    "local/lng/strings/skills.json",
    // Datas
    "global/excel/CharStats.txt",
    "global/excel/PlayerClass.txt",
    "global/excel/SkillDesc.txt",
    "global/excel/Skills.txt",
    "global/excel/RareSuffix.txt",
    "global/excel/RarePrefix.txt",
    "global/excel/MagicPrefix.txt",
    "global/excel/MagicSuffix.txt",
    "global/excel/Properties.txt",
    "global/excel/ItemStatCost.txt",
    "global/excel/Runes.txt",
    "global/excel/SetItems.txt",
    "global/excel/UniqueItems.txt",
    "global/excel/ItemTypes.txt",
    "global/excel/Armor.txt",
    "global/excel/Weapons.txt",
    "global/excel/Misc.txt",
    "global/excel/Gems.txt",
  ];

  const game_data = {};

  // Read the files
  for (const input_file of input_files) {
    const input_file_path = path.join(__dirname, `${input_dir}${input_file}`);
    if (fs.existsSync(input_file_path)) {
      //file exists
      game_data[input_file] = fs.readFileSync(input_file_path, 'utf8');
    } else if (alt_input_dir) {
      // Failsafe
      const alt_input_file_path = path.join(__dirname, `${alt_input_dir}${input_file}`);
      if (fs.existsSync(alt_input_file_path)) {
        // Alternative file exists
        game_data[input_file] = fs.readFileSync(alt_input_file_path, 'utf8');
      }
    }
  }

  const json_data = makeBundle(game_data);
  json_data.version = `${mod}_constants_${version}`;

  D2RPostTreatment(input_dir, json_data)

  if (modPostTreatmentFunction) {
    modPostTreatmentFunction(input_dir, json_data)
  }

  const to_write_es5format = `export let ${output_name} = ${JSON.stringify(json_data, null, 4)};`;
  const output_file_path_es5format = path.join(__dirname, `${output_dir}${output_prefix}_${output_name}.bundle.js`);
  fs.writeFileSync(output_file_path_es5format, to_write_es5format);
  console.log(`Generated file ${output_file_path_es5format}`);
}

function addMissingFieldsToLegacy(mod, version, output_dir, output_prefix) {
  const input_name = `${mod}_constants_${version}`
  const output_name = `${input_name}`
  const input_file_path_es5format = path.join(__dirname, `${output_dir}${input_name}.bundle.js`);
  const text = fs.readFileSync(input_file_path_es5format, 'utf8');
  const jsonText = text.split(" = ")[1].slice(0, -1);
  const json_data = JSON.parse(jsonText);
  for (key in json_data) {
    const section = json_data[key];
    if (Array.isArray(section)) {
      section.forEach((_, idx) => {
        // Add an id property equal to index, except if null/undefined
        if (typeof section[idx] === 'object' && section[idx] !== null) {
          section[idx] = { id: idx, ...section[idx] };
        }
      })
    }
  }
  json_data.version = input_name;

  const to_write_es5format = `export let ${output_name} = ${JSON.stringify(json_data, null, 4)};`;
  const output_file_path_es5format = path.join(__dirname, `${output_dir}${output_prefix}_${output_name}.bundle.js`);
  fs.writeFileSync(output_file_path_es5format, to_write_es5format);
  console.log(`Generated file ${output_file_path_es5format}`);
}

// Note: currently I don't know how to read the 96 version, because for ex ItemStatCosts.txt is missing necessary columns
addMissingFieldsToLegacy('vanilla', 96, '../public/d2/', 'generated')
addMissingFieldsToLegacy('vanilla', 97, '../public/d2/', 'generated')
createBundle('vanilla', 98, '../public/d2/', 'generated');
createBundle('vanilla', 99, '../public/d2/', 'generated');
createBundle('remodded', 98, '../public/d2/', 'generated', ReMoDDeDPostTreatment);
createBundle('remodded', 99, '../public/d2/', 'generated', ReMoDDeDPostTreatment);