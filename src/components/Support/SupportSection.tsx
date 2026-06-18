import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
    FileText,
    BookOpen,
    Search,
    Calendar,
    Loader2,
    FolderOpen,
    MessageSquare,
    HelpCircle,
} from "lucide-react";
import {
    getHelpAndSupportTopicListApi,
    getHelpAndSupportSubtopicListApi,
    getHelpAndSupportArticleListApi,
    getHelpAndSupportArticleDetailApi,
} from "../../utils/service";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Topic {
    id: number;
    title: string;
    slug: string;
    image?: string;
    icon?: string;
    description?: string;
}

interface Subtopic {
    id: number;
    title: string;
    slug: string;
    topic?: number;
}

interface Article {
    id: number;
    title: string;
    slug: string;
    subtopic?: number;
}

interface ArticleDetail {
    id: number;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    created_at?: string;
    updated_at?: string;
}

// ─── Skeleton Components ───────────────────────────────────────────────────────

const TopicSkeleton = () => (
    <div className="animate-pulse space-y-2 px-4 py-3">
        {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 px-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg shrink-0" />
                <div className="flex-1 h-4 bg-gray-200 rounded" style={{ width: `${60 + i * 7}%` }} />
            </div>
        ))}
    </div>
);

const SubtopicSkeleton = () => (
    <div className="animate-pulse space-y-1 pl-11 pr-4 py-1">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="h-3.5 bg-gray-100 rounded my-2" style={{ width: `${55 + i * 10}%` }} />
        ))}
    </div>
);

const ArticleSkeleton = () => (
    <div className="animate-pulse space-y-1 pl-14 pr-4 py-1">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-100 rounded my-2" style={{ width: `${50 + i * 12}%` }} />
        ))}
    </div>
);

const ContentSkeleton = () => (
    <div className="animate-pulse p-8 md:p-10 space-y-5">
        <div className="h-7 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="space-y-3 mt-6">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-5/6" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
        </div>
        <div className="space-y-3 mt-4">
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-4/5" />
            <div className="h-4 bg-gray-100 rounded w-full" />
        </div>
    </div>
);

// ─── Sidebar Items ────────────────────────────────────────────────────────────

interface ArticleItemProps {
    article: Article;
    isActive: boolean;
    onClick: (article: Article) => void;
}

const ArticleItem = ({ article, isActive, onClick }: ArticleItemProps) => (
    <li>
        <button
            onClick={() => onClick(article)}
            className={`w-full text-left flex items-center gap-2 py-2 pl-14 pr-4 text-[13px] transition-all duration-150 rounded-r-lg group ${
                isActive
                    ? "text-[#5624D0] font-semibold bg-[#EBEBFF]"
                    : "text-[#6E7485] hover:text-[#1D2026] hover:bg-[#F5F4FF]"
            }`}
        >
            <FileText
                className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                    isActive ? "text-[#5624D0]" : "text-[#B0B7C3] group-hover:text-[#5624D0]"
                }`}
            />
            <span className="line-clamp-2 leading-snug">{article.title}</span>
        </button>
    </li>
);

// ─── Subtopic with Articles ────────────────────────────────────────────────────

interface SubtopicRowProps {
    subtopic: Subtopic;
    isActiveSubtopic: boolean;
    activeArticleId: number | null;
    onSubtopicClick: (subtopic: Subtopic) => void;
    onArticleClick: (article: Article) => void;
}

const SubtopicRow = ({
    subtopic,
    isActiveSubtopic,
    activeArticleId,
    onSubtopicClick,
    onArticleClick,
}: SubtopicRowProps) => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loadingArticles, setLoadingArticles] = useState(false);
    const [expanded, setExpanded] = useState(isActiveSubtopic);

    useEffect(() => {
        setExpanded(isActiveSubtopic);
    }, [isActiveSubtopic]);

    const handleClick = () => {
        const nextExpanded = !expanded;
        setExpanded(nextExpanded);
        onSubtopicClick(subtopic);

        if (nextExpanded && articles.length === 0) {
            setLoadingArticles(true);
            getHelpAndSupportArticleListApi(subtopic.slug)
                .then((res: any) => {
                    const data = res?.data?.data || res?.data || res;
                    setArticles(Array.isArray(data) ? data : []);
                })
                .catch(() => setArticles([]))
                .finally(() => setLoadingArticles(false));
        }
    };

    return (
        <li>
            <button
                onClick={handleClick}
                className={`w-full text-left flex items-center gap-2 py-2.5 pl-11 pr-4 text-[13px] font-medium transition-all duration-150 rounded-r-lg group ${
                    isActiveSubtopic
                        ? "text-[#1D2026] bg-[#F5F4FF]"
                        : "text-[#4E5566] hover:text-[#1D2026] hover:bg-[#F5F4FF]/60"
                }`}
            >
                <ChevronRight
                    className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                        expanded ? "rotate-90 text-[#5624D0]" : "text-[#B0B7C3] group-hover:text-[#5624D0]"
                    }`}
                />
                <span className="flex-1 line-clamp-2 leading-snug">{subtopic.title}</span>
            </button>

            {/* Articles */}
            <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: expanded ? "600px" : "0px" }}
            >
                {loadingArticles ? (
                    <ArticleSkeleton />
                ) : articles.length > 0 ? (
                    <ul>
                        {articles.map((article) => (
                            <ArticleItem
                                key={article.id}
                                article={article}
                                isActive={activeArticleId === article.id}
                                onClick={onArticleClick}
                            />
                        ))}
                    </ul>
                ) : expanded ? (
                    <p className="pl-14 pr-4 py-2 text-[12px] text-[#B0B7C3] italic">No articles available.</p>
                ) : null}
            </div>
        </li>
    );
};

