import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth-guard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function StudentsListPage() {
  const session = await getSession();
  const user = session!.user as { id: string; collegeId: string };

  const students = await prisma.user.findMany({
    where: {
      collegeId: user.collegeId,
      role: "STUDENT",
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      usn: true,
      department: {
        select: { name: true, code: true },
      },
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            All registered students in your college.
          </p>
        </div>
        <Button asChild>
          <Link href="/college/students/upload">
            <Upload />
            Upload Students
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>USN</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No students found. Students will appear here once they
                  register or are uploaded via CSV.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {student.usn || <span className="text-muted-foreground">&mdash;</span>}
                  </TableCell>
                  <TableCell>
                    {student.department ? (
                      <Badge variant="outline">
                        {student.department.code || student.department.name}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">&mdash;</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(student.createdAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
