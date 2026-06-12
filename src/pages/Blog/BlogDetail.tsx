import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, Loader2, BookOpen, User, Share2 } from "lucide-react";
import Footer from "../../layouts/Footer";
import MainHeader from "../../layouts/MainHeader";
import TopHeader from "../../layouts/TopHeader";
import { getBlogDetailApi, getAllBlogApi } from "../../utils/service";
import toast from "react-hot-toast";

interface Category {
    id: number;
    name: string;
}

interface Blog {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    short_description?: string;
    description?: string;
    content?: string;
    created_at: string;
    author_name?: string;
    category?: number | string | Category;
    category_name?: string;
}

const BlogDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    
    const [blog, setBlog] = useState<Blog | null>(null);
    const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRecent, setLoadingRecent] = useState(true);

    useEffect(() => {
        if (!slug) return;
        
        setLoading(true);
        // Fetch Blog Detail
        getBlogDetailApi(slug)
            .then((res) => {
                const data = res?.data?.data || res?.data || res;
                if (data && (data.title || data.id)) {
                    setBlog(data);
                } else {
                    setBlog(null);
                }
            })
            .catch((err) => {
                console.error("Error fetching blog details:", err);
                setBlog(null);
            })
            .finally(() => setLoading(false));
    }, [slug]);

    useEffect(() => {
        // Fetch recent blogs for the sidebar
        getRecentBlogs();
    }, [slug]);

    const getRecentBlogs = async () => {
        setLoadingRecent(true);
        try {
            const res = await getAllBlogApi();
            const data = res?.data?.data || res?.data || res;
            if (Array.isArray(data)) {
                // Filter out the currently viewed blog
                const filtered = data.filter((b: Blog) => b.slug !== slug).slice(0, 4);
                setRecentBlogs(filtered);
            }
        } catch (err) {
            console.error("Error fetching recent blogs:", err);
        } finally {
            setLoadingRecent(false);
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "";
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="bg-[#f9fafb] min-h-screen flex flex-col justify-between">
                <div>
                    <TopHeader />
                    <MainHeader />
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="w-12 h-12 animate-spin text-[#5624D0] mb-4" />
                        <p className="text-gray-500 font-semibold">Loading article details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="bg-[#f9fafb] min-h-screen flex flex-col justify-between font-inter">
                <div>
                    <TopHeader />
                    <MainHeader />
                    <div className="max-w-md mx-auto text-center py-32 px-6">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5 text-red-500">
                            <BookOpen size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-[#1D2026] mb-2">Article Not Found</h2>
                        <p className="text-[#6E7485] text-sm mb-8">
                            The blog article you are looking for does not exist or may have been removed.
                        </p>
                        <button
                            onClick={() => navigate("/blogs")}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1D2026] hover:bg-[#5624D0] text-white font-bold rounded transition-colors text-sm"
                        >
                            <ArrowLeft size={16} /> Back to Blogs
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#FAF9F6] min-h-screen font-inter flex flex-col text-[#1D2026] selection:bg-[#EBEBFF] selection:text-[#5624D0]">
            <TopHeader />
            <MainHeader />

            {/* Breadcrumbs & Navigation */}
            <div className="bg-white border-b border-[#E9EAF0] py-4 px-4 xl:px-0">
                <div className="max-w-[1320px] mx-auto flex items-center justify-between">
                    <nav className="flex items-center gap-2 text-[12px] text-[#8C94A3] uppercase font-semibold tracking-wider">
                        <Link to="/" className="hover:text-[#5624D0] transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/blogs" className="hover:text-[#5624D0] transition-colors">Blog</Link>
                        <span>/</span>
                        <span className="text-[#4E5566] truncate max-w-[200px] md:max-w-xs block font-bold" title={blog.title}>
                            {blog.title}
                        </span>
                    </nav>
                    <button
                        onClick={() => navigate("/blogs")}
                        className="inline-flex items-center gap-1.5 text-xs text-[#8C94A3] hover:text-[#5624D0] uppercase font-bold tracking-wider transition-colors"
                    >
                        <ArrowLeft size={14} className="text-[#FF6636]" /> All Articles
                    </button>
                </div>
            </div>

            {/* Main Content Layout */}
            <main className="max-w-[1320px] mx-auto px-4 xl:px-0 py-16 flex-grow w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left Article details */}
                    <article className="lg:col-span-8 bg-white border border-[#E9EAF0] rounded-none p-6 md:p-10 shadow-xs">
                        
                        {/* Header Details */}
                        <div className="mb-8">
                            <span className="inline-block bg-[#EBEBFF] text-[#5624D0] text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-none mb-4">
                                {blog.category_name || "Article"}
                            </span>
                            <h1 className="text-[28px] md:text-[36px] font-bold text-[#1D2026] leading-[38px] md:leading-[46px] tracking-tight mb-6">
                                {blog.title}
                            </h1>
                            
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-[#E9EAF0] text-[12px] text-[#8C94A3] font-semibold uppercase tracking-wider">
                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-[#EBEBFF] text-[#5624D0] flex items-center justify-center font-bold">
                                            {blog.author_name ? blog.author_name[0] : "I"}
                                        </div>
                                        <span className="text-[#1D2026] font-bold">
                                            {blog.author_name || "InstaLearn Expert"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-[#FF6636]" />
                                        <span>{formatDate(blog.created_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} className="text-[#5624D0]" />
                                        <span>5 MIN READ</span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={handleShare}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#E9EAF0] hover:border-[#5624D0] hover:text-[#5624D0] rounded-none transition-all font-bold text-[11px]"
                                >
                                    <Share2 size={13} className="text-[#FF6636]" /> SHARE POST
                                </button>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {blog.image && (
                            <div className="mb-8 rounded-none overflow-hidden aspect-[16/9] bg-gray-50 border border-[#E9EAF0]">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Excerpt if present */}
                        {blog.short_description && (
                            <p className="text-base font-medium text-[#4E5566] leading-relaxed mb-6 border-l-4 border-[#FF6636] pl-4 py-1 italic bg-slate-50/50">
                                {blog.short_description}
                            </p>
                        )}

                        {/* Rich Content body */}
                        <div 
                            className="prose prose-indigo max-w-none text-[#4E5566] leading-[26px] text-[15px] space-y-4 font-normal"
                            dangerouslySetInnerHTML={{ __html: blog.content || blog.description || "" }}
                        />

                    </article>

                    {/* Right sidebar */}
                    <aside className="lg:col-span-4 flex flex-col gap-8 lg:sticky lg:top-20">
                        
                        {/* Author widget */}
                        <div className="bg-white border border-[#E9EAF0] rounded-none p-6 shadow-xs">
                            <h3 className="text-sm font-bold text-[#1D2026] uppercase tracking-wider mb-4 pb-3 border-b border-[#E9EAF0]">
                                About the Author
                            </h3>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 bg-[#EBEBFF] text-[#5624D0] flex items-center justify-center font-bold text-lg">
                                    {blog.author_name ? blog.author_name[0] : "I"}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#1D2026]">
                                        {blog.author_name || "InstaLearn Expert"}
                                    </h4>
                                    <p className="text-[11px] text-[#8C94A3] uppercase tracking-wider">Content Analyst</p>
                                </div>
                            </div>
                            <p className="text-[#6E7485] text-[13px] leading-[20px]">
                                Share knowledge, create community, and keep learning everyday. Our team of educators curate industry-specific trends to guide learners to achieve their professional goals.
                            </p>
                        </div>

                        {/* Recent blogs widget */}
                        <div className="bg-white border border-[#E9EAF0] rounded-none p-6 shadow-xs">
                            <h3 className="text-sm font-bold text-[#1D2026] uppercase tracking-wider mb-4 pb-3 border-b border-[#E9EAF0]">
                                Recent Articles
                            </h3>
                            
                            {loadingRecent ? (
                                <div className="flex justify-center py-6">
                                    <Loader2 className="w-6 h-6 animate-spin text-[#5624D0]" />
                                </div>
                            ) : recentBlogs.length === 0 ? (
                                <p className="text-xs text-[#8C94A3] uppercase">No other recent articles.</p>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {recentBlogs.map((item) => (
                                        <Link
                                            key={item.id}
                                            to={`/blogs/${item.slug}`}
                                            className="group flex gap-3 items-start"
                                        >
                                            <div className="w-16 h-12 shrink-0 rounded-none overflow-hidden bg-gray-50 border border-[#E9EAF0] relative">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <BookOpen size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-xs font-bold text-[#1D2026] group-hover:text-[#5624D0] transition-colors leading-snug line-clamp-2" title={item.title}>
                                                    {item.title}
                                                </h4>
                                                <span className="text-[10px] text-[#8C94A3] uppercase">
                                                    {formatDate(item.created_at)}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                    </aside>

                </div>
            </main>

            <Footer />
        </div>
    );
};

export default BlogDetail;
