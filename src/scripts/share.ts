const copyText = async (value: string) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
};

document.querySelectorAll<HTMLElement>('[data-share-actions]').forEach((scope) => {
  const title = scope.dataset.shareTitle ?? document.title;
  const path = scope.dataset.sharePath ?? window.location.pathname;
  const url = new URL(path, window.location.origin).toString();
  const status = scope.querySelector<HTMLElement>('[data-share-status]');
  const canUseNativeShare = typeof navigator.share === 'function';

  scope.querySelector<HTMLButtonElement>('[data-share-page]')?.addEventListener('click', async () => {
    try {
      if (canUseNativeShare) await navigator.share({ title, url });
      else await copyText(url);
      if (status) status.textContent = canUseNativeShare ? 'Share opened' : 'Link copied';
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError' && status) status.textContent = 'Unable to share';
    }
  });

  scope.querySelector<HTMLButtonElement>('[data-copy-page-link]')?.addEventListener('click', async () => {
    try {
      await copyText(url);
      if (status) status.textContent = 'Link copied';
    } catch {
      if (status) status.textContent = 'Copy failed — use the address bar';
    }
  });
});
