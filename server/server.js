import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = 3000;

const usersFile = path.join(
  __dirname,
  'users.json'
);

const ticketsFile = path.join(
  __dirname,
  'tickets.json'
);

const apiStatusesFile = path.join(
  __dirname,
  'apiStatuses.json'
);

/* =========================
   НАСТРОЙКИ СЕРВЕРА
========================= */

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    secret: 'it-support-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

/* =========================
   ПОЛЬЗОВАТЕЛИ
========================= */

function getUsers() {
  if (!fs.existsSync(usersFile)) {
    return [];
  }

  const data = fs.readFileSync(
    usersFile,
    'utf-8'
  );

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

function saveUsers(users) {
  fs.writeFileSync(
    usersFile,
    JSON.stringify(users, null, 2)
  );
}

/* =========================
   РЕГИСТРАЦИЯ
========================= */

app.post(
  '/api/auth/register',
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: 'Заполните все поля',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message:
            'Пароль должен содержать минимум 6 символов',
        });
      }

      const users = getUsers();

      const normalizedEmail =
        email.trim().toLowerCase();

      const existingUser =
        users.find(
          (user) =>
            user.email === normalizedEmail
        );

      if (existingUser) {
        return res.status(409).json({
          message:
            'Пользователь с таким email уже существует',
        });
      }

      const passwordHash =
        await bcrypt.hash(
          password,
          10
        );

      const newUser = {
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: 'user',
        createdAt:
          new Date().toISOString(),
      };

      users.push(newUser);

      saveUsers(users);

      req.session.user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      };

      res.status(201).json({
        message:
          'Регистрация выполнена успешно',
        user: req.session.user,
      });
    } catch (error) {
      console.error(
        'Ошибка регистрации:',
        error
      );

      res.status(500).json({
        message: 'Ошибка сервера',
      });
    }
  }
);

/* =========================
   ВХОД
========================= */

app.post(
  '/api/auth/login',
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message:
            'Введите email и пароль',
        });
      }

      const users = getUsers();

      const normalizedEmail =
        email.trim().toLowerCase();

      const user = users.find(
        (item) =>
          item.email === normalizedEmail
      );

      if (!user) {
        return res.status(401).json({
          message:
            'Неверный email или пароль',
        });
      }

      const passwordIsCorrect =
        await bcrypt.compare(
          password,
          user.passwordHash
        );

      if (!passwordIsCorrect) {
        return res.status(401).json({
          message:
            'Неверный email или пароль',
        });
      }

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      };

      res.json({
        message:
          'Вход выполнен успешно',
        user: req.session.user,
      });
    } catch (error) {
      console.error(
        'Ошибка входа:',
        error
      );

      res.status(500).json({
        message: 'Ошибка сервера',
      });
    }
  }
);

/* =========================
   ПРОВЕРКА АВТОРИЗАЦИИ
========================= */

app.get(
  '/api/auth/me',
  (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({
        message:
          'Пользователь не авторизован',
      });
    }

    res.json({
      user: req.session.user,
    });
  }
);

/* =========================
   ВЫХОД
========================= */

app.post(
  '/api/auth/logout',
  (req, res) => {
    req.session.destroy(
      (error) => {
        if (error) {
          console.error(
            'Ошибка выхода:',
            error
          );

          return res.status(500).json({
            message:
              'Не удалось выйти из аккаунта',
          });
        }

        res.clearCookie(
          'connect.sid'
        );

        res.json({
          message:
            'Выход выполнен успешно',
        });
      }
    );
  }
);

/* =========================
   ПРОФИЛЬ
========================= */

app.get(
  '/api/profile',
  (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({
        message:
          'Необходима авторизация',
      });
    }

    res.json({
      user: req.session.user,
    });
  }
);

/* =========================
   РАБОТА С ЗАЯВКАМИ
========================= */

function getTickets() {
  if (!fs.existsSync(ticketsFile)) {
    return [];
  }

  const data = fs.readFileSync(
    ticketsFile,
    'utf-8'
  );

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

function saveTickets(tickets) {
  fs.writeFileSync(
    ticketsFile,
    JSON.stringify(
      tickets,
      null,
      2
    )
  );
}

/* =========================
   API STATUSES
========================= */

function getApiStatuses() {
  if (!fs.existsSync(apiStatusesFile)) {
    return [];
  }

  const data = fs.readFileSync(
    apiStatusesFile,
    'utf-8'
  );

  if (!data) {
    return [];
  }

  return JSON.parse(data);
}

function saveApiStatuses(statuses) {
  fs.writeFileSync(
    apiStatusesFile,
    JSON.stringify(
      statuses,
      null,
      2
    )
  );
}

/* =========================
   ПОЛУЧИТЬ ТОЛЬКО СВОИ ЗАЯВКИ
   ДЛЯ ЛИЧНОГО КАБИНЕТА
========================= */

app.get(
  '/api/tickets/my',
  (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({
        message:
          'Необходима авторизация',
      });
    }

    const tickets = getTickets();

    const userTickets =
      tickets.filter(
        (ticket) =>
          ticket.userId ===
          req.session.user.id
      );

    res.json({
      tickets: userTickets,
    });
  }
);

