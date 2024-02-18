import SocketIO from "socket.io";
import { cmdStateType } from "../types/global.js";
import { cmdEmit } from "./cmdEmit.js";
import { streamEmit } from "../stream/streamEmit.js";
import { sinewaveEmit } from "./sinewaveEmit.js";
import { chatPreparation } from "../stream/chatPreparation.js";

export const previousCmd = (io: SocketIO.Server, state: cmdStateType) => {
  console.log(state.previous.sinewave);
  console.log(state.previous.cmd);
  for (let cmd in state.previous.cmd) {
    state.previous.cmd[cmd].forEach((target) => {
      cmdEmit(cmd, io, state, target);
    });
  }
  for (let stream in state.previous.stream) {
    if (state.previous.stream[stream]) {
      if (stream === "CHAT") {
        console.log("chat previous");
        chatPreparation(io, state);
      } else {
        streamEmit(stream, io, state);
      }
    }
  }
  for (let target in state.previous.sinewave) {
    console.log(state.previous.sinewave[target]);
    sinewaveEmit(state.previous.sinewave[target], io, state, target);
  }
};
