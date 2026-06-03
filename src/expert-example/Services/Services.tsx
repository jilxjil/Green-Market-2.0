import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Service } from '../../types/interfaces/Services';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { services } from '../../data/services';
import BookingModal from '../Expert/BookingModal';
import { ServiceCategories } from './components/ServiceCategories';
import { ServiceFilters } from './components/ServiceFilters';
import { ServiceCard } from './components/ServiceCard';

export default function Services() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [servicesList, setServicesList] = useState(services);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Event handlers
  const handleRequestService = (serviceId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to request services');
      navigate('/auth/login');
      return;
    }

    const service = servicesList.find(s => s.id === serviceId);
    if (!service) return;

    if (!service.availability) {
      toast.error('This service is currently unavailable');
      return;
    }

    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleFollow = async (expertId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to follow experts');
      navigate('/auth/login');
      return;
    }

    try {
      const updatedServices = servicesList.map(service => {
        if (service.provider.id === expertId) {
          return {
            ...service,
            provider: {
              ...service.provider,
              isFollowing: !service.provider.isFollowing,
              followers: service.provider.isFollowing 
                ? service.provider.followers - 1 
                : service.provider.followers + 1
            }
          };
        }
        return service;
      });
      
      setServicesList(updatedServices);
      const service = servicesList.find(s => s.provider.id === expertId);
      const isNowFollowing = !service?.provider.isFollowing;
      toast.success(isNowFollowing ? 'Following expert' : 'Unfollowed expert');
    } catch (error) {
      toast.error('Failed to update follow status');
      setServicesList(servicesList);
    }
  };

  // Filter services based on selected criteria
  const filteredServices = servicesList.filter(service => (
    (selectedCategory === 'all' || service.category === selectedCategory) &&
    (!showAvailableOnly || service.availability) &&
    parseFloat(service.price.replace(/[^0-9.-]+/g, "")) <= priceRange[1]
  ));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Agricultural Services</h1>
      
      <ServiceCategories 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <div className="flex flex-col gap-8 mt-8">
        <ServiceFilters
          selectedCategory={selectedCategory}
          showAvailableOnly={showAvailableOnly}
          priceRange={priceRange}
          onCategoryChange={setSelectedCategory}
          onAvailabilityChange={setShowAvailableOnly}
          onPriceChange={(value) => setPriceRange([0, value])}
        />

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredServices.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onRequestService={handleRequestService}
                onFollowExpert={handleFollow}
                onExpertClick={(expertId) => navigate(`/expert/${expertId}`)}
              />
            ))}
          </div>
        </div>
      </div>
      
      {showBookingModal && selectedService && (
        <BookingModal
          service={selectedService}
          expert={selectedService.provider}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}