import { KeyframeEngine, Timeline } from "./avec/avec";

let timeline = new Timeline(6000);
let engine = new KeyframeEngine(timeline);

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
  console.log(step);
  bar.setAttribute("x", step + "");
});
timeline.onPlaybackChange((event, t) => {
  let step = Math.floor((t / timeline.end) * 800);
  if (event === "stop") {
    bar.setAttribute("x", step + "");
  }
});
