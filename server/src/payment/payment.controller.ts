import { Body, Controller, Post, Headers, Req, RawBody, RawBodyRequest } from '@nestjs/common';
import { PaymentService } from './payment.service';
import getRawBody from 'raw-body';

@Controller('stripe')
export class PaymentController {
    constructor(private stripeService: PaymentService) { }
    @Post()
    async checkout(@Body() body) {
        try {
            console.log(body);
            const result = await this.stripeService.checkout(body);
            console.log(result);
            return result;
        } catch (e) {
            console.log(e);
        }
    }

    @Post('webhook')
    async handleStripeWebhook(
        @Headers('stripe-signature') signature: string,
        @Req() req: RawBodyRequest<Request>, @Headers() headers
    ) {

        await this.stripeService.constructEvent(req.rawBody, signature);
        return { received: true };
    }
}