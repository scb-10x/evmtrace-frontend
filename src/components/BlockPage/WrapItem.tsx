import { HStack, Stack, Text } from "@chakra-ui/react";
import { InfoTooltip } from "../Tooltips/InfoTooltip";
import { ReactNode } from "react";

export const WrapItem = ({
  title,
  value,
  tooltip,
  suffix,
}: {
  title: ReactNode;
  value: string | number;
  tooltip?: string;
  suffix?: ReactNode;
}) => {
  return (
    <Stack spacing={0}>
      <HStack as="b">
        <Text whiteSpace="pre-wrap">{title}</Text>
        {tooltip && <InfoTooltip msg={tooltip} />}
        {suffix && suffix}
      </HStack>
      <Text fontSize="xl">{value}</Text>
    </Stack>
  );
};
