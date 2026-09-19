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

// Name formatting supporting camelCase, kebab-case, snake_case, and spaced names
const words = moduleArg
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/[-_]+/g, ' ')
  .trim()
  .split(/\s+/)
  .map((w) => w.toLowerCase());

const PascalCase = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
const camelCase = PascalCase.charAt(0).toLowerCase() + PascalCase.slice(1);
const kebabCase = words.join('-');

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
  `import React, { useState } from 'react';
import { Alert } from 'react-native';
import { ListScreenLayout } from '@/components/templates/list-screen-layout';
import { AppCard } from '@/components/ui/app-card';
import { AppBadge } from '@/components/ui/app-badge';
import { ThemedText } from '@/components/themed-text';
import { use${PascalCase} } from '@/hooks/use-${kebabCase}';
import { ${PascalCase} } from '@/types/${kebabCase}.types';

export default function ${PascalCase}Screen() {
  const { data, loading, error, refetch } = use${PascalCase}();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ListScreenLayout<${PascalCase}>
      title="${PascalCase}s"
      subtitle="Manage ${kebabCase} records"
      showBackButton={true}
      searchable={true}
      searchPlaceholder="Search ${kebabCase}s..."
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      data={filteredData}
      keyExtractor={(item) => item.id}
      loading={loading}
      error={error}
      onRetry={refetch}
      refreshing={loading && data.length > 0}
      onRefresh={refetch}
      emptyTitle="No ${PascalCase} Items"
      emptyMessage="No items found. Tap + to add a new ${kebabCase}."
      onAddPress={() => Alert.alert('Add ${PascalCase}', 'Open create modal or screen')}
      renderItem={({ item }) => (
        <AppCard
          title={item.name}
          subtitle={\`ID: \${item.id}\`}
          headerRight={<AppBadge label="Active" variant="success" size="sm" dot />}
          onPress={() => Alert.alert('${PascalCase} Details', \`Selected item: \${item.name}\`)}
        >
          <ThemedText style={{ fontSize: 13, opacity: 0.7 }}>
            Ready to use ${kebabCase} record.
          </ThemedText>
        </AppCard>
      )}
      withBottomTabInset={true}
    />
  );
}
`
);

console.log(`\n🎉 Module ${PascalCase} successfully created with Single-Action Services!\n`);
