import { HStack, Heading, Icon, Text, Wrap } from "@chakra-ui/react";
import { Fragment, ReactNode } from "react";
import { InfoTooltip } from "../Tooltips/InfoTooltip";
import { LuMinus } from "react-icons/lu";

export const SectionItem = ({
  title,
  tooltip,
  value,
}: {
  title: string;
  tooltip?: string;
  value?: ReactNode | ReactNode[];
}) => {
  const isList = Array.isArray(value);
  return (
    <>
      {isList ? (
        <>
          <HStack>
            <Icon as={LuMinus} />
            <Heading size="md">{title}</Heading>
            {tooltip && <InfoTooltip msg={tooltip} />}
          </HStack>
          <Wrap spacingX={8} spacingY={2}>
            {value.map((v, i) => (
              <Fragment key={i}>{v}</Fragment>
            ))}
          </Wrap>
        </>
      ) : (
        <Wrap spacingX={8} spacingY={0} align="center">
          <HStack w={[24, null, 36]}>
            <Text as="b">{title}</Text>
            {tooltip && <InfoTooltip msg={tooltip} />}
          </HStack>
          <Text overflowWrap="anywhere">{value}</Text>
        </Wrap>
      )}
    </>
  );
};
