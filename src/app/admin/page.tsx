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
    const [entries, setEntries] = useState<{ id: string; content: string }[]>([]);
    const [isLoadingEntries, setIsLoadingEntries] = useState(false);
    const [entriesError, setEntriesError] = useState('');

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
    }, [step]); // refetch after adding

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

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rawDetails.trim()) {
            setError('Please enter details.');
            return;
        }
        await reformatWithLLM(rawDetails.trim());
    };

    // Confirm and send to backend
    const handleConfirm = async () => {
        setError('');
        try {
            const resp = await fetch('/api/vector-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: resumePoint })
            });
            if (!resp.ok) throw new Error('Failed to save entry.');
            setStep('done');
            setRawDetails('');
            setResumePoint('');
            setPreviousRaw('');
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
        setError('');
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100 p-8">
            <h1 className="text-3xl font-bold mb-6">Vector Database Admin</h1>
            <div className="flex gap-8">
                {/* Left: Input form */}
                <div className="w-1/2 bg-neutral-900 rounded p-6 flex flex-col">
                    <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
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
                            {isReformatting ? 'Reformatting...' : 'Reformat & Preview'}
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
                {/* Right: Preview and confirmation */}
                <div className="w-1/2 flex flex-col gap-6">
                    {/* Previous raw input */}
                    {previousRaw && (
                        <div className="bg-neutral-900 rounded p-4">
                            <h3 className="text-lg font-semibold mb-2">Previous Raw Input</h3>
                            <pre className="whitespace-pre-wrap text-neutral-300">{previousRaw}</pre>
                        </div>
                    )}
                    {/* Reformatted preview and confirmation */}
                    {step === 'confirm' && (
                        <div className="bg-neutral-900 rounded p-4">
                            <h3 className="text-lg font-semibold mb-2">Resume-style Point (edit if needed)</h3>
                            <textarea
                                className="w-full p-2 rounded bg-neutral-800 text-white border border-neutral-700 mb-4"
                                rows={3}
                                value={resumePoint}
                                onChange={e => setResumePoint(e.target.value)}
                            />
                            <button
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded mr-2"
                                onClick={handleConfirm}
                            >
                                Confirm & Save
                            </button>
                            <button
                                className="bg-neutral-700 hover:bg-neutral-800 text-white font-semibold py-2 px-4 rounded"
                                onClick={handleNewEntry}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    {step === 'done' && (
                        <div className="bg-neutral-900 rounded p-4">
                            <p className="text-green-400 mb-2">Entry saved to vector database!</p>
                        </div>
                    )}
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
                            <li key={entry.id} className="border-b border-neutral-800 pb-2">
                                <div className="text-neutral-300 text-sm mb-1">ID: {entry.id}</div>
                                <div className="text-neutral-100 whitespace-pre-wrap">{entry.content}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
