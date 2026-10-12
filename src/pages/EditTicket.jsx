import { useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('equipment');
  const [status, setStatus] = useState('new');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

      const ticket = data.ticket;

      setTitle(ticket.title || '');
      setDescription(ticket.description || '');
      setPriority(ticket.priority || 'medium');
      setCategory(ticket.category || 'equipment');
      setStatus(ticket.status || 'new');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');

    if (!title.trim()) {
      setError('Введите название заявки');
      return;
    }

    if (!description.trim()) {
      setError('Введите описание проблемы');
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `http://localhost:3000/api/tickets/${id}`,
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          credentials: 'include',

          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            priority,
            category,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Не удалось изменить заявку'
        );
      }

      navigate(`/tickets/${id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h1>Редактирование заявки</h1>

        <p>
          Загрузка заявки...
        </p>
      </div>
    );
  }

  if (error && !title && !description) {
    return (
      <div className="page">
        <h1>Редактирование заявки</h1>

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

  return (
    <div className="page">
      <h1>Редактирование заявки</h1>

      <p>
        Измените необходимые данные заявки.
      </p>

      <form
        className="form ticket-form"
        onSubmit={handleSubmit}
      >
        <label>
          Название заявки

          <input
            type="text"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            placeholder="Название заявки"
            required
          />
        </label>

        <label>
          Описание проблемы

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Описание проблемы"
            rows="6"
            required
          />
        </label>

        <label>
          Категория

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option value="equipment">
              Оборудование
            </option>

            <option value="software">
              Программное обеспечение
            </option>

            <option value="network">
              Сеть и интернет
            </option>
          </select>
        </label>

        <label>
          Приоритет

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
          >
            <option value="low">
              Низкий
            </option>

            <option value="medium">
              Средний
            </option>

            <option value="high">
              Высокий
            </option>
          </select>
        </label>

        <label>
          Статус

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="new">
              Новая
            </option>

            <option value="in progress">
              В работе
            </option>

            <option value="resolved">
              Решена
            </option>
          </select>
        </label>

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <div className="form-buttons">
          <button
            type="submit"
            className="button"
            disabled={saving}
          >
            {saving
              ? 'Сохранение...'
              : 'Сохранить изменения'}
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              navigate(`/tickets/${id}`)
            }
            disabled={saving}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTicket;