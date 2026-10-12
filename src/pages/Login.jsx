import { useContext, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

function Login() {
  const { user, login } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /*
    Если пользователь уже авторизован,
    страницу входа ему показывать не нужно.
  */
  if (user) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');

    if (!email.trim()) {
      setError('Введите email');
      return;
    }

    if (!password) {
      setError('Введите пароль');
      return;
    }

    try {
      setLoading(true);

      await login(
        email,
        password
      );

      /*
        После успешного входа
        открываем страницу, с которой
        пользователь пришёл.

        Если такой страницы нет —
        открываем личный кабинет.
      */
      const from =
        location.state?.from?.pathname ||
        '/dashboard';

      navigate(from, {
        replace: true,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Вход</h1>

      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <label>
          Email

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="Введите email"
            required
          />
        </label>

        <label>
          Пароль

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Введите пароль"
            required
          />
        </label>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="button"
          disabled={loading}
        >
          {loading
            ? 'Вход...'
            : 'Войти'}
        </button>
      </form>
    </div>
  );
}

export default Login;