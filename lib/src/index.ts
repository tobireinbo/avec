import { KeyframeEngine, Timeline } from "./avec/avec";

let timeline = new Timeline(6000);
let engine = new KeyframeEngine(timeline);

const time = document.getElementById("time");
const bar = document.getElementById("test");

document.getElementById("play").addEventListener("click", () => {
  timeline.play();
});
document.getElementById("pause").addEventListener("click", () => {
  timeline.pause();
  timeline.setStart(3000);
});
document.getElementById("stop").addEventListener("click", () => {
  timeline.stop();
});

timeline.onUpdate((t) => {
  time.innerText = "time: " + t;
  let step = Math.floor((t / timeline.end) * 800); //800 is width of container
  console.log(step);
  bar.setAttribute("x", step + "");
});
timeline.onPlaybackChange((event, time) => {
  if (event === "stop") {
    bar.setAttribute("x", 0 + "");
  }
  console.log("on playback change", time);
});
