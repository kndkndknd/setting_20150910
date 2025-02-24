import { streamList } from "../states";
import { cmdStateType } from "../../../types/global";

export const pushStateStream = (
  streamName: string,
  states: cmdStateType,
  random?: boolean
) => {
  streamList.push(streamName);
  states.current.stream[streamName] = false;
  states.previous.stream[streamName] = false;
  states.stream.sampleRate[streamName] = 44100;
  states.stream.glitch[streamName] = false;
  states.stream.grid[streamName] = true;
  states.stream.latency[streamName] = 1000;
  states.stream.random[streamName] = random !== undefined ? random : true;
  states.stream.randomrate[streamName] = false;
  states.stream.target[streamName] = [];
  states.stream.randomratemode = "random";
  states.stream.randomraterange[streamName] = {
    min: 5000,
    max: 132300,
  };
  states.stream.quantize.flag.stream[streamName] = false;
  states.stream.quantize.bpm[streamName] = {};
  states.stream.quantize.beat[streamName] = {};
  for (let key in states.client) {
    states.stream.quantize.bpm[streamName][key] = 60;
    states.stream.quantize.beat[streamName][key] = 0;
  }
};
