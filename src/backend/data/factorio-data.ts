import rawData from './data.json';

function createInverseMapping<OutType = number, T extends string | number = string>(mapping: T[]) {
    return Object.fromEntries(mapping.map((entry, index) => [entry, index])) as Record<T, OutType>;
}
export type ItemId = number & { readonly __id_of: 'Item'; };
export type MachineId = number & { readonly __id_of: 'Machine'; };;
export type RecipeId = number & { readonly __id_of: 'Recipe'; };;

type Energy = {
    type: 'burner'; cost: number;
} | {
    type: 'electric'; activeCost: number; drain: number;
} | {
    type: 'food'; rate: number; item: ItemId;
};

type MutableFactorioData = {
    recipes: { [id in RecipeId]: {
        name: string;
        ingredients: { item: ItemId, amount: number; }[];
        products: { item: ItemId, amount: number; }[];
        machines: MachineId[];
        time: number;
        canTakeProductivityModules: boolean; // All false for now
        id: number;
    } };
    items: { [id in ItemId]: {
        name: string;
        recipesProducingThis: RecipeId[];
        recipesConsumingThis: RecipeId[];
        id: number;
    } };
    machines: { [id in MachineId]: {
        name: string;
        speed: { base: number; perQuality: number; };
        energy: Energy;
        moduleSlots: number;
        id: number;
    } };
    nameToIds: {
        items: Record<string, ItemId>;
    };
};

function toUniqueArray<T>(array: T[]) {
    return Array.from(new Set(array));
}

type RawRecipeData = ((typeof rawData.recipes)[number] & { name?: string; });

export function initializeData() {
    const itemNames = toUniqueArray(rawData.recipes.flatMap(({ ingredients, products }) => [
        ...ingredients.map(({ item }) => item),
        ...products.map(({ item }) => item)
    ]));

    const itemIds = createInverseMapping<ItemId>(itemNames);
    const categories = toUniqueArray([
        rawData.factories.flatMap(({ category }) => category),
        rawData.recipes.flatMap(({ category }) => category)
    ].flat(1));
    const machineIds = createInverseMapping<MachineId>(rawData.factories.map(({ name }) => name));
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
        machines: toUniqueArray(categories.flatMap(category => machinesPerCategory[category])),
        time,
        canTakeProductivityModules: false,
        id: index as RecipeId
    }));
    const recipeIds = createInverseMapping<RecipeId>(recipes.map(({ name }) => name));

    const items = itemNames.map((name, index) => ({
        name,
        recipesProducingThis: recipes
            .filter(({ products }) => products.some(({ item }) => item === index))
            .map(({ name }) => recipeIds[name]),
        recipesConsumingThis: recipes
            .filter(({ ingredients }) => ingredients.some(({ item }) => item === index))
            .map(({ name }) => recipeIds[name]),
        id: index as ItemId
    }));

    const machines = rawData.factories.map(({ name, speed, energy, moduleSlots }, index) => ({
        name,
        speed,
        energy,
        moduleSlots,
        id: index as MachineId
    }));

    const nameToIds = {
        items: itemIds,
    };

    const out = {
        recipes, items, machines, nameToIds
    } as DeepAsConst<MutableFactorioData>;
    console.log(out);
    return out;
}
export type FactorioData = DeepAsConst<MutableFactorioData>;


export type DeepAsConst<T> = T extends number ? T : // Account for branded type
    T extends object ?
    T extends Set<infer T> ? ReadonlySet<DeepAsConst<T>>
    : T extends Map<infer K, infer V> ? ReadonlyMap<K, DeepAsConst<V>>
    : T extends Array<infer T> ? ReadonlyArray<DeepAsConst<T>>
    : { readonly [K in keyof T]: DeepAsConst<T[K]> }
    : T;