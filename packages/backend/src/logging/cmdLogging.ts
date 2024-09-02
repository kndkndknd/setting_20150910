import { cmdLog } from "../states";

export const cmdLogging = (strings: string) => {
  const now = new Date();
  const date = now.toLocaleDateString();
  cmdLog.push({ date: date, cmd: strings });
  console.log("cmdLog", cmdLog);
};
