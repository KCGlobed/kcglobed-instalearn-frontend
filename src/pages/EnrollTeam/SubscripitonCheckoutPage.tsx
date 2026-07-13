import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useSubscriptionCheckout } from '../../hooks/useSubscriptionCheckout';
import { CompanyInfoForm } from '../../components/EnrollTeamComponent/CompanyInfoForm';
import { OrderSummaryCard } from '../../components/EnrollTeamComponent/OrderSummaryCard';
import { SuccessModal } from '../../components/EnrollTeamComponent/SuccessModal';
import PromoStrip from '../../layouts/PromoStrip';
import TopHeader from '../../layouts/TopHeader';
import MainHeader from '../../layouts/MainHeader';
import Footer from '../../layouts/Footer';

const SubscripitonCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const selectedPlanId = sessionStorage.getItem('selected_plan_id');
  
  const {
    plan,
    loading,
    error,
    formData,
    errors,
    couponApplied,
    isProcessing,
    showSuccess,
    calculations,
    updateFormField,
    applyCoupon,
    placeOrder,
  } = useSubscriptionCheckout(selectedPlanId);

  if (!selectedPlanId) {
    return (
      <>
        <PromoStrip />
        <TopHeader />
        <MainHeader />
        <div className="py-24 bg-[#F8FAFC] flex flex-col justify-center items-center w-full min-h-[60vh] text-center px-4">
          <h2 className="text-xl font-bold text-slate-800 mb-4">No plan selected</h2>
          <p className="text-slate-500 mb-6">Please select a subscription plan first to proceed with the checkout.</p>
          <button onClick={() => navigate('/enroll-team')} className="px-6 py-2.5 bg-[#A435F0] hover:bg-[#8B1AD3] text-white rounded font-bold cursor-pointer transition-colors shadow-md">
            View Pricing Plans
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (loading || !plan || !calculations) {
    return (
      <>
        <PromoStrip />
        <TopHeader />
        <MainHeader />
        <div className="py-24 bg-[#F8FAFC] flex flex-col justify-center items-center w-full min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#A435F0] border-t-transparent mb-4" />
          <span className="text-slate-600 font-semibold text-sm">Loading checkout details...</span>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <PromoStrip />
        <TopHeader />
        <MainHeader />
        <div className="py-24 bg-[#F8FAFC] flex flex-col justify-center items-center w-full min-h-[60vh] text-center px-4">
          <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button onClick={() => navigate('/enroll-team')} className="px-6 py-2.5 bg-[#A435F0] hover:bg-[#8B1AD3] text-white rounded font-bold cursor-pointer transition-colors shadow-md">
            Back to Plans
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <PromoStrip />
      <TopHeader />
      <MainHeader />

      <div className="py-12 md:py-16 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 mb-6">
            <span className="hover:text-indigo-600 cursor-pointer transition-colors" onClick={() => navigate('/enroll-team')}>Subscription</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-indigo-600 font-medium">Checkout</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">Confirm your subscription</h1>
          <p className="text-slate-500 text-sm md:text-base mt-2 mb-10 leading-relaxed">
            Complete your upgrade to the {plan.plan_name} Plan for enterprise-scale learning.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column - Company Information */}
            <div className="lg:col-span-7 space-y-6">
              <CompanyInfoForm
                formData={formData}
                errors={errors}
                onChange={updateFormField}
              />

              {/* Secure Subtext */}
              <div className="flex items-center gap-2.5 text-slate-500 px-1">
                <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-500">
                  Your transaction is secured by AES-256 bank-level encryption.
                </span>
              </div>
            </div>

            {/* Right Column - Order Summary Sidebar */}
            <div className="lg:col-span-5">
              <OrderSummaryCard
                plan={plan}
                calculations={calculations}
                couponApplied={couponApplied}
                isProcessing={isProcessing}
                onApplyCoupon={applyCoupon}
                onPlaceOrder={placeOrder}
                onChangePlan={() => navigate('/enroll-team')}
              />
            </div>

          </div>

        </div>
      </div>

      <SuccessModal
        show={showSuccess}
        companyName={formData.companyName}
        billingEmail={formData.email}
        onNavigate={() => navigate('/corporate-management')}
      />

      <Footer />
    </>
  );
};

export default SubscripitonCheckoutPage;