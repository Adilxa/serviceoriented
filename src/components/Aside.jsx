"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AsideNavigation = () => {

    const pathname = usePathname()

    return (
        <aside className="w-64 h-screen p-4 bg-gray-100">
            <nav>
                <ul className="space-y-4">
                    <li>
                        <Link href="/carrent" className={`block p-2 rounded ${pathname === '/carrent' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            Car
                        </Link>
                    </li>
                    {/* <li>
                        <Link href="/carrentalusers" className={`block p-2 rounded ${pathname === '/carrentalusers' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            Car rental users
                        </Link>
                    </li> */}
                    <li>
                        <Link href="/customer" className={`block p-2 rounded ${pathname === '/customer' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            Customer
                        </Link>
                    </li>
                    <li>
                        <Link href="/rooms" className={`block p-2 rounded ${pathname === '/rooms' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            Rooms
                        </Link>
                    </li>
                    <li>
                        <Link href="/tickets" className={`block p-2 rounded ${pathname === '/tickets' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                            Tickets
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default AsideNavigation;