// ─── Topic Row with Subtopics ─────────────────────────────────────────────────

interface TopicRowProps {
    topic: Topic;
    isActiveTopic: boolean;
    activeSubtopicId: number | null;
    activeArticleId: number | null;
    onTopicClick: (topic: Topic) => void;
    onSubtopicClick: (subtopic: Subtopic) => void;
    onArticleClick: (article: Article) => void;
}

const TopicRow = ({
    topic,
    isActiveTopic,
    activeSubtopicId,
    activeArticleId,
    onTopicClick,
    onSubtopicClick,
    onArticleClick,
}: TopicRowProps) => {
    const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
    const [loadingSubtopics, setLoadingSubtopics] = useState(false);
    const [expanded, setExpanded] = useState(isActiveTopic);

    useEffect(() => {
        setExpanded(isActiveTopic);
    }, [isActiveTopic]);

    const handleClick = () => {
        const nextExpanded = !expanded;
        setExpanded(nextExpanded);
        onTopicClick(topic);

        if (nextExpanded && subtopics.length === 0) {
            setLoadingSubtopics(true);
            getHelpAndSupportSubtopicListApi(topic.slug)
                .then((res: any) => {
                    const data = res?.data?.data || res?.data || res;
                    setSubtopics(Array.isArray(data) ? data : []);
                })
                .catch(() => setSubtopics([]))
                .finally(() => setLoadingSubtopics(false));
        }
    };

    return (
        <li className="border-b border-[#F0F1F5] last:border-0">
            {/* Topic Header */}
            <button
                onClick={handleClick}
                className={`w-full text-left flex items-center gap-3 py-4 px-4 transition-all duration-150 group ${
                    isActiveTopic
                        ? "bg-[#EBEBFF]"
                        : "hover:bg-[#F5F4FF]"
                }`}
            >
                {/* Icon */}
                <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isActiveTopic
                            ? "bg-[#5624D0] text-white shadow-md shadow-[#5624D0]/30"
                            : "bg-[#F0F1F5] text-[#6E7485] group-hover:bg-[#EBEBFF] group-hover:text-[#5624D0]"
                    }`}
                >
                    {topic.image ? (
                        <img src={topic.image} alt={topic.title} className="w-5 h-5 object-contain" />
                    ) : (
                        <FolderOpen className="w-4.5 h-4.5" />
                    )}
                </div>

                <span
                    className={`flex-1 text-[14px] font-semibold leading-snug transition-colors ${
                        isActiveTopic ? "text-[#5624D0]" : "text-[#1D2026] group-hover:text-[#5624D0]"
                    }`}
                >
                    {topic.title}
                </span>

                <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                        expanded ? "rotate-180 text-[#5624D0]" : "text-[#B0B7C3]"
                    }`}
                />
            </button>

            {/* Subtopics accordion */}
            <div
                className="overflow-hidden transition-all duration-300"
                style={{ maxHeight: expanded ? "1200px" : "0px" }}
            >
                {loadingSubtopics ? (
                    <SubtopicSkeleton />
                ) : subtopics.length > 0 ? (
                    <ul className="py-1.5">
                        {subtopics.map((subtopic) => (
                            <SubtopicRow
                                key={subtopic.id}
                                subtopic={subtopic}
                                isActiveSubtopic={activeSubtopicId === subtopic.id}
                                activeArticleId={activeArticleId}
                                onSubtopicClick={onSubtopicClick}
                                onArticleClick={onArticleClick}
                            />
                        ))}
                    </ul>
                ) : expanded ? (
                    <p className="pl-14 pr-4 py-3 text-[12px] text-[#B0B7C3] italic">No subtopics available.</p>
                ) : null}
            </div>
        </li>
    );
};

