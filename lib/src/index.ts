import { KeyframeEngine, Timeline } from "./KeyframeEngine";

let timeline = new Timeline(3000);
let engine = new KeyframeEngine(timeline);

const time = document.getElementById("time");

document.getElementById("init").addEventListener("click", () => {
  timeline.init();
});
document.getElementById("pause").addEventListener("click", () => {
  timeline.pause();
});
document.getElementById("continue").addEventListener("click", () => {
  timeline.continue();
});

timeline.onUpdate((t) => {
  time.innerText = "time: " + t;

  //@ts-ignore
  document.getElementById("test").setAttribute("cx", t * 0.01);
});
