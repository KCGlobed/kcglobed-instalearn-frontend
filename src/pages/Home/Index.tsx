import EarnCertificate from "../../components/HomeComponent/EarnCertificate"
import HeroStatsSection from "../../components/HomeComponent/HeroStatsSection"
import TopCollege from "../../components/HomeComponent/TopCollege"
import MainHeader from "../../layouts/MainHeader"
import TopHeader from "../../layouts/TopHeader"
import Footer from "../../layouts/Footer"
import AllInOneFinance from "../../components/HomeComponent/AllInOneFinance"
import RecentlyAddedCourses from "../../components/HomeComponent/RecentlyAddedCourses"

const HomePage = () => {
    return (
        <>
            <TopHeader />
            <MainHeader />
            <EarnCertificate />
            <AllInOneFinance />
            <RecentlyAddedCourses />
            <TopCollege />
            <HeroStatsSection />
            <Footer />
        </>
    )
}

export default HomePage