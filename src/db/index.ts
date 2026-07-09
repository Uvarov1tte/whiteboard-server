import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "@/db/schema.js"

export const db = drizzle(process.env.DATABASE_URL!, { schema })

// const result = await db.execute('select 1');
// console.log(db.query)