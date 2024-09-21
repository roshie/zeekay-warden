"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";


import {
  DynamicContextProvider
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';

import {
  createConfig,
  WagmiProvider,
} from 'wagmi';

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { http, createClient } from 'viem';  
import { sepolia } from 'viem/chains';
import { getOrMapViemChain } from "@dynamic-labs/ethereum-core";


const queryClient = new QueryClient();

const customEvmNetworks = [
  {
    blockExplorerUrls: ["https://explorer-holesky.morphl2.io/"],
    chainId: 2810,
    name: "Morph",
    rpcUrls: ["https://rpc-quicknode-holesky.morphl2.io"],
    iconUrls: ["https://avatars.githubusercontent.com/u/132543920?v=4"],
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    networkId: 2810,
  },
];

const config = createConfig({
  chains: [sepolia, ...customEvmNetworks.map(getOrMapViemChain)],
  multiInjectedProviderDiscovery: false,
  client({ chain }) {
    return createClient({
      chain,
      transport: http(),
    });
  },
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: process.env.DYNAMIC_ENV_ID || "088e4772-f833-4aea-97d0-e05455ab03ba",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
          </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
    </DynamicContextProvider>

  );
}
