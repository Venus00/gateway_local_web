ALTER TABLE "Connection" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "Connection" CASCADE;--> statement-breakpoint
ALTER TABLE "connection_inputs" RENAME COLUMN "connection_id" TO "machine_id";--> statement-breakpoint
ALTER TABLE "connection_outputs" RENAME COLUMN "connection_id" TO "name";--> statement-breakpoint
ALTER TABLE "connection_inputs" DROP CONSTRAINT "connection_inputs_connection_id_Connection_machineId_fk";
--> statement-breakpoint
ALTER TABLE "connection_outputs" DROP CONSTRAINT "connection_outputs_connection_id_Connection_machineId_fk";
--> statement-breakpoint
ALTER TABLE "connection_inputs" DROP CONSTRAINT "connection_inputs_input_id_connection_id_pk";--> statement-breakpoint
ALTER TABLE "connection_outputs" DROP CONSTRAINT "connection_outputs_output_id_connection_id_pk";--> statement-breakpoint
ALTER TABLE "connection_inputs" ADD CONSTRAINT "connection_inputs_input_id_machine_id_pk" PRIMARY KEY("input_id","machine_id");--> statement-breakpoint
ALTER TABLE "connection_outputs" ADD CONSTRAINT "connection_outputs_output_id_machine_id_pk" PRIMARY KEY("output_id","machine_id");--> statement-breakpoint
ALTER TABLE "connection_inputs" ADD COLUMN "name" text;--> statement-breakpoint
ALTER TABLE "connection_outputs" ADD COLUMN "machine_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connection_inputs" ADD CONSTRAINT "connection_inputs_machine_id_Machine_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."Machine"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "connection_outputs" ADD CONSTRAINT "connection_outputs_machine_id_Machine_id_fk" FOREIGN KEY ("machine_id") REFERENCES "public"."Machine"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
