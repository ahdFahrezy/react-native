#!/usr/bin/env node

/**
 * Module Scaffolding Generator (Artisan-like)
 * Follows the "1 Service = 1 Function" pattern and English-only rules.
 * Usage: node scripts/make-module.js <module-name>
 * Example: npm run make:module user
 */

const fs = require('fs');
const path = require('path');

const moduleArg = process.argv[2];

if (!moduleArg) {
  console.error('\n❌ Please provide a module name!\nExample: npm run make:module user\n');
  process.exit(1);
}

// Name formatting
const rawName = moduleArg.toLowerCase().trim();
const PascalCase = rawName.charAt(0).toUpperCase() + rawName.slice(1);
const camelCase = rawName;
const kebabCase = rawName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

console.log(`\n🚀 Generating new module: ${PascalCase} (${kebabCase})...\n`);

const ROOT_DIR = path.resolve(__dirname, '..');

// Helper to write file safely
function writeSafe(filePath, content) {
  const absolutePath = path.join(ROOT_DIR, filePath);
  const dir = path.dirname(absolutePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(absolutePath)) {
    console.log(`  ⚠️  Skipped: ${filePath} (already exists)`);
    return;
  }

  fs.writeFileSync(absolutePath, content.trim() + '\n', 'utf-8');
  console.log(`  ✅ Created: ${filePath}`);
}

// 1. Types
writeSafe(
  `src/types/${kebabCase}.types.ts`,
  `export interface ${PascalCase} {
  id: string;
  name: string;
  createdAt?: string;
}

export interface Create${PascalCase}DTO {
  name: string;
}
`
);

// 2. Repository
writeSafe(
  `src/repositories/${camelCase}Repository.ts`,
  `import { apiClient } from '@/api/apiClient';
import { ${PascalCase}, Create${PascalCase}DTO } from '@/types/${kebabCase}.types';

export interface I${PascalCase}Repository {
  getAll(): Promise<${PascalCase}[]>;
  getById(id: string): Promise<${PascalCase}>;
  create(payload: Create${PascalCase}DTO): Promise<${PascalCase}>;
}

export class ${PascalCase}Repository implements I${PascalCase}Repository {
  async getAll(): Promise<${PascalCase}[]> {
    return apiClient.get<${PascalCase}[]>('/${kebabCase}s');
  }

  async getById(id: string): Promise<${PascalCase}> {
    return apiClient.get<${PascalCase}>(\`/${kebabCase}s/\${id}\`);
  }

  async create(payload: Create${PascalCase}DTO): Promise<${PascalCase}> {
    return apiClient.post<${PascalCase}>('/${kebabCase}s', payload);
  }
}

export const ${camelCase}Repository = new ${PascalCase}Repository();
`
);

// 3. Single-Action Services (1 Service = 1 Function)
writeSafe(
  `src/services/${kebabCase}/fetch${PascalCase}ListService.ts`,
  `import { ${camelCase}Repository, I${PascalCase}Repository } from '@/repositories/${camelCase}Repository';
import { ${PascalCase} } from '@/types/${kebabCase}.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('Fetch${PascalCase}ListService');

/**
 * Single-action service: Fetch list of ${PascalCase} items.
 */
export class Fetch${PascalCase}ListService {
  constructor(private readonly repo: I${PascalCase}Repository = ${camelCase}Repository) {}

  async execute(): Promise<${PascalCase}[]> {
    log.info('Fetching ${kebabCase} list...');
    const list = await this.repo.getAll();
    log.info(\`Successfully fetched \${list.length} ${kebabCase}(s)\`);
    return list;
  }
}

export const fetch${PascalCase}ListService = new Fetch${PascalCase}ListService();
`
);

writeSafe(
  `src/services/${kebabCase}/create${PascalCase}Service.ts`,
  `import { ${camelCase}Repository, I${PascalCase}Repository } from '@/repositories/${camelCase}Repository';
import { ${PascalCase}, Create${PascalCase}DTO } from '@/types/${kebabCase}.types';
import { logger } from '@/utils/logger';

const log = logger.createScope('Create${PascalCase}Service');

/**
 * Single-action service: Create a new ${PascalCase} item.
 */
export class Create${PascalCase}Service {
  constructor(private readonly repo: I${PascalCase}Repository = ${camelCase}Repository) {}

  async execute(payload: Create${PascalCase}DTO): Promise<${PascalCase}> {
    if (!payload.name || payload.name.trim().length === 0) {
      throw new Error('${PascalCase} name is required');
    }
    log.info('Creating new ${kebabCase}...', payload);
    return this.repo.create(payload);
  }
}

export const create${PascalCase}Service = new Create${PascalCase}Service();
`
);

// 4. Hook (Controller)
writeSafe(
  `src/hooks/use-${kebabCase}.ts`,
  `import { useState, useEffect, useCallback } from 'react';
import { fetch${PascalCase}ListService } from '@/services/${kebabCase}/fetch${PascalCase}ListService';
import { ${PascalCase} } from '@/types/${kebabCase}.types';

export function use${PascalCase}(autoFetch = true) {
  const [data, setData] = useState<${PascalCase}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetch${PascalCase}ListService.execute();
      setData(items);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load ${kebabCase} data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
`
);

// 5. Screen Page
writeSafe(
  `src/app/${kebabCase}.tsx`,
  `import React from 'react';
import { ScreenLayout } from '@/components/templates/screen-layout';
import { AppCard } from '@/components/ui/app-card';
import { StateView } from '@/components/ui/state-view';
import { ThemedText } from '@/components/themed-text';
import { use${PascalCase} } from '@/hooks/use-${kebabCase}';

export default function ${PascalCase}Screen() {
  const { data, loading, error, refetch } = use${PascalCase}();

  if (loading && data.length === 0) {
    return (
      <ScreenLayout title="${PascalCase}s" showBackButton={true}>
        <StateView type="loading" message="Loading ${kebabCase} data..." />
      </ScreenLayout>
    );
  }

  if (error && data.length === 0) {
    return (
      <ScreenLayout title="${PascalCase}s" showBackButton={true}>
        <StateView
          type="error"
          message={error}
          onRetry={refetch}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      title="${PascalCase}s"
      subtitle="Manage ${kebabCase} data"
      showBackButton={true}
      onRefresh={refetch}
    >
      {data.length === 0 ? (
        <StateView
          type="empty"
          title="No ${PascalCase} Data"
          message="No items have been created yet."
        />
      ) : (
        data.map((item) => (
          <AppCard key={item.id} title={item.name} subtitle={\`ID: \${item.id}\`}>
            <ThemedText>Ready to use ${kebabCase} record.</ThemedText>
          </AppCard>
        ))
      )}
    </ScreenLayout>
  );
}
`
);

console.log(`\n🎉 Module ${PascalCase} successfully created with Single-Action Services!\n`);
