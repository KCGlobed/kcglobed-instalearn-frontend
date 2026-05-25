import { useEffect } from "react";
import { Cpu, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useRedux";
import { fetchHomepageCategories } from "../../store/slices/homepageCategorySlice";
import SkeltonLoader from "../Loader/SkeltonLoader";

const TopCollege = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { categories, loading, error } = useAppSelector(
        (state: any) => state.homepageCategory
    );

    useEffect(() => {
        dispatch(fetchHomepageCategories());
    }, [dispatch]);



    return (
        <section className="w-full bg-[#B8B8B840] py-20 px-6">
            <div className="max-w-[1320px] mx-auto">
                <h2 className="font-bold text-[#1D2026] mb-10 lg:text-center md:text-left">
                    Browse Top Category
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                         <SkeltonLoader loaderType="topCategory" />
                        
                    ) : error ? (
                        <div className="col-span-full text-center py-10 text-red-500 font-medium bg-red-50/50 rounded p-4 border border-red-100">
                            {error}
                        </div>
                    ) : categories && categories.length > 0 ? (
                        categories.map((cat: any) => (
                            <div
                                key={cat.id}
                                className="p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all duration-300 group min-h-[100px]"
                                style={{
                                    backgroundColor: cat.bg_code,
                                }}
                                onClick={() =>
                                    navigate(`/categories/${cat.id}`)
                                }
                            >
                                <div
                                    className="w-[60px] h-[60px] min-w-[60px] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-white"
                                >
                                    {cat.icon ? (
                                        <img
                                            src={cat.icon}
                                            alt={cat.name}
                                            className="w-8 h-8 object-contain"
                                        />
                                    ) : (
                                        <Cpu className="w-8 h-8 text-[#5624D0]" />
                                    )}
                                </div>

                                <div className="flex flex-col min-w-0 pr-2">
                                    <h3
                                        className="font-semibold truncate leading-tight mb-1 capitalize"
                                        style={{
                                            color: cat.text_code,
                                        }}
                                    >
                                        {cat.name}
                                    </h3>

                                    <p className="text-[#8C94A3] font-medium leading-none">
                                        {(cat.total_courses || 0).toLocaleString()}{" "}
                                        Courses
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-[#8C94A3] bg-white/50 rounded border border-gray-100">
                            No categories found.
                        </div>
                    )}
                </div>

                <div className="mt-14 flex flex-wrap items-center justify-center gap-2 text-[#4E5566] text-[16px]">
                    <p>We have more category and subcategory.</p>

                    <a
                        href="#"
                        className="text-[#5624D0] font-semibold flex items-center gap-1.5 hover:underline transition-all group"
                    >
                        Browse All

                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default TopCollege;