import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Renderer2 } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-signup-login',
  templateUrl: './signup-login.component.html',
  styleUrls: ['./signup-login.component.scss']
})
export class SignupLoginComponent implements OnInit, OnDestroy {
  login!: FormGroup;
  signup!: FormGroup;
  submitted = false;
  isLogin = true;
  isSignUp = true;
  isLoading = false;

  hide = signal(true);

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private snackbar: MatSnackBar,
    private router: Router,
    private renderer: Renderer2 
  ) {}

  ngOnInit(): void {
    this.login = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signup = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobileNumber: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.toggleLoginMode(this.isLogin);
  }

  toggleLoginMode(isLoginMode: boolean): void {
    this.isLogin = isLoginMode;
    
    this.renderer.removeClass(document.body, 'login-mode');
    this.renderer.removeClass(document.body, 'signup-mode');
    
    if (isLoginMode) {
      this.renderer.addClass(document.body, 'login-mode');
    } else {
      this.renderer.addClass(document.body, 'signup-mode');
    }
  }

  clickEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.hide.set(!this.hide());
  }

  // Login Method
  onlogin(): void {
    this.isLoading = true;
    this.submitted = true;

    if (this.login.invalid) {
      this.isLoading = false;
      return;
    }

    const loginData = this.login.value;

    this.userService.login(loginData).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('Login successful', response);
        localStorage.setItem('authToken', response.data.token);
        this.snackbar.open('Login successful!', 'close', { 
          duration: 3000, 
          panelClass: ['snackbar-success'] 
        });
        // Uncomment when ready to navigate
        // this.router.navigateByUrl('/dashboard/books');
      },
      (error) => {
        this.isLoading = false;
        console.log('Login error:', error);
        this.snackbar.open('Login failed. Please try again.', 'close', { 
          duration: 3000,
          panelClass: ['snackbar-error'] 
        });
      }
    );
  }

  // Signup Method
  onsignup(): void {
    this.isLoading = true;
    this.submitted = true;

    if (this.signup.invalid) {
      this.isLoading = false;
      return;
    }

    const signupData = this.signup.value;

    this.userService.signUp(signupData).subscribe(
      (response: any) => {
        this.isLoading = false;
        console.log('Signup successful', response);
        this.snackbar.open('Signup successful!', 'close', { 
          duration: 3000, 
          panelClass: ['snackbar-success'] 
        });
        this.signup.reset(); 
      },
      (error) => {
        this.isLoading = false;
        console.log('Signup error:', error);
        this.snackbar.open('Signup failed. Please try again.', 'close', { 
          duration: 3000, 
          panelClass: ['snackbar-error'] 
        });
      }
    );
  }

  
  onForgotPassword(): void {
  //   //navigate to forgot password page or show modal
  //   console.log('Forgot password clicked');
    
  //   // Example: You might want to navigate to a forgot password component
  //   // this.router.navigate(['/forgot-password']);
    
  //   // Or show a dialog/modal for password reset
  //   // this.dialog.open(ForgotPasswordDialogComponent);
    
  //   // For now, show a simple snackbar message
  //   this.snackbar.open('Forgot password feature coming soon!', 'close', {
  //     duration: 3000,
  //     panelClass: ['snackbar-success']
  //   });
  }
  
  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'login-mode');
    this.renderer.removeClass(document.body, 'signup-mode');
  }
}