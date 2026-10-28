export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD (CA$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
  { code: 'CHF', symbol: 'CHF', label: 'CHF (Fr)' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$)' },
  { code: 'THB', symbol: '฿', label: 'THB (฿)' },
];

export const TRAVEL_GROUPS = [
  { id: 'solo', label: 'Solo Traveler', description: 'Exploring on your own terms', icon: 'Compass', defaultTravelers: 1 },
  { id: 'couple', label: 'Couple / Duo', description: 'Romantic getaways & pairs', icon: 'Heart', defaultTravelers: 2 },
  { id: 'family', label: 'Family', description: 'Kid-friendly & relaxed pace', icon: 'Users', defaultTravelers: 4 },
  { id: 'friends', label: 'Group of Friends', description: 'Social, vibrant & diverse', icon: 'Smile', defaultTravelers: 3 },
  { id: 'business', label: 'Work & Leisure', description: 'Bleisure with productivity', icon: 'Briefcase', defaultTravelers: 1 },
] as const;

export const BUDGET_LEVELS = [
  { id: 'budget', label: 'Budget-Savvy', description: 'Hostels, public transit, street food & free landmarks', range: 'Economic', icon: 'PiggyBank' },
  { id: 'moderate', label: 'Comfortable', description: '3-star hotels, local bistros & guided day tours', range: 'Balanced', icon: 'Wallet' },
  { id: 'premium', label: 'Premium', description: '4-star boutique stays, upscale dining & private transfers', range: 'High Quality', icon: 'Sparkles' },
  { id: 'luxury', label: 'Luxury Experience', description: '5-star resorts, Michelin restaurants & VIP access', range: 'Top Tier', icon: 'Crown' },
] as const;

export const TRAVEL_PACES = [
  { id: 'relaxed', label: 'Slow & Immersive', description: '1-2 key activities daily with abundant free leisure', icon: 'Coffee' },
  { id: 'moderate', label: 'Balanced Explorer', description: '3-4 activities with pleasant pacing and rest', icon: 'Compass' },
  { id: 'fast', label: 'Action-Packed', description: 'Maximized schedule taking in all major highlights', icon: 'Zap' },
] as const;

export const INTEREST_OPTIONS = [
  { id: 'art_culture', label: 'Art & Museums', category: 'Culture', icon: 'Palette', desc: 'Galleries, history & architecture' },
  { id: 'culinary', label: 'Food & Culinary', category: 'Food', icon: 'Utensils', desc: 'Street food, fine dining & tasting tours' },
  { id: 'nature', label: 'Nature & Parks', category: 'Outdoors', icon: 'Trees', desc: 'Hikes, national parks & botanical gardens' },
  { id: 'beaches', label: 'Beaches & Ocean', category: 'Relaxation', icon: 'Sun', desc: 'Coastal walks, sunbathing & water activities' },
  { id: 'historical', label: 'Historic Landmarks', category: 'Culture', icon: 'Landmark', desc: 'Castles, ruins & world heritage sites' },
  { id: 'nightlife', label: 'Nightlife & Bars', category: 'Entertainment', icon: 'Moon', desc: 'Rooftops, music clubs & local evening vibe' },
  { id: 'shopping', label: 'Shopping & Markets', category: 'Leisure', icon: 'ShoppingBag', desc: 'Artisan bazaars, boutiques & vintage spots' },
  { id: 'adventure', label: 'Adventure Sports', category: 'Active', icon: 'Mountain', desc: 'Kayaking, trekking & thrilling excursions' },
  { id: 'wellness', label: 'Spa & Wellness', category: 'Relaxation', icon: 'Flower2', desc: 'Thermal springs, yoga & rejuvenation' },
  { id: 'photography', label: 'Scenic Photography', category: 'Visual', icon: 'Camera', desc: 'Golden hour spots, vistas & photo tours' },
  { id: 'local_life', label: 'Local Neighborhoods', category: 'Culture', icon: 'MapPin', desc: 'Off-the-beaten-path vibes & cafe culture' },
  { id: 'music_festivals', label: 'Music & Shows', category: 'Entertainment', icon: 'Music', desc: 'Concerts, theatrical shows & festivals' },
];

