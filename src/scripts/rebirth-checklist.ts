import { parseSavedRebirthLevels, serializeRebirthLevels } from '../lib/rebirth-checklist';

const storageKey = 'greedy-growers:rebirth-checklist:v1';

document.querySelectorAll<HTMLElement>('[data-rebirth-checklist]').forEach((scope) => {
  const checkboxes = [...scope.querySelectorAll<HTMLInputElement>('[data-rebirth-level]')];
  const resetButton = scope.querySelector<HTMLButtonElement>('[data-rebirth-reset]');
  const status = scope.querySelector<HTMLElement>('[data-rebirth-status]');
  if (!resetButton || !status) return;

  const validLevels = checkboxes.map((checkbox) => Number(checkbox.value));
  const getSelected = () => checkboxes.filter((checkbox) => checkbox.checked).map((checkbox) => Number(checkbox.value));
  const updateStatus = (saved: boolean) => {
    const count = getSelected().length;
    status.textContent = count === 0 ? 'Nothing marked yet.' : `${count} of ${checkboxes.length} levels marked${saved ? ' and saved locally' : ''}.`;
  };

  let savedLevels: number[] = [];
  let storageAvailable = true;
  try {
    savedLevels = parseSavedRebirthLevels(window.localStorage.getItem(storageKey), validLevels);
  } catch {
    storageAvailable = false;
    status.textContent = 'Local saving is unavailable in this browser.';
  }
  checkboxes.forEach((checkbox) => { checkbox.checked = savedLevels.includes(Number(checkbox.value)); });
  if (storageAvailable) updateStatus(false);

  checkboxes.forEach((checkbox) => checkbox.addEventListener('change', () => {
    try {
      window.localStorage.setItem(storageKey, serializeRebirthLevels(getSelected()));
      updateStatus(true);
    } catch {
      status.textContent = 'Selection changed, but local saving is unavailable.';
    }
  }));

  resetButton.addEventListener('click', () => {
    checkboxes.forEach((checkbox) => { checkbox.checked = false; });
    try {
      window.localStorage.removeItem(storageKey);
      updateStatus(false);
    } catch {
      status.textContent = 'Checklist reset; local storage could not be cleared.';
    }
  });
});
