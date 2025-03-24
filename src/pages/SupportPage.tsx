import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react';
import Layout from '../components/Layout/Layout';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const SupportPage: React.FC = () => {
  const faqs = [
    {
      question: "How do I book a ticket?",
      answer: "You can book a ticket by searching for your desired route, selecting a trip, choosing your seat, and completing the payment process. You can pay using MTN MoMo, Orange Money, or reserve your ticket for cash payment at the agency."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel your booking up to 24 hours before the departure time. Go to 'My Trips', select the trip you want to cancel, and click on the 'Cancel Trip' button. Refund policies vary by agency."
    },
    {
      question: "How do I get my ticket?",
      answer: "After booking, your e-ticket will be available in the 'My Trips' section of the app. You can show the QR code to the agency staff at the station. You can also download the ticket or share it via WhatsApp."
    },
    {
      question: "Can I change my travel date?",
      answer: "Yes, you can change your travel date up to 24 hours before departure. Go to 'My Trips', select the trip you want to modify, and click on 'Change Date'. Additional fees may apply depending on the agency's policy."
    },
    {
      question: "What happens if I miss my bus?",
      answer: "If you miss your bus, contact the transport agency immediately. Some agencies may allow you to take the next available bus, subject to seat availability and possibly an additional fee."
    },
    {
      question: "How much luggage can I bring?",
      answer: "Luggage allowance varies by agency and bus type. Generally, each passenger is allowed one large bag and one small carry-on. Additional luggage may incur extra charges. Check the specific agency's policy during booking."
    },
    {
      question: "Is there a discount for children?",
      answer: "Some agencies offer discounts for children under a certain age. This information will be displayed during the booking process if applicable."
    },
    {
      question: "How do I track my bus?",
      answer: "For buses with GPS tracking enabled, you can track your bus in real-time through the 'My Trips' section. Select your upcoming trip and click on 'Track Bus'."
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Customer Support</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Call Us</h2>
              <p className="text-gray-600 mb-4">
                Our support team is available from 8am to 8pm, 7 days a week.
              </p>
              <a 
                href="tel:+2376XXXXXXXX" 
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                +237 6XX XXX XXX
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Email Us</h2>
              <p className="text-gray-600 mb-4">
                Send us an email and we'll get back to you within 24 hours.
              </p>
              <a 
                href="mailto:support@travelconnect.cm" 
                className="text-blue-600 font-medium hover:text-blue-800"
              >
                support@travelconnect.cm
              </a>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
              <div className="bg-blue-100 p-3 rounded-full mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Live Chat</h2>
              <p className="text-gray-600 mb-4">
                Chat with our support team for immediate assistance.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out">
                Start Chat
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <div className="flex items-center mb-6">
              <HelpCircle className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <FAQItem 
                  key={index} 
                  question={faq.question} 
                  answer={faq.answer} 
                />
              ))}
            </div>
          </div>
          
          <div className="bg-blue-800 text-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Still Need Help?</h2>
              <p className="text-blue-100">
                If you couldn't find the answer to your question, please contact us directly.
              </p>
            </div>
            
            <form className="max-w-2xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  placeholder="What is your inquiry about?"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  placeholder="Please describe your issue in detail"
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-white text-blue-800 hover:bg-gray-100 font-bold py-2 px-6 rounded-md transition duration-150 ease-in-out"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;