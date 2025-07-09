"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, Code2, Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import LoadingSpinner from "./LoadingSpinner";
import { useGetProblemsQuery } from "@/redux/problems/problemApi";


interface Problem {
  id: number;
  problem_name: string;
  difficulty: string;
  tags: {
    id: number;
    tag: string;
  }[];
}

interface GetProblemParams {
  difficulty?: string;
}


const columns: ColumnDef<Problem>[] = [
  {
    header: "ID",
    cell: (info) => (
      <div className="font-mono text-slate-400 text-sm">
        #{String(info.row.index + 1).padStart(3, "0")}
      </div>
    ),
  },
  {
    accessorKey: "problem_name",
    header: "Problem",
    cell: (info) => (
      <div className="font-medium text-white hover:text-blue-400 transition-colors">
        {info.getValue() as string}
      </div>
    ),
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: (info) => {
      const difficulty = info.getValue() as string;
      const getDifficultyColor = (diff: string) => {
        switch (diff.toLowerCase()) {
          case "easy":
            return "bg-green-500/10 text-green-400 border-green-500/20";
          case "medium":
            return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
          case "hard":
            return "bg-red-500/10 text-red-400 border-red-500/20";
          default:
            return "bg-slate-500/10 text-slate-400 border-slate-500/20";
        }
      };

      return (
        <Badge className={`${getDifficultyColor(difficulty)} font-medium`}>
          {difficulty}
        </Badge>
      );
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: (info) => {
      const tags = info.getValue() as { id: number; tag: string }[];
      return (
        <div className="flex flex-wrap gap-1">
          {tags?.slice(0, 3).map((tag) => (
            <Badge
              key={tag.id}
              variant="outline"
              className="text-xs bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700/50"
            >
              {tag.tag}
            </Badge>
          ))}
          {tags?.length > 3 && (
            <Badge
              variant="outline"
              className="text-xs bg-slate-800/50 text-slate-400 border-slate-700"
            >
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      );
    },
  },
];

const ProblemsList = () => {
  const [problemDifficulty, setProblemDifficulty] =
    React.useState<string>("All");
  const router = useRouter();

  const queryParams: GetProblemParams = {
    difficulty: problemDifficulty === "All" ? "" : problemDifficulty,
  };

  const { data, isLoading, isError, isSuccess } = useGetProblemsQuery(
    queryParams
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4.2rem)] flex-col  bg-slate-950 flex items-center justify-center">
          <LoadingSpinner size={25} />
          <p className="text-slate-400">Loading problems...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="bg-red-500/10 border-red-500/20 max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              Error Loading Problems
            </h3>
            <p className="text-red-300/80">
              Please try refreshing the page or contact support if the issue
              persists.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    total: data?.length || 0,
    easy:
      data?.filter(
        (p: { difficulty: string }) => p.difficulty.toLowerCase() === "easy"
      ).length || 0,
    medium:
      data?.filter(
        (p: { difficulty: string }) => p.difficulty.toLowerCase() === "medium"
      ).length || 0,
    hard:
      data?.filter(
        (p: { difficulty: string }) => p.difficulty.toLowerCase() === "hard"
      ).length || 0,
  };

  return (
    <div className="min-h-min h-[calc(100vh-4.6rem)] bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-white">
                Problem{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Archive
                </span>
              </h1>
              <p className="text-slate-400 text-lg">
                Challenge yourself with {stats.total} carefully curated coding
                problems
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <Select
                value={problemDifficulty}
                onValueChange={setProblemDifficulty}
              >
                <SelectTrigger className="w-[180px] bg-slate-800/50 border-slate-700 text-white cursor-pointer">
                  <SelectValue placeholder="Filter by Difficulty" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem
                    value="All"
                    className="text-slate-300 focus:bg-slate-800 focus:text-white cursor-pointer"
                  >
                    All Difficulties
                  </SelectItem>
                  <SelectItem
                    value="Easy"
                    className="text-green-400 focus:bg-slate-800 focus:text-green-300 cursor-pointer"
                  >
                    Easy
                  </SelectItem>
                  <SelectItem
                    value="Medium"
                    className="text-yellow-400 focus:bg-slate-800 focus:text-yellow-300 cursor-pointer"
                  >
                    Medium
                  </SelectItem>
                  <SelectItem
                    value="Hard"
                    className="text-red-400 focus:bg-slate-800 focus:text-red-300 cursor-pointer"
                  >
                    Hard
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Problems Table */}
        <Card className="bg-slate-900/50 border-slate-800 p-0">
          <CardContent className="px-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="border-slate-800 hover:bg-slate-800/30"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="text-slate-300 font-semibold text-lg py-3 px-6 underline"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        onClick={() =>
                          router.push(`/problems/${row.original.id}`)
                        }
                        className="border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-all duration-200"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-3 px-6">
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
                        className="h-32 text-center border-slate-800"
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <Code2 className="h-12 w-12 text-slate-600" />
                          <div className="space-y-1">
                            <p className="text-slate-400 font-medium">
                              {isSuccess && data?.length === 0
                                ? "No problems found"
                                : "No results found"}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {problemDifficulty !== "All"
                                ? "Try adjusting your search or filters"
                                : "Problems will appear here once loaded"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        {data && data.length > 0 && (
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm">
              Showing {data.length} of {stats.total} problems
              {problemDifficulty !== "All" &&
                ` with ${problemDifficulty.toLowerCase()} difficulty`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


export default ProblemsList;
