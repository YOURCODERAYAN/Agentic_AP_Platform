
import { Bell } from 'lucide-react'
import { SunMoon } from 'lucide-react'
import { CircleUserRound } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useLiveStatusStore } from '../store/LiveStore'
import {useTheme} from '../components/ThemeProvider'
import { useState } from 'react';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../queries/useNotification';

export default function Home() {
    const { theme, setTheme } = useTheme();

    const { data: notifications } = useNotifications();
const { mutate: markRead } = useMarkNotificationRead();
const { mutate: markAllRead } = useMarkAllNotificationsRead();
const [showNotifDrawer, setShowNotifDrawer] = useState(false);


const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;
 
  const queryClient = useQueryClient()
  const isLive = useLiveStatusStore((s) => s.isLive)
  const startSimulation = useLiveStatusStore((s) => s.startSimulation)
  const stopSimulation = useLiveStatusStore((s) => s.stopSimulation)

  

  function handleToggle(checked: boolean) {
    if (checked) startSimulation(queryClient)
    else stopSimulation()
  }

  return (
    <div className="h-screen bg-white text-black dark:bg-slate-950 dark:text-slate-200">
      <div className="bg-white border-b border-gray-300 sticky top-0 z-10 w-full flex justify-between items-center dark:bg-slate-950/90" style={{ height: '8%' }}>
        <div className="text-slate-900 dark:text-slate-200 font-extralight text-xl flex gap-2 items-center ml-2">
          <span className="text-amber-300 text-xl font-semibold">Agentic Ap </span> Control Tower
          <span className="ml-7">
            <input
              type="text"
              placeholder="Search Here"
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </span>
        </div>

        <div className="flex items-center gap-6 mr-10">
          <span className="cursor-pointer hover:bg-black/20 p-4 rounded-full" onClick={()=> setShowNotifDrawer(true)}>
            <Bell />
            {unreadCount > 0 && (
    <span className="absolute top-1 right-53 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
      {unreadCount}
    </span>
  )}
          </span>

          <span className="cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700/70 p-4 rounded-full"  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <SunMoon />
          </span>

          <span className="cursor-pointer hover:bg-black/20 p-4 rounded-full">
            <CircleUserRound />
          </span>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-4rem)] bg-white  text-black dark:bg-slate-950 dark:text-slate-200">
        <aside className="w-56 shrink-0 border-r border-slate-300 bg-slate-100 p-4 text-slate-900 shadow-inner dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-left text-sm ${isActive ? 'border-l-4 border-blue-400 bg-slate-200/70 dark:bg-slate-800/70' : 'bg-transparent'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/inbox"
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-left text-sm ${isActive ? 'border-l-4 border-blue-400 bg-slate-200/70 dark:bg-slate-800/70' : 'bg-transparent'}`
              }
            >
              Inbox/Queue
            </NavLink>
            <NavLink
              to="/AIWorkbench"
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-left text-sm ${isActive ? 'border-l-4 border-blue-400 bg-slate-200/70 dark:bg-slate-800/70' : 'bg-transparent'}`
              }
            >
              AIWorkbench
            </NavLink>
            <NavLink
              to="/Matching"
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-left text-sm ${isActive ? 'border-l-4 border-blue-400 bg-slate-200/70 dark:bg-slate-800/70' : 'bg-transparent'}`
              }
            >
              Matching
            </NavLink>
            <NavLink
              to="/Exception"
              className={({ isActive }) =>
                `rounded-md px-4 py-2 text-left text-sm ${isActive ? 'border-l-4 border-blue-400 bg-slate-200/70 dark:bg-slate-800/70' : 'bg-transparent'}`
              }
            >
              Exceptions
            </NavLink>
          </div>

          <label className="flex items-center gap-2  cursor-pointer text-md text-semibold  text-gray-400 font-serif mt-4">
            <input type="checkbox" checked={isLive} onChange={(e) => handleToggle(e.target.checked)} />
            Simulate live status
          </label>
        </aside>
        {showNotifDrawer && (
  <div className="fixed inset-0 z-50" onClick={() => setShowNotifDrawer(false)}>
    <div
      className="absolute top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 shadow-xl p-4 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Activity</h3>
        <div className="flex gap-2">
          <button onClick={() => markAllRead()} className="text-xs text-indigo-500 cursor-pointer">
            Mark all read
          </button>
          <button onClick={() => setShowNotifDrawer(false)} className="text-xs text-gray-400">✕</button>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        {notifications?.map((n:any) => (
          <div
            key={n.id}
            onClick={() => !n.isRead && markRead(n.id)}
            className={`p-2 rounded border text-xs cursor-pointer ${
              n.isRead
                ? 'border-gray-100 dark:border-slate-800 text-gray-500'
                : 'border-indigo-100 bg-indigo-50 dark:bg-slate-800 dark:border-slate-700'
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
