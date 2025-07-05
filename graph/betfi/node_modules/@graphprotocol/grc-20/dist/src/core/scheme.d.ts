/**
 * This module provides utility functions for working with Graph URIs in TypeScript.
 *
 * @since 0.0.6
 */
import type { GraphUri } from '../types.js';
type SchemeQueryParams = {
    spaceId?: string;
};
/**
 * Encodes an entity id into a Graph URI. Optionally, you can specify a space id to be included in the URI.
 *
 * @example
 * ```ts
 * const uri = GraphUrl.fromEntityId('entity-id');
 * console.log(uri); // graph://entity-id
 *
 * const uriWithSpaceId = GraphUrl.fromEntityId('entity-id', { spaceId: 'space-id' });
 * console.log(uriWithSpaceId); // graph://entity-id?s=space-id
 * ```
 *
 * @param entityId base58 encoded v4 uuid
 * @param params optional params: {@link SchemeQueryParams}
 * @returns Graph URI: {@link GraphUri}
 */
export declare function fromEntityId(entityId: string, params?: SchemeQueryParams): GraphUri;
/**
 * Returns true if the provided value is a valid Graph URI.
 *
 * @example
 * ```ts
 * const shouldBeTrue = GraphUrl.isValid('graph://entity-id');
 * console.log(shouldBeTrue); // true
 *
 * const shouldBeFalse = GraphUrl.isValid('entity-id');
 * console.log(shouldBeFalse); // false
 * ```
 *
 * @param value – Graph URI: {@link GraphUri}
 * @returns – `true` if the value is a valid Graph URI, `false` otherwise
 */
export declare function isValid(value: string): value is GraphUri;
/**
 * Decodes the entity id from a Graph URI. Throws an error if the URI is not valid.
 *
 * @example
 * ```ts
 * const entityId = GraphUrl.toEntityId('graph://entity-id');
 * console.log(entityId); // entity-id
 *
 * const entityIdWithSpaceId = GraphUrl.toEntityId('graph://entity-id?s=space-id');
 * console.log(entityIdWithSpaceId); // entity-id
 *
 * const entityId = GraphUrl.toEntityId('invalid-uri'); // throws
 * ```
 *
 * @param uri – Graph URI: {@link GraphUri}
 * @returns – base58 encoded v4 uuid representing an entity
 * @throws Error if the URI is not valid
 */
export declare function toEntityId(uri: GraphUri): string;
/**
 * Decodes the space id from a Graph URI. Throws an error if the URI is not valid.
 *
 * @example
 * ```ts
 * const spaceId = GraphUrl.toSpaceId('graph://entity-id?s=space-id');
 * console.log(spaceId); // space-id
 *
 * const spaceId = GraphUrl.toSpaceId('graph://entity-id'); // throws
 * ```
 *
 * @param uri – Graph URI: {@link GraphUri}
 * @returns – base58 encoded v4 uuid representing a space
 */
export declare function toSpaceId(uri: GraphUri): string | null;
export {};
//# sourceMappingURL=scheme.d.ts.map