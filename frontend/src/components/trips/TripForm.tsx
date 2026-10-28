import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { TripCreate } from '../../types/trip';
import { validateStep } from '../../utils/validators';
import { Button } from '../common/Button';
import { StepIndicator } from './StepIndicator';
import { DestinationStep } from './DestinationStep';
import { TravelerStep } from './TravelerStep';
import { BudgetStep } from './BudgetStep';
import { InterestsStep } from './InterestsStep';
import { StyleStep } from './StyleStep';
import { RequirementsStep } from './RequirementsStep';
import { ReviewStep } from './ReviewStep';

export interface TripFormProps {
  onSubmit: (tripData: TripCreate) => Promise<any>;
  isSubmitting?: boolean;
  initialDestination?: string;
}

const TOTAL_STEPS = 7;

export const TripForm: React.FC<TripFormProps> = ({
  onSubmit,
  isSubmitting = false,
  initialDestination = '',
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<TripCreate>({
    destination: initialDestination || '',
    start_date: '',
    end_date: '',
    travelers: 2,
    travel_group: 'couple',
    budget: 3000,
    currency: 'USD',
    budget_level: 'moderate',
    interests: ['art_culture', 'culinary', 'historical'],
    travel_pace: 'moderate',
    accommodation_style: 'boutique_hotel',
    transportation: ['walking', 'public_transit'],
    dietary_restrictions: [],
    accessibility_needs: [],
    avoid_activities: [],
    additional_notes: '',
  });

  const updateFields = (fields: Partial<TripCreate>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    // Clear relevant errors
    const errorKeys = Object.keys(fields);
    if (errorKeys.length > 0) {
      setErrors((prev) => {
        const next = { ...prev };
        errorKeys.forEach((key) => delete next[key]);
        return next;
      });
    }
  };

  const handleNext = () => {
    const { isValid, errors: stepErrors } = validateStep(currentStep, formData);
    if (!isValid) {
      setErrors(stepErrors);
      return;
    }

    setErrors({});
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/dashboard');
    }
  };

  const handleFinalSubmit = async () => {
    try {
      const res = await onSubmit(formData);
      if (res && res.id) {
        navigate(`/trips/${res.id}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Trip creation failed:', err);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DestinationStep
            destination={formData.destination}
            startDate={formData.start_date}
            endDate={formData.end_date}
            onChange={updateFields}
            errors={errors}
          />
        );
      case 2:
        return (
          <TravelerStep
            travelers={formData.travelers}
            travelGroup={formData.travel_group}
            onChange={updateFields}
            errors={errors}
          />
        );
      case 3:
        return (
          <BudgetStep
            budget={formData.budget}
            currency={formData.currency}
            budgetLevel={formData.budget_level}
            travelers={formData.travelers}
            onChange={updateFields}
            errors={errors}
          />
        );
      case 4:
        return (
          <InterestsStep
            interests={formData.interests}
            onChange={(interests) => updateFields({ interests })}
            errors={errors}
          />
        );
      case 5:
        return (
          <StyleStep
            travelPace={formData.travel_pace}
            accommodationStyle={formData.accommodation_style}
            transportation={formData.transportation}
            onChange={updateFields}
            errors={errors}
          />
        );
      case 6:
        return (
          <RequirementsStep
            dietaryRestrictions={formData.dietary_restrictions}
            accessibilityNeeds={formData.accessibility_needs}
            avoidActivities={formData.avoid_activities}
            additionalNotes={formData.additional_notes}
            onChange={updateFields}
          />
        );
      case 7:
        return <ReviewStep tripData={formData} onEditStep={(step) => setCurrentStep(step)} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-[#E8F0E4]">
        {/* Step Indicator Header */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* Step Content with Motion Animation */}
        <div className="my-8 min-h-[380px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Form Footer Navigation */}
        <div className="pt-6 border-t border-[#E8F0E4] flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < TOTAL_STEPS ? (
            <Button
              type="button"
              variant="primary"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue to Step {currentStep + 1}
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleFinalSubmit}
              isLoading={isSubmitting}
              leftIcon={<Sparkles className="w-4 h-4 text-[#F0C75E]" />}
              className="px-8 shadow-lg bg-gradient-to-r from-[#2D5016] to-[#4A7C23]"
            >
              Generate AI Itinerary
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
