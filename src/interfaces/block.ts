import { Hex } from "viem";

export interface ILatestBlock {
  chain_id: string;
  number: number;
  timestamp: number;
  hash: Hex;
  transaction_count: number;
  related_transaction_count: number;
}
