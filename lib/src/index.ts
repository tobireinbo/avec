import { KeyframeEngine, Timeline } from "./avec/avec";

let timeline = new Timeline(8000);
let engine = new KeyframeEngine(timeline, document.getElementById("svg"));

engine
  .addLayer({
    id: "l1",
    elements: [
      {
        id: "rec1",
        type: "rect",
        x: 0,
        y: 0,
        backgroundColor: "blue",
        width: 100,
        height: 50,
        scale: 1,
        z: 1,
        keyframes: [
          {
            prop: "x",
            keyframes: [
              { from: { t: 0, v: 0 }, to: { t: 1000, v: 100 } },
              { from: { t: 2000, v: 100 }, to: { t: 3000, v: 200 } },
              { from: { t: 4000, v: 200 }, to: { t: 5000, v: 100 } },
              { from: { t: 6000, v: 100 }, to: { t: 7000, v: 0 } },
            ],
          },
        ],
      },
      {
        id: "rec2",
        type: "rect",
        x: 0,
        y: 0,
        backgroundColor: "rgba(0,255,0,0.3)",
        width: 100,
        height: 50,
        scale: 1,
        z: 1,
      },
    ],
    x: 0,
    y: 0,
    scale: 1,
    z: 1,
  })
  .play();

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
