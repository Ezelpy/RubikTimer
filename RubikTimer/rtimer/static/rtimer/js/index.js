const minDisplay = document.getElementById("minutes");
const secDisplay = document.getElementById("seconds");
const miliDisplay = document.getElementById("milliseconds");
const secColonDisplay = document.getElementById("secondsColon");
const minColonDisplay = document.getElementById("minutesColon");
const controlsContainer = document.getElementById("controls");
const startButton = document.getElementById("cmdStart");
const stopButton = document.getElementById("cmdStop");
const body = document.getElementById("body");
const TIMER_RESET = "00";
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let controlPress = 0;
let isRunning = false;

function start() {
  controlPress = 0;
  controlsContainer.style.display = "none";
  if (elapsedTime != 0) {
    reset();
  } 
  if (!isRunning) {
        body.style.backgroundColor = "lightgreen";
        startTime = Date.now() - elapsedTime;
        // We call the update function every ten miliseconds
        timer = setInterval(() => {
  elapsed = performance.now() - startTime;
  update(elapsed);
}, 10); 
        isRunning = true;
   } 
}

function stop() {
    if (isRunning) {
        controlsContainer.style.display = "flex";
        minDisplay.style.color = "#279bc2";
        secDisplay.style.color = "#279bc2";
        miliDisplay.style.color = "#279bc2";
        minColonDisplay.style.color = "#279bc2";
        secColonDisplay.style.color = "#279bc2";
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
    minDisplay.textContent = TIMER_RESET;
    secDisplay.textContent = TIMER_RESET;
    miliDisplay.textContent = TIMER_RESET;
    startTime = Date.now();
}

function update() {
  elapsedTime = Date.now() - startTime;

  const minutes = String(Math.floor(elapsedTime / 60000)).padStart(2, "0");
  const seconds = String(Math.floor((elapsedTime % 60000) / 1000)).padStart(2, "0");
  const milliseconds = String(Math.floor((elapsedTime % 1000) / 10)).padStart(2, "0");

  minDisplay.textContent = minutes;
  secDisplay.textContent = seconds; 
  miliDisplay.textContent = milliseconds;

  
}

// BUG: counter is not getting reset so i can just press and instantly release
// the counter many times so that it ends up starting when it gets to 5

document.addEventListener('keydown', e => { 
  if (e.code === 'Space' || e.key === ' ') {
      if (!isRunning) {
        controlPress += 1;
        minDisplay.style.color = "red";  
        secDisplay.style.color = "red";  
        miliDisplay.style.color = "red"; 
        minColonDisplay.style.color = "red";  
        secColonDisplay.style.color = "red"; 
        body.style.backgroundColor = "lightsalmon";
      }  
        e.preventDefault();
    }
});

document.addEventListener('keyup', e => {  
  if (e.code === 'Space' || e.key === ' ') {
        if (!isRunning && controlPress > 5) {
            start();
        } 
        else {   
            stop();
            body.style.backgroundColor = "lightblue";                      
        }
  }
  else if (e.key == 'r') {
    reset();
  }

  minDisplay.style.color = "#279bc2";  
  secDisplay.style.color = "#279bc2"; 
  miliDisplay.style.color = "#279bc2"; 
  secColonDisplay.style.color = "#279bc2"; 
  minColonDisplay.style.color = "#279bc2"; 
});