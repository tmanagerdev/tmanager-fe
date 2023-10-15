import { Pipe, PipeTransform } from '@angular/core';
import { namesRoom } from '../models/room.model';

@Pipe({
  name: 'roomName',
  standalone: true,
})
export class RoomNamePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    const room = namesRoom.find((r) => r.value === value)?.label ?? '';
    return room;
  }
}
