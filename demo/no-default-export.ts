export function paragraphize(text: string) {
  return text.split(/(?:\r?\n){2,}/);
}
