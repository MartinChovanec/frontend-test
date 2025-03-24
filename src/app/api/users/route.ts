import { NextResponse } from "next/server";

function getRandomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateLoginHistory() {
    const startDate = new Date("2025-01-01");
    const endDate = new Date("2025-03-23");

    return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        date: getRandomDate(startDate, endDate).toISOString(),
        device: ["desktop", "mobile", "tablet"][Math.floor(Math.random() * 3)],
        browser: ["Chrome", "Safari", "Firefox", "Edge"][Math.floor(Math.random() * 4)],
        ip: "11234.543",
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Seřadí od nejnovějšího
}

export async function GET() {
    try {
        const response = await fetch("https://dummyjson.com/users");
        const data = await response.json();

        const lastActiveStart = new Date("2025-02-01");
        const lastActiveEnd = new Date("2025-03-23");

        const enrichedUsers = data.users.map((user: any) => ({
            ...user,
            status: Math.random() > 0.5 ? "online" : "away",
            role: Math.random() > 0.8 ? "Admin" : "User",
            lastActive: getRandomDate(lastActiveStart, lastActiveEnd).toISOString(),
            loginHistory: generateLoginHistory(),
        }));

        return NextResponse.json({ users: enrichedUsers });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
