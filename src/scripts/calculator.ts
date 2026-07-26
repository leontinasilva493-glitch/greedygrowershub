import { calculateProfit } from '../lib/calculator';

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

document.querySelectorAll<HTMLFormElement>('[data-calculator]').forEach((form) => {
  const scope = form.parentElement;
  const error = form.querySelector<HTMLElement>('[data-calculator-error]');
  const seedPreset = form.querySelector<HTMLSelectElement>('[data-seed-preset]');
  const fertilizerPreset = form.querySelector<HTMLSelectElement>('[data-fertilizer-preset]');

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
    update();
  });

  fertilizerPreset?.addEventListener('change', () => {
    const option = fertilizerPreset.selectedOptions[0];
    setNumberInput('fertilizerCost', option?.dataset.cost ?? '0');
    setNumberInput('harvestMultiplier', option?.dataset.multiplier ?? '1');
    update();
  });

  form.addEventListener('input', update);
  update();
});
