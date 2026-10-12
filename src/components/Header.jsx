import { useContext } from 'react';
import {
  NavLink,
  useNavigate,
} from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

function Header() {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();

  async function handleLogout() {
    await logout();

    navigate('/');
  }

  return (
    <header className="header">
      <div className="header-container">

        <NavLink to="/" className="logo">
          IT Support
        </NavLink>

        <nav className="navigation">

          <NavLink to="/" end>
            Главная
          </NavLink>

          <NavLink to="/tickets">
            Заявки
          </NavLink>

          {user ? (
            <>
              <NavLink to="/tickets/create">
                Создать заявку
              </NavLink>

              <NavLink to="/dashboard">
                Личный кабинет
              </NavLink>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">
                Войти
              </NavLink>

              <NavLink to="/register">
                Регистрация
              </NavLink>
            </>
          )}

        </nav>
      </div>
    </header>
  );
}

export default Header;