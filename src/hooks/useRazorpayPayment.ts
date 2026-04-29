import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { startPayment, completePayment } from '../utils/service';
import { loadRazorpayScript } from '../utils/razorpayLoader';
import toast from 'react-hot-toast';
import type { RazorpayOptions, RazorpaySuccessResponse } from '../types/razorpay';

export type PaymentStatus = 'idle' | 'initializing' | 'paying' | 'verifying' | 'success' | 'failed';

interface PaymentUser {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  billing_address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  user_id: string;
  device_id: string;
}

/**
 * Robust & Type-Safe Razorpay Payment Hook
 */
export const useRazorpayPayment = () => {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const initiatePayment = useCallback(async (userData: PaymentUser) => {
    if (status !== 'idle' && status !== 'failed') return;

    setStatus('initializing');
    setErrorMessage(null);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setStatus('idle');
        toast.error('Payment gateway failed to load.');
        return;
      }

      const startResponse = await startPayment(userData);
      if (!startResponse || !startResponse.data) {
        throw new Error(startResponse?.message || 'Failed to start payment.');
      }

      const {
        razorpay_order_id,
        total_amount,
        payment_session_id,
        first_name,
        last_name,
        email,
        phone
      } = startResponse.data;

      const options: RazorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: Math.round(total_amount * 100),
        currency: 'INR',
        name: 'InstaLearn',
        description: 'Course Subscription',
        order_id: razorpay_order_id,
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            setStatus('verifying');
            const verificationResponse = await completePayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              payment_session_id: payment_session_id || '',
            });

            if (verificationResponse && verificationResponse.status !== 'failed') {
              // Add a small delay for better UX so the user sees the "Verifying" state
              setTimeout(() => {
                setStatus('success');
                toast.success('Payment Verified!');
                
                // Auto redirect after another 2 seconds
                setTimeout(() => navigate('/my-learning'), 2000);
              }, 1500);
            } else {
              throw new Error(verificationResponse?.message || 'Verification failed.');
            }
          } catch (error: any) {
            console.error('Verify Error:', error);
            setStatus('failed');
            setErrorMessage(error.message || 'Payment verification failed.');
          }
        },
        prefill: {
          name: `${first_name} ${last_name}`,
          email: email,
          contact: phone,
        },
        theme: { color: '#4f46e5' },
        modal: {
          ondismiss: () => {
            setStatus((prev) => (prev === 'paying' ? 'idle' : prev));
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (resp: any) => {
        setStatus('failed');
        setErrorMessage(resp.error.description || 'Payment failed.');
      });

      setStatus('paying');
      rzp.open();
    } catch (error: any) {
      console.error('Init Error:', error);
      setStatus('failed');
      setErrorMessage(error.message || 'Initialization failed.');
      toast.error('Payment initialization failed.');
    }
  }, [status, navigate]);

  const resetPayment = useCallback(() => {
    setStatus('idle');
    setErrorMessage(null);
  }, []);

  return {
    initiatePayment,
    resetPayment,
    status,
    errorMessage,
    isLoading: status === 'initializing' || status === 'verifying'
  };
};
