import { FactorioData, ItemId, MachineId, RecipeId } from "../data/factorio-data";

const epsilon = 0.000_000_1;
export function breakdownLinear(
    needed: { itemId: ItemId; rate: number; }[],
    recipes: {
        recipeId: RecipeId;
        satisfyingItemId: ItemId;
        selectedMachineId: MachineId;
    }[],
    data: FactorioData
) {
    const currentNeeded = new Map<ItemId, number>(needed.map(
        ({ itemId, rate }) => [itemId, rate]
    ));
    const machinesNeeded: number[] = [];
    for (const { recipeId, satisfyingItemId, selectedMachineId: machineId } of recipes) {
        const neededItemRate = currentNeeded.get(satisfyingItemId) ?? 0;
        const {
            time: craftingTime,
            products, ingredients
        } = data.recipes[recipeId];
        const productCount = products.find((p) => p.item === satisfyingItemId)?.amount ?? 1;

        const craftingSpeed = data.machines[machineId].speed;
        const craftsPerMinute = (neededItemRate * craftingTime) / productCount;
        const machineNeeded = craftsPerMinute / (craftingSpeed.base * 60);

        for (const { item, amount } of products) {
            const prevRate = currentNeeded.get(item) ?? 0;
            const newRate = prevRate - amount * craftsPerMinute;
            currentNeeded.set(
                item,
                Math.abs(newRate) < epsilon ? 0 : newRate
            );
        }

        for (const { item, amount } of ingredients) {
            const prevRate = currentNeeded.get(item) ?? 0;
            const newRate = prevRate + amount * craftsPerMinute;
            currentNeeded.set(
                item,
                Math.abs(newRate) < epsilon ? 0 : newRate
            );
        }
        machinesNeeded.push(machineNeeded);
    }

    return { machinesNeeded, remaining: currentNeeded };
} 