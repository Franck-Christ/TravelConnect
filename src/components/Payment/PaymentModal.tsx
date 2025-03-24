import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentComplete: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentComplete
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'mtn' | 'orange' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    // Format phone number
    let formattedPhone = phoneNumber;
    if (!phoneNumber.startsWith('+')) {
      formattedPhone = `+237${phoneNumber.replace(/^0+/, '')}`;
    }

    setProcessing(true);

    try {
      // In a real app, make API call to payment provider
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Payment request sent to ${formattedPhone}`);
      onPaymentComplete();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Mobile Money Payment</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handlePayment} className="p-4">
          <div className="mb-6">
            <p className="text-gray-600 mb-2">Amount to Pay:</p>
            <p className="text-2xl font-bold text-blue-600">
              {amount.toLocaleString()} FCFA
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mtn')}
                  className={`p-4 border rounded-lg flex flex-col items-center ${
                    paymentMethod === 'mtn'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/93/New_MTN_Logo.png"
                    alt="MTN MoMo"
                    className="h-8 mb-2"
                  />
                  <span className="text-sm font-medium">MTN Mobile Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('orange')}
                  className={`p-4 border rounded-lg flex flex-col items-center ${
                    paymentMethod === 'orange'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-500'
                  }`}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Orange_logo.svg"
                    alt="Orange Money"
                    className="h-8 mb-2"
                  />
                  <span className="text-sm font-medium">Orange Money</span>
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 6XXXXXXXX"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
            >
              {processing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Pay Now'
              )}
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500 text-center">
            You will receive a prompt on your phone to complete the payment
          </p>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;