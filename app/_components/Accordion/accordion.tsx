'use client'

import { useEffect, useState } from 'react'

type AccordionpProps = {
    children: React.ReactNode
    title: string
    id: string,
    active?: boolean
}

export default function Accordion({
    children,
    title,
    id,
    active = false
}: AccordionpProps) {

    const [accordionOpen, setAccordionOpen] = useState<boolean>(false)

    useEffect(() => {
        setAccordionOpen(active);
    }, [active]); 

    return (
        <div className="py-2">
            <h2>
                <button
                className="flex items-center justify-between w-full text-left font-semibold py-[15px]"
                onClick={(e) => { e.preventDefault(); setAccordionOpen(!accordionOpen); }}
                aria-expanded={accordionOpen}
                aria-controls={`accordion-text-${id}`}
                >
                    <span className={`font-[400] ${accordionOpen ? 'text-white' : 'text-zinc-500'}`}>
                        {title}
                    </span>
                    <svg
                        className={`shrink-0 ml-8 transition-transform duration-200 ease-out ${accordionOpen ? 'rotate-180 text-white' : 'text-zinc-500'}`}
                        width="16"
                        height="16"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M4 8l8 8 8-8" /> {/* Chevron shape */}
                    </svg>
                </button>
            </h2>
            <div
                id={`accordion-text-${id}`}
                role="region"
                aria-labelledby={`accordion-title-${id}`}
                className={`grid text-sm text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${accordionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
            >
                <div className="overflow-hidden">
                <p className="pb-3 mr-8">
                    {children}
                </p>
                </div>
            </div>
        </div>
    )
}