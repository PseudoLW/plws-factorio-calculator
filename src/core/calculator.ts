import { FactorioData } from "../data/factorio-data";

export function breakdownLinear(
    needed: { itemId: number; rate: number; }[],
    recipes: {
        recipeId: number;
        satisfyingItemId: number;
        selectedMachineId: number;
    }[],
    data: FactorioData
) {
    const currentNeeded = new Map<number, number>(needed.map(
        ({ itemId, rate }) => [itemId, rate]
    ));
    const machinesNeeded: number[] = [];
    for (const { recipeId, satisfyingItemId, selectedMachineId: machineId } of recipes) {
        const satisfyingItemRate = currentNeeded.get(satisfyingItemId) ?? 0;
        const {
            time: craftingTime,
            products, ingredients
        } = data.recipes[recipeId];
        const productCount = products.find((p) => p.item === satisfyingItemId)?.amount ?? 1;

        const craftingSpeed = data.machines[machineId].speed;
        const machineNeeded = (satisfyingItemRate * craftingTime) / (craftingSpeed.base * productCount * 60);
        const epsilon = 0.0000001;
        for (const { item, amount } of products) {
            const prevRate = currentNeeded.get(item) ?? 0;
            const newRate = prevRate - (60 * amount) / (satisfyingItemRate * craftingTime);
            currentNeeded.set(
                item,
                Math.abs(newRate) < epsilon ? 0 : newRate
            );
        }

        for (const { item, amount } of ingredients) {
            const prevRate = currentNeeded.get(item) ?? 0;
            const newRate = prevRate + (60 * amount) / (satisfyingItemRate * craftingTime);
            currentNeeded.set(
                item,
                Math.abs(newRate) < epsilon ? 0 : newRate
            );
        }

        machinesNeeded.push(machineNeeded);
    }
    return { machinesNeeded, remaining: currentNeeded };
} 