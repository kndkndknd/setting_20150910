// hls.js
import Hls from "hls.js";

export const hlsVideoPlay = () => {
  const hlsVideo = document.getElementById("hls") as HTMLVideoElement;
  const hlsVideoSource = "https://localhost:8000/parkconcert/Nature.m3u8";
  hlsVideo.style.display = "block";
  console.log("played", hlsVideo.played);
  console.log("paused", hlsVideo.paused);
  console.log("ended", hlsVideo.ended);
  const originalSize = { width: hlsVideo.width, height: hlsVideo.height };
  const width = window.innerWidth * Math.random();
  const height = (width * originalSize.height) / originalSize.width;
  hlsVideo.width = width;
  hlsVideo.height = height;

  if (Hls.isSupported()) {
    console.log("hls is supported");
    if (hlsVideo.played.length === 0) {
      console.log("not paused");
      const hls = new Hls();
      hls.loadSource(hlsVideoSource);
      hls.attachMedia(hlsVideo);
      hlsVideo.play();
    } else {
      console.log("played");
      hlsVideo.play();
    }
    // hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
    //   console.log("manifest loaded, found " + data.levels.length + " quality level");
    // });
  } else if (hlsVideo.canPlayType("application/vnd.apple.mpegurl")) {
    console.log("apple.mpegurl");
    hlsVideo.src = hlsVideoSource;
    hlsVideo.addEventListener("loadedmetadata", function () {
      hlsVideo.play();
    });
  }
};

export const hlsSizing = () => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const width = String(windowWidth);
  const height = String(windowHeight);
  console.log(width);
  console.log(height);
  const cnvsElement = <HTMLCanvasElement>document.getElementById("hls");
  cnvsElement.setAttribute("height", height + "px");
  cnvsElement.setAttribute("width", width + "px");
};

export const hlsVideoStop = () => {
  const hlsVideo = document.getElementById("hls") as HTMLVideoElement;
  if (hlsVideo.played) {
    hlsVideo.pause();
    hlsVideo.style.display = "none";
  }
};
