"use client";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "projects", label: "PROJECTS" },
  { id: "architecture", label: "ARCHITECTURE" },
  { id: "stack", label: "TECH STACK" },
  { id: "updates", label: "UPDATES" },
];

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Navigation({ activeView, setActiveView }: NavigationProps) {
  return (
    <nav className="w-64 p-6 border-r-4 border-terracotta dark:border-terracotta light:border-sage min-h-[calc(100vh-100px)]">
      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`
              w-full text-left px-4 py-3 font-display uppercase tracking-wide
              transition-all duration-200 relative overflow-hidden
              ${
                activeView === item.id
                  ? "bg-terracotta dark:bg-terracotta light:bg-sage text-white rounded-l-[40px]"
                  : "hover:bg-terracotta/20 dark:hover:bg-terracotta/20 light:hover:bg-sage/20 rounded-l-[20px]"
              }
            `}
          >
            <span className="relative z-10 flex items-center">
              {item.label}
              {activeView === item.id && (
                <span className="ml-auto mr-2">
                  <span className="block w-full h-1 bg-sand dark:bg-sand light:bg-stone rounded-full" />
                </span>
              )}
            </span>
            {activeView === item.id && (
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-sand dark:bg-sand light:bg-stone" />
            )}
          </button>
        ))}
      </div>

      <div className="mt-12 pt-12 border-t-2 border-terracotta/30 dark:border-terracotta/30 light:border-sage/30">
        <div className="space-y-2">
          <div className="h-2 bg-terracotta dark:bg-terracotta light:bg-sage rounded-full opacity-60" />
          <div className="h-2 bg-sand dark:bg-sand light:bg-stone rounded-full opacity-40" />
          <div className="h-2 bg-sage dark:bg-sage light:bg-terracotta rounded-full opacity-20" />
        </div>
      </div>
    </nav>
  );
}