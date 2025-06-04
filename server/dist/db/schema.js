"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowRelations = exports.workflow = exports.tokenRelations = exports.token = exports.userVerificationRelations = exports.resetPasswordTokenRelations = exports.resetPasswordToken = exports.userVerification = exports.tenantRelations = exports.usersRelations = exports.tenant = exports.users = exports.brokerRelations = exports.broker = exports.config = exports.eventRelations = exports.event = exports.device_outputRelations = exports.device_output = exports.device_inputRelations = exports.device_input = exports.device = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.device = (0, pg_core_1.pgTable)("Device", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }).unique().notNull(),
    serial: (0, pg_core_1.varchar)("serial", { length: 256 }).unique().notNull(),
    status: (0, pg_core_1.integer)("status").notNull().default(0),
    version: (0, pg_core_1.varchar)("version", { length: 256 }),
    config: (0, pg_core_1.varchar)("config", { length: 256 }),
    brokerId: (0, pg_core_1.integer)("brokerId").notNull(),
    tenantId: (0, pg_core_1.integer)("tenantId")
        .notNull()
        .references(() => exports.tenant.id, { onDelete: "cascade" }),
});
exports.device_input = (0, pg_core_1.pgTable)("DeviceInput", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }).notNull(),
    label: (0, pg_core_1.varchar)("label", { length: 256 }).notNull(),
    deviceId: (0, pg_core_1.integer)("deviceId")
        .notNull()
        .references(() => exports.device.id, { onDelete: "cascade" }),
});
exports.device_inputRelations = (0, drizzle_orm_1.relations)(exports.device_input, ({ one, many }) => ({
    device: one(exports.device, {
        fields: [exports.device_input.deviceId],
        references: [exports.device.id],
    }),
}));
exports.device_output = (0, pg_core_1.pgTable)("DeviceOutput", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }),
    label: (0, pg_core_1.varchar)("label", { length: 256 }),
    deviceId: (0, pg_core_1.integer)("deviceId")
        .notNull()
        .references(() => exports.device.id, { onDelete: "cascade" }),
});
exports.device_outputRelations = (0, drizzle_orm_1.relations)(exports.device_output, ({ one, many }) => ({
    device: one(exports.device, {
        fields: [exports.device_output.deviceId],
        references: [exports.device.id],
    }),
}));
exports.event = (0, pg_core_1.pgTable)("Event", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    created_at: (0, pg_core_1.timestamp)("created_at").notNull().defaultNow(),
    updated_at: (0, pg_core_1.timestamp)("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => (0, drizzle_orm_1.sql) `current_timestamp(3)`),
    deviceId: (0, pg_core_1.integer)("deviceId").notNull(),
    data: (0, pg_core_1.json)(),
});
exports.eventRelations = (0, drizzle_orm_1.relations)(exports.event, ({ one, many }) => ({
    device: one(exports.device, { fields: [exports.event.deviceId], references: [exports.device.id] }),
}));
exports.config = (0, pg_core_1.pgTable)("Config", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }),
});
exports.broker = (0, pg_core_1.pgTable)("Broker", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }).unique().notNull(),
    host: (0, pg_core_1.varchar)("host", { length: 256 }).notNull(),
    ip: (0, pg_core_1.varchar)("ip", { length: 256 }).notNull(),
    status: (0, pg_core_1.integer)("status").default(0),
    port: (0, pg_core_1.integer)("port").notNull().notNull(),
    clientId: (0, pg_core_1.varchar)("clientId", { length: 256 }).notNull(),
    username: (0, pg_core_1.varchar)("username", { length: 256 }).notNull(),
    password: (0, pg_core_1.varchar)("password", { length: 256 }).notNull(),
    hide: (0, pg_core_1.boolean)("hide").default(false),
    topic: (0, pg_core_1.varchar)("topic", { length: 256 }),
    rate: (0, pg_core_1.varchar)("rate", { length: 256 }),
    tenantId: (0, pg_core_1.integer)("tenantId")
        .notNull()
        .references(() => exports.tenant.id, { onDelete: "cascade" }),
});
exports.brokerRelations = (0, drizzle_orm_1.relations)(exports.broker, ({ one, many }) => ({
    device: many(exports.device),
    tenant: one(exports.tenant, { fields: [exports.broker.tenantId], references: [exports.tenant.id] }),
}));
exports.users = (0, pg_core_1.pgTable)("Users", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    email: (0, pg_core_1.varchar)("email", { length: 256 }).unique().notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }),
    tenantName: (0, pg_core_1.varchar)("tenantName", { length: 256 }),
    password: (0, pg_core_1.varchar)("password", { length: 256 }),
    refreshToken: (0, pg_core_1.varchar)("refreshToken", { length: 256 }),
    active: (0, pg_core_1.integer)("active").default(1),
    role: (0, pg_core_1.varchar)("role", { length: 256 }).default("user"),
    deleted_at: (0, pg_core_1.date)("deleted_at"),
    created_at: (0, pg_core_1.date)("created_at").defaultNow(),
    updated_at: (0, pg_core_1.date)("updated_at")
        .defaultNow()
        .$onUpdate(() => (0, drizzle_orm_1.sql) `current_timestamp(3)`),
    tenantId: (0, pg_core_1.integer)("tenantId").references(() => exports.tenant.id, {
        onDelete: "cascade",
    }),
    image: (0, pg_core_1.text)().default(""),
    isAdmin: (0, pg_core_1.boolean)("isAdmin").default(false),
    isVerified: (0, pg_core_1.boolean)("IsVerified").default(false),
    isActive: (0, pg_core_1.boolean)("isActive").default(true),
});
exports.tenant = (0, pg_core_1.pgTable)("Tenant", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }).notNull().unique(),
    company: (0, pg_core_1.varchar)("company", { length: 256 }),
    image: (0, pg_core_1.text)().default(""),
    phone: (0, pg_core_1.varchar)("phone", { length: 256 }),
    layout: (0, pg_core_1.text)().default(""),
    widget: (0, pg_core_1.text)().default(""),
    entities: (0, pg_core_1.integer)().default(5),
    adminId: (0, pg_core_1.integer)("adminId").references(() => exports.users.id, {
        onDelete: "set null",
    }),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ one }) => ({
    tenant: one(exports.tenant, { fields: [exports.users.tenantId], references: [exports.tenant.id] }),
}));
exports.tenantRelations = (0, drizzle_orm_1.relations)(exports.tenant, ({ one, many }) => ({
    users: many(exports.users),
    admin: one(exports.users, { fields: [exports.tenant.adminId], references: [exports.users.id] }),
    device: many(exports.device),
    brokers: many(exports.broker),
}));
exports.userVerification = (0, pg_core_1.pgTable)("UserVerification", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    userId: (0, pg_core_1.integer)("userId").references(() => exports.users.id, { onDelete: "cascade" }),
    token: (0, pg_core_1.varchar)("token", { length: 256 }).notNull().unique(),
    expiresAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    used: (0, pg_core_1.boolean)("used").default(false),
});
exports.resetPasswordToken = (0, pg_core_1.pgTable)("ResetPasswordToken", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    userId: (0, pg_core_1.integer)("userId").references(() => exports.users.id, { onDelete: "cascade" }),
    token: (0, pg_core_1.varchar)("token", { length: 256 }).notNull().unique(),
    expiresAt: (0, pg_core_1.timestamp)("expiresAt").defaultNow(),
    used: (0, pg_core_1.boolean)("used").default(false),
});
exports.resetPasswordTokenRelations = (0, drizzle_orm_1.relations)(exports.resetPasswordToken, ({ one, many }) => ({
    users: one(exports.users),
}));
exports.userVerificationRelations = (0, drizzle_orm_1.relations)(exports.userVerification, ({ one, many }) => ({
    users: one(exports.users),
}));
exports.token = (0, pg_core_1.pgTable)("Tokens", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    tenantId: (0, pg_core_1.integer)("tenantId").references(() => exports.tenant.id, {
        onDelete: "cascade",
    }),
    name: (0, pg_core_1.varchar)("name", { length: 256 }),
    description: (0, pg_core_1.varchar)("description", { length: 256 }),
    token: (0, pg_core_1.varchar)("token", { length: 256 }).notNull().unique(),
    expiryDate: (0, pg_core_1.varchar)("expiryDate", { length: 256 }).notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
exports.tokenRelations = (0, drizzle_orm_1.relations)(exports.tenant, ({ one, many }) => ({
    tenant: one(exports.tenant),
}));
exports.workflow = (0, pg_core_1.pgTable)("Workflow", {
    id: (0, pg_core_1.serial)("id").notNull().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 256 }),
    url: (0, pg_core_1.varchar)("url", { length: 256 }),
    icon: (0, pg_core_1.varchar)("icon", { length: 256 }),
    group: (0, pg_core_1.varchar)("group", { length: 256 }),
    reference: (0, pg_core_1.varchar)("reference", { length: 256 }),
    version: (0, pg_core_1.varchar)("version", { length: 256 }),
    color: (0, pg_core_1.varchar)("color", { length: 256 }),
    author: (0, pg_core_1.varchar)("author", { length: 256 }),
    readme: (0, pg_core_1.varchar)("readme", { length: 256 }),
    tenantId: (0, pg_core_1.integer)("tenantId")
        .notNull()
        .references(() => exports.tenant.id, { onDelete: "cascade" }),
});
exports.workflowRelations = (0, drizzle_orm_1.relations)(exports.tenant, ({ one, many }) => ({
    tenant: one(exports.tenant),
}));
//# sourceMappingURL=schema.js.map