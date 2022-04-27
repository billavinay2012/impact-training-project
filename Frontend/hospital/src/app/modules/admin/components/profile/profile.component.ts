import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import { Employee } from 'src/app/models/Employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  message: string = '';
  messageFlag: boolean = false;
  userId: number;
  form!: FormGroup;
  buttonLabel = "Edit";
  titles = 'Mr Ms Mrs Dr'.split(' ');
  roles = 'ADMIN NURSE DOCTOR'.split(' ');
  employee = new Employee();
  isDisable = true;

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private adminService: AdminService,
    @Inject(LOCALE_ID) private locale: string
  ) {
    this.employee = JSON.parse(sessionStorage.getItem('user'));
    this.userId = this.employee.employeeId;
  }
  get today() {
    let miliSeconds = Math.ceil(18 * 365.25 * 24 * 60 * 60 * 1000);
    let date = new Date(Date.now().valueOf() - miliSeconds);
    return formatDate(date, 'yyyy-MM-dd', this.locale);
  }

  get email() {
    return this.form.controls.email;
  }

  get role() {
    return this.form.controls.role;
  }

  get title() {
    return this.form.controls.title;
  }

  get first() {
    return this.form.controls.firstName;
  }

  get last() {
    return this.form.controls.lastName;
  }

  get dob() {
    return this.form.controls.birthdate;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(''),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl({ value: '', disabled: true }),
      birthdate: new FormControl('', [Validators.required]),
      specialization: new FormControl('', [Validators.maxLength(10)]),
      role: new FormControl({ value: 'ADMIN', disabled: true }),
    });
  }

  editEmployee() {
    this.buttonLabel = "Updating..."
    this.adminService.updateEmployee(this.employee, "update").subscribe(res => {
      this.buttonLabel = 'Edit';
      if (res) {
        this.snackbar.open("Profile details successfully updated", "", { duration: 3000 });
      }
    });
  }
}