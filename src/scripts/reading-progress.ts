document.querySelectorAll<HTMLElement>('[data-reading-navigation]').forEach((navigation) => {
  const anchors = [...navigation.querySelectorAll<HTMLAnchorElement>('[data-reading-anchor]')];
  const sections = anchors
    .map((anchor) => document.querySelector<HTMLElement>(anchor.hash))
    .filter((section): section is HTMLElement => Boolean(section));
  const progress = navigation.querySelector<HTMLElement>('[data-reading-progress]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let currentIndex = -1;

  const update = () => {
    frame = 0;
    const readingLine = window.scrollY + navigation.offsetHeight + 96;
    let activeIndex = 0;
    sections.forEach((section, index) => {
      if (section.offsetTop <= readingLine) activeIndex = index;
    });

    anchors.forEach((anchor, index) => {
      if (index === activeIndex) anchor.setAttribute('aria-current', 'location');
      else anchor.removeAttribute('aria-current');
    });

    if (activeIndex !== currentIndex) {
      currentIndex = activeIndex;
      const behavior: ScrollBehavior = reducedMotion.matches ? 'auto' : 'smooth';
      anchors[activeIndex]?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
    }

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 1;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
});
