import { HStack, Heading, Text, Wrap } from "@chakra-ui/react";
import { Fragment, ReactNode } from "react";
import { InfoTooltip } from "../Tooltips/InfoTooltip";

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
        <Wrap spacingX={8} spacingY={2}>
          <HStack w={24}>
            <Text as="b">{title}</Text>
            {tooltip && <InfoTooltip msg={tooltip} />}
          </HStack>
          <Text overflowWrap="anywhere">{value}</Text>
        </Wrap>
      )}
    </>
  );
};
