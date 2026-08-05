import CourseListFilter from "../../components/CourseComponent/CourseListFilter"
import Footer from "../../layouts/Footer"
import MainHeader from "../../layouts/MainHeader"
import PromoStrip from "../../layouts/PromoStrip"
import TopHeader from "../../layouts/TopHeader"

const Courses = () => {

    return (
        <div>
            <PromoStrip />
            <TopHeader />
            <MainHeader />
            <CourseListFilter />
            <Footer />
        </div>
    )
}

export default Courses