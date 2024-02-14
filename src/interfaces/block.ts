import { Hex } from "viem";

export interface ILatestBlock {
  chain_id: number;
  number: number;
  timestamp: number;
  hash: Hex;
  transaction_count: number;
  related_transaction_count: number;
  gas_limit: number;
  gas_used: number;
}
