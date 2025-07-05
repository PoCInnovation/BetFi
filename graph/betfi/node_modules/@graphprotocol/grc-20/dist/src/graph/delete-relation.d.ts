import type { CreateResult, DeleteRelationParams } from '../types.js';
/**
 * Deletes a relation.
 *
 * @example
 * ```ts
 * const { ops } = await deleteRelation({ id: relationId });
 * ```
 *
 * @param params – {@link DeleteRelationParams}
 * @returns The operations to delete the relation.
 */
export declare const deleteRelation: ({ id }: DeleteRelationParams) => CreateResult;
//# sourceMappingURL=delete-relation.d.ts.map