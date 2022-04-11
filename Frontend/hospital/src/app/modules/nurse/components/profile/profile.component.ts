import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { confirmPassword, passwordValidator } from 'src/app/validators/password.validator';
import { AuthenticationService } from 'src/app/services/Authentication.servic';
import { UtilityService } from 'src/app/services/utility.service';
import { UserCredential } from 'src/app/models/UserCredential';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { formatDate } from '@angular/common';
import { Employee } from 'src/app/models/Employee';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  message: string = '';
  messageFlag: boolean = false;
  userCredential = new UserCredential();
  isOldPasswordCorrect: boolean = false;
  userId: number;
  form!: FormGroup;
  emailExists = false;
  buttonLabel = "Edit";
  titles = 'Mr Ms Mrs Dr'.split(' ');
  roles = 'NURSE DOCTOR ADMIN'.split(' ');
  employee = new Employee();
  isDisable = true;
  constructor(private snackbar: MatSnackBar,
    private router: Router,
    private authenticationService: AuthenticationService,
    private utilityService: UtilityService,
    private adminService: AdminService,
    @Inject(LOCALE_ID) private locale: string,) {
    this.userId = this.authenticationService.getUserId();
    this.employee = JSON.parse(sessionStorage.getItem('user'));
    console.log(this.employee);

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
      email: new FormControl('', [Validators.required, Validators.email]),
      birthdate: new FormControl('', [Validators.required]),
      specialization: new FormControl('', [Validators.maxLength(10)]),
      role: new FormControl({ value: 'NURSE', disabled: true }, [Validators.required]),
    });
  }

  onEmailEntered() {
    if (this.email.valid) {
      this.utilityService.emailExists(this.form.value.email).subscribe(res => this.emailExists = res);
    }
  }

  editEmployee() {
    this.buttonLabel = "Updating..."
    this.adminService.updateEmployee(this.employee).subscribe(res => {
      this.buttonLabel = 'Edit';
      if (res != null && res.employeeId > 0) {
        this.snackbar.open("Profile details successfully updated", "", { duration: 3000 });
      }
    });
  }

  confirmPasswordForm = new FormGroup({
    oldpassword: new FormControl('', [Validators.required, passwordValidator, Validators.minLength(8)]),
    password: new FormControl('', [Validators.required, passwordValidator, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  }, confirmPassword('password', 'confirmPassword'));

  get f() {
    return this.confirmPasswordForm.controls;
  }

  backToLogin() {
    this.router.navigate(['login']);
  }

  submit() {
    this.userCredential.userId = this.userId;
    this.userCredential.oldPassword = this.confirmPasswordForm.value.oldpassword;
    this.userCredential.newPassword = this.confirmPasswordForm.value.confirmPassword;
    if (!this.checkIfPasswordCorrect()) {
      this.message = "Kindly provide correct old password";
    }
    this.utilityService.changeUserPassword(this.userCredential).subscribe((result) => {
      this.message = 'Password changed successfully';
      this.snackbar.open("Your password has been successfully updated. You may now login your account", "", { duration: 3000 });
      this.messageFlag = true;
      this.router.navigate(['login']);
    });
    
  }
  checkIfPasswordCorrect() {
    return this.utilityService.checkOldPassword(this.employee.employeeId,this.confirmPasswordForm.value.oldpassword).subscribe((result)=>{
      console.log(result);
      
    })
  }

}