// ─── Main SupportSection ───────────────────────────────────────────────────────

const SupportSection = () => {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [loadingTopics, setLoadingTopics] = useState(true);

    const [activeTopicId, setActiveTopicId] = useState<number | null>(null);
    const [activeSubtopicId, setActiveSubtopicId] = useState<number | null>(null);
    const [activeArticle, setActiveArticle] = useState<Article | null>(null);

    const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [detailError, setDetailError] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    // Fetch Topics on mount
    useEffect(() => {
        getHelpAndSupportTopicListApi()
            .then((res: any) => {
                const data = res?.data?.data || res?.data || res;
                setTopics(Array.isArray(data) ? data : []);
            })
            .catch(() => setTopics([]))
            .finally(() => setLoadingTopics(false));
    }, []);

    // Fetch article detail when an article is selected
    useEffect(() => {
        if (!activeArticle) return;
        setLoadingDetail(true);
        setDetailError(false);
        setArticleDetail(null);

        getHelpAndSupportArticleDetailApi(activeArticle.slug)
            .then((res: any) => {
                const data = res?.data?.data || res?.data || res;
                if (data && typeof data === "object" && !Array.isArray(data)) {
                    setArticleDetail(data);
                } else {
                    setDetailError(true);
                }
            })
            .catch(() => setDetailError(true))
            .finally(() => setLoadingDetail(false));
    }, [activeArticle]);

    const handleTopicClick = useCallback((topic: Topic) => {
        setActiveTopicId((prev) => (prev === topic.id ? null : topic.id));
        setActiveSubtopicId(null);
    }, []);

    const handleSubtopicClick = useCallback((subtopic: Subtopic) => {
        setActiveSubtopicId((prev) => (prev === subtopic.id ? null : subtopic.id));
    }, []);

    const handleArticleClick = useCallback((article: Article) => {
        setActiveArticle(article);
    }, []);

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

    const filteredTopics = topics.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-[#F8F9FC] min-h-screen">
            {/* Page Header */}
            <div className="bg-white border-b border-[#E9EAF0]">
                <div className="max-w-[1320px] mx-auto px-4 xl:px-0 py-10">
                    <nav className="flex items-center gap-2 text-[12px] text-[#8C94A3] mb-4 uppercase font-semibold tracking-wider">
                        <Link to="/" className="hover:text-[#5624D0] transition-colors">Home</Link>
                        <span>/</span>
                        <span className="text-[#4E5566]">Support Center</span>
                    </nav>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                        <div>
                            <h1 className="text-[28px] md:text-[36px] font-bold text-[#1D2026] tracking-tight leading-tight">
                                Support Center
                            </h1>
                            <p className="text-[#6E7485] mt-2 text-[15px] leading-[24px] max-w-xl">
                                Browse topics, find answers, and get the help you need — all in one place.
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-[24px] font-bold text-[#5624D0]">{topics.length}</p>
                                <p className="text-[11px] text-[#8C94A3] uppercase tracking-wider font-semibold">Topics</p>
                            </div>
                            <div className="w-px h-10 bg-[#E9EAF0]" />
                            <div className="flex items-center gap-2 text-[#6E7485]">
                                <HelpCircle className="w-5 h-5 text-[#5624D0]" />
                                <span className="text-[13px] font-medium">Need more help? <a href="#" className="text-[#5624D0] font-semibold hover:underline">Contact us</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main 2-column layout */}
            <div className="max-w-[1320px] mx-auto px-4 xl:px-0 py-8">
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* ── LEFT SIDEBAR ── */}
                    <aside className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl border border-[#E9EAF0] shadow-sm overflow-hidden">
                            {/* Sidebar Header */}
                            <div className="px-4 py-4 border-b border-[#E9EAF0] bg-gradient-to-r from-[#5624D0] to-[#7B5CEA]">
                                <div className="flex items-center gap-2 mb-3">
                                    <BookOpen className="w-4.5 h-4.5 text-white/80" />
                                    <h2 className="text-white font-bold text-[14px] uppercase tracking-wider">Browse Topics</h2>
                                </div>
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/50" />
                                    <input
                                        type="text"
                                        placeholder="Search topics..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-white/15 border border-white/20 rounded-lg text-[13px] text-white placeholder-white/50 focus:outline-none focus:bg-white/25 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Topics List */}
                            <div className="max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
                                {loadingTopics ? (
                                    <TopicSkeleton />
                                ) : filteredTopics.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                                        <FolderOpen className="w-10 h-10 text-[#E9EAF0] mb-3" />
                                        <p className="text-[13px] text-[#8C94A3] font-medium">
                                            {searchQuery ? "No topics match your search." : "No topics available yet."}
                                        </p>
                                    </div>
                                ) : (
                                    <ul>
                                        {filteredTopics.map((topic) => (
                                            <TopicRow
                                                key={topic.id}
                                                topic={topic}
                                                isActiveTopic={activeTopicId === topic.id}
                                                activeSubtopicId={activeSubtopicId}
                                                activeArticleId={activeArticle?.id ?? null}
                                                onTopicClick={handleTopicClick}
                                                onSubtopicClick={handleSubtopicClick}
                                                onArticleClick={handleArticleClick}
                                            />
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </aside>

                    {/* ── RIGHT CONTENT AREA ── */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-2xl border border-[#E9EAF0] shadow-sm min-h-[500px] overflow-hidden">
                            {/* Content States */}
                            {loadingDetail ? (
                                <ContentSkeleton />
                            ) : detailError ? (
                                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <HelpCircle className="w-7 h-7 text-red-400" />
                                    </div>
                                    <h3 className="text-[16px] font-bold text-[#1D2026] mb-2">Unable to load article</h3>
                                    <p className="text-[#6E7485] text-[13px] max-w-sm">
                                        There was a problem fetching this article. Please try again.
                                    </p>
                                    <button
                                        onClick={() => activeArticle && handleArticleClick(activeArticle)}
                                        className="mt-5 px-5 py-2.5 bg-[#5624D0] text-white text-[13px] font-bold rounded-lg hover:bg-[#461DA5] transition-colors"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : articleDetail ? (
                                /* Article Detail */
                                <article className="p-8 md:p-10">
                                    {/* Breadcrumb trail */}
                                    <div className="flex items-center gap-2 text-[11px] text-[#8C94A3] uppercase tracking-wider font-semibold mb-6 flex-wrap">
                                        <span>Support</span>
                                        {activeTopicId && (
                                            <>
                                                <ChevronRight className="w-3 h-3" />
                                                <span className="text-[#5624D0]">
                                                    {topics.find((t) => t.id === activeTopicId)?.title}
                                                </span>
                                            </>
                                        )}
                                        <ChevronRight className="w-3 h-3" />
                                        <span className="text-[#4E5566] normal-case font-medium text-[12px]">
                                            {articleDetail.title}
                                        </span>
                                    </div>

                                    {/* Article Header */}
                                    <div className="border-b border-[#F0F1F5] pb-6 mb-8">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-[#EBEBFF] rounded-xl flex items-center justify-center shrink-0 mt-1">
                                                <FileText className="w-5 h-5 text-[#5624D0]" />
                                            </div>
                                            <div>
                                                <h2 className="text-[22px] md:text-[26px] font-bold text-[#1D2026] leading-tight mb-3">
                                                    {articleDetail.title}
                                                </h2>
                                                {articleDetail.created_at && (
                                                    <div className="flex items-center gap-1.5 text-[12px] text-[#8C94A3]">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>Published on {formatDate(articleDetail.created_at)}</span>
                                                        {articleDetail.updated_at && articleDetail.updated_at !== articleDetail.created_at && (
                                                            <span className="ml-3 text-[#B0B7C3]">
                                                                · Updated {formatDate(articleDetail.updated_at)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Article Body */}
                                    {(articleDetail.description || articleDetail.content) ? (
                                        <div
                                            className="prose prose-slate max-w-none article-content"
                                            dangerouslySetInnerHTML={{
                                                __html: articleDetail.description || articleDetail.content || "",
                                            }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <MessageSquare className="w-8 h-8 text-[#E9EAF0] mb-3" />
                                            <p className="text-[14px] text-[#8C94A3]">This article has no content yet.</p>
                                        </div>
                                    )}

                                    {/* Footer feedback */}
                                    <div className="mt-12 pt-8 border-t border-[#F0F1F5]">
                                        <p className="text-[13px] text-[#6E7485] font-medium mb-3">Was this article helpful?</p>
                                        <div className="flex items-center gap-3">
                                            <button className="px-5 py-2 bg-[#F0F8F0] text-[#2E7D32] border border-[#C8E6C9] text-[13px] font-semibold rounded-lg hover:bg-[#E8F5E9] transition-colors">
                                                👍 Yes, it helped
                                            </button>
                                            <button className="px-5 py-2 bg-[#FFF5F5] text-[#C62828] border border-[#FFCDD2] text-[13px] font-semibold rounded-lg hover:bg-[#FFEBEE] transition-colors">
                                                👎 No, I need more help
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ) : (
                                /* Empty placeholder */
                                <div className="flex flex-col items-center justify-center min-h-[500px] px-6 py-20 text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#EBEBFF] to-[#F5F4FF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                        <BookOpen className="w-9 h-9 text-[#5624D0]" />
                                    </div>
                                    <h3 className="text-[18px] font-bold text-[#1D2026] mb-2">
                                        Select an article to view details
                                    </h3>
                                    <p className="text-[#6E7485] text-[14px] max-w-sm leading-relaxed">
                                        Browse the topics in the sidebar, expand a subtopic, and click on any article to read it here.
                                    </p>

                                    {/* Visual hint arrows for desktop */}
                                    <div className="hidden lg:flex items-center gap-2 mt-8 text-[12px] text-[#B0B7C3] font-medium uppercase tracking-wider">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Waiting for selection...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            {/* Scoped styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E9EAF0;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #B0B7C3;
                }

                .article-content h1,
                .article-content h2,
                .article-content h3 {
                    color: #1D2026;
                    font-weight: 700;
                    line-height: 1.4;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                }
                .article-content h1 { font-size: 1.5rem; }
                .article-content h2 { font-size: 1.25rem; }
                .article-content h3 { font-size: 1.1rem; }
                .article-content p {
                    color: #4E5566;
                    font-size: 15px;
                    line-height: 1.75;
                    margin-bottom: 1em;
                }
                .article-content ul,
                .article-content ol {
                    color: #4E5566;
                    font-size: 15px;
                    line-height: 1.75;
                    padding-left: 1.5em;
                    margin-bottom: 1em;
                }
                .article-content li { margin-bottom: 0.4em; }
                .article-content a {
                    color: #5624D0;
                    text-decoration: underline;
                }
                .article-content a:hover { color: #461DA5; }
                .article-content code {
                    background: #F5F4FF;
                    color: #5624D0;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 13px;
                }
                .article-content pre {
                    background: #1D2026;
                    color: #E9EAF0;
                    padding: 16px;
                    border-radius: 8px;
                    overflow-x: auto;
                    font-size: 13px;
                    line-height: 1.6;
                    margin-bottom: 1em;
                }
                .article-content blockquote {
                    border-left: 3px solid #5624D0;
                    padding-left: 16px;
                    margin-left: 0;
                    color: #6E7485;
                    font-style: italic;
                }
                .article-content img {
                    max-width: 100%;
                    border-radius: 8px;
                    margin: 1em 0;
                }
                .article-content table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 14px;
                    margin-bottom: 1em;
                }
                .article-content th {
                    background: #F5F4FF;
                    color: #1D2026;
                    font-weight: 700;
                    padding: 10px 14px;
                    border: 1px solid #E9EAF0;
                    text-align: left;
                }
                .article-content td {
                    padding: 10px 14px;
                    border: 1px solid #E9EAF0;
                    color: #4E5566;
                }
                .article-content tr:hover td {
                    background: #F8F9FC;
                }
            `}</style>
        </div>
    );
};

export default SupportSection;