import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { catchError, EMPTY, forkJoin, map, Observable } from 'rxjs';
import { ProductCategory } from '../product-categories/product-category';

import { Product } from './product';
import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  errorMessage = '';
  combined$: Observable<Product[]> | undefined;
  products$: Observable<Product[]> | undefined;
  productCategories$: Observable<ProductCategory[]> | undefined;

  constructor(private productService: ProductService, private productCategoryService : ProductCategoryService) { }

  ngOnInit(): void {
    this.products$ = this.productService.products$.
    pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

    this.productCategories$ = this.productCategoryService.productCategories$.
    pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

    this.combined$ = forkJoin([this.products$, this.productCategories$]).pipe(
      map(([products,categories]) =>
        products.map(product =>({
            ...product,
            categoryName: categories.find(category => category.id===product.categoryId)?.name

        } as Product)))
    );
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    console.log('Not yet implemented');
  }
}
