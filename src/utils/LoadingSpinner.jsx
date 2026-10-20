import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ value, message }) => {
    if (!value) return null;

    return (
        <div className="glass-panel bg-surface/30 border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm">{message ? message : 'processing...'}</p>
        </div>
    );
};