import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-book',
  imports: [RouterOutlet],
  templateUrl: './book.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Book { }
