import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Transaction, TransactionType, TransactionStatus } from '../../entities/transaction.entity';
import { Membership } from '../../entities/membership.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(
    userId: string,
    amount: number,
    currency: string,
    type: TransactionType,
    metadata: any,
  ): Promise<Stripe.PaymentIntent> {
    const platformFee = Math.round(amount * 0.1); // 10% platform fee
    const organizerAmount = amount - platformFee;

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: {
        userId,
        type,
        ...metadata,
      },
    });

    // Create transaction record
    const transaction = this.transactionRepository.create({
      userId,
      type,
      amount,
      platformFee,
      organizerAmount,
      currency,
      stripePaymentIntentId: paymentIntent.id,
      status: TransactionStatus.PENDING,
      metadata,
    });

    await this.transactionRepository.save(transaction);

    return paymentIntent;
  }

  async handleWebhook(signature: string, payload: Buffer): Promise<void> {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (transaction) {
      transaction.status = TransactionStatus.COMPLETED;
      transaction.paidAt = new Date();
      transaction.stripeChargeId = paymentIntent.latest_charge as string;
      await this.transactionRepository.save(transaction);
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: { stripePaymentIntentId: paymentIntent.id },
    });

    if (transaction) {
      transaction.status = TransactionStatus.FAILED;
      await this.transactionRepository.save(transaction);
    }
  }
}


