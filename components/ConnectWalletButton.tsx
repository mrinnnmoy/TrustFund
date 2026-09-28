"use client";

import { useState } from "react";
import {
  useConnect,
  useDisconnect,
  type UiWallet,
} from "@wallet-standard/react";
import { Button } from "./ui/Button";
import { useWallet, useWallets } from "./WalletProvider";

function WalletOption({
  wallet,
  onConnected,
}: {
  wallet: UiWallet;
  onConnected: (wallet: UiWallet, address: string) => void;
}) {
  const [isConnecting, connect] = useConnect(wallet);

  async function handleConnect() {
    const accounts = await connect();

    if (accounts.length > 0) {
      onConnected(wallet, accounts[0].address);
    }
  }

  return (
    <button
      type="button"
      disabled={isConnecting}
      onClick={handleConnect}
      className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-sm hover:bg-[var(--color-ink-10)] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {/* Wallet Standard provides wallet icons dynamically at runtime. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={wallet.icon}
        alt=""
        className="h-5 w-5"
      />
      <span>{isConnecting ? "Connecting..." : wallet.name}</span>
    </button>
  );
}

function ConnectedWalletButton({
  wallet,
  className,
}: {
  wallet: UiWallet;
  className?: string;
}) {
  const [isDisconnecting, disconnectWallet] = useDisconnect(wallet);
  const { address, disconnect } = useWallet();

  async function handleDisconnect() {
    await disconnectWallet();
    disconnect();
  }

  return (
    <Button
      variant="secondary"
      className={className}
      disabled={isDisconnecting}
      onClick={handleDisconnect}
    >
      {isDisconnecting
        ? "Disconnecting..."
        : address
          ? `${address.slice(0, 4)}...${address.slice(-4)}`
          : "Disconnect"}
    </Button>
  );
}

export function ConnectWalletButton({
  className,
}: {
  className?: string;
}) {
  const discoveredWallets = useWallets();

  const { selectedWallet, selectWallet } = useWallet();
  const [open, setOpen] = useState(false);

  const wallets = discoveredWallets.filter(
    (wallet) =>
      wallet.chains.some((chain) => chain.startsWith("solana:")) &&
      wallet.features.includes("standard:connect") &&
      wallet.features.includes("standard:disconnect"),
  );

  if (selectedWallet) {
    return (
      <ConnectedWalletButton
        wallet={selectedWallet}
        className={className}
      />
    );
  }

  return (
    <div className="relative">
      <Button
        className={className}
        onClick={() => setOpen((current) => !current)}
      >
        Connect Wallet
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 min-w-[200px] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-paper)] p-2 shadow-sm">
          {wallets.length === 0 ? (
            <p className="p-2 text-sm text-[var(--color-muted)]">
              No Wallet Standard wallets found.
            </p>
          ) : (
            wallets.map((wallet) => (
              <WalletOption
                key={`${wallet.name}-${wallet.chains.join(",")}`}
                wallet={wallet}
                onConnected={(connectedWallet, address) => {
                  selectWallet(connectedWallet, address);
                  setOpen(false);
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
