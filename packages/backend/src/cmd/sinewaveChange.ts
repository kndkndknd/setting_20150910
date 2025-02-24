import SocketIO from "socket.io";

import { cmdStateType } from "../../../types/global";
import { putCmd } from "./putCmd";

export const sinewaveChange = (
  cmdStrings: string,
  io: SocketIO.Server,
  state: cmdStateType,
  value?: number
) => {
  if (cmdStrings === "TWICE") {
    for (let id in state.current.sinewave) {
      state.previous.sinewave[id] = state.current.sinewave[id];
      state.current.sinewave[id] = state.current.sinewave[id] * 2;
      const cmd: {
        cmd: string;
        value: number;
        flag: boolean;
        fade: number;
        portament: number;
        gain: number;
      } = {
        cmd: "SINEWAVE",
        value: state.current.sinewave[id],
        flag: true,
        fade: 0,
        portament: state.cmd.PORTAMENT,
        gain: state.cmd.GAIN.SINEWAVE,
      };
      putCmd(io, [id], cmd, state);
      // io.to(id).emit('cmdFromServer', cmd)
    }
  } else if (cmdStrings === "HALF") {
    for (let id in state.current.sinewave) {
      state.previous.sinewave[id] = state.current.sinewave[id];
      state.current.sinewave[id] = state.current.sinewave[id] / 2;
      const cmd: {
        cmd: string;
        value: number;
        flag: boolean;
        fade: number;
        portament: number;
        gain: number;
      } = {
        cmd: "SINEWAVE",
        value: state.current.sinewave[id],
        flag: true,
        fade: 0,
        portament: state.cmd.PORTAMENT,
        gain: state.cmd.GAIN.SINEWAVE,
      };
      //io.to(id).emit('cmdFromServer', cmd)
      putCmd(io, [id], cmd, state);
    }
  }
};
