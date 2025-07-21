import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Vote } from "lucide-react";
import * as actions from "@/logic/login/actions";

const navigationLinks = [
  { href: "/home/vote", label: "Votar" },
  { href: "/home/result", label: "Resultados" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    actions.logout()(dispatch);
  };

  const redirectToDashboard = () => {
    return navigate("dashboard");
  };

  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="group size-8 md:hidden"
                variant="ghost"
                size="icon"
              >
                <svg
                  className="pointer-events-none"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-36 p-1 md:hidden">
              <NavigationMenu className="max-w-none *:w-full">
                <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                  {navigationLinks.map((link, index) => (
                    <NavigationMenuItem key={index}>
                      <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                        onClick={() => navigate(link.href)}
                      >
                        {link.label}
                      </Button>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </PopoverContent>
          </Popover>
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              className="cursor-pointer"
              size="sm"
              onClick={redirectToDashboard}
            >
              <Vote className="size-6" />
            </Button>
            <NavigationMenu className="max-md:hidden">
              <NavigationMenuList className="gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-primary py-1.5 font-medium"
                      onClick={() => navigate(link.href)}
                    >
                      {link.label}
                    </Button>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            className="w-full cursor-pointer"
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
