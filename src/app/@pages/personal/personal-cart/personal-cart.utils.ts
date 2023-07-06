export const test = {
  team: {
    id: 3,
    name: 'FC Inter',
  },
  event: {
    id: 5,
    date: '2023-09-24T20:45:00.000Z',
    away: {
      id: 3,
      name: 'FC Inter',
    },
    home: {
      id: 1,
      name: 'AS Roma',
      city: {
        id: 2,
        name: 'Roma',
      },
    },
  },
  startDate: '2023-09-23T20:45:00.000Z',
  endDate: '2023-09-25T20:45:00.000Z',
  isCompleted: null,
  players: 1,
  staffs: 1,
  managers: 1,
  activities: [
    {
      id: 7,
      name: 'Attività su Roma 2',
      description: 'Descrizione attività',
      price: '299.99',
      note: 'Scrivo questa nota per roma 2',
    },
    {
      id: 8,
      name: 'Attività su Roma 3',
      description: 'Descrizione attività',
      price: '399.99',
      note: 'Roma 3 si svolte il mercoledì',
    },
  ],
  rooms: [
    {
      id: 14,
      name: 'Singola',
      price: '170',
      quantity: 1,
      hotelId: 4,
      hotelName: 'Hotel 2 Roma',
    },
    {
      id: 15,
      name: 'Doppia',
      price: '250.56',
      quantity: 1,
      hotelId: 4,
      hotelName: 'Hotel 2 Roma',
    },
  ],
  roads: [
    {
      id: null,
      endDate: '2023-09-22T22:00:00.000Z',
      startDate: '2023-09-22T22:00:00.000Z',
      from: 'Areoporto',
      to: 'Hotel',
      hotel: null,
      veichles: [
        {
          quantity: 1,
          veichle: {
            id: 1,
            createdAt: '2023-06-24T10:09:28.750Z',
            updatedAt: '2023-06-24T10:09:28.750Z',
            name: 'Pullman',
          },
        },
      ],
    },
    {
      id: null,
      endDate: '2023-09-22T22:00:00.000Z',
      startDate: '2023-09-22T22:00:00.000Z',
      from: 'Hotel',
      to: 'Stadio',
      hotel: null,
      veichles: [
        {
          quantity: 1,
          veichle: {
            id: 1,
            createdAt: '2023-06-24T10:09:28.750Z',
            updatedAt: '2023-06-24T10:09:28.750Z',
            name: 'Pullman',
          },
        },
      ],
    },
  ],
};
