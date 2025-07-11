"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  Trophy,
  Users,
  Target,
  Star,
  TrendingUp,
  BookOpen,
  Zap,
  Award,
  ChevronRight,
  Play,
  CheckCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-cyan-900/20" />
        <div className="relative container mx-auto px-4 py-20 lg:py-17">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20">
                🚀 New Contest Starting Soon
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Master Coding
                </span>
                <br />
                <span className="text-white">Through Competition</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                Join thousands of programmers in solving challenging problems,
                competing in contests, and improving your algorithmic thinking
                skills.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-xl px-8 py-6 text-lg cursor-pointer"
                onClick={() => router.push("/problems")}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Solving
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-600 px-8 py-6 text-lg bg-transparent cursor-pointer"
                onClick={() => router.push("/contests")}
              >
                View Contests
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  50K+
                </div>
                <div className="text-slate-400 text-sm md:text-base">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  2.5K+
                </div>
                <div className="text-slate-400 text-sm md:text-base">
                  Problems
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-slate-400 text-sm md:text-base">
                  Contests
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  1M+
                </div>
                <div className="text-slate-400 text-sm md:text-base">
                  Submissions
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                CodeAstra
              </span>
              ?
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Everything you need to excel in competitive programming and
              technical interviews
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Diverse Problem Set
                </h3>
                <p className="text-slate-400">
                  Over 2,500 carefully curated problems ranging from beginner to
                  expert level across all major algorithms and data structures.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Regular Contests
                </h3>
                <p className="text-slate-400">
                  Participate in weekly contests, monthly challenges, and
                  special events to test your skills against global competitors.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Global Community
                </h3>
                <p className="text-slate-400">
                  Connect with 50,000+ programmers worldwide, share solutions,
                  and learn from the best in the community.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Real-time Judging
                </h3>
                <p className="text-slate-400">
                  Get instant feedback on your submissions with our
                  lightning-fast judging system supporting 15+ programming
                  languages.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Progress Tracking
                </h3>
                <p className="text-slate-400">
                  Monitor your improvement with detailed analytics, rating
                  changes, and personalized learning recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900/70 transition-all duration-300 group">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Learning Resources
                </h3>
                <p className="text-slate-400">
                  Access comprehensive tutorials, editorial solutions, and video
                  explanations to master complex algorithms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievement Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white">
                  Track Your{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Progress
                  </span>
                </h2>
                <p className="text-xl text-slate-400">
                  Monitor your coding journey with detailed analytics, rating
                  progression, and achievement badges.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">
                    Real-time rating updates after each contest
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">
                    Detailed problem-solving statistics
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">
                    Achievement badges and milestones
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-slate-300">
                    Personalized learning recommendations
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-xl cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                View Your Profile
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-800/50">
                <CardContent className="p-6 text-center space-y-2">
                  <Award className="h-8 w-8 text-blue-400 mx-auto" />
                  <div className="text-2xl font-bold text-white">Expert</div>
                  <div className="text-blue-400">Current Rating</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    1847
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-800/50">
                <CardContent className="p-6 text-center space-y-2">
                  <Target className="h-8 w-8 text-purple-400 mx-auto" />
                  <div className="text-2xl font-bold text-white">Solved</div>
                  <div className="text-purple-400">Problems</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                    342
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-800/50">
                <CardContent className="p-6 text-center space-y-2">
                  <Trophy className="h-8 w-8 text-green-400 mx-auto" />
                  <div className="text-2xl font-bold text-white">Contests</div>
                  <div className="text-green-400">Participated</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                    28
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-800/50">
                <CardContent className="p-6 text-center space-y-2">
                  <Star className="h-8 w-8 text-orange-400 mx-auto" />
                  <div className="text-2xl font-bold text-white">Global</div>
                  <div className="text-orange-400">Rank</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-300 bg-clip-text text-transparent">
                    #1,247
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-900/20 via-slate-950 to-cyan-900/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Ready to Start Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Coding Journey
              </span>
              ?
            </h2>
            <p className="text-xl text-slate-400">
              Join thousands of programmers who are already improving their
              skills on CodeAstra. Start solving problems, participate in
              contests, and climb the leaderboard today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-xl px-8 py-6 text-lg cursor-pointer"
                onClick={() => router.push("/auth/register")}
              >
                Create Free Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-600 px-8 py-6 text-lg bg-transparent cursor-pointer"
                onClick={() => router.push("/problems")}
              >
                Explore Problems
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
