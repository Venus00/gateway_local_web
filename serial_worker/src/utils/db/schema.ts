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
  typeId: integer("typeId")
    .notNull()
    .references(() => device_type.id, { onDelete: "cascade" }),
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
    connection: many(connectionInputs),
  })
);

export const connectionInputs = pgTable(
  "connection_inputs",
  {
    name:text('name'),
    inputId: serial("input_id").references(() => device_input.id, {
      onDelete: "cascade",
    }),
    machineId: serial("machine_id").references(
      () => machine.id,
      { onDelete: "cascade" }
    ),
  },
  (t) => [primaryKey({ columns: [t.inputId, t.machineId] })]
);

export const connectionOutputs = pgTable(
  "connection_outputs",
  {
    name:text('name'),
    outputId: serial("output_id").references(() => device_output.id, {
      onDelete: "cascade",
    }),
    machineId: serial("machine_id").references(
      () => machine.id,
      { onDelete: "cascade" }
    ),
  },
  (t) => [primaryKey({ columns: [t.outputId, t.machineId] })]
);

export const connectionToInputRelations = relations(
  connectionInputs,
  ({ one, many }) => ({
    input: one(device_input, {
      fields: [connectionInputs.inputId],
      references: [device_input.id],
    }),
    machine: one(machine, {
      fields: [connectionInputs.machineId],
      references: [machine.id],
    }),
  })
);

export const connectionToOutputRelations = relations(
  connectionOutputs,
  ({ one, many }) => ({
    output: one(device_output, {
      fields: [connectionOutputs.outputId],
      references: [device_output.id],
    }),
    machine: one(machine, {
      fields: [connectionOutputs.machineId],
      references: [machine.id],
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
    connection: many(connectionOutputs),
  })
);

export const deviceRelations = relations(device, ({ one, many }) => ({
  event: many(event),
  deviceInput: many(device_input),
  deviceOutput: many(device_output),
  type: one(device_type, {
    fields: [device.typeId],
    references: [device_type.id],
  }),
  broker: one(broker, { fields: [device.brokerId], references: [broker.id] }),
  tenant: one(tenant, { fields: [device.tenantId], references: [tenant.id] }),
}));

export const device_type = pgTable("DeviceType", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }),
  config: varchar("config", { length: 256 }),
  input: varchar("input", { length: 256 }),
  output: varchar("output", { length: 256 }),
  tenantId: integer("tenantId")
    .notNull()
    .references(() => tenant.id, { onDelete: "cascade" }),
});
export const device_typeRelations = relations(device_type, ({ one, many }) => ({
  devices: many(device),
  tenant: one(tenant, {
    fields: [device_type.tenantId],
    references: [tenant.id],
  }),
}));

export const machine_type = pgTable("MachineType", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }),
  input: varchar("input", { length: 256 }),
  output: varchar("output", { length: 256 }),
  tenantId: integer("tenantId")
    .notNull()
    .references(() => tenant.id, { onDelete: "cascade" }),
});
export const machine_typeRelations = relations(
  machine_type,
  ({ one, many }) => ({
    machines: many(machine),
    tenant: one(tenant, {
      fields: [machine_type.tenantId],
      references: [tenant.id],
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

// export const connection = pgTable("Connection", {
//   machineId: serial("machineId").notNull().primaryKey(),
//   machineInput: varchar("machineInput", { length: 256 }),
//   machineOutput: varchar("machineOutput", { length: 256 }),
//   name: varchar("name", { length: 256 }).notNull(),
//   config: varchar("config", { length: 256 }),
//   target: integer("target").default(0),
//   created_at: date("created_at").defaultNow(),
//   updated_at: date("updated_at")
//     .defaultNow()
//     .$onUpdate(() => sql`current_timestamp(3)`),
//   tenantId: integer("tenantId")
//     .notNull()
//     .references(() => tenant.id, { onDelete: "cascade" }),
// });
// export const connectionRelations = relations(connection, ({ one, many }) => ({
//   machine: one(machine, {
//     fields: [connection.machineId],
//     references: [machine.id],
//   }),
//   deviceInput: many(connectionInputs),
//   deviceOutput: many(connectionOutputs),
//   tenant: one(tenant, {
//     fields: [connection.tenantId],
//     references: [tenant.id],
//   }),
// }));
export const config = pgTable("Config", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }),
});
export const machine = pgTable("Machine", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }),
  version: varchar("version", { length: 256 }),
  serial: varchar("serial", { length: 256 }),
  layout: text(),
  widget: text(),
  typeId: integer("typeId"),
  tenantId: integer("tenantId")
    .notNull()
    .references(() => tenant.id, { onDelete: "cascade" }),
});
export const machineRelations = relations(machine, ({ one, many }) => ({
  // connection: one(connection),
  // type: one(machine_type, {
  //   fields: [machine.typeId],
  //   references: [machine_type.id],
  // }),
  connectionInputs : many(connectionInputs),
  connectionOutputs : many(connectionOutputs),
  tenant: one(tenant, { fields: [machine.tenantId], references: [tenant.id] }),
}));



