import { ILatestBlock } from "@/interfaces/block";
import { formatHex } from "@/utils/string";
import { Card, Circle, HStack, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import moment from "@/constants/moment";
import { HexHighlightBadge } from "../Badge/HexHighlightBadge";

export const LatestBlockCard = ({
  index,
  ...block
}: { index: number } & ILatestBlock) => {
  const calculateSince = () => moment(block.timestamp * 1000).fromNow();

  const [since, setSince] = useState(calculateSince());

  useEffect(() => {
    const interval = setInterval(() => {
      setSince(calculateSince());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={block.hash}
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
            {block.chain_id}
          </Circle>
          <Stack spacing={0}>
            <Text>{block.number}</Text>
            <Text>
              Hash <HexHighlightBadge>{block.hash}</HexHighlightBadge>
            </Text>
            <Text>
              {block.transaction_count} txs | {block.related_transaction_count}{" "}
              related txs
            </Text>
            <Text as="i">Since {since}</Text>
          </Stack>
        </HStack>
      </Card>
    </motion.div>
  );
};
