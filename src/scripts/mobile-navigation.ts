document.querySelectorAll<HTMLDetailsElement>('[data-mobile-navigation]').forEach((navigation) => {
  const trigger = navigation.querySelector<HTMLElement>('[data-mobile-nav-trigger]');
  const panel = navigation.querySelector<HTMLElement>('[data-mobile-nav-panel]');
  const backdrop = navigation.querySelector<HTMLButtonElement>('[data-mobile-nav-backdrop]');
  const desktop = window.matchMedia('(min-width: 1024px)');
  let previousBodyOverflow = '';

  const syncState = () => {
    const open = navigation.open;
    trigger?.setAttribute('aria-expanded', String(open));
    trigger?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');

    if (open) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      panel?.querySelector<HTMLElement>('a[href]')?.focus();
    } else {
      document.body.style.overflow = previousBodyOverflow;
    }
  };

  const close = (restoreFocus = true) => {
    if (!navigation.open) return;
    navigation.open = false;
    if (restoreFocus) trigger?.focus();
  };

  navigation.addEventListener('toggle', syncState);
  backdrop?.addEventListener('click', () => close());
  panel?.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a[href]')) close(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.open) {
      event.preventDefault();
      close();
    }
  });
  desktop.addEventListener('change', (event) => {
    if (event.matches) close(false);
  });
});
