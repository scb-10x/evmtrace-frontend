import { Badge, BadgeProps, Wrap, WrapProps } from "@chakra-ui/react";
import { useMemo } from "react";
import uniqolor from "uniqolor";
import tinycolor from "tinycolor2";

export const TagsBadge = ({
  tags,
  fallback,
  ...props
}: {
  tags?: string[];
  fallback?: JSX.Element;
} & WrapProps) => {
  if (!tags?.length) return fallback || null;
  return (
    <Wrap {...props}>
      {tags.map((t, i) => (
        <TagBadge tag={t} key={i} fontSize={props.fontSize} />
      ))}
    </Wrap>
  );
};

export const TagBadge = ({ tag, ...props }: { tag: string } & BadgeProps) => {
  const [c, bg] = useMemo(() => {
    const c = uniqolor(tag).color;
    return [
      tinycolor(c).brighten().toString(),
      tinycolor(c).setAlpha(0.2).toString(),
    ] as const;
  }, []);

  return (
    <Badge color={c} bg={bg} {...props}>
      {tag}
    </Badge>
  );
};
