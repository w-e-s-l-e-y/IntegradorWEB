let interval;
let timeLeft = 1500; // 25 minutes in seconds
let isWorking = true;

function startTimer() {
  interval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft === 0) {
      clearInterval(interval);
      document.getElementById('timer').classList.add('time-up');
      setTimeout(() => {
        document.getElementById('timer').classList.remove('time-up');
      }, 3000);
      if (isWorking) {
        timeLeft = 300; // 5 minutes break
        isWorking = false;
      } else {
        timeLeft = 1500; // 25 minutes work
        isWorking = true;
      }
      updateTimer();
    }
  }, 1000);
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

document.getElementById('start').addEventListener('click', startTimer);

document.getElementById('reset').addEventListener('click', () => {
  clearInterval(interval);
  timeLeft = 1500;
  isWorking = true;
  updateTimer();
});

document.getElementById('skip').addEventListener('click', () => {
  clearInterval(interval);
  document.getElementById('timer').classList.add('time-up');
  setTimeout(() => {
    document.getElementById('timer').classList.remove('time-up');
  }, 3000);
  if (isWorking) {
    timeLeft = 300; // Skip to break
    isWorking = false;
  } else {
    timeLeft = 1500; // Skip to work
    isWorking = true;
  }
  updateTimer();
});
