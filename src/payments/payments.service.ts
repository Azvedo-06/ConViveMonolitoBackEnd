import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { EventsService } from '../events/events.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly eventsService: EventsService,
  ) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY not set in environment');
    }
    // Stripe constructor
    this.stripe = new Stripe(apiKey);
  }

  async createCheckoutSession(eventId: number, userId: number) {
    try {
      const event = await this.eventsService.findOne(eventId);
      if (!event) {
        throw new BadRequestException('Evento não encontrado');
      }

      // Se o preço não for fornecido ou for zero, o evento é gratuito
      const price = event.price || 0;
      if (price <= 0) {
        throw new BadRequestException('Este evento é gratuito.');
      }

      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: `Ingresso: ${event.title}`,
                description: `Participação no evento: ${event.title}`,
              },
              unit_amount: Math.round(price * 100), // Em centavos
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${frontendUrl}/${event.city}?payment=success`,
        cancel_url: `${frontendUrl}/${event.city}?payment=cancel`,
        metadata: {
          eventId: eventId.toString(),
          userId: userId.toString(),
        },
      });

      return { url: session.url };
    } catch (error: any) {
      console.error('Error creating Stripe Checkout Session:', error);
      throw new InternalServerErrorException(error.message || 'Erro ao criar sessão de pagamento.');
    }
  }

  async createPromotionCheckoutSession(
    eventId: number,
    exposureLevel: 'CITY' | 'STATE' | 'COUNTRY',
    userId: number,
  ) {
    try {
      const event = await this.eventsService.findOne(eventId);
      if (!event) {
        throw new BadRequestException('Evento não encontrado');
      }

      if (event.createdBy !== userId) {
        throw new BadRequestException('Apenas o criador do evento pode promovê-lo.');
      }

      let price = 0;
      let name = '';
      if (exposureLevel === 'CITY') {
        price = 20.0;
        name = `Destaque Municipal: ${event.title}`;
      } else if (exposureLevel === 'STATE') {
        price = 50.0;
        name = `Destaque Regional (Estado): ${event.title}`;
      } else if (exposureLevel === 'COUNTRY') {
        price = 100.0;
        name = `Destaque Nacional (País): ${event.title}`;
      } else {
        throw new BadRequestException('Nível de destaque inválido');
      }

      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';

      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name,
                description: `Promoção nível ${exposureLevel} para o evento: ${event.title}`,
              },
              unit_amount: Math.round(price * 100), // Em centavos
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${frontendUrl}/${event.city}?payment=success`,
        cancel_url: `${frontendUrl}/${event.city}?payment=cancel`,
        metadata: {
          type: 'promotion',
          eventId: eventId.toString(),
          exposureLevel,
          userId: userId.toString(),
        },
      });

      return { url: session.url };
    } catch (error: any) {
      console.error('Error creating Stripe Promotion Checkout Session:', error);
      throw new InternalServerErrorException(
        error.message || 'Erro ao criar sessão de pagamento de promoção.',
      );
    }
  }

  async handleWebhook(signature: string, rawBody: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not set in environment');
    }

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { type, eventId, exposureLevel, userId } = session.metadata || {};

      if (type === 'promotion') {
        if (eventId && exposureLevel) {
          console.log(`Promotion confirmed! Promoting event ${eventId} to level ${exposureLevel}`);
          try {
            await this.eventsService.promoteEvent(Number(eventId), exposureLevel as any);
          } catch (error) {
            console.error(`Failed to promote event after payment:`, error);
            throw new InternalServerErrorException('Falha ao promover evento pós-pagamento');
          }
        }
      } else {
        if (eventId && userId) {
          console.log(`Payment confirmed! Registering user ${userId} to event ${eventId}`);
          try {
            await this.eventsService.joinEvent(Number(eventId), Number(userId));
          } catch (error) {
            console.error(`Failed to register user to event after payment:`, error);
            throw new InternalServerErrorException('Falha ao inscrever usuário no evento pós-pagamento');
          }
        }
      }
    }

    return { received: true };
  }
}
