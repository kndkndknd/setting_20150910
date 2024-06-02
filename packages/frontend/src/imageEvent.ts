import { cnvs, ctx, videoElement, frontState } from "./globalVariable";
import * as emoji from "node-emoji";
import { Socket } from "socket.io-client";

//const videoElement = <HTMLVideoElement>document.getElementById('video');
// const cinemaElement = <HTMLVideoElement>document.getElementById("cinema");
const bckcnvsElement = <HTMLCanvasElement>document.getElementById("bckcnvs");
const bckcnvsContext = bckcnvsElement.getContext("2d");
let emojiFlag = false;

const hlsElement = <HTMLVideoElement>document.getElementById("hls");

export function textPrint(
  text: string,
  stx: CanvasRenderingContext2D,
  strCnvs: HTMLCanvasElement,
  clear?: boolean
) {
  stx.clearRect(0, 0, strCnvs.width, strCnvs.height);

  // if (clear) {
  //   stx.clearRect(0, 0, strCnvs.width, strCnvs.height);
  // } else {
  //   stx.fillStyle = "white";
  //   stx.fillRect(0, 0, strCnvs.width, strCnvs.height);
  // }
  console.log("textPrint", text);
  console.log("emojiFlag:", emojiFlag);
  if (!emojiFlag) {
    print(text, stx, strCnvs);
  } else {
    print(emoji.random().emoji, stx, strCnvs);
  }
  /*
  if (hlsElement.played.length > 0) {
    setTimeout(() => {
      eraseText(stx, strCnvs);
    }, 100);
  }
  */
}

export function eraseText(
  stx: CanvasRenderingContext2D,
  strCnvs: HTMLCanvasElement
) {
  stx.clearRect(0, 0, strCnvs.width, strCnvs.height);
}

export function clearTextPrint(
  text: string,
  stx: CanvasRenderingContext2D,
  strCnvs: HTMLCanvasElement
) {
  stx.clearRect(0, 0, strCnvs.width, strCnvs.height);
  print(text, stx, strCnvs);
}

export function erasePrint(ctx, cnvs) {
  ctx.clearRect(0, 0, cnvs.width, cnvs.height);
  //  ctx.fillStyle = 'white';
  //  ctx.fillRect(0, 0, cnvs.width, cnvs.height);
}

