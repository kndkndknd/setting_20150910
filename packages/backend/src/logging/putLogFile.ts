import * as path from "path";
import * as fs from "fs";

import { cmdLog } from "../states";
import { getDateTimeString } from "../util/getDateTimeString";

export const putLogFile = () => {
  const { yyyy, mm, dd, hh, mi, ss } = getDateTimeString();
  const logPath = path.join(__dirname, `${yyyy}${mm}${dd}${hh}${mi}${ss}.json`);
  const result = fs.appendFile(logPath, JSON.stringify(cmdLog), (err) => {
    if (err) {
      console.error(err);
      return false;
    } else {
      return true;
    }
  });
  return result;
};
