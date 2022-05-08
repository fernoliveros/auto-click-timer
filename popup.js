
let startButton = document.getElementById("start");
let timeLeftElement = document.getElementById("seconds-left");
let intervalIds = []
let interval = 122 // seconds
let countdownTime = 122 // seconds
let toggle = true
let latestTimeout

window.onload = checkAndClick()

function setTimerStartValue() {
  setTimeout(function keepCalling() {
    checkAndClick();
     latestTimeout = setTimeout(keepCalling(), 1000)
  }, 1000) 
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

async function checkAndClick() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      const min = document.querySelector('#timer__minutes').textContent,
      secTens = document.querySelector('#timer__seconds--tens').textContent,
      secOnes = document.querySelector('#timer__seconds--ones').textContent;
      const timeLeftText = `${min}m ${secTens}${secOnes}s`
      timeLeftElement.textContent = timeLeftText
      
      if (min == '0' && secTens == '0' && secOnes == '0') {
        document.querySelector('.course-control--forward').click()
      }
    },
  });  
}

startButton.addEventListener("click", async () => {
  toggleDisabled(true)
  setTimerStartValue()
});

let stopButton = document.getElementById("stop");

stopButton.addEventListener("click", async () => {
  
  toggleDisabled(false)
  
  if (latestTimeout) {
    clearTimeout(latestTimeout)
  } else {
    console.error("NO TIMEOUT")
  }
});