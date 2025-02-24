import { states } from "../states";
import { floatingPosition } from "./floatingPosition";

export const connectFromClient = (data, socket, io) => {
  let sockId = String(socket.id);
  const ipAddress = socket.handshake.address.split(":")[3];
  console.log("ipAddress: " + ipAddress);
  console.log("urlPathName", data.urlPathName);
  if (data.urlPathName.includes("pi")) {
    console.log("aruidino host is " + ipAddress);
    states.arduino.host = ipAddress;
  }
  if (data.clientMode === "client") {
    if (!states.stream.timelapse) states.stream.timelapse = true;
    console.log(
      'socket.on("connectFromClient", (data) => {data:' +
        data +
        ", id:" +
        sockId +
        "}"
    );
    if (!Object.keys(states.client).includes(sockId))
      if (data.urlPathName.includes("project")) {
        states.client[sockId] = {
          ipAddress,
          stream: true,
          urlPathName: data.urlPathName,
          projection: true,
          position: {
            top: 0,
            left: 0,
            width: data.width,
            height: data.height,
          },
        };
      } else {
        // const floatingPosition = {
        //   top: 0,
        //   left: 0,
        //   width: data.width,
        //   height: data.height,
        // };
        const position = floatingPosition(sockId);

        states.client[sockId] = {
          ipAddress,
          stream: true,
          urlPathName: data.urlPathName,
          projection: false,
          position,
        };
      }
    if (!data.urlPathName.includes("exc")) {
      if (!Object.keys(states.cmdClient).includes(sockId)) {
        states.cmdClient.push(sockId);
      }
      if (!Object.keys(states.streamClient).includes(sockId)) {
        states.streamClient.push(sockId);
      }
    }

    if (!Object.keys(states.bpm).includes(sockId)) {
      states.bpm[sockId] = 60;
    }

    // METRONOMEは接続時に初期値を作る
    states.cmd.METRONOME[sockId] = 1000;

    // QUANTIZE
    states.stream.quantize.flag.client[sockId] = false;
    for (let key in states.stream.quantize.bpm) {
      states.stream.quantize.bpm[key][sockId] = 60;
    }
    for (let key in states.stream.quantize.beat) {
      states.stream.quantize.beat[key][sockId] = 0;
    }

    console.log(states.client);
    return true;
    // } else if (data.clientMode === "sinewaveClient") {
    //   console.log(sockId + " is sinewaveClient");
    //   if (!states.sinewaveClient.includes(sockId))
    //     states.sinewaveClient.push(sockId);
    //   states.sinewaveClient = states.sinewaveClient.filter((id) => {
    //     //console.log(io.sockets.adapter.rooms.has(id))
    //     if (io.sockets.adapter.rooms.has(id)) {
    //       return id;
    //     }
    //   });
  } else if (data.clientMode === "noStream") {
    // METRONOMEは接続時に初期値を作る
    states.cmd.METRONOME[sockId] = 1000;
    console.log(sockId + " is noStream Client");
    const position = floatingPosition(sockId);

    states.client[sockId] = {
      ipAddress,
      stream: false,
      urlPathName: data.urlPathName,
      projection: false,
      position,
    };
    return true;
  }
};
