import React, { useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Plus, Edit2, Trash2 } from 'lucide-react';

// --- Types ---
interface Note {
    id: string;
    timestamp: number;
    timestampDisplay: string;
    lectureTitle: string;
    content: string;
}

// --- Notes Editor Component ---
const NotesEditor = ({ onSave, onCancel, currentTimestamp = "0:02" }: { onSave: (content: string) => void, onCancel: () => void, currentTimestamp?: string }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    const execCommand = (command: string) => {
        document.execCommand(command, false, '');
        editorRef.current?.focus();
    };

    const handleSave = () => {
        if (editorRef.current) {
            onSave(editorRef.current.innerHTML);
            editorRef.current.innerHTML = '';
        }
    };


    return (
        <div className="flex gap-4 w-full">
            <div className="mt-2 shrink-0">
                <span className="inline-block bg-[#2d2f31] text-white px-3 py-1 text-sm font-bold rounded-full">
                    {currentTimestamp}
                </span>
            </div>
            <div className="flex-1 flex flex-col gap-2">
                <div className="border-2 border-[#2d2f31] rounded-sm focus-within:border-[#a435f0]">
                    <div className="flex items-center gap-1 p-2 border-b border-[#2d2f31]">
                        <button onClick={() => execCommand('bold')} className="p-2 hover:bg-[#f7f9fa] rounded-sm" title="Bold"><Bold size={16} strokeWidth={2.5} /></button>
                        <button onClick={() => execCommand('italic')} className="p-2 hover:bg-[#f7f9fa] rounded-sm" title="Italic"><Italic size={16} strokeWidth={2.5} /></button>
                        <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-[#f7f9fa] rounded-sm" title="Bullet List"><List size={16} strokeWidth={2.5} /></button>
                        <button onClick={() => execCommand('insertOrderedList')} className="p-2 hover:bg-[#f7f9fa] rounded-sm" title="Numbered List"><ListOrdered size={16} strokeWidth={2.5} /></button>
                    </div>
                    <div
                        ref={editorRef}
                        contentEditable
                        className="p-4 min-h-[120px] outline-none text-[#2d2f31] text-sm leading-relaxed"
                    />
                </div>
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-bold text-[#2d2f31] hover:bg-[#f7f9fa] transition-colors rounded-sm">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-bold bg-[#2d2f31] text-white rounded-sm hover:bg-[#1c1d1f] transition-colors">
                        Save note
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Note Card Component ---
const NoteCard = ({ note, onDelete, onTimestampClick }: { note: Note, onDelete: (id: string) => void, onTimestampClick: (ts: number) => void }) => {
    return (
        <div className="flex gap-4 py-6 border-b border-[#d1d7dc]">
            <div className="shrink-0 mt-1">
                <button
                    onClick={() => onTimestampClick(note.timestamp)}
                    className="inline-block bg-[#2d2f31] text-white px-3 py-1 text-sm font-bold rounded-full hover:bg-[#1c1d1f] transition-colors"
                >
                    {note.timestampDisplay}
                </button>
            </div>
            <div className="flex-1 w-full overflow-hidden">
                <div className="flex justify-between items-start mb-3 gap-4">
                    <h3 className="font-bold text-base text-[#2d2f31] leading-snug">{note.lectureTitle}</h3>
                    <div className="flex gap-3 text-[#2d2f31] shrink-0">
                        <button className="hover:text-[#a435f0] transition-colors" title="Edit"><Edit2 size={16} /></button>
                        <button onClick={() => onDelete(note.id)} className="hover:text-[#a435f0] transition-colors" title="Delete"><Trash2 size={16} /></button>
                    </div>
                </div>
                <div
                    className="bg-[#f7f9fa] p-4 rounded-sm text-sm text-[#2d2f31] leading-relaxed [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                />
            </div>
        </div>
    );
};

// --- Notes List Component ---
const NotesList = ({ notes, onDelete, onTimestampClick }: { notes: Note[], onDelete: (id: string) => void, onTimestampClick: (ts: number) => void }) => {
    if (notes.length === 0) {
        return (
            <div className="py-16 text-center text-[#6a6f73]">
                <p>No notes exist yet. Create a new note to get started.</p>
            </div>
        );
    }
    return (
        <div className="flex flex-col">
            {notes.map(note => (
                <NoteCard key={note.id} note={note} onDelete={onDelete} onTimestampClick={onTimestampClick} />
            ))}
        </div>
    );
};

// --- Main Notes Container ---
const NotesContainer = () => {
    // Initial dummy data to match the UI screenshot
    const [notes, setNotes] = useState<Note[]>([
        {
            id: '1',
            timestamp: 21,
            timestampDisplay: '0:21',
            lectureTitle: '2. All The Basics (2023) 6. Placeholders in Strings',
            content: 'dcbf vnb'
        },
        {
            id: '2',
            timestamp: 0,
            timestampDisplay: '0:00',
            lectureTitle: '2. All The Basics (2023) 7. Exercises: Variables, Operators, Strings',
            content: 'ghjkl;'
        }
    ]);
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveNote = (content: string) => {
        // Strip tags to check if empty
        const temp = document.createElement('div');
        temp.innerHTML = content;
        if (!temp.textContent?.trim()) return;

        const newNote: Note = {
            id: Date.now().toString(),
            timestamp: 2,
            timestampDisplay: '0:02',
            lectureTitle: 'Current Lecture Title Placeholder', // In a real app, grab this from context/store
            content: content
        };
        setNotes([newNote, ...notes]);
        setIsEditing(false);
    };

    const handleDeleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
    };

    const handleTimestampClick = (timestamp: number) => {
        console.log(`Seek video to: ${timestamp}s`);
        // Future Integration:
        // dispatch(seekVideo(timestamp)); 
        // OR 
        // document.querySelector('video').currentTime = timestamp;
    };

    return (
        <div className="w-full max-w-[850px] mx-auto py-4 font-sans">

            {/* Editor Trigger / Editor Area */}
            {!isEditing ? (
                <div
                    onClick={() => setIsEditing(true)}
                    className="flex justify-between items-center w-full p-4 mb-8 border border-[#2d2f31] rounded-sm cursor-text hover:bg-[#f7f9fa] transition-colors"
                >
                    <span className="text-[#6a6f73] font-medium text-sm">Create a new note at 0:02</span>
                    <button className="w-6 h-6 rounded-full bg-[#2d2f31] text-white flex items-center justify-center pointer-events-none">
                        <Plus size={16} strokeWidth={3} />
                    </button>
                </div>
            ) : (
                <div className="mb-8">
                    <NotesEditor onSave={handleSaveNote} onCancel={() => setIsEditing(false)} />
                </div>
            )}

            {/* Filters Area */}
            <div className="flex gap-4 mb-6">
                <select className="border border-[#2d2f31] rounded-sm px-4 py-2 font-bold text-sm bg-white text-[#2d2f31] focus:outline-none focus:border-[#a435f0]">
                    <option>All lectures</option>
                    <option>Current lecture</option>
                </select>
                <select className="border border-[#2d2f31] rounded-sm px-4 py-2 font-bold text-sm bg-white text-[#2d2f31] focus:outline-none focus:border-[#a435f0]">
                    <option>Sort by most recent</option>
                    <option>Sort by oldest</option>
                </select>
            </div>

            {/* Notes List */}
            <NotesList notes={notes} onDelete={handleDeleteNote} onTimestampClick={handleTimestampClick} />
        </div>
    );
};

export default NotesContainer;