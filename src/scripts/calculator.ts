import { calculateProfit, getCalculatorDecision, type CalculatorResult } from '../lib/calculator';
import { calculateSessionScenario } from '../lib/calculator-session';
import { buildCalculatorShareText, formatCalculatorMetric } from '../lib/calculator-display';
import { createCalculatorAnalyticsEvent, type CalculatorAnalyticsEventName } from '../lib/calculator-analytics';
import { buildCalculatorContext, getMutationPreset, type MutationPreset } from '../lib/calculator-context';
import { MAX_RUNS, appendRunRecord, createRunRecord, summarizeRuns, type RunRecord } from '../lib/run-log';

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
  const copyScenario = scope?.querySelector<HTMLButtonElement>('[data-copy-calculator-scenario]');
  const copyStatus = scope?.querySelector<HTMLElement>('[data-calculator-share-status]');
  const advancedDisclosure = form.querySelector<HTMLDetailsElement>('[data-calculator-advanced]');
  let activeMutation: MutationPreset = getMutationPreset('base');
  const runLogLabel = scope?.querySelector<HTMLInputElement>('[data-run-log-label]');
  const runLogAdd = scope?.querySelector<HTMLButtonElement>('[data-run-log-add]');
  const runLogCopy = scope?.querySelector<HTMLButtonElement>('[data-run-log-copy]');
  const runLogClear = scope?.querySelector<HTMLButtonElement>('[data-run-log-clear]');
  const runLogHideFallback = scope?.querySelector<HTMLButtonElement>('[data-run-log-hide-fallback]');
  const runLogFeedback = scope?.querySelector<HTMLElement>('[data-run-log-feedback]');
  const runLogError = scope?.querySelector<HTMLElement>('[data-run-log-error]');
  const runLogSummary = scope?.querySelector<HTMLElement>('[data-run-log-summary]');
  const runLogCount = scope?.querySelector<HTMLElement>('[data-run-log-count]');
  const runLogMedian = scope?.querySelector<HTMLElement>('[data-run-log-median]');
  const runLogRange = scope?.querySelector<HTMLElement>('[data-run-log-range]');
  const runLogEmpty = scope?.querySelector<HTMLElement>('[data-run-log-empty]');
  const runLogList = scope?.querySelector<HTMLElement>('[data-run-log-list]');
  const runLogCopyFallback = scope?.querySelector<HTMLElement>('[data-run-log-copy-fallback]');
  const runLogCopyText = scope?.querySelector<HTMLTextAreaElement>('[data-run-log-copy-text]');
  const runLogItemTemplate = scope?.querySelector<HTMLTemplateElement>('[data-run-log-item-template]');

  let currentResult: CalculatorResult | null = null;
  let runs: RunRecord[] = [];

  const track = (event: CalculatorAnalyticsEventName, label: string) => {
    if (localStorage.getItem('greedy-growers-analytics-consent') !== 'allowed') return;
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

  const setRunLogFeedback = (message: string) => {
    if (runLogFeedback) runLogFeedback.textContent = message;
  };

  const setRunLogError = (message: string) => {
    if (runLogError) runLogError.textContent = message;
  };

  const hideCopyFallback = () => {
    runLogCopyFallback?.classList.add('hidden');
  };

  const showCopyFallback = (text: string) => {
    if (runLogCopyText) {
      runLogCopyText.value = text;
      runLogCopyText.focus();
      runLogCopyText.select();
    }
    runLogCopyFallback?.classList.remove('hidden');
  };

  const getCurrentNumericInput = (name: string) => Number(new FormData(form).get(name));

  const updateRunLogActions = () => {
    const hasLabel = Boolean(runLogLabel?.value.trim());
    if (runLogAdd) runLogAdd.disabled = !hasLabel;
    if (runLogCopy) runLogCopy.disabled = runs.length === 0;
    if (runLogClear) runLogClear.disabled = runs.length === 0;
  };

  const formatRunLogText = () => {
    const summary = summarizeRuns(runs);
    const lines = [
      'Your observations / not site facts',
      `Saved runs: ${summary.count}/${MAX_RUNS}`,
    ];

    if (summary.count >= 2) {
      lines.push(
        `Median net per minute: ${numberFormatter.format(summary.medianNetPerMinute ?? 0)}`,
        `Range net per minute: ${numberFormatter.format(summary.minNetPerMinute ?? 0)}-${numberFormatter.format(summary.maxNetPerMinute ?? 0)}`,
      );
    }

    lines.push('');
    lines.push(...runs.map((run, index) => (
      `${index + 1}. ${run.label} | net after failures: ${numberFormatter.format(run.riskAdjustedProfit)} | net/min: ${numberFormatter.format(run.riskAdjustedProfitPerMinute)} | elapsed minutes: ${numberFormatter.format(run.elapsedMinutes)}`
    )));

    return lines.join('\n');
  };

  const renderRuns = () => {
    const summary = summarizeRuns(runs);
    const showSummary = summary.count >= 2;

    runLogSummary?.classList.toggle('hidden', !showSummary);
    if (showSummary) {
      if (runLogCount) runLogCount.textContent = `${summary.count}/${MAX_RUNS}`;
      if (runLogMedian) runLogMedian.textContent = numberFormatter.format(summary.medianNetPerMinute ?? 0);
      if (runLogRange) {
        runLogRange.textContent = `${numberFormatter.format(summary.minNetPerMinute ?? 0)}-${numberFormatter.format(summary.maxNetPerMinute ?? 0)}`;
      }
    }

    if (runLogEmpty) {
      runLogEmpty.classList.toggle('hidden', runs.length > 0);
    }

    if (runLogList && runLogItemTemplate) {
      runLogList.replaceChildren();
      runs.forEach((run, index) => {
        const item = runLogItemTemplate.content.firstElementChild?.cloneNode(true);
        if (!(item instanceof HTMLElement)) return;

        const label = item.querySelector<HTMLElement>('[data-run-log-item-label]');
        const meta = item.querySelector<HTMLElement>('[data-run-log-item-meta]');
        const profit = item.querySelector<HTMLElement>('[data-run-log-item-profit]');
        const rate = item.querySelector<HTMLElement>('[data-run-log-item-rate]');
        const minutes = item.querySelector<HTMLElement>('[data-run-log-item-minutes]');
        const remove = item.querySelector<HTMLButtonElement>('[data-run-log-remove]');

        if (label) label.textContent = run.label;
        if (meta) meta.textContent = `Run ${index + 1} of ${MAX_RUNS}`;
        if (profit) profit.textContent = numberFormatter.format(run.riskAdjustedProfit);
        if (rate) rate.textContent = numberFormatter.format(run.riskAdjustedProfitPerMinute);
        if (minutes) minutes.textContent = numberFormatter.format(run.elapsedMinutes);
        remove?.addEventListener('click', () => {
          runs = runs.filter((_, runIndex) => runIndex !== index);
          hideCopyFallback();
          setRunLogError('');
          setRunLogFeedback(`Removed ${run.label}.`);
          renderRuns();
        });

        runLogList.append(item);
      });
    }

    updateRunLogActions();
  };

  const saveCurrentRun = () => {
    if (!currentResult) {
      setRunLogFeedback('');
      setRunLogError('Fix the calculator inputs before saving this run.');
      return;
    }

    try {
      const run = createRunRecord({
        label: runLogLabel?.value ?? '',
        riskAdjustedProfit: currentResult.riskAdjustedProfit,
        riskAdjustedProfitPerMinute: currentResult.riskAdjustedProfitPerMinute,
        waitMinutes: getCurrentNumericInput('waitMinutes'),
        failedRuns: getCurrentNumericInput('failedRuns'),
      });

      runs = appendRunRecord(runs, run);
      hideCopyFallback();
      setRunLogError('');
      setRunLogFeedback(`Saved ${run.label}.`);
      if (runLogLabel) runLogLabel.value = '';
      renderRuns();
      runLogLabel?.focus();
    } catch (caught) {
      setRunLogFeedback('');
      setRunLogError(caught instanceof Error ? caught.message : 'Unable to save the current run.');
    }
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
      currentResult = result;

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
      currentResult = null;
      if (error) error.textContent = caught instanceof Error ? caught.message : 'Check the entered values.';
    }

    updateRunLogActions();
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

  advancedDisclosure?.addEventListener('toggle', () => {
    if (advancedDisclosure.open) track('calculator_advanced_opened', 'advanced-inputs');
  });

  form.addEventListener('input', (event) => {
    if (event.target === multiplierInput && multiplierInput instanceof HTMLInputElement) {
      setActiveMutation({ id: 'manual', name: 'Manual', multiplier: Number(multiplierInput.value) || 1 });
    }
    update();
  });

  copyScenario?.addEventListener('click', async () => {
    const data = new FormData(form);
    const text = buildCalculatorShareText({
      seedName: seedPreset?.selectedOptions[0]?.dataset.seedName ?? 'Manual values',
      seedCost: String(data.get('seedCost') ?? ''),
      harvestValue: String(data.get('harvestValue') ?? ''),
      waitMinutes: String(data.get('waitMinutes') ?? ''),
      failedRuns: String(data.get('failedRuns') ?? ''),
      multiplier: String(data.get('harvestMultiplier') ?? ''),
      riskAdjustedProfit: scope?.querySelector<HTMLElement>('[data-output="riskAdjustedProfit"]')?.textContent?.trim() ?? 'Not calculated',
      profitPerMinute: scope?.querySelector<HTMLElement>('[data-output="riskAdjustedProfitPerMinute"]')?.textContent?.trim() ?? 'Not calculated',
      url: new URL('/', window.location.origin).toString(),
    });
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.append(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
      }
      if (copyStatus) copyStatus.textContent = 'Scenario copied';
      track('calculator_result_shared', 'copy-scenario');
    } catch {
      if (copyStatus) copyStatus.textContent = 'Copy failed';
    }
  });

  runLogLabel?.addEventListener('input', () => {
    setRunLogError('');
    setRunLogFeedback('');
    updateRunLogActions();
  });

  runLogLabel?.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    saveCurrentRun();
  });

  runLogAdd?.addEventListener('click', saveCurrentRun);

  runLogCopy?.addEventListener('click', async () => {
    const text = formatRunLogText();

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard API unavailable');
      }

      await navigator.clipboard.writeText(text);
      hideCopyFallback();
      setRunLogError('');
      setRunLogFeedback('Copied the run summary.');
    } catch {
      showCopyFallback(text);
      setRunLogFeedback('');
      setRunLogError('Clipboard copy failed. Use the fallback text area below.');
    }
  });

  runLogClear?.addEventListener('click', () => {
    runs = [];
    hideCopyFallback();
    setRunLogError('');
    setRunLogFeedback('Cleared all saved runs.');
    renderRuns();
  });

  runLogHideFallback?.addEventListener('click', () => {
    hideCopyFallback();
    setRunLogError('');
    setRunLogFeedback('Closed the copy fallback.');
  });

  hideCopyFallback();
  renderRuns();
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
