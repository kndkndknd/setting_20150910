// import {cmdStateType} from '../../types/global'
import { states } from "../../states";
import { receiveEnter } from "../receiveEnter";
import SocketIO from "socket.io";
import { playHLS } from "../../stream/hls/playHls";

export const enterFromForm = (string: string, io: SocketIO.Server) => {
  const cmdArr = Object.keys(states.form.cmd).filter((key) => {
    return string.includes(key);
  });

  const hlsArr = Object.keys(states.form.hls).filter((key) => {
    return string.includes(key);
  });

  console.log("cmdArr", cmdArr);
  console.log("hlsArr", hlsArr);
  if (cmdArr.length > 0) {
    cmdArr.forEach((cmd) => {
      receiveEnter(states.form.cmd[cmd], "form", io, states);
    });
    if (hlsArr.length > 0) {
      hlsArr.forEach((hls) => {
        playHLS(states.form.hls[hls], io);
      });
    }
  } else {
    if (hlsArr.length > 0) {
      hlsArr.forEach((hls) => {
        playHLS(states.form.hls[hls], io);
      });
    } else {
      return false;
    }
  }

  return true;
};
