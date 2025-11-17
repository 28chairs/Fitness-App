import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Transaction } from '../../entities/transaction.entity';
import { Membership } from '../../entities/membership.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Membership])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}


