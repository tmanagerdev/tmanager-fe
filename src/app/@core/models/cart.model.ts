export enum EStatusCart {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DEPOSIT = 'DEPOSIT',
  COMPLETED = 'COMPLETED',
}

export const statusCart = [
  { value: EStatusCart.DRAFT, label: 'Bozza' },
  { value: EStatusCart.PENDING, label: 'Presa in carico' },
  { value: EStatusCart.CONFIRMED, label: 'Confermata' },
  { value: EStatusCart.DEPOSIT, label: 'Acconto pagato' },
  { value: EStatusCart.COMPLETED, label: 'Completata' },
];

export interface ICart {}