export function canvasSizing(socket?: Socket) {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const width = String(windowWidth);
  const height = String(windowHeight);
  console.log(width);
  console.log(height);
  const cnvsElement = <HTMLCanvasElement>document.getElementById("cnvs");
  cnvsElement.setAttribute("height", height + "px");
  cnvsElement.setAttribute("width", width + "px");
  const bckcnvsElement = <HTMLCanvasElement>document.getElementById("bckcnvs");
  bckcnvsElement.setAttribute("height", height + "px");
  bckcnvsElement.setAttribute("width", width + "px");
  if (socket !== undefined) {
    socket.emit("connectFromClient", {
      clientMode: "client",
      urlPathName: window.location.pathname,
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
}

export function initVideo(videoElement) {
  videoElement.play();
  videoElement.volume = 0;
}

export function initVideoStream(stream, videoElement) {
  videoElement.srcObject = stream;
  const cnvsElement = <HTMLCanvasElement>document.createElement("canvas");
  const bufferContext = cnvsElement.getContext("2d");
  let render = () => {
    requestAnimationFrame(render);
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;
    if (width == 0 || height == 0) {
      return;
    }
    cnvsElement.width = width;
    cnvsElement.height = height;
    if (ctx) {
      bufferContext.drawImage(videoElement, 0, 0);
    }
  };
  render();
}

export function toBase64() {
  const canvasElement = <HTMLCanvasElement>document.createElement("canvas");
  let bufferContext = canvasElement.getContext("2d");
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  if (bufferContext) {
    bufferContext.drawImage(videoElement, 0, 0);
  }
  const returnURL = canvasElement.toDataURL("image/jpeg");
  //  const returnURL = canvasElement.toDataURL()
  //  console.log(returnURL)
  return returnURL;
}

export function renderStart() {
  console.log(videoElement);
  // const canvasElement = <HTMLCanvasElement> document.createElement('canvas')
  // const bufferContext = canvasElement.getContext('2d');
  let render = () => {
    requestAnimationFrame(render);
    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;
    if (width == 0 || height == 0) {
      return;
    }
    cnvs.width = width;
    cnvs.height = height;
    if (ctx) {
      ctx.drawImage(videoElement, 0, 0);
    }
  };
  render();
}

export function showImage(
  url: string,
  receive_ctx: CanvasRenderingContext2D,
  position?: { top: number; left: number; height: number; width: number }
) {
  //canvasSizing()
  console.log(url.slice(0, 50));
  const image = new Image();
  try {
    image.src = url;
    image.onload = () => {
      const aspect = image.width / image.height;
      if (position === undefined) {
        const hght =
          aspect > window.innerWidth / window.innerHeight
            ? window.innerWidth * aspect
            : window.innerHeight;
        const wdth =
          aspect > window.innerWidth / window.innerHeight
            ? window.innerWidth
            : window.innerHeight / aspect;
        // let hght = window.innerHeight;
        // let wdth = hght * aspect;
        //   if (aspect > window.innerWidth / window.innerHeight) {
        //   hght = wdth / aspect;
        //   wdth = window.innerWidth;
        // }
        const x = window.innerWidth / 2 - wdth / 2;
        const y = 0;
        receive_ctx.drawImage(image, x, y, wdth, hght);
      } else {
        receive_ctx.drawImage(
          image,
          position.left,
          position.top,
          position.width,
          position.height
        );
        /*
        const randomValue = Math.random();
        const wdth = Math.floor(
          randomValue * (window.innerWidth - position.left)
        );
        if (window.innerHeight - position.top >= wdth * aspect) {
          receive_ctx.drawImage(
            image,
            position.left,
            position.top,
            wdth,
            wdth * aspect
          );
        } else {
          const hght = Math.floor(
            randomValue * (window.innerHeight - position.top)
          );
          receive_ctx.drawImage(
            image,
            position.left,
            position.top,
            hght / aspect,
            hght
          );
        }
        */
        // const hght = window.innerHeight - position.top > wdth * aspect ? wdth * aspect : window.innerHeight - position.top;
        // const hght = position.height;
        // const x = position.left;
        // const y = position.top;
        // receive_ctx.drawImage(image, x, y, wdth, hght);
      }
      //console.log("width:" + String(wdth) + ",height:" + String(hght) + ", x:"+ x + ", y:"+ y)
      //receive_ctx.drawImage(image, 0, 0);
    };
  } catch (error) {
    console.log("showImage error: ", error);
  }
}

const print = (
  text: string,
  target: CanvasRenderingContext2D,
  cnvs: HTMLCanvasElement
) => {
  console.log("print: ", text);
  let fontSize = 20;
  let zenkakuFlag = false;
  target.globalAlpha = 1;
  target.fillStyle = "black";
  //if(darkFlag) target.fillStyle = "white"

  let textArr = [text];
  let textLength = 0;
  Array.prototype.forEach.call(text, (s, i) => {
    let chr = text.charCodeAt(i);
    if (
      (chr >= 0x00 && chr < 0x81) ||
      chr === 0xf8f0 ||
      (chr >= 0xff61 && chr < 0xffa0) ||
      (chr >= 0xf8f1 && chr < 0xf8f4)
    ) {
      textLength += 1;
    } else {
      textLength += 2;
      zenkakuFlag = true;
    }
  });
  if (textLength > 20) {
    if (zenkakuFlag) {
      fontSize = Math.floor((cnvs.width * 4) / 3 / 24);
    } else {
      fontSize = Math.floor((cnvs.width * 4) / 3 / 18);
    }
    textArr = [""];
    let lineNo = 0;
    Array.prototype.forEach.call(text, (element, index) => {
      if (index % 16 > 0 || index === 0) {
        textArr[lineNo] += element;
      } else {
        textArr.push(element);
        lineNo += 1;
      }
    });
  } else if (textLength > 2) {
    fontSize = Math.floor((cnvs.width * 4) / 3 / textLength);
  } else {
    fontSize = Math.floor((cnvs.height * 5) / 4 / textLength);
  }
  target.font = "bold " + String(fontSize) + "px 'Arial'";
  target.textAlign = "center";
  target.textBaseline = "middle";
  target.strokeStyle = "white";
  if (textArr.length === 1) {
    target.strokeText(text, cnvs.width / 2, cnvs.height / 2);
    target.fillText(text, cnvs.width / 2, cnvs.height / 2);
  } else {
    textArr.forEach((element, index) => {
      target.strokeText(
        element,
        cnvs.width / 2,
        cnvs.height / 2 + fontSize * (index - Math.round(textArr.length / 2))
      );
      target.fillText(
        element,
        cnvs.width / 2,
        cnvs.height / 2 + fontSize * (index - Math.round(textArr.length / 2))
      );
    });
  }
  target.restore();
};
/*
export function playbackCinema() {
  cinemaElement.play();
  console.log(cinemaElement.width);
  console.log(cinemaElement.offsetHeight);
  console.log(window.innerHeight);

  const aspect = cinemaElement.width / cinemaElement.height;
  let hght = window.innerHeight;
  let wdth = hght * aspect;
  if (aspect > window.innerWidth / window.innerHeight) {
    hght = wdth / aspect;
    wdth = window.innerWidth;
  }
  const x = window.innerWidth / 2 - wdth / 2;
  const y = 0;
  bckcnvsElement.setAttribute("height", window.innerHeight + "px");
  bckcnvsElement.setAttribute("width", window.innerWidth + "px");
  let render = () => {
    requestAnimationFrame(render);
    bckcnvsContext.drawImage(cinemaElement, 600, 200);
  };
  render();
}

export function stopCinema() {
  cinemaElement.pause();
  erasePrint(bckcnvsContext, bckcnvsElement);
}
*/
export function emojiState(state: boolean) {
  emojiFlag = state;
}

export const positionFloatingImage = (target) => {
  if (Object.keys(frontState.floatingPosition).includes(target)) {
    return frontState.floatingPosition[target];
  } else {
    const top = Math.floor(Math.random() * window.innerHeight);
    const left = Math.floor(Math.random() * window.innerWidth);
    // const height = Math.floor(Math.random() * window.innerHeight - top);
    // const width = Math.floor(Math.random() * window.innerWidth - left);
    const randomValue = Math.random();
    const aspect = window.innerHeight / window.innerWidth;
    const wdth = Math.floor(randomValue * (window.innerWidth - left));

    frontState.floatingPosition[target] =
      window.innerHeight - top >= wdth * aspect
        ? { top, left, width: wdth, height: wdth * aspect }
        : {
            top,
            left,
            width:
              Math.floor(randomValue * (window.innerHeight - top)) / aspect,
            height: Math.floor(randomValue * (window.innerHeight - top)),
          };
    console.log(frontState.floatingPosition);

    return frontState.floatingPosition[target];
  }
};

// export const showFloatingImage = (stream) => {};
