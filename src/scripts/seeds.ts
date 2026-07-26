const pushEvent = (event: string, details: Record<string, unknown>) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, page_path: window.location.pathname, ...details });
};

document.querySelectorAll<HTMLElement>('[data-seed-explorer]').forEach((explorer) => {
  const verification = explorer.querySelector<HTMLSelectElement>('[data-seed-filter="verification"]');
  const stage = explorer.querySelector<HTMLSelectElement>('[data-seed-filter="stage"]');
  const sort = explorer.querySelector<HTMLSelectElement>('[data-seed-sort]');
  const empty = explorer.querySelector<HTMLElement>('[data-seed-empty]');
  const count = explorer.querySelector<HTMLElement>('[data-compare-count]');
  const placeholder = explorer.querySelector<HTMLElement>('[data-compare-placeholder]');

  const groups = [...explorer.querySelectorAll<HTMLElement>('[data-seed-list]')];
  const selected = new Set<string>();

  const syncSelections = () => {
    explorer.querySelectorAll<HTMLInputElement>('[data-seed-compare]').forEach((box) => {
      box.checked = selected.has(box.value);
      box.disabled = !box.checked && selected.size >= 2;
    });
    explorer.querySelectorAll<HTMLElement>('[data-compare-card]').forEach((card) => card.classList.toggle('hidden', !selected.has(card.dataset.compareCard ?? '')));
    if (count) count.textContent = `${selected.size} selected`;
    placeholder?.classList.toggle('hidden', selected.size > 0);
  };

  const updateList = () => {
    const [sortKey, direction] = (sort?.value ?? 'name:asc').split(':');
    let visible = 0;
    groups.forEach((group) => {
      const items = [...group.querySelectorAll<HTMLElement>('[data-seed-item]')];
      items.sort((a, b) => {
        const aRaw = a.dataset[sortKey === 'growthMinutes' ? 'growthMinutes' : sortKey === 'harvestValue' ? 'harvestValue' : sortKey] ?? '';
        const bRaw = b.dataset[sortKey === 'growthMinutes' ? 'growthMinutes' : sortKey === 'harvestValue' ? 'harvestValue' : sortKey] ?? '';
        if (!aRaw && !bRaw) return 0;
        if (!aRaw) return 1;
        if (!bRaw) return -1;
        const compared = sortKey === 'name' ? aRaw.localeCompare(bRaw) : Number(aRaw) - Number(bRaw);
        return direction === 'desc' ? -compared : compared;
      }).forEach((item) => group.append(item));

      items.forEach((item) => {
        const matchesVerification = verification?.value === 'all' || item.dataset.verification === verification?.value;
        const matchesStage = stage?.value === 'all' || item.dataset.stage === 'all' || item.dataset.stage === stage?.value;
        item.classList.toggle('hidden', !(matchesVerification && matchesStage));
        if (group === groups[0] && matchesVerification && matchesStage) visible += 1;
      });
    });
    empty?.classList.toggle('hidden', visible > 0);
  };

  explorer.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;

    if (target instanceof HTMLInputElement && target.matches('[data-seed-compare]')) {
      target.checked ? selected.add(target.value) : selected.delete(target.value);
      pushEvent('seed_compare', { selected_count: selected.size, seed_id: target.value });
      syncSelections();
      return;
    }

    updateList();
    pushEvent('seed_filter_change', { filter: target.dataset.seedFilter ?? 'sort', value: target.value });
  });

  updateList();
  syncSelections();
});
