import CareerAcademySection from "../../components/InstitutionComponent/CareerAcademy"
import InstituteBanner from "../../components/InstitutionComponent/InstituteBanner"
import ProffesionalCertificate from "../../components/InstitutionComponent/ProffesionalCertificate"
import Footer from "../../layouts/Footer"
import MainHeader from "../../layouts/MainHeader"
import PromoStrip from "../../layouts/PromoStrip"
import TopHeader from "../../layouts/TopHeader"

const Institution = () => {
    return (
        <div>
            <PromoStrip />
            <TopHeader />
            <MainHeader />
            <InstituteBanner />
            <CareerAcademySection />
            <ProffesionalCertificate />
            <Footer />
        </div>
    )
}

export default Institution