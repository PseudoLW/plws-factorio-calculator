import { useEffect, useState } from "preact/hooks";
import { EntryOf } from "../../util/types";

type ItemBreakdownProps = {
  recipeConfigurations: {
    recipe: string;
    selectedMachine: string;
    machineCount: number;
  }[];
  remainders: {
    item: { name: string; id: number; };
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
      {recipeConfigurations.map(({ recipe, selectedMachine, machineCount }) => {
        return <li>
          <div>
            <strong>{recipe}</strong> - {machineCount}x <strong>{selectedMachine}</strong>
            <button onClick={() => {/* TODO */ }}>Delete</button>
            <button onClick={() => {/* TODO */ }}>Move order</button>
          </div>
        </li>;
      })}
      <hr />
      {remainders.map((props, i) => {
        return <ItemBreakdownEntry {...props} onBreakdown={onBreakdown} />;
      })}
    </ul>
  </>;
}


type ItemBreakdownEntryProps = EntryOf<ItemBreakdownProps['remainders']> & {
  onBreakdown(itemId: number, selectedRecipe: number): void;
};

function ItemBreakdownEntry({
  item: { name, id },
  rate,
  availableRecipes,
  onBreakdown
}: ItemBreakdownEntryProps) {
  const [selectedRecipe, setSelectedRecipe] = useState(availableRecipes[0].id);

  return <li>
    <div>
      <strong>{name}</strong> {rate} items/min
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
        <button onClick={() => onBreakdown(id, selectedRecipe)}>Break down</button>
      )}
    </div>
  </li>;
}