import SocketIO from "socket.io";
import { cmdStateType } from "../types/global";

export const voiceEmit = (
  io: SocketIO.Server,
  strings: string,
  id: string,
  state: cmdStateType
) => {
  console.log("id", id);
  if (state.cmd.VOICE.length > 0) {
    state.cmd.VOICE.forEach((element) => {
      if (element === id || id === "all" || id === "ALL") {
        io.to(element).emit("voiceFromServer", {
          text: strings,
          lang: state.cmd.voiceLang,
        });
      } else {
        console.log("not voice id");
      }
    });
  }
};
