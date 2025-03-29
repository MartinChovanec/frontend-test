"use client";

import { MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setUsers, addUser } from "@/store/userSlice";

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
import LoginTrendChart from "@/components/users/LoginTrendChart";

// Importy dialogových komponent (předpokládáme, že máte tyto komponenty)
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";

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

type SuspiciousUser = {
    user: User;
    stats: {
        totalLogins: number;
        distinctDays: number;
        daysOver10: number;
        maxLogins: number;
        avgLogins: number;
    };
};

function UsersPage() {
    const dispatch: AppDispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await fetch("/api/users");
                const data = await response.json();
                dispatch(setUsers(data.users));
            } catch (error) {
                console.error("Chyba při načítání uživatelů:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchUsers();
    }, [dispatch]);

    // adds a new user
    const handleAddUser = (newUser: User) => {
        dispatch(addUser(newUser));
    };

    // Handler to send a form with a new user
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newUser: User = {
            id: Date.now(),
            firstName,
            lastName,
            email,
            image: "",
            lastActive: new Date().toISOString(),
            loginHistory: [],
            status: "offline",
            role: "user",
        };

        handleAddUser(newUser);
        // clean up the diadlog
        setFirstName("null");
        setLastName("");
        setEmail("");
        setIsDialogOpen(false);
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

    const allLogins: LoginHistoryEntry[] = users.flatMap((user) => user.loginHistory);

    const detectSuspiciousUsers = (users: User[]): SuspiciousUser[] => {
        const suspiciousUsers: SuspiciousUser[] = [];
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);

        users.forEach((user) => {
            const loginsLast30 = user.loginHistory.filter((login) => new Date(login.date) >= thirtyDaysAgo);
            if (loginsLast30.length === 0) return;

            const dayCounts: { [day: string]: number } = {};
            loginsLast30.forEach((login) => {
                const day = new Date(login.date).toISOString().split("T")[0];
                dayCounts[day] = (dayCounts[day] || 0) + 1;
            });

            const days = Object.keys(dayCounts);
            const totalLogins = loginsLast30.length;
            const distinctDays = days.length;
            const daysOver10 = days.filter((day) => dayCounts[day] > 10).length;
            const maxLogins = Math.max(...Object.values(dayCounts));
            const avgLogins = totalLogins / distinctDays;
            // has more than 10 logins in at least 3 days
            const condition1 = daysOver10 >= 3;
            // average 2-3 logins per day, but one day with 15+ logins
            const condition2 = avgLogins <= 3 && maxLogins >= 15;

            if (condition1 || condition2) {
                suspiciousUsers.push({
                    user,
                    stats: { totalLogins, distinctDays, daysOver10, maxLogins, avgLogins },
                });
            }
        });

        return suspiciousUsers;
    };

    const suspicious = detectSuspiciousUsers(users);

    return (
        <div>
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

            {/* Trend chart */}
            <div className="mt-10">
                <Card className="mx-auto w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Overall login trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LoginTrendChart loginHistory={allLogins} />
                    </CardContent>
                </Card>
            </div>

            {/* Suspicious users */}
            <div className="mt-10">
                <Card className="mx-auto w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">List of suspicious users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {suspicious.length === 0 ? (
                            <p>No suspicious user</p>
                        ) : (
                            <div className="space-y-4">
                                {suspicious.map(({ user, stats }) => (
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
                                                    Last active: {new Date(user.lastActive).toLocaleString()}
                                                    <br />
                                                    Total logins (30d): {stats.totalLogins}
                                                    <br />
                                                    Days with more than 10 logs: {Math.round(stats.daysOver10)}
                                                    <br />
                                                    Average logs: {Math.round(stats.avgLogins)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Badge variant="destructive">Suspicious</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Last Active Users */}
            <div className="mt-10">
                <Card className="mx-auto w-full max-w-4xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">List of last 5 logged-in users</CardTitle>
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
                            <div>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
                                            Add a user
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add a user</DialogTitle>
                                            <DialogDescription>Fill up the form</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleFormSubmit} className="space-y-4">
                                            <Input
                                                placeholder="Name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                required
                                            />
                                            <Input
                                                placeholder="Surname"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                required
                                            />
                                            <Input
                                                placeholder="Email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <DialogFooter>
                                                <Button type="submit">Create</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
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
