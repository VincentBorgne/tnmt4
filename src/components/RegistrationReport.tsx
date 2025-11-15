import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircleIcon, CreditCardIcon } from 'lucide-react';
import Flag from './common/Flag';
import { registrationApi } from '../api/config';

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

interface ReportData {
  teams: Registration[];
  availableCategories: string[];
  availableLevels: string[];
}

// Team tile component
const TeamTile = ({ team }: { team: Player[] }) => {
  const totalLevel = team.reduce((sum, player) => sum + (player.level || 0), 0);
  
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
              {player.level ? player.level.toFixed(1) : 'N/A'}
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

// Helper function to capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const RegistrationReport = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  // Fetch registrations on mount or when tournamentId changes
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!tournamentId) {
        setError('No tournament ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await registrationApi.getReport(tournamentId);
        setReportData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch registrations:', err);
        setError('Failed to load registrations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [tournamentId]);

  // Auto-reset filters if they're no longer available
  useEffect(() => {
    if (!reportData) return;

    if (categoryFilter && !reportData.availableCategories.includes(categoryFilter.toLowerCase())) {
      setCategoryFilter('');
    }
    if (levelFilter && !reportData.availableLevels.includes(levelFilter.toLowerCase())) {
      setLevelFilter('');
    }
  }, [reportData, categoryFilter, levelFilter]);

  // Filter registrations based on selected filters
  const filteredRegistrations = useMemo(() => {
    if (!reportData) return [];
    
    return reportData.teams.filter((registration) => {
      const matchesCategory =
        !categoryFilter || registration.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesLevel = !levelFilter || registration.level.toLowerCase() === levelFilter.toLowerCase();
      return matchesCategory && matchesLevel;
    });
  }, [reportData, categoryFilter, levelFilter]);

  // Group registrations by category and level
  const groupedRegistrations = useMemo(() => {
    const groups: Record<string, Registration[]> = {};
    filteredRegistrations.forEach((registration) => {
      const groupKey = `${capitalize(registration.category)} ${capitalize(registration.level)}`;
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

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-red-500">{error || 'No data available'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Registration Report - {tournamentId}
        </h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {/* Category Filters */}
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
              {reportData.availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    categoryFilter.toLowerCase() === category.toLowerCase()
                      ? 'bg-[#C4E42E] text-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {capitalize(category)}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filters */}
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
              {reportData.availableLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setLevelFilter(level)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    levelFilter.toLowerCase() === level.toLowerCase()
                      ? 'bg-[#C4E42E] text-black'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {capitalize(level)}
                </button>
              ))}
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
                    {groupKey} ({registrations.length})
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