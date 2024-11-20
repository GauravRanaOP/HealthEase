import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const[userDataRole, setUserDataRole] = useState(null);

  const [loading, setLoading] = useState(true);
  const storedData = JSON.parse(localStorage.getItem("user_data"));

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("user_data"));
    if (storedData) {
      const { userToken, userRole, userId } = storedData;
      setToken(userToken);
      setUserData(userId);
      setUserDataRole(userRole);
      setIsAuthenticated(true);
    }
    // const storedToken = localStorage.getItem("token");
    // setToken(storedToken);
    setLoading(false);
  }, []);

  const login = (newToken, newData) => {
    const { userId, userRole } = newData;

    localStorage.setItem(
      "user_data",
      JSON.stringify({ userToken: newToken, userId, userRole })
    );

    setToken(newToken);
    setUserData(userId);
    setUserDataRole(userRole);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("user_data");
    setToken(null);
    setUserData(null);
    setUserDataRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        login,
        logout,
        userData,
        userDataRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
