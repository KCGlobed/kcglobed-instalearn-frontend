import React, { lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import PromoStrip from '../../layouts/PromoStrip'
import TopHeader from '../../layouts/TopHeader'
import MainHeader from '../../layouts/MainHeader'
import Footer from '../../layouts/Footer'
import { LayoutDashboard, Users, BookOpen, CreditCard, Loader2 } from 'lucide-react'

// Code split (lazy loaded) sub-components
const DashboardOverview = lazy(() => import('../../components/CorporateManagement/DashboardOverview'))
const MemberList = lazy(() => import('../../components/CorporateManagement/MemberList'))
const CourseAnalytics = lazy(() => import('../../components/CorporateManagement/CourseAnalytics'))
const SubscriptionDetails = lazy(() => import('../../components/CorporateManagement/SubscriptionDetails'))

const TAB_CONFIG = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, component: DashboardOverview, desc: 'Metrics & activity logs' },
    { id: 'members', label: 'Team Members', icon: Users, component: MemberList, desc: 'Manage member seats & assign learning' },
    { id: 'courses', label: 'Assigned Courses', icon: BookOpen, component: CourseAnalytics, desc: 'Monitor progress & certificates' },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard, component: SubscriptionDetails, desc: 'Invoices & seats management' },
]

const DashboardLoader = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-gray-150 rounded-xl shadow-sm">
        <Loader2 className="w-8 h-8 text-perple animate-spin" />
        <span className="text-[11px] text-gray-400 font-medium">Loading panel details...</span>
    </div>
)

const CorporateManagement = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const currentTab = searchParams.get('tab') || 'overview'

    const activeTab = TAB_CONFIG.find(t => t.id === currentTab) || TAB_CONFIG[0]
    const ActiveComponent = activeTab.component

    return (
        <div className="flex flex-col min-h-screen bg-[#F8F7FA] font-sans">
            <PromoStrip />
            <TopHeader />
            <MainHeader />
            
            <main className="flex-grow max-w-[1200px] w-full mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Navigation Sidebar */}
                    <div className="w-full lg:w-64 shrink-0 bg-white border border-gray-150 rounded-xl p-4 shadow-sm">
                        <div className="mb-6 px-2">
                            <h1 className="text-sm font-bold text-[#2F2B3D]">Corporate Dashboard</h1>
                            <p className="text-[10px] text-gray-400 mt-0.5">Manage your organization's learning</p>
                        </div>
                        
                        <nav className="flex flex-col gap-1">
                            {TAB_CONFIG.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = currentTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setSearchParams({ tab: tab.id })}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-155 cursor-pointer focus:outline-none ${
                                            isActive
                                                ? 'bg-perple text-white font-bold shadow-md shadow-perple/25'
                                                : 'text-[#2F2B3D]/70 hover:bg-gray-50 hover:text-[#2F2B3D] font-semibold'
                                        }`}
                                    >
                                        <Icon className="w-4.5 h-4.5 shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-xs leading-none">{tab.label}</span>
                                            <span className={`text-[9px] leading-none mt-1 font-normal ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                                                {tab.desc}
                                            </span>
                                        </div>
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    {/* Right Panel Content */}
                    <div className="flex-1 w-full bg-transparent min-h-[400px]">
                        <Suspense fallback={<DashboardLoader />}>
                            <ActiveComponent />
                        </Suspense>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    )
}

export default CorporateManagement