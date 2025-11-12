import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-category',
  imports: [RouterOutlet],
  templateUrl: './category.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Category { }
