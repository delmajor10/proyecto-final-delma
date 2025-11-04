import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { Stock } from '../../interfaces/stock.interface';


@Component({
  selector: 'stock-add',
  imports: [],
  templateUrl: './stockAdd.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StockAdd {
  public stockAddTitle = signal<string>('Agregar stock');

  public name = signal("Gafete");
  public cuantity = signal(1);
  public existance = signal(1);

  AgregarStock() {
    console.log(`Hola desde el boton`)
  }

  OnNewStock = output<Stock>();

  addStock() {
    const newStock = {
      id: Math.floor(Math.random() * 100),
      name: this.name(),
      cuantity: this.cuantity(),
      existance: this.existance(),
    }

    this.OnNewStock.emit(newStock);
    this.resetInputs();
  }

  resetInputs() {
    this.name.set('');
    this.cuantity.set(0);
    this.existance.set(0);
  }
}