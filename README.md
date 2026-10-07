<div align="center">

# Виртуальный деканат

### Информационная система для автоматизации работы учебного подразделения

Full-stack веб-приложение для централизованной работы со студентами, сотрудниками, институтами, кафедрами, пользовательскими ролями и связанными справочниками.

![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1-6DB33F?logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Sessions-DC382D?logo=redis&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-7-007FFF?logo=mui&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

</div>

---

## О проекте

**Виртуальный деканат** - учебная информационная система, разработанная для автоматизации основных процессов работы деканата и структурных подразделений университета.

Проект построен по трёхзвенной архитектуре:

```text
Database ↔ Backend ↔ Frontend
```

и объединяет в одной системе:

- ведение студентов;
- ведение сотрудников;
- управление институтами;
- управление кафедрами;
- работу с должностями и подразделениями;
- регистрацию и авторизацию пользователей;
- ролевое разграничение доступа;
- работу со стипендиями;
- работу с документами;
- административное управление пользователями.

Проект создавался как практическая реализация информационной системы с полноценной цепочкой:

```text
PostgreSQL
    ↓
Spring Boot REST API
    ↓
React / TypeScript UI
```

> Проект является учебным pet-проектом и не является официальной информационной системой МГТУ «СТАНКИН».

---

# Цель проекта

Основная цель - разработать информационную систему **«Виртуальный деканат»**, которая объединяет данные учебного подразделения и предоставляет единый интерфейс для работы с ними.

В рамках проекта были проработаны:

```text
Предметная область
        ↓
ER-модель базы данных
        ↓
IDEF0
        ↓
DFD
        ↓
REST API
        ↓
Backend
        ↓
Frontend
        ↓
Тестирование
```

Система проектировалась не только как набор CRUD-экранов, но как информационная модель реальных процессов учебного подразделения.

---

# Архитектура

Общая архитектура приложения:

```text
┌────────────────────────────────────────────┐
│                 Frontend                   │
│                                            │
│ React + TypeScript                         │
│ Material UI                                │
│ Redux Toolkit                              │
│ React Router                               │
│ Axios                                      │
└────────────────────┬───────────────────────┘
                     │
                     │ HTTP / JSON
                     ▼
┌────────────────────────────────────────────┐
│                  Backend                   │
│                                            │
│ Java 17                                    │
│ Spring Boot                                │
│ Spring Web                                 │
│ Spring Security                            │
│ Spring Data JPA                            │
│ Spring Session                             │
└───────────────┬────────────────────┬───────┘
                │                    │
                ▼                    ▼
        PostgreSQL 15              Redis
                │                    │
                │                    └── HTTP sessions
                │
                └── Domain data
```

---

# Проектирование системы

До разработки приложения была сформирована модель предметной области.

Использовались:

- ER-модель;
- IDEF0;
- DFD;
- декомпозиция основных бизнес-процессов;
- REST API specification.

---

## ER-модель

В основе системы лежат сущности учебного подразделения.

Упрощённый фрагмент:

```text
Institute
    │
    │ 1:N
    ▼
Kafedra
    │
    ▼
Employee


Student
    │
    └── Person


Employee
    │
    ├── Person
    ├── JobTitle
    └── User


JobTitle
    │
    ▼
Subdivision


User
    │
    ├── Role
    └── Document
```

Связи между сущностями реализуются средствами JPA и внешними ключами PostgreSQL.

---

# IDEF0

В рамках проектирования была построена функциональная модель системы в нотации IDEF0.

Отдельно рассматривались процессы:

```text
Организовать работу со студентами
```

и:

```text
Организовать учебно-методическое управление
```

Для работы со студентами выполнялась дальнейшая декомпозиция.

---

## Работа со студентами

Функциональная модель описывает процессы:

```text
Переместить студентов
        │
        ├── Перевести студента
        ├── Отчислить студента
        ├── Оформить академический отпуск
        └── Восстановить студента
```

Таким образом проектирование системы охватывает не только хранение карточки студента, но и более широкий жизненный цикл работы с контингентом.

---

## Учебно-методическое управление

Отдельная ветвь функциональной модели описывает структуру учебного заведения:

```text
Организовать учебно-методическое управление
        │
        ├── Сформировать кафедры
        ├── Разделить кафедры по профилям
        ├── Распределить кафедры по институтам
        └── Сформировать институты
```

Эта модель стала основой для сущностей:

```text
Institute
Kafedra
Employee
Subdivision
JobTitle
```

---

# Backend

Backend реализован на:

```text
Java 17
Spring Boot 3.1
```

Основной URL REST API:

```text
http://localhost:8080/api/v1/
```

---

# Backend architecture

Проект использует классическую слоистую архитектуру:

```text
HTTP Request
     │
     ▼
Controller
     │
     ▼
Service
     │
     ▼
Repository
     │
     ▼
JPA / Hibernate
     │
     ▼
PostgreSQL
```

Основные пакеты:

```text
controller/
dto/
entity/
enumeration/
exception/
repository/
service/
```

---

## Controller layer

REST endpoints реализованы через:

```java
@RestController
```

и сгруппированы под:

```text
/api/v1/**
```

Пример структуры:

```text
StudentController
EmployeeController
InstituteController
KafedraController
ScholarshipController
DocumentController
SubdivisionController
JobTitleController
AuthController
```

---

## Service layer

Сервисный слой отвечает за:

- бизнес-логику;
- преобразование данных;
- проверку существования сущностей;
- работу с транзакциями;
- взаимодействие с Repository.

---

## Repository layer

Для доступа к данным используется:

```text
Spring Data JPA
```

Repository-интерфейсы работают с JPA entities и PostgreSQL.

---

# Аутентификация и безопасность

Для защиты API используется:

```text
Spring Security
```

Текущая версия репозитория использует **server-side session authentication**.

Схема:

```text
POST /auth/login
        │
        ▼
AuthenticationManager
        │
        ▼
SecurityContext
        │
        ▼
Spring Session
        │
        ▼
Redis
        │
        ▼
JSESSIONID
```

Frontend отправляет запросы с:

```ts
withCredentials: true
```

и браузер передаёт session cookie вместе с запросами.

---

# Redis

Redis используется для хранения пользовательских сессий.

```text
Browser
   │
   ▼
JSESSIONID
   │
   ▼
Spring Session
   │
   ▼
Redis
```

Это позволяет вынести session state за пределы памяти backend-приложения.

---

# Роли

На backend определены роли:

```text
ADMIN
STUDENT
EMPLOYEE
TUTOR
REGISTERED
```

Доступ к отдельным endpoint ограничивается через:

```java
@PreAuthorize(...)
```

Пример:

```java
@PreAuthorize("hasAuthority('ADMIN')")
```

или:

```java
@PreAuthorize("hasAnyAuthority('EMPLOYEE', 'ADMIN')")
```

---

# Административное управление ролями

Администратор может:

- получить список пользователей;
- получить список ролей;
- добавить пользователю роль;
- удалить роль;
- просмотреть текущие роли пользователя.

Endpoints:

```text
GET  /api/v1/auth/users
GET  /api/v1/auth/roles
POST /api/v1/auth/add_role
POST /api/v1/auth/remove_role
GET  /api/v1/auth/me
```

После удаления роли пользовательские сессии могут быть принудительно удалены из Redis.

---

# Студенты

Система содержит полноценный CRUD для студентов.

Структура:

```text
Student
│
├── id
├── Person
│   ├── surname
│   ├── name
│   ├── patronymic
│   └── phone
│
├── yearStarted
└── financialForm
```

Поддерживаются формы обучения:

```text
TARGETING
BUDGET
PAYMENT
```

---

## Возможности интерфейса студентов

Frontend позволяет:

- просматривать список студентов;
- выполнять поиск;
- фильтровать записи;
- сортировать данные;
- использовать пагинацию;
- создавать нового студента;
- редактировать существующего;
- удалять запись.

Маршруты:

```text
/students
/students/create
/students/:id
```

---

# Сотрудники

Основная модель:

```text
Employee
│
├── id
├── Person
├── JobTitle
└── User
```

Frontend отображает:

```text
Фамилия
Имя
Отчество
Телефон
Должность
Связанные данные
```

Реализованы:

- список сотрудников;
- поиск;
- создание;
- редактирование;
- удаление.

Маршруты:

```text
/employees
/employees/new
/employees/:id
```

CRUD сотрудников на backend предназначен для пользователей с ролью:

```text
ADMIN
```

---

# Институты

Сущность `Institute` содержит:

```text
id
name
email
phone
```

Система предоставляет два варианта представления.

### Информационный экран

Институты отображаются в виде карточек:

```text
Название
Email
Телефон
```

### Панель управления

Отдельно предусмотрен табличный административный интерфейс:

```text
/institutes/panel
```

с поиском, сортировкой, пагинацией и CRUD-операциями.

---

# Кафедры

Кафедра связана с институтом.

```text
Institute
    │
    │ 1:N
    ▼
Kafedra
```

Поля:

```text
Название
Email
Кабинет
Телефон
Статус учётных данных
Институт
```

Frontend позволяет:

- просматривать список;
- искать по нескольким полям;
- сортировать;
- создавать кафедру;
- редактировать;
- удалять.

Маршруты:

```text
/kafedras
/kafedras/create
/kafedras/:id
```

---

# Должности и подразделения

Backend содержит отдельные справочники:

```text
Subdivision
JobTitle
```

Связь:

```text
Subdivision
     │
     ▼
 JobTitle
     │
     ▼
 Employee
```

Для справочников реализованы REST CRUD endpoints.

---

# Стипендии

Система содержит сущность:

```text
Scholarship
```

Поля:

```text
id
name
amount
scholarshipType
```

Поддерживаемые типы:

```text
ACADEMIC
SOCIAL
PRESIDENT
```

Backend предоставляет полный CRUD.

---

# Документы

В backend предусмотрена сущность:

```text
Document
```

которая содержит:

```text
id
name
bytes
user
```

Документ связывается с конкретным пользователем.

Для документов реализованы:

```text
POST
GET
PUT
DELETE
```

---

# Frontend

Frontend построен на React и TypeScript.

Текущий стек репозитория:

| Технология | Назначение |
|---|---|
| **React 19** | пользовательский интерфейс |
| **TypeScript 5.7** | типизация |
| **Vite 6** | development server и build |
| **Material UI 7** | UI-компоненты |
| **Redux Toolkit** | global state |
| **React Redux** | интеграция Redux |
| **React Router 7** | маршрутизация |
| **Axios** | REST client |
| **Framer Motion** | анимации |
| **React PDF** | работа с PDF |

---

# Frontend structure

```text
src/
│
├── api/
│   └── axios.ts
│
├── components/
│   ├── AnimatedFormShell.tsx
│   ├── AnimatedTableShell.tsx
│   ├── ProtectedRoute.tsx
│   └── common/
│
├── features/
│   ├── admin/
│   ├── auth/
│   ├── students/
│   ├── employees/
│   ├── institutes/
│   └── kafedras/
│
├── hooks/
├── layouts/
├── types/
└── App.tsx
```

---

# Feature-based architecture

Каждая крупная функциональная область вынесена в отдельный feature.

Например:

```text
students/
│
├── components/
│   └── StudentTable.tsx
│
├── pages/
│   └── StudentFormPage.tsx
│
└── studentSlice.ts
```

Redux Toolkit используется для:

```text
API request
    ↓
Async thunk
    ↓
Redux slice
    ↓
React component
```

---

# UI / UX

Интерфейс использует общие визуальные компоненты:

```text
AnimatedTableShell
AnimatedFormShell
Sidebar
```

В проекте реализованы:

- единый стиль таблиц;
- общие формы создания и редактирования;
- боковая навигация;
- role-based отображение пунктов меню;
- анимации через Framer Motion;
- Material UI;
- адаптивное меню;
- светлая и тёмная темизация.

---

# Основные экраны

## Главная

Главная страница используется как сводный экран системы.

Она отображает основные разделы:

```text
Студенты
Институты
Кафедры
Сотрудники
```

---

## Авторизация

Экран авторизации содержит:

```text
Вход
Регистрация
```

После успешного входа пользователь получает доступ к функциональности в зависимости от своих ролей.

---

## Студенты

Таблица студентов содержит:

```text
ФИО
Телефон
Год поступления
Форма обучения
```

Поддерживаются:

```text
Поиск
Сортировка
Пагинация
Создание
Редактирование
Удаление
```

---

## Сотрудники

Экран позволяет работать с данными сотрудников и переходить к созданию или редактированию записей.

---

## Институты

Институты представлены:

- информационными карточками;
- административной таблицей.

---

## Кафедры

Таблица кафедр отображает:

```text
Название
Email
Кабинет
Телефон
Статус
Институт
```

---

## Панель управления

Административная панель используется для управления ролями зарегистрированных пользователей.

Пользователь может иметь несколько ролей одновременно.

---

# REST API

Base URL:

```text
http://localhost:8080/api/v1
```

---

## Auth

```text
POST /auth/register
POST /auth/login
GET  /auth/me
GET  /auth/users
GET  /auth/roles
POST /auth/add_role
POST /auth/remove_role
```

---

## Students

```text
POST   /students/create
GET    /students/getAll
GET    /students/{id}
PUT    /students/{id}
DELETE /students/{id}
```

---

## Employees

```text
POST   /employees/create
GET    /employees/getAll
GET    /employees/{id}
PUT    /employees/{id}
DELETE /employees/{id}
```

---

## Institutes

```text
POST   /institutes/create
GET    /institutes/getAll
GET    /institutes/{id}
PUT    /institutes/{id}
DELETE /institutes/{id}
```

---

## Kafedras

```text
POST   /kafedras/create
GET    /kafedras/getAll
GET    /kafedras/{id}
PUT    /kafedras/{id}
DELETE /kafedras/{id}
```

---

## Additional backend modules

Backend также содержит API для:

```text
/scholarships
/documents
/subdivisions
/job-titles
```

---

# OpenAPI / Swagger

В проекте находится спецификация:

```text
backend/src/main/resources/swagger.yaml
```

Она документирует основные CRUD endpoints системы.

Спецификацию можно открыть в Swagger Editor.

---

# Тестирование API

При разработке API использовался Postman.

В отчёте по защите проекта описана коллекция:

```text
Dekanat API
```

которая включала CRUD-запросы и проверки:

```text
HTTP status
JSON response
Response time
```

Тестирование охватывало:

- регистрацию;
- login;
- проверку авторизации;
- logout;
- работу с ролями;
- CRUD основных сущностей.

---

# Технологический стек

## Backend

| Технология | Назначение |
|---|---|
| Java 17 | основной язык |
| Spring Boot 3.1 | application framework |
| Spring Web | REST API |
| Spring Security | безопасность |
| Spring Data JPA | persistence |
| Hibernate | ORM |
| Spring Session | server-side sessions |
| Spring Data Redis | session storage |
| PostgreSQL 15 | основная СУБД |
| Lombok | сокращение boilerplate |
| Maven | dependency management и build |
| Docker | контейнеризация |

---

## Frontend

| Технология | Назначение |
|---|---|
| React 19 | UI |
| TypeScript 5.7 | типизация |
| Vite 6 | сборка |
| Material UI 7 | компоненты |
| Redux Toolkit | state management |
| React Router | routing |
| Axios | HTTP client |
| Framer Motion | анимации |

---

# Структура репозитория

```text
dekanat_stankin_pet_project/
│
├── backend/
│   ├── src/main/java/com/example/sessionauth/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── enumeration/
│   │   ├── exception/
│   │   ├── repository/
│   │   └── service/
│   │
│   ├── src/main/resources/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   └── types/
│   │
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
└── README.md
```

---

# Запуск проекта

## Требования

Для запуска потребуются:

```text
Docker
Node.js
npm
```

При локальном запуске backend без Docker:

```text
Java 17
Maven
PostgreSQL
Redis
```

---

# Вариант 1. Backend через Docker Compose

Перейти в:

```bash
cd backend
```

Запустить:

```bash
docker compose up -d --build
```

Будут подняты:

```text
backend     :8080
PostgreSQL  :5432
Redis       :6379
```

---

# Frontend

В отдельном терминале:

```bash
cd frontend
npm install
npm run dev
```

После запуска Vite приложение будет доступно по адресу:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080/api/v1/
```

---

# Локальный запуск backend

Если PostgreSQL и Redis запущены локально:

```bash
cd backend
./mvnw spring-boot:run
```

Windows:

```powershell
mvnw.cmd spring-boot:run
```

---

# Production build

## Backend

```bash
cd backend
./mvnw clean package
```

JAR-файл будет создан в:

```text
target/
```

---

## Frontend

```bash
cd frontend
npm run build
```

Результат:

```text
frontend/dist/
```

---

# Docker infrastructure

`docker-compose.yml` поднимает:

```text
backend
db
redis
```

Схема:

```text
               Spring Boot
                  :8080
                 /     \
                /       \
               ▼         ▼
        PostgreSQL      Redis
           :5432        :6379
```

---

# Результаты проекта

В отчёте по защите проекта были зафиксированы следующие результаты:

| Метрика | Значение |
|---|---|
| Основные CRUD-модули | Students, Institutes, Kafedras, Employees |
| Среднее время GET API | около 120 мс |
| Среднее время POST API | около 180 мс |
| Lighthouse Performance frontend | 97 / 100 |
| Unit tests backend | 62 |

Эти показатели относятся к версии проекта, представленной в отчёте по защите.

---

# Текущая версия репозитория и отчёт

Проект продолжал изменяться после версии, описанной в отчёте.

Поэтому между отчётом и текущим кодом есть несколько различий.

## Frontend versions

В отчёте использовались:

```text
React 18
TypeScript 5
Material UI 5
```

В текущем репозитории:

```text
React 19
TypeScript 5.7
Material UI 7
Vite 6
```

---

## Authentication model

В отчёте часть схемы безопасности описана через JWT.

В текущем backend используется:

```text
Spring Security
+
Spring Session
+
Redis
+
JSESSIONID
```

То есть фактическая текущая модель - server-side session authentication.

---

# Текущее состояние

| Возможность | Состояние |
|---|---|
| Трёхзвенная архитектура | Реализовано |
| PostgreSQL | Реализовано |
| Spring Boot REST API | Реализовано |
| React frontend | Реализовано |
| Регистрация | Реализовано |
| Авторизация | Реализовано |
| Роли | Реализовано |
| Redis sessions | Реализовано |
| Students CRUD | Реализовано |
| Employees CRUD | Реализовано |
| Institutes CRUD | Реализовано |
| Kafedras CRUD | Реализовано |
| Scholarships CRUD | Backend |
| Documents CRUD | Backend |
| Subdivisions CRUD | Backend |
| Job Titles CRUD | Backend |
| Admin role management | Реализовано |
| Docker Compose | Реализовано |
| OpenAPI specification | Присутствует |
| Frontend для всех backend-модулей | Частично |

---

# Возможное развитие

Следующими этапами развития могут стать:

```text
Учебные группы
Расписание
Дисциплины
Успеваемость
Посещаемость
Приказы
Заявления
Академические отпуска
Переводы
Отчисления
Восстановления
```

Это позволит приблизить программную реализацию к полной функциональной модели, разработанной в IDEF0.

Технические направления развития:

- миграции БД через Flyway или Liquibase;
- frontend для документов и стипендий;
- полноценный файловый storage;
- server-side pagination;
- фильтрация на уровне API;
- унификация role model;
- синхронизация OpenAPI с session-based authentication;
- интеграционные тесты;
- CI/CD;
- audit log действий пользователей;
- Docker-контейнеризация frontend.

---

# Что демонстрирует проект

Проект объединяет основные компоненты современной web-информационной системы:

```text
Database design
      │
      ▼
PostgreSQL
      │
      ▼
JPA / Hibernate
      │
      ▼
Service Layer
      │
      ▼
REST API
      │
      ▼
Spring Security
      │
      ▼
React / TypeScript
      │
      ▼
User Interface
```

Кроме непосредственно программной реализации проект включает формальное проектирование процессов через ER, IDEF0 и DFD, что позволяет связать архитектуру приложения с предметной областью учебного учреждения.

---

<div align="center">

### Virtual Dean's Office

**Java · Spring Boot · PostgreSQL · Redis · React · TypeScript · Material UI**

Учебная full-stack информационная система

</div>
