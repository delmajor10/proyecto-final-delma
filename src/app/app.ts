import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { Home } from "./pages/home/home";
//import { Stock } from "./pages/stock/stock";
import { Sidebar } from "./shared/sidebar/sidebar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  //template: `<h1>Hola desde el componente nuevo</h1>`,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('enterpiseSystem');
}
