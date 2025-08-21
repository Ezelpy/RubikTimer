const TIMER_RESET = "00";
const CONTROL_PRESS_MIN = 5;
const PRIMARY_COLOR = "#279bc2";
const START_COLOR = "lightgreen";
const WAIT_COLOR = "lightsalmon";
const STOP_COLOR = "red";
const BACKGROUND_COLOR = "lightblue";

const secColonDisplay = document.getElementById("secondsColon");
const minColonDisplay = document.getElementById("minutesColon");
const minDisplay = document.getElementById("minutes");
const secDisplay = document.getElementById("seconds");
const miliDisplay = document.getElementById("milliseconds");
const controlsContainer = document.getElementById("controls");
const scrambleDisplay = document.getElementById("scramble");
const displayTimer = document.getElementById("display");
const sidebar = document.getElementById("sideBar");
const scrambleContainer = document.getElementById("scrambleContainer");
const body = document.getElementById("body");
const timerDisplay = document.getElementById("timer");
const titleBar = document.getElementById("titlebar");

let timer = null;
let startTime = 0;
let elapsedTime = 0;
let controlPress = 0;
let isRunning = false;

let currScramble = null;

document.addEventListener('DOMContentLoaded', () => {
  getNewScramble();
});

function start() {
  controlPress = 0;
  controlsContainer.style.display = "none";
  titleBar.style.display = "none";
  scrambleContainer.style.display = "none";
  sidebar.style.display = "none";
  
  // Reset if the timer is not on zero
  if (elapsedTime != 0) {
    reset();
  } 

  if (!isRunning) {
    body.style.backgroundColor = START_COLOR; 
    timerDisplay.style.color = START_COLOR;
    startTime = Date.now() - elapsedTime;

    // We call the update function every ten miliseconds
    timer = setInterval(() => {
      elapsed = performance.now() - startTime;
      update(elapsed); 
    }, 10); 

    isRunning = true;
  } 
}

async function stop() {
  if (isRunning) {
    controlsContainer.style.display = "flex";
    titleBar.style.display = "flex";
    scrambleContainer.style.display = "flex";
    sidebar.style.display = "initial";

    timerDisplay.style.color = PRIMARY_COLOR;
    body.style.backgroundColor = BACKGROUND_COLOR;  
    clearInterval(timer);
    timer = null;
    isRunning = false;
    
    
    
    getNewScramble();
  }
}

function reset() {
  // If its already running change back color and make controls visible
  if (isRunning) {
    controlsContainer.style.display = "flex";
    titleBar.style.display = "flex";
    scrambleContainer.style.display = "flex";
    sidebar.style.display = "initial";
    body.style.backgroundColor = BACKGROUND_COLOR;  
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
  getNewScramble();
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

function login() {
  window.location.href = "login";
}

// BUG: counter is not getting reset so i can just press and instantly release
// the counter many times so that it ends up starting when it gets to 5

// Bug: timer gets out of container when resizing page

// BUG: when the tab is on the start button, any button will start it not only
// space

document.addEventListener('keydown', e => { 
  if (e.code === 'Space' || e.key === ' ') {
    if (!isRunning) {
      controlPress += 1;
      timerDisplay.style.color = STOP_COLOR;
      body.style.backgroundColor = WAIT_COLOR;
    }  
    e.preventDefault();
  }
});

document.addEventListener('keyup', e => {  
  // Handle Spacebar
  if (e.code === 'Space' || e.key === ' ') {
    // Pass min time to avoid accidental space presses
    if (!isRunning && controlPress > CONTROL_PRESS_MIN) {
      start();
    } 
    else {   
      stop();
      body.style.backgroundColor = BACKGROUND_COLOR;                     
    }
  }

  // Handle R
  else if (e.key == 'r') {
    reset();
  }

  // Reset the timer for keydowns that lasted less thatn control press
  if (!isRunning) {
    timerDisplay.style.color = PRIMARY_COLOR;
  }
});

function getNewScramble() {
  const scrambler = new Scrambow();
  currScramble = scrambler.get()[0]["scramble_string"];
  
  scrambleDisplay.textContent = currScramble;  
}

// PILE OF BUGS
// In need of improvement for smaller displays bc of timer and scrable label
// Timer display needs to be centered vertically
// Timer will start if I use tab two times as just keydown
// Timer will start if I just press the button for 5 times, need to reset counter

// PILE OF NEW FUNCS
// 1 - Log in functionality
// 2 - Solve time and scramble save and sidebar display.
//   - This will allow us to be able to delete solves as well.
// 3 - Display averages, best times, current average.