import { Stack, StackProps } from "@chakra-ui/react";

export const LatestStackCustomScroll = (props: StackProps) => {
  return (
    <Stack
      maxH="lg"
      overflowY="auto"
      overflowX="hidden"
      sx={{
        "::-webkit-scrollbar": {
          WebkitAppearance: "none",
          width: "4px",
          bg: "transparent",
        },
        "::-webkit-scrollbar-thumb": {
          borderRadius: "4px",
          bg: "gray",
        },
      }}
      {...props}
    />
  );
};
