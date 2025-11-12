import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './home.html',
})
export default class Home {
  constructor(public authService: AuthService) { }
}