"use client";

import { MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AddUserDialog } from "@/components/users/AddUserDialog";

type LoginHistoryEntry = {
    id: number;
    date: string;
    device: string;
    browser: string;
    ip: string;
};

type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    lastLoginDate?: Date;
    status?: string;
    role?: string;
    lastActive: string;
    loginHistory: LoginHistoryEntry[];
};

function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                setUsers(data.users);
            } catch (error) {
                console.error("Chyba při načítání uživatelů:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUsers();
    }, []);

    const handleAddUser = (newUser: User) => {
        setUsers((prevUsers) => [newUser, ...prevUsers]);
    };

    if (isLoading) {
        return <div>Načítání...</div>;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const totalLogins = users.reduce((total, user) => {
        const userLogins = user.loginHistory.filter((login) => {
            const loginDate = new Date(login.date);
            return loginDate >= thirtyDaysAgo;
        }).length;
        return total + userLogins;
    }, 0);

    const lastActiveUsers = [...users]
        .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
        .slice(0, 5);

    return (
        <div>
            <h1>Users analytics</h1>
            <div className={"mx-auto my-7 flex max-w-4xl gap-4"}>
                <Card>
                    <CardTitle className={"mx-auto"}>
                        <p className="text-lg font-semibold">Total Users</p>
                    </CardTitle>
                    <CardContent className={"mx-auto"}>
                        <p className="text-2xl font-bold">{users.length}</p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-500">Updated xx minutes ago</p>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className={"mx-auto"}>
                            <p className="text-lg font-semibold">New Users</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={"mx-auto"}>
                        <p className="text-2xl font-bold">56</p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-500">Updated xx minutes ago</p>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className={"mx-auto"}>
                            <p className="text-lg font-semibold">Total login past 30 days</p>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={"mx-auto"}>
                        <p className="text-2xl font-bold">{totalLogins}</p>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-gray-500">Updated xx minutes ago</p>
                    </CardFooter>
                </Card>
            </div>

            {/* Last Active Users */}
            <div className="mt-10">
                <Card className="mx-auto w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">List of last logged-in users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {lastActiveUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.image}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <div>
                                            <Link
                                                href={`/users/${user.id}`}
                                                className="text-primary font-medium hover:underline"
                                            >
                                                {user.firstName} {user.lastName}
                                            </Link>
                                            <div className="text-muted-foreground text-sm">
                                                Poslední aktivita: {new Date(user.lastActive).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden flex-col items-end md:flex">
                                            <Badge
                                                variant={user.status === "online" ? "default" : "destructive"}
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
                                                    <Link href={`/users/${user.id}`} className="flex w-full">
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
            {/* Active Users */}
            <div>
                <Card className="mx-auto w-full max-w-4xl">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-2xl">Active Users</CardTitle>
                                <CardDescription>View all users in the system</CardDescription>
                            </div>
                            <AddUserDialog onAddUser={handleAddUser} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-6">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                            <Input placeholder="Search users by name, email or role..." className="pl-10" />
                        </div>
                        <div className="space-y-4">
                            {users.map((user) => (
                                <div
                                    key={user.id}
                                    className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user.image}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <div>
                                            <Link
                                                href={`/users/${user.id}`}
                                                className="text-primary font-medium hover:underline"
                                            >
                                                {user.firstName} {user.lastName}
                                            </Link>
                                            <div className="text-muted-foreground text-sm">{user.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden flex-col items-end md:flex">
                                            <Badge
                                                variant={user.status === "online" ? "default" : "destructive"}
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
                                                    <Link href={`/users/${user.id}`} className="flex w-full">
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
