import { formatRemainingTime, parseDurationSeconds } from '../lib/harvest-timer';

document.querySelectorAll<HTMLFormElement>('[data-harvest-timer]').forEach((form) => {
  const minutesInput = form.elements.namedItem('minutes') as HTMLInputElement | null;
  const secondsInput = form.elements.namedItem('seconds') as HTMLInputElement | null;
  const output = form.querySelector<HTMLOutputElement>('[data-timer-output]');
  const status = form.querySelector<HTMLElement>('[data-timer-status]');
  const startButton = form.querySelector<HTMLButtonElement>('[data-timer-start]');
  const pauseButton = form.querySelector<HTMLButtonElement>('[data-timer-pause]');
  const resetButton = form.querySelector<HTMLButtonElement>('[data-timer-reset]');
  if (!minutesInput || !secondsInput || !output || !status || !startButton || !pauseButton || !resetButton) return;

  let timerId: number | undefined;
  let deadline = 0;
  let remainingSeconds = 0;
  let paused = false;

  const stopInterval = () => {
    if (timerId !== undefined) window.clearInterval(timerId);
    timerId = undefined;
  };

  const render = () => {
    output.value = formatRemainingTime(remainingSeconds);
    output.textContent = output.value;
  };

  const finish = () => {
    stopInterval();
    remainingSeconds = 0;
    paused = false;
    render();
    status.textContent = 'Target reached — decide from the current game state.';
    startButton.textContent = 'Start again';
    startButton.disabled = false;
    pauseButton.disabled = true;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
  };

  const tick = () => {
    remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    render();
    if (remainingSeconds === 0) finish();
  };

  const startInterval = () => {
    deadline = Date.now() + remainingSeconds * 1000;
    stopInterval();
    timerId = window.setInterval(tick, 250);
    tick();
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!paused) {
      const duration = parseDurationSeconds(minutesInput.value, secondsInput.value);
      if (duration === null) {
        status.textContent = 'Enter whole minutes and 0–59 seconds above zero.';
        minutesInput.focus();
        return;
      }
      remainingSeconds = duration;
    }

    paused = false;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    startButton.textContent = 'Running…';
    startButton.disabled = true;
    pauseButton.disabled = false;
    status.textContent = 'Timer running. Keep the game visible.';
    startInterval();
  });

  pauseButton.addEventListener('click', () => {
    if (timerId === undefined) return;
    remainingSeconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    stopInterval();
    paused = true;
    render();
    status.textContent = 'Paused.';
    startButton.textContent = 'Resume';
    startButton.disabled = false;
    pauseButton.disabled = true;
  });

  resetButton.addEventListener('click', () => {
    stopInterval();
    remainingSeconds = 0;
    paused = false;
    form.reset();
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    startButton.textContent = 'Start timer';
    startButton.disabled = false;
    pauseButton.disabled = true;
    status.textContent = 'Enter a target to begin.';
    render();
  });
});
