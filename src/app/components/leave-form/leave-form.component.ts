import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { LeaveApplication } from 'src/app/models/leaveapplication';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { LeaveApplicationService } from 'src/app/services/leave-application.service';

@Component({
  selector: 'app-leave-form',
  templateUrl: './leave-form.component.html',
  styleUrls: ['./leave-form.component.css'],
})
export class LeaveFormComponent {
  applicants: User[] = [];
  managers: User[] = [];

  minStartDate: Date;
  minEndDate: Date;
  minReturnDate: Date;

  applicationForm = new FormGroup({
    applicantId: new FormControl('', Validators.required),
    managerId: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
    returnDate: new FormControl('', Validators.required),
    numberOfDays: new FormControl('', Validators.required),
    generalComments: new FormControl('', Validators.maxLength(500)),
  });

  constructor(
    private userService: UserService,
    private leaveAppService: LeaveApplicationService,
    private formBuilder: FormBuilder
  ) {
    this.minStartDate = new Date();
    this.minEndDate = new Date();
    this.minReturnDate = new Date();
  }

  onStartDateChange() {
    var startDate = new Date(
      this.applicationForm.controls['startDate'].value
        ? this.applicationForm.controls['startDate'].value
        : ''
    );

    this.applicationForm.controls['endDate'].setValue('');
    this.applicationForm.controls['returnDate'].setValue('');
    this.minEndDate.setDate(startDate.getDate() + 1);
    this.minReturnDate.setDate(startDate.getDate() + 1);
  }

  onEndDateChange() {
    var endDate = new Date(
      this.applicationForm.controls['endDate'].value
        ? this.applicationForm.controls['endDate'].value
        : ''
    );

    var startDate = new Date(
      this.applicationForm.controls['startDate'].value
        ? this.applicationForm.controls['startDate'].value
        : ''
    );

    this.minReturnDate.setDate(endDate.getDate() + 1);
    let difference = endDate.getTime() - startDate.getTime();
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    this.applicationForm.controls['numberOfDays'].setValue(
      TotalDays.toString()
    );
    this.applicationForm.controls['returnDate'].setValue('');
  }

  ngOnInit(): void {
    this.userService
      .getApplicants()
      .subscribe((result: User[]) => (this.applicants = result));

    this.userService
      .getApplicants()
      .subscribe((result: User[]) => (this.managers = result));
  }

  onApplicantChange(applicantId: number) {
    let applicant = this.applicants.find((a) => a.id == applicantId);
    this.userService.getApplicants().subscribe((result: User[]) => {
      this.managers = result.filter((m) => m.id == applicant?.managerId);
    });
  }

  onCancel() {
    this.clearForm();
  }

  clearForm() {
    this.applicationForm.reset();
    this.applicationForm.markAsPristine();
    this.applicationForm.markAsUntouched();
    this.applicationForm.updateValueAndValidity();
  }

  onSubmitForm() {
    if (this.applicationForm.status == 'VALID') {
      let leaveApplication = new LeaveApplication();
      leaveApplication.applicantId = Number(
        this.applicationForm.value.applicantId
      );
      leaveApplication.managerId = Number(this.applicationForm.value.managerId);
      leaveApplication.startDate = new Date(
        this.applicationForm.value.startDate
          ? this.applicationForm.value.startDate
          : ''
      );
      leaveApplication.endDate = new Date(
        this.applicationForm.value.endDate
          ? this.applicationForm.value.endDate
          : ''
      );
      leaveApplication.returnDate = new Date(
        this.applicationForm.value.returnDate
          ? this.applicationForm.value.returnDate
          : ''
      );
      leaveApplication.numberOfDays = Number(
        this.applicationForm.value.numberOfDays
      );
      leaveApplication.generalComments = this.applicationForm.value
        .generalComments
        ? this.applicationForm.value.generalComments
        : '';

      this.leaveAppService
        .subtmitLeaveApplication(leaveApplication)
        .subscribe((leaveApp: LeaveApplication[]) => {
          this.clearForm();
        });
    }
  }
}
