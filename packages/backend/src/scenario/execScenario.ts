import SocketIO from "socket.io";
import { cmdStateType } from "../../../types/global";
import { receiveEnter } from "../cmd/receiveEnter";
import { states } from "../states";

export const execScenario = async (
  scenario: {
    format: "relative" | "absolute";
    timetable: { [key: string]: string };
  },
  io: SocketIO.Server
) => {
  const now = new Date();
  console.log("now", now.getTime());
  if (scenario.format === "relative") {
    const timetableArr = Object.keys(scenario.timetable).map((key) => {
      const execTimeArr = key.split(":");
      const time =
        execTimeArr.length === 3
          ? Number(execTimeArr[0]) * 60 * 60 * 1000 +
            Number(execTimeArr[1]) * 60 * 1000 +
            Number(execTimeArr[2]) * 1000
          : Number(execTimeArr[0]) * 60 * 60 * 1000 +
            Number(execTimeArr[1]) * 60 * 1000;
      return { time: time, cmd: scenario.timetable[key] };
    });
    /*
    timetableArr.forEach((item) => {
      setTimeout(() => {
        console.log("scenario", item.time, item.cmd);
        receiveEnter(item.cmd, "all", io, states);
      }, item.time);
    });
    */
    for (let i = 0; i < timetableArr.length; i++) {
      setTimeout(() => {
        console.log("scenario", timetableArr[i].time, timetableArr[i].cmd);
        receiveEnter(timetableArr[i].cmd, "scenario", io, states);
      }, timetableArr[i].time);
    }
  } else if (scenario.format === "absolute") {
    for (let key in scenario.timetable) {
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
  }
  // 現在時刻を取得
};
