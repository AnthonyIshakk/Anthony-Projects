import { createContext, useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("token"));
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const {
    loading,
    error,
    makeRequest: loginRequest,
  } = useApi("/user/login", "POST", null);
  const { makeRequest: registerRequest } = useApi(
    "/user/register",
    "POST",
    null
  );
  const { makeRequest: fetchProfile } = useApi("/user/profile", "GET", null);

  async function handleLogin({ email, password }) {
    const data = await loginRequest({ email, password });

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setIsLogged(true);
      await loadUserProfile();
      return true;
    }
    return false;
  }

  async function handleRegister({ name, email, password, merchantName }) {
    const data = await registerRequest({ name, email, password, merchantName });

    if (data?.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setIsLogged(true);
      await loadUserProfile();
      return true;
    }
    return false;
  }

  async function loadUserProfile() {
    const result = await fetchProfile();
    if (result?.user) {
      const { role_name, permissions: perms = [] } = result.user;
      setUser(result.user);
      setRole(role_name);
      setPermissions(perms);
    } else {
      setUser(null);
      setRole(null);
      setPermissions([]);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setIsLogged(false);
    setUser(null);
    setRole(null);
    setPermissions([]);
  }

  useEffect(() => {
    if (token) loadUserProfile();
  }, [token]);

  const value = {
    isLogged,
    token,
    user,
    role,
    permissions,
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
    loadUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
