
CREATE TABLE IF NOT EXISTS "Analytics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"serial" varchar(256),
	"layout" text,
	"widget" text,
	"telemetries" text,
	"outputs" text,
	"tenantId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AnalyticsEvents" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"value" varchar(256),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"analyticsId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Broker" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"host" varchar(256) NOT NULL,
	"ip" varchar(256) NOT NULL,
	"status" integer DEFAULT 0,
	"port" integer NOT NULL,
	"clientId" varchar(256) NOT NULL,
	"username" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"hide" boolean DEFAULT false,
	"topic" varchar(256),
	"rate" varchar(256),
	"tenantId" integer NOT NULL,
	CONSTRAINT "Broker_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Config" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Connection" (
	"machineId" serial PRIMARY KEY NOT NULL,
	"machineInput" varchar(256),
	"machineOutput" varchar(256),
	"name" varchar(256) NOT NULL,
	"config" varchar(256),
	"target" integer DEFAULT 0,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	"tenantId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "connection_inputs" (
	"input_id" serial NOT NULL,
	"connection_id" serial NOT NULL,
	CONSTRAINT "connection_inputs_input_id_connection_id_pk" PRIMARY KEY("input_id","connection_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "connection_outputs" (
	"output_id" serial NOT NULL,
	"connection_id" serial NOT NULL,
	CONSTRAINT "connection_outputs_output_id_connection_id_pk" PRIMARY KEY("output_id","connection_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Device" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"serial" varchar(256) NOT NULL,
	"status" integer DEFAULT 0 NOT NULL,
	"version" varchar(256),
	"config" varchar(256),
	"typeId" integer NOT NULL,
	"brokerId" integer NOT NULL,
	"tenantId" integer NOT NULL,
	CONSTRAINT "Device_name_unique" UNIQUE("name"),
	CONSTRAINT "Device_serial_unique" UNIQUE("serial")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DeviceInput" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"label" varchar(256) NOT NULL,
	"deviceId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DeviceOutput" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"label" varchar(256),
	"deviceId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "DeviceType" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"config" varchar(256),
	"input" varchar(256),
	"output" varchar(256),
	"tenantId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Event" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deviceId" integer NOT NULL,
	"data" json
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Licence" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" varchar(256) NOT NULL,
	"name" varchar(256) NOT NULL,
	"isValid" boolean DEFAULT false,
	"endsAt" timestamp DEFAULT now(),
	"startAt" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"subscriptionPlanId" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Machine" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"version" varchar(256),
	"serial" varchar(256),
	"layout" text,
	"widget" text,
	"typeId" integer,
	"tenantId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "MachineType" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"input" varchar(256),
	"output" varchar(256),
	"tenantId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ResetPasswordToken" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"token" varchar(256) NOT NULL,
	"expiresAt" timestamp DEFAULT now(),
	"used" boolean DEFAULT false,
	CONSTRAINT "ResetPasswordToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SubscriptionPlan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"icon" varchar(256),
	"description" varchar(256),
	"price" text DEFAULT '',
	"specs" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "SubscriptionPlan_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tenant" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"company" varchar(256),
	"image" text DEFAULT '',
	"phone" varchar(256),
	"layout" text DEFAULT '',
	"widget" text DEFAULT '',
	"entities" integer DEFAULT 5,
	"licenceId" integer,
	"pendingLicenceId" integer,
	"adminId" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "Tenant_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"tenantId" integer,
	"name" varchar(256),
	"description" varchar(256),
	"token" varchar(256) NOT NULL,
	"expiryDate" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "Tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UserVerification" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer,
	"token" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"used" boolean DEFAULT false,
	CONSTRAINT "UserVerification_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(256) NOT NULL,
	"name" varchar(256),
	"tenantName" varchar(256),
	"password" varchar(256),
	"refreshToken" varchar(256),
	"active" integer DEFAULT 1,
	"role" varchar(256) DEFAULT 'user',
	"deleted_at" date,
	"created_at" date DEFAULT now(),
	"updated_at" date DEFAULT now(),
	"tenantId" integer,
	"image" text DEFAULT '',
	"isAdmin" boolean DEFAULT false,
	"IsVerified" boolean DEFAULT false,
	"isActive" boolean DEFAULT true,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Workflow" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"url" varchar(256),
	"icon" varchar(256),
	"group" varchar(256),
	"reference" varchar(256),
	"version" varchar(256),
	"color" varchar(256),
	"author" varchar(256),
	"readme" varchar(256),
	"tenantId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Broker" ADD CONSTRAINT "Broker_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Connection" ADD CONSTRAINT "Connection_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connection_inputs" ADD CONSTRAINT "connection_inputs_input_id_DeviceInput_id_fk" FOREIGN KEY ("input_id") REFERENCES "public"."DeviceInput"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connection_inputs" ADD CONSTRAINT "connection_inputs_connection_id_Connection_machineId_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."Connection"("machineId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connection_outputs" ADD CONSTRAINT "connection_outputs_output_id_DeviceOutput_id_fk" FOREIGN KEY ("output_id") REFERENCES "public"."DeviceOutput"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connection_outputs" ADD CONSTRAINT "connection_outputs_connection_id_Connection_machineId_fk" FOREIGN KEY ("connection_id") REFERENCES "public"."Connection"("machineId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Device" ADD CONSTRAINT "Device_typeId_DeviceType_id_fk" FOREIGN KEY ("typeId") REFERENCES "public"."DeviceType"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Device" ADD CONSTRAINT "Device_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DeviceInput" ADD CONSTRAINT "DeviceInput_deviceId_Device_id_fk" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DeviceOutput" ADD CONSTRAINT "DeviceOutput_deviceId_Device_id_fk" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "DeviceType" ADD CONSTRAINT "DeviceType_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Licence" ADD CONSTRAINT "Licence_subscriptionPlanId_SubscriptionPlan_id_fk" FOREIGN KEY ("subscriptionPlanId") REFERENCES "public"."SubscriptionPlan"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Machine" ADD CONSTRAINT "Machine_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "MachineType" ADD CONSTRAINT "MachineType_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ResetPasswordToken" ADD CONSTRAINT "ResetPasswordToken_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_licenceId_Licence_id_fk" FOREIGN KEY ("licenceId") REFERENCES "public"."Licence"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_pendingLicenceId_Licence_id_fk" FOREIGN KEY ("pendingLicenceId") REFERENCES "public"."Licence"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_adminId_Users_id_fk" FOREIGN KEY ("adminId") REFERENCES "public"."Users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Tokens" ADD CONSTRAINT "Tokens_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserVerification" ADD CONSTRAINT "UserVerification_userId_Users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Users" ADD CONSTRAINT "Users_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
