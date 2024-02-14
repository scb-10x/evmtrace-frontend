import { ILatestTransaction } from "@/interfaces/transaction";
import { formatAddress } from "@/utils/address";
import { formatHex } from "@/utils/string";
import { Badge, Card, Circle, HStack, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import moment from "@/constants/moment";
import { formatEther } from "viem";
import { getChain } from "@/constants/web3";
import { HexHighlightBadge } from "../Badge/HexHighlightBadge";

export const LatestTransactionCard = ({
  index,
  ...tx
}: { index: number } & ILatestTransaction) => {
  const calculateSince = () => moment(tx.block_timestamp * 1000).fromNow();

  const [since, setSince] = useState(calculateSince());

  useEffect(() => {
    const interval = setInterval(() => {
      setSince(calculateSince());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={tx.transaction_hash}
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "spring",
        delay: index * 0.02,
        duration: 0.5,
      }}
    >
      <Card p={2}>
        <HStack>
          <Circle bg="chakra-body-bg" size={12}>
            {tx.chain_id}
          </Circle>
          <Stack spacing={0}>
            <HStack>
              <HexHighlightBadge>{tx.transaction_hash}</HexHighlightBadge>
              <Badge fontSize="sm">{tx.transaction_index}</Badge>
              <Badge fontSize="sm" colorScheme={tx.error ? "red" : "green"}>
                {tx.error ?? "Success"}
              </Badge>
              {tx.ec_pairing_count > 0 && (
                <Badge fontSize="sm" colorScheme="orange">
                  ZK
                </Badge>
              )}
              {tx.ec_recover_addresses.length > 0 && (
                <Badge fontSize="sm" colorScheme="cyan">
                  AA
                </Badge>
              )}
            </HStack>
            <Text>
              From <HexHighlightBadge>{tx.from_address}</HexHighlightBadge> To{" "}
              <HexHighlightBadge>{tx.to_address}</HexHighlightBadge>
            </Text>
            {tx.ec_recover_addresses.length > 0 && (
              <HStack>
                <Text color="cyan.300">
                  Related{" "}
                  <HexHighlightBadge>
                    {tx.ec_recover_addresses[0]}
                  </HexHighlightBadge>
                </Text>
                {tx.ec_recover_addresses.length > 1 && (
                  <Badge fontSize="sm" colorScheme="cyan">
                    +{tx.ec_recover_addresses.length - 1}
                  </Badge>
                )}
              </HStack>
            )}
            <HStack>
              <Text as="i">Since {since}</Text>
              <Badge fontSize="sm">
                {formatEther(tx.value)}{" "}
                {getChain(tx.chain_id)?.nativeCurrency.symbol}
              </Badge>
            </HStack>
          </Stack>
        </HStack>
      </Card>
    </motion.div>
  );
};
