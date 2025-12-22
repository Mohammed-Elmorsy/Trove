'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Store, ShoppingCart, User, LogOut, Package, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CartBadge } from './cart-badge';
import { useAuth } from '@/components/providers/auth-provider';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Trove</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === link.href
                    ? 'bg-gray-200 text-foreground font-semibold'
                    : 'bg-background text-foreground'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Cart Badge */}
            <div className="hidden md:flex">
              <CartBadge />
            </div>

            {/* Auth Section - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      {user?.name?.split(' ')[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.name}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {user?.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        Order History
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'ADMIN' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">Sign up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Store className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">Trove</span>
                  </div>
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          href={link.href}
                          className={cn(
                            'flex items-center rounded-md px-4 py-3 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                            pathname === link.href &&
                              'bg-gray-200 text-accent-foreground font-semibold'
                          )}
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  {/* Mobile Auth Section */}
                  <div className="mt-4 pt-4 border-t space-y-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2">
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                        <SheetClose asChild>
                          <Link
                            href="/account/profile"
                            className="flex items-center rounded-md px-4 py-3 text-lg font-medium transition-colors hover:bg-accent"
                          >
                            <User className="mr-3 h-5 w-5" />
                            Profile
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/account/orders"
                            className="flex items-center rounded-md px-4 py-3 text-lg font-medium transition-colors hover:bg-accent"
                          >
                            <Package className="mr-3 h-5 w-5" />
                            Order History
                          </Link>
                        </SheetClose>
                        {user?.role === 'ADMIN' && (
                          <SheetClose asChild>
                            <Link
                              href="/admin/dashboard"
                              className="flex items-center rounded-md px-4 py-3 text-lg font-medium transition-colors hover:bg-accent"
                            >
                              <Settings className="mr-3 h-5 w-5" />
                              Admin Panel
                            </Link>
                          </SheetClose>
                        )}
                        <SheetClose asChild>
                          <button
                            onClick={logout}
                            className="flex w-full items-center rounded-md px-4 py-3 text-lg font-medium text-destructive transition-colors hover:bg-destructive/10"
                          >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign out
                          </button>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Button className="w-full" size="lg" asChild>
                            <Link href="/login">Sign in</Link>
                          </Button>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button className="w-full" size="lg" variant="outline" asChild>
                            <Link href="/register">Sign up</Link>
                          </Button>
                        </SheetClose>
                      </>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <SheetClose asChild>
                      <Button className="w-full" size="lg" asChild>
                        <Link href="/cart">
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          View Cart
                        </Link>
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
