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
    <nav className="w-64 p-6 bg-gray-900 border-r-4 border-amber-600 min-h-screen">
      <div className="space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`
              w-full text-left px-6 py-4 uppercase tracking-wider font-bold
              transition-all duration-300 relative overflow-hidden text-white
              ${
                activeView === item.id
                  ? "bg-amber-600 text-black"
                  : "hover:bg-amber-600/20 hover:text-amber-200"
              }
            `}
            style={{
              fontFamily: 'Antonio, sans-serif',
              borderRadius: '40px 0 0 40px',
              borderLeft: activeView === item.id ? '8px solid #d97706' : '4px solid #374151'
            }}
          >
            <span className="relative z-10 flex items-center">
              {item.label}
              {activeView === item.id && (
                <span className="ml-auto">
                  <div className="w-2 h-6 bg-orange-400 rounded-full" />
                </span>
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t-2 border-amber-600/30">
        <div className="space-y-3">
          <div className="h-3 bg-amber-600 rounded-r-full opacity-80" />
          <div className="h-3 bg-orange-500 rounded-r-full opacity-60" />
          <div className="h-3 bg-yellow-500 rounded-r-full opacity-40" />
        </div>
      </div>
    </nav>
  );
}