import { Module } from "@nestjs/common";
import { CounterModel, TicketModel } from "./schema";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";


@Module({
  imports: [
    TicketModel,
    CounterModel
  ],
  controllers: [TicketController],
  providers: [TicketService]
})

export class TicketModule {}