'use client';

import type React from 'react';

import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { X, ArrowUpCircle, Maximize2, Minimize2, Terminal as TerminalIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface TerminalProps {
    callbackId: string;
    host: string;
    isVisible: boolean;
    onClose: () => void;
}

interface HistoryItem {
    id: number;
    output_id: number | null;
    owner: 'operator' | 'bot';
    timestamp: string;
    payload: string;
    cwd: string;
}

export function Terminal({ callbackId, host, isVisible, onClose }: TerminalProps) {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [command, setCommand] = useState('');
    const [loading, setLoading] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);
    const [currentCwd, setCurrentCwd] = useState('C:\\Windows\\system32');
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible) {
            void fetchHistory();
        }
    }, [isVisible, callbackId]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    useEffect(() => {
        // Update current working directory based on the latest history item
        if (history.length > 0) {
            const lastItem = history[history.length - 1];
            if (lastItem?.cwd) {
                setCurrentCwd(lastItem.cwd);
            }
        }
    }, [history]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/bots/history?callbackId=${callbackId}`);
            const data = (await response.json()) as HistoryItem[];
            setHistory(data);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!command.trim()) return;

        // Clear the input field
        setCommand('');
    };

    if (!isVisible) return null;

    return (
        <div
            className={`flex flex-col rounded-md border border-zinc-800 bg-zinc-950/80 backdrop-blur-sm ${isMaximized ? 'h-[calc(100vh-160px)]' : 'h-[calc(100vh-480px)]'} min-h-[300px] overflow-hidden transition-all duration-200 shadow-lg shadow-black/20 relative`}
        >
            <div className="absolute inset-0 bg-linear-to-b from-zinc-900/40 to-black/30 pointer-events-none"></div>

            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 backdrop-blur-sm px-4 py-2 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-green-950/60 shadow-inner shadow-green-900/20">
                        <TerminalIcon className="h-3.5 w-3.5 text-green-500" />
                    </div>
                    <span className="font-mono text-sm text-green-400 font-semibold">
                        {callbackId} @ {host}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMaximized(!isMaximized)}
                        className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    >
                        {isMaximized ? (
                            <Minimize2 className="h-4 w-4" />
                        ) : (
                            <Maximize2 className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div
                ref={terminalRef}
                className="flex-1 overflow-y-auto bg-black/80 p-4 font-mono text-sm text-green-400 relative z-10"
            >
                {loading ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="animate-pulse flex space-x-1 mb-2">
                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                <div className="h-2 w-2 bg-green-500 rounded-full delay-100"></div>
                                <div className="h-2 w-2 bg-green-500 rounded-full delay-200"></div>
                            </div>
                            <span className="text-zinc-500">Loading terminal history...</span>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {Array.isArray(history) &&
                            history.map(item => {
                                if (item.owner === 'operator') {
                                    return (
                                        <div key={item.id} className="pt-1 text-white group">
                                            <span className="text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                                {item.cwd}&gt;{' '}
                                            </span>
                                            <span className=" transition-colors">
                                                {item.payload}
                                            </span>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div
                                            key={item.id}
                                            className="whitespace-pre-wrap pl-6  transition-colors"
                                        >
                                            {item.payload}
                                        </div>
                                    );
                                }
                            })}
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="border-t border-zinc-800 bg-black/90 backdrop-blur-sm p-2 relative z-10"
            >
                <div className="flex items-center">
                    <span className="mr-2 font-mono text-sm text-zinc-500">{currentCwd}&gt;</span>
                    <Input
                        value={command}
                        onChange={e => setCommand(e.target.value)}
                        className="flex-1 border-none bg-transparent font-mono text-sm text-white focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Type command..."
                        autoFocus
                    />
                    <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="ml-2 h-8 w-8 text-zinc-400 hover:bg-green-950/50 hover:text-green-500 transition-colors"
                    >
                        <ArrowUpCircle className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    );
}
