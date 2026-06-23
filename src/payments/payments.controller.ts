import { Controller, Post, Body, Req, Headers, UseGuards, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout-session')
  async createCheckoutSession(
    @Body('eventId', ParseIntPipe) eventId: number,
    @Req() req: any,
  ) {
    const userId = req.user.userId;
    return this.paymentsService.createCheckoutSession(eventId, userId);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any,
  ) {
    const rawBody = req.rawBody;
    return this.paymentsService.handleWebhook(signature, rawBody);
  }
}
