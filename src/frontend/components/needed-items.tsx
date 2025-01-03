import { NewItemPrompt } from "./new-item-box";

type NeededItemEntryProps = {
  id: number;
  name: string;
  rate: number;
  onDelete: (itemId: number) => void;
};
function NeededItemEntry({ name, id, rate, onDelete }: NeededItemEntryProps) {
  return <tr>
    <td><strong>{name}</strong></td>
    <td>{rate}</td>
    <td>
      <button onClick={() => onDelete(id)}>Delete</button>
    </td>
  </tr>;
}

type NeededItemListProps = {
  itemList: string[]
  needed: ({ id: number; name: string; rate: number; })[];
  onNewEntry: (itemName: string, rate: number) => void;
  onDelete: (itemId: number) => void;
};
export function NeededItemList({ needed, itemList, onNewEntry, onDelete }: NeededItemListProps) {
  return <table>
    <thead>
      <tr>
        <th>Needed item</th>
        <th>Rate (items/min)</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {needed.map((item) => <NeededItemEntry
        key={item.id}
        onDelete={() => onDelete(item.id)}
        {...item}
      />)}
    </tbody>
    <tfoot>
      <NewItemPrompt {...{ onNewEntry, itemList }} />
    </tfoot>
  </table >;
}