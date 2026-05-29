import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const globalForDb = globalThis as unknown as {
  pool: Pool | undefined
  db: NodePgDatabase<typeof schema> | undefined
}

const pool =
  globalForDb.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10, // important
  })

const db =
  globalForDb.db ??
  drizzle(pool, { schema })

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool
  globalForDb.db = db
}

export { db }









// import { drizzle } from "drizzle-orm/node-postgres"
// import { Pool } from "pg"

// import * as schema from "./schema"

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// })

// export const db = drizzle(pool, { schema })