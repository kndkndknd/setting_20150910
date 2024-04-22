import SocketIO from "socket.io";
import { cmdStateType } from "../types/global";
import { receiveEnter } from "../cmd/receiveEnter";
import { states } from "../states";

export const execScenario = async (
  scenario: { [key: string]: string },
  io: SocketIO.Server
) => {
  // 現在時刻を取得
  const now = new Date();
  for (let key in scenario) {
    console.log(key);
    console.log(scenario[key]);
    // keyの時刻の文字列をDate型に変換
    // const execTime = new Date(key);
    const execTimeArr = key.split(":");
    const execTime = new Date();
    execTime.setHours(Number(execTimeArr[0]));
    execTime.setMinutes(Number(execTimeArr[1]));
    if (execTimeArr.length === 3) {
      execTime.setSeconds(Number(execTimeArr[2]));
    }

    console.log("execTime", execTime);
    console.log(execTime.getTime());
    if (now.getTime() - execTime.getTime() < 0) {
      setTimeout(() => {
        console.log(scenario[key]);
        receiveEnter(scenario[key], "all", io, states);
      }, execTime.getTime() - now.getTime());
    }
  }
};
