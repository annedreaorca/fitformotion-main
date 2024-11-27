// import Link from 'next/link';

// export default function ChartMockDataMessage() {
//     return (
//         <div className="absolute left-0 top-0 right-0 bottom-20 z-50">
//             <div className="flex items-center justify-center w-full h-full">
//                 <Link href="/workout"> {/* Change the href to the desired page */}
//                     <div className="bg-zinc-200/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-xl px-6 py-3 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
//                         Start a workout to see your progress.
//                     </div>
//                 </Link>
//             </div>
//         </div>
//     );
// }

export default function ChartMockDataMessage() {
    return (
        <div className="absolute left-0 top-0 right-0 bottom-20 z-50">
            <div className="flex items-center justify-center w-full h-full">
            <div className="bg-zinc-200/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-xl px-6 py-3 text-sm text-zinc-700 dark:text-zinc-300">
                Start a workout to see your progress.
            </div>
            </div>
        </div>
    )
}