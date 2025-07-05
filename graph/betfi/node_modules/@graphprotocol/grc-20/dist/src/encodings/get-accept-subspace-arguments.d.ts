import { VoteOption } from '../types.js';
export declare function getAcceptSubspaceArguments({ spacePluginAddress, ipfsUri, subspaceToAccept, }: {
    spacePluginAddress: `0x${string}`;
    ipfsUri: `ipfs://${string}`;
    subspaceToAccept: `0x${string}`;
}): readonly [`0x${string}`, readonly [{
    readonly to: `0x${string}`;
    readonly value: bigint;
    readonly data: `0x${string}`;
}], bigint, VoteOption.Yes, true];
//# sourceMappingURL=get-accept-subspace-arguments.d.ts.map