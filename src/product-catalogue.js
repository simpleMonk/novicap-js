/**
 * Product Catalogue
 */
class ProductCatalogue {
  constructor() {
    this.items = {};
  }

  add(product) {
    this.items[product.code] = product;
    return this;
  }

  remove(productCode) {
    delete this.items[productCode];
    return this;
  }

  findProduct(productCode) {
    return this.items[productCode];
  }

  getTotalProducts() {
    return Object.keys(this.items).length;
  }
}

export { ProductCatalogue };