export const analytics = pgTable("Analytics", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }),
  serial: varchar("serial", { length: 256 }),
  layout: text(),
  widget: text(),
  telemetries: text(),
  outputs: text(),
  tenantId: integer("tenantId")
    .notNull()
    .references(() => tenant.id, { onDelete: "cascade" }),
});

export const analytics_events = pgTable("AnalyticsEvents", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }),
  value: varchar("value", { length: 256 }),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => sql`current_timestamp(3)`),
  analyticsId: integer("analyticsId").notNull(),
});
export const analytics_eventsRelations = relations(analytics_events, ({ one }) => ({
  analytics: one(analytics, { fields: [analytics_events.analyticsId], references: [analytics.id] }),
}));
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
  licenceId: integer("licenceId").references(() => licence.id, {
    onDelete: "set null",
  }),
  pendingLicenceId: integer("pendingLicenceId").references(() => licence.id, {
    onDelete: "set null",
  }),
  adminId: integer("adminId").references(() => users.id, {
    onDelete: "set null",
  }),
  created_at: timestamp("created_at").defaultNow(),
});

export const licence = pgTable("Licence", {
  id: serial("id").notNull().primaryKey(),
  sessionId: varchar("sessionId", { length: 256 }).notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  isValid: boolean("isValid").default(false),
  endsAt: timestamp("endsAt").defaultNow(),
  startAt: timestamp("startAt").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),

  subscriptionPlanId: integer("subscriptionPlanId").references(() => subscriptionPlan.id, {
    onDelete: "set null",
  }),
});

export const subscriptionPlan = pgTable("SubscriptionPlan", {
  id: serial("id").notNull().primaryKey(),
  name: varchar("name", { length: 256 }).notNull().unique(),
  icon: varchar("icon", { length: 256 }),
  description: varchar("description", { length: 256 }),
  price: text().default(""),
  specs: text().default(""),
  created_at: timestamp("created_at").defaultNow(),
});

export const licenceRelations = relations(licence, ({ one, many }) => ({
  subscriptionPlan: one(subscriptionPlan, { fields: [licence.subscriptionPlanId], references: [subscriptionPlan.id] }),
}));


export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenant, { fields: [users.tenantId], references: [tenant.id] }),
}));

export const tenantRelations = relations(tenant, ({ one, many }) => ({
  users: many(users),
  admin: one(users, { fields: [tenant.adminId], references: [users.id] }),
  licence: one(licence, {
    fields: [tenant.licenceId],
    references: [licence.id],
  }),
  pendingLicence: one(licence, {
    fields: [tenant.pendingLicenceId],
    references: [licence.id],
  }),
  device: many(device),
  device_type: many(device_type),
  machine_type: many(machine_type),
  machines: many(machine),
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