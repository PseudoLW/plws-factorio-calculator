
namespace ImmutableSet {
    export function add<T>(set: ReadonlySet<T>, value: T) {
        const newSet = new Set(set);
        newSet.add(value);
        return newSet;
    }
    export function sub<T>(set: ReadonlySet<T>, value: T) {
        const newSet = new Set(set);
        newSet.delete(value)
        return newSet;
    }
}

namespace ImmutableArray {
    type Arr<T> = ReadonlyArray<T>
    export function add<T>(arr: Arr<T>, value: T) {
        return [...arr, value];
    }
    export function sub<T>(arr: Arr<T>, value: T) {
        const newArr = arr.slice()
        const deletedIndex = arr.indexOf(value);
        newArr.splice(deletedIndex, 1)
        return newArr;
    }

}

export default { Set: ImmutableSet, Array: ImmutableArray };