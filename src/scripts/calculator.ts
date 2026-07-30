import { calculateProfit, getCalculatorDecision } from '../lib/calculator';
import { createCalculatorAnalyticsEvent, type CalculatorAnalyticsEventName } from '../lib/calculator-analytics';

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

document.querySelectorAll<HTMLFormElement>('[data-calculator]').forEach((form) => {
  const scope = form.parentElement;
  const error = form.querySelector<HTMLElement>('[data-calculator-error]');
  const seedPreset = form.querySelector<HTMLSelectElement>('[data-seed-preset]');
  const fertilizerPreset = form.querySelector<HTMLSelectElement>('[data-fertilizer-preset]');
  const advancedInputs = form.querySelector<HTMLDetailsElement>('[data-advanced-inputs]');
  const resultPanel = scope?.querySelector<HTMLElement>('[data-calculator-result]');
  const decisionHeadline = scope?.querySelector<HTMLElement>('[data-decision-headline]');
  const decisionExplanation = scope?.querySelector<HTMLElement>('[data-decision-explanation]');

  const track = (event: CalculatorAnalyticsEventName, label: string) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(createCalculatorAnalyticsEvent(event, label, window.location.pathname));
  };

  const setNumberInput = (name: string, value: string | undefined) => {
    const input = form.elements.namedItem(name);
    if (input instanceof HTMLInputElement && value !== undefined && value !== '') input.value = value;
  };

  const update = () => {
    const data = new FormData(form);

    try {
      const result = calculateProfit({
        seedCost: Number(data.get('seedCost')),
        harvestValue: Number(data.get('harvestValue')),
        waitMinutes: Number(data.get('waitMinutes')),
        failedRuns: Number(data.get('failedRuns')),
        fertilizerCost: Number(data.get('fertilizerCost')),
        harvestMultiplier: Number(data.get('harvestMultiplier')),
      });

      Object.entries(result).forEach(([key, value]) => {
        const output = scope?.querySelector<HTMLElement>(`[data-output="${key}"]`);
        if (output) output.textContent = numberFormatter.format(value);
      });
      const decision = getCalculatorDecision(result);
      if (resultPanel) resultPanel.dataset.state = decision.state;
      if (decisionHeadline) decisionHeadline.textContent = decision.headline;
      if (decisionExplanation) decisionExplanation.textContent = decision.explanation;
      if (error) error.textContent = '';
    } catch (caught) {
      if (error) error.textContent = caught instanceof Error ? caught.message : 'Check the entered values.';
    }
  };

  seedPreset?.addEventListener('change', () => {
    const option = seedPreset.selectedOptions[0];
    setNumberInput('seedCost', option?.dataset.cost);
    setNumberInput('harvestValue', option?.dataset.harvestValue);
    setNumberInput('waitMinutes', option?.dataset.waitMinutes);
    track('calculator_seed_selected', seedPreset.value || 'manual-values');
    update();
  });

  fertilizerPreset?.addEventListener('change', () => {
    const option = fertilizerPreset.selectedOptions[0];
    setNumberInput('fertilizerCost', option?.dataset.cost ?? '0');
    setNumberInput('harvestMultiplier', option?.dataset.multiplier ?? '1');
    track('calculator_fertilizer_selected', fertilizerPreset.value || 'none');
    update();
  });

  advancedInputs?.addEventListener('toggle', () => {
    if (advancedInputs.open) track('calculator_advanced_opened', 'advanced-inputs');
  });

  form.addEventListener('input', update);
  update();
});
