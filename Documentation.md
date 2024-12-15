Data guide: https://www.d2rmodding.com/_files/ugd/698f72_5d9678d029d74fa68dc06293f6405208.pdf
D2S file format:
- http://user.xmission.com/~trevin/DiabloIIv1.09_File_Format.shtml
- https://github.com/WalterCouto/D2CE/blob/main/d2s_File_Format.md
- https://github.com/krisives/d2s-format?tab=readme-ov-file

### Item stats

#### Save Param Bits
Named "sP" in constant bundles.
Number of bits of param before the value. 0 if absent.

#### DescFunc
Named "dF" in constant bundles.
Allows to pass from magical property values to display text.

Special reading for:
- 14: 2 Params (3bits tabular, 13bits: class exclusivity) + 1 Value (tab skills level).

Values:
1 - +[value] [string1]
2 - [value]% [string1]
3 - [value] [string1]
4 - +[value]% [string1]
5 - [value*100/128]% [string1]
6 - +[value] [string1] [string2]
7 - [value]% [string1] [string2]
8 - +[value]% [string1] [string2]
9 - [value] [string1] [string2]
10 - [value*100/128]% [string1] [string2]
11 - Repairs 1 Durability In [100 / value] Seconds
12 - +[value] [string1]
13 - +[value] to [class] Skill Levels
14 - +[value] to [skilltab] Skill Levels ([class] Only)
15 - [chance]% to case [slvl] [skill] on [event]
16 - Level [sLvl] [skill] Aura When Equipped 
17 - [value] [string1] (Increases near [time])
18 - [value]% [string1] (Increases near [time])
19 - this is used by stats that use Blizzard's sprintf implementation (if you don't know what that is, it won't be of interest to you eitherway I guess), look at how prismatic is setup, the string is the format that gets passed to their sprintf spinoff.
20 - [value * -1]% [string1]
21 - [value * -1] [string1]
22 - [value]% [string1] [montype] (warning: this is bugged in vanilla and doesn't work properly, see CE forum)
23 - [value]% [string1] [monster]
24 - used for charges, we all know how that desc looks 
25 - not used by vanilla, present in the code but I didn't test it yet
26 - not used by vanilla, present in the code but I didn't test it yet
27 - +[value] to [skill] ([class] Only)
28 - +[value] to [skill]

#### DescVal
Named "dV" in constant bundles.
Additional parameter to pass from magical property values to display text.

Values:
0 - sprintf
1 - value then text
2 - text then value

#### Save Bits & Save Add
Named "sB" and "sA" in constant bundles.
Save Bits: number of bits of value. 0 if absent.
Save Add: value to subtract from binary. Allows to define min/max.
- Min: -sA.
- Max: (1 >> sB) - 1 - sA.

#### Encode
https://d2mods.info/forum/content/docs/plugins/dll/D2ModCubeOps_ReadMe_v2.txt

Named "e" in constant bundles.
Some properties have complex definitions using bitmapped encodings.

1:
Used for non-class skill/single skill.
Logic is reversed: Param is the value, and values are the Params
1 Param (10bits skill ID, max 1023) + 1 Value (skill level)

2:
Used for chance-to-cast skills.
2 Params (6bits skill level + 10bits skill ID) + 1 Value (7bits chance).

3:
Used for skill charges.
2 Params (6bits skill level + 10bits skill ID) + 2 Values (8bits current charges, 8bits max charges).

#### Operator Base & Operator
Named "ob" & "o" in constant bundles.
If the stats is varying (per level, strength, dext, energy, vita...), "ob" is the stat name and o is...




#### "of Suggestion" suffix for LC
- 550: Amazon (Multiple shot, Lightning Fury, Exploding Arrow, Plague Javelin, ...)
- 551: Sorceress (Abominable, Enchant, Cold Mastery, Blizzard, Blaze, ...)
- 552: Necromancer (Final Calling, Iron Maiden, Raise Skeletal Archer, Terror, Blood Golem, Life Tap, Bone Spear, ...)
- 553: Sacrifice, Smite, 
- 554: Consecrated Ground, Holy Bolt, Holy Fire, Thorns, 
- 555: Shield Toss, Zeal, 
- 556: Fanaticism, Without hesitation, Holy Shield, Conviction, Vengeance, Focused Precision, Confrontation, Salvation, 
- 557: Barbarian (War Stance, Rage, Rend, Groud Render, Battle Cry, Shout, Berserk, ...)
- 558: Chance for Glory, Hear My Prayer, Hold Fast, 
- 559: Druid (Raise hell, Fissure, Mycelium Recycler, Landslide, Poison Creeper, Fenris, Feral Rage, Fiery Fury, ...)


#### Quests

0 = Spoke to Warriv
1 = Den of Evil
> 1 Den cleared, Akara will give +1 skill point
2 = Sisters' Burial Grounds
> 1 Blood Raven dead
4 = The Search for Cain
> 1 Cain rescued
> 3 Picked scroll of Inifuss
> 4 Tristram portal opened
> 10 (cows?)
5 = Forgotten Tower
3 = Tools of the Trade
> 1 Charsy will reward you
6 = Sisters to the Slaughter
> 1 Andariel is dead
> 4 Quest succesful for my party ?
7 = Able to go to Act II
8 = Spoke to Jerhyn
9 = Radament's Lair
> 1 Radament is dead
10 = The Horadric Staff
11 = The Tainted Sun
12 = The Arcane Sanctuary
13 = The Summoner
14 = The Seven Tombs
> 1
> 3 Talked to tyrael
> 4 Talked to jerhyn
15 = Able to go to Act III
16 = Spoke to Hratli
20 = The Golden Bird
> 1 Alkor will give you a reward
> 2 Not at the "Show Meshif the Figurine" stage yet. Need to talk to Cain.
> 4 Not at the "Give Golden Bird to Alkor" stage yet. Need to talk to Cain.
> 5 Received the potion
> 6 Ask cain about the jade figurine (persists after talking to cain)
19 = Blade of the Old Religion
18 = Khalim's Will
17 = Lam Esen's Tome
21 = The Blackened Temple
22 = The Guardian
23 = Able to go to Act IV
24 = Spoke to Tyrael
25 = The Fallen Angel
> 1 Izual dead, Tyrael will give you +2 skill points
27 = Hell's Forge
26 = Terror's End
> 1 Diablo dead
28 = Able to go to Act V
35 = Seige on Haggorath
> 1 Shenk dead, Larzuk will socket an item
36 = Rescue on Mount Arreat
> 1 Barbarians rescued, qual-Kehk will give you 3 runes
37 = Prison of Ice
> 1 Anya freed, she will give a free item
38 = Betrayal of Haggorath
39 = Rite of Passage
40 = Eve of Destruction

/*
///////////////////////////////////////////////
INDEX		IDENTIFIER		NAME
1st			0				Spoke to Warriv
2nd			1				Den of Evil
3rd			2				Sisters' Burial Grounds
4th			4				The Search for Cain
5th			5				Forgotten Tower
6th			3				Tools of the Trade
7th			6				Sisters to the Slaughter
8th			7				Able to go to Act II
///////////////////////////////////////////////
9th			8				Spoke to Jerhyn
10th		9				Radament's Lair
11th		10				The Horadric Staff
12th		11				The Tainted Sun
13th		12				The Arcane Sanctuary
14th		13				The Summoner
15th		14				The Seven Tombs
16th		15				Able to go to Act III
///////////////////////////////////////////////
17th		16				Spoke to Hratli
18th		20				The Golden Bird
19th		19				Blade of the Old Religion
20th		18				Khalim's Will
21th		17				Lam Esen's Tome
22th		21				The Blackened Temple
23th		22				The Guardian
24th		23				Able to go to Act IV
///////////////////////////////////////////////
25th		24				Spoke to Tyrael
26th		25				The Fallen Angel
27th		27				Hell's Forge
28th		26				Terror's End
29th		28				Able to go to Act V
///////////////////////////////////////////////
30th		32				Spoke to Cain
31th		35				Siege on Haggorath
32th		36				Rescue on Mount Arreat
33th		37				Prison of Ice
34th		38				Betrayal of Haggorath
35th		39				Rite of Passage
36th		40				Eve of Destruction
37th		41				Secret Cow Level
///////////////////////////////////////////////
Note 1: indentifier is used as index in packets with array of size 41 and plus
Note 2: another index (availIndex) is used in packets with array of size 37 (id 0x5E)
*/

questBaseData: {
  commonStatusList: {
    0: {who: "Any player", description: "Nothing to report"}, // Any other case: not started, completed in a previous game, already completed before you join the game
    12: {who: "Another party", description: "Another party completed the quest in this game"},
    13: {who: "A teamate", description: "Party completed the quest in this game"}
  },
  commonStates: {
    //0: {who: "Myself", entry: "Completed the quest (both requirements & thanks by NPC & reward used)"},
    //1: {who: "A teamate", entry: "Completed the requirements, must go town validate quest by NPC(s) or use the reward", exit: "State 0"},
    12: {who: "Myself", entry: "Greyed the quest item in the Quest Log window"},
    13: {who: "A teamate", entry: "Quest requirements completed in this game", exit: "End game"},
    14: {who: "Myself", entry: "Another party completed the quest requirements in this game", exit: "End game"},
    15: {who: "Myself", entry: "Completed the requirements in a previous game, there was a reward but it has been used later in another game or not yet"}
  },
  list: {
    A1intro: {
      id: 0,
      availId: 0,
      act: 1,
      name: "Spoke to Warriv",
      states: {
        0: {who: "Myself", entry: "Introduced to Wariv"}
      }
    },
    A1Q1: {
      id: 1,
      availId: 1,
      act: 1,
      name: "Den of Evil",
      statusList: {
        1: {who: "Any player", description: "Akara gave the quest"},
        2: {who: "Any player", description: "Entered the Den of Evil"},
        4: {who: "Any player", description: "5 or less monsters left in Den of Evil"},
        5: {who: "A teamate", description: "Den of Evil cleared"}
      },
      states: {
        2: {who: "Any player", entry: "Akara gave the quest", exit: "State 0"},
        3: {who: "Any player", entry: "Left Town after step 2", exit: "State 0"},
        4: {who: "Any player", entry: "Entered Den of Evil", exit: "State 0"},
        1: {who: "A teamate", entry: "Cleaned Den of Evil", exit: "State 0"},
        0: {who: "Myself", entry: "Received the reward (1 skill point) from Akara"}, 
      }
    },
    A1Q2: {
      id: 2,
      availId: 2,
      act: 1,
      name: "Sisters' Burial Grounds",
      statusList: {
        1: {who: "Any player", description: "Kashya gave the quest", requires: "A1Q1"},
        2: {who: "Any player", description: "Entered the Burial Ground"},
        3: {who: "A teamate", description: "Blood Raven is dead and the death animation is over"},
      },
      states: {
        2: {who: "Any player", entry: "Kashya gave the quest", requires: "A1Q1"},
        3: {who: "Any player", entry: "Left Town after step 2"},
        4: {who: "Any player", entry: "Entered Burial Grounds"},
        1: {who: "A teamate", entry: "Killed Blood Raven", exit: "State 0"},
        0: {who: "Myself", entry: "Received the reward (free NPC) from Kashya"} 
      }
    },
    A1Q3: {
      id: 4,
      availId: 4,
      act: 1,
      name: "The Search for Cain",
      statusList: {
        1: {who: "Any player", description: "Akara gave the quest", requires: "A1Q2"},
        2: {who: "Any player", description: "Interacted with the Tree of Inifus"},
        3: {who: "Any player", description: "Akara interpreted the Scroll of Inifus"},
        4: {who: "Any player", description: "Activated the Cairn Stones and opened the portal to Tristram"},
        6: {who: "A teamate", description: "Release Cain from his cage"}
      },
      states: {
        2: {who: "Any player", entry: "Akara gave the quest", requires: "A1Q2"},
        3: {who: "Any player", entry: "Picked the Scroll of Inifus"},
        4: {who: "Any player", entry: "Opened the red portal to Tristram"},
        1: {who: "A teamate", entry: "Released Cain", exit: "State 0"},
        0: {who: "Myself", entry: "Received the reward (rare ring) from Akara"},
        10: {who: "A teamate", entry: "Killed the Cow King"}
      }
    },
    A1Q4: {
      id: 5,
      availId: 5,
      act: 1,
      name: "Forgotten Tower",
      statusList: {
        1: {who: "Any player", description: "Read the Moldy Tome in Stone Field", requires: "A1Q3"},
        4: {who: "Any player", description: "Entered the Forgotton Tower"},
        2: {who: "Any player", description: "Entered the Tower Cellar level 5"},
        13: {who: "A teamate", description: "Killed the Countess, the animation is finished and vault opened"}
      },
      states: {
        2: {who: "Any player", entry: "Read the Moldy Tome in Stone Field or entered the Forgotten Tower"},
        4: {who: "Any player", entry: "Entered the Tower Cellar level 5"},
        0: {who: "A teamate", entry: "Killed the Countess"} 
      }
    },
    A1Q5: {
      id: 3,
      availId: 3,
      act: 1,
      name: "Tools of the Trade",
      statusList: {
        1: {who: "Any player", description: "Charsi gave the quest", requires: "A1Q3"},
        2: {who: "Any player", description: "Picked the Horadric Malus"},
        4: {who: "A teamate", description: "Gave the Horadric Malus. If level >= 8 got reward, otherwise cannot complete the Q"},
      },
      states: {
        2: {who: "Any player", entry: "Charsi gave the quest", requires: "A1Q3"},
        3: {who: "Any player", entry: "Left Town after step 2"},
        6: {who: "Myself", entry: "Picked the Malus"},
        1: {who: "A teamate", entry: "Gave the Malus to Charsi"},
        0: {who: "Myself", entry: "Imbued an item"},
      }
    },
    A1Q6: {
      id: 6,
      availId: 6,
      act: 1,
      name: "Sisters to the Slaughter",
      statusList: {
        1: {who: "Any player", description: "Cain gave the quest", requires: "A1Q5"},
        2: {who: "Any player", description: "Entered the Catacombs level 4"},
        3: {who: "A teamate", description: "Killed Andariel, animation is finished and portal to Rogue Camp is open"}
      },
      states: {
        2: {who: "Any player", entry: "Cain gave the quest", requires: "A1Q5"},
        3: {who: "Any player", entry: "Left Town after step 2"},
        4: {who: "Any player", entry: "Entered Catacombs level 4"},
        1: {who: "A teamate", entry: "Killed Andariel", exit: "State 0"},
        0: {who: "Myself", entry: "Talked to Wariv"}
      }
    },
    A1toA2: {
      id: 7,
      availId: 7,
      act: 1,
      name: "Able to go to Act II",
      states: {
        0: {who: "Myself", entry: "Used the Caraven to go to Act 2"}
      }
    },
    A2intro: {
      id: 8,
      availId: 8,
      act: 2,
      name: "Spoke to Jerhyn",
      states: {
        0: {who: "Myself", entry: "Introduced to Jerhyn"}
      }
    },
    A2Q1: {
      id: 9,
      availId: 9,
      act: 2,
      name: "Radament's Lair",
      statusList: {
        1: {who: "Any player", description: "Atma gave the quest"},
        2: {who: "Any player", description: "Found Radament in the Sewers level 3"},
        3: {who: "A teamate", description: "Killed Radament and the animation is finished"}
      },
      states: {
        2: {who: "Any player", entry: "Atma gave the quest"},
        3: {who: "Any player", entry: "Left town after step 2"},
        4: {who: "Any player", entry: "Found Radament in Sewers 3"},
        5: {who: "Myself", entry: "There is a book of skill on the floor for me"},
        1: {who: "A teamate", entry: "Killed Radament"},
        0: {who: "A teamate", entry: "Talked to Atma"}
      }
    },
    A2Q2: {
      id: 10,
      availId: 10,
      act: 2,
      name: "The Horadric Staff",
      statusList: {
        1: {who: "Myself", description: "Have the Horadric Scroll"},
        2: {who: "Myself", description: "Showed the Horadric Scroll to Cain"},
        3: {who: "Myself", description: "Have Horadric Cube, Staff of Kings and Amulet of the Viper"},
        6: {who: "Myself", description: "Assembled the Horadric Staff"},
        5: {who: "Myself", description: "Showed the the Horadric Staff to Cain"},
        11: {who: "A teamate", description: "Used the staff in a previous game ?"},
        13: undefined
      },
      states: {
        3: {who: "Myself", entry: "Showed the Horadric Scroll to Cain", requires: "A2Q1"},
        4: {who: "Myself", entry: "Showed the Aumlet of the Viper to Cain"},
        5: {who: "Myself", entry: "Showed the Staff of Kings to Cain"},
        6: {who: "Myself", entry: "Showed the Horadric Cube to Cain"},
        11: {who: "Myself", entry: "Transmuted the Horadric Staff"},
        10: {who: "Myself", entry: "Showed the Horadric Staff to Cain"},
        0: {who: "A teamate", entry: "Put the Horadric Staff in the Orifice"},
      }
    },
    A2Q3: {
      id: 11,
      availId: 11,
      act: 2,
      name: "The Tainted Sun",
      statusList: {
        1: {who: "Any player", description: "Have the Horadric Scroll"},
        2: {who: "A teamate", description: "Broke the Tainted Sun Altar"}
      },
      states: {
        2: {who: "Any player", entry: "The sun goes out (after entering Lost City)"},
        3: {who: "Any player", entry: "Asked Drognan about the Darkness"},
        1: {who: "A teamate", entry: "Destroyed the Tainted Sun Altar", exit: "State 0"},
        0: {who: "Myself", entry: "Talked to any NPC in town"},
      }
    },
    A2Q4: {
      id: 12,
      availId: 12,
      act: 2,
      name: "The Arcane Sanctuary",
      statusList: {
        2: {who: "Any player", description: "Drognan gave the quest", requires: "A2Q3"},
        3: {who: "Any player", description: "Talked to Jerhyn"},
        4: {who: "Any player", description: "Entered the Arcane Sanctuary"},
        5: {who: "A teamate", description: "Opened Horazon's Journal"},
        13: undefined
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Drognan", exit: "State 1", requires: "Horadric Staff"},
        3: {who: "Any player", entry: "Received the autorization from Jerhyn to explore the Palace", exit: "State 1"},
        4: {who: "Any player", entry: "Left town after step 3", exit: "State 1"},
        5: {who: "Any player", entry: "Entered the Arcane Sanctuary", exit: "State 1"},
        7: {who: "Myself", entry: "The guard said: You may not pass"},
        8: {who: "Myself", entry: "The guard said: Stay out of trouble or any player entered the Canyon of Magi"},
        1: {who: "A teamate", entry: "Read Horazon's Journal and opened the portal to Canyon of Magi", exit: "State 0"},
        0: {who: "A teamate", entry: "Killed the Summoner"}
      }
    },
    A2Q5: {
      id: 13,
      availId: 13,
      act: 2,
      name: "The Summoner",
      statusList: {
        2: {who: "Any player", description: "Found the Summoner in Arcane Sanctuary"},
        4: {who: "A teamate", description: "Killed the Summoner"}
      },
      states: {
        2: {who: "Any player", entry: "Found and heard the Summoner's talk"},
        1: {who: "A teamate", entry: "Found and heard the Summoner's talk", exit: "State 0"},
        0: {who: "Myself", entry: "Talked to any NPC in town"}
      }
    },
    A2Q6: {
      id: 14,
      availId: 14,
      act: 2,
      name: "The Seven Tombs",
      statusList: {
        1: {who: "Any player", description: "Received the quest from Jerhyn", requires: "A2Q1 or A2Q2 or A2Q3"},
        3: {who: "A teamate", description: "Killed Duriel, the wall to the rest of the tomb collapses"},
        5: {who: "A teamate", description: "Freed Tyrael"},
        6: {who: "Myself", description: "Spoke to Jerhyn"},
        13: undefined
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Jerhyn", requires: "A2Q1 or A2Q2 or A2Q3"},
        5: {who: "A teamate", entry: "Killed Duriel"},
        3: {who: "A teamate", entry: "Freed to Tyrael", exit: "State 4"},
        6: {who: "Myself", entry: "Received congratulations by Atma"},
        7: {who: "Myself", entry: "Received congratulations by Wariv"},
        8: {who: "Myself", entry: "Received congratulations by Drognan"},
        9: {who: "Myself", entry: "Received congratulations by Lysander"},
        10: {who: "Myself", entry: "Received congratulations by Cain"},
        11: {who: "Myself", entry: "Received congratulations by Fara"},
        4: {who: "Myself", entry: "Talked to Jerhyn", exit: "State 0"},
        0: {who: "Myself", entry: "Talked to Meshif"}
      }
    },
    A2toA3: {
      id: 15,
      availId: 15,
      act: 2,
      name: "Able to go to Act III",
      states: {
        0: {who: "Myself", entry: "Sailed to the East"}
      }
    },
    A3intro: {
      id: 16,
      availId: 17,
      act: 3,
      name: "Spoke to Hratli",
      states: {
        0: {who: "Myself", entry: "Talked to Hratli"}
      }
    },
    A3Q4: {
      id: 17,
      availId: 18,
      act: 3,
      name: "Lam Esen's Tome",
      statusList: {
        1: {who: "Any player", description: "Received the quest from Alkor", requires: "A3Q1 and crossed Kurast Bazar entrance"},
        2: {who: "Any player", description: "Picked Lam Essen's Tome"},
        13:  {who: "A teamate", description: "Gave Lam Essen's Tome to Alkor"},
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Alkor", requires: "A3Q1 and crossed Kurast Bazar entrance"},
        1: {who: "Any player", entry: "Brought Lam Esen's Tome back to town"},
        0: {who: "A teamate", entry: "Gave Lam Esen's Tome to Alkor"}
      }
    },
    A3Q3: {
      id: 18,
      availId: 19,
      act: 3,
      name: "Khalim's Will",
      statusList: {
        1: {who: "Any player", description: "Talked to Cain", requires: "A3Q1 or entered Great Marsh"}, // Also after breaking the Orb thanks to Kalim's Will ?
        2: {who: "Myself", description: "Picked Kalim's Eye in Spider Cavern"},
        3: {who: "Myself", description: "Picked Kalim's Heart in the Sewers level 2"},
        4: {who: "Myself", description: "Picked Kalim's Brain in the Flayer Dungeon Level 3"},
        7: {who: "Myself", description: "Picked Kalim's Flail from the High Council in Travincal"},
        5: {who: "Myself", description: "Talked to Cain with all ingredients of Kalim's Will"},
        6: {who: "Myself", description: "Transmuted Kalim's Will"},
        13: undefined
      },
      states: {
        2: {who: "Myself", entry: "Received the quest from Cain", requires: "A3Q1 or any player entered Great Marsh"},
        3: {who: "Myself", entry: "I showed Kalim's Eye to Cain"},
        4: {who: "Myself", entry: "I showed Kalim's Brain to Cain"},
        5: {who: "Myself", entry: "I showed Kalim's Flail to Cain"},
        6: {who: "Myself", entry: "I showed Kalim's Heart to Cain"},
        7: {who: "Myself", entry: "I showed the transmuted Kalim's Will to Cain"},
        0: {who: "A teamate", entry: "Smashed the Orb with Kalim's Will"}
      }
    },
    A3Q2: {
      id: 19,
      availId: 20,
      act: 3,
      name: "Blade of the Old Religion",
      statusList: {
        2: {who: "Any player", description: "Talked to Hratli", requires: "A3Q1"},
        3: {who: "Any player", description: "Looted the Gidbinn"},
        5: {who: "A teamate", description: "Talked to Ormus"},
        6: {who: "Myself", description: "Talked to Asheara"},

      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Hratli", exit: "State 3", requires: "A3Q1"},
        3: {who: "Any player", entry: "Left town after step 2"},
        4: {who: "Any player", entry: "Killed the unique Flayer that drops The Gidbinn"},
        5: {who: "Myself", entry: "Picked the Gidbinn"},
        9: {who: "Myself", entry: "Picked the Gidbinn"},
        6: {who: "A teamate", entry: "Gave the Gidbinn to Ormus"},
        0: {who: "Myself", entry: "Received the reward from Asheara"},
        7: {who: "Myself", entry: "Can recruit Iron Wolves"},
        8: {who: "Myself", entry: "Received the reward from Ormus"}
      }
    },
    A3Q1: {
      id: 20,
      availId: 21,
      act: 3,
      name: "The Golden Bird",
      statusList: {
        1: {who: "Any player", description: "Loots the Jade Figurine"},
        2: {who: "Any player", description: "Showed the Jade Figurine to Cain"},
        3: {who: "Any player", description: "Exchanged the Jade Figurine to the Golden Bird at Meshif"},
        4: {who: "Any player", description: "Showed the Golden Bird to Cain"},
        5: {who: "A teamate", description: "Gave the Golden Bird to Alkor"},
        13: {who: "Myself", description: "Fetched the Potion of Life"}
      },
      states: {
        6: {who: "Myself", entry: "Picked the Jade Figurine", exit: "State 0"},
        2: {who: "A teamate", entry: "Showed the Jade Figurine to Cain", exit: "State 0"},
        4: {who: "A teamate", entry: "Showed the Golden Bird to Cain", exit: "State 0"},
        1: {who: "A teamate", entry: "Gave the Golden Bird to Alkor", exit: "State 0"},
        0: {who: "Myself", entry: "Received the reward (Potion of Life) from Alkor"},
        5: {who: "Myself", entry: "Have Potion of Life from Alkor", exit: "Consume Potion of Life"}
      }
    },
    A3Q5: {
      id: 21,
      availId: 22,
      act: 3,
      name: "The Blackened Temple",
      statusList: {
        2: {who: "Any player", description: "Received the quest from Ormus", requires: "A1Q4"},
        3: {who: "Any player", description: "Found the High Council"},
        4: {who: "A teamate", description: "Killed the High Council"},
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Ormus", requires: "A1Q4"},
        3: {who: "Any player", entry: "Found the Council"},
        4: {who: "A teamate", entry: "Killed the Council", requires: "In range", exit: "State 0"},
        0: {who: "A teamate", entry: "Talked to Cain"}
      }
    },
    A3Q6: {
      id: 22,
      availId: 23,
      act: 3,
      name: "The Guardian",
      statusList: {
        3: {who: "Any player", description: "Entered Durance of Hate level 1"},
        4: {who: "Any player", description: "Entered Durance of Hate level 3"},
        // Status 13 = talk to Cain, but when using portal to act 4, status is set to 4 again
      },
      states: {
        8: {who: "Any player", entry: "Entered Durance of Hate level 1"},
        9: {who: "Any player", entry: "Entered Durance of Hate level 3"},
        0: {who: "A teamate", entry: "Killed Mephisto"},
        11: {who: "Myself", entry: "Have to talk to any NPC in town", exit: "Talked to any NPC"}
      }
    },
    A3toA4: {
      id: 23,
      availId: 24,
      act: 3,
      name: "Able to go to Act IV",
      states: {
        0: {who: "Myself", entry: "Used red portal in Durance of Hate level 3"},
      }
    },
    A4intro: {
      id: 24,
      availId: 25,
      act: 4,
      name: "Spoke to Tyrael",
      states: {
        0: {who: "Myself", entry: "Talked to Tyrael"},
      }
    },
    A4Q1: {
      id: 25,
      availId: 26,
      act: 4,
      name: "The Fallen Angel",
      statusList: {
        1: {who: "Any player", description: "Talked to Tyrael"},
        2: {who: "Any player", description: "Found the demon that holds Izual's soul"},
        3: {who: "A teamate", description: "Killed the demon that holds Izual's soul"},
        4: {who: "A teamate", description: "Talked to Izual's soul"},
        13: {who: "A teamate", description: "Talked to Tyrael"},
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Tyrael", exit: "State 1"},
        3: {who: "Any player", entry: "Left town after step 2", exit: "State 1"},
        1: {who: "A teamate", entry: "Killed the demon that holds Izual's soul", exit: "State 0"},
        5: {who: "Myself", entry: "Talked to Izual's soul", exit: "State 0"},
        0: {who: "Myself", entry: "Received the reward from Tyrael"}
      }
    },
    A4Q3: {
      id: 26,
      availId: 27,
      act: 4,
      name: "Terror's End",
      statusList: {
        1: {who: "Any player", description: "Talks to Tyrael", requires: "A4Q2"},
        13: {who: "A teamate", description: "Killed Diablo"}
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Tyrael", requires: "A3Q1"},
        3: {who: "Any player", entry: "Left town after step 2 or entered Chaos Sanctuary"},
        0: {who: "A teamate", entry: "Killed Diablo"},
        8: {who: "Myself", entry: "Received congratulations from Cain"},
        9: {who: "Myself", entry: "Received congratulations from Tyrael, red portal to act 5 opened"}
      }
    },
    A4Q2: {
      id: 27,
      availId: 28,
      act: 4,
      name: "Hell's Forge",
      statusList: {
        1: {who: "Any player", description: "Has Mephisto's Soulstone"},
        2: {who: "Any player", description: "Found Hephastos and the Hell Forge"},
        3: {who: "Any player", description: "Place Mephisto's Soulstone in the Hell Forge"},
        4: {who: "Any player", description: "Talked to Cain without Mephisto's Soulstone"},
        13: {who: "A teamate", description: "Destroyed Mephisto's Soulstone"}
      },
      states: {
        5: {who: "Any player", entry: "Received the quest from Cain (and eventually the Soulstone)", exit: "State 1"},
        3: {who: "Any player", entry: "Left town after step 2", exit: "State 1"},
        1: {who: "A teamate", entry: "Destroyed the Soulstone", exit: "State 0"},
        0: {who: "Myself", entry: "Received congratulations from Cain"},
      }
    },
    A4toA5: {
      id: 28,
      availId: 29,
      act: 4,
      name: "Able to go to Act V",
      states: {
        0: {who: "Myself", entry: "Used the red portal to Act 5"}
      }
    },
    A5intro: {
      id: 32,
      availId: 30,
      act: 5,
      name: "Spoke to Cain ?"
    },
    A5Q1: {
      id: 35,
      availId: 31,
      act: 5,
      name: "Siege on Haggorath",
      statusList: {
        1: {who: "Any player", description: "Talked to Larzuk"},
        2: {who: "Any player", description: "Found Shenk"},
        3: {who: "A teamate", description: "Killed Shenk"},
        4: {who: "Myself", description: "Talked to Larzuk"},
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Larzuk", exit: "State 5"},
        3: {who: "Any player", entry: "Left town after step 2 or entered Bloody Foothills", exit: "State 5"},
        1: {who: "A teamate", entry: "Killed Shenk", exit: "State 0"},
        5: {who: "Myself", entry: "Received the reward from Larzuk"},
        0: {who: "Myself", entry: "Socketed an item thanks to Larzuk"}
      }
    },
    A5Q2: {
      id: 36,
      availId: 32,
      act: 5,
      name: "Rescue on Mount Arreat",
      statusList: {
        1: {who: "Any player", description: "Talked to Qual-Kehk or entered Frigid Highlands", requires: "A5Q1"},
        5: {who: "Any player", description: "Have rescued 5 barbarians"},
        2: {who: "Any player", description: "Have rescued 10 barbarians"},
        3: {who: "Any player", description: "Have rescued 15 barbarians"},
        13: {who: "A teamate", description: "Talked to Qual-Kehk and received the reward"}
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Qual-Kehk", exit: "State 0", requires: "A5Q1"},
        3: {who: "Any player", entry: "Left town after step 2 or entered Frigid Highlands", exit: "State 0"},
        4: {who: "Myself", entry: "First barbarians returned to town", exit: "State 0"},
        1: {who: "A teamate", entry: "Freed the last barbarians", exit: "State 0"},
        5: {who: "A teamate", entry: "Freed the last barbarians", exit: "State 0"},
        0: {who: "Myself", entry: "Received the reward from Qual-Kehk"}
      }
    },
    A5Q3: {
      id: 37,
      availId: 33,
      act: 5,
      name: "Prison of Ice",
      statusList: {
        1: {who: "Any player", description: "Received the quest from Malah or enter Crystalline Passage", requires: "A5Q2"}, // Nihlathak disapears when entering the Cristalline Passage
        2: {who: "Any player", description: "Found Frozen Anya"},
        3: {who: "Any player", description: "Talked to Frozen Anya"},
        4: {who: "Any player", description: "Obtained the potion from Malah"},
        5: {who: "A teamate", description: "Released Frozen Anya"},
        6: {who: "Myself", description: "Talked to Malah and obtained the Scroll of Resistance"},
        13: {who: "Myself", description: "Talked to Anya and obtained the reward"},
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Malah", requires: "A5Q2"},
        3: {who: "Any player", entry: "Left town after step 2 or entered Cristalline Passage"},
        1: {who: "A teamate", entry: "Freed frozen Anya with the potion from Malah"},
        8: {who: "Myself", entry: "Received the Scroll of Resistance from Malah"},
        7: {who: "Myself", entry: "Consumed the Scroll of Resistance"},
        9: {who: "Myself", entry: "Received the reward (rare item) from Anya in town"},
        10: {who: "Myself", entry: "Anya opened the red portal to Nihlathak's Temple"},
        0: {who: "Myself", entry: "Talked to both Anya & Malah"},
        14: {who: "Myself", entry: "Entered the Hall of Pain", requires: "A5Q3"},
      }
    },
    A5Q4: {
      id: 38,
      availId: 34,
      act: 5,
      name: "Betrayal of Haggorath",
      statusList: {
        1: {who: "Any player", description: "Received the quest from Anya, the red portal is opened", requires: "A5Q3"},
        2: {who: "Any player", description: "Used the red portal to access Nihlathak's Temple"},
        3: {who: "Any player", description: "Found Nihlathak in the Halls of Vaught"},
        4: {who: "A teamate", description: "Killed Nihlathak"},
        5: {who: "Myself", description: "Talked to Anya, can now personalize an item"},
        13: {who: "Myself", description: "Personalized an item"},
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Anya", requires: "A5Q3"},
        3: {who: "Any player", entry: "Left town after step 2"},
        1: {who: "Teamate", entry: "Killed Nihlathak"},
        4: {who: "Myself", entry: "Received the reward (Personalize) from Anya"},
        0: {who: "Myself", entry: "Personalized an item thanks to Anya"}
      }
    },
    A5Q5: {
      id: 39,
      availId: 35,
      act: 5,
      name: "Rite of Passage",
      statusList: {
        1: {who: "Any player", description: "Received the quest from Qual-Kehk", requires: "A5Q4"},
        2: {who: "Any player", description: "Entered Arreat Summit"},
        3: {who: "Any player", description: "Activated the Altar of the Heavens, consulting the ancients"},
        13: {who: "A teamate", description: "Killed the 3 ancients", requires: "In zone"}
      },
      states: {
        2: {who: "Any player", entry: "Received the quest from Qual-Kehk", requires: "A5Q4"},
        3: {who: "Any player", entry: "Left town after step 2 or entered Arreat Summit"},
        0: {who: "A teamate", entry: "Killed the 3 ancients", requires: "In range"},
        4: {who: "A teamate", entry: "The ancients became gold statues"},
        5: {who: "Myself", entry: "Received congratulations from Larzuk"},
        6: {who: "Myself", entry: "Received congratulations from Cain"},
        7: {who: "Myself", entry: "Received congratulations from Anya"},
        8: {who: "Myself", entry: "Received congratulations from Malah"},
        9: {who: "Myself", entry: "Received congratulations from Qual-Kehk"}
      }
    },
    A6Q6: {
      id: 40,
      availId: 36,
      act: 5,
      name: "Eve of Destruction",
      statusList: {
        1: {who: "Myself", description: "Passed the Ancients trial", requires: "A5Q5"},
        2: {who: "Any player", description: "Entered Throne of Destruction"},
        3: {who: "Any player", description: "Killed all 5 waves of minions and forced Baal to retreat to the Worldstone Chamber"},
        4: {who: "A teamate", description: "Killed Baal, the quest item can be greyed"},
        13: undefined
      },
      states: {
        2: {who: "Any player", entry: "Killed the ancients", requires: "A5Q5"},
        3: {who: "Any player", entry: "Left town after step 2"},
        0: {who: "A teamate", entry: "Killed Baal"},
        4: {who: "Myself", entry: "Received congratulation from Larzuk"},
        5: {who: "Myself", entry: "Received congratulation from Cain"},
        6: {who: "Myself", entry: "Received congratulation from Malah"},
        7: {who: "Myself", entry: "Received congratulation from Tyrael, red portal to The Destruction's End opened"},
        8: {who: "Myself", entry: "Received congratulation from Qual-Kehk"},
        9: {who: "Myself", entry: "Received congratulation from Anya"},
        10: {who: "Myself", entry: "Used the portal to The Destruction's End"}
      }
    },
    ResetStatsSkills: {
      id: 41,
      availId: 16,
      act: 5,
      name: "Reset stats/skills",
      states: {
        1: {who: "Myself", entry: "Reset stats/skills entry added to Akara's menu", requires: "A1Q1"},
        0: {who: "Myself", entry: "Reseted stats/skills thanks to Akara"}
      }
    },
    SecretCowLevel: undefined
  }
}