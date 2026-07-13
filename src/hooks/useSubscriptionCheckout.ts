import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscriptionPlansApi, getUserProfileApi, startSubscriptionApi, completeSubscriptionApi } from '../utils/service';
import { loadRazorpayScript } from '../utils/razorpayLoader';
import type { CheckoutFormData, CheckoutErrors, Plan, CheckoutCalculation } from '../components/EnrollTeamComponent/types';
import { TAX_RATE, MOCK_COUPON_CODE, COUPON_DISCOUNT_PERCENT } from '../components/EnrollTeamComponent/constants';
import toast from 'react-hot-toast';

export const useSubscriptionCheckout = (planId: string | null) => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Form Fields State
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    gstNumber: '',
  });

  // Validation Errors
  const [errors, setErrors] = useState<CheckoutErrors>({});

  // Coupon State
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponApplied, setCouponApplied] = useState<boolean>(false);

  // Prefill profile details on load
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await getUserProfileApi();
        const user = res?.data || res;
        if (user) {
          setFormData((prev) => ({
            ...prev,
            firstName: user.first_name || user.name?.split(' ')[0] || '',
            lastName: user.last_name || user.name?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || user.mobile || user.phone1 || '',
            companyName: user.company_name || user.compnay_name || '',
          }));
        }
      } catch (err) {
        console.error("Error fetching user profile", err);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch plan details on mount
  useEffect(() => {
    if (!planId) {
      setLoading(false);
      return;
    }

    const fetchPlanDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getSubscriptionPlansApi();
        const apiPlans = res?.data || [];
        const found = apiPlans.find((p: any) => p.plan_id === planId || String(p.id) === planId);
        
        if (found) {
          const isRec = found.banner_text?.toLowerCase() === 'recommended';
          const isNew = found.banner_text?.toLowerCase() === 'new';
          if (isRec || isNew) {
            setPlan(found);
          } else {
            // Not a standard checkout plan, redirect to whatsapp
            const message = encodeURIComponent(`Hi, I'm interested in the ${found.plan_name} plan for our team training.`);
            window.open(`https://wa.me/919915039343?text=${message}`, '_blank');
            navigate('/enroll-team');
          }
        } else {
          toast.error("Plan not found. Please choose a valid plan.");
          navigate('/enroll-team');
        }
      } catch (err: any) {
        console.error("Error fetching plan in checkout", err);
        setError(err.message || "Failed to load payment plan.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanDetails();
  }, [planId, navigate]);

  // Handle Form field changes
  const updateFormField = useCallback((field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error on change
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // Form validation function (no toast notifications, clean inline validation)
  const validateForm = useCallback((): boolean => {
    const newErrors: CheckoutErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle coupon apply
  const applyCoupon = useCallback((code: string) => {
    if (code.trim().toUpperCase() === MOCK_COUPON_CODE) {
      setCouponApplied(true);
      return true;
    }
    return false;
  }, []);

  const getCurrencySymbol = useCallback((currency: string) => {
    const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    return symbols[currency?.toUpperCase()] || currency || '$';
  }, []);

  // Compute pricing totals (useMemo for optimal performance)
  const calculations = useMemo((): CheckoutCalculation | null => {
    if (!plan) return null;
    
    const seatsPrice = plan.original_price || plan.amount * 1.5;
    const savings = seatsPrice - plan.amount;
    const couponDiscount = couponApplied ? plan.amount * COUPON_DISCOUNT_PERCENT : 0;
    const total = plan.amount - couponDiscount;
    const tax = total - (total / (1 + TAX_RATE));
    const subtotal = total - tax;
    const currencySymbol = getCurrencySymbol(plan.currency);

    return {
      seatsPrice,
      savings,
      subtotal,
      couponDiscount,
      tax,
      total,
      currencySymbol,
    };
  }, [plan, couponApplied, getCurrencySymbol]);

  // Place Order handler (Centralized error/cancellation handling, prevent duplicate submissions)
  const placeOrder = useCallback(async () => {
    if (!plan || isProcessing || !calculations) return;
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Load Razorpay gateway script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Unable to connect to the payment gateway. Please check your internet connection.");
      }

      // 2. Start payment session on backend
      const startResponse = await startSubscriptionApi({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        compnay_name: formData.companyName, // Typo preserved for compatibility
        plan_id: Number(plan.id || plan.plan_type) || 1, // Securely purchase only selected plan
      });

      if (!startResponse || !startResponse.data) {
        throw new Error(startResponse?.message || 'Payment session creation failed.');
      }

      const {
        razorpay_order_id,
        total_amount,
        amount,
        payment_session_id,
        first_name: prefillFirstName,
        last_name: prefillLastName,
        email: prefillEmail,
        phone: prefillPhone
      } = startResponse.data;

      // Handle subscription vs order options
      const isSubscription = razorpay_order_id?.startsWith('sub_');
      const orderAmount = total_amount || amount || calculations.total;

      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
        amount: Math.round(orderAmount * 100), // in paise
        currency: startResponse.data.currency || plan.currency || 'INR',
        name: 'InstaLearn',
        description: `${plan.plan_name} Plan Subscription`,
        prefill: {
          name: `${prefillFirstName || formData.firstName} ${prefillLastName || formData.lastName}`,
          email: prefillEmail || formData.email,
          contact: prefillPhone || formData.phone,
        },
        theme: { color: '#A435F0' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.error("Payment cancelled by user.");
          },
        },
        handler: async (response: any) => {
          try {
            setIsProcessing(true);
            // Complete/verify payment API call
            const verificationResponse = await completeSubscriptionApi({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id || response.razorpay_subscription_id || razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              payment_session_id: payment_session_id || '',
            });

            if (verificationResponse && verificationResponse.status !== 'failed') {
              setShowSuccess(true);
            } else {
              throw new Error(verificationResponse?.message || 'Payment verification failed.');
            }
          } catch (error: any) {
            console.error('Verify Error:', error);
            toast.error(error.message || 'Payment verification failed.');
          } finally {
            setIsProcessing(false);
          }
        },
      };

      if (isSubscription) {
        options.subscription_id = razorpay_order_id;
      } else {
        options.order_id = razorpay_order_id;
      }

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', (resp: any) => {
        setIsProcessing(false);
        toast.error(resp.error.description || 'Payment transaction failed.');
      });

      rzp.open();
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.message || 'Payment process failed.');
      setIsProcessing(false);
    }
  }, [plan, isProcessing, formData, validateForm, calculations]);

  return {
    plan,
    loading,
    error,
    formData,
    errors,
    couponCode,
    couponApplied,
    isProcessing,
    showSuccess,
    calculations,
    updateFormField,
    setCouponCode,
    applyCoupon,
    placeOrder,
  };
};
