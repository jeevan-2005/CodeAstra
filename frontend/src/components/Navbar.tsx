"use client";

import Link from "next/link";
import {
  Code,
  Menu,
  User,
  LogOut,
  Trophy,
  FileText,
  Users,
  Target,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
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
      } catch (err) {
        console.log(err);
      }
    }
    // Remove tokens and user from Redux
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    dispatch(logout());
    router.push("/");
  };

  const navigationItems = [
    { name: "Problems", href: "/problems", icon: Target },
    { name: "Contests", href: "/contests", icon: Trophy },
    { name: "Code Review", href: "/code-review", icon: FileText },
    { name: "Leaderboard", href: "/leaderboard", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full px-5 h-16 items-center justify-between">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-5">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <Code className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">CodeAstra</span>
              </Link>
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>
              <div className="pt-4 border-t">
                {!user ? (
                  <div className="flex flex-col space-y-2">
                    <Button onClick={() => handleRedirect("/auth/login")} className="w-full cursor-pointer">
                      Sign In
                    </Button>
                    <Button variant="outline" className="w-full cursor-pointer" onClick={() => handleRedirect("/auth/register")}>
                      Sign Up
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex lg:px-5 items-center space-x-2">
          <Code className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">CodeAstra</span>
        </Link>

        <div className="flex flex-1 items-center justify-end">
          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex mx-6">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/problems"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Problems
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/contests"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Contests
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Practice</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] p-2">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/code-review"
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        <div className="text-sm font-medium leading-none group-hover:underline">
                          Code Review
                        </div>
                        <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Get your code reviewed by peers and experts
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/practice"
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        <div className="text-sm font-medium leading-none group-hover:underline">
                          Practice Arena
                        </div>
                        <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Solve problems at your own pace
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/submissions"
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background p-4 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                      >
                        <div className="text-sm font-medium leading-none group-hover:underline">
                          My Submissions
                        </div>
                        <div className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Track your submission history and progress
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/leaderboard"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                  >
                    Leaderboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side - Authentication */}
          <div className="flex items-center mr-6">
            {!user ? (
              <div className="hidden lg:flex items-center space-x-2">
                <Button variant="ghost" className="cursor-pointer"  onClick={() => handleRedirect("/auth/login")}>
                  Sign In
                </Button>
                <Button variant="default" className="cursor-pointer"  onClick={() => handleRedirect("/auth/register")}>Sign Up</Button>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      {/* <AvatarImage
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                      /> */}
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.username}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/submissions" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      My Submissions
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
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