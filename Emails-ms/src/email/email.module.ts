import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EmailService } from './services/email.service.service';
import { EmailController } from './controllers/email.controller';
import { NatsModule } from 'src/transport/nast.module';

@Module({
  imports: [NatsModule, ScheduleModule.forRoot()],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
