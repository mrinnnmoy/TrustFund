import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL!;
const wsUrl = rpcUrl.replace(/^http/, "ws");

export const rpc = createSolanaRpc(rpcUrl);
export const rpcSubscriptions = createSolanaRpcSubscriptions(wsUrl);
