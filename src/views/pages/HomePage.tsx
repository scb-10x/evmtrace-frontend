import {
  Text,
  Heading,
  Stack,
  SimpleGrid,
  Button,
  Wrap,
  Image,
} from "@chakra-ui/react";
import { Section, AppHeader } from "@/components/common";
import _ from "lodash";
import { DESCRIPTION, TITLE } from "@/constants/texts";
import { getLatestBlocks, getLatestTxs } from "@/services/latest";
import { ILatestTransaction } from "@/interfaces/transaction";
import { ILatestBlock } from "@/interfaces/block";
import { AnimatePresence } from "framer-motion";
import { LatestBlockCard } from "@/components/Card/LatestBlockCard";
import { LatestTransactionCard } from "@/components/Card/LatestTransactionCard";
import { LatestStackCustomScroll } from "@/components/HomePage/LatestStackCustomScroll";
import { chains } from "@/constants/web3";
import { useLatest } from "@/hooks/useLatest";
import Link from "next/link";

export async function getServerSideProps() {
  const [txs, blocks] = await Promise.all([getLatestTxs(), getLatestBlocks()]);

  return {
    props: {
      txs,
      blocks,
    },
  };
}

export const HomePage = ({
  txs: initialTxs,
  blocks: initialBlocks,
}: {
  txs: ILatestTransaction[];
  blocks: ILatestBlock[];
}) => {
  const { txs, blocks } = useLatest({
    initialBlocks,
    initialTxs,
  });

  return (
    <>
      <AppHeader title="Home" />
      <Section>
        <Stack align="center" textAlign="center">
          <Heading>{TITLE}</Heading>
          <Text>{DESCRIPTION}</Text>
          <Heading size="md">Supported Chains</Heading>
          <Wrap align="center" justify="center" w="100%">
            {chains.map((c) => (
              <Image key={c.id} src={c.icon} boxSize={8} alt={c.name} />
            ))}
          </Wrap>
        </Stack>
        <SimpleGrid columns={[1, null, 2]} spacing={[4, null, 2]}>
          <Stack>
            <Heading size="md">Latest Blocks</Heading>
            <LatestStackCustomScroll>
              <AnimatePresence>
                {blocks.slice(0, 7).map((block, i) => (
                  <LatestBlockCard key={block.hash} index={i} {...block} />
                ))}
              </AnimatePresence>
            </LatestStackCustomScroll>
            <Button as={Link} href="/latest/blocks">
              View All Latest Blocks
            </Button>
          </Stack>
          <Stack>
            <Heading size="md">Latest Transactions</Heading>
            <LatestStackCustomScroll>
              <AnimatePresence>
                {txs.slice(0, 7).map((tx, i) => (
                  <LatestTransactionCard
                    key={tx.transaction_hash}
                    index={i}
                    {...tx}
                  />
                ))}
              </AnimatePresence>
            </LatestStackCustomScroll>
            <Button as={Link} href="/latest/txs">
              View All Latest Transactions
            </Button>
          </Stack>
        </SimpleGrid>
      </Section>
    </>
  );
};
