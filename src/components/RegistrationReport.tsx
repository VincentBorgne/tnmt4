import React, { useMemo, useState, useEffect } from 'react';
import { CheckCircleIcon, CreditCardIcon } from 'lucide-react';
import Flag from './common/Flag';
import { registrationApi, TOURNAMENT_ID } from '../api/config';

// Types
interface Player {
  name: string;
  flag: string;
  level: number;
  paid: boolean;
}

interface Registration {
  id: number;
  category: string;
  level: string;
  team: Player[];
}

// Team tile component
const TeamTile = ({ team }: { team: Player[] }) => {
  const totalLevel = team.reduce((sum, player) => sum + player.level, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center mb-3">
        <span className="text-sm font-medium text-gray-500">
          Team Level: {totalLevel.toFixed(1)}
        </span>
      </div>
      <div className="space-y-2">
        {team.map((player, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-6 h-6 flex items-center justify-center">
              <Flag nationality={player.flag} />
            </div>
            <span className="text-sm font-medium">{player.name}</span>
            <span className="text-xs text-gray-500 ml-auto">
              {player.level.toFixed(1)}
            </span>
            <div>
              {player.paid ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <CreditCardIcon className="h-5 w-5 text-yellow-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RegistrationReport = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  // Fetch registrations on mount
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const data = await registrationApi.getReport(TOURNAMENT_ID);
        setRegistrations(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError('Failed to load registrations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  // Filter registrations based on selected filters
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((registration) => {
      const matchesCategory =
        !categoryFilter || registration.category === categoryFilter;
      const matchesLevel = !levelFilter || registration.level === levelFilter;
      return matchesCategory && matchesLevel;
    });
  }, [registrations, categoryFilter, levelFilter]);

  // Group registrations by category and level
  const groupedRegistrations = useMemo(() => {
    const groups: Record<string, Registration[]> = {};
    filteredRegistrations.forEach((registration) => {
      const groupKey = `${registration.category} ${registration.level}`;
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(registration);
    });
    return groups;
  }, [filteredRegistrations]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-gray-500">Loading registrations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Registration Report
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  categoryFilter === ''
                    ? 'bg-[#C4E42E] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCategoryFilter('Men')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  categoryFilter === 'Men'
                    ? 'bg-[#C4E42E] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Men
              </button>
              <button
                onClick={() => setCategoryFilter('Women')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  categoryFilter === 'Women'
                    ? 'bg-[#C4E42E] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Women
              </button>
              <button
                onClick={() => setCategoryFilter('Mixed')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  categoryFilter === 'Mixed'
                    ? 'bg-[#C4E42E] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Mixed
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Level</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setLevelFilter('')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  levelFilter === ''
                    ? 'bg-[#C4E42E] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setLevelFilter('Bronze')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  levelFilter === 'Bronze'
                    ? 'bg-[#C4E42E] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🟤 Bronze
              </button>
              <button
                onClick={() => setLevelFilter('Silver')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  levelFilter === 'Silver'
                    ? 'bg-[#C4E42E] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ⚪️ Silver
              </button>
              <button
                onClick={() => setLevelFilter('Platinum')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  levelFilter === 'Platinum'
                    ? 'bg-[#C4E42E] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔘 Platinum
              </button>
              <button
                onClick={() => setLevelFilter('Elite')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  levelFilter === 'Elite'
                    ? 'bg-[#C4E42E] text-black'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔴 Elite
              </button>
            </div>
          </div>
        </div>

        {/* Registration Groups */}
        <div className="space-y-8">
          {Object.keys(groupedRegistrations).length > 0 ? (
            Object.entries(groupedRegistrations).map(
              ([groupKey, registrations]) => (
                <div key={groupKey}>
                  <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    {groupKey}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {registrations.map((registration) => (
                      <TeamTile
                        key={registration.id}
                        team={registration.team}
                      />
                    ))}
                  </div>
                </div>
              )
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                No registrations match the selected filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationReport;