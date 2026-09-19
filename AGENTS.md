# Project Architecture & Coding Rules

## 1. Expo SDK Version
- **Expo Version**: Expo SDK 57 (React 19, React Native 0.86).
- **Documentation**: Always consult the exact versioned documentation at https://docs.expo.dev/versions/v57.0.0/ before writing or updating any Expo native configuration or package usage.

---

## 2. Language Standard
- **English Only**: All text output MUST be in **English**.
  - UI copy, labels, placeholders, and error messages.
  - Console logs and LogRotator output.
  - Code comments and documentation.
  - Commit messages and pull request descriptions.

---

## 3. Architecture Pattern: Repository – Service – Hook – View
The codebase strictly follows a decoupled, layered architecture:
```text
UI (Screen / Component) ➔ Hook (Controller) ➔ Single-Action Service ➔ Repository ➔ ApiClient / Storage
```
- **UI Components (`src/app/`, `src/components/`)**: Only responsible for rendering JSX and handling user interaction events. NEVER call `apiClient`, `fetch`, or repositories directly.
- **Hooks (`src/hooks/`)**: Act as Controllers / ViewModels. Manage lifecycle, state (`data`, `loading`, `error`), and invoke Services.
- **Services (`src/services/`)**: Encapsulate business logic, calculations, and validation rules.
- **Repositories (`src/repositories/`)**: Abstract data access (remote API vs local cache/storage).
- **API Client (`src/api/apiClient.ts`)**: Handles HTTP transport, timeout, authentication headers, and network logging.
- **Storage (`src/storage/secureStorage.ts`)**: Handles encrypted credentials and tokens via `expo-secure-store`.

---

## 4. Single-Action Service Rule ("1 Service = 1 Function")
To maintain high cohesion, modularity, and easy testability:
- **Rule**: Each service file must have **exactly one primary responsibility / function** (Single Responsibility Principle / Command Pattern).
- **Naming**: Name the service file after the action it performs:
  - Format: `<action><Entity>Service.ts`
  - Examples:
    - `checkHealthService.ts`
    - `fetchProductListService.ts`
    - `getProductDetailService.ts`
    - `createOrderService.ts`
- **Structure**:
  Each service must export either a single function or a class with an `execute()` method:
  ```typescript
  // Example: src/services/health/checkHealthService.ts
  import { healthRepository, IHealthRepository } from '@/repositories/healthRepository';
  import { HealthCheckResult, HealthStatus } from '@/types/health.types';
  import { logger } from '@/utils/logger';

  const log = logger.createScope('CheckHealthService');

  export class CheckHealthService {
    constructor(private readonly repo: IHealthRepository = healthRepository) {}

    async execute(): Promise<HealthCheckResult> {
      log.info('Executing system health evaluation...');
      // Business logic goes here...
    }
  }

  export const checkHealthService = new CheckHealthService();
  ```
- **No God Services**: Avoid monolithic service classes like `UserService` that contain 15+ different CRUD methods. Break them down into separate single-action service files grouped in a feature folder (e.g. `src/services/user/`).

---

## 5. Logging & Observability
- Use the central scoped logger:
  ```typescript
  import { logger } from '@/utils/logger';
  const log = logger.createScope('ModuleName');
  ```
- Never use raw `console.log` in services, repositories, or components.
- Use appropriate log levels:
  - `log.debug(...)`: Fine-grained data / inspection (silenced in production).
  - `log.info(...)`: Milestone / operational events (silenced in production).
  - `log.warn(...)`: Non-fatal issues / degraded conditions.
  - `log.error(...)`: Recovered or caught exceptions.
- All logs are automatically streamed to `logRotator` on device storage.

---

## 6. Environment Variables & Credentials
- Access environment variables using the `EXPO_PUBLIC_` prefix:
  - `process.env.EXPO_PUBLIC_API_URL`
- Never commit `.env` or sensitive API keys. Use `.env.example` as the canonical template.
- Store sensitive tokens (JWT, auth tokens) in `SecureStorage` (`expo-secure-store`), never in plain `AsyncStorage`.
