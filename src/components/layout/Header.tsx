import { NavLink } from "react-router-dom";

type NavigationItem = {
  label: string;
  href: string;
};

type HeaderProps = {
  logoText: string;
  navigation: readonly NavigationItem[];
};

export function Header({ logoText, navigation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-brand-dark/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <NavLink to="/" className="font-mono text-lg font-bold text-white">
          {logoText}
        </NavLink>
        <nav className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                [
                  "relative text-sm font-medium transition hover:text-white",
                  isActive ? "text-blue-400" : "text-slate-300",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
