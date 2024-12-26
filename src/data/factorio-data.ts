import rawData from './data.json';

function createInverseMapping<T extends string | number>(mapping: T[]) {
    return Object.fromEntries(mapping.map((entry, index) => [entry, index])) as Record<T, number>;
}
export type ItemId = number;
export type MachineId = number;
export type RecipeId = number;

type Energy = {
    type: 'burner'; cost: number;
} | {
    type: 'electric'; activeCost: number; drain: number;
} | {
    type: 'food'; rate: number; item: ItemId;
};

type MutableFactorioData = {
    recipes: {
        name: string;
        ingredients: { item: ItemId, amount: number; }[];
        products: { item: ItemId, amount: number; }[];
        machines: MachineId[];
        time: number;
        canTakeProductivityModules: boolean; // All false for now
    }[];
    items: {
        name: string;
        recipesProducingThis: RecipeId[];
        recipesConsumingThis: RecipeId[];
    }[];
    machines: {
        name: string;
        speed: { base: number; perQuality: number; };
        energy: Energy;
        moduleSlots: number;
    }[];
    nameToIds: {
        items: Record<string, ItemId>;
    };
};

type RawRecipeData = ((typeof rawData.recipes)[number] & { name?: string; });

export function initializeData() {
    const itemNames = rawData.recipes.flatMap(({ ingredients, products }) => [
        ...ingredients.map(({ item }) => item),
        ...products.map(({ item }) => item)
    ]);
    const itemIds = createInverseMapping(itemNames);
    const categories = rawData.factories.flatMap(({ category }) => category);
    const machineIds = createInverseMapping(rawData.factories.map(({ name }) => name));
    const machinesPerCategory = Object.fromEntries(
        categories.map(category => [category, rawData.factories
            .filter(({ category: cat }) => cat.includes(category))
            .map(({ name }) => machineIds[name])
        ])
    );

    const recipes = (rawData.recipes as RawRecipeData[]).map(({ ingredients, products, time, name, category: categories }, index) => ({
        name: name ?? products[0].item,
        ingredients: ingredients.map(({ item, amount }) => ({ item: itemIds[item], amount })),
        products: products.map(({ item, amount }) => ({ item: itemIds[item], amount })),
        machines: categories.flatMap(category => machinesPerCategory[category]),
        time,
        canTakeProductivityModules: false
    }));
    const items = itemNames.map((name, index) => ({
        name,
        recipesProducingThis: recipes
            .filter(({ products }) => products.some(({ item }) => item === index))
            .map((_, index) => index),
        recipesConsumingThis: recipes
            .filter(({ ingredients }) => ingredients.some(({ item }) => item === index))
            .map((_, index) => index)
    }));

    const machines = rawData.factories.map(({ name, speed, energy, moduleSlots }) => ({
        name,
        speed,
        energy,
        moduleSlots
    }));

    const nameToIds = {
        items: itemIds,
    };

    return { recipes, items, machines, nameToIds } as DeepAsConst<MutableFactorioData>;
}
export type FactorioData = DeepAsConst<MutableFactorioData>;


export type DeepAsConst<T> = T extends object ?
    T extends Set<infer T> ? ReadonlySet<DeepAsConst<T>>
    : T extends Map<infer K, infer V> ? ReadonlyMap<K, DeepAsConst<V>>
    : T extends Array<infer T> ? ReadonlyArray<DeepAsConst<T>>
    : { readonly [K in keyof T]: DeepAsConst<T[K]> }
    : T;