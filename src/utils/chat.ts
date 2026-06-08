export function getChatId(uidA: string, uidB: string): string {
  return [uidA, uidB].sort().join('_');
}

export function cleanMessageText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}