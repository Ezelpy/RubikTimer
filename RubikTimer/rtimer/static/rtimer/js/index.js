const display = document.getElementById("display");
const startButton = document.getElementById("cmdStart");
const stopButton = document.getElementById("cmdStop");
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

function start() {
   if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        // We call the update function every ten miliseconds
        timer = setInterval(update, 10);
        isRunning = true;
   } 
}

function stop() {
    if (isRunning) {
        clearInterval(timer);
        timer = null;
        isRunning = false;
    }
}

function reset() {
    clearInterval(timer);
    timer = null;
    isRunning = false;
    elapsedTime = 0;
    display.textContent = "00:00:00";
    startTime = Date.now();
}

function update() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    let minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    display.textContent = `${minutes}:${seconds}:${milliseconds}`;
}

document.addEventListener('DOMContentLoaded', () => {
  let isRunning = false;

  document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
      event.preventDefault();    // stop page scrolling
      if (!isRunning) {
        start();                
      } else {
        stop();                  
      }
      isRunning = !isRunning;
    }
  });
});