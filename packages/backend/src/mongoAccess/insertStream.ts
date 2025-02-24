import SocketIO from "socket.io";
import dotenv from "dotenv";

import { cmdList, streamList, parameterList, states, streams } from "../states";
// import { putString } from "../cmd/putString";
// import { buffStateType } from "../../../types/global";
import { stringEmit } from "../socket/ioEmit";
dotenv.config();

const ipaddress = process.env.DB_HOST;

export const insertStream = async (
  type: string,
  io: SocketIO.Server,
  place: string,
  date: string
) => {
  try {
    console.log(ipaddress);

    // if (type === "PLAYBACK") {
    //   await streams[type].forEach(async (stream: buffStateType) => {
    //     await setTimeout(async () => {
    //       const audio = btoa(
    //         String.fromCharCode(...new Uint8Array(stream.audio))
    //       );
    //       // if (place !== undefined && date !== undefined) {
    //       await postStream(type, stream.video, audio, place, date);
    //       // } else {
    //       //   await postStream(type, stream.video, audio, io);
    //       // }
    //     }, 1000);
    //   });
    //   await io.emit("stringsFromServer", {
    //     strings: "INSERT DONE",
    //     timeout: true,
    //   });
    // } else {
    streams[type].audio.forEach(async (audio: Float32Array, index) => {
      await setTimeout(async () => {
        const video = streams[type].video[index];
        const audioStr = btoa(String.fromCharCode(...new Uint8Array(audio)));
        // if (place !== undefined && date !== undefined) {
        await postStream(type, video, audioStr, place, date);
        // } else {
        // await postStream(type, video, audioStr, io);
        // }
      }, 1000);
    });

    stringEmit(io, "INSERT DONE", true);
    // await io.emit("stringsFromServer", {
    //   strings: "INSERT DONE",
    //   timeout: true,
    // });
    // }
  } catch (error) {
    console.log(error);
    stringEmit(io, "INSERT ERROR", true);
  }
};

const postStream = async (
  type: string,
  video: string,
  audio: string,
  // io: SocketIO.Server,
  place: string,
  date: string
) => {
  const body = {
    type: type,
    video: video,
    audio: audio,
    location: place,
    name: date,
  };
  // if (place !== undefined && date !== undefined) {
  // body["location"] = place;
  // body["name"] = date;
  // }
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await fetch("http://" + ipaddress + ":3030/insert", options);
    if (res.body != null) {
      const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log(value);
          return;
        }
        // console.log(value);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
