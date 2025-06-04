# Stimulus Cloud

Stimulus Cloud is a full-stack platform for project management, supplier collaboration, and reporting. The repository is organized as a monorepo, containing backend services, frontend applications, data loading tools, infrastructure as code, end-to-end tests, and more.

## Table of Contents

- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

```
.
├── backend-services/      # Backend microservices (NestJS, TypeScript)
├── frontend-app/          # Main React frontend application
├── data_load_tools/       # Data import and migration scripts
├── e2e-tests/             # Cypress end-to-end tests
├── infrastructure/        # Infrastructure as code (e.g., Azure, Kubernetes)
├── maintenance-screen/    # Maintenance mode frontend
├── reporting/             # Reporting tools and CLI
├── .github/               # GitHub workflows and CODEOWNERS
├── nx.json, package.json  # Monorepo and package management
└── ...                    # Other configuration files
```

## Tech Stack

- **Frontend:** React, TypeScript, Chakra UI, Material-UI, i18next
- **Backend:** NestJS, TypeScript, GraphQL, PostgreSQL
- **Testing:** Cypress (E2E), Jest (unit)
- **Infrastructure:** Azure, Kubernetes, Terraform/ARM
- **Monorepo:** Nx

## Getting Started

### Prerequisites

- Node.js (see `.tool-versions` for version)
- Yarn or npm
- Docker (for local infrastructure)
- [Nx CLI](https://nx.dev/)

### Install Dependencies

```sh
npm install
# or
yarn install
```

### Environment Setup

- Copy `.env.example` to `.env` in relevant packages and fill in required variables.
- For backend, configure database and service credentials.
- For frontend, set API endpoints and authentication configs.

### Run Applications

#### Frontend

```sh
cd frontend-app
npm start
```

#### Backend

```sh
cd backend-services
npm run start:dev
```

#### Data Load Tools

```sh
cd data_load_tools
npm run start
```

## Development

- Use Nx for running, building, and testing apps and libs.
- Code formatting is enforced via Prettier (`.prettierrc`).
- Linting and code quality via SonarQube (`sonar-project.properties`).

## Testing

### Unit Tests

```sh
nx test <project>
```

### End-to-End Tests

```sh
cd e2e-tests
npx cypress open
```

## Deployment

- CI/CD is managed via GitHub Actions ([.github/workflows/](.github/workflows/)).
- Infrastructure as code is in the `infrastructure/` directory.
- See `maintenance.yml` and `ellipsis.yaml` for maintenance and deployment configs.

## Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests.
3. Run lint and tests before pushing.
4. Submit a pull request.

See [CODEOWNERS](.github/CODEOWNERS) for code ownership.

## License

[MIT](LICENSE) (or your actual license)