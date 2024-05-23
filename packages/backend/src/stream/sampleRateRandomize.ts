import { states } from "../states";

export const sampleRateRandomize = (stream: string) => {
  if (states.stream.randomratemode === "random") {
    return (
      states.stream.randomraterange[stream].min +
      Math.random() *
        (states.stream.randomraterange[stream].max -
          states.stream.randomraterange[stream].min)
    );
  } else if (states.stream.randomratemode === "diatonic") {
    return 11025 + Math.floor(Math.random() * 10) * 11025;
  }
};
