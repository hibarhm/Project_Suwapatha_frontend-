'use client';
import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';

interface LaboratorySidebarProps {
  sidebarOpen: boolean;
  onLogout: () => void;
}

export default function LaboratorySidebar({ sidebarOpen, onLogout }: LaboratorySidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('sidebar');
  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      name: t('dashboard'),
      path: '/laboratory/dashboard',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.282a2 2 0 01-1.806 0l-.628-.282a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547m0 0l-1.1 1.223a2 2 0 00.464 3.152l3.573 1.637a2 2 0 001.582 0l3.573-1.637a2 2 0 00.464-3.152l-1.1-1.223m1.1 1.223a2 2 0 011.022-.547l2.387-.477a6 6 0 013.86.517l.628.282a2 2 0 001.806 0l.628-.282a6 6 0 013.86-.517l2.387.477a2 2 0 011.022.547" />
        </svg>
      )
    },
    {
      name: t('settings'),
      path: '/laboratory/settings',
      icon: (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-hidden`}
    >
      <div className="p-6 border-b border-gray-200">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-[#94B4C1] rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.628.282a2 2 0 01-1.806 0l-.628-.282a6 6 0 00-3.86-.517l-2.387.477a2 2 0 00-1.022.547" />
              </svg>
            </div>
            <span className="text-lg font-bold text-[#94B4C1] whitespace-nowrap">Suwapatha</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <button
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item.path)
                  ? 'bg-[#94B4C1] text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#94B4C1]'
                }`}
            >
              {item.icon}
              <span className="whitespace-nowrap">{item.name}</span>
            </button>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="whitespace-nowrap">{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
