import { TripCreate } from '../types/trip';

export interface FormError {
  field: string;
  message: string;
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validateStep(step: number, data: Partial<TripCreate>): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (step === 1) {
    if (!data.destination || data.destination.trim().length < 2) {
      errors.destination = 'Please enter a valid destination city or region.';
    }
    if (!data.start_date) {
      errors.start_date = 'Please select a departure start date.';
    }
    if (!data.end_date) {
      errors.end_date = 'Please select a return end date.';
    } else if (data.start_date && data.end_date < data.start_date) {
      errors.end_date = 'End date cannot be earlier than start date.';
    }
  }

  if (step === 2) {
    if (!data.travelers || data.travelers < 1) {
      errors.travelers = 'There must be at least 1 traveler.';
    } else if (data.travelers > 50) {
      errors.travelers = 'Group size cannot exceed 50 travelers.';
    }
    if (!data.travel_group) {
      errors.travel_group = 'Please select your travel group type.';
    }
  }

  if (step === 3) {
    if (data.budget === undefined || data.budget === null || data.budget <= 0) {
      errors.budget = 'Please enter a realistic estimated budget (greater than 0).';
    }
    if (!data.currency) {
      errors.currency = 'Please select your currency.';
    }
    if (!data.budget_level) {
      errors.budget_level = 'Please choose a comfort budget tier.';
    }
  }

  if (step === 4) {
    if (!data.interests || data.interests.length === 0) {
      errors.interests = 'Please select at least 1 travel interest to personalize your itinerary.';
    }
  }

  if (step === 5) {
    if (!data.travel_pace) {
      errors.travel_pace = 'Please choose your preferred travel pace.';
    }
    if (!data.accommodation_style) {
      errors.accommodation_style = 'Please choose your preferred accommodation style.';
    }
  }

  // Steps 6 and 7 are optional / review, so always valid
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
