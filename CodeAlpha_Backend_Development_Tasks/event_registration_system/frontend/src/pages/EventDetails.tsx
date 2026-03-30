import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, registerForEvent } from '../services/api';
import { format } from 'date-fns';
import { Calendar, MapPin, Info, Ticket, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventDetailsType {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  remainingSpots: number;
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (id) {
          const { data } = await getEventById(id);
          setEvent(data);
        }
      } catch (err) {
        console.error('Failed to fetch event details', err);
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (id) {
        await registerForEvent({ eventId: id, userName: name, userEmail: email });
        setSuccess(true);
        setEvent(prev => prev ? { ...prev, remainingSpots: prev.remainingSpots - 1 } : prev);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 dark:border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Event not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 hover:underline">
          Go back home
        </button>
      </div>
    );
  }

  const isFull = event.remainingSpots <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-6xl mx-auto pb-20"
    >
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200 dark:border-white/5 w-max"
      >
        <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Back to events
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Event Info */}
        <div className="lg:col-span-2 space-y-10">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-[#111827] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl"
          >
            <div className="h-72 md:h-96 w-full bg-slate-200 dark:bg-slate-800 relative">
              {event.imageUrl ? (
                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
                  <Calendar size={80} className="text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              
              <div className="absolute bottom-8 left-8 right-8">
                <span className="inline-block px-4 py-1.5 bg-indigo-600/90 backdrop-blur-md text-white text-sm font-bold rounded-full mb-4 shadow-lg">
                  {format(new Date(event.date), 'MMMM d, yyyy')}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  {event.title}
                </h1>
              </div>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center">
                  <div className="p-4 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl mr-5">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Date & Time</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">
                      {format(new Date(event.date), 'EEEE')}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300">
                      {format(new Date(event.date), 'h:mm a')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="p-4 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl mr-5">
                    <MapPin size={28} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Location</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{event.location}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <Info className="text-indigo-500" /> About this event
                </h3>
                <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  <p className="whitespace-pre-line">{event.description || 'No description provided.'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Registration */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="sticky top-28 bg-white dark:bg-[#111827] rounded-[2.5rem] p-8 border border-slate-200 dark:border-white/5 shadow-2xl"
          >
            <div className="flex flex-col mb-8 text-center pb-8 border-b border-slate-100 dark:border-white/5">
              <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 transform -rotate-6">
                <Ticket size={32} />
              </div>
              <span className="text-3xl font-black text-slate-900 dark:text-white">Reserve Ticket</span>
              
              <div className="mt-4 flex justify-center gap-2">
                <span className={`px-4 py-1 flex items-center justify-center text-sm font-bold rounded-full ${
                  isFull ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' 
                  : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                }`}>
                  {isFull ? 'Sold Out' : 'Registration Open'}
                </span>
              </div>
              
              {!isFull && (
                 <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-3">
                   Only <strong className="text-indigo-600 dark:text-indigo-400">{event.remainingSpots}</strong> spots remaining!
                 </span>
              )}
            </div>

            {success ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4"
              >
                <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">You're IN!</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-[200px] mx-auto text-center">
                  Your ticket has been confirmed. See you there!
                </p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl transition-colors shadow-lg"
                >
                  View My Tickets
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm font-medium text-red-600 dark:text-red-400"
                  >
                    {error}
                  </motion.div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    disabled={isFull || isSubmitting}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-0 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all font-medium disabled:opacity-50 outline-none"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    disabled={isFull || isSubmitting}
                    className="w-full px-5 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-0 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all font-medium disabled:opacity-50 outline-none"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <motion.button
                  whileHover={!isFull && !isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isFull && !isSubmitting ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={isFull || isSubmitting}
                  className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-4 rounded-2xl shadow-xl shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center text-lg"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : isFull ? (
                    'Sold Out'
                  ) : (
                    'Register Now'
                  )}
                </motion.button>
                <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-6 font-medium">
                  Secure checkout. By registering, you agree to our Terms & Privacy Policy.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetails;
