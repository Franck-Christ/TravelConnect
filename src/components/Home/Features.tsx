import React from 'react';
import { CreditCard, MapPin, Phone, Shield, Ticket, Truck } from 'lucide-react';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="bg-blue-100 p-3 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Ticket className="h-8 w-8 text-blue-600" />,
      title: 'Easy Booking',
      description: 'Book your tickets in just a few clicks, anytime and anywhere.'
    },
    {
      icon: <CreditCard className="h-8 w-8 text-blue-600" />,
      title: 'Flexible Payment',
      description: 'Pay with MTN MoMo, Orange Money, or save your ticket for cash payment at the agency.'
    },
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      title: 'Live Tracking',
      description: 'Track your bus in real-time and get updates on arrival times.'
    },
    {
      icon: <Phone className="h-8 w-8 text-blue-600" />,
      title: 'Mobile Tickets',
      description: 'Get your e-tickets directly on your phone. No printing needed.'
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Secure Booking',
      description: 'Your personal and payment information is always protected.'
    },
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: 'Multiple Agencies',
      description: 'Compare prices and services from different transport agencies.'
    }
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Why Choose TravelConnect</h2>
          <p className="mt-4 text-xl text-gray-600">
            We make intercity travel in Cameroon simple and convenient
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;