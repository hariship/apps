"use client";

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: "projects", label: "PROJECTS" },
  { id: "architecture", label: "ARCHITECTURE" },
  { id: "stack", label: "TECH STACK" },
  { id: "updates", label: "COMMITS" },
];

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export default function Navigation({ activeView, setActiveView }: NavigationProps) {
  return (
    <nav className="w-48 p-3 bg-white dark:bg-gray-900 border-r-2 border-sage dark:border-amber-600 min-h-screen flex-shrink-0 transition-colors">
      <div className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`
              w-full text-left px-4 py-3 uppercase tracking-wider text-sm font-bold
              transition-all duration-300 relative overflow-hidden
              ${
                activeView === item.id
                  ? "bg-sage dark:bg-amber-600 text-white dark:text-black"
                  : "text-gray-800 dark:text-white hover:bg-sage/20 dark:hover:bg-amber-600/20 hover:text-sage-dark dark:hover:text-amber-200"
              }
            `}
            style={{
              fontFamily: 'Antonio, sans-serif',
              borderRadius: '30px 0 0 30px',
              borderLeft: activeView === item.id ? '4px solid #6B8E4F' : '2px solid #374151'
            }}
          >
            <span className="relative z-10 flex items-center">
              {item.label}
              {activeView === item.id && (
                <span className="ml-auto">
                  <div className="w-1 h-4 bg-sage-light rounded-full" />
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 pt-4 border-t border-sage/30 dark:border-amber-600/30">
        <div className="space-y-2">
          <div className="h-2 bg-sage dark:bg-amber-600 rounded-r-full opacity-80" />
          <div className="h-2 bg-terracotta dark:bg-terracotta rounded-r-full opacity-60" />
          <div className="h-2 bg-sand dark:bg-sand rounded-r-full opacity-40" />
        </div>
      </div>
    </nav>
  );
}