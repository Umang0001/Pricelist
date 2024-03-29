import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent {
  @Output() setIsAuthenticated = new EventEmitter();
  signIn(password : string){
    if (password === "123") {
      this.setIsAuthenticated.emit(true);
      return;
    }
    alert("wrong password!")
  }
}
