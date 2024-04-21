import * as fs from "fs";
import * as path from "path";

const filePath = path.join(
  __dirname,
  "../../../../..",
  "chat_scenario",
  "scenario.json"
);

export const loadScenario = async () /*: { [key: string]: string }*/ => {
  // const scenario: { [key: string]: string } = {};
  try {
    const scenario = await JSON.parse(fs.readFileSync(filePath).toString());
    return scenario;
  } catch (e) {
    console.log(e);
    return { error: String(e) };
  }
};
