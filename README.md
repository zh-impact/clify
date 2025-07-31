# clify

Turn your js/ts file into a CLI tool.

Imagine you have a file `paragraphize.ts`:

```ts
export function paragraphize(text: string) {
  return text.split(/(?:\r?\n){2,}/);
}

export default function defaultExport(text: string) {
  console.log("defaultExport", text);
}
```

You can run it like this:

```bash
clify paragraphize.ts main -t "Hello World" // Output: defaultExport Hello World
clify paragraphize.ts para -t "Hello World" // Output: [ 'Hello World' ]
```
