import { formatAddress } from "@/utils/address";
import { formatHex } from "@/utils/string";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  TextProps,
  chakra,
} from "@chakra-ui/react";
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
    <Popover
      trigger="hover"
      isLazy
      openDelay={0}
      returnFocusOnClose={false}
      computePositionOnMount={false}
      autoFocus={false}
      eventListeners={false}
    >
      <PopoverTrigger>
        <chakra.span
          transition="0.2s ease-in-out all"
          onMouseEnter={
            typeof children === "string"
              ? () => setHighlight(children)
              : undefined
          }
          onMouseLeave={clearHighlight}
          color={isHighlighted ? "yellow.300" : "inherit"}
          cursor={isHighlighted ? "pointer" : "default"}
          border="1px dashed"
          borderColor={isHighlighted ? "yellow.300" : "transparent"}
          borderRadius="md"
          {...props}
        >
          {typeof children === "string"
            ? children.length > 44
              ? formatHex(children)
              : formatAddress(children)
            : children}
        </chakra.span>
      </PopoverTrigger>
      <Portal>
        <PopoverContent w="fit-content">
          <Text p={1}>{children}</Text>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
