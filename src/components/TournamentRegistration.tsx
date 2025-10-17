import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PersonalInfoForm from './PersonalInfoForm';
import RegistrationDetailsForm from './RegistrationDetailsForm';

const TournamentRegistration = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const [step, setStep] = useState(1);
  const [personalData, setPersonalData] = useState({});

  if (!tournamentId) {
    return <div className="text-white">Invalid tournament</div>;
  }

  const handlePersonalDataSubmit = (data: any) => {
    console.log('Received personal data:', data);
    setPersonalData(data);
    setTimeout(() => {
      setStep(2);
      console.log('Updated step to:', 2);
    }, 0);
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">
          Tournament Registration
        </h1>
        <p className="text-sm text-gray-500">Step {step} of 2</p>
      </div>
      <div className="p-6">
        {step === 1 ? (
          <PersonalInfoForm onSubmit={handlePersonalDataSubmit} />
        ) : (
          <RegistrationDetailsForm 
            personalData={personalData}
            tournamentId={tournamentId}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
};

export default TournamentRegistration;