import {
  Badge,
  BadgeProps,
  ChakraComponent,
  Wrap,
  WrapProps,
} from "@chakra-ui/react";
import { useMemo } from "react";
import uniqolor from "uniqolor";
import tinycolor from "tinycolor2";

export const TagsBadge = ({
  tags,
  fallback,
  badgeProps,
  ...props
}: {
  tags?: string[];
  fallback?: JSX.Element;
  badgeProps?: BadgeProps;
} & WrapProps) => {
  if (!tags?.length) return fallback || null;
  return (
    <Wrap {...props}>
      {tags.map((t, i) => (
        <TagBadge tag={t} key={i} fontSize={props.fontSize} {...badgeProps} />
      ))}
    </Wrap>
  );
};

type TagBadgeComponent = ChakraComponent<
  "div",
  {
    tag: string;
  }
>;
export const TagBadge = (({ tag, ...props }: { tag: string } & BadgeProps) => {
  const [c, bg] = useMemo(() => {
    const c = uniqolor(tag, {
      saturation: [40, 65],
      lightness: [55, 65],
    }).color;
    return [
      tinycolor(c).brighten().toString(),
      tinycolor(c).setAlpha(0.2).toString(),
    ] as const;
  }, []);

  return (
    <Badge color={c} bg={bg} fontSize="inherit" {...props}>
      {tag}
    </Badge>
  );
}) as TagBadgeComponent;
