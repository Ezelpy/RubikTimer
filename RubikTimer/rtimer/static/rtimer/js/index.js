const display = document.getElementById("display");
const startButton = document.getElementById("cmdStart");
const stopButton = document.getElementById("cmdStop");
const body = document.getElementById("body");
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let controlPress = 0;
let isRunning = false;

function start() {
  controlPress = 0;
  if (elapsedTime != 0) {
    reset();
  } 
  if (!isRunning) {
        body.style.backgroundColor = "lightgreen";
        startTime = Date.now() - elapsedTime;
        // We call the update function every ten miliseconds
        timer = setInterval(update, 10);
        isRunning = true;
   } 
}

function stop() {
    if (isRunning) {
        display.style.color = "#279bc2";
        body.style.backgroundColor = "lightblue";  
        clearInterval(timer);
        timer = null;
        isRunning = false;
    }
}

function reset() {
    if (isRunning) {
      body.style.backgroundColor = "lightblue";  
    }
    clearInterval(timer);
    timer = null;
    isRunning = false;
    startTime = 0;
    elapsedTime = 0;
    controlPress = 0;
    display.textContent = "00:00:00";
    startTime = Date.now();
}

function update() {
  elapsedTime = Date.now() - startTime;

  const minutes = String(Math.floor(elapsedTime / 60000))
    .padStart(2, "0");

  const seconds = String(
    Math.floor((elapsedTime % 60000) / 1000)).padStart(2, "0");

  const centiseconds = String(
    Math.floor((elapsedTime % 1000) / 10)).padStart(2, "0");

  display.textContent = `${minutes}:${seconds}:${centiseconds}`;
}



document.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.key === ' ') {
      if (!isRunning) {
        controlPress += 1;
        display.style.color = "red";  
        body.style.backgroundColor = "lightsalmon";
      }  
        e.preventDefault();
    }

});

document.addEventListener('keyup', e => {  
  if (e.code === 'Space' || e.key === ' ') {
        if (!isRunning && controlPress > 15) {
            start();
        } else {
            stop();
               body.style.backgroundColor = "lightblue";                      
        }
  }
  else if (e.key == 'r') {
    reset();
  }
  display.style.color = "#279bc2";
});