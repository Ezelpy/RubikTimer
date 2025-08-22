const TIMER_RESET = "00";
const CONTROL_PRESS_MIN = 5;
const PRIMARY_COLOR = "#279bc2";
const START_COLOR = "lightgreen";
const WAIT_COLOR = "lightsalmon";
const STOP_COLOR = "red";
const BACKGROUND_COLOR = "lightblue";
const STORAGE_KEY = "rtimer:lastFiveSolves"; // new for Ao5 persistence

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
let elapsedTimeMs = 0;
let display = "";
let controlPress = 0;
let isRunning = false;
let lastFiveSolves = [];
let currScramble = null;

document.addEventListener('DOMContentLoaded', () => {
  // load saved Ao5 data if available
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved)) lastFiveSolves = saved;
  } catch (_) {
    lastFiveSolves = [];
  }
  getNewScramble();
});

function start() {
  controlPress = 0;
  controlsContainer.style.display = "none";
  titleBar.style.display = "none";
  scrambleContainer.style.display = "none";
  sidebar.style.display = "none";
  
  // Reset if the timer is not on zero
  if (elapsedTimeMs != 0) {
    reset();
  } 

  if (!isRunning) {
    body.style.backgroundColor = START_COLOR; 
    timerDisplay.style.color = START_COLOR;
    startTime = performance.now() - elapsedTimeMs;

    // We call the update function every ten miliseconds
    timer = setInterval(() => {
      update(); 
    }, 10); 

    isRunning = true;
  } 
}

async function stop() {
  if (isRunning) {
    console.log("index.js loaded v4")
    clearInterval(timer);
    timer = null;
    isRunning = false;
    elapsedTimeMs = Math.floor(performance.now() - startTime);

    controlsContainer.style.display = "flex";
    titleBar.style.display = "flex";
    scrambleContainer.style.display = "flex";
    sidebar.style.display = "initial";

    timerDisplay.style.color = PRIMARY_COLOR;
    body.style.backgroundColor = BACKGROUND_COLOR;

    lastFiveSolves.push(elapsedTimeMs);
    if (lastFiveSolves.length > 5) lastFiveSolves.shift();

    // save solves so Ao5 works after reload
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lastFiveSolves));
    } catch (_) {}

    const ao5ms = calculateAo5Ms(lastFiveSolves);
    const ao5str = (ao5ms === null) ? "-" : (ao5ms / 1000).toFixed(2);

    document.getElementById("timeForm").value = display;
    document.getElementById("scrambleForm").value = currScramble;
    document.getElementById("avgForm").value = ao5str;

    document.getElementById("solveForm").submit();
    
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

  // Reset display and all the variables and get new scramble to display
  clearInterval(timer);
  timer = null;
  isRunning = false;
  startTime = 0;
  elapsedTimeMs = 0; 
  controlPress = 0;
  display = "";
  minDisplay.textContent = TIMER_RESET; 
  secDisplay.textContent = TIMER_RESET; 
  miliDisplay.textContent = TIMER_RESET;
  getNewScramble();
}

function update() {        
  elapsedTimeMs = Math.floor(performance.now() - startTime);

  const minutes = String(Math.floor(elapsedTimeMs / 60000));
  const seconds = String(Math.floor((elapsedTimeMs % 60000) / 1000));
  const milliseconds = String(Math.floor((elapsedTimeMs % 1000) / 10));

  minDisplay.textContent = minutes.padStart(2, "0");
  secDisplay.textContent = seconds.padStart(2, "0"); 
  miliDisplay.textContent = milliseconds.padStart(2, "0");
  display = msToDisplay(elapsedTimeMs);
}

function login() {
  window.location.href = "login";
}

document.addEventListener('keydown', e => { 
  // Key listener for space keydown so that the display can be on waiting mode
  if (e.code === 'Space' || e.key === ' ') {
    if (!isRunning) {
      // Counting number of presses to account for missclicks
      controlPress += 1;
      timerDisplay.style.color = STOP_COLOR;
      body.style.backgroundColor = WAIT_COLOR;
    }  
    e.preventDefault();
  }
});

document.addEventListener('keyup', e => {  
  // Handle Spacebar kewup to start or stop the timer
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
  // Get new scramble displayed in the top
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

// Convert miliseconds to string to display
function msToDisplay(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  if (m < 1) 
    return `${String(s).padStart(2,"0")}.${String(cs).padStart(2,"0")}`;
  return `${m}:${String(s).padStart(2,"0")}.${String(cs).padStart(2,"0")}`;
}

// compute Ao5 (ms) from an array of ms times
function calculateAo5Ms(lastFive) {
  if (lastFive.length < 5) return null;
  const last5 = lastFive.slice(-5).slice();        
  last5.sort((a,b) => a - b);
  const middle3 = last5.slice(1, 4);
  const sum = middle3.reduce((acc, t) => acc + t, 0);
  return Math.round(sum / 3);
}
