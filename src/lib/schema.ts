// src/lib/schema.ts
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  civility: text("civility").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  birthDate: text("birth_date").notNull(),
  birthPlace: text("birth_place").notNull(),
  nationality: text("nationality").notNull(),
  residenceCountry: text("residence_country").notNull(),
  currency: text("currency").default("EUR").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code").notNull(),
  profession: text("profession").notNull(),
  documentType: text("document_type").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .default("pending")
    .notNull(),
  createdAt: text("created_at").notNull(),
});

export const registrationOtpsTable = sqliteTable("registration_otps", {
  email: text("email").primaryKey(),
  otpHash: text("otp_hash").notNull(),
  expiresAt: integer("expires_at").notNull(),
  verifiedAt: integer("verified_at"),
  attempts: integer("attempts").default(0).notNull(),
});

export const accountsTable = sqliteTable("accounts", {
  userId: text("user_id").primaryKey(),
  balanceCents: integer("balance_cents").default(0).notNull(),
  reservedCents: integer("reserved_cents").default(0).notNull(),
  currency: text("currency").default("EUR").notNull(),
  createdAt: text("created_at").notNull(),
});

export const cardsTable = sqliteTable("cards", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type", { enum: ["virtual_demo"] }).default("virtual_demo").notNull(),
  reference: text("reference").notNull().unique(),
  status: text("status", { enum: ["active", "frozen"] }).default("active").notNull(),
  createdAt: text("created_at").notNull(),
});

export const transactionsTable = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type", {
    enum: ["withdrawal_request", "card_created", "card_status", "vault_created", "vault_deposit", "vault_withdrawal"],
  }).notNull(),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").notNull(),
  status: text("status", { enum: ["pending", "completed", "cancelled"] }).notNull(),
  createdAt: text("created_at").notNull(),
});

export const notificationsTable = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type", { enum: ["account", "card", "transaction", "savings"] }).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  readAt: text("read_at"),
  createdAt: text("created_at").notNull(),
});

export const vaultsTable = sqliteTable("vaults", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  targetCents: integer("target_cents").notNull(),
  currentCents: integer("current_cents").default(0).notNull(),
  createdAt: text("created_at").notNull(),
});