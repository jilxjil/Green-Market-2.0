import { betterAuth } from "better-auth"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { Resend } from "resend"

import { db } from "@/db"

const resend = new Resend(process.env.RESEND_API_KEY || "re_12345")

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
              from: "Green Market <onboarding@resend.dev>",
              to: user.email,
              subject: "Welcome to Green Market",
              html: `<p>Hi ${user.name || "there"}, welcome to Green Market!</p>`,
            }).catch(console.error);
          } else {
            console.log("Mock Email: Welcome to Green Market!", user.email);
          }
        }
      }
    }
  }
})