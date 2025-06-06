'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import TournamentCard from '@/components/ui/tournament-card-item';

interface Tournament {
  id: number;
  name: string;
  organizer: string;
  buyIn: number;
  prizePool: number;
  startTime: string;
  status: string;
  participants: number;
  maxParticipants: number;
  investmentPool: number;
  minInvestment: number;
  expectedROI: number;
  riskLevel: string;
  organizerRating: number;
  image?: string;
}

interface TournamentSliderProps {
  tournaments: Tournament[];
}

export default function TournamentSlider({ tournaments }: TournamentSliderProps) {
  return (
    <div className="tournament-slider">
      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
        className="!pb-12"
      >
        {tournaments.map((tournament) => (
          <SwiperSlide key={tournament.id}>
            <TournamentCard tournament={tournament} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

