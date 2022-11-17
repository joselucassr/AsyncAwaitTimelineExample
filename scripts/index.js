const asyncDiv = document.getElementById('async-div');
const syncDiv = document.getElementById('sync-div');
const timePosDiv = document.getElementById('time-pos');
const syncTimelineDiv = document.getElementById('sync-timeline');

const runBtn = document.getElementById('run-btn');
const resetBtn = document.getElementById('reset-btn');

const awaitCheck = document.getElementById('await-check');
const delayInput = document.getElementById('delay-input');

let interval, startTime;
let recentManualReset = false;

const mapTime = (currTime) => {
  const delay = parseInt(delayInput.value);
  return (80 * Math.min(currTime, delay)) / delay;
};

const updateTimeline = (currTime) => {
  timePosDiv.style.left = `${mapTime(currTime)}%`;
};

const startTimer = () => {
  startTime = Date.now();
  interval = setInterval(() => {
    updateTimeline(Date.now() - startTime);
  });
};

const stopTimer = () => {
  clearInterval(interval);
};

const resetTimer = () => {
  stopTimer();
  updateTimeline(0);
};

const asyncFunction = async (delay) => {
  await new Promise((r) => setTimeout(r, delay));
  return true;
};

const resetSequence = () => {
  asyncDiv.innerText = 'Waiting';
  syncDiv.style.visibility = 'hidden';
};

const setLoadingDiv = () => {
  asyncDiv.innerText = 'Loading';
};

const finishAsyncFn = () => {
  if (recentManualReset) return;
  asyncDiv.innerText = 'OK';
  stopTimer();
};

const showSyncDiv = () => {
  if (recentManualReset) return;
  syncDiv.style.visibility = '';
};

const runSequence = async () => {
  resetSequence();
  setLoadingDiv();
  startTimer();
  recentManualReset = false;

  const delay = parseInt(delayInput.value);

  if (awaitCheck.checked) {
    await asyncFunction(delay);
    finishAsyncFn();
    showSyncDiv();
  } else {
    asyncFunction(delay).then(finishAsyncFn);
    showSyncDiv();
  }
};

const toggleAwaitClass = () => {
  if (awaitCheck.checked) {
    syncTimelineDiv.classList.add('with-await');
  } else {
    syncTimelineDiv.classList.remove('with-await');
  }
};

awaitCheck.addEventListener('change', toggleAwaitClass);
runBtn.addEventListener('click', runSequence);
resetBtn.addEventListener('click', () => {
  resetSequence();
  resetTimer();
  recentManualReset = true;
});
