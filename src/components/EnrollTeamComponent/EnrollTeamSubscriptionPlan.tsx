import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, BadgeCheck } from 'lucide-react';
import { getSubscriptionPlansApi } from '../../utils/service';

interface EnrollTeamSubscriptionPlanProps {
    onSelectPlan?: (planId: string) => void;
}

const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
    return symbols[currency?.toUpperCase()] || currency || '$';
};

const Skeleton = () => (
    <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-10 bg-slate-200 rounded w-1/2 mt-4" />
        <div className="h-4 bg-slate-200 rounded w-1/4 mt-6" />
        <div className="space-y-2 mt-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-slate-200 rounded w-full" />
            ))}
        </div>
        <div className="h-10 bg-slate-200 rounded w-full mt-6" />
    </div>
);

const EnrollTeamSubscriptionPlan: React.FC<EnrollTeamSubscriptionPlanProps> = ({ onSelectPlan }) => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlans = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getSubscriptionPlansApi();
            const list = (res?.data || []).sort((a: any, b: any) => (a.monthly_amount || 0) - (b.monthly_amount || 0));
            setPlans([...list, {
                plan_id: 'enterprise',
                plan_name: 'Enterprise',
                plan_description: 'Customized learning ecosystem for large corporations.',
                monthly_amount: 0,
                banner_text: '',
                feature: ['White-label LMS Portal', 'Custom API & SSO Integrations', 'Custom Content Creation', 'Account Success Manager']
            }]);
        } catch (err: any) {
            setError(err?.message || "Error fetching plans");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPlans(); }, []);

    console.log(plans, "plan")


    if (loading) return (
        <div className="py-16 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => <Skeleton key={i} />)}
            </div>
        </div>
    );

    if (error) return (
        <div className="py-16 text-center bg-[#F8FAFC]">
            <p className="text-red-500 mb-4">{error}</p>
            <button onClick={fetchPlans} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold cursor-pointer">Try Again</button>
        </div>
    );

    return (
        <div className="py-16 md:py-24 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 uppercase tracking-wider">Pricing Plans</span>
                    <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">Empower your team with world-class learning</h2>
                    <p className="mt-4 text-gray-500 text-sm md:text-base">Scale your corporate training with our flexible subscription tiers. Choose the plan that aligns with your organization's growth.</p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((p) => {
                        const isRec = p.banner_text?.toLowerCase() === 'recommended';
                        const isNew = p.banner_text?.toLowerCase() === 'new';
                        const isPaymentPlan = isRec || isNew;
                        const isEnt = !isPaymentPlan;
                        const sym = getCurrencySymbol(p.currency);

                        return (
                            <div key={p.plan_id} className={`relative flex flex-col justify-between p-8 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1.5 ${isRec ? 'border-2 border-indigo-600 shadow-lg shadow-indigo-100/55' : 'border border-slate-200 shadow-sm hover:border-slate-350 hover:shadow-md'
                                }`}>
                                {p.banner_text && (
                                    <span className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold uppercase shadow-sm ${isRec ? 'bg-indigo-600 text-white' : isNew ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-white'
                                        }`}>
                                        {p.banner_text}
                                    </span>
                                )}

                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{p.plan_name}</h3>
                                    <p className="text-gray-500 text-sm mt-2 min-h-[40px]">{p.plan_description}</p>

                                    <div className="mt-6 flex items-baseline">
                                        <span className="text-4xl font-extrabold text-slate-900">{isEnt ? 'Custom' : `${sym}${Math.round(p.amount)}`}</span>
                                        {!isEnt && <span className="text-sm font-semibold text-gray-400 ml-1">/{p.plan_type == 1 ? "Monthly" : "Yearly"}</span>}
                                    </div>
                                    <span className="text-sm font-medium text-indigo-600 mt-2 block">
                                        {isEnt ? 'Unlimited seats available' : `${p.no_of_licence} seats included`}
                                    </span>

                                    <div className="h-[1px] bg-slate-100 my-6" />

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            {isRec ? 'EVERYTHING IN STARTER, PLUS' : isEnt ? 'ENTERPRISE EXCLUSIVE' : 'FEATURES'}
                                        </h4>
                                        <div className="space-y-3">
                                            {(p.feature || []).map((feat: string, idx: number) => (
                                                <div key={idx} className="flex items-start gap-2.5 text-left text-sm text-slate-600">
                                                    {isEnt ? (
                                                        <BadgeCheck className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                                                    ) : isRec ? (
                                                        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-600 text-white flex-shrink-0 mt-0.5">
                                                            <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                                                        </span>
                                                    ) : (
                                                        <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                                                    )}
                                                    <span>{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (isPaymentPlan) {
                                            onSelectPlan?.(p.plan_id);
                                        } else {
                                            const message = encodeURIComponent(`Hi, I'm interested in the ${p.plan_name} plan for our team training.`);
                                            window.open(`https://wa.me/919915039343?text=${message}`, '_blank');
                                        }
                                    }}
                                    className={`w-full mt-8 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${isRec
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100'
                                        : isEnt
                                            ? 'border border-slate-800 text-slate-800 bg-white hover:bg-slate-50'
                                            : 'border border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50'
                                        }`}
                                >
                                    {isEnt ? 'Contact Sales' : isRec ? 'Choose Business' : 'Get Started'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default EnrollTeamSubscriptionPlan;