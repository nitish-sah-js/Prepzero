import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-guard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, Briefcase, ClipboardList, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const session = await getSession();
  const user = session!.user as { name: string };
  const firstName = user.name.split(" ")[0];

  const [collegeCount, userCount, driveCount, testCount] = await Promise.all([
    prisma.college.count(),
    prisma.user.count(),
    prisma.placementDrive.count(),
    prisma.test.count(),
  ]);

  const stats = [
    {
      title: "Total Colleges",
      value: collegeCount,
      icon: Building2,
      description: "Registered institutions",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
      description: "Students, admins & super admins",
      iconColor: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-50 dark:bg-violet-950/50",
    },
    {
      title: "Total Drives",
      value: driveCount,
      icon: Briefcase,
      description: "Placement drives across colleges",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      title: "Total Tests",
      value: testCount,
      icon: ClipboardList,
      description: "Tests created across drives",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s what&apos;s happening across your PrepZero platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`shrink-0 rounded-lg p-2 ${stat.iconBg}`}>
                <stat.icon
                  className={`size-4 ${stat.iconColor}`}
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight tabular-nums">
                {stat.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-base font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/colleges/new">
              <Plus className="mr-2 size-4" aria-hidden="true" />
              Add College
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              <Users className="mr-2 size-4" aria-hidden="true" />
              Manage Users
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/colleges">
              <Building2 className="mr-2 size-4" aria-hidden="true" />
              View Colleges
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
