import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Trash2, Pencil } from 'lucide-react';
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useRedux';
import type { RootState } from '../../store/store';
import { fetchNotes, createNote, updateNote, deleteNote } from '../../store/slices/noteSlice';
import type { Note as ApiNote } from '../../store/slices/noteSlice';
import { setActiveLesson } from '../../store/slices/courseDashboardLectureSlice';

// --- Helper Functions ---
const formatDuration = (secondsNum: number | string) => {
    const sec = parseInt(String(secondsNum), 10) || 0;
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- Notes Editor Component ---
const NotesEditor = ({ 
    onSave, 
    onCancel, 
    currentTimestamp = "0:00" 
}: { 
    onSave: (content: string) => Promise<void>, 
    onCancel: () => void, 
    currentTimestamp?: string 
}) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        const temp = document.createElement('div');
        temp.innerHTML = value;
        if (!temp.textContent?.trim()) {
            setError("Note content cannot be empty.");
            return;
        }

        setError(null);
        setIsSaving(true);
        try {
            await onSave(value);
            setValue('');
        } catch (err: any) {
            setError(err?.message || "Failed to save note.");
        } finally {
            setIsSaving(false);
        }
    };

    const modules = {
        toolbar: [
            ['bold', 'italic'],
            [{ list: 'ordered' }, { list: 'bullet' }]
        ]
    };

    return (
        <div className="flex gap-4 w-full">
            <div className="mt-2 shrink-0">
                <span className="inline-block bg-[#2d2f31] text-white px-3 py-1 text-sm font-bold rounded-full">
                    {currentTimestamp}
                </span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
                <div className={`react-quill-wrapper ${isFocused ? 'quill-focused' : ''}`}>
                    <ReactQuill
                        theme="snow"
                        value={value}
                        onChange={setValue}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        modules={modules}
                        placeholder="Create a new note..."
                        readOnly={isSaving}
                    />
                </div>
                {error && (
                    <div className="text-red-600 text-xs font-semibold mt-1">
                        {error}
                    </div>
                )}
                <div className="flex justify-end gap-2 mt-2">
                    <button 
                        onClick={onCancel} 
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-bold text-[#2d2f31] hover:bg-[#f7f9fa] transition-colors rounded-sm disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-bold bg-[#a435f0] text-white rounded-sm hover:bg-[#8712d3] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? "Saving..." : "Save note"}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Note Card Component ---
const NoteCard = ({ 
    note, 
    onDelete, 
    onUpdate,
    onTimestampClick 
}: { 
    note: ApiNote, 
    onDelete: (id: number) => void, 
    onUpdate: (id: number, content: string) => Promise<void>,
    onTimestampClick: (note: ApiNote) => void 
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(note.note_content);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const durationSec = parseInt(note.duration, 10) || 0;
    const timestampDisplay = formatDuration(durationSec);
    const lectureTitle = note.lecture_info?.video_info?.name || `Lecture ${note.chapter_lecture}`;

    const handleSave = async () => {
        const temp = document.createElement('div');
        temp.innerHTML = editValue;
        if (!temp.textContent?.trim()) {
            setError("Note content cannot be empty.");
            return;
        }

        setError(null);
        setIsSaving(true);
        try {
            await onUpdate(note.id, editValue);
            setIsEditing(false);
        } catch (err: any) {
            setError(err?.message || "Failed to update note.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditValue(note.note_content);
        setError(null);
        setIsEditing(false);
    };

    const modules = {
        toolbar: [
            ['bold', 'italic'],
            [{ list: 'ordered' }, { list: 'bullet' }]
        ]
    };

    return (
        <div className="flex gap-4 py-6 border-b border-[#d1d7dc]">
            <div className="shrink-0 mt-1">
                <button
                    onClick={() => onTimestampClick(note)}
                    className="inline-block bg-[#2d2f31] text-white px-3 py-1 text-sm font-bold rounded-full hover:bg-[#1c1d1f] transition-colors"
                >
                    {timestampDisplay}
                </button>
            </div>
            <div className="flex-1 w-full overflow-hidden">
                <div className="flex justify-between items-start mb-3 gap-4">
                    <h3 className="font-bold text-base text-[#2d2f31] leading-snug">{lectureTitle}</h3>
                    {!isEditing && (
                        <div className="flex gap-3 text-[#2d2f31] shrink-0">
                            <button 
                                onClick={() => setIsEditing(true)} 
                                className="hover:text-[#a435f0] transition-colors" 
                                title="Edit note"
                            >
                                <Pencil size={16} />
                            </button>
                            <button 
                                onClick={() => onDelete(note.id)} 
                                className="hover:text-[#a435f0] transition-colors" 
                                title="Delete note"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="flex flex-col gap-2 mt-2 w-full">
                        <div className={`react-quill-wrapper ${isFocused ? 'quill-focused' : ''}`}>
                            <ReactQuill
                                theme="snow"
                                value={editValue}
                                onChange={setEditValue}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                modules={modules}
                                placeholder="Edit your note..."
                                readOnly={isSaving}
                            />
                        </div>
                        {error && (
                            <div className="text-red-600 text-xs font-semibold mt-1">
                                {error}
                            </div>
                        )}
                        <div className="flex justify-end gap-2 mt-2">
                            <button 
                                onClick={handleCancel} 
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-bold text-[#2d2f31] hover:bg-[#f7f9fa] transition-colors rounded-sm disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="px-4 py-2 text-sm font-bold bg-[#a435f0] text-white rounded-sm hover:bg-[#8712d3] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving ? "Saving..." : "Save note"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        className="bg-[#f7f9fa] p-4 rounded-sm text-sm text-[#2d2f31] leading-relaxed [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4"
                        dangerouslySetInnerHTML={{ __html: note.note_content }}
                    />
                )}
            </div>
        </div>
    );
};

// --- Notes List Component ---
const NotesList = ({ 
    notes, 
    onDelete, 
    onUpdate,
    onTimestampClick 
}: { 
    notes: ApiNote[], 
    onDelete: (id: number) => void, 
    onUpdate: (id: number, content: string) => Promise<void>,
    onTimestampClick: (note: ApiNote) => void 
}) => {
    if (notes.length === 0) {
        return (
            <div className="py-16 text-center text-[#6a6f73]">
                <p>No notes exist yet for this lecture filter. Create a new note to get started.</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col">
            {notes.map(note => (
                <NoteCard 
                    key={note.id} 
                    note={note} 
                    onDelete={onDelete} 
                    onUpdate={onUpdate}
                    onTimestampClick={onTimestampClick} 
                />
            ))}
        </div>
    );
};

// --- Main Notes Container ---
const NotesContainer = () => {
    const dispatch = useAppDispatch();
    const { slug } = useParams();
    const courseId = Number(slug) || 1;

    const { notes, loading, error } = useAppSelector((state: RootState) => state.notes);
    const { activeLesson } = useAppSelector((state: RootState) => state.courseDashboardLecture);
    const lectureId = activeLesson?.id || 0;

    const [isEditing, setIsEditing] = useState(false);
    const [capturedTime, setCapturedTime] = useState(0);
    const [videoTime, setVideoTime] = useState(0);
    const [filterOption, setFilterOption] = useState<'all' | 'current'>('all');
    const [sortOption, setSortOption] = useState<'recent' | 'oldest'>('recent');

    // Fetch notes on mount/course change
    useEffect(() => {
        if (courseId) {
            dispatch(fetchNotes(courseId));
        }
    }, [dispatch, courseId]);

    // Periodically sync the video player's time
    useEffect(() => {
        const interval = setInterval(() => {
            const video = document.querySelector('video');
            if (video) {
                setVideoTime(Math.floor(video.currentTime));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Seek the video to the note's timestamp
    const handleTimestampClick = (note: ApiNote) => {
        const durationSec = parseInt(note.duration, 10) || 0;
        if (activeLesson?.id === note.chapter_lecture) {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime = durationSec;
                video.play().catch(console.error);
            }
        } else {
            localStorage.setItem(`lecture_progress_${note.chapter_lecture}`, durationSec.toString());
            dispatch(setActiveLesson(note.lecture_info as any));
        }
    };

    // Open editing view and capture the active player timestamp
    const handleTriggerEdit = () => {
        const video = document.querySelector('video');
        const currentTime = video ? Math.floor(video.currentTime) : 0;
        if (video) {
            video.pause();
        }
        setCapturedTime(currentTime);
        setIsEditing(true);
    };

    // Save note via Redux Thunk
    const handleSaveNote = async (content: string) => {
        if (!lectureId) {
            throw new Error("Please select a lecture before saving a note.");
        }
        const payload = {
            course_id: courseId,
            lecture_id: lectureId,
            note_content: content,
            duration: capturedTime
        };
        await dispatch(createNote(payload)).unwrap();
        // Refresh notes list on successful save
        dispatch(fetchNotes(courseId));
        setIsEditing(false);
    };

    const handleUpdateNote = async (id: number, content: string) => {
        await dispatch(updateNote({ courseId: id, data: { note_content: content } })).unwrap();
    };

    const handleDeleteNote = async (id: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this note?");
        if (confirmDelete) {
            await dispatch(deleteNote(id)).unwrap();
        }
    };

    // Filter notes: All vs Current Lecture
    const filteredNotes = notes.filter(note => {
        if (filterOption === 'current') {
            return note.chapter_lecture === lectureId;
        }
        return true;
    });

    // Sort notes: Most Recent vs Oldest
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (sortOption === 'recent') {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
    });

    return (
        <div className="w-full max-w-[850px] mx-auto py-4 font-sans">
            {/* Editor Trigger / Editor Area */}
            {!isEditing ? (
                <div
                    onClick={handleTriggerEdit}
                    className="flex justify-between items-center w-full p-4 mb-8 border border-[#2d2f31] rounded-sm cursor-text hover:bg-[#f7f9fa] transition-colors"
                >
                    <span className="text-[#6a6f73] font-medium text-sm">
                        Create a new note at {formatDuration(videoTime)}
                    </span>
                    <button className="w-6 h-6 rounded-full bg-[#2d2f31] text-white flex items-center justify-center pointer-events-none">
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>
            ) : (
                <div className="mb-8">
                    <NotesEditor 
                        onSave={handleSaveNote} 
                        onCancel={() => setIsEditing(false)} 
                        currentTimestamp={formatDuration(capturedTime)} 
                    />
                </div>
            )}

            {/* Filters Area */}
            <div className="flex gap-4 mb-6">
                <select 
                    value={filterOption}
                    onChange={(e) => setFilterOption(e.target.value as 'all' | 'current')}
                    className="border border-[#2d2f31] rounded-sm px-4 py-2 font-bold text-sm bg-white text-[#2d2f31] focus:outline-none focus:border-[#a435f0] cursor-pointer"
                >
                    <option value="all">All lectures</option>
                    <option value="current">Current lecture</option>
                </select>
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as 'recent' | 'oldest')}
                    className="border border-[#2d2f31] rounded-sm px-4 py-2 font-bold text-sm bg-white text-[#2d2f31] focus:outline-none focus:border-[#a435f0] cursor-pointer"
                >
                    <option value="recent">Sort by most recent</option>
                    <option value="oldest">Sort by oldest</option>
                </select>
            </div>

            {/* Loading & Error States */}
            {loading && notes.length === 0 ? (
                <div className="py-16 text-center text-[#6a6f73]">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#a435f0] mb-4"></div>
                    <p className="font-medium text-sm">Loading notes...</p>
                </div>
            ) : error ? (
                <div className="py-16 text-center text-red-600">
                    <p className="font-medium text-sm">Error: {error}</p>
                </div>
            ) : (
                /* Notes List */
                <NotesList 
                    notes={sortedNotes} 
                    onDelete={handleDeleteNote} 
                    onUpdate={handleUpdateNote}
                    onTimestampClick={handleTimestampClick} 
                />
            )}
        </div>
    );
};

export default NotesContainer;