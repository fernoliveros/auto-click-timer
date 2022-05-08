
let startButton = document.getElementById("start");
let timeLeftElement = document.getElementById("seconds-left");
let toggle = true
let intervalId = 0

function setTimerStartValue() {
  intervalId = setInterval(() => {
    // get local storage and set interval to restart the check and click
    checkAndClick();
    updateTimerValue();
  }, 3000)
}

function updateTimerValue() {
  chrome.storage.local.get(['timeLeftText'], function(res) {
   timeLeftElement.textContent = res.timeLeftText
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

async function checkAndClick() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
        const min = document.querySelector('#timer__minutes').textContent,
        secTens = document.querySelector('#timer__seconds--tens').textContent,
        secOnes = document.querySelector('#timer__seconds--ones').textContent;
        let timeLeftText = ''
        timeLeftText = `${min}m ${secTens}${secOnes}s`
        const secondsLeft = (Number(min) * 60) + (Number(secTens) * 10) + Number(secOnes)
        
        chrome.storage.local.set({secondsLeft: secondsLeft, timeLeftText: timeLeftText}, function() {
          console.log('Setting Seconds Left: ' + secondsLeft);
        });

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
  clearTimeout(intervalId)
});