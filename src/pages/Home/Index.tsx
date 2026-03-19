import EarnCertificate from "../../components/HomeComponent/EarnCertificate"
import TopCollege from "../../components/HomeComponent/TopCollege"
import MainHeader from "../../layouts/MainHeader"
import TopHeader from "../../layouts/TopHeader"

const HomePage = () => {
    return (
        <>
            <TopHeader />
            <MainHeader />
            <EarnCertificate />
            <TopCollege />
        </>
    )
}

export default HomePage