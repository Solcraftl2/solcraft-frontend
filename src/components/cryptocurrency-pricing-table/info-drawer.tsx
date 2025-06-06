import React, { Fragment } from 'react';
import { Close } from '@/components/icons/close';
import Button from '@/components/ui/button/button';
import Scrollbar from '@/components/ui/scrollbar';
import { CoinConverter } from '@/components/ui/transact-coin';
import CoinInfo from '@/components/cryptocurrency-pricing-table/coin-info';
import TopCoin from '@/components/cryptocurrency-pricing-table/top-coin';
import { Transition, TransitionChild } from '../ui/transition';
import { Dialog, DialogPanel } from '../ui/dialog';

interface CryptocurrencyDrawerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

function InfoDrawer({ isOpen, setIsOpen }: CryptocurrencyDrawerProps) {
  const handleClose = () => {
    setIsOpen(false);
  };

  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 !z-[999] h-full w-full overflow-y-auto overflow-x-hidden"
        onClose={handleClose}
      >
        <div className="min-h-screen flex-col items-center justify-center">
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-10 cursor-pointer bg-gray-700 bg-opacity-60 backdrop-blur" />
          </TransitionChild>

          {/* This element is need to fix FocusTap headless-ui warning issue */}
          <div className="sr-only">
            <button
              onClick={handleClose}
              className="opacity-50 hover:opacity-80 "
            >
              <Close className="h-auto w-[13px]" />
            </button>
          </div>

          <TransitionChild
            enter="transform transition ease-out duration-300"
            enterFrom="translate-x-full rtl:-translate-x-full"
            enterTo="translate-x-0 rtl:-translate-x-0"
            leave="transform transition ease-in duration-300"
            leaveFrom="translate-x-0 rtl:-translate-x-0"
            leaveTo="translate-x-full rtl:-translate-x-full"
          >
            <DialogPanel className="pointer-event-none relative !z-30 ms-auto h-screen w-[360px] overflow-hidden transition-all">
              <div className="h-full bg-white/95 shadow-[0_0_80px_rgba(17,24,39,0.2)] backdrop-blur dark:bg-dark/90">
                <div className="flex h-16 items-center justify-between gap-6 px-6">
                  <h3 className="text-base font-medium uppercase text-gray-900 dark:text-white"></h3>
                  <Button
                    title="Close"
                    color="white"
                    shape="circle"
                    variant="transparent"
                    size="small"
                    onClick={handleClose}
                  >
                    <Close className="h-auto w-2.5" />
                  </Button>
                </div>
                <Scrollbar style={{ height: 'calc(100% - 64px)' }}>
                  <h2 className="px-8 text-base font-medium uppercase text-gray-700 dark:text-gray-200">
                    Info
                  </h2>
                  <CoinInfo />
                  <div>
                    <span className="block border-t border-dashed border-t-gray-200 dark:border-t-gray-700" />
                    <CoinConverter />
                  </div>
                  <div className="px-8 pb-10">
                    <h2 className="text-base font-medium uppercase text-gray-700 dark:text-gray-200">
                      Top Coins
                    </h2>
                    <TopCoin />
                  </div>
                </Scrollbar>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

export default InfoDrawer;
