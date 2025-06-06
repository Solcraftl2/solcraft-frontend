'use client';

import cn from '@/utils/cn';
import Avatar from '@/components/ui/avatar';
import TopupButton from '@/components/ui/topup-button';
import VolumeChart from '@/components/ui/chats/volume-chart';
import OverviewChart from '@/components/ui/chats/overview-chart';
import LiquidityChart from '@/components/ui/chats/liquidity-chart';
import TournamentTable from '@/components/tournament/tournament-table';
import InvestmentTable from '@/components/investment/investment-table';
import TournamentSlider from '@/components/ui/tournament-card';
import { tournamentSlideData } from '@/data/static/tournament-slide-data';

//images
import AuthorImage from '@/assets/images/author.jpg';

export default function SolCraftDashboard() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="mb-8 w-full sm:mb-0 sm:w-1/2 md:w-[calc(100%-256px)] lg:w-[calc(100%-288px)] 2xl:w-[calc(100%-320px)] 3xl:w-[calc(100%-358px)] sm:ltr:pr-6 sm:rtl:pl-6">
          <TournamentSlider tournaments={tournamentSlideData} />
        </div>
        <div className="w-full sm:w-1/2 md:w-64 lg:w-72 2xl:w-80 3xl:w-[358px]">
          <div className="flex h-full flex-col justify-center rounded-lg bg-white p-6 shadow-card dark:bg-light-dark xl:p-8">
            <Avatar
              image={AuthorImage}
              alt="User"
              className="mx-auto mb-6"
              size="lg"
            />
            <h3 className="mb-2 text-center text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 3xl:mb-3">
              Portfolio Value
            </h3>
            <div className="mb-7 text-center font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl 3xl:mb-8 3xl:text-[32px]">
              $25,430
            </div>
            <TopupButton />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:my-10 md:grid-cols-2">
        <LiquidityChart 
          title="Tournament Liquidity"
          description="Total available investment pool"
        />
        <VolumeChart 
          title="Investment Volume"
          description="24h investment activity"
        />
      </div>

      <div className="my-8 sm:my-10">
        <TournamentTable />
      </div>

      <div className="flex flex-wrap">
        <div
          className={cn(
            'w-full lg:w-[calc(100%-288px)] 2xl:w-[calc(100%-320px)] 3xl:w-[calc(100%-358px)] ltr:lg:pr-6 rtl:lg:pl-6',
          )}
        >
          <InvestmentTable />
        </div>
        <div
          className={cn(
            'order-first mb-8 grid w-full grid-cols-1 gap-6 sm:mb-10 sm:grid-cols-2 lg:order-1 lg:mb-0 lg:flex lg:w-72 lg:flex-col 2xl:w-80 3xl:w-[358px]',
          )}
        >
          <OverviewChart 
            title="ROI Overview"
            description="Investment performance"
          />
          <div className="rounded-lg bg-white p-6 shadow-card dark:bg-light-dark">
            <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Top Organizers
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">PokerPro</p>
                    <p className="text-xs text-gray-500">95% Success Rate</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-500">+24.5%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-teal-600"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">ChampionAce</p>
                    <p className="text-xs text-gray-500">88% Success Rate</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-500">+18.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">TourneyKing</p>
                    <p className="text-xs text-gray-500">82% Success Rate</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-500">+15.8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

