'use client';

import { useAppKit } from '@reown/appkit/react';
import Image from '@/components/ui/image';
import metamaskLogo from '@/assets/images/metamask.svg';

export default function SelectWallet({ ...props }) {
  const { open } = useAppKit();

  return (
    <div
      className="relative z-50 mx-auto w-[440px] max-w-full rounded-lg bg-white px-9 py-16 dark:bg-light-dark"
      {...props}
    >
      <h2 className="mb-4 text-center text-2xl font-medium uppercase text-gray-900 dark:text-white">
        Connect Wallet
      </h2>
      <p className="text-center text-sm leading-loose tracking-tight text-gray-600 dark:text-gray-400">
        By connecting your wallet, you agree to our Terms of Service and our
        Privacy Policy.
      </p>

      <div
        onClick={() => open()}
        className="mt-12 flex h-14 w-full cursor-pointer items-center justify-between rounded-lg bg-gradient-to-l from-[#ffdc24] to-[#ff5c00] px-4 text-base text-white transition-all hover:-translate-y-0.5"
      >
        <span>MetaMask</span>
        <span className="h-auto w-9">
          <Image src={metamaskLogo} alt="metamask" width={36} />
        </span>
      </div>
    </div>
  );
}
