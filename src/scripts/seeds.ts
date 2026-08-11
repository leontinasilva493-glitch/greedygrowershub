import { parseSeedExplorerState, serializeSeedExplorerState, type SeedExplorerState } from '../lib/seed-explorer-state';

const analyticsAllowed = () => localStorage.getItem('greedy-growers-analytics-consent') === 'allowed';

const pushEvent = (event: string, details: Record<string, unknown>) => {
  if (!analyticsAllowed()) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, page_path: window.location.pathname, ...details });
};

const copyText = async (value: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

document.querySelectorAll<HTMLElement>('[data-seed-explorer]').forEach((explorer) => {
  const search = explorer.querySelector<HTMLInputElement>('[data-seed-search]');
  const rarity = explorer.querySelector<HTMLSelectElement>('[data-seed-filter="rarity"]');
  const verification = explorer.querySelector<HTMLSelectElement>('[data-seed-filter="verification"]');
  const sort = explorer.querySelector<HTMLSelectElement>('[data-seed-sort]');
  const empty = explorer.querySelector<HTMLElement>('[data-seed-empty]');
  const resultCount = explorer.querySelector<HTMLElement>('[data-seed-result-count]');
  const placeholder = explorer.querySelector<HTMLElement>('[data-compare-placeholder]');
  const compareTray = explorer.querySelector<HTMLElement>('[data-compare-tray]');
  const copyButton = explorer.querySelector<HTMLButtonElement>('[data-copy-seed-view]');
  const copyStatus = explorer.querySelector<HTMLElement>('[data-seed-share-status]');
  const clearButton = explorer.querySelector<HTMLButtonElement>('[data-clear-comparison]');
  const groups = [...explorer.querySelectorAll<HTMLElement>('[data-seed-list]')];
  const validSeedIds = new Set(
    [...(groups[0]?.querySelectorAll<HTMLElement>('[data-seed-item]') ?? [])]
      .map((item) => item.dataset.id)
      .filter((id): id is string => Boolean(id)),
  );
  const initialState = parseSeedExplorerState(new URLSearchParams(window.location.search), validSeedIds);
  const selected = new Set(initialState.selected);

  if (search) search.value = initialState.query;
  if (rarity && [...rarity.options].some((option) => option.value === initialState.rarity)) rarity.value = initialState.rarity;
  if (verification) verification.value = initialState.verification;
  if (sort) sort.value = initialState.sort;

  const currentState = (): SeedExplorerState => ({
    query: search?.value ?? '',
    rarity: rarity?.value ?? 'all',
    verification: (verification?.value ?? 'all') as SeedExplorerState['verification'],
    sort: (sort?.value ?? 'name:asc') as SeedExplorerState['sort'],
    selected: [...selected],
  });

  const updateUrl = () => {
    const url = new URL(window.location.href);
    url.search = serializeSeedExplorerState(currentState()).toString();
    window.history.replaceState({}, '', url);
  };

  const syncSelections = () => {
    explorer.querySelectorAll<HTMLInputElement>('[data-seed-compare]').forEach((box) => {
      box.checked = selected.has(box.value);
      box.disabled = !box.checked && selected.size >= 2;
    });
    explorer.querySelectorAll<HTMLElement>('[data-compare-card]').forEach((card) => card.classList.toggle('hidden', !selected.has(card.dataset.compareCard ?? '')));
    explorer.querySelectorAll<HTMLElement>('[data-compare-count]').forEach((count) => {
      count.textContent = `${selected.size} selected`;
    });
    placeholder?.classList.toggle('hidden', selected.size > 0);
    compareTray?.classList.toggle('hidden', selected.size === 0);
    compareTray?.classList.toggle('flex', selected.size > 0);
  };

  const updateList = () => {
    const [sortKey, direction] = (sort?.value ?? 'name:asc').split(':');
    const query = search?.value.trim().toLocaleLowerCase() ?? '';
    let visible = 0;

    groups.forEach((group) => {
      const items = [...group.querySelectorAll<HTMLElement>('[data-seed-item]')];
      items.sort((a, b) => {
        const aRaw = a.dataset[sortKey] ?? '';
        const bRaw = b.dataset[sortKey] ?? '';
        if (!aRaw && !bRaw) return 0;
        if (!aRaw) return 1;
        if (!bRaw) return -1;
        const compared = sortKey === 'name' ? aRaw.localeCompare(bRaw) : Number(aRaw) - Number(bRaw);
        return direction === 'desc' ? -compared : compared;
      }).forEach((item) => group.append(item));

      items.forEach((item) => {
        const matchesSearch = !query || (item.dataset.name ?? '').toLocaleLowerCase().includes(query);
        const matchesRarity = rarity?.value === 'all' || item.dataset.rarity === rarity?.value;
        const matchesVerification = verification?.value === 'all' || item.dataset.verification === verification?.value;
        const matches = matchesSearch && matchesRarity && matchesVerification;
        item.classList.toggle('hidden', !matches);
        if (group === groups[0] && matches) visible += 1;
      });
    });

    empty?.classList.toggle('hidden', visible > 0);
    if (resultCount) resultCount.textContent = String(visible);
  };

  explorer.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;

    if (target instanceof HTMLInputElement && target.matches('[data-seed-compare]')) {
      target.checked ? selected.add(target.value) : selected.delete(target.value);
      pushEvent('seed_compare', { selected_count: selected.size, seed_id: target.value });
      syncSelections();
      updateUrl();
      return;
    }

    // Search updates on `input`. Ignoring its later `change` event prevents a
    // blur-triggered DOM reorder from swallowing the first comparison click.
    if (!(target instanceof HTMLSelectElement)) return;
    updateList();
    updateUrl();
    pushEvent('seed_filter_change', { filter: target.dataset.seedFilter ?? 'sort', value: target.value });
  });

  search?.addEventListener('input', () => {
    updateList();
    updateUrl();
  });

  clearButton?.addEventListener('click', () => {
    selected.clear();
    syncSelections();
    updateUrl();
  });

  copyButton?.addEventListener('click', async () => {
    updateUrl();
    try {
      await copyText(window.location.href);
      if (copyStatus) copyStatus.textContent = 'View link copied';
      pushEvent('seed_view_copy', { selected_count: selected.size });
    } catch {
      if (copyStatus) copyStatus.textContent = 'Copy failed — use the address bar';
    }
  });

  updateList();
  syncSelections();
});
