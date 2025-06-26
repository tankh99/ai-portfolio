'use client'

import React, { useState, useEffect } from 'react';

export default function AdminPage() {
    const [rawDetails, setRawDetails] = useState('');
    const [isReformatting, setIsReformatting] = useState(false);
    const [resumePoint, setResumePoint] = useState('');
    const [previousRaw, setPreviousRaw] = useState('');
    const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input');
    const [error, setError] = useState('');

    // Entries state
    const [entries, setEntries] = useState<{ id: string; content: string; createdAt?: number }[]>([]);
    const [isLoadingEntries, setIsLoadingEntries] = useState(false);
    const [entriesError, setEntriesError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);

    // Fetch entries on mount
    useEffect(() => {
        async function fetchEntries() {
            setIsLoadingEntries(true);
            setEntriesError('');
            try {
                const resp = await fetch('/api/vector-admin');
                if (!resp.ok) throw new Error('Failed to fetch entries');
                const data = await resp.json();
                setEntries(Array.isArray(data.entries) ? data.entries : []);
            } catch (e: any) {
                setEntriesError(e.message || 'Failed to fetch entries');
            } finally {
                setIsLoadingEntries(false);
            }
        }
        fetchEntries();
    }, [step]); // refetch after adding/editing/deleting

    // Call server-side API to reformat
    async function reformatWithLLM(raw: string) {
        setIsReformatting(true);
        setError('');
        try {
            const response = await fetch('/api/vector-admin/reformat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ raw })
            });
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || 'LLM API error: ' + response.status);
            }
            const data = await response.json();
            if (!data.resumePoint) throw new Error('No result from LLM');
            setResumePoint(data.resumePoint);
            setPreviousRaw(raw);
            setStep('confirm');
        } catch (e: any) {
            setError(e.message || 'Failed to reformat.');
        } finally {
            setIsReformatting(false);
        }
    }

    // Handle form submit (add or edit)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rawDetails.trim()) {
            setError('Please enter details.');
            return;
        }
        await reformatWithLLM(rawDetails.trim());
    };

    // Confirm and send to backend (add or edit)
    const handleConfirm = async () => {
        setError('');
        try {
            let resp;
            if (editingId) {
                // Edit mode: update entry
                resp = await fetch('/api/vector-admin', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingId, content: resumePoint })
                });
            } else {
                // Add mode: create entry
                resp = await fetch('/api/vector-admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: resumePoint })
                });
            }
            if (!resp.ok) throw new Error('Failed to save entry.');
            setStep('done');
            setRawDetails('');
            setResumePoint('');
            setPreviousRaw('');
            setEditingId(null);
        } catch (e: any) {
            setError(e.message || 'Failed to save.');
        }
    };

    // Reset for new entry
    const handleNewEntry = () => {
        setStep('input');
        setRawDetails('');
        setResumePoint('');
        setPreviousRaw('');
        setEditingId(null);
        setError('');
    };

    // Edit entry
    const handleEdit = (entry: { id: string; content: string }) => {
        setEditingId(entry.id);
        setRawDetails(entry.content);
        setResumePoint(entry.content);
        setPreviousRaw(entry.content);
        setStep('confirm');
        setError('');
    };

    // Delete entry
    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;
        setError('');
        try {
            const resp = await fetch('/api/vector-admin', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            if (!resp.ok) throw new Error('Failed to delete entry.');
            setEntries(prev => prev.filter(entry => entry.id !== id)); // Remove from UI immediately
        } catch (e: any) {
            setError(e.message || 'Failed to delete.');
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Vector Database Admin</h1>
            <div className="flex gap-8">
                {/* Left: Input form */}
                <div className="w-1/2 bg-neutral-900 rounded p-6 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Entry' : 'Add New Entry'}</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="block mb-1">Raw Details</label>
                        <textarea
                            className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-2"
                            rows={5}
                            value={rawDetails}
                            onChange={e => setRawDetails(e.target.value)}
                            placeholder="Describe the project or experience..."
                            disabled={isReformatting || step === 'confirm'}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                            disabled={isReformatting || step === 'confirm'}
                        >
                            {isReformatting ? 'Reformatting...' : (editingId ? 'Reformat & Preview Edit' : 'Reformat & Preview')}
                        </button>
                        {step === 'done' && (
                            <button
                                type="button"
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                                onClick={handleNewEntry}
                            >
                                Add Another Entry
                            </button>
                        )}
                        {error && <p className="text-red-400 mt-2">{error}</p>}
                    </form>
                </div>
                {/* Right: Preview and confirmation, always visible with placeholders */}
                <div className="w-1/2 flex flex-col gap-6">
                    {/* Previous raw input placeholder */}
                    <div className="bg-neutral-900 rounded p-4 min-h-[100px]">
                        <h3 className="text-lg font-semibold mb-2">Previous Raw Input</h3>
                        {previousRaw ? (
                            <pre className="whitespace-pre-wrap text-neutral-300">{previousRaw}</pre>
                        ) : (
                            <p className="text-neutral-500 italic">No previous input yet.</p>
                        )}
                    </div>
                    {/* Resume-style point placeholder and confirmation */}
                    <div className="bg-neutral-900 rounded p-4 min-h-[100px]">
                        <h3 className="text-lg font-semibold mb-2">Resume-style Point (edit if needed)</h3>
                        <textarea
                            className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-4"
                            rows={3}
                            value={resumePoint}
                            onChange={e => setResumePoint(e.target.value)}
                            placeholder="Reformatted resume point will appear here..."
                            disabled={!resumePoint}
                        />
                        {resumePoint && (
                            <>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mr-2"
                                    onClick={handleConfirm}
                                >
                                    {editingId ? 'Confirm Edit' : 'Confirm & Save'}
                                </button>
                                <button
                                    className="bg-neutral-700 hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded"
                                    onClick={handleNewEntry}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                        {step === 'done' && !resumePoint && (
                            <p className="text-green-400 mb-2">Entry saved to vector database!</p>
                        )}
                    </div>
                </div>
            </div>
            {/* Entries list */}
            <div className="bg-neutral-900 rounded p-4 min-h-[200px] mt-8">
                <h2 className="text-xl font-semibold mb-4">Entries</h2>
                {isLoadingEntries ? (
                    <p className="text-neutral-400">Loading entries...</p>
                ) : entriesError ? (
                    <p className="text-red-400">{entriesError}</p>
                ) : entries.length === 0 ? (
                    <p className="text-neutral-400">No entries yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {entries.map(entry => (
                            <li key={entry.id} className="border-b border-neutral-800 pb-2 flex justify-between items-center">
                                <div>
                                    <div className="text-neutral-300 text-sm mb-1">ID: {entry.id}</div>
                                    <div className="text-neutral-100 whitespace-pre-wrap">{entry.content}</div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-1 px-3 rounded"
                                        onClick={() => handleEdit(entry)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded"
                                        onClick={() => handleDelete(entry.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
