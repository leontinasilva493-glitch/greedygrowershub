import { describe, expect, test } from 'vitest';
import { analyticsConsentKey, parseAnalyticsConsent, shouldLoadOptionalAnalytics } from './analytics-consent';

describe('optional analytics consent', () => {
  test('accepts only explicit stored choices', () => {
    expect(analyticsConsentKey).toBe('greedy-growers-analytics-consent');
    expect(parseAnalyticsConsent(null)).toBe('undecided');
    expect(parseAnalyticsConsent('allowed')).toBe('allowed');
    expect(parseAnalyticsConsent('declined')).toBe('declined');
    expect(parseAnalyticsConsent('yes')).toBe('undecided');
  });

  test('loads optional analytics only in production after opt in', () => {
    expect(shouldLoadOptionalAnalytics('allowed', true)).toBe(true);
    expect(shouldLoadOptionalAnalytics('allowed', false)).toBe(false);
    expect(shouldLoadOptionalAnalytics('declined', true)).toBe(false);
    expect(shouldLoadOptionalAnalytics('undecided', true)).toBe(false);
  });
});
