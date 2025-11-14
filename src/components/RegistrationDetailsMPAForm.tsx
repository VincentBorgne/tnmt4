import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { InfoIcon, SearchIcon } from 'lucide-react';
import countries from 'world-countries';
import LevelInfoModal from './LevelInfoModal';
import JerseySizesModal from './JerseySizesModal';
import RegistrationConfirmationModal from './RegistrationConfirmationModal';
import { registrationApi } from '../api/config';

const RegistrationDetailsMPAForm = ({
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
      jerseys: [{ size: '', nameOnJersey: '', flag: 'my' }],
      termsAccepted: false,
      refundPolicy: false,
      mediaConsent: false
    }
  });

  const { fields: jerseyFields, append: appendJersey, remove: removeJersey } = useFieldArray({
    control,
    name: 'jerseys'
  });

  const [showLevelInfo, setShowLevelInfo] = useState(false);
  const [showJerseySizesModal, setShowJerseySizesModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedCategoryLevel, setSelectedCategoryLevel] = useState('');
  const [partnerSearchResult, setPartnerSearchResult] = useState(null);
  const [partnerWhatsapp, setPartnerWhatsapp] = useState('');
  const [totalFees, setTotalFees] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const watchGender = personalData.gender;
  const watchJerseys = watch('jerseys');

  const jerseySizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const FEE_PER_PLAYER = 100;

  // MPA Category Levels
  const categoryLevels = [
    {
      id: 'premier',
      name: 'Premier',
      description: 'Premier Division',
      gender: 'both',
      fee: FEE_PER_PLAYER
    },
    {
      id: 'div1',
      name: 'Division 1',
      description: 'Division 1',
      gender: 'both',
      fee: FEE_PER_PLAYER
    },
    {
      id: 'div2',
      name: 'Division 2',
      description: 'Division 2',
      gender: 'both',
      fee: FEE_PER_PLAYER
    },
    {
      id: 'over40',
      name: 'Over 40',
      description: 'Over 40',
      gender: 'both',
      fee: FEE_PER_PLAYER
    },
    {
      id: 'over50',
      name: 'Over 50',
      description: 'Over 50 (Men only)',
      gender: 'male',
      fee: FEE_PER_PLAYER
    }
  ];

  // Filter category levels by gender (over50 only for men)
  const availableCategories = categoryLevels.filter(
    cat => cat.gender === 'both' || cat.gender === watchGender
  );

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
        playerLevel: '3.0', // Default level for MPA
        rankings: [], // No rankings for MPA
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
          source: data.source || 'Direct',
          tournaments: [], // No tournament experience tracked
          communityTournaments: '',
          jerseys: data.jerseys.filter(j => j.size),
          termsAccepted: data.termsAccepted,
          refundPolicy: data.refundPolicy,
          mediaConsent: data.mediaConsent,
        }
      };

      console.log('Submitting MPA registration:', registrationData);
      const response = await registrationApi.create(tournamentId, registrationData);
      console.log('Registration successful:', response);
      
      setShowConfirmationModal(true);
      setTimeout(() => {
        window.location.href = 'https://mypadelassociation.com';
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + (error.response?.data?.message || error.message));
      setIsSubmitting(false);
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

  const handleCategoryLevelChange = (e) => {
    setSelectedCategoryLevel(e.target.value);
  };

  // Calculate total fees - simple for MPA: just RM 100 per player
  useEffect(() => {
    setTotalFees(selectedCategoryLevel ? FEE_PER_PLAYER : 0);
  }, [selectedCategoryLevel]);

  const selectedLevelDetails = categoryLevels.find(level => level.id === selectedCategoryLevel);

  return (
    <div>
      <div className="mb-6">
        <button onClick={onBack} className="text-blue-600 hover:text-blue-800 mb-4">
          ← Back to Personal Info
        </button>
        <h2 className="text-xl font-semibold text-gray-700">
          Malaysia Padel Association Tournament Registration
        </h2>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        
        {/* Player Level Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Player Level</h3>
            <button
              type="button"
              onClick={() => setShowLevelInfo(true)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <InfoIcon className="h-4 w-4 mr-1" />
              What's my level?
            </button>
          </div>
          <div>
            <label htmlFor="playerLevel" className="block text-sm font-medium text-gray-700">
              Your Self-Assessment Level (0.0 - 7.0)
            </label>
            <input
              id="playerLevel"
              type="number"
              step="0.5"
              min="0"
              max="7"
              {...register('playerLevel', {
                required: 'Player level is required',
                min: { value: 0, message: 'Minimum level is 0.0' },
                max: { value: 7, message: 'Maximum level is 7.0' }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              style={{ backgroundColor: '#f3f4f6' }}
            />
            {errors.playerLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.playerLevel.message}</p>
            )}
          </div>
        </div>

        {/* Category Selection */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            Select Your Category
          </h3>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              style={{ backgroundColor: '#f3f4f6' }}
            >
              <option value="">Select category</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="categoryLevel" className="block text-sm font-medium text-gray-700">
              Division
            </label>
            <select
              id="categoryLevel"
              value={selectedCategoryLevel}
              onChange={handleCategoryLevelChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              style={{ backgroundColor: '#f3f4f6' }}
              required
            >
              <option value="">Select division</option>
              {availableCategories.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>

          {selectedLevelDetails && (
            <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-100">
              <p className="text-sm font-medium text-blue-800">
                {selectedLevelDetails.description}
              </p>
              <p className="mt-1 text-sm text-gray-700">
                Fee: RM {selectedLevelDetails.fee} per player
              </p>
            </div>
          )}
        </div>

        {/* Partner Search */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Partner Information</h3>
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100 mb-4">
            <p className="text-sm text-gray-700">
              If you have a partner, enter their WhatsApp number to link your registrations.
              Leave empty if you're looking for a partner.
            </p>
          </div>
          
          <div>
            <label htmlFor="partnerWhatsapp" className="block text-sm font-medium text-gray-700">
              Partner's WhatsApp Number (Optional)
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="tel"
                placeholder="+60123456789"
                value={partnerWhatsapp}
                onChange={(e) => setPartnerWhatsapp(e.target.value)}
                className="flex-1 rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                style={{ backgroundColor: '#f3f4f6' }}
              />
              <button
                type="button"
                onClick={handlePartnerSearch}
                className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
              >
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>
            {partnerSearchResult && (
              <p className={`mt-2 text-sm ${partnerSearchResult.found ? 'text-green-600' : 'text-red-600'}`}>
                {partnerSearchResult.found 
                  ? `✓ Partner found: ${partnerSearchResult.name}`
                  : '✗ Partner not found. They need to register first or you can proceed without a partner.'}
              </p>
            )}
          </div>
        </div>

        {/* How did you hear about us */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">
            How did you hear about this tournament?
          </h3>
          <select
            {...register('source', { required: 'Please let us know how you heard about us' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            style={{ backgroundColor: '#f3f4f6' }}
          >
            <option value="">Select source</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Friend">Friend</option>
            <option value="Club">Club</option>
            <option value="MPA Website">MPA Website</option>
            <option value="Other">Other</option>
          </select>
          {errors.source && (
            <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
          )}
        </div>

        {/* Jersey Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-700">Tournament Jersey</h3>
            <button
              type="button"
              onClick={() => setShowJerseySizesModal(true)}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <InfoIcon className="h-4 w-4 mr-1" />
              Size Guide
            </button>
          </div>

          <div className="space-y-4">
            {jerseyFields.map((field, index) => (
              <div key={field.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">
                    Jersey {index + 1}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Size
                    </label>
                    <select
                      {...register(`jerseys.${index}.size`, { required: 'Size is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      style={{ backgroundColor: '#ffffff' }}
                    >
                      <option value="">Select size</option>
                      {jerseySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name on Jersey
                    </label>
                    <input
                      type="text"
                      placeholder="Display name"
                      {...register(`jerseys.${index}.nameOnJersey`, { required: 'Name is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      style={{ backgroundColor: '#ffffff' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Flag
                    </label>
                    <select
                      {...register(`jerseys.${index}.flag`, { required: 'Flag is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      style={{ backgroundColor: '#ffffff' }}
                      disabled={true}
                      value="my"
                    >
                      <option value="my">Malaysia</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-100">
            <p className="flex items-center text-sm font-medium text-green-800">
              <span className="mr-2">🎁</span> Jersey is complimentary
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Your tournament jersey is included in your registration fee
            </p>
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
                  I confirm that all information provided is accurate and I agree to abide by the rules and regulations set by Malaysia Padel Association.
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
                  I consent to photos and videos taken during the event being used by Malaysia Padel Association for promotional purposes.
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
            <p className="mt-2 text-sm text-gray-700">
              ✉️ You will receive an email with confirmation and a payment link
            </p>
            <p className="mt-1 text-sm text-red-600 font-medium">
              ⚠️ Please proceed to pay within <strong>24 HOURS</strong>, after that your registration will be cancelled
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
      {showJerseySizesModal && (
        <JerseySizesModal onClose={() => setShowJerseySizesModal(false)} />
      )}
      {showConfirmationModal && (
        <RegistrationConfirmationModal onClose={() => setShowConfirmationModal(false)} />
      )}
    </div>
  );
};

export default RegistrationDetailsMPAForm;