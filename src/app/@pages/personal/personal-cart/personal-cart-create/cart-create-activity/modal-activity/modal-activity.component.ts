import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { debounceTime, tap } from 'rxjs';

@Component({
  selector: 'app-modal-activity',
  templateUrl: './modal-activity.component.html',
  styleUrls: ['./modal-activity.component.scss'],
})
export class ModalActivityComponent {
  activityForm: FormGroup = new FormGroup({
    startDate: new FormControl(null),
    startDateHour: new FormControl(null),
    quantity: new FormControl(1),
    id: new FormControl(null),
    name: new FormControl(null),
    description: new FormControl(null),
    price: new FormControl(null),
  });
  isEdit: boolean = false;
  index: number = 0;
  activitiesList: any = [];
  displayedActivitiesList: any = [];

  searchControl = new FormControl();

  get selectedActivity() {
    return this.activityForm.get('id')?.value;
  }

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    if (this.config.data) {
      const { activityForm, activitiesList, index, isEdit } = this.config.data;
      this.activityForm = activityForm;
      this.activitiesList = activitiesList;
      this.displayedActivitiesList = [...activitiesList];
      this.index = index;
      this.isEdit = isEdit;

      if (this.isEdit) {
        const activity = this.activityForm.value;
        const startDateHour = new Date(activity.startDate);
        startDateHour.setHours(
          new Date(activity.startDate).getHours(),
          new Date(activity.startDate).getMinutes()
        );

        this.activityForm.addControl(
          'startDateHour',
          new FormControl(startDateHour)
        );
      }
    }

    this.searchControl.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filterActivities(val);
        })
      )
      .subscribe();
  }

  onSave() {
    //const { name, id } = this.mealControl.value;

    const activity = this.activityForm.value;
    const startDateHour = new Date(activity.startDateHour).getHours();
    const startDateMinute = new Date(activity.startDateHour).getMinutes();
    const startDate = new Date(activity.startDate);
    startDate.setHours(startDateHour, startDateMinute);
    this.activityForm.patchValue({ ...activity, startDate });

    console.log(this.activityForm.value);
    this.ref.close(this.activityForm);
  }

  onSelectActivity({ id, name, description, price }: any) {
    this.activityForm.patchValue({ id, name, description, price });
  }

  checkIfSelected(id: number) {
    return this.selectedActivity === id;
  }

  filterActivities(filter: string) {
    if (!!filter) {
      this.displayedActivitiesList = [...this.activitiesList].filter(
        (activities) =>
          activities.name.toLowerCase().includes(filter.toLowerCase())
      );
    } else {
      this.displayedActivitiesList = [...this.activitiesList];
    }
  }
}
