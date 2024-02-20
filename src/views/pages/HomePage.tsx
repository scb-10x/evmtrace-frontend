import {
  Text,
  Heading,
  Stack,
  SimpleGrid,
  Button,
  Wrap,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  InputRightElement,
  IconButton,
  chakra,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { Section, AppHeader } from "@/components/common";
import _ from "lodash";
import { DESCRIPTION } from "@/constants/texts";
import { AnimatePresence } from "framer-motion";
import { LatestBlockCard } from "@/components/Card/LatestBlockCard";
import { LatestTransactionCard } from "@/components/Card/LatestTransactionCard";
import { LatestStackCustomScroll } from "@/components/HomePage/LatestStackCustomScroll";
import { chains } from "@/constants/web3";
import { useLatest } from "@/hooks/useLatest";
import Link from "next/link";
import { LuArrowRight, LuSearch } from "react-icons/lu";
import { useState } from "react";
import { useRouter } from "next/router";
import { MainLogo } from "@/components/common/MainLogo";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getAllTags } from "@/services/tag";
import { InfoTooltip } from "@/components/Tooltips/InfoTooltip";
import { TagBadge } from "@/components/Badge/TagBadge";
import { IAggregatedTag } from "@/interfaces/tag";
import numbro from "numbro";
import { getTxCount } from "@/services/stats";
import { ITxCountStats } from "@/interfaces/stats";
import { TxCountChart } from "@/components/Chart/TxCountChart";
import { SearchInput } from "@/components/Input/SearchInput";

interface IHomePageProps {
  allTags: IAggregatedTag[] | null;
  txCount: ITxCountStats[] | null;
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  // 4 hours
  context.res.setHeader("Cache-Control", "max-age=14400");

  const [allTags, txCount] = await Promise.all([getAllTags(), getTxCount()]);
  return {
    props: {
      allTags,
      txCount,
    },
  };
}) satisfies GetServerSideProps<IHomePageProps>;

export const HomePage = ({ allTags, txCount }: IHomePageProps) => {
  const { txs, blocks } = useLatest({
    initialBlocks: [],
    initialTxs: [],
  });

  return (
    <>
      <AppHeader title="Home" />
      <Section>
        <Stack align="center" textAlign="center">
          <MainLogo boxSize={24} />
          <Heading>
            <chakra.span color="primary.400">evm</chakra.span>trace
          </Heading>
          <Text>{DESCRIPTION}</Text>
          <Heading size="md">Supported Chains</Heading>
          <Wrap align="center" justify="center" w="100%">
            {chains.map((c) => (
              <Image key={c.id} src={c.icon} boxSize={8} alt={c.name} />
            ))}
          </Wrap>
        </Stack>

        <SearchInput hasDetails />

        {txCount?.length && (
          <Stack>
            <HStack>
              <Heading size="md">Transaction Count</Heading>
              <InfoTooltip msg="Related transaction counts over 5 days period" />
            </HStack>
            <TxCountChart stats={txCount} />
          </Stack>
        )}

        <Stack>
          <HStack>
            <Heading size="md">Discover Tags</Heading>
            <InfoTooltip msg="Discover related contracts by our tags" />
          </HStack>
          <Wrap fontSize={["md", "lg"]}>
            {allTags?.map((t) => (
              <Badge py={1} px={1} fontSize={["sm", "md"]} key={t.tag}>
                {numbro(t.count).format({ thousandSeparated: true })}{" "}
                <TagBadge key={t.tag} tag={t.tag} cursor="pointer" isLink />
              </Badge>
            ))}
          </Wrap>
        </Stack>

        <SimpleGrid columns={[1, null, 2]} spacing={[4, null, 2]}>
          <Stack>
            <Heading size="md">Latest Blocks</Heading>
            <LatestStackCustomScroll>
              <AnimatePresence>
                {blocks.slice(0, 12).map((block, i) => (
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
                {txs.slice(0, 10).map((tx, i) => (
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
