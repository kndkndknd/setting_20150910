import SocketIO from "socket.io";
import { cmdStateType } from "../../../types/global";
import { switchOneshot } from "../arduinoAccess/arduinoAccess";
import { time } from "console";

export const putCmd = (
  io: SocketIO.Server,
  idArr: Array<string>,
  cmd: {
    cmd: string;
    value?: number;
    flag?: boolean;
    fade?: number;
    portament?: number;
    gain?: number;
  },
  state: cmdStateType
) => {
  idArr.forEach((id) => {
    io.to(id).emit("cmdFromServer", cmd);
    console.log(id);
    if (
      state.client[id] !== undefined &&
      state.client[id].urlPathName.includes("pi") &&
      state.arduino.connected
    ) {
      let timeout = cmd.cmd === "CLICK" || cmd.cmd === "STOP" ? 100 : 500;
      const result = switchOneshot(timeout);
      console.log("putCmd: switchOneshot", result);
    }
  });
  /*
  if(state.cmd.VOICE.length > 0) {
    state.cmd.VOICE.forEach((element) => {
      io.to(element).emit('voiceFromServer', cmd.cmd)
    })
  }
  */
};
