import OrganizerVerification from '@/components/organizer/organizer-verification';

export default function OrganizerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Become a Tournament Organizer
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join SolCraft as a verified tournament organizer and start creating profitable poker tournaments
          </p>
        </div>
        
        <OrganizerVerification />
      </div>
    </div>
  );
}

