import { encodeFunctionData, stringToHex } from 'viem';
import { MainVotingAbi } from '../abis/index.js';
import { VoteOption } from '../types.js';
export function getRemoveEditorArguments({ votingPluginAddress, ipfsUri, editorAddress, }) {
    return [
        stringToHex(ipfsUri),
        [
            {
                to: votingPluginAddress,
                value: BigInt(0),
                data: encodeFunctionData({
                    abi: MainVotingAbi,
                    functionName: 'removeMember',
                    args: [editorAddress],
                }),
            },
        ],
        BigInt(0),
        VoteOption.Yes,
        true,
    ];
}
//# sourceMappingURL=get-remove-editor-arguments.js.map