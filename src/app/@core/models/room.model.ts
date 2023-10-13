export enum ENameRoom {
  SINGLE = 'S',
  DOUBLE = 'D',
  DOUBLEUSESINGLE = 'DUS',
  TRIPLE = 'T',
}

export const namesRoom = [
  { value: ENameRoom.SINGLE, label: 'Singola' },
  { value: ENameRoom.DOUBLE, label: 'Doppia' },
  { value: ENameRoom.DOUBLEUSESINGLE, label: 'Doppia uso singola' },
  { value: ENameRoom.TRIPLE, label: 'Tripla' },
];

export interface IRoom {}
