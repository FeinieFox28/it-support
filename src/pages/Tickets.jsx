import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import TicketCard from '../components/TicketCard';
import { AuthContext } from '../context/AuthContext';

function Tickets() {
  const { user } = useContext(AuthContext);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [color, setColor] = useState(null);
  const [colorLoading, setColorLoading] = useState(false);
  const [colorError, setColorError] = useState('');

  useEffect(() => {
    if (user) {
      fetchTickets();
    } else {
      setTickets([]);
      setLoading(false);
    }
  }, [user]);

  async function fetchTickets() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://localhost:3000/api/tickets',
        {
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Не удалось загрузить заявки'
        );
      }

      setTickets(
        Array.isArray(data)
          ? data
          : Array.isArray(data.tickets)
            ? data.tickets
            : []
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function changeTheme() {
    try {
      setColorLoading(true);
      setColorError('');

      // Создаём случайный цвет
      const randomNumber = Math.floor(
        Math.random() * 0xffffff
      );

      const randomHex = randomNumber
        .toString(16)
        .padStart(6, '0');

      // Запрашиваем информацию о цвете
      const response = await fetch(
        `https://www.thecolorapi.com/id?hex=${randomHex}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          'Не удалось получить цвет от API'
        );
      }

      setColor(data);

      // Получаем данные цвета
      const primaryColor = data.hex.value;

      const hue = data.hsl.h;
      const saturation = data.hsl.s;
      const lightness = data.hsl.l;

      // Цвет при наведении
      const hoverLightness = Math.max(
        20,
        lightness - 15
      );

      // Светлый вариант цвета
      const lightColor = Math.min(
        95,
        Math.max(80, lightness + 35)
      );

      const hoverColor = `hsl(${hue}, ${saturation}%, ${hoverLightness}%)`;

      const primaryLight = `hsl(${hue}, ${saturation}%, ${lightColor}%)`;

      // Меняем CSS-переменные всего сайта
      document.documentElement.style.setProperty(
        '--primary-color',
        primaryColor
      );

      document.documentElement.style.setProperty(
        '--primary-hover',
        hoverColor
      );

      document.documentElement.style.setProperty(
        '--primary-light',
        primaryLight
      );

      document.documentElement.style.setProperty(
        '--accent-color',
        primaryColor
      );
    } catch (error) {
      setColorError(error.message);
    } finally {
      setColorLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="page">
        <h1>Заявки IT-отдела</h1>

        <p>
          Чтобы просматривать свои заявки,
          необходимо войти в аккаунт.
        </p>

        <Link
          to="/login"
          className="button"
        >
          Войти
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Заявки IT-отдела</h1>
        <p>Загрузка заявок...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Заявки IT-отдела</h1>

        <p className="error">
          {error}
        </p>

        <button
          type="button"
          className="button"
          onClick={fetchTickets}
        >
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div className="page">

      {/* =========================
          ЗАЯВКИ
      ========================= */}

      <section>
        <h1>
          {user.role === 'admin'
            ? 'Все заявки'
            : 'Мои заявки'}
        </h1>

        <p>
          {user.role === 'admin'
            ? 'Здесь отображаются все заявки пользователей.'
            : 'Здесь отображаются заявки, созданные вами.'}
        </p>

        {tickets.length === 0 ? (
          <div className="dashboard-section">
            <p>
              У вас пока нет заявок.
            </p>

            <Link
              to="/tickets/create"
              className="button"
            >
              Создать первую заявку
            </Link>
          </div>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
              />
            ))}
          </div>
        )}
      </section>

      {/* =========================
          СМЕНА ТЕМЫ
      ========================= */}

      <section className="color-section">

        <h2>
          Оформление сайта
        </h2>

        <p className="color-description">
          Нажмите кнопку, чтобы получить
          новый цвет через The Color API
          и изменить основную цветовую схему
          сайта.
        </p>

        {color && (
          <div className="current-theme">

            <p>
              Текущий цвет:{' '}
              <strong>
                {color.name.value}
              </strong>
            </p>

            <p>
              HEX:{' '}
              <strong>
                {color.hex.value}
              </strong>
            </p>

          </div>
        )}

        {colorError && (
          <p className="error">
            {colorError}
          </p>
        )}

        <button
          type="button"
          className="button color-button"
          onClick={changeTheme}
          disabled={colorLoading}
        >
          {colorLoading
            ? 'Смена темы...'
            : 'Сменить тему'}
        </button>

      </section>

    </div>
  );
}

export default Tickets;