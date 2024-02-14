import { ILatestTransaction } from "@/interfaces/transaction";
import { Badge, Card, Circle, HStack, Stack, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { formatEther } from "viem";
import { getChain } from "@/constants/web3";
import { HexHighlightBadge } from "../Badge/HexHighlightBadge";
import { ChainIcon } from "../Icon/ChainIcon";
import { useSince } from "@/hooks/useSince";

export const LatestTransactionCard = ({
  index,
  ...tx
}: { index: number } & ILatestTransaction) => {
  const since = useSince(tx.block_timestamp * 1000);

  return (
    <motion.div
      key={tx.transaction_hash}
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
            Tx
            <ChainIcon
              chainId={tx.chain_id}
              boxSize={6}
              pos="absolute"
              right={2}
              bottom={2}
              transform="translate(50%, 50%)"
            />
          </Circle>
          <Stack spacing={0}>
            <HStack>
              <HexHighlightBadge as="b">
                {tx.transaction_hash}
              </HexHighlightBadge>
              <Badge colorScheme={tx.error ? "red" : "green"}>
                {tx.error ?? "Success"}
              </Badge>
              {tx.ec_pairing_count > 0 && (
                <Badge colorScheme="orange">ZK</Badge>
              )}
              {tx.ec_recover_addresses.length > 0 && (
                <Badge colorScheme="cyan">AA</Badge>
              )}
            </HStack>
            <HStack>
              <Badge colorScheme="yellow" variant="outline">
                From
              </Badge>
              <HexHighlightBadge>{tx.from_address}</HexHighlightBadge>
              <Badge colorScheme="blue" variant="outline">
                To
              </Badge>
              <HexHighlightBadge>{tx.to_address}</HexHighlightBadge>
            </HStack>
            {tx.ec_recover_addresses.length > 0 && (
              <HStack>
                <Text color="cyan.300">
                  Related{" "}
                  <HexHighlightBadge>
                    {tx.ec_recover_addresses[0]}
                  </HexHighlightBadge>
                </Text>
                {tx.ec_recover_addresses.length > 1 && (
                  <Badge colorScheme="cyan">
                    +{tx.ec_recover_addresses.length - 1}
                  </Badge>
                )}
              </HStack>
            )}
            <HStack>
              <Text as="i" color="gray.200">
                Block{" "}
                <HexHighlightBadge
                  href={`/block?chainId=${tx.chain_id}&number=${tx.block_number}`}
                >
                  {tx.block_number}
                </HexHighlightBadge>{" "}
                Since {since}
              </Text>
              <Badge>
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
