import { TicketClass } from 'src/modules/ticket/enums/ticket-class.enum';

export interface TrainCar {
  car_number: number;
  class: TicketClass;
  total_seats: number;
  unavailable_seats_numbers: number[];
}
