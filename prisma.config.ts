import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

config()

type Env = {
  DATABASE_URL: string
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: (process.env.DATABASE_URL as string) ?? 'file:./dev.db',
  },
})
