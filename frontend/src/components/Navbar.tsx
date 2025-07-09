"use client";

import Link from "next/link";
import {
  Code,
  Menu,
  User,
  LogOut,
  Trophy,
  FileText,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useLogoutMutation } from "@/redux/auth/authApi";
import { logout } from "@/redux/auth/authSlice";
import { NewUser } from "@/redux/auth/authSlice";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user: NewUser | null  = useSelector((state: RootState) => state.auth.user);
  const [logoutApi] = useLogoutMutation();
  const handleRedirect = ( href: string ) => {
    router.push(href);
  };

  const handleLogout = async () => {
    const refresh = typeof window !== "undefined" ? localStorage.getItem("refresh") : null;
    if (refresh) {
      try {
        await logoutApi({ refresh }).unwrap();
        router.push("/");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const navigationItems = [
    { name: "Problems", href: "/problems", icon: Target },
    { name: "Contests", href: "/contests", icon: Trophy },
    { name: "My Submissions", href: "/submissions", icon: FileText },
  ];

  return (
     <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950 py-1">
      <div className="flex w-full px-5 h-16 items-center justify-between">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-800/50"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-5 bg-slate-950 border-slate-800">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  CodeAstra
                </span>
              </Link>
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800/50 hover:text-white group"
                  >
                    <item.icon className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="pt-4 border-t border-slate-800">
                {!user ? (
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={() => handleRedirect("/auth/login")}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg"
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-slate-700 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:border-slate-600 bg-transparent"
                      onClick={() => handleRedirect("/auth/register")}
                    >
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-900/50">
                    <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{user.username}</p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex lg:px-5 items-center space-x-2 group">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 group-hover:from-blue-600 group-hover:to-cyan-500 transition-all duration-200">
            <Code className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            CodeAstra
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end">
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex mx-6 ">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/problems"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/50 focus:text-white focus:outline-none text-[16px]"
                  >
                    Problems
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contests"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/50 focus:text-white focus:outline-none text-[16px]"
                  >
                    Contests
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/submissions"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/50 focus:text-white focus:outline-none text-[16px]"
                  >
                    My Submissions
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
                            <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/compiler"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-200 hover:bg-slate-800/50 hover:text-white focus:bg-slate-800/50 focus:text-white focus:outline-none text-[16px]"
                  >
                    Compiler
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              </NavigationMenuList>
          </NavigationMenu>

          {/* Right side - Authentication */}
          <div className="flex items-center mr-6">
            {!user ? (
              <div className="hidden lg:flex items-center space-x-2">
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 cursor-pointer"
                  onClick={() => handleRedirect("/auth/login")}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg cursor-pointer"
                  onClick={() => handleRedirect("/auth/register")}
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-slate-800/50 cursor-pointer">
                    <Avatar className="h-8 w-8 ring-2 ring-blue-500/20 hover:ring-blue-500/40 transition-all">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-sm font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-950 border-slate-800" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-3 bg-slate-900/50">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-white">{user.username}</p>
                      <p className="w-[200px] truncate text-sm text-slate-400">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/profile"
                      className="text-slate-300 hover:text-white hover:bg-slate-800/50 focus:bg-slate-800/50 focus:text-white cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/submissions"
                      className="text-slate-300 hover:text-white hover:bg-slate-800/50 focus:bg-slate-800/50 focus:text-white cursor-pointer"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      My Submissions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-800" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-slate-300 hover:text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar