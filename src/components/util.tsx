import type { Dispatch, StateUpdater } from "preact/hooks";

export function wrapOnInput(fn: Dispatch<StateUpdater<string>>) {
  return (e: Event) => fn((e.target as HTMLInputElement).value);
}