import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  avatarUrl: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, rating, avatarUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-gray-600 mb-6 italic">"{quote}"</p>
      <div className="flex items-center">
        <img
          src={avatarUrl}
          alt={author}
          className="h-12 w-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "TravelConnect made my trip from Douala to Yaoundé so easy. I booked my ticket on my phone and paid with MTN MoMo. Highly recommend!",
      author: "Marie Nguemo",
      role: "Business Traveler",
      rating: 5,
      avatarUrl: ""
    },
    {
      quote: "I love that I can compare different bus companies and prices. Saved me a lot of money on my regular trips between Bamenda and Bafoussam.",
      author: "Jean Fomeni",
      role: "Student",
      rating: 4,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    },
    {
      quote: "The live tracking feature is amazing! I could share my journey with my family so they knew exactly when I would arrive. Great service!",
      author: "Esther Mbah",
      role: "Teacher",
      rating: 5,
      avatarUrl: "/model.jpg"
    }
  ];

  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="mt-4 text-xl text-gray-600">
            Trusted by thousands of travelers across Cameroon
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              rating={testimonial.rating}
              avatarUrl={testimonial.avatarUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;