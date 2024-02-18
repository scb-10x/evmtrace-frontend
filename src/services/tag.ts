import { ITag } from "@/interfaces/tag";
import axios from "axios";
import { Address } from "viem";

export const getTags = async (addresses: Address[]): Promise<ITag[] | null> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/tag/${addresses.join(
    ","
  )}`;
  try {
    return await axios.get(url).then((res) => res.data?.data || null);
  } catch (e) {
    console.error(e);
    return null;
  }
};
