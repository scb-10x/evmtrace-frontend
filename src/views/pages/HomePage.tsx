import { Text, Heading, Stack, SimpleGrid } from "@chakra-ui/react";
import { Section, Navbar, Footer, AppHeader } from "@/components/common";
import _ from "lodash";
import { DESCRIPTION, TITLE } from "@/constants/texts";
import {
  getLatestBlocks,
  getLatestTxs,
  getSseLatestBlocks,
  getSseLatestTxs,
} from "@/services/latest";
import { ILatestTransaction } from "@/interfaces/transaction";
import { ILatestBlock } from "@/interfaces/block";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { LatestBlockCard } from "@/components/Card/LatestBlockCard";
import { LatestTransactionCard } from "@/components/Card/LatestTransactionCard";
import { LatestStackCustomScroll } from "@/components/HomePage/LatestStackCustomScroll";

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
  const [txs, setTxs] = useState<ILatestTransaction[]>(initialTxs);
  const [blocks, setBlocks] = useState<ILatestBlock[]>(initialBlocks);

  useEffect(() => {
    const blockSse = getSseLatestBlocks();
    const txsSse = getSseLatestTxs();

    blockSse.onmessage = (event) => {
      setBlocks(JSON.parse(event.data).data);
    };
    txsSse.onmessage = (event) => {
      setTxs(JSON.parse(event.data).data);
    };

    return () => {
      blockSse.close();
      txsSse.close();
    };
  }, []);

  return (
    <>
      <AppHeader title="Home" />
      <Section>
        <Navbar />
        <Stack spacing={4}>
          <Stack align="center">
            <Heading>{TITLE}</Heading>
            <Text>{DESCRIPTION}</Text>
          </Stack>
          <SimpleGrid columns={[1, null, 2]} spacing={[4, null, 2]}>
            <Stack>
              <Heading size="md">Latest Blocks</Heading>
              <LatestStackCustomScroll>
                <AnimatePresence>
                  {blocks.map((block, i) => (
                    <LatestBlockCard key={block.hash} index={i} {...block} />
                  ))}
                </AnimatePresence>
              </LatestStackCustomScroll>
            </Stack>
            <Stack>
              <Heading size="md">Latest Transactions</Heading>
              <LatestStackCustomScroll>
                <AnimatePresence>
                  {txs.map((tx, i) => (
                    <LatestTransactionCard
                      key={tx.transaction_hash}
                      index={i}
                      {...tx}
                    />
                  ))}
                </AnimatePresence>
              </LatestStackCustomScroll>
            </Stack>
          </SimpleGrid>
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
