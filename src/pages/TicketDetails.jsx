import { useContext, useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

function TicketDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTicket();
  }, [id]);

  async function fetchTicket() {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(
        `http://localhost:3000/api/tickets/${id}`,
        {
          credentials: 'include',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Не удалось загрузить заявку'
        );
      }

      setTicket(data.ticket);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p>Загрузка заявки...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Заявка</h1>

        <p className="error">
          {error}
        </p>

        <Link
          to="/dashboard"
          className="button"
        >
          Вернуться в личный кабинет
        </Link>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page">
        <h1>Заявка не найдена</h1>

        <Link
          to="/dashboard"
          className="button"
        >
          Вернуться в личный кабинет
        </Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{ticket.title}</h1>

      <section className="ticket-details">
        <p>
          <strong>Описание:</strong>
        </p>

        <p>
          {ticket.description}
        </p>

        <div className="ticket-details-info">
          <p>
            <strong>Категория:</strong>{' '}
            {ticket.category}
          </p>

          <p>
            <strong>Приоритет:</strong>{' '}
            {ticket.priority}
          </p>

          <p>
            <strong>Статус:</strong>{' '}
            {ticket.status}
          </p>

          <p>
            <strong>Дата создания:</strong>{' '}
            {new Date(
              ticket.createdAt
            ).toLocaleString('ru-RU')}
          </p>
        </div>

        <div className="form-buttons">
          <Link
            to={`/tickets/${ticket.id}/edit`}
            className="button"
          >
            Изменить заявку
          </Link>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Назад
          </button>
        </div>
      </section>
    </div>
  );
}

export default TicketDetails;