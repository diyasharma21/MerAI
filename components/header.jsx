import { SignedOut, SignInButton, UserButton, SignedIn } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { ChevronDown, Clipboard, FileSignatureIcon, FileUserIcon, Laptop2Icon, LaptopMinimalCheck, Layers, LayoutDashboard, PenIcon, PenLine, Stars, StarsIcon, ToolCase, UserCheck } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
    await checkUser()
    return (
        <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50
            supports-[backdrop-filter]:bg-background/60 ">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/">
            <Image
            src="/logo.svg"
            alt="Merai Logo"
            width={150}
            height={50}
            priority
            className="h-12 py-1  w-auto object-contain "
            />

            </Link >
            <div className="flex items-center space-x-2 md:space-x-4">
                <SignedIn>
                    <Link href={"/dashboard"}>
                    <Button variant="outline">
                        <Layers className="h-4 w-4"/>
                       <span className=" hidden md:block">
                         Industry Insights
                       </span>
                    </Button>
                    </Link>
                
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button>
                        <Stars className="h-4 w-4"/>
                       <span className=" hidden md:block">Growth Tools</span>
                       <ChevronDown className="h-4 w-4"/>
                    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
        <Link href={"/resume"} className="flex items-center gap-2">
            <FileUserIcon className="h-4 w-4"/>
            <span className=" md:block">
                Build Resume
            </span>
        </Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
        <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
            <PenLine className="h-4 w-4"/>
            <span className=" md:block">
                Cover Letter
            </span>
        </Link>
    </DropdownMenuItem>
    <DropdownMenuItem>
        <Link href={"/interview"} className="flex items-center gap-2">
            <Laptop2Icon className="h-4 w-4"/>
            <span className=" md:block">
                Interivew Prep
            </span>
        </Link>
    </DropdownMenuItem>    
  </DropdownMenuContent>
</DropdownMenu>
</SignedIn>
<SignedOut>
        <SignInButton>
            <Button variant="outline">
            Sign In
            </Button>
        </SignInButton>

      </SignedOut>
        <SignedIn>
        <UserButton
        appearance={{
            elements:{
                avatarBox:"w-10 h-10",
                userButtonPopoverCard:"shadow-xl",
                userPreviewMainIdentifier:"font-semibold"
            }
        }}
        afterSignOutUrl="/"

        />
        </SignedIn>

            </div>
        </nav>
    </header>
  )
}

export default Header
