import rawData from './data.json';

class EnumTracker {
    private map = new Map<string, number>();
    add(item: string) {
        if (!this.map.has(item)) this.map.set(item, this.map.size);
    }
    get(item: string) {
        return this.map.get(item);
    }
    getReverseMapping() {
        const entries = new Array<string>(this.map.size);
        for (const [recipe, id] of this.map) {
            entries[id] = recipe;
        }
        return entries;
    }
    getMapping() {
        return this.map as Map<string, number>;
    }
}

export function initializeData() {
    const itemIds = new EnumTracker();
    const categoryIds = new EnumTracker();
    for (const { ingredients, products, category } of rawData.recipes) {
        for (const { item } of ingredients) {
            itemIds.add(item);
        }
        for (const { item } of products) {
            itemIds.add(item);
        }
        for (const cat of category) {
            categoryIds.add(cat);
        }
    }
    for (const { category } of rawData.factories) {
        for (const cat of category) {
            categoryIds.add(cat);
        }
    }

    const itemNames = itemIds.getReverseMapping();
    const categoryNames = categoryIds.getReverseMapping();
    const itemIdMap = itemIds.getMapping();
    const possibleCrafts = new Map<number, Set<number>>(
        [...itemIdMap.values()].map((id) => [id, new Set<number>()])
    );
    const recipeData: {
        ingredients: { itemId: number, amount: number; }[];
        products: { itemId: number, amount: number; }[];
        categories: number[];
        time: number;
        name: string;
    }[] = [];
    type RawRecipeData = ((typeof rawData.recipes)[number] & { name?: string; });
    (rawData.recipes as RawRecipeData[]).forEach(({ ingredients, products, category, time, name }, index) => {
        recipeData.push({
            ingredients: ingredients.map(({ item, amount }) => ({ itemId: itemIds.get(item)!, amount })),
            products: products.map(({ item, amount }) => ({ itemId: itemIds.get(item)!, amount })),
            categories: category.map(category => categoryIds.get(category)!),
            time,
            name: name ?? products[0].item
        });
        for (const { item } of products) {
            possibleCrafts.get(itemIdMap.get(item)!)!.add(index);
        }
    });

    type Energy = {
        type: 'burner', cost: number;
    } | {
        type: 'electric', activeCost: number, drain: number;
    };
    const machineData: {
        category: Set<number>,
        productivity: number,
        energy: Energy,
        speed: { base: number, perQuality: number; };
        name: string;
    }[] = [];
    for (const { name, category, productivity = 0, energy, speed } of rawData.factories) {
        machineData.push({
            category: new Set(category.map(cat => categoryIds.get(cat)!)),
            productivity,
            energy: energy as Energy,
            speed, name
        });
    }

    const out = {
        recipes: recipeData,
        categoryNames,
        machines: machineData,
        itemIds: itemIds.getMapping(), itemNames,
        possibleCrafts
    };
    return out as DeepAsConst<typeof out>;
}

export type FactorioData = ReturnType<typeof initializeData>;
type DeepAsConst<T> = T extends object ?
    T extends Set<infer T> ? ReadonlySet<DeepAsConst<T>>
    : T extends Map<infer K, infer V> ? ReadonlyMap<K, DeepAsConst<V>>
    : T extends Array<infer T> ? ReadonlyArray<DeepAsConst<T>>
    : { readonly [K in keyof T]: DeepAsConst<T[K]> }
    : T;