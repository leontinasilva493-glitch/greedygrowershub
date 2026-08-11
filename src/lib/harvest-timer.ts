export function parseDurationSeconds(minutesValue: string, secondsValue: string): number | null {
  const parsePart = (value: string) => {
    if (value.trim() === '') return 0;
    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : Number.NaN;
  };

  const minutes = parsePart(minutesValue);
  const seconds = parsePart(secondsValue);
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return null;
  if (minutes < 0 || seconds < 0 || seconds > 59) return null;

  const duration = minutes * 60 + seconds;
  return duration > 0 ? duration : null;
}

export function formatRemainingTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const clock = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  return hours ? `${hours}:${clock}` : clock;
}
