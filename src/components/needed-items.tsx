import { useContext } from "preact/hooks";
import { FactorioDataContext } from "../contexts/factorio-data";
import { NewItemPrompt } from "./new-item-box";

type NeededItemEntryProps = {
  itemId: number;
  rate: number;
  onDelete: (itemId: number) => void;
};
function NeededItemEntry({ itemId, rate, onDelete }: NeededItemEntryProps) {
  const { itemNames } = useContext(FactorioDataContext);

  return <li>
    <div>
      <strong>{itemNames[itemId]}</strong> {rate} items/min
    </div>
    <button>Set rate</button>
    <button onClick={() => onDelete(itemId)}>Delete</button>
  </li>;
}

type NeededItemListProps = {
  needed: readonly { itemId: number; rate: number; }[];
  addedItems: ReadonlySet<number>;
  onNewEntry: (itemId: number, rate: number) => void;
  onDelete: (itemId: number) => void;
};
export function NeededItemList({ needed, addedItems, onNewEntry, onDelete }: NeededItemListProps) {
  return <>
    <h3>Needed items</h3>
    <NewItemPrompt {...{ onNewEntry, addedItems }} />
    <ul>
      {needed.map((item) => <NeededItemEntry key={item.itemId} onDelete={onDelete} {...item} />)}
    </ul>
  </>;
}