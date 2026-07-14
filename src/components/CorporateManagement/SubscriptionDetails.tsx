import React, { useEffect, useState } from 'react'
import { CreditCard, ShoppingBag } from 'lucide-react'
import { getMyActiveSubscriptionApi } from '../../utils/service';
import { useModal } from '../Modals/ModalContext';
import CancelSubscription from '../Modals/CancelSubscription';

const SubscriptionDetails = () => {
    const [myActivesubscriptionDetails, setMyActiveSubscriptionDetails] = useState<any>({});
    const { showModal } = useModal();
    const handleGetMyActiveSubscriptionApi = async () => {
        try {
            const response = await getMyActiveSubscriptionApi();
            setMyActiveSubscriptionDetails(response.data);
        }
        catch (error: any) {
            console.log("error", error)
        }

    }

    useEffect(() => {
        handleGetMyActiveSubscriptionApi();
    }, [])



    const handleCancelSubscription = () => {
        showModal({
            content: (
                <CancelSubscription 
                    myActivesubscriptionDetails={myActivesubscriptionDetails} 
                    onSuccess={handleGetMyActiveSubscriptionApi} 
                />
            ),
            size: "md"
        });
    }





    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Page Header */}
            <div>
                <h2 className="text-base font-bold text-[#2F2B3D]">Subscription & Billing</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Manage corporate licenses, billing invoices, and payment details.</p>


            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subscriber Profile</h3>
                <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#2F2B3D]">
                        {myActivesubscriptionDetails?.first_name || ''} {myActivesubscriptionDetails?.last_name || ''}
                    </h4>
                    {myActivesubscriptionDetails?.email && (
                        <p className="text-[11px] text-gray-500">
                            Email: {myActivesubscriptionDetails.email} | Phone: {myActivesubscriptionDetails.phone}
                        </p>
                    )}
                </div>
            </div>

            {/* Plan Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Plan Detail */}
                <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-3">
                            <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded uppercase tracking-wider">
                                Active Subscription
                            </span>
                            <button
                                onClick={handleCancelSubscription}
                                className="px-2.5 py-1 text-[10px] font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-200 cursor-pointer transition-colors duration-200"
                            >
                                Cancel Subscription
                            </button>
                        </div>
                        <h3 className="text-xs font-bold text-[#2F2B3D]">
                            {myActivesubscriptionDetails?.plan_info?.plan_name || 'Starter'} Plan
                        </h3>
                        <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                            Full catalog access for all registered employees.
                        </p>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Billed Amount:</span>
                            <span className="font-bold text-[#2F2B3D]">
                                ₹{myActivesubscriptionDetails?.total_amount || '0'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Start Date:</span>
                            <span className="font-bold text-[#2F2B3D]">
                                {myActivesubscriptionDetails?.start_date || ''}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Renewal Date:</span>
                            <span className="font-bold text-[#2F2B3D]">
                                {myActivesubscriptionDetails?.next_due || ''}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Payment Method:</span>
                            <span className="font-bold text-[#2F2B3D] flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                Razorpay ({myActivesubscriptionDetails?.razorpay_order_id || ''})
                            </span>
                        </div>
                    </div>
                </div>

                {/* Seat License Usage */}
                <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-[#2F2B3D]">License Allocation</h3>
                        <p className="text-[10px] text-gray-400 mt-0.5">Track how many employee seats are used.</p>
                    </div>

                    <div className="mt-6 flex flex-col gap-2">
                        <div className="flex justify-between items-end text-xs">
                            <span className="text-gray-500 font-semibold">5 Seats Used</span>
                            <span className="text-gray-400 font-medium">
                                Out of {myActivesubscriptionDetails?.no_of_licence || 10} Total
                            </span>
                        </div>

                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-perple rounded-full"
                                style={{ width: `${(5 / (myActivesubscriptionDetails?.no_of_licence || 10)) * 100}%` }}
                            />
                        </div>

                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit mt-1">
                            {Math.max(0, (myActivesubscriptionDetails?.no_of_licence || 10) - 5)} vacant seats available
                        </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-6">
                        <p className="text-[10px] text-gray-400 leading-normal">
                            Need more space? You can buy additional seats below at a pro-rated volume discount.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionDetails
