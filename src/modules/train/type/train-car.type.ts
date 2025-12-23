import { Class } from '../enums/car-class.enums';

export type Car = {
  carNumber: number;
  class: Class;
  totalSeats: number;
  unavailableSeats: number[]; // Array of seat's number that are unavailable
};
