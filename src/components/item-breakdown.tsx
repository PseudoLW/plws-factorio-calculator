
type ItemBreakdownProps = {
  recipeConfigurations: {
    recipeName: number;
    machineName: number;
    machineCount: number;
  }[];
  remainders: { 
    itemName: number;
    itemId: number;
    rate: number;
    availableRecipes: { name: string; id: number; }[];
  }[];
};
export function ItemBreakdown({ recipeConfigurations, remainders }: ItemBreakdownProps) {
  return <>
    <h2>Item breakdown</h2>
    <ul>
      {recipeConfigurations.map(({ recipeName, machineName, machineCount }, i) => {
        return <li key={i}>
          <div>
            <strong>{recipeName}</strong> - {machineCount}x <strong>{machineName}</strong>
            <button onClick={() => {/* TODO */}}>Delete</button>
            <button onClick={() => {/* TODO */}}>Move order</button>
          </div>
        </li>;
      })}
      {remainders.map(({ itemName , itemId, rate, availableRecipes }, i) => {
        return <li key={i}>
          <div>
            <strong>{itemName}</strong> {rate} items/min
            <select>
              {availableRecipes.map(({ name, id }) => <option key={id} value={id}>{name}</option>)}
            </select>
            <button onClick={() => {/* TODO */}}>Break down</button>
          </div>
        </li>;
      })}
    </ul>
  </>;
}