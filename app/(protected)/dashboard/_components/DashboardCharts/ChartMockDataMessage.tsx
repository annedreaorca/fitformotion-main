import Link from 'next/link';

export default function ChartMockDataMessage() {
    return (
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <Link href="/workout">
                <div className="bg-zinc-200/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-xl px-6 py-3 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    Start a workout to see your progress.
                </div>
            </Link>
        </div>
    );
}