import { encodeFunctionData, stringToHex } from 'viem';
import { SpaceAbi } from '../abis/index.js';
import { VoteOption } from '../types.js';
export function getAcceptSubspaceArguments({ spacePluginAddress, ipfsUri, subspaceToAccept, }) {
    return [
        stringToHex(ipfsUri),
        [
            {
                to: spacePluginAddress,
                value: BigInt(0),
                data: encodeFunctionData({
                    abi: SpaceAbi,
                    functionName: 'acceptSubspace',
                    args: [subspaceToAccept],
                }),
            },
        ],
        BigInt(0),
        VoteOption.Yes,
        true,
    ];
}
//# sourceMappingURL=get-accept-subspace-arguments.js.map