import { render } from 'preact';
import { useState } from 'preact/hooks';
import { NeededItemList } from './components/needed-items';
import Immutable from './util/immutable';

function App() {
  const [needed, setNeeded] = useState<readonly { itemId: number, rate: number; }[]>([]);
  const [addedItems, setAddedItems] = useState<ReadonlySet<number>>(new Set());
  const onNewEntry = (itemId: number, rate: number) => {
    setNeeded(Immutable.Array.add(needed, { itemId, rate }));
    setAddedItems(Immutable.Set.add(addedItems, itemId));
  };
  const onDeleteEntry = (itemId: number) => {
    setNeeded(needed.filter((s) => (s.itemId !== itemId)));
    setAddedItems(Immutable.Set.sub(addedItems, itemId))
  }
  return <>
    <NeededItemList {...{ needed, onNewEntry, addedItems, onDelete: onDeleteEntry }} />
    
  </>;
}

export function runApp() {
  render(<App />, document.body);
}