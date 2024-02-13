import { Text, TextProps, chakra } from "@chakra-ui/react";
import { Address, Hex } from "viem";
import { create } from "zustand";

const useHighlight = create<{
  highlight: string | null;
  setHighlight: (hex: string) => void;
  clearHighlight: () => void;
}>((set) => ({
  highlight: null,
  setHighlight: (hex) => set({ highlight: hex }),
  clearHighlight: () => set({ highlight: null }),
}));

export const HexHighlightBadge = ({ children, ...props }: TextProps) => {
  const { highlight, setHighlight, clearHighlight } = useHighlight();

  const isHighlighted = typeof children === "string" && children === highlight;

  return (
    <chakra.span
      onMouseEnter={
        typeof children === "string" ? () => setHighlight(children) : undefined
      }
      onMouseLeave={clearHighlight}
      transition="0.2s ease-in-out all"
      color={isHighlighted ? "yellow.300" : "inherit"}
      cursor={isHighlighted ? "pointer" : "default"}
      border="1px dashed"
      borderColor={isHighlighted ? "yellow.300" : "transparent"}
      borderRadius="md"
      {...props}
    >
      {children}
    </chakra.span>
  );
};
