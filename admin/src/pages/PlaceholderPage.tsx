import React from 'react';
import { Hammer } from 'lucide-react';

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-96 text-center space-y-4">
            <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                <Hammer size={32} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                <p className="text-slate-500">This module is part of the Enterprise Rebuild roadmap and will be implemented next.</p>
            </div>
        </div>
    );
}
