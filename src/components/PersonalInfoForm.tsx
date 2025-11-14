import React from 'react';
import { useForm } from 'react-hook-form';
import { InfoIcon } from 'lucide-react';
import countries from 'world-countries';

const PersonalInfoForm = ({
  onSubmit,
  tournamentSlug
}) => {
  // Check if this is MPA tournament (Malaysia nationals only)
  const isMalaysiaOnly = tournamentSlug === 'mpa-dec-2025';
  
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      nationality: isMalaysiaOnly ? 'MY' : '' // Pre-select MY for MPA
    }
  });
  
  // This function ensures we're properly handling the form submission
  const onSubmitHandler = data => {
    console.log('Form data submitted:', data);
    onSubmit(data);
  };

  // Transform to format you need
  const countriesList = countries
    .map(country => ({
      code: country.cca2, // 2-letter ISO code
      name: country.name.common
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Filter to Malaysia only if MPA tournament
  const availableCountries = isMalaysiaOnly 
    ? countriesList.filter(country => country.code === 'MY')
    : countriesList;
  
  
  return <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Welcome, please complete your profile first
        </h2>
        {isMalaysiaOnly && (
          <p className="mt-2 text-sm text-gray-600">
            This tournament is for Malaysian nationals only.
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input id="email" type="email" {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Invalid email format'
          }
        })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" style={{
          backgroundColor: '#f3f4f6'
        }} />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
            WhatsApp
          </label>
<input 
  id="whatsapp" 
  type="tel" 
  placeholder="+60123456789"
  {...register('whatsapp', {
    required: 'WhatsApp number is required',
    pattern: {
      value: /^\+\d{1,4}\d{6,14}$/,
      message: 'Invalid format. Use: +60123456789 (no spaces or dashes)'
    }
  })} 
  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
  style={{ backgroundColor: '#f3f4f6' }} 
/>
          {errors.whatsapp && <p className="mt-1 text-sm text-red-600">
              {errors.whatsapp.message}
            </p>}
        </div>
        <div>
          <div className="flex items-center">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative ml-1 group">
              <InfoIcon className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded p-2 w-48">
                As per IC/passport
              </div>
            </div>
          </div>
          <input id="fullName" type="text" {...register('fullName', {
          required: 'Full name is required'
        })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" style={{
          backgroundColor: '#f3f4f6'
        }} />
          {errors.fullName && <p className="mt-1 text-sm text-red-600">
              {errors.fullName.message}
            </p>}
        </div>
        <div>
          <div className="flex items-center">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
              Display Name
            </label>
            <div className="relative ml-1 group">
              <InfoIcon className="h-4 w-4 text-gray-400" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded p-2 w-48">
                Name to be used in scoreboards
              </div>
            </div>
          </div>
          <input id="displayName" type="text" {...register('displayName', {
          required: 'Display name is required'
        })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" style={{
          backgroundColor: '#f3f4f6'
        }} />
          {errors.displayName && <p className="mt-1 text-sm text-red-600">
              {errors.displayName.message}
            </p>}
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            Gender
          </label>
          <select id="gender" {...register('gender', {
          required: 'Gender is required'
        })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" style={{
          backgroundColor: '#f3f4f6'
        }}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>}
        </div>
        <div>
          <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
            Birthdate
          </label>
          <input id="birthdate" type="date" {...register('birthdate', {
          required: 'Birthdate is required'
        })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" style={{
          backgroundColor: '#f3f4f6'
        }} />
          {errors.birthdate && <p className="mt-1 text-sm text-red-600">
              {errors.birthdate.message}
            </p>}
        </div>
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
            Nationality {isMalaysiaOnly && '(Reserved to Malaysian Nationals)'}
          </label>
          <select 
            id="nationality" 
            {...register('nationality', {
              required: 'Nationality is required'
            })} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
            style={{
              backgroundColor: '#f3f4f6'
            }}
            disabled={isMalaysiaOnly} // Disable dropdown for MPA (only Malaysia)
          >
            {!isMalaysiaOnly && <option value="">Select nationality</option>}
            {availableCountries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.code})
              </option>
            ))}
          </select>
          {errors.nationality && <p className="mt-1 text-sm text-red-600">
              {errors.nationality.message}
            </p>}
        </div>
        <div>
          <button 
            type="submit" 
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isMalaysiaOnly
                ? 'bg-[#162d54] text-white hover:bg-[#0f1f3a] focus:ring-[#162d54]'
                : 'bg-[#C4E42E] text-black hover:bg-[#b3d129] focus:ring-[#C4E42E]'
            }`}
          >
            Continue to Registration
          </button>
        </div>
      </form>
    </div>;
};
export default PersonalInfoForm;