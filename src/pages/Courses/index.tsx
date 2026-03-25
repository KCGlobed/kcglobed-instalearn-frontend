import CourseListFilter from "../../components/CourseComponent/CourseListFilter"
import Footer from "../../layouts/Footer"
import MainHeader from "../../layouts/MainHeader"
import TopHeader from "../../layouts/TopHeader"

const Courses = () => {


    return (
        <div>
            <TopHeader />
            <MainHeader />
            <CourseListFilter />
            <Footer />
        </div>
    )
}

export default Courses