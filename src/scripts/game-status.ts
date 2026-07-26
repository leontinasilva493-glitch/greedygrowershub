interface GameStatusResponse {
  playing: number;
  visits: number;
  maxPlayers: number;
  updated: string;
}

const formatter = new Intl.NumberFormat('en-US');

document.querySelectorAll<HTMLElement>('[data-game-status]').forEach(async (panel) => {
  const message = panel.querySelector<HTMLElement>('[data-status-message]');
  try {
    const response = await fetch('/api/game-status', { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const status = await response.json() as GameStatusResponse;
    const values: Record<keyof GameStatusResponse, string> = {
      playing: formatter.format(status.playing),
      visits: formatter.format(status.visits),
      maxPlayers: formatter.format(status.maxPlayers),
      updated: new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(status.updated)),
    };
    Object.entries(values).forEach(([key, value]) => {
      const output = panel.querySelector<HTMLElement>(`[data-status-value="${key}"]`);
      if (output) output.textContent = value;
    });
    if (message) message.textContent = 'Live from the public Roblox Games API · cached for 5 minutes';
  } catch {
    if (message) message.textContent = 'Live update unavailable · showing the dated snapshot above';
  }
});
