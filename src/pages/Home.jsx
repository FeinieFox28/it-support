import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="page">

      <section className="home-hero">
        <h1>IT Support</h1>

        <p className="home-subtitle">
          Система заявок IT-отдела
        </p>

        <p>
          Удобная система для создания, просмотра
          и отслеживания обращений в IT-отдел.
          Здесь вы можете сообщить о технической
          проблеме и следить за её решением.
        </p>

        <div className="home-buttons">
          <Link
            to="/tickets"
            className="button"
          >
            Посмотреть заявки
          </Link>

          <Link
            to="/tickets/create"
            className="button button-secondary"
          >
            Создать заявку
          </Link>
        </div>
      </section>

      <section className="home-section">
        <h2>Что можно сделать в системе?</h2>

        <div className="home-features">

          <article className="home-feature">
            <h3>Создать заявку</h3>

            <p>
              Опишите проблему, укажите её категорию
              и приоритет. Заявка будет сохранена
              в системе и доступна для дальнейшего
              отслеживания.
            </p>
          </article>

          <article className="home-feature">
            <h3>Отслеживать статус</h3>

            <p>
              Каждая заявка имеет статус. Вы можете
              узнать, является ли проблема новой,
              находится ли она в работе или уже решена.
            </p>
          </article>

          <article className="home-feature">
            <h3>Управлять заявками</h3>

            <p>
              В личном кабинете пользователь может
              просматривать свои обращения и изменять
              информацию о них.
            </p>
          </article>

          <article className="home-feature">
            <h3>Работа администратора</h3>

            <p>
              Администратор IT-отдела может просматривать
              заявки пользователей и изменять их статус
              в процессе обработки.
            </p>
          </article>

        </div>
      </section>

      <section className="home-section">
        <h2>Как работает система?</h2>

        <div className="home-steps">

          <div className="home-step">
            <span>1</span>

            <div>
              <h3>Создание</h3>

              <p>
                Пользователь создаёт заявку
                и описывает возникшую проблему.
              </p>
            </div>
          </div>

          <div className="home-step">
            <span>2</span>

            <div>
              <h3>Обработка</h3>

              <p>
                IT-отдел получает заявку и приступает
                к решению проблемы.
              </p>
            </div>
          </div>

          <div className="home-step">
            <span>3</span>

            <div>
              <h3>Изменение статуса</h3>

              <p>
                По мере работы над заявкой её статус
                изменяется.
              </p>
            </div>
          </div>

          <div className="home-step">
            <span>4</span>

            <div>
              <h3>Решение</h3>

              <p>
                После устранения проблемы заявка
                получает статус «Решена».
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="home-section home-info">
        <h2>Основные категории обращений</h2>

        <div className="home-categories">
          <div>
            <h3>Оборудование</h3>
            <p>
              Проблемы с компьютерами, мониторами,
              принтерами и другим оборудованием.
            </p>
          </div>

          <div>
            <h3>Программное обеспечение</h3>
            <p>
              Ошибки программ, установка приложений
              и проблемы с работой программного обеспечения.
            </p>
          </div>

          <div>
            <h3>Сеть и интернет</h3>
            <p>
              Проблемы с подключением к интернету,
              локальной сетью и доступом к ресурсам.
            </p>
          </div>
        </div>
      </section>

      <section className="home-section home-final">
        <h2>Нужна помощь?</h2>

        <p>
          Если у вас возникла техническая проблема,
          создайте заявку и подробно опишите ситуацию.
          IT-отдел сможет ознакомиться с обращением
          и начать его обработку.
        </p>

        <Link
          to="/tickets/create"
          className="button"
        >
          Создать заявку
        </Link>
      </section>

    </div>
  );
}

export default Home;