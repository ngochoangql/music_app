import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { Store } from '@ngrx/store';
import * as AuthActions from '../ngrx/auth/auth.action';
import { Observable, ObservableInput, Observer } from 'rxjs';
import { selectAuthState, selectAuthToken } from '../ngrx/auth/auth.selectors';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  loginForm: FormGroup
  token :  string | null = null
  constructor(private formBuilder: FormBuilder ,private store: Store,private router: Router) {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }posts: any[] = [];


  ngOnInit(): void {
    this.store.select(selectAuthState).subscribe(token => {
      this.token = token.token
      if (this.token !== null) {
        localStorage.setItem('authToken', this.token);
        this.router.navigate(['/home']);
      }
    });
  }
  getDeviceInfo() {
    const userAgent = navigator.userAgent;

    if (/mobile/i.test(userAgent)) {
      if (/android/i.test(userAgent)) {
        return 'Điện thoại Android';
      } else if (/iPhone/i.test(userAgent)) {
        return 'iPhone';
      }
      return 'Thiết bị di động';
    } else if (/tablet/i.test(userAgent)) {
      return 'Máy tính bảng';
    } else if (/Windows NT/i.test(userAgent)) {
      if (/MSIE|Trident/i.test(userAgent)) {
        return 'Máy tính Windows với Internet Explorer';
      }
      return 'Máy tính Windows';
    } else if (/Macintosh|Mac OS X/i.test(userAgent)) {
      return 'Máy tính Mac';
    } else if (/Linux/i.test(userAgent)) {
      return 'Máy tính Linux';
    } else {
      return 'Thiết bị không xác định';
    }
  }


  onSubmit() {
    // Lấy dữ liệu từ form
       // Lấy giá trị đã nhập
       const username = this.loginForm.get('username')?.value;
       const password = this.loginForm.get('password')?.value;

       console.log('Username:', username);
       console.log('Password:', password);
       this.store.dispatch(AuthActions.login({username,password,device_info:this.getDeviceInfo()}))
       console.log(this.token)
       // Hoặc bạn có thể lấy tất cả giá trị dưới dạng một đối tượng
       const formValues = this.loginForm.value;
       console.log('Form Values:', formValues);


  }
}
