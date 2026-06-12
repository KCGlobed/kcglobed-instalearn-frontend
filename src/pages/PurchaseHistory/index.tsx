import { useState, useEffect } from 'react';
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    IndianRupee,
    Loader2,
    ReceiptText,
    XCircle,
} from 'lucide-react';
import Footer from '../../layouts/Footer';
import MainHeader from '../../layouts/MainHeader';
import TopHeader from '../../layouts/TopHeader';
import { getPurchaseHistory } from '../../utils/service';

type OrderedCourse = {
    id: number;
    name: string;
};

type PurchaseHistoryItem = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    total_amount: number;
    gst_amount: number;
    amount: number;
    razorpay_order_id: string;
    payment_method: number;
    subscription_status: number;
    created_at: string;
    ordered_courses: OrderedCourse[];
    order_date: string;
    isPaid: boolean;
};

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

const formatCurrency = (amount: number) => currencyFormatter.format(amount);

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString.replace(' ', 'T')).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (e) {
        return dateString;
    }
};

const getPaymentMethod = (method: number) => {
    if (method === 1) return 'Razorpay';
    return 'Online payment';
};

const getSubscriptionStatus = (status: number) => {
    if (status === 2) return 'Active';
    if (status === 1) return 'Pending';
    return 'Processing';
};

