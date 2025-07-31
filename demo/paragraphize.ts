export function paragraphize(text: string) {
  return text.split(/(?:\r?\n){2,}/);
}

export default function defaultExport(text: string) {
  console.log("defaultExport", text);
}
