import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RouteCardProps {
  from: string;
  to: string;
  price: string;
  imageUrl: string;
}

const RouteCard: React.FC<RouteCardProps> = ({ from, to, price, imageUrl }) => {
  return (
    <Link 
      to={`/search?from=${from}&to=${to}`}
      className="block group"
    >
      <div className="relative rounded-lg overflow-hidden shadow-md h-64">
        <img 
          src={imageUrl} 
          alt={`${from} to ${to}`} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <div className="text-lg font-semibold">{from} <ArrowRight className="inline h-4 w-4" /> {to}</div>
            <div className="bg-blue-600 px-2 py-1 rounded text-sm font-medium">From {price}</div>
          </div>
          <div className="flex items-center text-sm">
            <span>View available trips</span>
            <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

const PopularRoutes: React.FC = () => {
  const popularRoutes = [
    {
      from: 'Douala',
      to: 'Yaoundé',
      price: '5,000 FCFA',
      //imageUrl: 'https://images.unsplash.com/photo-1588974728772-4c153dcd1c76?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      imageUrl:'public/doul.jpg'
    },
    {
      from: 'Bamenda',
      to: 'Bafoussam',
      price: '4,500 FCFA',
      //imageUrl: 'https://images.unsplash.com/photo-1513125370-3460ebe3401b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80'
      imageUrl: 'public/trav.jpg'
    },
    {
      from: 'Yaoundé',
      to: 'Douala',
      price: '5,000 FCFA',
      //imageUrl: 'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
      imageUrl: 'public/yaounde.jpg'
    },
    {
      from: 'Buea',
      to: 'Douala',
      price: '3,000 FCFA',
      imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Popular Routes</h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover the most traveled routes across Cameroon
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularRoutes.map((route, index) => (
            <RouteCard
              key={index}
              from={route.from}
              to={route.to}
              price={route.price}
              imageUrl={route.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;