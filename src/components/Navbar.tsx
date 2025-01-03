import { getImageURL, usePocketBase } from "@/lib/pb";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link, useNavigate } from 'react-router-dom';
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
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-3xl flex gap-2">
            <img src="/logo.svg" alt="UIUC Marketplace" className="w-10 h-10" />
            <span>UIUC Marketplace</span>
          </Link>
          <Button variant="whiteLink" asChild>
            <a className="text-base text-white">Dorm</a>
          </Button>
          <Button variant="whiteLink" asChild>
            <a className="text-base text-white">Clothes</a>
          </Button>
          <Button variant="whiteLink" asChild>
            <a className="text-base text-white">School</a>
          </Button>
          <Button variant="whiteLink" asChild>
            <a className="text-base text-white">Leisure</a>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {pb.authStore.isValid && pb.authStore.model ? (
            <>
              <Button className="font-medium flex items-center gap-1" variant="secondary" asChild>
                <Link to="/new-listing">
                  New Listing
                  <LuPlus className="w-5 h-5" />
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-9 h-9 cursor-pointer border-2 border-black hover:border-gray-400 transition-all">
                    <AvatarImage src={getImageURL(pb.authStore.model, pb.authStore.model.avatar, "thumb=100x100")} />
                    <AvatarFallback className="text-black">{(pb.authStore.model.name as string).split(' ').map(w => w[0]).join('').toUpperCase()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-2 mt-4">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/manage-listings">Manage Listings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/chats">Chats</Link>
                  </DropdownMenuItem>
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