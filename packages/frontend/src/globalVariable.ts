import { quantize } from "./webaudio";

export const cnvs = <HTMLCanvasElement>document.getElementById("cnvs");
export const ctx = <CanvasRenderingContext2D>cnvs.getContext("2d");
export const videoElement = <HTMLVideoElement>document.getElementById("video");
export const frontState = {
  start: false,
  recLatency: true,
  quantize: {
    status: false,
    bar: 0,
    beat: 1,
    interval: 0,
    currentTime: 0,
    timeout: 0,
  },
  metronome: {
    status: false,
    fournote: 0,
  },
  floatingPosition: {},
};
