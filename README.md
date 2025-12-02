

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# NestJS Project

A scalable and modular backend application built with **NestJS** and connected to **MongoDB** using **Mongoose**.  
This project follows a clean, maintainable, and enterprise-ready folder structure.

---

## 🚀 Features

- Modular architecture  
- MongoDB integration with Mongoose  
- Feature-based folder structure  
- Centralized configuration  
- Reusable common utilities (guards, pipes, filters, interceptors)  
- DTO validation and schema-based models  

---

## 📁 Folder Structure

src/
│
├── common/
│ ├── decorators/
│ ├── filters/
│ ├── interceptors/
│ ├── middleware/
│ ├── pipes/
│ └── guards/
│
├── config/
│ ├── database.config.ts
│ ├── app.config.ts
│ └── other-configs.ts
│
├── modules/
│ ├── users/
│ │ ├── dto/
│ │ ├── schemas/
│ │ ├── users.controller.ts
│ │ ├── users.service.ts
│ │ ├── users.module.ts
│ │ └── users.repository.ts
│ │
│ ├── auth/
│ │ ├── dto/
│ │ ├── auth.controller.ts
│ │ ├── auth.service.ts
│ │ └── auth.module.ts
│ │
│ └── other-feature-modules/
│
├── database/
│ ├── mongoose.module.ts
│ └── schemas/
│
├── utils/
│ ├── logger.ts
│ └── helpers.ts
│
├── constants/
│ └── index.ts
│
├── app.module.ts
└── main.ts