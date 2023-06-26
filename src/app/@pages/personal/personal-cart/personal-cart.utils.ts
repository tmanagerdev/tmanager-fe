import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

export const cartForm: FormGroup = new FormGroup({
  team: new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null),
  }),
  event: new FormGroup({
    id: new FormControl(null),
    away: new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
    }),
    home: new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
    }),
  }),
  isCompleted: new FormControl(null),
  players: new FormControl(null),
  staffs: new FormControl(null),
  managers: new FormControl(null),
  activities: new FormArray([]),
  rooms: new FormArray([]),
  roads: new FormArray([]),
});

export const paxForm: FormGroup = new FormGroup({
  players: new FormControl(null, [Validators.required]),
  staffs: new FormControl(null, [Validators.required]),
  managers: new FormControl(null, [Validators.required]),
});
