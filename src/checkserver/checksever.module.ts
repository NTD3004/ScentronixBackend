import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CheckserverService } from './checkserver.service';
import { PriorityQueue } from '@src/commons/data-structures/priority-queue/priority-queue';
import { CheckserverController } from '@src/checkserver/checkserver.controller';

@Module({
  imports: [HttpModule.register({
    timeout: 5000
  })],
  providers: [CheckserverService, PriorityQueue],
  controllers: [CheckserverController],
})
export class CheckserverModule {}