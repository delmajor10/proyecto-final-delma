import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { StockService } from '../../services/stockService';
import { StockList } from '../../components/stockList/stockList';
import { Stock } from '../../interfaces/stock.interface';

@Component({
  selector: 'app-reactive-stock',
  imports: [ReactiveFormsModule, JsonPipe, StockList], 
  templateUrl: './reactive-stock.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ReactiveStock {
  private fb = inject(FormBuilder);
  private stockService = inject(StockService);

  public stockForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    cuantity: [0, [Validators.required, Validators.min(2)]],
    existance: [0, [Validators.required, Validators.min(1)]],
  });

  get stockList() {
    return this.stockService.stockList();
  }

  addStock() {
    if (this.stockForm.valid) {
      const newStock: Stock = {
        id: Math.floor(Math.random() * 100),
        name: this.stockForm.value.name!,
        cuantity: this.stockForm.value.cuantity!,
        existance: this.stockForm.value.existance!,
      };

      this.stockService.addStock(newStock);
      this.stockForm.reset({
        name: '',
        cuantity: 0,
        existance: 0,
      });
    } else {
      alert('Complete el formulario.');
    }
  }
}