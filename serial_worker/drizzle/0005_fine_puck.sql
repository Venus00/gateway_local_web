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
 ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_tenantId_Tenant_id_fk" FOREIGN KEY ("tenantId") REFERENCES "public"."Tenant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
