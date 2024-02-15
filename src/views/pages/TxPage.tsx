import { HexHighlightBadge } from "@/components/Badge/HexHighlightBadge";
import { SectionItem } from "@/components/BlockPage/SectionItem";
import { AppHeader, Section } from "@/components/common";
import { getChain } from "@/constants/web3";
import { IDetailedTransaction } from "@/interfaces/transaction";
import { getTx } from "@/services/tx";
import {
  Badge,
  Center,
  Code,
  Divider,
  HStack,
  Heading,
  Image,
  Stack,
  Text,
  chakra,
} from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import moment from "@/constants/moment";
import numbro from "numbro";
import { formatEther } from "viem";
import { PercentageBadge } from "@/components/Badge/PercentageBadge";

interface ITxPageProps {
  tx: IDetailedTransaction | null;
}

export const getServerSideProps = (async (
  context: GetServerSidePropsContext
) => {
  const { hash: h } = context.query;
  const hash = String(h);

  return {
    props: {
      tx: await getTx(hash),
    },
  };
}) satisfies GetServerSideProps<ITxPageProps>;

export const TxPage = ({ tx }: ITxPageProps) => {
  const chain = getChain(tx?.chain_id);

  return (
    <>
      <AppHeader
        title={
          !tx ? "Block not found" : `${chain?.name} Tx ${tx?.transaction_hash}`
        }
      />
      <Section>
        {!tx || !chain ? (
          <Center>Transaction not found</Center>
        ) : (
          (() => {
            return (
              <>
                <Heading>Transaction Detail</Heading>
                <Stack>
                  <SectionItem
                    title="Chain"
                    value={
                      <HStack>
                        <Image src={chain.icon} alt={chain.name} boxSize={4} />
                        <Text>
                          {chain.name}{" "}
                          <chakra.span as="i">({chain.id})</chakra.span>
                        </Text>
                      </HStack>
                    }
                  />
                  <SectionItem
                    title="Status"
                    value={
                      <Badge colorScheme={tx.error ? "red" : "green"}>
                        {tx.error || "Success"}
                      </Badge>
                    }
                  />
                  <SectionItem
                    title="Block Height"
                    value={
                      <HexHighlightBadge
                        href={`/block?chainId=${tx.chain_id}&number=${tx.block_number}`}
                      >
                        {tx.block_number}
                      </HexHighlightBadge>
                    }
                  />
                  <SectionItem
                    title="Timestamp"
                    value={`${moment(
                      tx.block_timestamp * 1000
                    ).fromNow()} | ${moment(
                      tx.block_timestamp * 1000
                    ).format()}`}
                  />
                  <SectionItem
                    title="Transaction Hash"
                    value={
                      <HexHighlightBadge isFull wrap>
                        {tx.transaction_hash}
                      </HexHighlightBadge>
                    }
                  />
                  <Divider my={4} />
                  <SectionItem
                    title="From"
                    value={
                      <HexHighlightBadge isFull wrap>
                        {tx.from_address}
                      </HexHighlightBadge>
                    }
                  />
                  <SectionItem
                    title="Interact With (To)"
                    value={
                      <HexHighlightBadge isFull wrap>
                        {tx.to_address}
                      </HexHighlightBadge>
                    }
                  />
                  <SectionItem
                    title="Related Contract"
                    tooltip="The contracts this transaction interacts with that are related to ZK/AA"
                    align="start"
                    value={
                      <Stack spacing={0}>
                        {tx.closest_address.map((a) => (
                          <HexHighlightBadge isFull wrap key={a}>
                            {a}
                          </HexHighlightBadge>
                        ))}
                      </Stack>
                    }
                  />
                  <Divider my={4} />
                  <SectionItem
                    title="Value"
                    value={`${numbro(formatEther(tx.value)).format({
                      mantissa: 18,
                      optionalMantissa: true,
                      thousandSeparated: true,
                    })} ${chain.nativeCurrency.symbol}`}
                  />
                  <Divider my={4} />
                  <SectionItem
                    title="Gas Used"
                    value={numbro(tx.gas_used_total).format({
                      thousandSeparated: true,
                    })}
                  />
                  <SectionItem
                    title="Gas Used By ZK/AA Contracts"
                    value={
                      <HStack>
                        <Text>
                          {numbro(tx.gas_used_first_degree).format({
                            thousandSeparated: true,
                          })}
                        </Text>
                        <PercentageBadge
                          value={tx.gas_used_first_degree / tx.gas_used_total}
                        />
                        {tx.gas_used_first_degree > tx.gas_used_total && (
                          <Badge colorScheme="red">Some Calls Reverted</Badge>
                        )}
                      </HStack>
                    }
                  />
                  <Divider my={4} />
                  <SectionItem
                    title="Type"
                    value={
                      <HStack>
                        {tx.ec_pairing_count > 0 && (
                          <Badge colorScheme="orange">ZK</Badge>
                        )}
                        {tx.ec_recover_addresses.length > 0 && (
                          <Badge colorScheme="cyan">AA</Badge>
                        )}
                      </HStack>
                    }
                  />
                  {tx.ec_pairing_count > 0 && (
                    <>
                      <SectionItem
                        title="Proof Verified"
                        value={tx.ec_pairing_count}
                      />
                    </>
                  )}
                  {tx.ec_recover_count > 0 && (
                    <>
                      <SectionItem
                        title="Account Recovered"
                        value={tx.ec_recover_count}
                      />
                      <SectionItem
                        title="Unique Account Recovered"
                        value={tx.ec_recover_addresses.length}
                      />
                      <SectionItem
                        title="Accounts"
                        align="start"
                        value={
                          <Stack spacing={0}>
                            {tx.ec_recover_addresses.map((a) => (
                              <HexHighlightBadge isFull wrap key={a}>
                                {a}
                              </HexHighlightBadge>
                            ))}
                          </Stack>
                        }
                      />
                    </>
                  )}
                </Stack>
                <Divider my={4} />
                <SectionItem
                  title="Function"
                  value={
                    <HexHighlightBadge>
                      {tx.function_name || tx.function_signature}
                    </HexHighlightBadge>
                  }
                />
                <SectionItem
                  title="Input"
                  align="start"
                  value={
                    <Code
                      overflowWrap="anywhere"
                      w={["full", null, "70%"]}
                      maxH="xs"
                      overflowY="auto"
                    >
                      {tx.input}
                    </Code>
                  }
                />
              </>
            );
          })()
        )}
      </Section>
    </>
  );
};
