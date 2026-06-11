import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tag, Clock, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import Footer from "../../layouts/Footer";
import MainHeader from "../../layouts/MainHeader";
import TopHeader from "../../layouts/TopHeader";
import {
    getBlogCategoryApi,
    getFeaturedBlogApi,
    getAllBlogApi,
    getBlogByCategoryApi,
} from "../../utils/service";

interface Category {
    id: number;
    name: string;
    slug?: string;
}

interface Blog {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    img_alt_tag?: string;
    short_description?: string;
    description?: string;
    content?: string;
    created_at?: string;
    author_name?: string;
    category?: number | string | Category;
    category_name?: string;
    // Featured blog specific fields
    tags?: string[];
    reading_time?: string;
}

const Blogs = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
    
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);

    useEffect(() => {
        // Fetch Categories
        getBlogCategoryApi()
            .then((res) => {
                const data = res?.data?.data || res?.data || res;
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            })
            .catch((err) => console.error("Error fetching blog categories:", err))
            .finally(() => setLoadingCategories(false));

        // Fetch Featured Blogs
        getFeaturedBlogApi()
            .then((res) => {
                const data = res?.data?.data || res?.data || res;
                if (Array.isArray(data)) {
                    setFeaturedBlogs(data);
                }
            })
            .catch((err) => console.error("Error fetching featured blogs:", err))
            .finally(() => setLoadingFeatured(false));
    }, []);

    // Fetch Blogs based on selected category
    useEffect(() => {
        setLoadingBlogs(true);
        const fetchPromise = selectedCategory === 'all'
            ? getAllBlogApi()
            : getBlogByCategoryApi(selectedCategory);

        fetchPromise
            .then((res) => {
                const data = res?.data?.data || res?.data || res;
                if (Array.isArray(data)) {
                    setBlogs(data);
                } else {
                    setBlogs([]);
                }
            })
            .catch((err) => {
                console.error("Error fetching blogs:", err);
                setBlogs([]);
            })
            .finally(() => setLoadingBlogs(false));
    }, [selectedCategory]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const stripHtml = (html?: string) => {
        if (!html) return "";
        return html.replace(/<[^>]*>?/gm, '');
    };

    const getExcerpt = (blog: Blog) => {
        const text = blog.short_description || blog.description || stripHtml(blog.content) || "";
        return text.length > 150 ? text.substring(0, 150) + "..." : text;
    };

    const featured = featuredBlogs[0];

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-inter flex flex-col text-[#1D2026] selection:bg-[#EBEBFF] selection:text-[#5624D0]">
            <TopHeader />
            <MainHeader />

            {/* Breadcrumb / Hero Section */}
            <div className="bg-white border-b border-[#E9EAF0] py-10 px-4 xl:px-0">
                <div className="max-w-[1320px] mx-auto">
                    <nav className="flex items-center gap-2 text-[13px] text-[#8C94A3] mb-4 uppercase font-semibold tracking-wider">
                        <Link to="/" className="hover:text-[#5624D0] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#4E5566]">Blog</span>
                    </nav>
                    <h1 className="text-[32px] md:text-[40px] font-bold text-[#1D2026] tracking-tight leading-[48px]">
                        Our Stories & Learning Insights
                    </h1>
                    <p className="text-[#6E7485] mt-2 max-w-2xl text-[15px] leading-[24px]">
                        Get deep dives into tech trends, professional guides, and industry updates to help keep your skills sharp.
                    </p>
                </div>
            </div>

            <main className="max-w-[1320px] mx-auto px-4 xl:px-0 py-16 flex-grow w-full">
                {/* Featured Section */}
                {!loadingFeatured && featured && selectedCategory === 'all' && (
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-[20px] font-bold text-[#1D2026] uppercase tracking-wider flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-[#FF6636]"></span>
                                Featured Article
                            </h2>
                        </div>
                        <div 
                            onClick={() => navigate(`/blogs/${featured.slug}`)}
                            className="group cursor-pointer grid grid-cols-1 lg:grid-cols-12 bg-white border border-[#E9EAF0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 rounded-none overflow-hidden"
                        >
                            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto min-h-[320px] bg-gray-50 overflow-hidden">
                                {featured.image ? (
                                    <img 
                                        src={featured.image} 
                                        alt={featured.title} 
                                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <BookOpen size={48} className="stroke-[1.5]" />
                                    </div>
                                )}
                            </div>
                            <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between">
                                <div>
                                    {/* Tags row */}
                                    {featured.tags && featured.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {featured.tags.map((tag) => (
                                                <span key={tag} className="inline-flex items-center gap-1 bg-[#EBEBFF] text-[#5624D0] text-[10px] font-bold uppercase px-2.5 py-0.5">
                                                    <Tag size={10} />{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {/* Fallback to category_name if no tags */}
                                    {(!featured.tags || featured.tags.length === 0) && (
                                        <span className="inline-block bg-[#EBEBFF] text-[#5624D0] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-none mb-4">
                                            {featured.category_name || "Featured"}
                                        </span>
                                    )}
                                    <h3 className="text-[24px] md:text-[28px] font-bold text-[#1D2026] group-hover:text-[#5624D0] transition-colors leading-[36px] mb-4">
                                        {featured.title}
                                    </h3>
                                    <p className="text-[#6E7485] text-[14px] leading-[22px] mb-6">
                                        {getExcerpt(featured)}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-6 border-t border-[#E9EAF0] text-[12px] text-[#8C94A3] font-semibold uppercase tracking-wider">
                                    <div className="flex items-center gap-4">
                                        {featured.created_at && (
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-[#FF6636]" />
                                                {formatDate(featured.created_at)}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-[#5624D0]" />
                                            {featured.reading_time || "5 MIN READ"}
                                        </span>
                                    </div>
                                    <span className="text-[#FF6636] flex items-center gap-1.5 group-hover:translate-x-1 transition-transform font-bold">
                                        READ MORE <ArrowRight size={14} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Filter and Content list */}
                <div className="flex flex-col gap-10">
                    {/* Category Tabs */}
                    <div className="flex items-center gap-6 overflow-x-auto pb-0 border-b border-[#E9EAF0] w-full no-scrollbar">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`pb-3.5 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                                selectedCategory === 'all'
                                    ? 'border-[#5624D0] text-[#1D2026]'
                                    : 'border-transparent text-[#8C94A3] hover:text-[#1D2026]'
                            }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`pb-3.5 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 shrink-0 ${
                                    selectedCategory === cat.id
                                        ? 'border-[#5624D0] text-[#1D2026]'
                                        : 'border-transparent text-[#8C94A3] hover:text-[#1D2026]'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Blog Cards Grid */}
                    {loadingBlogs ? (
                        <div className="flex flex-col items-center justify-center py-28 bg-white border border-[#E9EAF0] rounded-none">
                            <Loader2 className="w-10 h-10 animate-spin text-[#5624D0] mb-3" />
                            <p className="text-sm text-[#8C94A3] font-semibold uppercase tracking-wider">Fetching articles...</p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20 bg-white border border-[#E9EAF0] rounded-none max-w-xl mx-auto">
                            <div className="w-16 h-16 bg-[#EBEBFF] rounded-none flex items-center justify-center mx-auto mb-5 text-[#5624D0]">
                                <BookOpen className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-[#1D2026] mb-2">No articles found</h3>
                            <p className="text-[#6E7485] text-sm mb-6 px-6">
                                We couldn't find any articles in this category. Check back again later or browse other categories.
                            </p>
                            <button 
                                onClick={() => setSelectedCategory('all')}
                                className="px-6 py-3 bg-[#1D2026] hover:bg-[#5624D0] text-white font-bold text-sm rounded-none transition-all uppercase tracking-wider"
                            >
                                View All Articles
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog.id}
                                    to={`/blogs/${blog.slug}`}
                                    className="group bg-white border border-[#E9EAF0] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 rounded-none overflow-hidden flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="relative aspect-[16/10] bg-gray-50 overflow-hidden">
                                            {blog.image ? (
                                                <img 
                                                    src={blog.image} 
                                                    alt={blog.title} 
                                                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <BookOpen size={36} className="stroke-[1.5]" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            {/* Tags or category */}
                                            {blog.tags && blog.tags.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {blog.tags.slice(0, 2).map((tag) => (
                                                        <span key={tag} className="inline-flex items-center gap-1 bg-[#EBEBFF] text-[#5624D0] text-[9px] font-bold uppercase px-2 py-0.5">
                                                            <Tag size={9} />{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="inline-block bg-[#EBEBFF] text-[#5624D0] text-[9px] font-bold uppercase px-2 py-0.5 rounded-none mb-3">
                                                    {blog.category_name || "Article"}
                                                </span>
                                            )}
                                            <h3 className="text-[18px] font-bold text-[#1D2026] group-hover:text-[#5624D0] transition-colors leading-[24px] mb-3 line-clamp-2" title={blog.title}>
                                                {blog.title}
                                            </h3>
                                            <p className="text-[#6E7485] text-[13px] leading-[20px] line-clamp-3">
                                                {getExcerpt(blog)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-6 pt-4 border-t border-[#E9EAF0] flex items-center justify-between text-[11px] text-[#8C94A3] font-semibold uppercase tracking-wider mt-auto">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={13} className="text-[#5624D0]" />
                                            {blog.reading_time || (blog.created_at ? formatDate(blog.created_at) : "5 MIN READ")}
                                        </span>
                                        <span className="text-[#FF6636] flex items-center gap-1 group-hover:gap-2 transition-all font-bold">
                                            READ ARTICLE <ArrowRight size={13} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Blogs;