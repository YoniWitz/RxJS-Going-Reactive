import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { catchError, EMPTY, Observable } from 'rxjs';

import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent implements OnInit {
  pageTitle = 'Products';
  errorMessage = '';
  selectedProductId = 0;

  products$: Observable<Product[]> | undefined;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products$ = this.productService.products$.
    pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

    };


  onSelected(productId: number): void {
    console.log('Not yet implemented');
  }
}
