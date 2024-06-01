import SocketIO from "socket.io";
import { cmdStateType, buffStateType } from "../types/global";
import { chats, streams, states } from "../states";
import { glitchStream } from "./glitchStream";
import { pushStateStream } from "./pushStateStream";
// import { pickupTarget } from "../route";
import { pickupStreamTarget } from "./pickupStreamTarget";
import { switchCramp } from "../arduinoAccess/arduinoAccess";
import { sampleRateRandomize } from "./sampleRateRandomize";
import { stat } from "fs";

export const chatReceive = async (
  io: SocketIO.Server,
  buffer?: buffStateType
  // from: string
) => {
  console.log("buffer.keys:", Object.keys(buffer));
  // console.log("buffer.target:", buffer.target);
  // console.log("buffer.from:", buffer.from);
  if (buffer !== undefined) {
    switch (buffer.source) {
      case "CHAT":
        chats.push(buffer);
        if (buffer.from !== undefined) {
          chatEmit(io, buffer.from);
        } else {
          chatEmit(io);
        }
        break;
      case "PLAYBACK": //RECORDコマンドからのチャンク受信
        streams.PLAYBACK.audio.push(buffer.audio);
        streams.PLAYBACK.video.push(buffer.video);
        streams.PLAYBACK.bufferSize = buffer.bufferSize;
        // streams.PLAYBACK.push(buffer);
        // console.log("PLAYBACK.length:" + String(streams.PLAYBACK.length));
        break;
      case "TIMELAPSE":
        streams.TIMELAPSE.audio.push(buffer.audio);
        streams.TIMELAPSE.video.push(buffer.video);
        streams.TIMELAPSE.bufferSize = buffer.bufferSize;
        // console.log(buffer.audio)
        console.log(
          "TIMELAPSE.length:" + String(streams.TIMELAPSE.audio.length)
        );
        break;
      /*
      case "SHOT":
        if (streams["SHOT"] === undefined || streams["SHOT"] === null) {
          streams["SHOT"] = { audio: [], video: [], bufferSize: basisBufferSize };
        }
  
        streams["SHOT"].audio.push(buffer.audio);
        streams["SHOT"].video.push(buffer.video);
        console.log("SHOT.length:" + String(streams["SHOT"].audio.length));
        break;
        */
      default:
        // 存在しないターゲットの場合は、新規作成
        if (
          streams[buffer.source] === undefined ||
          streams[buffer.source] === null
        ) {
          streams[buffer.source] = {
            audio: [],
            video: [],
            bufferSize: states.stream.basisBufferSize,
            index: 0,
          };
        }
        streams[buffer.source].audio.push(buffer.audio);
        streams[buffer.source].video.push(buffer.video);
        pushStateStream(buffer.source, states);
    }
  } else {
    chatEmit(io);
  }
};

export const chatEmit = async (io, from?) => {
  if (states.current.stream.CHAT) {
    // console.log(states.client);
    // console.log(io.sockets.adapter.rooms);
    // console.log(io.sockets.adapter.rooms.size);
    // console.log(io.sockets.adapter.rooms.get(buffer.from));
    const targetId =
      from !== undefined
        ? pickupStreamTarget(states, "CHAT", from)
        : pickupStreamTarget(states, "CHAT");
    // const targetId =
    //   states.client[Math.floor(Math.random() * states.client.length)];
    console.log("chatReceive targetId: ", targetId);
    // if (targetId !== "arduino") {
    if (chats.length > 0) {
      const chunk = {
        sampleRate: states.stream.sampleRate.CHAT,
        glitch: states.stream.glitch.CHAT,
        ...chats.shift(),
      };
      if (states.stream.randomrate.CHAT) {
        if (states.stream.randomratenote.CHAT) {
          chunk.sampleRate = 11025 + Math.floor(Math.random() * 10) * 11025;
        } else {
          chunk.sampleRate =
            states.stream.randomraterange.CHAT.min +
            Math.floor(
              Math.random() *
                (states.stream.randomraterange.CHAT.max -
                  states.stream.randomraterange.CHAT.min)
            );
        }
        // chunk.sampleRate = sampleRateRandomize("CHAT");
        //          console.log(chunk.sampleRate)
      }
      if (states.stream.glitch.CHAT && chunk.video) {
        chunk.video = await glitchStream(chunk.video);
        console.log("glitch", chunk.video.slice(0, 50));
      }
      if (!states.stream.grid.CHAT) {
        // io.to(targetId).emit("chatFromServer", chunk);
        ioEmitChatFromServer(io, chunk, targetId);
      } else {
        const timeOutVal = Object.keys(states.cmd.METRONOME).includes(targetId)
          ? (Math.round(Math.random() * 16) * states.cmd.METRONOME[targetId]) /
            4
          : (Math.round(Math.random() * 16) * states.stream.latency.CHAT) / 4;

        // const timeOutVal =
        //   (Math.round(Math.random() * 16) * states.stream.latency.CHAT) / 4;
        setTimeout(() => {
          // io.to(targetId).emit("chatFromServer", chunk);
          ioEmitChatFromServer(io, chunk, targetId);
        }, timeOutVal);
      }
    } else {
      io.to(targetId).emit("chatReqFromServer");
    }
    // } else {
    //   if (!states.stream.grid.CHAT) {
    //     const crampResult = await switchCramp("CHAT");
    //     if (crampResult) {
    //       await chatEmit(io);
    //     } else {
    //       setTimeout(() => {
    //         chatEmit(io);
    //       }, 500);
    //     }
    //   } else {
    //     const timeOutVal =
    //       (Math.round(Math.random() * 16) * states.stream.latency.CHAT) / 4;
    //     setTimeout(async () => {
    //       const crampResult = await switchCramp("CHAT");
    //       if (crampResult) {
    //         await chatEmit(io);
    //       } else {
    //         setTimeout(() => {
    //           chatEmit(io);
    //         }, 500);
    //       }
    //     }, timeOutVal);
    //   }
    // }
  } else {
    io.emit("erasePrintFromServer");
  }
};

const ioEmitChatFromServer = async (io, chunk, targetId) => {
  console.log("targetId", targetId);
  console.log("machine", states.client[targetId]);
  if (
    states.client[targetId] !== undefined &&
    states.client[targetId].urlPathName.includes("pi") &&
    states.arduino.connected
  ) {
    const result = await switchCramp("CHAT");
    console.log("switchCramp", result);
  }
  io.to(targetId).emit("chatFromServer", chunk);
};
