import { Link } from 'react-router-dom';

function TicketCard({ ticket }) {
  return (
    <article className="ticket-card">
      <h2>{ticket.title}</h2>

      <p className="ticket-description">
        {ticket.description}
      </p>

      <div className="ticket-info">
        <span>
          Категория: {ticket.category}
        </span>

        <span>
          Приоритет: {ticket.priority}
        </span>

        <span>
          Статус: {ticket.status}
        </span>
      </div>

      <Link
        to={`/tickets/${ticket.id}`}
        className="button"
      >
        Подробнее
      </Link>
    </article>
  );
}

export default TicketCard;