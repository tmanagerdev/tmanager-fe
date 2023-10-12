export enum ECategoryPeople {
  PLAYER = 'PLAYER',
  STAFF = 'STAFF',
  MANAGER = 'MANAGER',
  EQUIPMENT = 'EQUIPMENT',
  OTHER = 'OTHER',
}

export const categoriesPeople = [
  { value: ECategoryPeople.MANAGER, label: 'Dirigente' },
  { value: ECategoryPeople.PLAYER, label: 'Giocatore' },
  { value: ECategoryPeople.STAFF, label: 'Staff' },
  { value: ECategoryPeople.EQUIPMENT, label: 'Magazziniere' },
  { value: ECategoryPeople.OTHER, label: 'Altro' },
];

export interface IPeople {}
