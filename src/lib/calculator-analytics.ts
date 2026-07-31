export type CalculatorAnalyticsEventName =
  | 'calculator_seed_selected'
  | 'calculator_fertilizer_selected'
  | 'calculator_advanced_opened';

export interface CalculatorAnalyticsEvent extends Record<string, unknown> {
  event: CalculatorAnalyticsEventName;
  event_label: string;
  page_path: string;
}

export function createCalculatorAnalyticsEvent(
  event: CalculatorAnalyticsEventName,
  label: string,
  pagePath: string,
): CalculatorAnalyticsEvent {
  return {
    event,
    event_label: label,
    page_path: pagePath,
  };
}
