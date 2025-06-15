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
import { apiService, Tournament } from '@/services/apiService';
import { useState, useEffect } from 'react';

//images
import AuthorImage from '@/assets/images/author.jpg';

export default function SolCraftDashboard() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPortfolio, setUserPortfolio] = useState(0); // Portfolio reale utente

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Carica tornei reali
      const apiTournaments = await apiService.getTournaments();
      setTournaments(apiTournaments);
      
      // TODO: Caricare portfolio reale utente
      // Per ora mostra 0 per utente nuovo
      setUserPortfolio(0);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setTournaments([]);
      setUserPortfolio(0);
    } finally {
      setLoading(false);
    }
  };

  // Trasforma i dati API per il TournamentSlider
  const transformedTournaments = tournaments.map((tournament, index) => ({
    id: parseInt(tournament.id.split('-')[0], 16), // Converte UUID in numero per compatibilità
    name: tournament.name,
    organizer: 'Unknown Organizer', // TODO: Aggiungere organizer al backend
    buyIn: parseFloat(tournament.buy_in),
    prizePool: parseFloat(tournament.total_prize),
    startTime: tournament.start_date,
    status: tournament.status,
    participants: 0, // TODO: Aggiungere participants al backend
    maxParticipants: tournament.max_participants || 100,
    investmentPool: parseFloat(tournament.total_prize) * 0.1,
    minInvestment: Math.max(parseFloat(tournament.buy_in) * 0.1, 25),
    expectedROI: Math.random() * 20 + 5, // TODO: Calcolo ROI reale
    riskLevel: parseFloat(tournament.buy_in) > 1000 ? 'high' : parseFloat(tournament.buy_in) > 100 ? 'medium' : 'low',
    organizerRating: 4.0 + Math.random() * 1,
    image: `/images/tournaments/tournament-${index + 1}.jpg`
  }));
  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap">
            <div className="mb-8 w-full sm:mb-0 sm:w-1/2 md:w-[calc(100%-256px)] lg:w-[calc(100%-288px)] 2xl:w-[calc(100%-320px)] 3xl:w-[calc(100%-358px)] sm:ltr:pr-6 sm:rtl:pl-6">
              <TournamentSlider tournaments={transformedTournaments} />
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
                  ${userPortfolio.toLocaleString()}
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
                  {tournaments.length > 0 ? (
                    tournaments.slice(0, 3).map((tournament, index) => (
                      <div key={tournament.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`h-8 w-8 rounded-full bg-gradient-to-r ${
                            index === 0 ? 'from-blue-500 to-purple-600' :
                            index === 1 ? 'from-green-500 to-teal-600' :
                            'from-orange-500 to-red-600'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {tournament.name.split(' ')[0]} Organizer
                            </p>
                            <p className="text-xs text-gray-500">Active Tournament</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-500">Active</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No organizers available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

