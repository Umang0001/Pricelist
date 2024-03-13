import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ListComponent } from './list/list.component';
import { AuthenticationComponent } from './authentication/authentication.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HeaderComponent,ListComponent,AuthenticationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isAuthenticated : boolean = JSON.parse(localStorage.getItem("authenticated")!) || false;

  setIsAuthenticated(value:boolean){
    this.isAuthenticated = value;
  }
}
