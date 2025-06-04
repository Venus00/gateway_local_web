/* eslint-disable prettier/prettier */
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  varchar,
  integer,
  date,
  serial,
  uuid,
  primaryKey,
  json,
  timestamp,
  text,

} from "drizzle-orm/pg-core";

export const device = pgTable("Device", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  serial: varchar("serial", { length: 256 }).unique().notNull(),
  status: integer("status").notNull().default(0),
  version: varchar("version", { length: 256 }),
  config: varchar("config", { length: 256 }),
  brokerId: integer("brokerId").notNull(),
  tenantId: integer("tenantId")
    .notNull()
    .references(() => tenant.id, { onDelete: "cascade" }),
});

export const device_input = pgTable("DeviceInput", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  label: varchar("label", { length: 256 }).notNull(),
  deviceId: integer("deviceId")
    .notNull()
    .references(() => device.id, { onDelete: "cascade" }),
});

export const device_inputRelations = relations(
  device_input,
  ({ one, many }) => ({
    device: one(device, {
      fields: [device_input.deviceId],
      references: [device.id],
    }),
  })
);

export const device_output = pgTable("DeviceOutput", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }),
  label: varchar("label", { length: 256 }),
  deviceId: integer("deviceId")
    .notNull()
    .references(() => device.id, { onDelete: "cascade" }),
});
export const device_outputRelations = relations(
  device_output,
  ({ one, many }) => ({
    device: one(device, {
      fields: [device_output.deviceId],
      references: [device.id],
    }),
  })
);


export const event = pgTable("Event", {
  id: serial("id").notNull().primaryKey(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp(3)`),
  deviceId: integer("deviceId").notNull(),
  data: json(),
});
export const eventRelations = relations(event, ({ one, many }) => ({
  device: one(device, { fields: [event.deviceId], references: [device.id] }),
}));


export const config = pgTable("Config", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }),
});

export const broker = pgTable("Broker", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  host: varchar("host", { length: 256 }).notNull(),
  ip: varchar("ip", { length: 256 }).notNull(),
  status: integer("status").default(0),
  port: integer("port").notNull().notNull(),
  clientId: varchar("clientId", { length: 256 }).notNull(),
  username: varchar("username", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  hide: boolean("hide").default(false),
  topic: varchar("topic", { length: 256 }),
  rate: varchar("rate", { length: 256 }),
  tenantId: integer("tenantId")
    .notNull()
    .references(() => tenant.id, { onDelete: "cascade" }),
});
export const brokerRelations = relations(broker, ({ one, many }) => ({
  device: many(device),
  tenant: one(tenant, { fields: [broker.tenantId], references: [tenant.id] }),
}));

export const users = pgTable("Users", {
  id: serial("id").notNull().primaryKey(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  name: varchar("name", { length: 256 }),
  tenantName: varchar("tenantName", { length: 256 }),
  password: varchar("password", { length: 256 }),
  refreshToken: varchar("refreshToken", { length: 256 }),
  active: integer("active").default(1),
  role: varchar("role", { length: 256 }).default("user"),
  deleted_at: date("deleted_at"),
  created_at: date("created_at").defaultNow(),
  updated_at: date("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp(3)`),
  tenantId: integer("tenantId").references(() => tenant.id, {
    onDelete: "cascade",
  }),
  image: text().default(""),
  isAdmin: boolean("isAdmin").default(false),
  isVerified: boolean("IsVerified").default(false),
  isActive: boolean("isActive").default(true),
});

export const tenant = pgTable("Tenant", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  company: varchar("company", { length: 256 }),
  image: text().default(""),
  phone: varchar("phone", { length: 256 }),

  layout: text().default(""),
  widget: text().default(""),
  entities: integer().default(5),
  adminId: integer("adminId").references(() => users.id, {
    onDelete: "set null",
  }),
  created_at: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenant, { fields: [users.tenantId], references: [tenant.id] }),
}));

export const tenantRelations = relations(tenant, ({ one, many }) => ({
  users: many(users),
  admin: one(users, { fields: [tenant.adminId], references: [users.id] }),
  device: many(device),
  brokers: many(broker),
}));

export const userVerification = pgTable("UserVerification", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 256 }).notNull().unique(),
  expiresAt: timestamp("created_at").defaultNow(),
  used: boolean("used").default(false),
});
export const resetPasswordToken = pgTable("ResetPasswordToken", {
  id: serial("id").notNull().primaryKey(),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 256 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").defaultNow(),
  used: boolean("used").default(false),
});

export const resetPasswordTokenRelations = relations(
  resetPasswordToken,
  ({ one, many }) => ({
    users: one(users),
  })
);
export const userVerificationRelations = relations(
  userVerification,
  ({ one, many }) => ({
    users: one(users),
  })
);

export const token = pgTable("Tokens", {
  id: serial("id").notNull().primaryKey(),
  tenantId: integer("tenantId").references(() => tenant.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 256 }),
  description: varchar("description", { length: 256 }),
  token: varchar("token", { length: 256 }).notNull().unique(),
  expiryDate: varchar("expiryDate", { length: 256 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
export const tokenRelations = relations(
  tenant,
  ({ one, many }) => ({
    tenant: one(tenant),
  })
);
export const workflow = pgTable("Workflow", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }),
  url: varchar("url", { length: 256 }),
  icon: varchar("icon", { length: 256 }),
  group: varchar("group", { length: 256 }),
  reference: varchar("reference", { length: 256 }),
  version: varchar("version", { length: 256 }),
  color: varchar("color", { length: 256 }),
  author: varchar("author", { length: 256 }),
  readme: varchar("readme", { length: 256 }),
  tenantId: integer("tenantId")
    .notNull()
    .references(() => tenant.id, { onDelete: "cascade" }),
})
export const workflowRelations = relations(
  tenant,
  ({ one, many }) => ({
    tenant: one(tenant),
  })
);