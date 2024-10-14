import { getImageURL, usePocketBase } from "@/lib/pb";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LuLogOut, LuPlus } from "react-icons/lu";

export default function Navbar() {
  const pb = usePocketBase();
  const navigate = useNavigate();  

  const handleSignOut = () => {
    pb.authStore.clear();
    document.cookie = pb.authStore.exportToCookie({ httpOnly: false, expires: new Date(0) });
    navigate("/");
  }

  return (
    <nav className="bg-slate-500 p-3">
      <div className="flex justify-between items-center text-white">
        <a href="/" className="font-bold text-3xl">UIUC Marketplace</a>
        <div className="flex items-center gap-3">
          {pb.authStore.isValid && pb.authStore.model ? (
            <>
              <Button className="font-semibold flex items-center gap-1" variant="secondary">
                New Listing
                <LuPlus className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-9 h-9 cursor-pointer border-2 border-black hover:border-gray-400 transition-all">
                    <AvatarImage src={getImageURL(pb.authStore.model, pb.authStore.model.avatar, "thumb=100x100")} alt="@shadcn" />
                    <AvatarFallback className="text-black">{(pb.authStore.model.name as string).split(' ').map(w => w[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-2 mt-4">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex justify-between" onClick={handleSignOut}>
                    <span>Sign out</span>
                    <LuLogOut className="w-4 h-4 text-gray-400" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant={"ghost"} asChild>
              <a href="/sign-in" className="flex items-center">
                <span>Sign in</span>
              </a>
            </Button>
          )
          }

        </div>
      </div>
    </nav>
  )
}