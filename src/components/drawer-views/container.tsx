'use client';

import { Fragment, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { Dialog, DialogPanel } from '@/components/ui/dialog';
import { Transition, TransitionChild } from '@/components/ui/transition';
import { DRAWER_VIEW, useDrawer } from '@/components/drawer-views/context';
import { useLayout } from '@/lib/hooks/use-layout';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import { defaultMenuItems } from '@/layouts/sidebar/_menu-items';
import { Close } from '../icons/close';

// dynamic imports
const Sidebar = dynamic(() => import('@/layouts/sidebar/_default'));
const DrawerFilters = dynamic(() => import('@/components/search/filters'));
const DrawerMenu = dynamic(() => import('@/layouts/sidebar/_layout-menu'));
const PreviewContent = dynamic(
  () => import('@/components/create-nft/nft-preview-content'),
);

function renderDrawerContent(view: DRAWER_VIEW | string) {
  switch (view) {
    case 'DEFAULT_SIDEBAR':
      return <Sidebar />;
    case 'RETRO_SIDEBAR':
      return (
        <Sidebar
          layoutOption={`/${LAYOUT_OPTIONS.RETRO}`}
          menuItems={defaultMenuItems}
        />
      );
    case 'CLASSIC_SIDEBAR':
      return (
        <DrawerMenu
          layoutOption={`/${LAYOUT_OPTIONS.CLASSIC}`}
          menuItems={defaultMenuItems}
        />
      );
    case 'DRAWER_SEARCH':
      return <DrawerFilters />;
    case 'DRAWER_PREVIEW_NFT':
      return <PreviewContent />;
    default:
      return <DrawerMenu />;
  }
}

export default function DrawersContainer() {
  const layoutOptions = Object.values(LAYOUT_OPTIONS);
  const pathname = usePathname();
  const layoutSegmentFromURL = pathname!.split('/')[1];
  const searchParams = useSearchParams();
  const { view, isOpen, closeDrawer } = useDrawer();
  const { setLayout } = useLayout();

  // set initial layout on component mount
  useEffect(() => {
    const initialLayout = layoutOptions.find(
      (layout) => layout === layoutSegmentFromURL,
    );
    setLayout(() => initialLayout ?? layoutOptions[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 !z-[999] h-full w-full overflow-y-auto overflow-x-hidden"
        onClose={closeDrawer}
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
              onClick={closeDrawer}
              className="opacity-50 hover:opacity-80 "
            >
              <Close className="h-auto w-[13px]" />
            </button>
          </div>

          <TransitionChild
            enter="transform transition ease-out duration-300"
            enterFrom="-translate-x-full rtl:translate-x-full"
            enterTo="translate-x-0"
            leave="rtl:transform transition ease-in duration-300"
            leaveFrom="rtl:translate-x-0 -translate-x-0"
            leaveTo="rtl:translate-x-full -translate-x-full"
          >
            <DialogPanel className="pointer-event-none relative !z-30 me-auto h-screen w-80 overflow-hidden transition-all">
              <div className="h-full bg-white/95 shadow-[0_0_80px_rgba(17,24,39,0.2)] backdrop-blur dark:bg-dark/90">
                {view && renderDrawerContent(view)}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
