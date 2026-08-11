export const analyticsConsentKey = 'greedy-growers-analytics-consent';

export type AnalyticsConsent = 'allowed' | 'declined' | 'undecided';

export const parseAnalyticsConsent = (value: string | null): AnalyticsConsent =>
  value === 'allowed' || value === 'declined' ? value : 'undecided';

export const shouldLoadOptionalAnalytics = (consent: AnalyticsConsent, production: boolean) =>
  consent === 'allowed' && production;
