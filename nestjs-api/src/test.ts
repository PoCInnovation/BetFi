import { Graph, Ipfs, Op } from '@graphprotocol/grc-20';

const ops: Array<Op> = [];

const { id: traderPropertyId, ops: createTraderPropertyOps } =
  Graph.createProperty({
    dataType: 'TEXT',
    name: 'Trader',
  });
ops.push(...createTraderPropertyOps);

const { id: statusPropertyId, ops: createStatusPropertyOps } =
  Graph.createProperty({
    dataType: 'TEXT',
    name: 'Status',
  });
ops.push(...createStatusPropertyOps);

const { id: descriptionPropertyId, ops: createDescriptionPropertyOps } =
  Graph.createProperty({
    dataType: 'TEXT',
    name: 'Description',
  });
ops.push(...createDescriptionPropertyOps);

const { id: riskPropertyId, ops: createRiskPropertyOps } = Graph.createProperty(
  {
    dataType: 'TEXT',
    name: 'Risk',
  },
);
ops.push(...createRiskPropertyOps);

const { id: createdAtPropertyId, ops: createCreatedAtPropertyOps } =
  Graph.createProperty({
    dataType: 'TIME',
    name: 'Created At',
  });
ops.push(...createCreatedAtPropertyOps);

const { id: strategyTypeId, ops: createStrategyTypeOps } = Graph.createType({
  name: 'Trading Strategy',
  properties: [
    traderPropertyId,
    statusPropertyId,
    descriptionPropertyId,
    riskPropertyId,
    createdAtPropertyId,
  ],
});
ops.push(...createStrategyTypeOps);

const values = [
  {
    property: traderPropertyId,
    value: 'Albert',
  },
  {
    property: statusPropertyId,
    value: 'Active',
  },
  {
    property: descriptionPropertyId,
    value: 'Description of the strategy',
  },
  {
    property: riskPropertyId,
    value: 'high',
  },
  {
    property: createdAtPropertyId,
    value: Graph.serializeDate(new Date()),
  },
];

const { id: strategyId, ops: createStrategyOps } = Graph.createEntity({
  name: `Strategy Albert`,
  cover: strategyTypeId,
  description: 'This is a strategy created by Albert',
  types: [strategyTypeId],
  values,
});
ops.push(...createStrategyOps);

console.log(`Strategy created with ID: ${strategyId}`);

const publishData = async () => {
  const result = await Ipfs.publishEdit({
    name: `Create Strategy: Albert`,
    ops: ops,
    author: '0xb57499CA50bEF730ADDEBdC402dD4cFabA6ECAd0' as `0x${string}`,
    network: 'TESTNET',
  });

  console.log(`Edit published with ID: ${result.cid}`);

  const spaceId = await Graph.createSpace({
    editorAddress:
      '0xb57499CA50bEF730ADDEBdC402dD4cFabA6ECAd0' as `0x${string}`,
    name: 'BetFi Trading Strategies',
    network: 'TESTNET',
  });
  
  console.log(`Space created with ID: ${spaceId.id}`);

  const res = await fetch(`https://hypergraph-v2-testnet.up.railway.app/space/${spaceId}/edit/calldata`, {
    method: "POST",
    body: JSON.stringify({ cid: result.cid }),
  });
  
  if (!res.ok) {
    throw new Error(`Failed to get transaction details: ${res.statusText}`);
  }

  const { to, data } = await res.json();

  console.log(`Transaction details: to=${to}, data=${data}`);

  /* const account = privateKeyToAccount(''); // replace with your private key
  const walletClient = createWalletClient({
    account,
    chain: {
      id: 11155111,
      name: 'sepolia',
      nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://rpc.sepolia.org'] },
      },
    },
    transport: http(),
  }); */

  /* const txResult = await walletClient.sendTransaction({
    to: to,
    value: 0n,
    data: data,
  }); */
};

publishData().then(() => {
  console.log('Data published successfully');
}).catch((error) => {
  console.error('Error publishing data:', error);
});
