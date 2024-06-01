import SocketIO from "socket.io";

import { cmdStateType } from "../types/global";
import { cmdList, streamList, parameterList } from "../states";
import { streamEmit } from "../stream/streamEmit";
import { cmdEmit } from "./cmdEmit";
import { stopEmit } from "./stopEmit";
import { splitSpace } from "./splitSpace/splitSpace";
import { splitPlus } from "./splitPlus";
import { sinewaveEmit } from "./sinewaveEmit";
import { sinewaveChange } from "./sinewaveChange";
import { parameterChange } from "./parameterChange";
import { voiceEmit } from "./voiceEmit";
import { chatPreparation } from "../stream/chatPreparation";
import { millisecondsPerBar, secondsPerEighthNote } from "./bpmCalc";
// import { putString } from "./putString";
import { recordEmit } from "../stream/recordEmit";
import { switchCtrl } from "../arduinoAccess/arduinoAccess";
import { stringEmit } from "../socket/ioEmit";
import { previousCmd } from "./previousCmd";
import { getLiveStream } from "../stream/getLiveStream";
import { loadScenario } from "../scenario/loadScenario";
import { execScenario } from "../scenario/execScenario";

export const receiveEnter = async (
  strings: string,
  id: string,
  io: SocketIO.Server,
  state: cmdStateType
) => {
  //VOICE
  // if (strings.includes("VOICE ")) {
  // voiceEmit(io, strings, id, state);
  // }

  /*
  if(strings === 'INSERT') {
    const result = postMongo()
  }
  */

  if (strings === "CHAT") {
    chatPreparation(io, state);
    voiceEmit(io, strings, id, state);
  } else if (strings === "RECORD" || strings === "REC") {
    recordEmit(io, state);
    voiceEmit(io, "RECORD", id, state);
    /*
    if (!state.current.RECORD) {
      state.current.RECORD = true;
      io.emit("recordReqFromServer", { target: "PLAYBACK", timeout: 10000 });
      if (state.cmd.VOICE.length > 0) {
        state.cmd.VOICE.forEach((element) => {
          //          io.to(element).emit('voiceFromServer', 'RECORD')
          io.to(element).emit("voiceFromServer", {
            text: "RECORD",
            lang: state.cmd.voiceLang,
          });
        });
      }
    } else {
      state.current.RECORD = false;
    }
    */
  } else if (strings.includes(" ") /*&& strings.split(" ").length < 4*/) {
    splitSpace(strings.split(" "), io, state, id);
  } else if (strings.includes("+")) {
    splitPlus(strings.split("+"), io, state);
  } else if (streamList.includes(strings)) {
    console.log("in stream");
    streamEmit(strings, io, state);
    voiceEmit(io, strings, id, state);
  } else if (Object.keys(cmdList).includes(strings)) {
    console.log("in cmd");
    voiceEmit(io, cmdList[strings], id, state);
    cmdEmit(cmdList[strings], io, state);
  } else if (Number.isFinite(Number(strings))) {
    console.log("sinewave");
    voiceEmit(io, strings + "Hz", id, state);
    sinewaveEmit(Number(strings), io, state);
  } else if (strings === "SINEWAVE") {
    const frequency = 20 + Math.random() * 19980;
    voiceEmit(io, frequency + "Hz", id, state);
    sinewaveEmit(frequency, io, state);
  } else if (strings === "STOP") {
    console.log("stop");
    voiceEmit(io, strings, id, state);
    stopEmit(io, state, id, "ALL");
  } else if (strings === "QUANTIZE") {
    if (
      Object.keys(state.stream.quantize).length >
      Object.keys(state.client).length / 2
    ) {
      for (let key in state.stream.quantize) {
        delete state.stream.quantize[key];
      }
      for (let key in state.bpm) {
        const bar = millisecondsPerBar(state.bpm[key]);
        io.emit("quantizeFromServer", {
          flag: false,
          bpm: state.bpm[key],
          bar: bar,
          beat: 1,
        });
      }
    } else {
      for (let key in state.client) {
        if (state.stream.quantize[key] === undefined) {
          // 1~7の整数をランダムで生成
          // state.stream.quantize[key] = Math.floor(Math.random() * 6) + 1;
          state.stream.quantize[key] = 4;
        }
      }
      // state.stream.quantize = !state.stream.quantize;
      console.log("state.bpm", state.bpm);
      for (let key in state.bpm) {
        const bar = millisecondsPerBar(state.bpm[key]);
        // const eighthNote = secondsPerEighthNote(state.bpm[key]);
        console.log("quantize bar", bar);
        io.to(key).emit("quantizeFromServer", {
          flag: true,
          bpm: state.bpm[key],
          bar: bar,
          beat: state.stream.quantize[key],
        });
      }
    }
  } else if (strings === "TWICE" || strings === "HALF") {
    sinewaveChange(strings, io, state);
  } else if (strings === "PREVIOUS" || strings === "PREV") {
    voiceEmit(io, "PREVIOUS", id, state);
    previousCmd(io, state);
  } else if (Object.keys(parameterList).includes(strings)) {
    parameterChange(parameterList[strings], io, state, { source: id });
  } else if (strings === "NO" || strings === "NUMBER") {
    Object.keys(state.client).forEach((id, index) => {
      console.log(id);
      io.to(id).emit("stringsFromServer", {
        strings: String(index),
        timeout: true,
      });
      //putString(io, String(index), state)
    });
    // 20230923 sinewave Clientの表示
    state.sinewaveClient.forEach((id, index) => {
      console.log(id);
      io.to(id).emit("stringsFromServer", {
        strings: String(index) + "(sinewave)",
        timeout: true,
      });
      //putString(io, String(index), state)
    });
  } else if (strings === "SWITCH") {
    const switchState = state.arduino.relay === "on" ? "OFF" : "ON";
    console.log(switchState);
    io.emit("stringsFromServer", {
      strings: "SWITCH " + switchState,
      timeout: true,
    });
    switchCtrl().then((result) => {
      console.log(result);
    });
  } else if (strings === "CLOCK") {
    /*
    state.clockMode = !state.clockMode;
    console.log(state.clockMode);
    io.to(id).emit("clockModeFromServer", { clockMode: state.clockMode });
    */
    io.emit("clockFromServer", {
      clock: true,
      // 暫定
      barLatency: state.stream.latency.CHAT * 4,
    });
  } else if (strings === "FUSEJI" || strings === "EMOJI") {
    state.emoji = !state.emoji;
    io.emit("emojiFromServer", {
      state: state.emoji,
      text: "Emoji " + state.emoji,
    });
    // stringEmit(io, "EMOJI " + state.emoji, true);

    /*
  } else if (strings === "LIVESTREAM" || strings === "SOMEWHERE") {
    //仮
    const liveStreamUrl = "https://www.showroom-live.com/r/officialJKT48";
    getLiveBuffer(liveStreamUrl).then((buffer) => {
      try {
        // 仮
        console.log("emitBuffer", buffer);
        io.emit("bufferFromServer", buffer);
      } catch (err) {
        console.error(err);
      }
    });
*/
  } else if (strings === "START" || strings === "SCENARIO") {
    const scenario = await loadScenario();
    await execScenario(scenario, io);
    //   const result = await getLiveStream("TWITCH");
    //   console.log("get livestream as ", strings, result);
    //   if (result) {
    //     stringEmit(io, "GET TWITCH: SUCCESS");
    //   } else {
    //     stringEmit(io, "GET TWITCH: FAILED");
    //   }
    // } else if (strings === "HLS") {
    //   const cmd: {
    //     cmd: string;
    //     property: string;
    //     value: number;
    //     flag: boolean;
    //     target?: string;
    //     overlay?: boolean;
    //     fade?: number;
    //     portament?: number;
    //     gain?: number;
    //     solo?: boolean;
    //   } = {
    //     cmd: "HLS",
    //     property: "OGAWA",
    //     value: 0,
    //     flag: true,
    //   };
    //   io.emit("cmdFromServer", cmd);
  } else if (id === "scenario") {
    console.log("scenario", strings);
    if (state.cmd.VOICE.length > 0) {
      console.log("voiceEmit scenario");
      voiceEmit(io, strings, "scenario", state);
    }
    stringEmit(io, strings, false);
  } else if (strings === "SOLFEGGIO") {
    const solfeggioArr = [285, 396, 417, 528, 639, 741, 852, 963];
    const frequency =
      solfeggioArr[Math.floor(Math.random() * solfeggioArr.length)];
    sinewaveEmit(frequency, io, state);
  } else {
    voiceEmit(io, strings, id, state);
  }

  if (strings !== "STOP") {
    state.previous.text = strings;
  }
};
