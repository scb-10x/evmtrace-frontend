import { ILatestTransaction } from "@/interfaces/transaction";
import { formatAddress } from "@/utils/address";
import { formatHex } from "@/utils/string";
import { Badge, Card, Circle, HStack, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import moment from "@/constants/moment";
import { formatEther } from "viem";
import { getChain } from "@/constants/web3";

export const LatestTransactionCard = (tx: ILatestTransaction) => {
  const calculateSince = () => moment(tx.block_timestamp * 1000).fromNow();

  const [since, setSince] = useState(calculateSince());

  useEffect(() => {
    const interval = setInterval(() => {
      setSince(calculateSince());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      key={tx.transaction_hash}
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition="1s ease-in-out"
      p={2}
    >
      <HStack>
        <Circle bg="chakra-body-bg" size={12}>
          {tx.chain_id}
        </Circle>
        <Stack spacing={0}>
          <HStack>
            <Text>{formatHex(tx.transaction_hash)}</Text>
            <Badge fontSize="sm" colorScheme={tx.error ? "red" : "green"}>
              {tx.error ?? "Success"}
            </Badge>
          </HStack>
          <Text>
            From {formatAddress(tx.from_address)} To{" "}
            {formatAddress(tx.to_address)}
          </Text>
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
  );
};
