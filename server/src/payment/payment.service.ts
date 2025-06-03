import { Inject, Injectable } from '@nestjs/common';
import { tenant } from 'db/schema';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import Stripe from 'stripe';
import * as schema from '../../db/schema'
import { listenerCount } from 'process';
import { addYears, addMonths } from 'date-fns';
import bodyParser from 'body-parser';

@Injectable()
export class PaymentService {
    private stripe;

    constructor(
        @Inject('DB_DEV') private readonly db:NodePgDatabase<typeof schema>,
    ) {
        
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
        });
    }

    checkout = async (licenseData) => {
        console.log(licenseData)
        const lineItems = {
            price_data: {
                currency: 'usd',
                product_data: {
                    name:
                        licenseData.period === 'month'
                            ? 'Monthly License'
                            : 'Yearly License',
                    description: licenseData.description || 'No description',
                },
                unit_amount: licenseData.cost * 100,
            },
            quantity: 1,
        };
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [lineItems],
            mode: 'payment',
            success_url: process.env.SERVER_PRIMARY_DNS,
            cancel_url: process.env.SERVER_PRIMARY_DNS,
        });
        const pendindLicence = await this.db
        .insert(schema.licence)
        .values({
            name:licenseData.name,
            sessionId:session.id,
            startAt:new Date(),
            endsAt:licenseData.period === 'month'
            ? addMonths(new Date(), 1)
            : addYears(new Date(), 1),
            subscriptionPlanId:licenseData.subscriptionPlanId,
        }).onConflictDoUpdate({
            target:tenant.id,
            set:{
                startAt:new Date(),
                endsAt:licenseData.period === 'month'
                ? addMonths(new Date(), 1)
                : addYears(new Date(), 1),
                subscriptionPlanId:licenseData.subscriptionPlanId,
            }

        }).returning()
        .then((res) => res[0] ?? null);
       
        await this.db.update(tenant).set({
            pendingLicenceId:pendindLicence.id,
        }).where(eq(tenant.id,licenseData.tenantId))
        return { id: session.id };
    };

    async constructEvent(payload: any, signature: string) {
        try {
            const event = await this.stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.WEB_HOOK_SECRET,
            );
            console.log(event.type)
            switch (event.type) {
                case 'checkout.session.completed':
                    console.log("done")
                    const [licenceItem]  = await  this.db.select().from(schema.licence).where(eq(schema.licence.sessionId,event.data.object.id))
                    if(licenceItem)
                    {
                        console.log("update tenant licence data");
                        await this.db.update(tenant).set({
                            licenceId:licenceItem.id,
                            pendingLicenceId:null,
                        }).where(eq(tenant.pendingLicenceId,licenceItem.id))
                    }
                    else {
                        console.log("pending licence is not already created");
                    }
   
                    break;  
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }

            return { received: true };
        } catch (err) {
            console.log(err)
            throw new Error('Webhook Error occurred');
        }
    }
}