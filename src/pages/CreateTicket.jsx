import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateTicket() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('equipment');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      const response = await fetch(
        'http://localhost:3000/api/tickets',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            priority,
            category,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Не удалось создать заявку'
        );
      }

      navigate('/tickets');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Создание заявки</h1>

      <p>
        Опишите проблему, с которой вам нужна помощь.
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
            placeholder="Например: Не работает компьютер"
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
            placeholder="Подробно опишите проблему"
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

        {error && (
          <p className="error">
            {error}
          </p>
        )}

        <div className="form-buttons">
          <button
            type="submit"
            className="button"
            disabled={loading}
          >
            {loading
              ? 'Создание...'
              : 'Создать заявку'}
          </button>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate('/tickets')}
            disabled={loading}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTicket;