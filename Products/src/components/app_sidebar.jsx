import { useNavigate, Link, useLocation } from "react-router";
import { useContext, useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package2,
  User2,
  LogOut,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { AuthContext } from "@/context/AuthContext";

function cx(...cls) {
  return cls.filter(Boolean).join(" ");
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout, error, isLogged } = useContext(AuthContext);

  // State for collapsible User submenu
  const [userOpen, setUserOpen] = useState(false);

  // Highlight User parent if any subpage is active
  const userActive =
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/roles");

  // Auto-open submenu when on user-related routes
  useEffect(() => {
    if (userActive) setUserOpen(true);
  }, [userActive]);

  function handleSignOut() {
    handleLogout();
    navigate("/login");
  }

  return (
    <aside className="h-full w-64 flex flex-col bg-white border shadow-sm rounded-xl p-4">
      {/* Header */}
      <div className="px-4 py-4 border-b flex items-center gap-2">
        <div className="font-bold text-gray-800 text-lg">My Store</div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b flex items-center gap-3">
        <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold">
          {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {!user && isLogged ? "Loading..." : user?.name || "..."}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email || "..."}
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      </div>

      {/* Scrollable navigation area */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <Link
              to="/dashboard"
              className={cx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                location.pathname.startsWith("/dashboard")
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </Link>
          </li>

          {/* Product */}
          <li>
            <Link
              to="/cards"
              className={cx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                location.pathname.startsWith("/cards")
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Package2 size={18} />
              Product
            </Link>
          </li>

          {/* User Section (collapsible) */}
          <li>
            <button
              onClick={() => setUserOpen(!userOpen)}
              className={cx(
                "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors",
                userActive
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <span className="flex items-center gap-3">
                <User2 size={18} />
                User
              </span>
              {userOpen ? <ChevronUp size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Nested Roles submenu */}
            {userOpen && (
              <ul className="mt-1 ml-6 space-y-1 border-l border-gray-200 pl-3">
                <li>
                  <Link
                    to="/roles"
                    className={cx(
                      "block px-3 py-2 rounded-md text-sm transition-colors",
                      location.pathname === "/roles"
                        ? "bg-gray-100 text-gray-900 font-medium"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    Roles & Permissions
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      {/* Logout - pinned at the bottom */}
      <div className="border-t pt-4 mt-auto">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
