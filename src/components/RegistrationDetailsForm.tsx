import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { InfoIcon, PlusIcon, XIcon, ShirtIcon, SearchIcon } from 'lucide-react';
import countries from 'world-countries';
import LevelInfoModal from './LevelInfoModal';
import TshirtModal from './TshirtModal';
import JerseySizesModal from './JerseySizesModal';
import RegistrationConfirmationModal from './RegistrationConfirmationModal';
import { registrationApi } from '../api/config';

const RegistrationDetailsForm = ({
  personalData,
  tournamentId,
  onBack
}) => {
  // Transform countries to the format we need
  const countriesList = countries
    .map(country => ({
      code: country.cca2,
      name: country.name.common
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      rankings: [{ source: '', level: '' }],
      tournaments: [],
      jerseys: [{ size: '', nameOnJersey: '', flag: '' }],
      foodAllergies: '',
      specialRequests: '',
      termsAccepted: false,
      refundPolicy: false,
      mediaConsent: false
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rankings'
  });

  const { fields: jerseyFields, append: appendJersey, remove: removeJersey } = useFieldArray({
    control,
    name: 'jerseys'
  });

  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [showTshirtModal, setShowTshirtModal] = useState(false);
  const [showJerseySizesModal, setShowJerseySizesModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedCategoryLevel, setSelectedCategoryLevel] = useState('');
  const [selectedSecondCategoryLevel, setSelectedSecondCategoryLevel] = useState('');
  const [partnerSearchResult, setPartnerSearchResult] = useState(null);
  const [secondPartnerSearchResult, setSecondPartnerSearchResult] = useState(null);
  const [partnerWhatsapp, setPartnerWhatsapp] = useState('');
  const [secondPartnerWhatsapp, setSecondPartnerWhatsapp] = useState('');
  const [registerSecondCategory, setRegisterSecondCategory] = useState(false);
  const [totalFees, setTotalFees] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const watchGender = personalData.gender;
  const watchJerseys = watch('jerseys');
  const watchTournaments = watch('tournaments');

  const tournamentSources = ['Instagram', 'Facebook', 'Friend', 'Club', 'Other'];
  const jerseySizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const JERSEY_FEE = 60;
  const DISCOUNT_TOURNAMENT_ID = 'abpxpress';

  const tournaments = [
    { id: 'aptt-amateur', name: 'APTT Amateur' },
    { id: 'appt-pro', name: 'APPT Pro' },
    { id: 'malaysia-national', name: 'Malaysia National League' },
    { id: 'singapore-national', name: 'Singapore National League' },
    { id: 'allboutpadel', name: "All'BoutPadel 3.0" },
    { id: 'abpxpress', name: "All'BoutPadel Xpress OCT 2025" },
    { id: 'ascaro', name: 'Ascaro Series' },
    { id: 'joy-smashing', name: 'Joy smashing league' },
    { id: 'societe-smash', name: 'Societe Smash' },
    { id: 'paloma-cup', name: 'Paloma cup' },
    { id: 'volvo', name: 'Volvo Tournament' }
  ];

  const categoryLevels = [
    {
      id: 'bronze',
      name: '🟤 AIMS Bronze (Beginner)',
      description: 'Level Range: 0.0 – 2.0',
      points: 'Combined Level Points (team): Must be below 4 points',
      detail: '🟢 For new players or those with minimal experience. No tactics, limited technique, learning basics.',
      feeRegular: 220,
      feeDiscount: 180
    },
    {
      id: 'silver',
      name: '⚪️ AIMS Silver (Intermediate)',
      description: 'Level Range: 2.5 – 3.5',
      points: 'Combined Level Points (team): Must be below 7 points',
      detail: '🔵 For casual players with basic technique and control, can rally and return at moderate pace.',
      feeRegular: 240,
      feeDiscount: 200
    },
    {
      id: 'platinum',
      name: '🔘 AIMS Platinum (Upper Intermediate)',
      description: 'Level Range: 4.0 – 5.0',
      points: 'Combined Level Points (team): Must be below 9 points',
      detail: '🟠 For players who control strokes well, use tactics, and are ready for competitive pace.',
      feeRegular: 250,
      feeDiscount: 220
    },
    {
      id: 'elite',
      name: '🔴 AIMS Elite (Advanced)',
      description: 'Level Range: 5.5 – 6.0',
      points: 'Combined Level Points (team): Maximum 12 points',
      detail: '🔴 High-level players with excellent technique, control, attacking shots, and strong defense. Competitive and tournament-ready.',
      feeRegular: 250,
      feeDiscount: 250
    }
  ];

// Replace the handleFormSubmit function (around line 180)
const handleFormSubmit = async (data) => {
  // Prevent double submission
  if (isSubmitting) return;
  
  setIsSubmitting(true);
  
  try {
    const registrationData = {
      email: personalData.email,
      whatsapp: personalData.whatsapp,
      fullName: personalData.fullName,
      displayName: personalData.displayName,
      gender: personalData.gender,
      birthdate: personalData.birthdate,
      nationality: personalData.nationality,
      playerLevel: data.playerLevel,
      rankings: data.rankings.filter(r => r.source && r.level),
      totalAmount: totalFees,
      categories: [
        {
          category: data.category,
          categoryLevel: selectedCategoryLevel,
          partnerWhatsapp: partnerWhatsapp || undefined,
          payForBoth: false,
        }
      ],
      tournamentData: {
        source: data.source,
        tournaments: data.tournaments || [],
        communityTournaments: data.communityTournaments || '',
        jerseys: data.jerseys.filter(j => j.size),
        foodAllergies: data.foodAllergies || '',
        specialRequests: data.specialRequests || '',
        termsAccepted: data.termsAccepted,
        refundPolicy: data.refundPolicy,
        mediaConsent: data.mediaConsent,
      }
    };

    if (registerSecondCategory && data.secondCategory && selectedSecondCategoryLevel) {
      registrationData.categories.push({
        category: data.secondCategory,
        categoryLevel: selectedSecondCategoryLevel,
        partnerWhatsapp: secondPartnerWhatsapp || undefined,
        payForBoth: false,
      });
    }

    console.log('Submitting registration:', registrationData);
    const response = await registrationApi.create(tournamentId, registrationData);
    console.log('Registration successful:', response);
    
    setShowConfirmationModal(true);
    setTimeout(() => {
      window.location.href = 'https://aimsclub.com';
    }, 3000);
  } catch (error) {
    console.error('Registration failed:', error);
    alert('Registration failed: ' + (error.response?.data?.message || error.message));
    setIsSubmitting(false); // Re-enable button on error
  }
};

  const handlePartnerSearch = async () => {
    if (!partnerWhatsapp) return;
    try {
      const result = await registrationApi.searchPartner(tournamentId, partnerWhatsapp);
      if (result.found) {
        setPartnerSearchResult({ name: result.partner.name, found: true });
      } else {
        setPartnerSearchResult({ found: false });
      }
    } catch (error) {
      console.error('Partner search failed:', error);
      setPartnerSearchResult({ found: false });
    }
  };

  const handleSecondPartnerSearch = async () => {
    if (!secondPartnerWhatsapp) return;
    try {
      const result = await registrationApi.searchPartner(tournamentId, secondPartnerWhatsapp);
      if (result.found) {
        setSecondPartnerSearchResult({ name: result.partner.name, found: true });
      } else {
        setSecondPartnerSearchResult({ found: false });
      }
    } catch (error) {
      console.error('Partner search failed:', error);
      setSecondPartnerSearchResult({ found: false });
    }
  };

  const handleCategoryLevelChange = (e) => {
    setSelectedCategoryLevel(e.target.value);
  };

  const handleSecondCategoryLevelChange = (e) => {
    setSelectedSecondCategoryLevel(e.target.value);
  };

  // Calculate total fees
  useEffect(() => {
    // Check if user selected qualifying tournament for discount
    const selectedTournaments = watchTournaments || [];
    const hasDiscount = selectedTournaments.some(tournamentName => {
      const tournament = tournaments.find(t => t.name === tournamentName);
      return tournament?.id === DISCOUNT_TOURNAMENT_ID;
    });

    // Calculate first category fee
    const firstCategoryLevel = categoryLevels.find(level => level.id === selectedCategoryLevel);
    const firstCategoryFee = firstCategoryLevel 
      ? (hasDiscount ? firstCategoryLevel.feeDiscount : firstCategoryLevel.feeRegular)
      : 0;

    // Calculate second category fee (if selected)
    let secondCategoryFee = 0;
    if (registerSecondCategory && selectedSecondCategoryLevel) {
      const secondCategoryLevel = categoryLevels.find(level => level.id === selectedSecondCategoryLevel);
      secondCategoryFee = secondCategoryLevel 
        ? (hasDiscount ? secondCategoryLevel.feeDiscount : secondCategoryLevel.feeRegular)
        : 0;
    }

    // Calculate jersey fees (first jersey is free, extras cost RM 60 each)
    const extraJerseyCount = Math.max(0, watchJerseys.length - 1);
    const jerseyFees = extraJerseyCount * JERSEY_FEE;

    // Total
    setTotalFees(firstCategoryFee + secondCategoryFee + jerseyFees);
  }, [watchJerseys, watchTournaments, registerSecondCategory, selectedCategoryLevel, selectedSecondCategoryLevel]);

  const selectedLevelDetails = categoryLevels.find(level => level.id === selectedCategoryLevel);
  const selectedSecondLevelDetails = categoryLevels.find(level => level.id === selectedSecondCategoryLevel);

  return (
    <div>
      <div className="mb-6">
        <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mb-4">
          ← Back to personal information
        </button>
        <h2 className="text-xl font-semibold text-gray-700">
          Tournament Registration Details
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Source Section */}
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700">
            Where did you hear about the tournament?
          </label>
          <select 
            id="source" 
            {...register('source', { required: 'This field is required' })} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
            style={{ backgroundColor: '#f3f4f6' }}
          >
            <option value="">Select source</option>
            {tournamentSources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </select>
          {errors.source && (
            <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
          )}
        </div>

        {/* Skill Level Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700">Skill Level</h3>
		  
<div className="mt-4">
  <div className="flex items-center mb-2">
    <label htmlFor="playerLevel" className="block text-sm font-medium text-gray-700">
      Estimate your level
    </label>
    <button 
      type="button" 
      onClick={() => setShowLevelInfo(true)} 
      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
    >
      View level table
    </button>
  </div>
  <select 
    id="playerLevel" 
    {...register('playerLevel', { required: 'Your level is required' })} 
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
    style={{ backgroundColor: '#f3f4f6' }}
  >
    <option value="">Select your level</option>
    <option value="0.5">0.5 Less than 6 months. No technique or tactics.</option>
    <option value="1.0">1.0 Les than 12 months. No technique or tactics</option>
    <option value="1.5">1.5 Rally and return at low speed. Plays 2 games a month</option>
    <option value="2.0">2.0 More than 2 games a month, Rally and return at low speed</option>
    <option value="2.5">2.5 Controls direction at normal pace</option>
    <option value="3.0">3.0 Dominates most strokes, play flat and drives the ball</option>
    <option value="3.5">3.5 Dominates most strokes, play slice or flat, many unforced errors</option>
    <option value="4.0">4.0 Masters most strokes,Few unforced errors</option>
    <option value="4.5">4.5 Masters most strokes, Controls direction but difficulty to close the point</option>
    <option value="5.0">5.0 Medium technique and high tactical mindset. Ready to play at good pace</option>
    <option value="5.5">5.5 Dominates technical and tactical kills. Plays at high pace</option>
    <option value="6.0">6.0 Avanced/Pro players</option>
  </select>
  {errors.playerLevel && (
    <p className="mt-1 text-sm text-red-600">{errors.playerLevel.message}</p>
  )}
</div>
		</div>

        {/* Rankings Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700">Rankings</h3>
          <p className="text-sm text-gray-500 mt-1">
            Do you have a ranking/level from any padel tournament, club or app? (Optional)
          </p>
          <div className="mt-4 space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <div className="flex-1">
                  <input 
                    {...register(`rankings.${index}.source`)} 
                    placeholder="App/Tournament/Club" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                    style={{ backgroundColor: '#f3f4f6' }} 
                  />
                </div>
                <div className="flex-1">
                  <input 
                    {...register(`rankings.${index}.level`)} 
                    placeholder="Level" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                    style={{ backgroundColor: '#f3f4f6' }} 
                  />
                </div>
                {index > 0 && (
                  <button 
                    type="button" 
                    onClick={() => remove(index)} 
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => append({ source: '', level: '' })} 
              className="inline-flex items-center px-4 py-1 border border-transparent text-sm leading-4 font-medium rounded-full text-black bg-[#C4E42E] hover:bg-[#b3d129] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E42E]"
            >
              <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              Add Ranking
            </button>
          </div>
        </div>

        {/* Tournament Experience Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700">Tournament Experience</h3>
          <p className="text-sm text-gray-500 mt-1">
            Have you participated in tournaments listed below:
          </p>
          <div className="mt-4 space-y-3">
            {tournaments.map(tournament => (
              <div key={tournament.id} className="flex items-start">
                <input 
                  id={`tournament-${tournament.id}`} 
                  type="checkbox" 
                  value={tournament.name} 
                  {...register('tournaments')} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1" 
                  style={{ backgroundColor: '#f3f4f6' }} 
                />
                <label htmlFor={`tournament-${tournament.id}`} className="ml-3 block text-sm text-gray-700">
                  {tournament.name}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <label htmlFor="communityTournaments" className="block text-sm font-medium text-gray-700">
              Community tournament (just type the community name separated by commas)
            </label>
            <textarea 
              id="communityTournaments" 
              {...register('communityTournaments')} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
              style={{ backgroundColor: '#f3f4f6' }} 
              rows={3} 
            />
          </div>
        </div>

        {/* Category Selection Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700">Category Selection</h3>
          
          <div className="mt-4">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Which category you want to register
            </label>
            <select 
              id="category" 
              {...register('category', { required: 'Category is required' })} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <option value="">Select category</option>
              {watchGender === 'male' && <option value="men">Men</option>}
              {watchGender === 'female' && <option value="women">Women</option>}
              <option value="mixed">Mixed</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-700 mb-2">
              Please select the level in that category:
            </p>
            <label htmlFor="categoryLevel" className="block text-sm font-medium text-gray-700">
              Category Level
            </label>
            <select 
              id="categoryLevel" 
              value={selectedCategoryLevel} 
              onChange={handleCategoryLevelChange} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <option value="">Select category level</option>
{categoryLevels
  .filter(level => {
    const category = watch('category');
    if (level.id === 'elite' && category !== 'mixed') return false;
    if (level.id === 'platinum' && category === 'women') return false;
    return true;
  })
  .map(level => (
    <option key={level.id} value={level.id}>{level.name}</option>
  ))}
            </select>
            {selectedLevelDetails && (
              <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-medium text-gray-800">{selectedLevelDetails.name}</h4>
                <p className="text-gray-700 mt-2">{selectedLevelDetails.description}</p>
                <p className="text-gray-700 mt-1">{selectedLevelDetails.points}</p>
                <p className="text-gray-700 mt-2">{selectedLevelDetails.detail}</p>
              </div>
            )}
          </div>

          {/* Partner Selection */}
          <div className="mt-6">
            <label htmlFor="partnerSearch" className="block text-sm font-medium text-gray-700">
              Search your partner by WhatsApp
            </label>
            <div className="mt-2 flex gap-2">
              <input 
                type="text" 
                placeholder="+60123456789" 
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                style={{ backgroundColor: '#f3f4f6' }}
                value={partnerWhatsapp} 
                onChange={e => {
                  setPartnerWhatsapp(e.target.value);
                  setPartnerSearchResult(null);
                }} 
              />
              <button 
                type="button" 
                onClick={handlePartnerSearch} 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-black bg-[#C4E42E] hover:bg-[#b3d129] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E42E]"
              >
                <SearchIcon className="h-4 w-4 mr-1" />
                Search
              </button>
            </div>
            
            {partnerSearchResult && (
              <div className="mt-2">
                {partnerSearchResult.found ? (
                  <div className="p-3 bg-green-50 rounded-md border border-green-100">
                    <p className="text-sm text-green-800">
                      Partner found: <span className="font-medium">{partnerSearchResult.name}</span>
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-yellow-50 rounded-md border border-yellow-100">
                    <p className="text-sm text-yellow-800">
                      Partner not found. Ask them to register and reference your WhatsApp number.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
			{/*
          <div className="mt-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input 
                  id="payForBoth" 
                  type="checkbox" 
                  {...register('payForBoth')} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="payForBoth" className="font-medium text-gray-700">
                  I pay for both players
                </label>
              </div>
            </div>
          </div>
			*/}
          {/* Second Category Option */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <input 
                id="registerSecondCategory" 
                type="checkbox" 
                checked={registerSecondCategory} 
                onChange={e => setRegisterSecondCategory(e.target.checked)} 
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
              <label htmlFor="registerSecondCategory" className="ml-2 block text-sm font-medium text-gray-700">
                Register for a second category (optional)
              </label>
            </div>

            {registerSecondCategory && (
              <div className="mt-4 pl-4 border-l-2 border-blue-100">
                <div className="mt-4">
                  <label htmlFor="secondCategory" className="block text-sm font-medium text-gray-700">
                    2nd category you want to register
                  </label>
                  <select 
                    id="secondCategory" 
                    {...register('secondCategory')} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    <option value="">Select category</option>
                    {watchGender === 'male' && <option value="men">Men</option>}
                    {watchGender === 'female' && <option value="women">Women</option>}
                    <option value="mixed">Mixed</option>
                  </select>
                </div>

                <div className="mt-4">
                  <label htmlFor="secondCategoryLevel" className="block text-sm font-medium text-gray-700">
                    2nd Category Level
                  </label>
                  <select 
                    id="secondCategoryLevel" 
                    value={selectedSecondCategoryLevel} 
                    onChange={handleSecondCategoryLevelChange} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    <option value="">Select category level</option>
{categoryLevels
  .filter(level => {
    const category = watch('secondCategory');
    if (level.id === 'elite' && category !== 'mixed') return false;
    if (level.id === 'platinum' && category === 'women') return false;
    return true;
  })
  .map(level => (
    <option key={level.id} value={level.id}>{level.name}</option>
  ))}
                  </select>
                  {selectedSecondLevelDetails && (
                    <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
                      <h4 className="font-medium text-gray-800">{selectedSecondLevelDetails.name}</h4>
                      <p className="text-gray-700 mt-2">{selectedSecondLevelDetails.description}</p>
                      <p className="text-gray-700 mt-1">{selectedSecondLevelDetails.points}</p>
                      <p className="text-gray-700 mt-2">{selectedSecondLevelDetails.detail}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label htmlFor="secondPartnerSearch" className="block text-sm font-medium text-gray-700">
                    Search your 2nd partner by WhatsApp
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input 
                      type="text" 
                      placeholder="+60123456789" 
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                      style={{ backgroundColor: '#f3f4f6' }}
                      value={secondPartnerWhatsapp} 
                      onChange={e => {
                        setSecondPartnerWhatsapp(e.target.value);
                        setSecondPartnerSearchResult(null);
                      }} 
                    />
                    <button 
                      type="button" 
                      onClick={handleSecondPartnerSearch} 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-black bg-[#C4E42E] hover:bg-[#b3d129] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E42E]"
                    >
                      <SearchIcon className="h-4 w-4 mr-1" />
                      Search
                    </button>
                  </div>
                  
                  {secondPartnerSearchResult && (
                    <div className="mt-2">
                      {secondPartnerSearchResult.found ? (
                        <div className="p-3 bg-green-50 rounded-md border border-green-100">
                          <p className="text-sm text-green-800">
                            Partner found: <span className="font-medium">{secondPartnerSearchResult.name}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="p-3 bg-yellow-50 rounded-md border border-yellow-100">
                          <p className="text-sm text-yellow-800">
                            Partner not found. Ask them to register and reference your WhatsApp number.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
					{/*
                  <div className="mt-4">
                    <div className="flex items-start">
                      <input 
                        id="secondPayForBoth" 
                        type="checkbox" 
                        {...register('secondPayForBoth')} 
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                      />
                      <label htmlFor="secondPayForBoth" className="ml-3 text-sm font-medium text-gray-700">
                        I pay for both players
                      </label>
                    </div>
                  </div>
				  */}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
            <h4 className="font-medium text-blue-800">➕ Important Notes:</h4>
            <ul className="mt-2 space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✅</span>
                Make sure your level and your partner's level are accurately declared.
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✅</span>
                Total combined points = Player 1 level + Player 2 level
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-2">⚠️</span>
                Teams that exceed the max point limit for a category may be reclassified or disqualified.
              </li>
            </ul>
          </div>
        </div>

        {/* Tournament Jersey Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700">Tournament Jersey</h3>
          <div className="flex items-center mt-3 mb-2">
            <p className="text-sm text-gray-700">
              Please indicate your jersey size. First Jersey is{' '}
              <span className="font-bold">COMPLIMENTARY</span>.
            </p>
            <div className="flex ml-2 space-x-2">
              <button 
                type="button" 
                onClick={() => setShowTshirtModal(true)} 
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
              >
                <ShirtIcon className="h-4 w-4 mr-1" />
                View jersey design
              </button>
              <button 
                type="button" 
                onClick={() => setShowJerseySizesModal(true)} 
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                View jersey sizes
              </button>
            </div>
          </div>
          <div className="mt-4 space-y-4">
            {jerseyFields.map((field, index) => (
              <div key={field.id} className="flex space-x-2">
                <div className="flex-1">
                  <select 
                    {...register(`jerseys.${index}.size`, {
                      required: index === 0 ? 'Jersey size is required' : false
                    })} 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    <option value="">Jersey Size</option>
                    {jerseySizes.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  {errors.jerseys?.[index]?.size && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.jerseys[index].size.message}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <input 
                    {...register(`jerseys.${index}.nameOnJersey`)} 
                    placeholder="Name on Jersey" 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                    style={{ backgroundColor: '#f3f4f6' }} 
                  />
                </div>
                <div className="flex-1">
                  <select 
                    {...register(`jerseys.${index}.flag`)} 
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                    style={{ backgroundColor: '#f3f4f6' }}
                  >
                    <option value="">Select flag</option>
                    {countriesList.map(country => (
                      <option key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </option>
                    ))}
                  </select>
                </div>
                {index > 0 && (
                  <button 
                    type="button" 
                    onClick={() => removeJersey(index)} 
                    className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XIcon className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => appendJersey({ size: '', nameOnJersey: '', flag: '' })} 
              className="inline-flex items-center px-4 py-1 border border-transparent text-sm leading-4 font-medium rounded-full text-black bg-[#C4E42E] hover:bg-[#b3d129] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E42E]"
            >
              <PlusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
              Add Jersey
            </button>
          </div>
          <div className="mt-4 bg-yellow-50 p-4 rounded-md border border-yellow-100">
            <p className="flex items-center text-sm font-medium text-yellow-800">
              <span className="mr-2">💳</span> Payment Note:
            </p>
            <p className="mt-1 text-sm text-gray-700">
              RM 60 per <span className="font-bold">EXTRA</span> jersey will be added to your tournament fee
            </p>
          </div>
        </div>

        {/* Goodie Bag & Special Requests Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700">
            Goodie Bag & Special Requests
          </h3>
          <div className="mt-4">
            <label htmlFor="foodAllergies" className="block text-sm font-medium text-gray-700">
              Any food allergies or dietary requirements (for catering purposes)?
            </label>
            <textarea 
              id="foodAllergies" 
              {...register('foodAllergies')} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
              style={{ backgroundColor: '#f3f4f6' }} 
              rows={2} 
            />
          </div>
          <div className="mt-4">
            <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700">
              Any other requests or notes for the organizer?
            </label>
            <textarea 
              id="specialRequests" 
              {...register('specialRequests')} 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
              style={{ backgroundColor: '#f3f4f6' }} 
              rows={2} 
            />
          </div>
        </div>

        {/* Terms & Conditions Section */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700">
            Terms & Conditions
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input 
                  id="termsAccepted" 
                  type="checkbox" 
                  {...register('termsAccepted', {
                    required: 'You must accept the terms and conditions'
                  })} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="termsAccepted" className="font-medium text-gray-700">
                  Terms and Conditions
                </label>
                <p className="text-gray-500">
                  I confirm that all information provided is accurate and I agree to abide by the rules and regulations set by AIMS Club.
                </p>
                {errors.termsAccepted && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.termsAccepted.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input 
                  id="refundPolicy" 
                  type="checkbox" 
                  {...register('refundPolicy', {
                    required: 'You must accept the refund policy'
                  })} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="refundPolicy" className="font-medium text-gray-700">
                  Refund Policy
                </label>
                <p className="text-gray-500">
                  I understand that the tournament fee is non-refundable once confirmed, unless the event is canceled by the organizer.
                </p>
                {errors.refundPolicy && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.refundPolicy.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Media Consent */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700">Media Consent</h3>
          <div className="mt-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input 
                  id="mediaConsent" 
                  type="checkbox" 
                  {...register('mediaConsent', {
                    required: 'Media consent is required'
                  })} 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="mediaConsent" className="font-medium text-gray-700">
                  Media Permission
                </label>
                <p className="text-gray-500">
                  I consent to photos and videos taken during the event being used by AIMS Club for promotional purposes.
                </p>
                {errors.mediaConsent && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.mediaConsent.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Fees and Submit */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-4">
            <p className="text-sm font-medium text-gray-800">
              Total fees: RM {totalFees}
            </p>
            <p className="mt-2 text-xs text-gray-600">
              Your registration is only valid when both players registered and paid. 
              You or your partner must reference each others whatsapp in your registration to be identified as a team
            </p>
          </div>
          <div className="flex justify-between">
            <button 
              type="button" 
              onClick={onBack} 
              className="py-2 px-4 border border-gray-300 rounded-full shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E42E]"
            >
              Back
            </button>
<button 
  type="submit" 
  disabled={isSubmitting}
  className={`py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium ${
    isSubmitting 
      ? 'text-gray-500 bg-gray-300 cursor-not-allowed' 
      : 'text-black bg-[#C4E42E] hover:bg-[#b3d129]'
  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C4E42E]`}
>
  {isSubmitting ? 'Processing...' : 'Confirm Registration'}
</button>
          </div>
        </div>
      </form>

      {/* Modals */}
      {showLevelInfo && (
        <LevelInfoModal 
          onClose={() => setShowLevelInfo(false)} 
          tournamentId={tournamentId}
        />
      )}
      {showTshirtModal && (
        <TshirtModal onClose={() => setShowTshirtModal(false)} />
      )}
      {showJerseySizesModal && (
        <JerseySizesModal onClose={() => setShowJerseySizesModal(false)} />
      )}
      {showConfirmationModal && (
        <RegistrationConfirmationModal onClose={() => setShowConfirmationModal(false)} />
      )}
    </div>
  );
};

export default RegistrationDetailsForm;