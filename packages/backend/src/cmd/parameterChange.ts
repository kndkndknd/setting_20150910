import SocketIO from "socket.io";

import { cmdStateType } from "../../../types/global";
// import { putString } from './putString'
import { cmdList, streamList, parameterList, states, streams } from "../states";
import { putCmd } from "./putCmd";
import { stringEmit } from "../socket/ioEmit";
import { notTargetEmit } from "./notTargetEmit";
import { millisecondsPerBar } from "./bpmCalc";

export const parameterChange = (
  param: string,
  io: SocketIO.Server,
  state: cmdStateType,
  arg?: { source?: string; value?: number; property?: string }
) => {
  switch (param) {
    case "PORTAMENT":
      if (arg && arg.value && isFinite(Number(arg.value))) {
        state.cmd.PORTAMENT = arg.value;
      } else {
        if (state.cmd.PORTAMENT > 0) {
          state.cmd.PORTAMENT = 0;
        } else {
          state.cmd.PORTAMENT = 5;
        }
      }
      // io.emit('stringsFromServer',{strings: 'PORTAMENT: ' + String(state.cmd.PORTAMENT) + 'sec', timeout: true})
      stringEmit(io, "PORTAMENT: " + String(state.cmd.PORTAMENT) + "sec");
      break;
    case "SAMPLERATE":
      let sampleRate = 44100;
      if (arg && isFinite(Number(arg.value))) {
        sampleRate = arg.value;
      } else {
        const sampleArr = Object.values(state.stream.sampleRate);
        const sum = sampleArr.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        });
        const average = sum / sampleArr.length;
        if (average < 11025 || average >= 88200) {
          sampleRate = 11025;
        } else if (average < 22050) {
          sampleRate = 22050;
        } else if (average < 44100) {
          sampleRate = 44100;
        } else {
          sampleRate = 88200;
        }
      }
      if (arg && arg.property) {
        // console.log("hit source");
        state.stream.sampleRate[arg.property] = sampleRate;
        // io.emit('stringsFromServer',{strings: 'SampleRate: ' + String(state.stream.sampleRate[arg.source]) + 'Hz', timeout: true})
        stringEmit(
          io,
          "SampleRate: " + String(state.stream.sampleRate[arg.property]) + "Hz"
          // state
        );
      } else {
        console.log(arg);
        for (let target in state.stream.sampleRate) {
          state.stream.sampleRate[target] = sampleRate;
        }
        // io.emit('stringsFromServer',{strings: 'SampleRate: ' + String(state.stream.sampleRate.CHAT) + 'Hz', timeout: true})
        stringEmit(
          io,
          "SampleRate: " + String(state.stream.sampleRate.CHAT) + "Hz"
          // state
        );
      }
      break;
    case "GLITCH":
      if (arg && arg.property) {
        state.stream.glitch[arg.property] = !state.stream.glitch[arg.property];
        // io.emit('stringsFromServer',{strings: 'GLITCH: ' + String(state.stream.glitch[arg.source]), timeout: true})
        // console.log(arg.property, state.stream.glitch);
        // console.log(
        //   `GLITCH ${arg.property}: ${state.stream.glitch[arg.property]}`
        // );
        stringEmit(
          io,
          `GLITCH ${arg.property}: ${state.stream.glitch[arg.property]}`,
          true
          // state
        );
      } else {
        let flag = false;
        if (Object.values(states.stream.glitch).includes(false)) {
          flag = true;
        }
        for (let target in state.stream.glitch) {
          state.stream.glitch[target] = flag;
        }
        // io.emit('stringsFromServer',{strings: 'GLITCH: ' + String(state.stream.glitch.CHAT), timeout: true})
        stringEmit(io, "GLITCH: " + String(state.stream.glitch.CHAT), true);
      }
      break;
    case "GRID":
      if (arg && arg.property) {
        state.stream.grid[arg.property] = !state.stream.grid[arg.property];
        // io.emit('stringsFromServer',{strings: 'GRID: ' + String(state.stream.grid[arg.property]) + '(' + arg.property + ')', timeout: true})
        stringEmit(
          io,
          "GRID: " +
            String(state.stream.grid[arg.property]) +
            "(" +
            arg.property +
            ")"
          // state
        );
      } else {
        let flag = false;
        if (Object.values(states.stream.grid).includes(false)) {
          flag = true;
        }
        for (let target in state.stream.grid) {
          state.stream.grid[target] = flag;
        }
        // io.emit('stringsFromServer',{strings: 'GRID: ' + String(state.stream.grid.CHAT), timeout: true})
        stringEmit(io, "GRID: " + String(state.stream.grid.CHAT));
      }
      break;
    case "BPM":
      if (arg && arg.value) {
        const latency = (60 * 1000) / arg.value;
        const bar = millisecondsPerBar(arg.value);

        if (arg.property) {
          // propertyがSTREAMを指定している場合
          if (Object.keys(state.stream.latency).includes(arg.property)) {
            state.stream.latency[arg.property] = latency;
            // state.cmd.METRONOME = {};
            stringEmit(
              io,
              "BPM: " + String(arg.value) + "(" + arg.property + ")"
              // state
            );
            // propertyが端末番号を指定している場合
          } else if (/^([1-9]\d*|0)(\.\d+)?$/.test(arg.property)) {
            const target = Object.keys(state.client)[Number(arg.property)];
            if (Object.keys(state.cmd.METRONOME).includes(target)) {
              state.cmd.METRONOME[target] = latency;
              state.bpm[target] = arg.value;
              stringEmit(
                io,
                "BPM: " + String(arg.value) + "(client " + arg.property + ")"
                // state
              );
            }
            if (state.current.cmd.METRONOME.includes(target)) {
              const cmd: {
                cmd: string;
                property?: string;
                value?: number;
                flag?: boolean;
                fade?: number;
                gain?: number;
              } = {
                cmd: "METRONOME",
                flag: true,
                gain: state.cmd.GAIN.METRONOME,
                value: latency,
              };
              putCmd(io, [target], cmd, state);
              io.to(target).emit("bpmFromServer", {
                bpm: arg.value,
                bar: bar,
              });
            }
          }
          // io.emit('stringsFromServer',{strings: 'BPM: ' + String(arg.value)  + '(' + arg.property + ')', timeout: true})
        } else {
          for (let target in state.stream.latency) {
            state.stream.latency[target] = latency;
          }
          for (let target in state.cmd.METRONOME) {
            state.cmd.METRONOME[target] = latency;
          }
          for (let target in state.bpm) {
            state.bpm[target] = arg.value;
          }
          if (state.current.cmd.METRONOME.length > 0) {
            state.current.cmd.METRONOME.forEach((target) => {
              const cmd: {
                cmd: string;
                property?: string;
                value?: number;
                flag?: boolean;
                fade?: number;
                gain?: number;
              } = {
                cmd: "METRONOME",
                flag: true,
                gain: state.cmd.GAIN.METRONOME,
                value: latency,
              };
              putCmd(io, [target], cmd, state);
            });
          }
          stringEmit(io, "BPM: " + String(arg.value));
          io.emit("bpmFromServer", {
            bpm: arg.value,
            bar: bar,
          });
          // io.emit('stringsFromServer',{strings: 'BPM: ' + String(arg.value), timeout: true})
        }
      }
      break;
    case "RANDOM":
      // if (arg && arg.source) {
      //   state.stream.random[arg.source] = !state.stream.random[arg.source];
      //   // io.emit('stringsFromServer',{strings: 'RANDOM: ' + String(state.stream.random[arg.source]), timeout: true})
      //   stringEmit(
      //     io,
      //     "RANDOM: " + String(state.stream.random[arg.source])
      //     // state
      //   );
      // } else {
      let flag = false;
      console.log(Object.values(states.stream.random));
      if (Object.values(states.stream.random).includes(false)) {
        flag = true;
      }
      for (let target in state.stream.random) {
        console.log(target, flag);
        state.stream.random[target] = flag;
      }
      //io.emit('stringsFromServer',{strings: 'RANDOM: ' + String(state.stream.random.CHAT), timeout: true})
      stringEmit(io, "RANDOM: " + String(state.stream.random.CHAT));
      // }
      console.log(state.stream.random);
      break;
    case "VOICE":
      if (arg && arg.source) {
        if (arg.value === undefined) {
          let flag = false;
          if (state.cmd.VOICE.includes(arg.source)) {
            // sourceが既にVOICEに含まれている場合取り除く
            const arr = [];
            for (let i = 0; i < state.cmd.VOICE.length; i++) {
              if (state.cmd.VOICE[i] === arg.source) {
                continue;
              } else {
                arr.push(state.cmd.VOICE[i]);
              }
            }
            state.cmd.VOICE = arr;
            // state.cmd.VOICE.filter((id) => {
            // })
            console.log(state.cmd.VOICE);
          } else {
            state.cmd.VOICE.push(arg.source);
            flag = true;
          }
          // io.emit('stringsFromServer',{strings: 'VOICE: ' + String(flag), timeout: true})
          stringEmit(io, "VOICE: " + String(flag), true, arg.source);
          notTargetEmit(arg.source, Object.keys(state.client), io);
        } else {
          if (arg.value === 0) {
            let filtered: string[] = state.cmd.VOICE.filter(
              (element) => element !== arg.source
            );
            state.cmd.VOICE = filtered;
            stringEmit(io, "VOICE: false", true, arg.source);
            notTargetEmit(arg.source, Object.keys(state.client), io);
          } else {
            if (!state.cmd.VOICE.includes(arg.source)) {
              state.cmd.VOICE.push(arg.source);
            }
            stringEmit(io, "VOICE: true", true, arg.source);
            notTargetEmit(arg.source, Object.keys(state.client), io);
          }
        }
      }
      break;
  }
};
