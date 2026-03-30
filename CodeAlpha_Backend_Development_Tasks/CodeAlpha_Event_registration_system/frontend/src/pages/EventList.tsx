import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Users, Ticket, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  imageUrl?: string;
  registrationsCount?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20
    }
  }
};

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

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

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-b-[3rem] shadow-2xl mb-16 pt-20 pb-32 px-4 sm:px-6 lg:px-8 border-b border-indigo-500/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-40 left-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-8 shadow-xl">
              <Sparkles size={16} className="text-indigo-400" />
              <span>Discover the Extraordinary</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200">
              Find Your Next <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Great Experience</span>
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-slate-300 font-medium">
              Join thousands of creators, innovators, and leaders at the world's most anticipated events and conferences.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Upcoming Events</h2>
        </div>

        {events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white/50 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 backdrop-blur-xl"
          >
            <div className="mx-auto w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <CalendarDays className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No events found</h3>
            <p className="text-lg text-slate-500">Check back later for new events.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <Link 
                  to={`/events/${event.id}`}
                  className="group flex flex-col h-full bg-white dark:bg-[#111827] rounded-[2rem] overflow-hidden border border-slate-200/60 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative"
                >
                  <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 ease-in-out">
                        <CalendarDays size={48} className="text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-slate-900 dark:text-white shadow-lg border border-white/20">
                      {format(new Date(event.date), 'MMM d, yyyy')}
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col flex-1 relative z-10 bg-white dark:bg-[#111827] group-hover:-translate-y-2 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3">
                          <MapPin size={16} className="text-indigo-500" />
                        </div>
                        <span className="truncate font-medium">{event.location}</span>
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mr-3">
                          <Users size={16} className="text-purple-500" />
                        </div>
                        <span className="font-medium">Capacity: {event.capacity}</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center text-sm font-bold text-slate-500 dark:text-slate-400">
                        <Ticket size={18} className="mr-2" />
                        Available
                      </div>
                      <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 dark:text-indigo-400 transition-colors">
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EventList;
