declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

document.addEventListener('click', (event) => {
  if (localStorage.getItem('greedy-growers-analytics-consent') !== 'allowed') return;
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-event]');
  if (!target) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: target.dataset.event,
    event_label: target.dataset.eventLabel ?? target.textContent?.trim(),
    page_path: window.location.pathname,
  });
});

export {};
