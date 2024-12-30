export type EntryOf<T> = T extends (infer U)[] ? U :
    T extends ReadonlyArray<infer U> ? U :
    T extends Set<infer U> ? U :
    T extends ReadonlySet<infer U> ? U :
    T extends Map<infer K, infer U> ? [K, U] :
    T extends ReadonlyMap<infer K, infer U> ? [K, U] :
    never;