const StatTile = ({
    icon,
    label,
    value,
    helper,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    helper: string;
}) => (
    <div className="rounded-lg border border-[#E9EAF0] bg-white p-4">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-[13px] font-semibold text-[#6E7485]">{label}</p>
                <p className="mt-1 text-[24px] font-bold leading-tight text-[#1D2026]">{value}</p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F5F4FF] text-[#5624D0]">
                {icon}
            </div>
        </div>
        <p className="mt-3 text-[13px] font-medium text-[#8C94A3]">{helper}</p>
    </div>
);

const StatusBadge = ({ paid }: { paid: boolean }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-bold ${
            paid ? 'bg-[#EAF7EF] text-[#118A3C]' : 'bg-[#FFF1F1] text-[#C02B2B]'
        }`}
    >
        {paid ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
        {paid ? 'Paid' : 'Unpaid'}
    </span>
);

const PurchaseHistory = () => {
    const [purchaseHistory, setPurchaseHistory] = useState<PurchaseHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getUserName = () => {
        try {
            const profileStr = localStorage.getItem("userProfile");
            if (profileStr) {
                const profile = JSON.parse(profileStr);
                const user = profile.user || profile;
                if (user.first_name || user.last_name) {
                    return `${user.first_name || ""} ${user.last_name || ""}`.trim();
                }
                if (user.name) return user.name;
            }
        } catch (e) {
            console.error(e);
        }
        return "User";
    };

    const handleFetchPurchaseHistory = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getPurchaseHistory();
            const list = res?.data || res?.results || (Array.isArray(res) ? res : []);
            setPurchaseHistory(list);
        } catch (err: any) {
            console.error(err);
            setError(err?.message || "Failed to fetch purchase history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchPurchaseHistory();
    }, []);

    const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

    const toggleOrderExpansion = (orderId: number) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const totalOrders = purchaseHistory.length;
    const paidOrders = purchaseHistory.filter((order) => order.isPaid || order.subscription_status === 2).length;
    const totalSpent = purchaseHistory
        .filter((order) => order.isPaid || order.subscription_status === 2)
        .reduce((total, order) => total + Number(order.total_amount || 0), 0);
    const pendingAmount = purchaseHistory
        .filter((order) => !order.isPaid && order.subscription_status !== 2)
        .reduce((total, order) => total + Number(order.total_amount || 0), 0);

    const latestOrderDate = purchaseHistory.length > 0 
        ? formatDate(purchaseHistory[0].order_date || purchaseHistory[0].created_at) 
        : 'N/A';

    return (
        <div className="min-h-screen bg-white font-inter">
            <TopHeader />
            <MainHeader />

            <main className="mx-auto max-w-[1340px] px-4 py-8 sm:px-6 lg:py-12">
                <div className="mb-8 flex flex-col gap-4 border-b border-[#E9EAF0] pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h1 className="text-[32px] font-bold tracking-tight text-[#1D2026] sm:text-[40px]">
                            Purchase History
                        </h1>
                        <p className="mt-2 max-w-2xl text-[15px] font-medium leading-6 text-[#6E7485]">
                            Track your course payments, payment status, and order details in one place.
                        </p>
                    </div>

                    <div className="flex w-full items-center justify-between rounded-lg border border-[#E9EAF0] bg-[#F8F9FB] px-4 py-3 sm:w-auto sm:min-w-[260px]">
                        <div>
                            <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#8C94A3]">
                                Account
                            </p>
                            <p className="mt-1 text-[14px] font-bold text-[#1D2026]">{getUserName()}</p>
                        </div>
                        <ReceiptText className="h-5 w-5 text-[#5624D0]" />
                    </div>
                </div>

                <section className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <StatTile
                        icon={<IndianRupee className="h-5 w-5" />}
                        label="Paid amount"
                        value={formatCurrency(totalSpent)}
                        helper={`${paidOrders} successful payments`}
                    />
                    <StatTile
                        icon={<ReceiptText className="h-5 w-5" />}
                        label="Total orders"
                        value={String(totalOrders)}
                        helper="Across all purchases"
                    />
                    <StatTile
                        icon={<Clock3 className="h-5 w-5" />}
                        label="Pending amount"
                        value={formatCurrency(pendingAmount)}
                        helper="Awaiting payment confirmation"
                    />
                </section>

                <section className="overflow-hidden rounded-lg border border-[#E9EAF0] bg-white">
                    <div className="flex flex-col gap-2 border-b border-[#E9EAF0] bg-[#FCFCFD] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-[18px] font-bold text-[#1D2026]">Orders</h2>
                            <p className="mt-1 text-[13px] font-medium text-[#6E7485]">
                                {totalOrders} records found
                            </p>
                        </div>
                        <div className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#6E7485]">
                            <CalendarDays className="h-4 w-4 text-[#8C94A3]" />
                            Latest order: {latestOrderDate}
                        </div>
                    </div>

                    {loading ? (
                        /* Premium Loader state */
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <Loader2 className="h-10 w-10 animate-spin text-[#5624D0]" />
                            <p className="mt-4 text-sm font-semibold text-[#6E7485]">Fetching your purchase history...</p>
                        </div>
                    ) : error ? (
                        /* Error state */
                        <div className="py-24 text-center px-6">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                                <XCircle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1d2026]">Failed to load purchase history</h3>
                            <p className="text-[#6e7485] mt-1 max-w-md mx-auto">{error}</p>
                            <button
                                onClick={handleFetchPurchaseHistory}
                                className="mt-6 px-4 py-2 bg-[#5624D0] text-white font-bold rounded-lg hover:bg-[#461da5] transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : purchaseHistory.length === 0 ? (
                        /* Empty state */
                        <div className="py-24 text-center px-6">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f4ff] text-[#5624D0] mb-4">
                                <ReceiptText className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1d2026]">No purchase history found</h3>
                            <p className="text-[#6e7485] mt-1 max-w-sm mx-auto">
                                You haven't made any purchases yet. Your enrolled course records will show up here.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop View */}
                            <div className="hidden overflow-x-auto lg:block">
                                <table className="w-full min-w-[1040px] border-collapse text-left">
                                    <thead>
                                        <tr className="border-b border-[#E9EAF0] bg-white text-[12px] font-bold uppercase tracking-[0.06em] text-[#8C94A3]">
                                            <th className="px-5 py-3.5">Order Info</th>
                                            <th className="px-5 py-3.5">Customer details</th>
                                            <th className="px-5 py-3.5">Courses</th>
                                            <th className="px-5 py-3.5">Payment Details</th>
                                            <th className="px-5 py-3.5 text-right">Billing Details</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F3F4F6]">
                                        {purchaseHistory.map((order) => {
                                            const isPaid = order.isPaid || order.subscription_status === 2;
                                            const isExpanded = expandedOrders[order.id];
                                            const coursesToShow = isExpanded
                                                ? order.ordered_courses
                                                : order.ordered_courses?.slice(0, 2);

                                            return (
                                                <tr key={order.id} className="align-top transition-colors hover:bg-[#FCFCFD]">
                                                    {/* Order Info */}
                                                    <td className="px-5 py-5">
                                                        <div className="font-bold text-[#1D2026]">#{order.id}</div>
                                                        <div className="mt-1 max-w-[190px] truncate text-[12px] text-gray-500 font-mono">
                                                            {order.razorpay_order_id || 'N/A'}
                                                        </div>
                                                        <div className="mt-3">
                                                            <StatusBadge paid={isPaid} />
                                                        </div>
                                                    </td>
                                                    
                                                    {/* Customer Details */}
                                                    <td className="px-5 py-5">
                                                        <div className="font-semibold text-[#1D2026] text-[14px]">
                                                            {order.first_name} {order.last_name}
                                                        </div>
                                                        <div className="mt-1 text-[13px] text-[#6E7485]">{order.email}</div>
                                                        <div className="mt-1 text-[12px] text-[#8C94A3]">{order.phone}</div>
                                                    </td>

                                                    {/* Courses */}
                                                    <td className="px-5 py-5">
                                                        <div className="max-w-[360px] space-y-2">
                                                            {coursesToShow?.map((course) => (
                                                                <p key={course.id} className="text-[14px] font-semibold leading-5 text-[#1D2026] flex items-start gap-1.5">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#5624D0] mt-2 shrink-0" />
                                                                    {course.name}
                                                                </p>
                                                            ))}
                                                            {order.ordered_courses?.length > 2 && (
                                                                <button
                                                                    onClick={() => toggleOrderExpansion(order.id)}
                                                                    className="mt-2 text-[12px] font-bold text-[#5624D0] hover:text-[#461da5] underline flex items-center"
                                                                >
                                                                    {isExpanded ? "Show Less" : `+${order.ordered_courses.length - 2} more`}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Payment Details */}
                                                    <td className="px-5 py-5">
                                                        <div className="flex items-center gap-2 text-[14px] font-bold text-[#1D2026]">
                                                            <CreditCard className="h-4 w-4 text-[#5624D0]" />
                                                            {getPaymentMethod(order.payment_method)}
                                                        </div>
                                                        <p className="mt-1 text-[13px] font-medium text-[#6E7485]">
                                                            {getSubscriptionStatus(order.subscription_status)}
                                                        </p>
                                                        <p className="mt-2 text-[12px] text-[#8C94A3]">
                                                            {formatDate(order.order_date || order.created_at)}
                                                        </p>
                                                    </td>

                                                    {/* Billing Details */}
                                                    <td className="px-5 py-5 text-right text-[13px]">
                                                        <div className="text-gray-500">
                                                            Base: {formatCurrency(order.amount || (order.total_amount - order.gst_amount))}
                                                        </div>
                                                        <div className="mt-0.5 text-gray-400">
                                                            GST: {formatCurrency(order.gst_amount)}
                                                        </div>
                                                        <div className="mt-2 text-[16px] font-bold text-[#1D2026]">
                                                            {formatCurrency(order.total_amount)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile View */}
                            <div className="divide-y divide-[#E9EAF0] lg:hidden">
                                {purchaseHistory.map((order) => {
                                    const isPaid = order.isPaid || order.subscription_status === 2;
                                    const isExpanded = expandedOrders[order.id];
                                    const coursesToShow = isExpanded
                                        ? order.ordered_courses
                                        : order.ordered_courses?.slice(0, 2);

                                    return (
                                        <article key={order.id} className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <p className="text-[15px] font-bold text-[#1D2026]">Order #{order.id}</p>
                                                    <p className="mt-1 truncate text-[13px] font-medium text-[#6E7485]">
                                                        {order.razorpay_order_id}
                                                    </p>
                                                </div>
                                                <StatusBadge paid={isPaid} />
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-3 rounded-lg bg-[#F8F9FB] p-3">
                                                <div>
                                                    <p className="text-[12px] font-bold text-[#8C94A3]">Amount</p>
                                                    <p className="mt-1 text-[15px] font-bold text-[#1D2026]">
                                                        {formatCurrency(order.total_amount)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-bold text-[#8C94A3]">Date</p>
                                                    <p className="mt-1 text-[13px] font-semibold text-[#1D2026]">
                                                        {formatDate(order.order_date || order.created_at)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-bold text-[#8C94A3]">Payment</p>
                                                    <p className="mt-1 text-[13px] font-semibold text-[#1D2026]">
                                                        {getPaymentMethod(order.payment_method)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[12px] font-bold text-[#8C94A3]">Status</p>
                                                    <p className="mt-1 text-[13px] font-semibold text-[#1D2026]">
                                                        {getSubscriptionStatus(order.subscription_status)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.06em] text-[#8C94A3]">
                                                    Courses
                                                </p>
                                                <div className="space-y-2">
                                                    {coursesToShow?.map((course) => (
                                                        <p key={course.id} className="rounded-lg border border-[#E9EAF0] px-3 py-2 text-[13px] font-semibold leading-5 text-[#1D2026]">
                                                            {course.name}
                                                        </p>
                                                    ))}
                                                    {order.ordered_courses?.length > 2 && (
                                                        <button
                                                            onClick={() => toggleOrderExpansion(order.id)}
                                                            className="text-[13px] font-bold text-[#5624D0] hover:underline block pt-1"
                                                        >
                                                            {isExpanded ? "Show Less" : `+${order.ordered_courses.length - 2} more`}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default PurchaseHistory;
