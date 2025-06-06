import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { arbitrum, mainnet } from '@reown/appkit/networks';

export const projectId = process.env.NEXT_PUBLIC_CRYPTO_PROJECT_ID || '';

export const wagmiMetaData = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, arbitrum],
  projectId,
});
