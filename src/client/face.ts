import * as faceapi from 'face-api.js'
import { io, Socket } from 'socket.io-client';
const socket: Socket = io();

import {canvasSizing, clearTextPrint, erasePrint } from './imageEvent'
import {cnvs, ctx, } from './globalVariable'


/*
const videoEl = <HTMLVideoElement> document.getElementById( 'video' );
const canvas = <HTMLCanvasElement> document.getElementById( 'cnvs' );

const inputSize = 224;
const scoreThreshold = 0.5;
const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });

export async function initFace() {
  await faceapi.nets.tinyFaceDetector.load('/weight/')
  await faceapi.loadFaceLandmarkModel('/weight/')
}

export async function detectFace() {
  if(videoEl.paused || videoEl.ended || !faceapi.nets.tinyFaceDetector.params)
    return setTimeout(() => detectFace())

  console.log('test')
  const result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks()
  if (result) {
    const dims = faceapi.matchDimensions(canvas, videoEl, true)
    const resizedResult = faceapi.resizeResults(result, dims)
    faceapi.draw.drawDetections(canvas, resizedResult)
    faceapi.draw.drawFaceLandmarks(canvas, resizedResult)
  }
  setTimeout(() => detectFace())
} 
*/
console.log("hello")

const faceCanvas = <HTMLCanvasElement> document.getElementById( 'bckcnvs' );
const videoEl = <HTMLVideoElement> document.getElementById( 'video' );
const inputSize = 224;
const scoreThreshold = 0.5;
const options = new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold });
//videoEl.volume = 0.01;
    
async function onPlay()
{
  if(videoEl.paused || videoEl.ended || !faceapi.nets.tinyFaceDetector.params)
    return setTimeout(() => onPlay())

  const result = await faceapi.detectSingleFace(videoEl, options).withFaceLandmarks().withFaceExpressions()
//  const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
  if (result) {
    const dims = faceapi.matchDimensions(faceCanvas, videoEl, true)
    const resizedResult = faceapi.resizeResults(result, dims)
//    console.log(resizedResult)
    console.log(resizedResult.landmarks.positions)
    console.log(resizedResult.alignedRect.box)
    console.log(resizedResult.alignedRect.score)
    // resizedResult.landmarks.
    if(resizedResult.alignedRect.score > 0) {
      faceapi.draw.drawFaceLandmarks(faceCanvas, resizedResult)
      socket.emit('faceFromClient',{
        detection: true,
        box: resizedResult.alignedRect.box,
        score: resizedResult.alignedRect.score
      })
      const expression = judgeExpression(result, 0.9)
      if(expression !== ""){
        // canvas
        erasePrint(ctx, cnvs)
        // clearTextPrint(expression, ctx, cnvs)
        console.log(expression)
        socket.emit('expressionFromClient', expression)
      } else {
        erasePrint(ctx, cnvs)
      }
  
    } else {
      console.log(resizedResult.alignedRect.score)
    }
    // faceapi.draw.drawDetections(faceCanvas, resizedResult)
  } else {
    // 顔を消す
    console.log('not ditected')
    socket.emit('faceFromClient',{
      detection: false
    })
}
  setTimeout(() => onPlay())
};
    
async function run(){
  socket.emit('debugFromClient')
  await faceapi.nets.tinyFaceDetector.load('/model/')
  await faceapi.nets.faceExpressionNet.loadFromUri('./model/')
  await faceapi.loadFaceLandmarkModel('/model/')
  const devices = await navigator.mediaDevices.enumerateDevices()
  const cameras = devices.filter((device) => device.kind === 'videoinput');
  if (cameras.length === 0) {
    throw 'No camera found on this device.'
  }
  console.log(cameras)
const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
  videoEl.srcObject = stream;
}

let eListener = <HTMLElement> document.getElementById('wrapper')
eListener.addEventListener('click', (()=>{
  run()
  onPlay()
}), false);

window.addEventListener('resize', (e) =>{
  console.log('resizing')
  canvasSizing()
})
canvasSizing();



function judgeExpression(data, scoreThreshold) {
  if (data.expressions.happy >= scoreThreshold) {
    return "強欲"
  };

  if (data.expressions.sad >= scoreThreshold) {
    return "嫉妬"
  }
  if (data.expressions.angry >= scoreThreshold){
    return "憤怒"
  }
  if (data.expressions.surprised >= scoreThreshold){
    return "色欲"
  }
  if (data.expressions.neutral >= scoreThreshold){
    return "暴食"
  }
  if (data.expressions.fearful >= scoreThreshold){
    return "傲慢"
  }
  if (data.expressions.dusgusted >= scoreThreshold){
    return "怠惰"
  }

  return "";
};
