import { Server, Socket } from "socket.io";
import * as Http from "http";

// import { statusList, pathList, statusClient } from "../statusList";
import { chatReceive } from "../stream/chatReceive";

import { buffStateType } from "../../../types/global";

// import {
//   selectOtherClient,
//   roomEmit,
//   pickupTarget,
//   pickCmdTarget,
//   cmdSelect,
// } from "../route";
// import { cmdEmit } from "../cmd/cmdEmit";
import { charProcess } from "../cmd/charProcess";
// import { stopEmit } from "../cmd/stopEmit";
// import { sinewaveEmit } from "../cmd/sinewaveEmit";
import { streamEmit } from "../stream/streamEmit";
import { states, chat_web } from "../states";
import { stringEmit } from "./ioEmit";
// import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { enterFromForm } from "../cmd/form/enterFromForm";
import { stopEmit } from "../cmd/stopEmit";
import { connectFromClient } from "../clientSetting/connectFromClient";

// websocket
import { sendCharWebSocket } from "../webSocket/sendChar";

let strings = "";
const previousFace = { x: 0, y: 0 };

export const ioServer = (
  httpserver: Http.Server<
    typeof Http.IncomingMessage,
    typeof Http.ServerResponse
  >
) => {
  const io = new Server(httpserver, {
    path: "/socket.io",
  });

  io.sockets.on("connection", (socket) => {
    socket.on("connectFromClient", (data) => {
      const result = connectFromClient(data, socket, io);

      if (result) {
        socket.emit("debugFromServer");
      } else {
        console.log("connectFromClient failed");
      }
    });
    socket.on("charFromClient", (character) => {
      console.log("socket.id: " + String(socket.id));
      console.log("client: " + states.client);
      strings = charProcess(character, strings, socket.id, io, states);
      // sendCharWebSocket(character);
    });

    socket.on("chatFromClient", (buffer: buffStateType) => {
      console.log("debug chatFromClient", states.current.stream);
      // console.log("socket.id: " + String(socket.id));
      if (buffer.from === undefined) buffer.from = String(socket.id);
      chatReceive(io, buffer);
    });

    socket.on("streamReqFromClient", (source: string) => {
      console.log(source);
      if (states.current.stream[source]) {
        // if (states.stream.target[source].length > 0) {
        //   console.log(`target stream: ${source}`);
        //   targetStreamEmit(source, io, states, states.stream.target[source][0]);
        // } else {
        // console.log("socket.id: " + String(socket.id) + ", source: " + source);
        streamEmit(source, io, states, String(socket.id));
        // }
      }
    });

    socket.on("connectFromCtrl", () => {
      io.emit("gainFromServer", states.cmd.GAIN);
    });

    socket.on("gainFromCtrl", (gain: { target: string; val: number }) => {
      console.log(gain);
      states.cmd.GAIN[gain.target] = gain.val;
      io.emit("gainFromServer", states.cmd.GAIN);
    });

    socket.on("stringFromForm", (strings: string) => {
      stringEmit(io, strings, false);
    });

    socket.on("enterFromForm", (strings: string) => {
      const formResult = enterFromForm(strings, io);
      console.log("enterFromForm", formResult);
    });

    socket.on("escapeFromForm", () => {
      stopEmit(io, states, "form", "ExceptHls");
    });

    socket.on("disconnect", () => {
      console.log("disconnect:", String(socket.id));
      let sockId = String(socket.id);
      if (states.client[sockId]) delete states.client[sockId];
      // states.client = states.client.filter((id) => {
      //   if (io.sockets.adapter.rooms.has(id) && id !== sockId) {
      //     console.log(id);
      //     return id;
      //   }
      // });
      if (states.streamClient.includes(sockId)) {
        states.streamClient = states.streamClient.filter((element) => {
          return element !== sockId;
        });
      }
      if (states.cmdClient.includes(sockId)) {
        states.cmdClient = states.cmdClient.filter((element) => {
          return element !== sockId;
        });
      }
      if (Object.keys(states.bpm).includes(sockId)) {
        delete states.bpm[sockId];
      }

      console.log("clients:", states.client);
      console.log("streamClient:", states.streamClient);
      console.log("cmdClient:", states.cmdClient);
      console.log("bpm", states.bpm);
      // io.emit("statusFromServer", statusList);
    });
  });
  return io;
};
