import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        'http://localhost:3000/api/tickets/my',
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

      setTickets(data.tickets || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Личный кабинет</h1>

      <section className="dashboard-section">
        <h2>
          Добро пожаловать, {user?.name}!
        </h2>

        <div className="user-info">
          <p>
            <strong>Имя:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-title">
          <h2>Мои заявки</h2>

          <Link
            to="/tickets/create"
            className="button"
          >
            Создать заявку
          </Link>
        </div>

        {loading && (
          <p>
            Загрузка заявок...
          </p>
        )}

        {error && (
          <>
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
          </>
        )}

        {!loading &&
          !error &&
          tickets.length === 0 && (
            <div>
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
          )}

        {!loading &&
          !error &&
          tickets.length > 0 && (
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
    </div>
  );
}

export default Dashboard;