import { KeyframeEngine, Timeline } from "./avec/avec";

let timeline = new Timeline(6000);
let engine = new KeyframeEngine(timeline, document.getElementById("svg"));

engine.addLayer({
  id: "l1",
  type: "layer",
  elements: [{ id: "rec1", type: "rect", pos: { x: 0, y: 0 }, scale: 1, z: 1 }],
  pos: { x: 0, y: 0 },
  scale: 1,
  z: 1,
  keyframes: [{ prop: "posX", keyframes: [{ time: 1000, val: 100 }] }],
});
engine.playLayers();
const time = document.getElementById("time");
const bar = document.getElementById("test");
const playpauseBtn = document.getElementById("playpause");

let isPlay = true;

playpauseBtn.addEventListener("click", () => {
  if (isPlay) {
    timeline.play();
    isPlay = false;
    playpauseBtn.innerText = "pause";
  } else {
    timeline.pause();
    isPlay = true;
    playpauseBtn.innerText = "play";
  }
});

document.getElementById("stop").addEventListener("click", () => {
  timeline.stop();
  isPlay = true;
  playpauseBtn.innerText = "play";
});

timeline.onUpdate((t) => {
  time.innerText = "time: " + t;
  let step = Math.floor((t / timeline.end) * 800); //800 is width of container
  bar.setAttribute("x", step + "");
});
timeline.onPlaybackChange((event, t) => {
  time.innerText = "time: " + t;
  let step = Math.floor((t / timeline.end) * 800);
  if (event === "stop") {
    bar.setAttribute("x", step + "");
  }
});
