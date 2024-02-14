import { ILatestBlock } from "@/interfaces/block";
import { formatHex } from "@/utils/string";
import { Badge, Card, Circle, HStack, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import moment from "@/constants/moment";
import { HexHighlightBadge } from "../Badge/HexHighlightBadge";
import { ChainIcon } from "../Icon/ChainIcon";
import { useSince } from "@/hooks/useSince";

export const LatestBlockCard = ({
  index,
  ...block
}: { index: number } & ILatestBlock) => {
  const since = useSince(block.timestamp * 1000);

  return (
    <motion.div
      key={block.hash}
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        delay: index * 0.02,
        duration: 0.5,
      }}
    >
      <Card p={2}>
        <HStack>
          <Circle bg="chakra-body-bg" size={12} pos="relative">
            Bk
            <ChainIcon
              chainId={block.chain_id}
              boxSize={6}
              pos="absolute"
              right={2}
              bottom={2}
              transform="translate(50%, 50%)"
            />
          </Circle>
          <Stack spacing={0}>
            <HStack>
              <HexHighlightBadge
                href={`/block?chainId=${block.chain_id}&number=${block.number}`}
              >
                {block.number}
              </HexHighlightBadge>
              <Badge>{block.transaction_count} Txs</Badge>
              <Badge colorScheme="pink">
                {block.related_transaction_count} Related Txs
              </Badge>
            </HStack>
            <Text>
              Hash <HexHighlightBadge>{block.hash}</HexHighlightBadge>
            </Text>
            <Text as="i" color="gray.200">
              Since {since}
            </Text>
          </Stack>
        </HStack>
      </Card>
    </motion.div>
  );
};
