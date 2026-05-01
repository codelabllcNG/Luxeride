'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
// 1. Import AnimatePresence
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';
import { Modal } from '@/components/shared/Modal';
import { BookingHistoryCard } from '@/components/user/BookingHistoryCard';
import { PageLoader } from '@/components/shared/PageLoader';
import { 
  LogOutIcon, 
  Loader2, 
  CameraIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { useShallow } from 'zustand/react/shallow';
import { logoutAction } from '@/lib/api/auth';
import { getBookingByEmail } from '@/lib/api/booking';
import { uploadProfileImageAction } from '@/lib/api/user'; 
import AccountSettings from '@/components/user/AccountSettings';
import PaymentMethods from '@/components/user/PaymentMethods';
import { ReviewForm } from '@/components/user/ReviewForm';
import { toast } from 'sonner';

export default function UserDashboardPage() {
  const { user, clearUser, setUser } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      clearUser: state.clearUser,
      setUser: state.setUser,
    }))
  );

  const router = useRouter();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'bookings' | 'settings' | 'payments'>('bookings');
  const [isUploading, setIsUploading] = useState(false);
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted || !user?.email) return;

    const fetchBookings = async () => {
      try {
        setIsLoadingBookings(true);
        const response = await getBookingByEmail(user.email);
        if (response?.success && Array.isArray(response.data)) {
          setBookings(response.data);
        }
      } catch (error) {
        toast.error(`Error fetching bookings: ${error}`);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user?.email, hasMounted]);

  const handleLogout = async () => {
    await logoutAction();
    clearUser();
    router.push('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.ID) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append("profile_image", file); 
      formData.append("user_id", user.ID.toString()); 

      const result = await uploadProfileImageAction(formData);
      if (result.status === "success" && result.data?.data.image_url) {
        setUser({
          ...user,
          profile_image: result.data.data.image_url
        });

        toast.success("Profile image updated successfully!");
        
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert(result.message);
      }
    } catch (error) {
      toast.error("Failed to update profile image");
    } finally {
      setIsUploading(false);
    }
  };

  const formatServiceName = (name: string) => {
    if (!name) return 'Service Booking';
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (!hasMounted) return <div className="min-h-screen bg-dark" />;


  const upcomingBookings = bookings.filter(b => b.status?.toLowerCase().trim() === 'publish');
  const pastBookings = bookings.filter(b => ['completed', 'cancelled'].includes(b.status?.toLowerCase().trim()));

  const totalPages = Math.ceil(upcomingBookings.length / itemsPerPage);

  const paginatedBookings = upcomingBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <main className="min-h-screen bg-dark pt-28 pb-12">
      <section className="bg-dark-charcoal border-b border-dark-lighter mt-10 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
               <div className="w-20 h-20 rounded-full bg-dark-lighter border-2 border-primary/20 flex items-center justify-center overflow-hidden shadow-lg hover:border-primary transition-colors duration-300">
                  {user?.profile_image ? (
                    <img 
                      src={user.profile_image} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span className="text-2xl font-semibold text-primary">
                      {user?.first_name && user?.last_name
                        ? `${user.first_name.charAt(0).toUpperCase()}${user.last_name.charAt(0).toUpperCase()}`
                        : 'U'}
                    </span>
                  )}
               </div>
               
               {/* Hover Overlay Icon */}
               <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CameraIcon className="w-6 h-6 text-white" />
               </div>

               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*" 
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-grey-pastel">
                  Welcome, {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-grey-medium">
                  {user?.registered ? `Member since ${new Date(user.registered).getFullYear()}` : 'User Dashboard'}
                </p>
              </div>
            </div>
            
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOutIcon className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-2 bg-dark-charcoal border-white/5">
              <nav className="space-y-1">
                {[
                  { id: 'bookings', label: 'My Bookings' }, 
                  { id: 'payments', label: 'Payment Methods' },
                  { id: 'settings', label: 'Account Settings' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                      activeTab === item.id 
                        ? 'bg-primary text-black' 
                        : 'text-grey-pastel hover:bg-dark-lighter'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'bookings' ? (
                <div className="space-y-8">
                  {isLoadingBookings ? (
                    <div className="py-20 text-center text-grey-medium">
                     <PageLoader />
                    </div>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-xl font-bold text-grey-pastel mb-6">Upcoming Bookings</h2>
                        
                        {/* 2. Wrap list in AnimatePresence with mode="wait" */}
                        <div className="min-h-[200px]">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentPage} // Triggers animation on page change
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-4"
                            >
                              {paginatedBookings.length > 0 ? (
                                paginatedBookings.map((b) => (
                                  <BookingHistoryCard 
                                    key={b.id} 
                                    id={b.id.toString()} 
                                    service={formatServiceName(b.service_type)} 
                                    date={b.pickup_date} 
                                    time={b.pickup_time} 
                                    pickup={b.pickup_location} 
                                    dropoff={b.dropoff_location} 
                                    price="Completed" 
                                    status={b.status} 
                                    passengers={b.passengers} 
                                    onReview={() => { setSelectedBookingId(b.id.toString()); setIsReviewModalOpen(true); }} 
                                  />
                                ))
                              ) : (
                                <p className="text-grey-dark italic">No upcoming trips.</p>
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </div>

                        {/* 3. Animated Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-center mt-8 space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg border border-grey-dark text-grey-dark hover:bg-grey-dark hover:text-grey-pastel transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </motion.button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <motion.button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {currentPage === page && (
                                  <motion.div
                                    layoutId="activePage"
                                    className="absolute inset-0 bg-primary rounded-lg"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                  />
                                )}
                                <span className={`relative z-10 ${currentPage === page ? 'text-black font-bold' : 'text-grey-medium hover:text-white'}`}>
                                  {page}
                                </span>
                              </motion.button>
                            ))}

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg border border-grey-dark text-grey-dark hover:bg-grey-dark hover:text-grey-pastel transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </motion.button>
                          </div>
                        )}
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-grey-pastel mb-6 pt-4 border-t border-white/5 mt-8">Past Bookings</h2>
                        <div className="space-y-4">
                          {pastBookings.length > 0 ? (
                            pastBookings.map((b) => (
                              <BookingHistoryCard 
                                key={b.id} 
                                id={b.id.toString()} 
                                service={formatServiceName(b.service_type)} 
                                date={b.pickup_date} 
                                time={b.pickup_time} 
                                pickup={b.pickup_location} 
                                dropoff={b.dropoff_location} 
                                price="Completed" 
                                status={b.status} 
                                passengers={b.passengers} 
                                onReview={() => { setSelectedBookingId(b.id.toString()); setIsReviewModalOpen(true); }} 
                              />
                            ))
                          ) : (
                            <p className="text-grey-dark italic">No past trips recorded.</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : activeTab === 'payments' ? (
                <PaymentMethods />
              ) : (
                <AccountSettings />
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Rate Your Experience">
        <ReviewForm bookingId={selectedBookingId || ''} onSubmit={() => setIsReviewModalOpen(false)} onCancel={() => setIsReviewModalOpen(false)} />
      </Modal>
    </main>
  );
}