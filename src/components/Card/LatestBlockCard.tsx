import { ILatestBlock } from "@/interfaces/block";
import { formatHex } from "@/utils/string";
import { Card, Circle, HStack, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import moment from "@/constants/moment";

export const LatestBlockCard = (block: ILatestBlock) => {
  const calculateSince = () => moment(block.timestamp * 1000).fromNow();

  const [since, setSince] = useState(calculateSince());

  useEffect(() => {
    const interval = setInterval(() => {
      setSince(calculateSince());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      key={block.hash}
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition="1s ease-in-out"
      p={2}
    >
      <HStack>
        <Circle bg="chakra-body-bg" size={12}>
          {block.chain_id}
        </Circle>
        <Stack spacing={0}>
          <Text>{block.number}</Text>
          <Text>Hash {formatHex(block.hash)}</Text>
          <Text>
            {block.transaction_count} txs | {block.related_transaction_count}{" "}
            related txs
          </Text>
          <Text as="i">Since {since}</Text>
        </Stack>
      </HStack>
    </Card>
  );
};
