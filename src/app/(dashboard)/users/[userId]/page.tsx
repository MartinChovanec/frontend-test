import { CalendarDays, Clock, Monitor, Smartphone, Tablet } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

export default function UserDetailPage() {
  // Mock data - in a real app, this would come from your API or database
  const user: User = {
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    status: 'online',
    lastActive: new Date(),
    avatar: '/placeholder.svg?height=40&width=40',
    loginHistory: [],
    role: 'Admin',
  };

  // Helper function to format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Helper function to format time
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  // Helper function to get device icon
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <div className="mt-2 flex items-center space-x-2">
                  <Badge
                    variant={user.status === 'online' ? 'success' : 'secondary'}
                    className="px-2 py-1"
                  >
                    {user.status === 'online' ? 'Active' : 'Inactive'}
                  </Badge>
                  {user.status !== 'online' && (
                    <span className="text-muted-foreground flex items-center text-sm">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatTime(user.lastActive)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-muted-foreground flex items-center space-x-2 text-sm">
              <CalendarDays className="h-4 w-4" />
              <span>Member since {formatDate(new Date(2023, 5, 10))}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-medium">Login Statistics</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="border p-4">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">
                    Past 72 hours
                  </span>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-3xl font-bold">0</span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      logins
                    </span>
                  </div>
                </div>
              </Card>
              <Card className="border p-4">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-sm">
                    Past 30 days
                  </span>
                  <div className="mt-1 flex items-baseline">
                    <span className="text-3xl font-bold">0</span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      logins
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Login History</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead className="hidden md:table-cell">
                      IP Address
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.loginHistory.map((login) => (
                    <TableRow key={login.id}>
                      <TableCell>{formatDate(login.date)}</TableCell>
                      <TableCell>{formatTime(login.date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(login.device)}
                          <span className="hidden capitalize sm:inline">
                            {login.device}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{login.browser}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {login.ip}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
