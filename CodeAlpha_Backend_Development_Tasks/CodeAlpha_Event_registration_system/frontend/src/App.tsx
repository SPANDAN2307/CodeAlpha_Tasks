import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import EventList from './pages/EventList';
import EventDetails from './pages/EventDetails';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AddEvent from './pages/AddEvent';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Calendar, User, PlusCircle, LogOut, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, isAdmin, logoutState } = useAuth();
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300"
              >
                <Calendar size={24} strokeWidth={2.5} />
              </motion.div>
              <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                EventHub
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <Link to="/admin/create-event">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold transition-all flex items-center gap-2"
                >
                  <PlusCircle size={18} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Create Event</span>
                </motion.div>
              </Link>
            )}

            {user ? (
              <>
                <Link to="/dashboard">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 font-semibold transition-all flex items-center gap-2"
                  >
                    <User size={18} strokeWidth={2.5} />
                    <span className="hidden sm:inline">My Tickets</span>
                  </motion.div>
                </Link>
                <button onClick={logoutState}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                  >
                    <LogOut size={20} strokeWidth={2.5} />
                  </motion.div>
                </button>
              </>
            ) : (
              <Link to="/login">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold transition-all shadow-md flex items-center gap-2"
                >
                  <LogIn size={18} strokeWidth={2.5} />
                  <span>Login</span>
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
          <Navbar />
          <main className="min-h-[calc(100vh-5rem)]">
            <Routes>
              <Route path="/" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin/create-event" element={<AddEvent />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
