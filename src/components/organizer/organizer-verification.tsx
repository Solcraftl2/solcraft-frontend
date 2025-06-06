'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import cn from '@/utils/cn';
import { 
  PlusCircleIcon, 
  MinusCircleIcon, 
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface OrganizerVerificationProps {
  className?: string;
}

export default function OrganizerVerification({ className }: OrganizerVerificationProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    pokerExperience: '',
    pokerCredentials: '',
    organizerExperience: '',
    collateralAmount: 5000,
    acceptTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.pokerExperience) newErrors.pokerExperience = 'Please select your experience level';
      if (!formData.pokerCredentials.trim()) newErrors.pokerCredentials = 'Please provide your poker credentials';
    } else if (step === 2) {
      if (!formData.organizerExperience.trim()) newErrors.organizerExperience = 'Please describe your experience';
      if (formData.collateralAmount < 1000) newErrors.collateralAmount = 'Minimum collateral is $1,000';
    } else if (step === 3) {
      if (!formData.acceptTerms) newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const adjustCollateral = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      collateralAmount: Math.max(1000, prev.collateralAmount + amount),
    }));
  };

  if (isSubmitted) {
    return (
      <div className={cn(
        'rounded-lg bg-white p-8 shadow-card dark:bg-light-dark',
        className
      )}>
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            Application Submitted!
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your organizer application has been submitted successfully. We will review your application and get back to you within 24-48 hours.
          </p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/')}
              className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'rounded-lg bg-white shadow-card dark:bg-light-dark',
      className
    )}>
      <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tournament Organizer Application
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete this form to become a verified tournament organizer
        </p>
      </div>
      
      {/* Progress Steps */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-1 items-center">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                step === stepNumber
                  ? 'bg-blue-500 text-white'
                  : step > stepNumber
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              )}>
                {step > stepNumber ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  stepNumber
                )}
              </div>
              <div
                className={cn(
                  'ml-2 flex-1 text-sm',
                  stepNumber < 3 ? 'border-t border-gray-300 dark:border-gray-600' : ''
                )}
              >
                {stepNumber === 1 && 'Poker Experience'}
                {stepNumber === 2 && 'Organizer Details'}
                {stepNumber === 3 && 'Review & Submit'}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="px-6 py-4">
        {/* Step 1: Poker Experience */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={cn(
                  'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                  errors.fullName
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                )}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Poker Experience Level
              </label>
              <select
                name="pokerExperience"
                value={formData.pokerExperience}
                onChange={handleChange}
                className={cn(
                  'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                  errors.pokerExperience
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                )}
              >
                <option value="">Select experience level</option>
                <option value="beginner">Beginner (1-2 years)</option>
                <option value="intermediate">Intermediate (3-5 years)</option>
                <option value="advanced">Advanced (5-10 years)</option>
                <option value="professional">Professional (10+ years)</option>
              </select>
              {errors.pokerExperience && (
                <p className="mt-1 text-sm text-red-600">{errors.pokerExperience}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Poker Credentials & Achievements
              </label>
              <textarea
                name="pokerCredentials"
                value={formData.pokerCredentials}
                onChange={handleChange}
                rows={4}
                className={cn(
                  'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                  errors.pokerCredentials
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                )}
                placeholder="List your major poker achievements, tournament wins, or professional experience"
              />
              {errors.pokerCredentials && (
                <p className="mt-1 text-sm text-red-600">{errors.pokerCredentials}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Step 2: Organizer Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tournament Organizing Experience
              </label>
              <textarea
                name="organizerExperience"
                value={formData.organizerExperience}
                onChange={handleChange}
                rows={4}
                className={cn(
                  'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                  errors.organizerExperience
                    ? 'border-red-300 dark:border-red-600'
                    : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                )}
                placeholder="Describe your experience organizing poker tournaments or similar events"
              />
              {errors.organizerExperience && (
                <p className="mt-1 text-sm text-red-600">{errors.organizerExperience}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Collateral Amount
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => adjustCollateral(-1000)}
                  className="rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <MinusCircleIcon className="h-5 w-5" />
                </button>
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    name="collateralAmount"
                    value={formData.collateralAmount}
                    onChange={handleChange}
                    min={1000}
                    step={1000}
                    className={cn(
                      'block w-full rounded-md border px-3 py-2 pl-8 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                      errors.collateralAmount
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    )}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => adjustCollateral(1000)}
                  className="rounded-md bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                </button>
              </div>
              {errors.collateralAmount && (
                <p className="mt-1 text-sm text-red-600">{errors.collateralAmount}</p>
              )}
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Higher collateral increases your organizer rating and maximum tournament size
              </p>
            </div>
            
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Collateral Benefits
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <li>Increased trust from investors</li>
                <li>Higher maximum prize pool limits</li>
                <li>Lower platform fees</li>
                <li>Priority verification and support</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Application Summary
              </h3>
              
              <div className="mt-3 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Full Name</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formData.fullName}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Poker Experience</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formData.pokerExperience.charAt(0).toUpperCase() + formData.pokerExperience.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Collateral Amount</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${formData.collateralAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Important Notice
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      By submitting this application, you agree to lock the specified collateral amount in the SolCraft platform. This collateral serves as security for tournaments you organize and may be used to compensate investors in case of disputes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="acceptTerms" className="font-medium text-gray-700 dark:text-gray-300">
                  I accept the terms and conditions
                </label>
                <p className="text-gray-500 dark:text-gray-400">
                  I understand that my application will be reviewed and I may be required to provide additional verification.
                </p>
                {errors.acceptTerms && (
                  <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

