import {
  HStack,
  Heading,
  Icon,
  ResponsiveValue,
  Stack,
  SystemProps,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { Fragment, ReactNode, isValidElement } from "react";
import { InfoTooltip } from "../Tooltips/InfoTooltip";
import { LuMinus } from "react-icons/lu";

export const SectionItem = ({
  title,
  tooltip,
  value,
  align,
}: {
  title: string;
  tooltip?: string;
  value?: ReactNode | ReactNode[];
  align?: ResponsiveValue<SystemProps["alignItems"]>;
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
          <Wrap spacingX={8} spacingY={2} align={align as any}>
            {value.map((v, i) => (
              <Fragment key={i}>{v}</Fragment>
            ))}
          </Wrap>
        </>
      ) : (
        <Stack
          spacing={[0, null, 8]}
          align={[null, null, align || ("center" as any)]}
          direction={["column", null, "row"]}
        >
          <HStack w={[36, null, "2xs"]}>
            <Text as="b">{title}</Text>
            {tooltip && <InfoTooltip msg={tooltip} />}
          </HStack>
          {isValidElement(value) ? (
            value
          ) : (
            <Text overflowWrap="anywhere">{value}</Text>
          )}
        </Stack>
      )}
    </>
  );
};
