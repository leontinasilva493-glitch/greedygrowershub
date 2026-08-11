const consentKey = 'greedy-growers-analytics-consent';

document.querySelectorAll<HTMLElement>('[data-feedback-prompt]').forEach((prompt) => {
  const path = prompt.dataset.feedbackPath ?? window.location.pathname;
  const responseKey = `greedy-growers-feedback:${path}`;
  const controls = prompt.querySelector<HTMLElement>('[data-feedback-controls]');
  const status = prompt.querySelector<HTMLElement>('[data-feedback-status]');

  const syncVisibility = () => {
    const allowed = localStorage.getItem(consentKey) === 'allowed';
    prompt.hidden = !allowed;
    if (allowed && localStorage.getItem(responseKey) && controls) {
      controls.hidden = true;
      if (status) status.textContent = 'Thanks — your response was saved for editorial review.';
    }
  };

  prompt.querySelectorAll<HTMLButtonElement>('[data-feedback-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      if (localStorage.getItem(consentKey) !== 'allowed') return;
      const choice = button.dataset.feedbackChoice === 'helpful' ? 'helpful' : 'needs-work';
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'page_feedback', page_path: path, feedback_choice: choice });
      localStorage.setItem(responseKey, choice);
      if (controls) controls.hidden = true;
      if (status) status.textContent = 'Thanks — your response was saved for editorial review.';
    });
  });

  window.addEventListener('analytics-consent-change', syncVisibility);
  syncVisibility();
});
