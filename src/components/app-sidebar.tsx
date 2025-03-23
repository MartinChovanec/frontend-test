'use client'

import { Home, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { STATIC_PAGES } from '@/constants/static-pages';

// Menu items.
const items = [
  {
    title: 'Home',
    url: STATIC_PAGES.home,
    icon: Home,
  },
  {
    title: 'Users',
    url: STATIC_PAGES.users,
    icon: UserIcon,
  },
];

export function AppSidebar() {
  const { user } = useAuth()

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        {/* Profil uživatele */}
        {user && (
          <div className="mb-6 p-4 border-b border-gray-700">
            <h3 className="font-medium">{user.name}</h3>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
