import { calculateProfit } from '../lib/calculator';

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

document.querySelectorAll<HTMLFormElement>('[data-calculator]').forEach((form) => {
  const scope = form.parentElement;
  const error = form.querySelector<HTMLElement>('[data-calculator-error]');

  const update = () => {
    const data = new FormData(form);

    try {
      const result = calculateProfit({
        seedCost: Number(data.get('seedCost')),
        harvestValue: Number(data.get('harvestValue')),
        waitMinutes: Number(data.get('waitMinutes')),
        failedRuns: Number(data.get('failedRuns')),
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

  form.addEventListener('input', update);
  update();
});
