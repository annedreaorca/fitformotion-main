'use client'

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function HeaderLinks() {
  const pathname = usePathname()

  return (
    <nav className='flex gap-[20px] items-center'>
        <ul className='flex gap-[20px] nav-links'>
            <li className='nav-link'>
                <Link
                    className={`link ${pathname === '/' ? 'active' : ''}`} 
                    href="/"
                >
                    Home
                </Link>
            </li>
            <li className='nav-link'>
                <Link
                    className={`link ${pathname === '/' ? 'active' : ''}`} 
                    href="../../Features"
                >
                    Features
                </Link>
            </li>
            <li className='nav-link'>
                <Link
                    className={`link ${pathname === '/about-us' ? 'active' : ''}`} 
                    href="../../AboutUs"
                >
                    About
                </Link>
            </li>
            <li className='nav-link'>
                <Link
                    className={`link ${pathname === '/contact-us' ? 'active' : ''}`} 
                    href="../../ContactUs"
                >
                    Contact
                </Link>
            </li>
            <li className='nav-link'>
                <Link
                    className={`link ${pathname === '/website/faq' ? 'active' : ''}`} 
                    href="../../Faq"
                >
                    FAQ
                </Link>
            </li>
        </ul>
    </nav>
  )
}
