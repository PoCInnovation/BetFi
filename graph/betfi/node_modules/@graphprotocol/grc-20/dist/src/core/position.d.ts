/**
 * This module provides utility functions for working with fractional indexes in TypeScript.
 *
 * @since 0.0.6
 */
export declare function generateBetween(first: string | null, second: string | null): string;
/**
 * Generates a random position with jittering.
 *
 * @returns A random position as a string.
 */
export declare function generate(): string;
type MaybePosition = string | null;
export declare function compare(a: MaybePosition, b: MaybePosition): number;
/**
 * Sorts a list of positions in ascending order. In
 * the knowledge graph positions are optional. This
 * function sorts null positions so they are always
 * at the bottom.
 *
 * @param positions - The list of positions to sort.
 * @returns The sorted list of positions.
 */
export declare function sort(positions: MaybePosition[]): MaybePosition[];
export {};
//# sourceMappingURL=position.d.ts.map