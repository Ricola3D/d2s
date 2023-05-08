import * as types from "./types";

const versionedConstants = {
  vanilla: {},
  remodded: {},
};

function getConstantData(mod: string, version: number): types.IConstantData {
  if (!(mod in versionedConstants)) {
    throw new Error(`No constant data found for this mod ${mod}. Supported mods are: ${Object.keys(versionedConstants).join(", ")}`);
  }
  if (!(version.toString() in versionedConstants[mod])) {
    throw new Error(
      `No constant data found for version ${version} of mod ${mod}. Supported versions are: ${Object.keys(versionedConstants[mod]).join(
        ", "
      )}`
    );
  }
  const constants = versionedConstants[mod][version.toString()];

  return constants;
}

function setConstantData(mod: string, version: number, data: types.IConstantData): void {
  versionedConstants[mod][version.toString()] = data;
}

export { getConstantData, setConstantData };
