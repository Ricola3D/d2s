import { setConstantData } from "../src/d2/constants";
import { IConstantData } from "../src/d2/types";
import { vanilla_constants_96 } from "../public/d2/vanilla_constants_96.bundle.js";
import { vanilla_constants_97 } from "../public/d2/vanilla_constants_97.bundle.js";
import { vanilla_constants_98 } from "../public/d2/vanilla_constants_98.bundle.js";
import { vanilla_constants_99 } from "../public/d2/vanilla_constants_99.bundle.js";

// runs before all tests.
// A list of existing versions can be found here: https://github.com/WalterCouto/D2CE/blob/main/d2s_File_Format.md#versions.
setConstantData("vanilla", 1, vanilla_constants_96 as IConstantData); // CSTM (LOD)
setConstantData("vanilla", 2, vanilla_constants_96 as IConstantData); // CSTM (LOD)
setConstantData("vanilla", 0x60, vanilla_constants_96 as IConstantData); //1.10-1.14d
setConstantData("vanilla", 0x61, vanilla_constants_97 as IConstantData); //alpha? (D2R)
setConstantData("vanilla", 0x62, vanilla_constants_98 as IConstantData); //2.4 (D2R)
setConstantData("vanilla", 0x63, vanilla_constants_99 as IConstantData); //2.5+ (D2R)
