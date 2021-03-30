import Transaction from 'arweave/node/lib/transaction';
import Arweave from 'arweave';
interface UnformattedTag {
    name: string;
    value: string;
}
export declare function getTag(tx: Transaction, name: string): any;
/**
 * Unpacks string tags from a Tx and puts in a KV map
 * Tags that appear multiple times will be converted to an
 * array of string values, ordered as they appear in the tx.
 *
 * @param tx
 */
export declare function unpackTags(tx: Transaction): Record<string, string | string[]>;
export declare function formatTags(tags: UnformattedTag[]): Record<string, string | string[]>;
export declare function arrayToHex(arr: Uint8Array): string;
export declare function log(arweave?: Arweave, ...str: string[]): void;
export {};
