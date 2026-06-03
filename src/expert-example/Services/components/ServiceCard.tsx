import { FC } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChatBubbleLeftIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import type { Service } from '../../../types/interfaces/Services';

interface ServiceCardProps {
  service: Service;
  onRequestService: (serviceId: string) => void;
  onFollowExpert: (expertId: string) => void;
  onExpertClick: (expertId: string) => void;
}

export const ServiceCard: FC<ServiceCardProps> = ({ 
  service, 
  onRequestService, 
  onFollowExpert, 
  onExpertClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={service.image} 
          alt={service.title}
          className="w-full h-48 object-cover"
        />
        {!service.availability && (
          <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
            Currently Unavailable
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onExpertClick(service.provider.id);
              }}
              className="text-sm text-[#468847] hover:underline"
            >
              by {service.provider.name}
            </button>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(service.rating) 
                      ? 'text-yellow-400' 
                      : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {service.reviewCount} reviews
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {service.category}
          </span>
          <span className="text-sm text-gray-600">
            {service.location}
          </span>
        </div>

        <p className="text-sm text-gray-700 mb-4">{service.description}</p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-[#468847] font-medium">{service.price}</span>
          <div className="flex gap-2 action-buttons">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowExpert(service.provider.id);
              }}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
                service.provider.isFollowing
                  ? 'bg-gray-100 text-gray-700'
                  : 'bg-[#468847] text-white'
              }`}
            >
              {service.provider.isFollowing ? (
                <><UserMinusIcon className="h-4 w-4" /> Unfollow</>
              ) : (
                <><UserPlusIcon className="h-4 w-4" /> Follow</>
              )}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRequestService(service.id);
              }}
              className="flex items-center gap-1 px-3 py-1 bg-[#468847] text-white rounded-md text-sm"
              disabled={!service.availability}
            >
              <ChatBubbleLeftIcon className="h-4 w-4" />
              Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};