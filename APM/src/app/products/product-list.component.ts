import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, EMPTY, map, Observable } from 'rxjs';
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
  //combined$: Observable<Product[]> | undefined;
  combinedFiltered$: Observable<Product[]> | undefined;
  products$: Observable<Product[]> | undefined;
  productCategories$: Observable<ProductCategory[]> | undefined;

  private selectedFilteredSubject = new BehaviorSubject<number>(0);
  selectedFilterAction$: Observable<number> | undefined;

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  ngOnInit(): void {
    this.selectedFilterAction$ = this.selectedFilteredSubject.asObservable();

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

    // this.combined$ = forkJoin([this.products$, this.productCategories$]).pipe(
    //   map(([products, categories]) =>
    //     products.map(product => ({
    //       ...product,
    //       categoryName: categories.find(category => category.id === product.categoryId)?.name

    //     } as Product)))
    // );

    this.combinedFiltered$ = combineLatest([
      this.products$, this.productCategories$, this.selectedFilterAction$
    ]).pipe(
      map(([products, categories, categoryId]) => {
        let productCategories = products.map(product => ({
          ...product,
          categoryName: categories.find(category => category.id === product.categoryId)?.name

        } as Product));
        return productCategories.filter(product => categoryId ? product.categoryId === categoryId : true)
      }),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })

    )
  }

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: number): void {
    this.selectedFilteredSubject.next(+categoryId);
  }

}
