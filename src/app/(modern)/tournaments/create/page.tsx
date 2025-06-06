'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from '@/utils/cn';
import { 
  ArrowPathIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

export default function CreateTournamentPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    buyIn: 100,
    prizePool: 10000,
    startDate: '',
    startTime: '',
    maxParticipants: 100,
    investmentPool: 5000,
    minInvestment: 50,
    expectedROI: 15,
    riskLevel: 'medium',
    collateralLock: 2000,
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
      if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.startDate) newErrors.startDate = 'Start date is required';
      if (!formData.startTime) newErrors.startTime = 'Start time is required';
    } else if (step === 2) {
      if (formData.buyIn <= 0) newErrors.buyIn = 'Buy-in must be greater than 0';
      if (formData.prizePool <= 0) newErrors.prizePool = 'Prize pool must be greater than 0';
      if (formData.maxParticipants <= 0) newErrors.maxParticipants = 'Max participants must be greater than 0';
    } else if (step === 3) {
      if (formData.investmentPool <= 0) newErrors.investmentPool = 'Investment pool must be greater than 0';
      if (formData.minInvestment <= 0) newErrors.minInvestment = 'Minimum investment must be greater than 0';
      if (formData.expectedROI <= 0) newErrors.expectedROI = 'Expected ROI must be greater than 0';
      if (!formData.riskLevel) newErrors.riskLevel = 'Risk level is required';
    } else if (step === 4) {
      if (formData.collateralLock < formData.prizePool * 0.1) {
        newErrors.collateralLock = `Minimum collateral required: $${(formData.prizePool * 0.1).toLocaleString()}`;
      }
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
      alert('Error creating tournament. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-lg bg-white p-8 shadow-card dark:bg-light-dark">
            <div className="text-center">
              <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                Tournament Created!
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Your tournament "{formData.name}" has been created successfully and is now open for investments.
              </p>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => router.push('/tournaments')}
                  className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  View All Tournaments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Tournament
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Set up a new poker tournament and open it for investments
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-card dark:bg-light-dark">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
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
                    stepNumber < 4 ? 'border-t border-gray-300 dark:border-gray-600' : ''
                  )}
                >
                  {stepNumber === 1 && 'Basic Info'}
                  {stepNumber === 2 && 'Tournament Details'}
                  {stepNumber === 3 && 'Investment Options'}
                  {stepNumber === 4 && 'Review & Submit'}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="rounded-lg bg-white shadow-card dark:bg-light-dark">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {step === 1 && 'Basic Tournament Information'}
              {step === 2 && 'Tournament Structure & Prize Pool'}
              {step === 3 && 'Investment Options'}
              {step === 4 && 'Review & Submit'}
            </h2>
          </div>
          
          <div className="px-6 py-4">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tournament Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={cn(
                      'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                      errors.name
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    )}
                    placeholder="e.g., Sunday Million, High Roller Championship"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={cn(
                      'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                      errors.description
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                    )}
                    placeholder="Describe your tournament, format, special features, etc."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className={cn(
                          'block w-full rounded-md border pl-10 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                          errors.startDate
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        )}
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Time
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <ClockIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        className={cn(
                          'block w-full rounded-md border pl-10 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                          errors.startTime
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        )}
                      />
                      {errors.startTime && (
                        <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Tournament Structure */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Buy-in Amount
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 dark:text-gray-400">$</span>
                      </div>
                      <input
                        type="number"
                        name="buyIn"
                        value={formData.buyIn}
                        onChange={handleChange}
                        min={1}
                        className={cn(
                          'block w-full rounded-md border pl-8 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                          errors.buyIn
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        )}
                      />
                      {errors.buyIn && (
                        <p className="mt-1 text-sm text-red-600">{errors.buyIn}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Prize Pool
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 dark:text-gray-400">$</span>
                      </div>
                      <input
                        type="number"
                        name="prizePool"
                        value={formData.prizePool}
                        onChange={handleChange}
                        min={1}
                        className={cn(
                          'block w-full rounded-md border pl-8 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                          errors.prizePool
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        )}
                      />
                      {errors.prizePool && (
                        <p className="mt-1 text-sm text-red-600">{errors.prizePool}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maximum Participants
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <UserGroupIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleChange}
                      min={1}
                      className={cn(
                        'block w-full rounded-md border pl-10 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                        errors.maxParticipants
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      )}
                    />
                    {errors.maxParticipants && (
                      <p className="mt-1 text-sm text-red-600">{errors.maxParticipants}</p>
                    )}
                  </div>
                </div>
                
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Tournament Structure Summary
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
                    <div>
                      <span className="font-medium">Total Buy-ins:</span>{' '}
                      {formatCurrency(formData.buyIn * formData.maxParticipants)}
                    </div>
                    <div>
                      <span className="font-medium">Prize Pool:</span>{' '}
                      {formatCurrency(formData.prizePool)}
                    </div>
                    <div>
                      <span className="font-medium">Rake:</span>{' '}
                      {formatCurrency(Math.max(0, (formData.buyIn * formData.maxParticipants) - formData.prizePool))}
                      {' '}
                      ({Math.round(((formData.buyIn * formData.maxParticipants) - formData.prizePool) / (formData.buyIn * formData.maxParticipants) * 100)}%)
                    </div>
                    <div>
                      <span className="font-medium">Average Payout:</span>{' '}
                      {formatCurrency(formData.prizePool / (formData.maxParticipants * 0.15))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 3: Investment Options */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Investment Pool
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 dark:text-gray-400">$</span>
                      </div>
                      <input
                        type="number"
                        name="investmentPool"
                        value={formData.investmentPool}
                        onChange={handleChange}
                        min={1}
                        className={cn(
                          'block w-full rounded-md border pl-8 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                          errors.investmentPool
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        )}
                      />
                      {errors.investmentPool && (
                        <p className="mt-1 text-sm text-red-600">{errors.investmentPool}</p>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Total amount available for investment
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Minimum Investment
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 dark:text-gray-400">$</span>
                      </div>
                      <input
                        type="number"
                        name="minInvestment"
                        value={formData.minInvestment}
                        onChange={handleChange}
                        min={1}
                        className={cn(
                          'block w-full rounded-md border pl-8 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                          errors.minInvestment
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        )}
                      />
                      {errors.minInvestment && (
                        <p className="mt-1 text-sm text-red-600">{errors.minInvestment}</p>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Minimum amount per investor
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Expected ROI (%)
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <ChartBarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        name="expectedROI"
                        value={formData.expectedROI}
                        onChange={handleChange}
                        min={1}
                        max={100}
                        className={cn(
                          'block w-full rounded-md border pl-10 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                          errors.expectedROI
                            ? 'border-red-300 dark:border-red-600'
                            : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                        )}
                      />
                      {errors.expectedROI && (
                        <p className="mt-1 text-sm text-red-600">{errors.expectedROI}</p>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Projected return on investment
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Risk Level
                    </label>
                    <select
                      name="riskLevel"
                      value={formData.riskLevel}
                      onChange={handleChange}
                      className={cn(
                        'mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                        errors.riskLevel
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      )}
                    >
                      <option value="">Select risk level</option>
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                    {errors.riskLevel && (
                      <p className="mt-1 text-sm text-red-600">{errors.riskLevel}</p>
                    )}
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Affects investor expectations and platform fees
                    </p>
                  </div>
                </div>
                
                <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Investment Structure
                  </h3>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm text-yellow-700 dark:text-yellow-300">
                    <div>
                      <span className="font-medium">Max Investors:</span>{' '}
                      {Math.floor(formData.investmentPool / formData.minInvestment)}
                    </div>
                    <div>
                      <span className="font-medium">Platform Fee:</span>{' '}
                      {formData.riskLevel === 'low' ? '4%' : formData.riskLevel === 'medium' ? '6%' : '8%'}
                    </div>
                    <div>
                      <span className="font-medium">Potential Return:</span>{' '}
                      {formatCurrency(formData.investmentPool * (1 + formData.expectedROI / 100))}
                    </div>
                    <div>
                      <span className="font-medium">Profit Share:</span>{' '}
                      {formData.riskLevel === 'low' ? '70/30' : formData.riskLevel === 'medium' ? '60/40' : '50/50'}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Tournament Summary
                  </h3>
                  
                  <div className="mt-3 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tournament Name</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.name}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Start Date/Time</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formData.startDate} at {formData.startTime}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Buy-in</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(formData.buyIn)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Prize Pool</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(formData.prizePool)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Investment Pool</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatCurrency(formData.investmentPool)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Expected ROI</span>
                      <span className="text-sm font-medium text-green-500">
                        +{formData.expectedROI}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Risk Level</span>
                      <span className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                        formData.riskLevel === 'low' 
                          ? 'text-green-500 bg-green-100 dark:bg-green-900/20'
                          : formData.riskLevel === 'medium'
                            ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20'
                            : 'text-red-500 bg-red-100 dark:bg-red-900/20'
                      )}>
                        {formData.riskLevel.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Collateral Lock Amount
                  </label>
                  <div className="relative mt-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 dark:text-gray-400">$</span>
                    </div>
                    <input
                      type="number"
                      name="collateralLock"
                      value={formData.collateralLock}
                      onChange={handleChange}
                      min={formData.prizePool * 0.1}
                      className={cn(
                        'block w-full rounded-md border pl-8 pr-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500',
                        errors.collateralLock
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
                      )}
                    />
                    {errors.collateralLock && (
                      <p className="mt-1 text-sm text-red-600">{errors.collateralLock}</p>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Minimum required: {formatCurrency(formData.prizePool * 0.1)} (10% of prize pool)
                  </p>
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
                          By creating this tournament, you agree to lock the specified collateral amount in the SolCraft platform. This collateral serves as security for investors and may be used to compensate them in case of disputes or tournament cancellation.
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
                      I understand that I am responsible for the proper execution of this tournament and agree to the SolCraft platform terms.
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
              
              {step < 4 ? (
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
                      Creating Tournament...
                    </span>
                  ) : (
                    'Create Tournament'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

