import React, { useState } from 'react'
import { CreditCard, ShoppingBag, ShieldCheck, Download, Users } from 'lucide-react'
import toast from 'react-hot-toast'

interface Invoice {
    id: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Failed' | 'Refunded';
}

const SubscriptionDetails = () => {
    // Subscription details mock
    const currentPlan = {
        name: 'Corporate Business Plan (Annual)',
        cost: '₹1,15,188 / year',
        seatsTotal: 50,
        seatsUsed: 18,
        renewalDate: 'July 28, 2027',
        paymentMethod: 'Visa ending in 4242'
    };

    // Invoices list
    const invoices: Invoice[] = [
        { id: 'INV-2026-0034', date: 'Jul 9, 2026', amount: '₹1,15,188', status: 'Paid' },
        { id: 'INV-2025-0981', date: 'Jul 28, 2025', amount: '₹1,15,188', status: 'Paid' },
        { id: 'INV-2024-0412', date: 'Jul 28, 2024', amount: '₹1,15,188', status: 'Paid' },
    ];

    // License calculator state
    const [extraSeats, setExtraSeats] = useState(5);
    const seatPrice = 2300; // price per seat in INR
    const totalExtraCost = extraSeats * seatPrice;

    const handleBuySeatsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success(`Successfully added ${extraSeats} seats to your team plan!`);
        // Simulate updates
    };

    const handleDownloadInvoice = (invId: string) => {
        toast.success(`Downloading invoice ${invId}...`);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Page Header */}
            <div>
                <h2 className="text-base font-bold text-[#2F2B3D]">Subscription & Billing</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Manage corporate licenses, billing invoices, and payment details.</p>
            </div>

            {/* Plan Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Active Plan Detail */}
                <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm flex flex-col justify-between">
                    <div>
                        <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded uppercase tracking-wider mb-3">
                            Active Subscription
                        </span>
                        <h3 className="text-xs font-bold text-[#2F2B3D]">{currentPlan.name}</h3>
                        <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                            Full catalog access for all registered employees.
                        </p>
                    </div>

                    <div className="mt-6 border-t border-gray-100 pt-4 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Billed Amount:</span>
                            <span className="font-bold text-[#2F2B3D]">{currentPlan.cost}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Renewal Date:</span>
                            <span className="font-bold text-[#2F2B3D]">{currentPlan.renewalDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-medium">Payment Method:</span>
                            <span className="font-bold text-[#2F2B3D] flex items-center gap-1.5">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                {currentPlan.paymentMethod}
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
                            <span className="text-gray-500 font-semibold">{currentPlan.seatsUsed} Seats Used</span>
                            <span className="text-gray-400 font-medium">Out of {currentPlan.seatsTotal} Total</span>
                        </div>
                        
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-perple rounded-full"
                                style={{ width: `${(currentPlan.seatsUsed / currentPlan.seatsTotal) * 100}%` }}
                            />
                        </div>

                        <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit mt-1">
                            {currentPlan.seatsTotal - currentPlan.seatsUsed} vacant seats available
                        </span>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-6">
                        <p className="text-[10px] text-gray-400 leading-normal">
                            Need more space? You can buy additional seats below at a pro-rated volume discount.
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Seats Interactive Card */}
            <div className="bg-white p-5 rounded-xl border border-gray-150 shadow-sm">
                <h3 className="text-xs font-bold text-[#2F2B3D]">Purchase Additional Seats</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Scale your plan immediately without resetting your billing calendar.</p>

                <form onSubmit={handleBuySeatsSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    {/* Quantity Picker */}
                    <div className="flex flex-col gap-1.5 col-span-1">
                        <label className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">Number of Seats</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={1}
                                max={100}
                                value={extraSeats}
                                onChange={(e) => setExtraSeats(parseInt(e.target.value) || 0)}
                                className="h-9 w-24 px-3 border border-gray-250 rounded-md text-xs text-center focus:outline-none focus:border-perple"
                            />
                            <span className="text-xs text-gray-500 font-medium">seats</span>
                        </div>
                    </div>

                    {/* Calculated Price */}
                    <div className="flex flex-col col-span-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Calculated Cost</span>
                        <span className="text-lg font-extrabold text-[#2F2B3D] mt-1 flex items-baseline gap-1">
                            ₹{totalExtraCost.toLocaleString('en-IN')}
                            <span className="text-[10px] text-gray-400 font-medium ml-1">pro-rated</span>
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={extraSeats <= 0}
                        className="h-9 px-6 bg-perple hover:bg-[#5e50eb] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold rounded-md flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow transition-all w-full md:w-auto md:justify-self-end mt-2 md:mt-0"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Purchase Seats
                    </button>
                </form>
            </div>

            {/* Invoices Table Card */}
            <div className="bg-white rounded-xl border border-gray-150 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-[#2F2B3D]">Billing History</h3>
                    <p className="text-[10px] text-gray-400 mt-0.5">Download invoices and check payments statuses.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F7FA] border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                <th className="py-3 px-6">Invoice ID</th>
                                <th className="py-3 px-4">Billing Date</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-6 text-right">Download</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3 px-6 font-semibold text-[#2F2B3D]">{inv.id}</td>
                                    <td className="py-3 px-4 text-gray-500">{inv.date}</td>
                                    <td className="py-3 px-4 font-medium text-[#2F2B3D]">{inv.amount}</td>
                                    <td className="py-3 px-4">
                                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600">
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-right">
                                        <button
                                            onClick={() => handleDownloadInvoice(inv.id)}
                                            className="p-1.5 text-gray-400 hover:text-perple hover:bg-perple/5 rounded transition-colors cursor-pointer inline-flex"
                                            title="Download Invoice"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionDetails
