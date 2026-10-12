import { useContext, useState } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

function Register() {
  const { user, register } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /*
    Если пользователь уже вошёл,
    страницу регистрации ему показывать не нужно.
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

    if (!name.trim()) {
      setError('Введите имя');
      return;
    }

    if (!email.trim()) {
      setError('Введите email');
      return;
    }

    if (password.length < 6) {
      setError(
        'Пароль должен содержать минимум 6 символов'
      );
      return;
    }

    if (password !== repeatPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      setLoading(true);

      await register(
        name,
        email,
        password
      );

      /*
        После регистрации пользователь
        уже авторизован.

        Если он пришёл на регистрацию
        с защищённой страницы,
        возвращаем его туда.
        Иначе открываем личный кабинет.
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
      <h1>Регистрация</h1>

      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <label>
          Имя

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Введите имя"
            required
          />
        </label>

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

        <label>
          Повторите пароль

          <input
            type="password"
            value={repeatPassword}
            onChange={(event) =>
              setRepeatPassword(event.target.value)
            }
            placeholder="Повторите пароль"
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
            ? 'Регистрация...'
            : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
}

export default Register;