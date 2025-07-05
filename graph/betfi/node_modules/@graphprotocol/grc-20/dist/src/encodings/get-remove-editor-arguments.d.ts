import { VoteOption } from '../types.js';
export declare function getRemoveEditorArguments({ votingPluginAddress, ipfsUri, editorAddress, }: {
    votingPluginAddress: `0x${string}`;
    ipfsUri: `ipfs://${string}`;
    editorAddress: `0x${string}`;
}): readonly [`0x${string}`, readonly [{
    readonly to: `0x${string}`;
    readonly value: bigint;
    readonly data: `0x${string}`;
}], bigint, VoteOption.Yes, true];
//# sourceMappingURL=get-remove-editor-arguments.d.ts.map