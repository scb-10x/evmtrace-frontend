import { Address, Hex } from "viem";

export interface ILatestTransaction {
  chain_id: number;
  block_number: number;
  block_timestamp: number;
  transaction_hash: Hex;
  transaction_index: number;
  from_address: Address;
  to_address: Address;
  value: bigint;
  error?: string;
  ec_pairing_count: number;
  ec_recover_addresses: Address[];
  function_signature: string;
  function_name?: string;
}
