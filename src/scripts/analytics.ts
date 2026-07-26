declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

window.dataLayer = window.dataLayer || [];

document.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest<HTMLElement>('[data-event]');
  if (!target) return;
  window.dataLayer.push({
    event: target.dataset.event,
    event_label: target.dataset.eventLabel ?? target.textContent?.trim(),
    page_path: window.location.pathname,
  });
});

export {};
