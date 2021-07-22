import { KeyframeEngine, Timeline } from "./avec/avec";

let timeline = new Timeline(6000);
let engine = new KeyframeEngine(timeline);

const time = document.getElementById("time");

document.getElementById("play").addEventListener("click", () => {
  timeline.play();
});
document.getElementById("pause").addEventListener("click", () => {
  timeline.pause();
});

timeline.onUpdate((t) => {
  time.innerText = "time: " + t;

  document.getElementById("test").setAttribute("cx", t * 0.01 + "");
});
