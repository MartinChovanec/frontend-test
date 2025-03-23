import { MoreHorizontal, Search } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

type LoginHistory = {
  id: number;
  date: Date;
  device: string;
  browser: string;
  ip: string;
};

type User = {
  id: number;
  name: string;
  email: string;
  lastActive: Date;
  status: string;
  role: string;
  avatar: string;
  loginHistory: LoginHistory[];
};

// THIS IS ONLY AN EXAMPLE DATA. USE API FROM ASSIGMENT

// Mock data for active users
const activeUsers: User[] = [
  {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    status: 'online',
    role: 'Admin',
    loginHistory: [],
  },
  {
    id: 2,
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    status: 'online',
    role: 'Editor',
    loginHistory: [],
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
    status: 'online',
    role: 'User',
    loginHistory: [],
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    status: 'away',
    role: 'User',
    loginHistory: [],
  },
  {
    id: 5,
    name: 'David Miller',
    email: 'david.miller@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    status: 'away',
    role: 'Editor',
    loginHistory: [],
  },
  {
    id: 6,
    name: 'Jessica Wilson',
    email: 'jessica.wilson@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'offline',
    role: 'User',
    loginHistory: [],
  },
  {
    id: 7,
    name: 'Robert Taylor',
    email: 'robert.taylor@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    status: 'offline',
    role: 'User',
    loginHistory: [],
  },
  {
    id: 8,
    name: 'Jennifer Anderson',
    email: 'jennifer.anderson@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    status: 'offline',
    role: 'Admin',
    loginHistory: [],
  },
  {
    id: 9,
    name: 'Thomas Martinez',
    email: 'thomas.martinez@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    status: 'offline',
    role: 'User',
    loginHistory: [],
  },
  {
    id: 10,
    name: 'Lisa Robinson',
    email: 'lisa.robinson@example.com',
    avatar: '/placeholder.svg?height=40&width=40',
    lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    status: 'offline',
    role: 'Editor',
    loginHistory: [],
  },
];

function UsersPage() {
  return (
    <div>
      <h1>Users analytics</h1>
      <div className={'mx-auto my-7 flex max-w-4xl gap-4'}>
        <Card>
          <CardTitle className={'mx-auto'}>
            <p className="text-lg font-semibold">Total Users</p>
          </CardTitle>
          <CardContent className={'mx-auto'}>
            <p className="text-2xl font-bold">1,234</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Updated xx minutes ago</p>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className={'mx-auto'}>
              <p className="text-lg font-semibold">New Users</p>
            </CardTitle>
          </CardHeader>
          <CardContent className={'mx-auto'}>
            <p className="text-2xl font-bold">56</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Updated xx minutes ago</p>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className={'mx-auto'}>
              <p className="text-lg font-semibold">Total login past 30 days</p>
            </CardTitle>
          </CardHeader>
          <CardContent className={'mx-auto'}>
            <p className="text-2xl font-bold">10 000</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-gray-500">Updated xx minutes ago</p>
          </CardFooter>
        </Card>
      </div>
      <div>
        <Card className="mx-auto w-full max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl">Active Users</CardTitle>
            <CardDescription>
              View the last 10 active users in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search users by name, email or role..."
                className="pl-10"
              />
            </div>
            <div className="space-y-4">
              {activeUsers.map((user) => (
                <div
                  key={user.id}
                  className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div>
                      <Link
                        href={`/users/${user.id}`}
                        className="text-primary font-medium hover:underline"
                      >
                        {user.name}
                      </Link>
                      <div className="text-muted-foreground text-sm">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden flex-col items-end md:flex">
                      <Badge
                        variant={
                          user.status === 'online'
                            ? 'default'
                            : user.status === 'away'
                              ? 'destructive'
                              : 'secondary'
                        }
                        className="mb-1"
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="hidden md:inline-flex">
                      {user.role}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link
                            href={`/users/${user.id}`}
                            className="flex w-full"
                          >
                            View profile
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UsersPage;
