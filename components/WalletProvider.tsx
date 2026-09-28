"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useWallets } from "@wallet-standard/react";

type Wallet = ReturnType<typeof useWallets>[number];

interface WalletContextValue {
  selectedWallet: Wallet | null;
  address: string | null;
  selectWallet: (wallet: Wallet, address: string) => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      selectedWallet,
      address,
      selectWallet: (wallet: Wallet, walletAddress: string) => {
        setSelectedWallet(wallet);
        setAddress(walletAddress);
      },
      disconnect: () => {
        setSelectedWallet(null);
        setAddress(null);
      },
    }),
    [selectedWallet, address],
  );

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }

  return context;
}

export { useWallets };
