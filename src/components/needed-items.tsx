import { useContext } from "preact/hooks";
import { FactorioDataContext } from "../contexts/factorio-data";
import { NewItemPrompt } from "./new-item-box";
import { ItemAndRateInternal, ItemAndRateView } from "../core/app-state";

type NeededItemEntryProps = {
  itemId: number;
  rate: number;
  onDelete: (itemId: number) => void;
};
function NeededItemEntry({ itemId, rate, onDelete }: NeededItemEntryProps) {
  const { items } = useContext(FactorioDataContext);

  return <li>
    <div>
      <strong>{items[itemId].name}</strong> {rate} items/min
    </div>
    <button>Set rate</button>
    <button onClick={() => onDelete(itemId)}>Delete</button>
  </li>;
}

type NeededItemListProps = {
  needed: (ItemAndRateInternal)[];
  onNewEntry: (itemId: number, rate: number) => void;
  onDelete: (itemId: number) => void;
};
export function NeededItemList({ needed, onNewEntry, onDelete }: NeededItemListProps) {
  const addedItems = new Set(needed.map(s => s.itemId)) as ReadonlySet<number>;
  return <>
    <h3>Needed items</h3>
    <NewItemPrompt {...{ onNewEntry, addedItems }} />
    <ul>
      {needed.map((item) => <NeededItemEntry key={item.itemId} onDelete={onDelete} {...item} />)}
    </ul>
  </>;
}