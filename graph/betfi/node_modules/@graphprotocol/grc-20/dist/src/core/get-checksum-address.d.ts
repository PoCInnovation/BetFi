/**
 * Different implementations of the address across wallet libraries and
 * ethereum clients don't always return the same address checksum.
 *
 * We map addresses in the sink to the checksum address. This ensures we
 * have consistent addresses throughout the data service and also aligns
 * with how addresses are represented on Polygonscan.
 */
export declare function getChecksumAddress(address: string): `0x${string}`;
//# sourceMappingURL=get-checksum-address.d.ts.map