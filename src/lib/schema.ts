// src/lib/schema.ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

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
  monthlyIncome: text("monthly_income"),
  documentType: text("document_type").notNull(),
  idCardFront: text("id_card_front"),
  idCardBack: text("id_card_back"),
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
  iban: text("iban"),
  bic: text("bic").default("C23QBEBB"),
  createdAt: text("created_at").notNull(),
});

export const cardsTable = sqliteTable("cards", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type", { enum: ["virtual_demo"] }).default("virtual_demo").notNull(),
  reference: text("reference").notNull().unique(),
  cardNumber: text("card_number"),
  expiry: text("expiry"),
  cvv: text("cvv"),
  cardHolder: text("card_holder"),
  cardTier: text("card_tier").default("Classic"),
  status: text("status", { enum: ["active", "frozen"] }).default("active").notNull(),
  createdAt: text("created_at").notNull(),
});

export const loansTable = sqliteTable("loans", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  amount: real("amount").notNull(),
  durationMonths: integer("duration_months").notNull(),
  interestRate: real("interest_rate").notNull(),
  monthlyPayment: real("monthly_payment").notNull(),
  totalPayment: real("total_payment").notNull(),
  dossierFees: real("dossier_fees").notNull(),
  purpose: text("purpose").notNull(),
  status: text("status", { enum: ["pending", "approved", "rejected"] })
    .default("pending")
    .notNull(),
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

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  country: text("country").notNull(),
  streetAddress: text("street_address").notNull(),
  whatsapp: text("whatsapp").notNull(),
  email: text("email").notNull(),
  subtotal: real("subtotal").notNull(),
  shippingCost: real("shipping_cost").notNull(),
  grandTotal: real("grand_total").notNull(),
  status: text("status", { enum: ["pending", "paid"] }).default("pending").notNull(),
  paymentMethod: text("payment_method", {
    enum: ["stripe", "bizum", "bank_transfer"],
  }).notNull(),
  paymentStatus: text("payment_status", { enum: ["pending", "paid"] }).default("pending").notNull(),
  stripeSessionId: text("stripe_session_id"),
  createdAt: text("created_at").notNull(),
});

export const bizumSettings = sqliteTable("bizum_settings", {
  id: integer("id").primaryKey(),
  enabled: integer("enabled", { mode: "boolean" }).default(false).notNull(),
  recipientName: text("recipient_name"),
  phoneNumber: text("phone_number"),
});

export const analyticsVisits = sqliteTable("analytics_visits", {
  id: text("id").primaryKey(),
  visitDate: text("visit_date").notNull(),
  country: text("country").notNull(),
  visits: integer("visits").default(0).notNull(),
});