export const ACCOMMODATION_STYLES = [
  { id: 'boutique_hotel', label: 'Boutique Hotel', desc: 'Unique character & personalized service' },
  { id: 'hotel_resort', label: 'Hotel & Resort', desc: 'Full amenities, pools & standard comfort' },
  { id: 'vacation_rental', label: 'Private Apartment / Villa', desc: 'Self-catering, spacious & homey' },
  { id: 'hostel_social', label: 'Social Hostel / Guesthouse', desc: 'Community atmosphere & budget friendly' },
  { id: 'eco_lodge', label: 'Eco-Lodge / Glamping', desc: 'Close to nature with sustainable touches' },
];

export const TRANSPORT_MODES = [
  { id: 'walking', label: 'Walking / Pedestrian' },
  { id: 'public_transit', label: 'Metro & Public Bus' },
  { id: 'taxi_rideshare', label: 'Taxi & Rideshare' },
  { id: 'rental_car', label: 'Rental Car' },
  { id: 'train', label: 'High-Speed Trains' },
  { id: 'bicycle', label: 'Bike Rental' },
];

export const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Halal',
  'Kosher',
  'Dairy-Free',
  'Nut Allergy',
  'Pescatarian',
];

export const ACCESSIBILITY_OPTIONS = [
  'Step-free access',
  'Elevator required',
  'Visual aid friendly',
  'Hearing accessibility',
  'Accessible public transit only',
  'Minimal walking distance',
];

export const POPULAR_DESTINATIONS = [
  {
    city: 'Kyoto',
    country: 'Japan',
    flag: '🇯🇵',
    tagline: 'Ancient temples & bamboo groves',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    avgDays: '5-7 Days',
    budgetTier: 'Moderate - Premium',
    highlights: ['Fushimi Inari', 'Arashiyama Bamboo Grove', 'Gion District'],
    lat: 35.0116,
    lng: 135.7681,
  },
  {
    city: 'Florence',
    country: 'Italy',
    flag: '🇮🇹',
    tagline: 'Renaissance art & Tuscan hills',
    image: 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80',
    avgDays: '4-6 Days',
    budgetTier: 'Moderate',
    highlights: ['Duomo', 'Uffizi Gallery', 'Ponte Vecchio'],
    lat: 43.7696,
    lng: 11.2558,
  },
  {
    city: 'Reykjavik',
    country: 'Iceland',
    flag: '🇮🇸',
    tagline: 'Northern lights & geothermal wonders',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    avgDays: '5-8 Days',
    budgetTier: 'Premium',
    highlights: ['Blue Lagoon', 'Golden Circle', 'Waterfalls'],
    lat: 64.1466,
    lng: -21.9426,
  },
  {
    city: 'Barcelona',
    country: 'Spain',
    flag: '🇪🇸',
    tagline: 'Gaudí marvels & Mediterranean coast',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80',
    avgDays: '4-7 Days',
    budgetTier: 'Budget - Moderate',
    highlights: ['Sagrada Família', 'Park Güell', 'Gothic Quarter'],
    lat: 41.3879,
    lng: 2.1699,
  },
  {
    city: 'Bali',
    country: 'Indonesia',
    flag: '🇮🇩',
    tagline: 'Tropical beaches & sacred temples',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    avgDays: '7-12 Days',
    budgetTier: 'Budget - Moderate',
    highlights: ['Ubud Rice Terraces', 'Uluwatu Sunset', 'Nusa Penida'],
    lat: -8.4095,
    lng: 115.1889,
  },
  {
    city: 'Cape Town',
    country: 'South Africa',
    flag: '🇿🇦',
    tagline: 'Table Mountain & coastal vineyards',
    image: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80',
    avgDays: '6-9 Days',
    budgetTier: 'Moderate',
    highlights: ['Table Mountain', 'Cape Point', 'Boulders Beach'],
    lat: -33.9249,
    lng: 18.4241,
  },
];
