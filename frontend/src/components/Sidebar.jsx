import { NavLink } from 'react-router-dom'
import { MessageCircle, BarChart2, BookOpen, Heart } from 'lucide-react'

const NAV = [
  { to: '/',          icon: MessageCircle, label: 'Chat'      },
  { to: '/dashboard', icon: BarChart2,     label: 'Mood Tracker' },
  { to: '/journal',   icon: BookOpen,      label: 'Journal'   },
]

export default function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center text-white text-sm">
            🤖
          </div>
          <div>
            <p className="font-bold text-slate-800 leading-none">MindEase</p>
            <p className="text-xs text-slate-400 mt-0.5">Wellness Companion</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
               ${isActive
                 ? 'bg-primary-50 text-primary-700'
                 : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
               }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
