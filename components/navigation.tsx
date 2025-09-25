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
    <nav className="w-56 p-4 bg-gray-900 dark:bg-gray-900 light:bg-stone border-r-4 border-amber-600 dark:border-amber-600 light:border-sage min-h-screen flex-shrink-0 transition-colors">
      <div className="space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`
              w-full text-left px-6 py-4 uppercase tracking-wider font-bold
              transition-all duration-300 relative overflow-hidden
              ${
                activeView === item.id
                  ? "bg-amber-600 dark:bg-amber-600 light:bg-sage text-black dark:text-black light:text-white"
                  : "text-white dark:text-white light:text-gray-800 hover:bg-amber-600/20 dark:hover:bg-amber-600/20 light:hover:bg-sage/20 hover:text-amber-200 dark:hover:text-amber-200 light:hover:text-sage-dark"
              }
            `}
            style={{
              fontFamily: 'Antonio, sans-serif',
              borderRadius: '40px 0 0 40px',
              borderLeft: activeView === item.id ? '8px solid #6B8E4F' : '4px solid #374151'
            }}
          >
            <span className="relative z-10 flex items-center">
              {item.label}
              {activeView === item.id && (
                <span className="ml-auto">
                  <div className="w-2 h-6 bg-sage-light rounded-full" />
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t-2 border-amber-600/30 dark:border-amber-600/30 light:border-sage/30">
        <div className="space-y-3">
          <div className="h-3 bg-amber-600 dark:bg-amber-600 light:bg-sage rounded-r-full opacity-80" />
          <div className="h-3 bg-terracotta dark:bg-terracotta light:bg-sage-light rounded-r-full opacity-60" />
          <div className="h-3 bg-sand dark:bg-sand light:bg-sage-dark rounded-r-full opacity-40" />
        </div>
      </div>
    </nav>
  );
}