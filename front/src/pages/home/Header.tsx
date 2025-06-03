import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import LOGO from "../../assets/images/logo-dark.png";
const docsUrl = `${import.meta.env.VITE_DOCS_URL}`;
export default function Header() {
  return (
    <header className="px-4 lg:px-6 justify-between flex items-center py-4   max-w-screen-xl mx-auto w-full">
      <Link to={"/"}>
        <img src={LOGO} className="w-[181px] h-[31px]  object-contain" />
      </Link>
      <NavigationMenu className="">
        <NavigationMenuList className="gap-4 text-white text-lg  h-full">
          <NavigationMenuItem className="hover:border-b-2 font-semibold">
            <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem className="hover:border-b-2 font-semibold">
            <NavigationMenuLink href={docsUrl} target="_blank">
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              className="text-base text-black font-semibold hover:bg-orange-500 hover:text-white   bg-white p-4 rounded-lg"
              to="/login"
            >
              Dashboard
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
