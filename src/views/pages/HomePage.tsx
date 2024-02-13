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
        <Stack>
          <Heading>{TITLE}</Heading>
          <Text>{DESCRIPTION}</Text>
          <SimpleGrid columns={[1, null, 2]} spacing={2}>
            <Stack>
              <Heading size="md">Latest Blocks</Heading>
              <Stack
                maxH="lg"
                overflowY="auto"
                sx={{
                  "::-webkit-scrollbar": {
                    WebkitAppearance: "none",
                    width: "4px",
                    bg: "transparent",
                  },
                  "::-webkit-scrollbar-thumb": {
                    borderRadius: "4px",
                    bg: "gray",
                  },
                }}
              >
                <AnimatePresence>
                  {blocks.map((block) => (
                    <LatestBlockCard key={block.hash} {...block} />
                  ))}
                </AnimatePresence>
              </Stack>
            </Stack>
            <Stack>
              <Heading size="md">Latest Transactions</Heading>
              <Stack
                maxH="lg"
                overflowY="auto"
                sx={{
                  "::-webkit-scrollbar": {
                    WebkitAppearance: "none",
                    width: "4px",
                    bg: "transparent",
                  },
                  "::-webkit-scrollbar-thumb": {
                    borderRadius: "full",
                    bg: "gray",
                  },
                }}
              >
                <AnimatePresence>
                  {txs.map((tx) => (
                    <LatestTransactionCard key={tx.transaction_hash} {...tx} />
                  ))}
                </AnimatePresence>
              </Stack>
            </Stack>
          </SimpleGrid>
        </Stack>
        <Footer />
      </Section>
    </>
  );
};
