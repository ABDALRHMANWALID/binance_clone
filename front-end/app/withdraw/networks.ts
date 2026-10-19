export const NETWORKS: Record<number, { name: string; explorer: string }> = {
  1: { name: "Ethereum", explorer: "https://etherscan.io" },
  11155111: { name: "Sepolia", explorer: "https://sepolia.etherscan.io" },
};

export const networkName = (chainId: number) =>
  NETWORKS[chainId]?.name ?? `Chain ${chainId}`;

export const txUrl = (chainId: number, txHash: string) =>
  NETWORKS[chainId] ? `${NETWORKS[chainId].explorer}/tx/${txHash}` : null;
