import EarnCertificate from "../../components/HomeComponent/EarnCertificate"
import HeroStatsSection from "../../components/HomeComponent/HeroStatsSection"
import TopCollege from "../../components/HomeComponent/TopCollege"
import MainHeader from "../../layouts/MainHeader"
import TopHeader from "../../layouts/TopHeader"
import Footer from "../../layouts/Footer"
import AllInOneFinance from "../../components/HomeComponent/AllInOneFinance"
import RecentlyAddedCourses from "../../components/HomeComponent/RecentlyAddedCourses"
import HomeBanner from "../../components/HomeComponent/HomeBanner"

const HomePage = () => {
    return (
        <>
            <TopHeader />
            <MainHeader />
            <HomeBanner />
            <AllInOneFinance />
            <RecentlyAddedCourses />
            <TopCollege />
            <EarnCertificate />
            <HeroStatsSection />
            <Footer />
        </>
    )
}

export default HomePage