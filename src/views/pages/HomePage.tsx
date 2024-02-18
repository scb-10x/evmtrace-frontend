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
import { GetServerSideProps } from "next";
import { getAllTags } from "@/services/tag";
import { InfoTooltip } from "@/components/Tooltips/InfoTooltip";
import { TagBadge } from "@/components/Badge/TagBadge";

interface IHomePageProps {
  allTags: string[] | null;
}

export const getServerSideProps = (async () => {
  const allTags = await getAllTags();
  return {
    props: {
      allTags,
    },
  };
}) satisfies GetServerSideProps<IHomePageProps>;

export const HomePage = ({ allTags }: IHomePageProps) => {
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
        {(() => {
          const router = useRouter();
          const [input, setInput] = useState("");
          return (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (input) {
                  if (input.length === 66) {
                    router.push(`/tx/${input}`);
                  } else if (input.length === 42) {
                    router.push(`/address/${input}`);
                  } else if (input.split("/").length === 2) {
                    const [chainId, blockNumber] = input.split("/");
                    if (blockNumber) {
                      router.push(
                        `/block?chainId=${chainId}&number=${blockNumber}`
                      );
                    }
                  }
                }
              }}
            >
              <Stack align="center" spacing={1} textAlign="center">
                <InputGroup w={["full", null, "lg"]} variant="filled">
                  <InputLeftElement>
                    <Icon as={LuSearch} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search by block number, tx hash or address"
                    _focus={{
                      bg: "whiteAlpha.100",
                      border: "1 solid",
                      borderColor: "whiteAlpha.50",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <InputRightElement>
                    <IconButton
                      icon={<Icon as={LuArrowRight} />}
                      aria-label="Search"
                      variant="ghost"
                      type="submit"
                    />
                  </InputRightElement>
                </InputGroup>
                <Text fontSize="sm" color="gray.200" as="i">
                  {"{chainId}/{blockNumber} or {txHash} or {address}"}
                </Text>
              </Stack>
            </form>
          );
        })()}

        <Stack>
          <HStack>
            <Heading size="md">Discover Tags</Heading>
            <InfoTooltip msg="Discover related contracts by our tags" />
          </HStack>
          <Wrap fontSize={["md", "lg"]}>
            {allTags?.map((t) => (
              <TagBadge key={t} tag={t} as={Link} href={`/tag/${t}`} />
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
