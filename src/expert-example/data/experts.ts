import type { Expert } from '../types/interfaces/Expert';
import type { Service } from '../types/interfaces/Services';
import type { ServiceReview } from '../types/interfaces/Services';

export const experts: Expert[] = [
  {
    id: 'exp1',
    name: 'Dr. Kwame Mensah',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    specialty: 'Soil Science',
    experience: 15,
    bio: 'Expert in soil health and fertility management with over 15 years of experience',
    location: 'Kumasi',
    followers: 245,
    following: 123,
    isFollowing: false,
    rating: 4.8,
    contactNumber: '+233 20 123 4567',
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: '9:00 AM - 5:00 PM'
    }
  },
  {
    id: 'exp2',
    name: 'Dr. Sarah Addo',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    specialty: 'Veterinary Medicine',
    experience: 10,
    bio: 'Specialized veterinarian with expertise in livestock health and breeding techniques',
    location: 'Accra',
    followers: 180,
    following: 95,
    isFollowing: false,
    rating: 4.7,
    contactNumber: '+233 24 567 8901',
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: '8:00 AM - 4:00 PM'
    }
  },
  {
    id: 'exp3',
    name: 'Emmanuel Koffi',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    specialty: 'Agricultural Equipment',
    experience: 8,
    bio: 'Agricultural equipment specialist with extensive knowledge in modern farming machinery',
    location: 'Tamale',
    followers: 156,
    following: 82,
    isFollowing: false,
    rating: 4.5,
    contactNumber: '+233 26 789 0123',
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      hours: '7:00 AM - 6:00 PM'
    }
  }
];

export const mockReviews: ServiceReview[] = [
  {
    id: 'rev1',
    rating: 5,
    date: '2024-02-15',
    comment: 'Excellent service! Dr. Mensah provided detailed insights about our soil conditions.',
    serviceId: 'srv1',
    isVerified: true,
    user: {
      id: 'usr1',
      name: 'Kwesi Ameyaw',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
    }
  },
  {
    id: 'rev2',
    rating: 5,
    date: '2024-02-10',
    comment: 'Dr. Addo was very thorough in examining our livestock. Great professional!',
    serviceId: 'srv2',
    isVerified: true,
    user: {
      id: 'usr2',
      name: 'Abena Osei',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
    }
  },
  {
    id: 'rev3',
    rating: 4,
    date: '2024-02-12',
    comment: 'Equipment was in great condition and Emmanuel provided excellent guidance on usage.',
    serviceId: 'srv3',
    isVerified: true,
    user: {
      id: 'usr3',
      name: 'Yaw Mensah',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e'
    }
  }
];

export const services: Service[] = [
  {
    id: 'srv1',
    title: 'Soil Health Analysis',
    description: 'Comprehensive soil testing and fertility recommendations',
    price: 'GH₵200/acre',
    category: 'crop-advisory',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399',
    rating: 4.8,
    reviewCount: 156,
    availability: true,
    provider: experts[0],
    location: 'Kumasi',
    reviews: mockReviews.filter(review => review.serviceId === 'srv1')
  }
];