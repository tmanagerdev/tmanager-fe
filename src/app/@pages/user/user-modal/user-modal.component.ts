import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  UntypedFormControl,
} from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { ERoleUser, rolesUser } from 'src/app/@core/models/user.model';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent implements OnInit, OnDestroy {
  user: any;
  isEdit: boolean = false;
  userForm: FormGroup = new FormGroup({
    email: new FormControl(null, Validators.required),
    firstName: new FormControl(null),
    lastName: new FormControl(null),
    role: new FormControl(ERoleUser.USER, Validators.required),
    teams: new FormArray([]),
  });
  roles = rolesUser;
  teams: any[] = [];

  teamFilter = new UntypedFormControl(null);

  teams$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  get email(): FormControl {
    return this.userForm.get('email') as FormControl;
  }

  get role(): any {
    return this.userForm.get('role')?.value;
  }

  get teamsArray(): FormArray {
    return this.userForm.get('teams') as FormArray;
  }

  get teamsArrayValue(): any[] {
    return this.userForm.get('teams')?.value;
  }

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private teamApiService: TeamApiService
  ) {
    if (this.config.data) {
      this.user = this.config.data.user;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.email.disable();
      }
      this.userForm.patchValue(this.user);

      if (this.isEdit) {
        const role = this.roles.find((r) => r.value === this.user.role);
        this.userForm.patchValue({ role });

        if (this.user.teams) {
          this.user.teams.forEach((t: any) => {
            this.teamsArray.push(
              new FormGroup({
                id: new FormControl(t.team.id),
                name: new FormControl(t.team.name),
              })
            );
          });
        }
      }
    }
  }

  ngOnInit(): void {
    this.teams$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((name) =>
          this.teamApiService.findAll({
            page: 1,
            take: 50,
            ...(name ? { name } : {}),
          })
        ),
        tap(({ data }) => {
          this.teams = [...data];
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    if (this.userForm.valid) {
      const user = {
        ...this.userForm.value,
        role: this.role ?? '',
        teams: this.teamsArrayValue.map((t) => t.id),
      };
      this.ref.close(user);
    }
  }

  loadFilteredTeams(name: string) {
    this.teams$.next(name);
  }

  onFilterTeam({ query }: any) {
    this.loadFilteredTeams(query);
  }

  onSelectTeam({ value: teamSelected }: any) {
    const checkExists = this.teamsArrayValue.find(
      (t) => t.id === teamSelected.id
    );
    if (!checkExists) {
      this.teamsArray.push(
        new FormGroup({
          id: new FormControl(teamSelected.id),
          name: new FormControl(teamSelected.name),
        })
      );
    }
    this.teamFilter.setValue(null);
  }

  onRemoveTeam(index: number) {
    this.teamsArray.removeAt(index);
  }
}
