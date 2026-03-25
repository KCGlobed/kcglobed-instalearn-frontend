import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, Clock, ArrowRight, X, BookOpen } from "lucide-react";
import type { AppDispatch, RootState } from "../store/store";
import { fetchHomepageCategories } from "../store/slices/homepageCategorySlice";

const RECENT_KEY = "il_recent_searches";
const MAX_RECENT = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  const prev = getRecent().filter((r) => r !== query);
  localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, MAX_RECENT)));
}

function removeRecent(query: string) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(getRecent().filter((r) => r !== query)));
}

// ─── HighlightText ────────────────────────────────────────────────────────────

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const escaped = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-100 text-[#1D2026] font-semibold rounded-[2px] px-[1px]">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// ─── SearchBar ────────────────────────────────────────────────────────────────

const SearchBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.homepageCategory);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [recent, setRecent] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => { dispatch(fetchHomepageCategories()); }, [dispatch]);
  useEffect(() => { if (open) setRecent(getRecent()); }, [open]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────────
  const trimmed = query.trim();
  const showRecent = !trimmed && recent.length > 0;
  const showSuggestions = trimmed.length > 0;

  const suggestions = trimmed
    ? categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  const listItems: string[] = showSuggestions
    ? suggestions.map((s) => s.name)
    : showRecent
      ? recent
      : [];

  const isEmpty = !showRecent && !showSuggestions;

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!open) return;
      const total = listItems.length;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIdx((p) => (p + 1) % (total || 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIdx((p) => (p - 1 + (total || 1)) % (total || 1));
          break;
        case "Enter":
          if (activeIdx >= 0 && listItems[activeIdx]) commitSearch(listItems[activeIdx]);
          else if (query.trim()) commitSearch(query.trim());
          break;
        case "Escape":
          setOpen(false);
          setActiveIdx(-1);
          inputRef.current?.blur();
          break;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, listItems, activeIdx, query]
  );

  const commitSearch = (term: string) => {
    saveRecent(term);
    setQuery(term);
    setOpen(false);
    setActiveIdx(-1);
    navigate(`/courses?search=${encodeURIComponent(term)}`);
  };

  const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    e.preventDefault();
    removeRecent(term);
    setRecent(getRecent());
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      style={{ position: "relative", overflow: "visible" }}
      className="w-full"
    >
      {/* Input wrapper */}
      <div className="relative flex items-center w-full">
        <Search
          className="absolute left-3 w-[18px] h-[18px] text-[#6E7485] pointer-events-none shrink-0"
          style={{ zIndex: 1 }}
        />
        <input
          ref={inputRef}
          id="main-search-input"
          type="text"
          value={query}
          placeholder="Search for anything"
          autoComplete="off"
          className="w-full h-[44px] bg-white border border-[#E9EAF0] pl-[38px] pr-[36px] text-[#1D2026] text-[14px] placeholder-[#8C94A3] focus:outline-none transition-all duration-150"
          style={{
            borderRadius: "4px",
            borderColor: open ? "#5624D0" : "#E9EAF0",
          }}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIdx(-1);
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            className="absolute right-3 text-[#6E7485] hover:text-[#1D2026] transition-colors"
            style={{ zIndex: 1 }}
            tabIndex={-1}
            onClick={() => { setQuery(""); setActiveIdx(-1); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            <X className="w-[14px] h-[14px]" />
          </button>
        )}
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          className="search-dropdown bg-white flex flex-col"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",  /* same gap as Browse dropdown */
            left: 0,
            width: "100%",
            zIndex: 9999,
            border: "1px solid #E9EAF0",
            borderRadius: "6px",      /* same radius as Browse dropdown */
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            maxHeight: 360,
            overflow: "hidden",
          }}
        >
          {/* Section label */}
          {(showRecent || showSuggestions) && (
            <div className="px-3 pt-3 pb-1 shrink-0">
              <span className="text-[10px] font-semibold text-[#8C94A3] uppercase tracking-widest">
                {showRecent ? "Recent Searches" : "Suggestions"}
              </span>
            </div>
          )}

          {/* List */}
          <ul className="overflow-y-auto" style={{ maxHeight: 280 }}>
            {isEmpty && (
              <li className="flex items-center gap-2.5 px-3 py-3 text-[13px] text-[#8C94A3]">
                <Search className="w-4 h-4 shrink-0" />
                Start typing to search for courses…
              </li>
            )}
            {listItems.map((item, idx) => (
              <li
                key={item}
                className={`flex items-center justify-between gap-3 px-3 py-[9px] cursor-pointer select-none transition-colors duration-100 ${activeIdx === idx ? "bg-[#F5F4FF]" : "hover:bg-[#FAFAFA]"
                  }`}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(-1)}
                onMouseDown={(e) => { e.preventDefault(); commitSearch(item); }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {showRecent
                    ? <Clock className="w-4 h-4 text-[#8C94A3] shrink-0" />
                    : <BookOpen className="w-4 h-4 text-[#5624D0] shrink-0" />
                  }
                  <span className="text-[13px] text-[#1D2026] truncate">
                    {showSuggestions
                      ? <HighlightText text={item} query={query} />
                      : item
                    }
                  </span>
                </div>
                {showRecent && (
                  <button
                    className="shrink-0 p-1 text-[#B2B7C2] hover:text-[#1D2026] transition-colors rounded"
                    onMouseDown={(e) => handleRemoveRecent(e, item)}
                    tabIndex={-1}
                    aria-label={`Remove "${item}" from recent searches`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* See all results */}
          {query.trim() && (
            <>
              <div className="h-px bg-[#E9EAF0] mx-3 shrink-0" />
              <button
                className="flex items-center gap-2 w-full px-3 py-2.5 text-[13px] font-semibold text-[#5624D0] hover:bg-[#F5F4FF] transition-colors shrink-0"
                onMouseDown={(e) => { e.preventDefault(); commitSearch(query.trim()); }}
              >
                <Search className="w-4 h-4 shrink-0" />
                <span>See all results for &ldquo;<span className="italic">{query}</span>&rdquo;</span>
                <ArrowRight className="w-4 h-4 ml-auto shrink-0" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
