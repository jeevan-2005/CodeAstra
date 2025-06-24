// Assuming this is app/problems/page.tsx or a component used within it

"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSelector } from "react-redux";
import React from "react"; // Keep React imported
import { NewUser } from "@/redux/auth/authSlice"; // Adjust path if needed
import { RootState } from "@/redux/store"; // Adjust path if needed
import LoadingSpinner from "./LoadingSpinner"; // Adjust path if needed

// Ensure the Problem type here matches the one defined in problemsApi.ts
// And that problemsApi.ts also defines the Problem type correctly based on your backend data
interface Problem {
  id: number;
  problem_name: string;
  difficulty: string;
  tags: {
    id: number;
    tag: string;
  }[]; // Assuming tags is an array of tag objects
}

import {
  GetProblemParams,
  useGetProblemsQuery,
} from "@/redux/problems/problemApi"; // Adjust path if needed

// Import necessary React Table components/types
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Import Shadcn UI table components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust path if needed
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Define the columns for the table
// We only include the ones you want to display: id, problem_name, difficulty
const columns: ColumnDef<Problem>[] = [
  {
    // accessorKey: "id",
    header: "ID",
    cell: (info) => info.row.index + 1,
  },
  {
    accessorKey: "problem_name",
    header: "Problem",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: (info) => info.getValue(),
  },
];

const ProblemsList = () => {
  const user: NewUser | null = useSelector(
    (state: RootState) => state.auth.user
  );
  const router = useRouter();

  const [problemDifficulty, setProblemDifficulty] = React.useState<string>("");

  const queryParams: GetProblemParams = {
    difficulty: problemDifficulty == "All" ? "" : problemDifficulty,
  };

  const { data, isLoading, isError, isSuccess } = useGetProblemsQuery(
    queryParams,
    {
      skip: !user,
    }
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
        <LoadingSpinner size={50} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)] text-red-500">
        <p>Error loading problems. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start h-[calc(100vh-6rem)] py-15">
      <div className="flex flex-col items-center justify-center w-[60%]">
        <div className="mb-6 flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-bold">Problems List</h1>
          </div>
          <Select
            value={problemDifficulty}
            onValueChange={(value) => setProblemDifficulty(value)}
          >
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue placeholder="Filter by Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Difficulties</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md border w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      router.push(`/problems/${row.original.id}`);
                    }}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {isSuccess && data?.length === 0
                      ? "No problems found."
                      : "No results."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Removed pagination */}
        {/* <div className="flex items-center justify-end space-x-2 py-4">
            ... Pagination buttons ...
        </div> */}
      </div>
    </div>
  );
};

export default ProblemsList;
