import BestCourses from "../../components/CategoryComponent/BestCourses"
import PopularToolsSlider from "../../components/CategoryComponent/ToolSlider"
import Footer from "../../layouts/Footer"
import MainHeader from "../../layouts/MainHeader"
import TopHeader from "../../layouts/TopHeader"


const CategoryPage = () => {
    return (
        <>
            <TopHeader />
            <MainHeader />
            <BestCourses />
            <PopularToolsSlider />
            <Footer />
        </>
    )
}

export default CategoryPage