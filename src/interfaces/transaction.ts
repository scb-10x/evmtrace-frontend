import { Address, Hex } from "viem";

export interface ITransaction {
  chain_id: number;
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

export type IBlockTransaction = ITransaction & {
  gas_used_total: number;
  gas_used_first_degree: number;
};

export type ILatestTransaction = ITransaction & {
  block_number: number;
  block_timestamp: number;
};
