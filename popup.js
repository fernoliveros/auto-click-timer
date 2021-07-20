
let startButton = document.getElementById("start");
let timeLeftElement = document.getElementById("seconds-left");
let timerMin = document.getElementById("timer-minutes");
let timerSec = document.getElementById("timer-seconds");
let intervalIds = []
let interval = 122 // seconds
let countdownTime = 122 // seconds
let toggle = true

window.onload = function() {
  chrome.storage.local.get(['timerMin','timerSec'], function(res) {
    console.log('Stored timerMin: ' + res.timerMin, ' timerSec: ', res.timerSec);
    if (res.timerMin) {
      timerMin.value = res.timerMin
    }
    if (res.timerSec) {
      timerSec.value = res.timerSec
    }
  });
}

function resetCountDown() {
  countdownTime = JSON.parse(JSON.stringify(interval))
}

function setTimerStartValue() {
  const mins = timerMin.valueAsNumber
  const secs = timerSec.valueAsNumber
  interval = (mins * 60) + secs
  resetCountDown()

  chrome.storage.local.set({timerMin: mins, timerSec: secs}, function() {
    console.log('Stored timerMin: ' + mins, ' timerSec: ', secs);
  });
}

function toggleDisabled(startDisabled) {
  if (startDisabled) {
    startButton.setAttribute('disabled', true)
    stopButton.removeAttribute('disabled')
  } else {
    stopButton.setAttribute('disabled', true)
    startButton.removeAttribute('disabled')
  }
}

async function click() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      document.querySelector('.course-control--forward').click()
    },
  });
  resetCountDown();
  
}

startButton.addEventListener("click", async () => {

  toggleDisabled(true)
  setTimerStartValue()

  intervalIds.push(setInterval(() => {
    click()
  }, interval * 1000));

  intervalIds.push(setInterval(() => {
    countdownTime--;
    const minutesLeft = Math.floor(countdownTime / 60).toString()
    const secondsLeft = (countdownTime - (minutesLeft * 60)).toString()
    const timeLeftText = `${minutesLeft}m ${secondsLeft.length === 1 ? '0' + secondsLeft : secondsLeft}s`
    timeLeftElement.textContent = timeLeftText
  }, 1000));
});

let stopButton = document.getElementById("stop");

stopButton.addEventListener("click", async () => {
  
  toggleDisabled(false)
  
  if (intervalIds.length > 0) {
    for(let i of intervalIds) {
      clearInterval(i)
    }
    intervalIds = [];
    resetCountDown();
  } else {
    console.error("NO INTERVAL")
  }
});