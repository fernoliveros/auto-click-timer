
let startButton = document.getElementById("start");
let secondsLeft = document.getElementById("seconds-left");
var intervalIds = []
const interval = 5 // seconds
var countdownTime = 5 // seconds
var toggle = true


function resetCountDown() {
  countdownTime = JSON.parse(JSON.stringify(interval))
}

async function click() {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: () => {
      document.querySelector('.question-hyperlink').click()
    },
  });
  resetCountDown();
  
}

startButton.addEventListener("click", async () => {

  intervalIds.push(setInterval(() => {
    click()
  }, interval * 1000));

  intervalIds.push(setInterval(() => {
    secondsLeft.textContent = countdownTime--;
  }, 1000));
});

let stopButton = document.getElementById("stop");

stopButton.addEventListener("click", async () => {
  
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