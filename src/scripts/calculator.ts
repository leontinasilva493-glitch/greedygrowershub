import { calculateProfit, getCalculatorDecision } from '../lib/calculator';
import { createCalculatorAnalyticsEvent, type CalculatorAnalyticsEventName } from '../lib/calculator-analytics';
import { buildCalculatorContext, getMutationPreset, type MutationPreset } from '../lib/calculator-context';

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

document.querySelectorAll<HTMLFormElement>('[data-calculator]').forEach((form) => {
  const scope = form.parentElement;
  const error = form.querySelector<HTMLElement>('[data-calculator-error]');
  const seedPreset = form.querySelector<HTMLSelectElement>('[data-seed-preset]');
  const fertilizerPreset = form.querySelector<HTMLSelectElement>('[data-fertilizer-preset]');
  const advancedInputs = form.querySelector<HTMLDetailsElement>('[data-advanced-inputs]');
  const multiplierInput = form.elements.namedItem('harvestMultiplier');
  const mutationButtons = Array.from(form.querySelectorAll<HTMLButtonElement>('[data-mutation-preset]'));
  const resultPanel = scope?.querySelector<HTMLElement>('[data-calculator-result]');
  const decisionHeadline = scope?.querySelector<HTMLElement>('[data-decision-headline]');
  const decisionExplanation = scope?.querySelector<HTMLElement>('[data-decision-explanation]');
  let activeMutation: MutationPreset = getMutationPreset('base');

  const track = (event: CalculatorAnalyticsEventName, label: string) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(createCalculatorAnalyticsEvent(event, label, window.location.pathname));
  };

  const setNumberInput = (name: string, value: string | undefined) => {
    const input = form.elements.namedItem(name);
    if (input instanceof HTMLInputElement && value !== undefined && value !== '') input.value = value;
  };

  const updateContext = () => {
    const option = seedPreset?.selectedOptions[0];
    const seed = seedPreset?.value && option ? {
      name: option.dataset.seedName ?? option.textContent?.trim() ?? 'Selected seed',
      costDisplay: option.dataset.costDisplay ?? 'Not reported',
      rarity: option.dataset.rarity ?? 'Not reported',
      spawnOneIn: option.dataset.spawnOneIn ? Number(option.dataset.spawnOneIn) : null,
    } : null;
    const context = buildCalculatorContext(seed, activeMutation);

    for (const [key, value] of Object.entries(context)) {
      const output = form.querySelector<HTMLElement>(`[data-context="${key}"]`);
      if (output) output.textContent = value;
    }
  };

  const setActiveMutation = (preset: MutationPreset) => {
    activeMutation = preset;
    for (const button of mutationButtons) {
      const isActive = button.dataset.mutationPreset === preset.id;
      button.dataset.state = isActive ? 'active' : 'idle';
      button.setAttribute('aria-pressed', String(isActive));
    }
    updateContext();
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
    track('calculator_seed_selected', seedPreset.value || 'manual-values');
    updateContext();
    update();
  });

  fertilizerPreset?.addEventListener('change', () => {
    const option = fertilizerPreset.selectedOptions[0];
    setNumberInput('fertilizerCost', option?.dataset.cost ?? '0');
    setNumberInput('harvestMultiplier', option?.dataset.multiplier ?? '1');
    if (multiplierInput instanceof HTMLInputElement) {
      setActiveMutation({ id: 'manual', name: 'Manual', multiplier: Number(multiplierInput.value) || 1 });
    }
    track('calculator_fertilizer_selected', fertilizerPreset.value || 'none');
    update();
  });

  for (const button of mutationButtons) {
    button.addEventListener('click', () => {
      const preset = getMutationPreset(button.dataset.mutationPreset ?? 'base');
      if (multiplierInput instanceof HTMLInputElement) multiplierInput.value = String(preset.multiplier);
      setActiveMutation(preset);
      update();
    });
  }

  advancedInputs?.addEventListener('toggle', () => {
    if (advancedInputs.open) track('calculator_advanced_opened', 'advanced-inputs');
  });

  form.addEventListener('input', (event) => {
    if (event.target === multiplierInput && multiplierInput instanceof HTMLInputElement) {
      setActiveMutation({ id: 'manual', name: 'Manual', multiplier: Number(multiplierInput.value) || 1 });
    }
    update();
  });
  updateContext();
  update();
});
