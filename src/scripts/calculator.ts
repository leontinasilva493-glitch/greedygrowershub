import { calculateProfit, getCalculatorDecision } from '../lib/calculator';
import { calculateSessionScenario } from '../lib/calculator-session';
import { formatCalculatorMetric } from '../lib/calculator-display';
import { createCalculatorAnalyticsEvent, type CalculatorAnalyticsEventName } from '../lib/calculator-analytics';
import { buildCalculatorContext, getMutationPreset, type MutationPreset } from '../lib/calculator-context';

const numberFormatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

document.querySelectorAll<HTMLFormElement>('[data-calculator]').forEach((form) => {
  const scope = form.parentElement;
  const error = form.querySelector<HTMLElement>('[data-calculator-error]');
  const seedPreset = form.querySelector<HTMLSelectElement>('[data-seed-preset]');
  const fertilizerPreset = form.querySelector<HTMLSelectElement>('[data-fertilizer-preset]');
  const observationStatus = form.querySelector<HTMLElement>('[data-observation-status]');
  const multiplierInput = form.elements.namedItem('harvestMultiplier');
  const mutationButtons = Array.from(form.querySelectorAll<HTMLButtonElement>('[data-mutation-preset]'));
  const resultPanel = scope?.querySelector<HTMLElement>('[data-calculator-result]');
  const decisionHeadline = scope?.querySelector<HTMLElement>('[data-decision-headline]');
  const decisionExplanation = scope?.querySelector<HTMLElement>('[data-decision-explanation]');
  const resultSummary = scope?.querySelector<HTMLElement>('[data-result-summary]');
  const scenarioNotice = scope?.querySelector<HTMLElement>('[data-scenario-notice]');
  let activeMutation: MutationPreset = getMutationPreset('base');

  const track = (event: CalculatorAnalyticsEventName, label: string) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(createCalculatorAnalyticsEvent(event, label, window.location.pathname));
  };

  const setNumberInput = (name: string, value: string | undefined) => {
    const input = form.elements.namedItem(name);
    if (input instanceof HTMLInputElement && value !== undefined) input.value = value;
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

  const updateObservationStatus = () => {
    if (!observationStatus) return;
    const option = seedPreset?.selectedOptions[0];
    if (!seedPreset?.value) {
      observationStatus.textContent = 'Enter the values observed in one clean run. Results update immediately as you type.';
      return;
    }
    if (option?.dataset.seedCost) {
      observationStatus.textContent = `Reported buy-in was loaded for ${option.dataset.seedName ?? 'this seed'}. Record harvest value and wait time from your run; results update immediately.`;
      return;
    }
    observationStatus.textContent = 'This seed has a display price but no browser-safe numeric buy-in. Enter the amount shown in your current server, then record harvest value and wait time.';
  };

  const update = () => {
    const data = new FormData(form);
    const plots = Number(data.get('plots'));
    const sessionMinutes = Number(data.get('sessionMinutes'));
    const setRangeLabel = (name: string, value: string) => {
      const label = form.querySelector<HTMLElement>(`[data-range-label="${name}"]`);
      if (label) label.textContent = value;
    };

    setRangeLabel('plots', `${plots} ${plots === 1 ? 'plot' : 'plots'}`);
    setRangeLabel('sessionMinutes', `${sessionMinutes} min`);

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
        if (output) {
          output.textContent = formatCalculatorMetric(value);
          output.title = numberFormatter.format(value);
        }
      });
      const decision = getCalculatorDecision(result);
      if (resultPanel) resultPanel.dataset.state = decision.state;
      if (decisionHeadline) decisionHeadline.textContent = decision.headline;
      if (decisionExplanation) decisionExplanation.textContent = decision.explanation;
      if (scenarioNotice) {
        const seedName = seedPreset?.selectedOptions[0]?.dataset.seedName;
        const inputMismatch = result.totalInvestment > result.boostedHarvestValue
          ? ' Input mismatch: the current buy-in is above the boosted harvest value, so this scenario is a loss.'
          : '';
        scenarioNotice.textContent = seedName
          ? `Calculated from the current inputs for ${seedName}. Reported cost is loaded; sell value and wait time remain your scenario inputs until they are verified in game.${inputMismatch}`
          : 'Calculated from the current inputs and recorded run values.';
      }

      const session = calculateSessionScenario({
        result,
        waitMinutes: Number(data.get('waitMinutes')),
        plots,
        sessionMinutes,
      });
      Object.entries({ ...session, plots }).forEach(([key, value]) => {
        scope?.querySelectorAll<HTMLElement>(`[data-session-output="${key}"]`).forEach((output) => {
          output.textContent = formatCalculatorMetric(value);
          output.title = numberFormatter.format(value);
        });
      });
      if (resultSummary) {
        resultSummary.textContent = `${formatCalculatorMetric(session.completedCycles)} complete cycles across ${formatCalculatorMetric(plots)} plots. This is a repeatable scenario from the values you entered, not a forecast.`;
      }
      if (error) error.textContent = '';
    } catch (caught) {
      if (error) error.textContent = caught instanceof Error ? caught.message : 'Check the entered values.';
    }
  };

  seedPreset?.addEventListener('change', () => {
    const option = seedPreset.selectedOptions[0];
    setNumberInput('seedCost', option?.dataset.seedCost);
    track('calculator_seed_selected', seedPreset.value || 'manual-values');
    updateContext();
    updateObservationStatus();
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

  form.addEventListener('input', (event) => {
    if (event.target === multiplierInput && multiplierInput instanceof HTMLInputElement) {
      setActiveMutation({ id: 'manual', name: 'Manual', multiplier: Number(multiplierInput.value) || 1 });
    }
    update();
  });
  updateContext();
  updateObservationStatus();
  update();

  document.querySelectorAll<HTMLButtonElement>('[data-leaderboard-seed]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!seedPreset || !button.dataset.leaderboardSeed) return;
      seedPreset.value = button.dataset.leaderboardSeed;
      seedPreset.dispatchEvent(new Event('change', { bubbles: true }));
      form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
});
