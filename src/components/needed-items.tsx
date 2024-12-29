import { useContext } from "preact/hooks";
import { FactorioDataContext } from "../contexts/factorio-data";
import { ItemAndRateInternal } from "../core/app-state";
import { NewItemPrompt } from "./new-item-box";

type NeededItemEntryProps = {
  itemId: number;
  rate: number;
  onDelete: (itemId: number) => void;
};
function NeededItemEntry({ itemId, rate, onDelete }: NeededItemEntryProps) {
  const { items } = useContext(FactorioDataContext);

  return <tr>
    <td><strong>{items[itemId].name}</strong></td>
    <td>{rate}</td>
    <td>
      <button onClick={() => onDelete(itemId)}>Delete</button>
    </td>
  </tr>;
}

type NeededItemListProps = {
  needed: (ItemAndRateInternal)[];
  onNewEntry: (itemId: number, rate: number) => void;
  onDelete: (itemId: number) => void;
};
export function NeededItemList({ needed, onNewEntry, onDelete }: NeededItemListProps) {
  const addedItems = new Set(needed.map(s => s.itemId)) as ReadonlySet<number>;
  return <table>
    <thead>
      <tr>
        <th>Needed item</th>
        <th>Rate (items/min)</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {needed.map((item) => <NeededItemEntry key={item.itemId} onDelete={onDelete} {...item} />)}
    </tbody>
    <tfoot>
      <NewItemPrompt {...{ onNewEntry, addedItems }} />
    </tfoot>
  </table >;
}