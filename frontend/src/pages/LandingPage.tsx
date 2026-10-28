import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Wallet,
  Calendar,
  MapPin,
  CheckCircle,
  Star,
  Users,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { POPULAR_DESTINATIONS } from '../utils/constants';

export const LandingPage: React.FC = () => {
  const features = [
    {
      title: 'Smart AI Planning',
      desc: 'Our intelligent travel engine synthesizes opening hours, footpaths, local crowds, and optimal daily pacing so your days feel seamless.',
      icon: <Sparkles className="w-6 h-6 text-[#D4A017]" />,
      bg: 'bg-amber-50',
    },
    {
      title: 'Dynamic Budget Optimization',
      desc: 'Set your spending target in any currency. WanderWise balances boutique stays, gourmet dining, and hidden gem experiences within budget.',
      icon: <Wallet className="w-6 h-6 text-[#2D5016]" />,
      bg: 'bg-[#E8F0E4]',
    },
    {
      title: 'Unified Trip Organization',
      desc: 'Interactive maps with numbered pins, printable timetables, and instant shareable links for family and travel companions.',
      icon: <Compass className="w-6 h-6 text-[#4A7C23]" />,
      bg: 'bg-emerald-50',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose Destination & Dates',
      desc: 'Enter any city, country, or multi-city route with your intended travel dates.',
      icon: MapPin,
    },
    {
      step: '02',
      title: 'Specify Your Travel Style',
      desc: 'Pick your companions, comfort tier, daily pace, and personal culinary or art interests.',
      icon: Users,
    },
    {
      step: '03',
      title: 'Generate Day-by-Day Blueprint',
      desc: 'Our AI engine curates a minute-by-minute schedule complete with locations, costs, and tips.',
      icon: Sparkles,
    },
    {
      step: '04',
      title: 'Customize, Share & Explore',
      desc: 'Regenerate specific days, view interactive maps, or share real-time links with friends.',
      icon: Compass,
    },
  ];

  const testimonials = [
    {
      name: 'Sofia Montgomery',
      role: 'Solo Explorer & Photographer',
      quote:
        'WanderWise AI planned my 10-day Iceland ring road trip down to geothermal baths and sunset vistas. Saved me 20+ hours of tedious forum research!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'David & Marcus Chen',
      role: 'Couple Travelers',
      quote:
        'The Kyoto itinerary was extraordinary. The pacing was relaxed yet packed with sublime tea rooms and quiet morning temple walks before crowds arrived.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Family Vacation Planner',
      quote:
        'Traveling with 2 kids usually stresses us out. WanderWise factored in playground pauses, kid-friendly tapas, and easy stroller routes in Barcelona!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-8">
        {/* Background Gradients & Travel Imagery */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1920&q=80')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2D5016]/85 via-[#1F380F]/80 to-[#FFFFF0]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 pt-12 sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[#FFFFF0] text-xs sm:text-sm font-semibold shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#F0C75E]" />
            <span>Next-Generation Travel Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight"
          >
            Your AI Travel Planning <span className="text-[#F0C75E] italic">Assistant</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Turn destination dreams into customized, day-by-day itineraries in seconds. Smart routes, budget control, and local gems tailored to your vibe.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/trips/new" className="w-full sm:w-auto">
              <Button
                variant="amber"
                size="lg"
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto px-8 py-4 text-base font-bold shadow-xl"
              >
                Plan My Trip Now
              </Button>
            </Link>

            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/10 text-white border-white/40 hover:bg-white/20"
              >
                Explore Sample Itineraries
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pt-10 grid grid-cols-3 max-w-lg mx-auto text-white/90 border-t border-white/20"
          >
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#F0C75E]">50K+</p>
              <p className="text-xs uppercase tracking-wider text-white/70">Days Planned</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#F0C75E]">120+</p>
              <p className="text-xs uppercase tracking-wider text-white/70">Countries</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-[#F0C75E]">4.9/5</p>
              <p className="text-xs uppercase tracking-wider text-white/70">Explorer Rating</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] bg-[#E8F0E4] px-3.5 py-1 rounded-full">
            Why WanderWise
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">
            Travel Planning, Reimagined by AI
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            No more messy spreadsheets or 30 open browser tabs. We synthesize travel data into one intuitive itinerary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 border border-[#E8F0E4] shadow-xs hover:shadow-xl transition-all duration-300 space-y-4"
            >
              <div className={`w-14 h-14 rounded-2xl ${feat.bg} flex items-center justify-center`}>
                {feat.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#1A1A2E]">{feat.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-[#FFF8DC]/60 py-20 border-y border-[#87A96B]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] bg-[#E8F0E4] px-3.5 py-1 rounded-full">
              Intuitive Process
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">
              From Idea to Itinerary in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, i) => {
              const IconComp = st.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-6 border border-[#87A96B]/30 shadow-xs relative flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-3xl font-extrabold text-[#D4A017]">
                        {st.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#E8F0E4] text-[#2D5016] flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[#1A1A2E]">{st.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Destinations Grid */}
      <section id="destinations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] bg-[#E8F0E4] px-3.5 py-1 rounded-full">
              Trending Escapes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E] mt-2">
              Popular Global Destinations
            </h2>
          </div>
          <Link to="/trips/new">
            <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Custom Destination
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {POPULAR_DESTINATIONS.map((dest, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8F0E4] shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="text-2xl drop-shadow-md">{dest.flag}</span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-serif text-2xl font-bold">{dest.city}</h3>
                  <p className="text-xs text-white/80">{dest.country}</p>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 italic">
                    "{dest.tagline}"
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {dest.highlights.map((h, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold bg-[#E8F0E4] text-[#2D5016] px-2.5 py-0.5 rounded-full"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 font-semibold block">Suggested</span>
                    <span className="text-xs font-bold text-[#1A1A2E]">{dest.avgDays}</span>
                  </div>
                  <Link
                    to={`/trips/new?dest=${encodeURIComponent(dest.city + ', ' + dest.country)}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#2D5016] hover:text-[#1F380F]"
                  >
                    <span>Plan This</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D5016] bg-[#E8F0E4] px-3.5 py-1 rounded-full">
            Traveler Stories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A2E]">
            Loved by Adventurers Across 120 Countries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8F0E4] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#D4A017]">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">"{t.quote}"</p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#87A96B]/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#1A1A2E]">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#2D5016] text-[#FFFFF0] p-8 sm:p-14 shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-6">
          <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-[#4A7C23]/30 blur-2xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-[#D4A017]/20 blur-2xl pointer-events-none" />

          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md">
            Ready For Your Next Adventure?
          </span>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold max-w-2xl leading-tight">
            Design Your Dream Travel Itinerary In Under 60 Seconds
          </h2>

          <p className="text-white/80 max-w-xl text-sm sm:text-base">
            No credit card required. Experience personalized routes, dynamic daily schedules, and interactive maps.
          </p>

          <Link to="/trips/new">
            <Button
              variant="amber"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="px-8 py-4 font-bold text-base shadow-xl"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
