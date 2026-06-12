import EarnCertificate from "../../components/HomeComponent/EarnCertificate"
import HeroStatsSection from "../../components/HomeComponent/HeroStatsSection"
import TopCollege from "../../components/HomeComponent/TopCollege"
import MainHeader from "../../layouts/MainHeader"
import TopHeader from "../../layouts/TopHeader"
import Footer from "../../layouts/Footer"
import AllInOneFinance from "../../components/HomeComponent/AllInOneFinance"
import RecentlyAddedCourses from "../../components/HomeComponent/RecentlyAddedCourses"
import HomeBanner from "../../components/HomeComponent/HomeBanner"
import LearningFocus from "../../components/HomeComponent/LearningFocus"
import GoogleOneTap from "../../components/Auth/GoogleOneTap"


const HomePage = () => {
    return (
        <>
            {/* Google One Tap — auto-prompts unauthenticated users */}
            <GoogleOneTap />
            <TopHeader />
            <MainHeader />
            <HomeBanner />
            <AllInOneFinance />
            <RecentlyAddedCourses />
            <TopCollege />
            <EarnCertificate />
            <LearningFocus />
            <HeroStatsSection />
            <Footer />
        </>
    )
}

export default HomePage