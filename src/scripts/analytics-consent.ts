import {
  analyticsConsentKey,
  parseAnalyticsConsent,
  shouldLoadOptionalAnalytics,
  type AnalyticsConsent,
} from '../lib/analytics-consent';

declare global {
  interface Window {
    clarity?: ((command: string, ...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

document.querySelectorAll<HTMLElement>('[data-analytics-consent]').forEach((root) => {
  const panel = root.querySelector<HTMLElement>('[data-analytics-consent-panel]');
  const status = root.querySelector<HTMLElement>('[data-analytics-consent-status]');
  const production = root.dataset.production === 'true';
  const clarityId = root.dataset.clarityId;
  let scriptRequested = false;

  const loadClarity = () => {
    if (!clarityId || scriptRequested || document.querySelector(`script[data-clarity-project="${clarityId}"]`)) return;
    scriptRequested = true;
    window.clarity = window.clarity || Object.assign(
      (...args: unknown[]) => window.clarity?.q?.push(args),
      { q: [] as unknown[][] },
    );
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${clarityId}`;
    script.dataset.clarityProject = clarityId;
    document.head.append(script);
  };

  const announce = (consent: AnalyticsConsent) => {
    window.dispatchEvent(new CustomEvent('analytics-consent-change', { detail: { consent } }));
  };

  const applyConsent = (consent: AnalyticsConsent, persist = false) => {
    if (persist && consent !== 'undecided') localStorage.setItem(analyticsConsentKey, consent);
    if (shouldLoadOptionalAnalytics(consent, production)) loadClarity();
    if (consent === 'declined') window.clarity?.('consent', false);
    if (panel) panel.hidden = consent !== 'undecided';
    announce(consent);
  };

  root.querySelectorAll<HTMLButtonElement>('[data-analytics-choice]').forEach((button) => {
    button.addEventListener('click', () => {
      const consent = parseAnalyticsConsent(button.dataset.analyticsChoice ?? null);
      applyConsent(consent, true);
      if (status) status.textContent = consent === 'allowed' ? 'Optional analytics allowed.' : 'Optional analytics remain off.';
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-open-analytics-preferences]').forEach((button) => {
    button.addEventListener('click', () => {
      if (panel) panel.hidden = false;
      if (status) {
        const current = parseAnalyticsConsent(localStorage.getItem(analyticsConsentKey));
        status.textContent = current === 'allowed' ? 'Currently allowed.' : current === 'declined' ? 'Currently off.' : 'No choice saved.';
      }
      panel?.querySelector<HTMLButtonElement>('[data-analytics-choice]')?.focus();
    });
  });

  applyConsent(parseAnalyticsConsent(localStorage.getItem(analyticsConsentKey)));
});

export {};
