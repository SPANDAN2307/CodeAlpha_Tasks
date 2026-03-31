import React, { useState, useEffect } from 'react';
import { getUserRegistrations, cancelRegistration } from '../services/api';
import { format } from 'date-fns';
import { MapPin, Calendar, Trash2, Ticket, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface Registration {
  id: string;
  userName: string;
  userEmail: string;
  eventId: string;
  Event: {
    id: string;
    title: string;
    date: string;
    location: string;
    imageUrl?: string;
  };
  createdAt: string;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchRegistrations = async () => {
      try {
        const { data } = await getUserRegistrations();
        setRegistrations(data);
      } catch (err: any) {
        setError('Failed to find registrations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user, navigate]);

  const handleCancelRegistration = async (id: string, eventTitle: string) => {
    if (window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
      try {
        await cancelRegistration(id);
        setRegistrations(prev => prev.filter(reg => reg.id !== id));
      } catch (err) {
        alert('Failed to cancel registration');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="mx-auto w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 transform rotate-3">
          <LayoutDashboard size={40} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-6">
          My Tickets Hub
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium">
          Welcome back, {user?.email}! Here are your upcoming experiences.
        </p>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center font-bold text-red-500 bg-red-50 dark:bg-red-500/10 py-4 px-6 rounded-2xl max-w-xl mx-auto border border-red-200 dark:border-red-500/20"
        >
          {error}
        </motion.div>
      )}

      {/* Results */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8"
      >
        {registrations.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#111827] rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-xl">
            <div className="mx-auto w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <Ticket className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No tickets found</h3>
            <p className="mt-2 text-slate-500 font-medium text-lg mb-8">You haven't registered for any events yet.</p>
            <Link to="/">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-600/20"
              >
                Browse Events
              </motion.button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6 hidden">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Your Tickets <span className="text-indigo-500">({registrations.length})</span>
              </h2>
            </div>
            
            <div className="grid gap-6">
              <AnimatePresence>
                {registrations.map((reg) => (
                  <motion.div 
                    key={reg.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/5 rounded-[2rem] p-5 sm:p-6 flex flex-col sm:flex-row gap-8 items-start sm:items-center shadow-lg hover:shadow-xl transition-shadow group relative overflow-hidden"
                  >
                    {/* Ticket Notch effect left */}
                    <div className="absolute left-0 top-1/2 -mt-4 -ml-4 w-8 h-8 rounded-full bg-slate-50 dark:bg-[#0B0F19] border-r border-slate-200 dark:border-white/5 z-10 hidden sm:block"></div>
                    
                    <div className="h-32 w-full sm:w-48 rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden relative">
                        {reg.Event.imageUrl ? (
                          <img src={reg.Event.imageUrl} alt={reg.Event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <Calendar className="text-white/30 w-12 h-12" />
                          </div>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0 w-full pl-0 sm:pl-4 border-l-0 sm:border-l-2 border-dashed border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">Confirmed</span>
                      </div>
                      <Link to={`/events/${reg.Event.id}`} className="block text-2xl font-black text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2 mb-4 leading-tight">
                        {reg.Event.title}
                      </Link>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-500 dark:text-slate-400 font-medium">
                        <div className="flex items-center">
                          <Calendar size={18} className="mr-2 text-indigo-400" />
                          {format(new Date(reg.Event.date), 'MMM d, yyyy \u2022 h:mm a')}
                        </div>
                        <div className="flex items-center">
                          <MapPin size={18} className="mr-2 text-purple-400" />
                          {reg.Event.location}
                        </div>
                      </div>
                    </div>

                    <div className="w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5 pl-0 sm:pl-4">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancelRegistration(reg.id, reg.Event.title)}
                        className="flex items-center justify-center gap-2 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 dark:bg-red-500/10 dark:hover:bg-red-500 px-6 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto"
                      >
                        <Trash2 size={18} />
                        <span>Cancel Order</span>
                      </motion.button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;
