import { states } from "../states";

export const connectFromClient = (data, socket, io) => {
  let sockId = String(socket.id);
  const ipAddress = socket.handshake.address;
  console.log("ipAddress: " + ipAddress);
  console.log("urlPathName", data.urlPathName);
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
          urlPathName: data.urlPathName,
          projection: true,
          floatingPosition: {
            top: 0,
            left: 0,
            width: data.width,
            height: data.height,
          },
        };
      } else {
        const floatingPosition = {top: 0, left: 0, width: data.width, height: data.height,};
        
        states.client[sockId] = {
          ipAddress,
          urlPathName: data.urlPathName,
          projection: false,
          floatingPosition,
        });
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
  }
};
