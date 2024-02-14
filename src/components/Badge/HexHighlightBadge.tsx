import { formatAddress } from "@/utils/address";
import { formatHex } from "@/utils/string";
import {
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  TextProps,
  chakra,
  useToast,
} from "@chakra-ui/react";
import { LuCopy } from "react-icons/lu";
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
  const toast = useToast();

  const isHighlighted = children?.toString() === highlight;

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
            children ? () => setHighlight(children.toString()) : undefined
          }
          onMouseLeave={clearHighlight}
          color={isHighlighted ? "yellow.300" : "inherit"}
          cursor={isHighlighted ? "pointer" : "default"}
          border="1px dashed"
          borderColor={isHighlighted ? "yellow.300" : "transparent"}
          borderRadius="md"
          w="fit-content"
          {...props}
        >
          {typeof children === "string"
            ? !children.startsWith("0x") || children.length < 12
              ? children
              : children.length > 44
              ? formatHex(children)
              : formatAddress(children)
            : children}
          {
            //isHighlighted && (
            //<chakra.span
            //display="inline-block"
            //verticalAlign={-2}
            //pl={1}
            //onClick={() => {
            //toast({
            //title: "Copied",
            //status: "success",
            //});
            //window.navigator.clipboard.writeText(children);
            //}}
            //>
            //<Icon as={LuCopy} boxSize={3} />
            //</chakra.span>
            //)
          }
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