/* =========================
   ПОЛУЧИТЬ ЗАЯВКИ
========================= */

app.get(
  '/api/tickets',
  (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({
        message:
          'Необходима авторизация',
      });
    }

    const tickets = getTickets();

    // Администратор видит все заявки
    if (req.session.user.role === 'admin') {
      return res.json({
        tickets,
      });
    }

    // Обычный пользователь
    // видит только свои заявки
    const userTickets =
      tickets.filter(
        (ticket) =>
          ticket.userId ===
          req.session.user.id
      );

    res.json({
      tickets: userTickets,
    });
  }
);

/* =========================
   СОЗДАТЬ ЗАЯВКУ
========================= */

app.post(
  '/api/tickets',
  (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({
        message:
          'Необходима авторизация',
      });
    }

    const {
      title,
      description,
      priority,
      category,
    } = req.body;

    if (
      !title ||
      !description
    ) {
      return res.status(400).json({
        message:
          'Заполните название и описание заявки',
      });
    }

    const tickets = getTickets();

    const newTicket = {
      id: Date.now().toString(),

      title:
        title.trim(),

      description:
        description.trim(),

      priority:
        priority || 'medium',

      status: 'new',

      category:
        category || 'equipment',

      userId:
        req.session.user.id,

      createdAt:
        new Date().toISOString(),
    };

    tickets.push(newTicket);

    saveTickets(tickets);

    res.status(201).json({
      message:
        'Заявка успешно создана',

      ticket: newTicket,
    });
  }
);

/* =========================
   ПОЛУЧИТЬ ОДНУ ЗАЯВКУ
========================= */

app.get(
  '/api/tickets/:id',
  (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({
        message:
          'Необходима авторизация',
      });
    }

    const { id } = req.params;

    const tickets = getTickets();

    const ticket = tickets.find(
      (item) =>
        item.id === id
    );

    if (!ticket) {
      return res.status(404).json({
        message:
          'Заявка не найдена',
      });
    }

    const isOwner =
      ticket.userId ===
      req.session.user.id;

    const isAdmin =
      req.session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message:
          'Вы не можете просматривать чужую заявку',
      });
    }

    res.json({
      ticket,
    });
  }
);

/* =========================
   ИЗМЕНИТЬ ЗАЯВКУ
========================= */

app.put(
  '/api/tickets/:id',
  (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({
        message:
          'Необходима авторизация',
      });
    }

    const { id } = req.params;

    const {
      title,
      description,
      priority,
      category,
      status,
    } = req.body;

    const tickets = getTickets();

    const ticketIndex =
      tickets.findIndex(
        (ticket) =>
          ticket.id === id
      );

    if (ticketIndex === -1) {
      return res.status(404).json({
        message:
          'Заявка не найдена',
      });
    }

    const ticket =
      tickets[ticketIndex];

    const isOwner =
      ticket.userId ===
      req.session.user.id;

    const isAdmin =
      req.session.user.role === 'admin';

    /* =========================
       АДМИНИСТРАТОР
========================= */

    if (isAdmin && !isOwner) {
      const allowedStatuses = [
        'new',
        'in progress',
        'resolved',
      ];

      if (!status) {
        return res.status(400).json({
          message:
            'Для администратора можно изменить только статус заявки',
        });
      }

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message:
            'Недопустимый статус заявки',
        });
      }

      tickets[ticketIndex] = {
        ...ticket,
        status,
      };

      saveTickets(tickets);

      return res.json({
        message:
          'Статус заявки успешно изменён',

        ticket:
          tickets[ticketIndex],
      });
    }

    /* =========================
       ВЛАДЕЛЕЦ ЗАЯВКИ
========================= */

    if (!isOwner) {
      return res.status(403).json({
        message:
          'Вы не можете изменять чужую заявку',
      });
    }

    if (
      !title ||
      !description
    ) {
      return res.status(400).json({
        message:
          'Заполните название и описание заявки',
      });
    }

    const allowedStatuses = [
      'new',
      'in progress',
      'resolved',
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          'Недопустимый статус заявки',
      });
    }

    tickets[ticketIndex] = {
      ...ticket,

      title:
        title.trim(),

      description:
        description.trim(),

      priority:
        priority ||
        ticket.priority,

      category:
        category ||
        ticket.category,

      status:
        status ||
        ticket.status,
    };

    saveTickets(tickets);

    res.json({
      message:
        'Заявка успешно изменена',

      ticket:
        tickets[ticketIndex],
    });
  }
);

/* =========================
   ЗАПУСК СЕРВЕРА
========================= */

app.listen(
  PORT,
  () => {
    console.log(
      `Server started: http://localhost:${PORT}`
    );
  }
);