import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="flex flex-col max-w-screen-xl mx-auto  gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
      <p className="text-xs text-gray-500 dark:text-gray-400">
        © Factory Platform Inc. All rights reserved.
      </p>
      <nav className="sm:ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-xs text-white hover:underline underline-offset-4"
          to="#"
        >
          Terms of Service
        </Link>
        <Link
          className="text-xs text-white hover:underline underline-offset-4"
          to="#"
        >
          Privacy
        </Link>
      </nav>
    </footer>
  );
}
