import {
  createContext,
  useEffect,
  useState,
} from 'react';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/me',
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();

        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error(
        'Ошибка проверки авторизации:',
        error
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function register(name, email, password) {
    const response = await fetch(
      'http://localhost:3000/api/auth/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Ошибка регистрации'
      );
    }

    setUser(data.user);

    return data.user;
  }

  async function login(email, password) {
    const response = await fetch(
      'http://localhost:3000/api/auth/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || 'Ошибка входа'
      );
    }

    setUser(data.user);

    return data.user;
  }

  async function logout() {
    try {
      await fetch(
        'http://localhost:3000/api/auth/logout',
        {
          method: 'POST',
          credentials: 'include',
        }
      );
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export {
  AuthContext,
  AuthProvider,
};