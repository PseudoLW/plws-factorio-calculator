import { useState } from "preact/hooks";
import { EntryOf } from "../types";

type ItemBreakdownProps = {
  recipeConfigurations: {
    recipeName: string;
    selectedMachineName: string;
    machineCount: number;
  }[];
  remainders: {
    itemName: string;
    itemId: number;
    rate: number;
    availableRecipes: { name: string; id: number; }[];
  }[];

  onBreakdown(item: number, selectedRecipe: number): void;
};
export function ItemBreakdown({
  recipeConfigurations,
  remainders,
  onBreakdown
}: ItemBreakdownProps) {
  return <>
    <h2>Item breakdown</h2>
    <ul>
      {recipeConfigurations.map(({ recipeName, selectedMachineName: machineName, machineCount }, i) => {
        return <li key={i}>
          <div>
            <strong>{recipeName}</strong> - {machineCount}x <strong>{machineName}</strong>
            <button onClick={() => {/* TODO */ }}>Delete</button>
            <button onClick={() => {/* TODO */ }}>Move order</button>
          </div>
        </li>;
      })}
      {remainders.map((props, i) => {
        return <ItemBreakdownEntry {...props} onBreakdown={onBreakdown}/>
      })}
    </ul>
  </>;
}


type ItemBreakdownEntryProps = EntryOf<ItemBreakdownProps['remainders']> & {
  onBreakdown(itemId: number, selectedRecipe: number): void;
};

function ItemBreakdownEntry({
  itemName,
  itemId,
  rate,
  availableRecipes,
  onBreakdown
}: ItemBreakdownEntryProps) {
  const [selectedRecipe, setSelectedRecipe] = useState(availableRecipes[0].id);

  return <li>
    <div>
      <strong>{itemName}</strong> {rate} items/min
      {availableRecipes.length > 1 && (
        <select
          onChange={(ev) => setSelectedRecipe(Number((ev.target as HTMLSelectElement).value))}
          value={selectedRecipe}
        >
          {availableRecipes.map(
            ({ name, id }) => <option key={id} value={id}>{name}</option>
          )}
        </select>
      )}
      {availableRecipes.length > 0 && (
        <button onClick={() => onBreakdown(itemId, selectedRecipe)}>Break down</button>
      )}
    </div>
  </li>;
}