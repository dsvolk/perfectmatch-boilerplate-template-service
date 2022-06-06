/**
 * Get a length of time value in ms (number) and convert to a human-friendly HH:MM:ss string (05:27:42)
 * @param durationInMs
 */
export function msTo_HMS_Duration(durationInMs: number): string {
  const date = new Date(durationInMs);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getSeconds();
  // If you were building a timestamp instead of a duration, you would uncomment the following line to get 12-hour (not 24) time
  // if (hh > 12) {hh = hh % 12;}
  // These lines ensure you have two-digits
  const hour = hh < 10 ? `0${hh}` : `${hh}`;
  const min = mm < 10 ? `0${mm}` : `${mm}`;
  const sec = ss < 10 ? `0${ss}` : `${ss}`;

  // This formats your string to HH:MM:SS
  return hour + ':' + min + ':' + sec;
}
