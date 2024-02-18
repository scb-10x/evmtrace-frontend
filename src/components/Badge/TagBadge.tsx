import {
  Badge,
  BadgeProps,
  ChakraComponent,
  Wrap,
  WrapProps,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import uniqolor from "uniqolor";
import tinycolor from "tinycolor2";
import { create } from "zustand";
import { motion } from "framer-motion";

const useHighlight = create<{
  highlight: string | null;
  setHighlight: (hex: string) => void;
  clearHighlight: () => void;
}>((set) => ({
  highlight: null,
  setHighlight: (hex) => set({ highlight: hex }),
  clearHighlight: () => set({ highlight: null }),
}));

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
  const { highlight, setHighlight, clearHighlight } = useHighlight();

  const [c, bg, hoverBg, clickBg] = useMemo(() => {
    const c = uniqolor(tag, {
      saturation: [40, 65],
      lightness: [55, 65],
    }).color;
    return [
      tinycolor(c).brighten().toString(),
      tinycolor(c).setAlpha(0.2).toString(),
      tinycolor(c).setAlpha(0.3).toString(),
      tinycolor(c).setAlpha(0.25).toString(),
    ] as const;
  }, []);

  useEffect(() => {
    return () => clearHighlight();
  }, []);

  return (
    <motion.div
      initial={{ borderColor: "transparent" }}
      animate={{
        scale: highlight === tag ? 1.2 : 1,
        borderColor:
          highlight === tag ? tinycolor(c).brighten().toString() : "#00000000",
      }}
      style={{
        border: "0.1em dashed",
        borderRadius: "0.3em",
        width: "fit-content",
      }}
    >
      <Badge
        color={c}
        bg={bg}
        fontSize="inherit"
        _hover={{
          bg: hoverBg,
        }}
        _active={{
          bg: clickBg,
        }}
        cursor="default"
        onMouseEnter={() => setHighlight(tag)}
        onMouseLeave={clearHighlight}
        {...props}
      >
        {tag}
      </Badge>
    </motion.div>
  );
}) as TagBadgeComponent;
