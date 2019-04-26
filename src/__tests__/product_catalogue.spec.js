import { ProductCatalogue } from '../product-catalogue';
import { Product } from '../product';

test('Product Catalogue: Should be defined', () => {
  const productCatalogue = new ProductCatalogue();
  expect(productCatalogue).toBeDefined();
  expect(productCatalogue.items).toBeDefined();
  expect(Object.keys(productCatalogue.items)).toHaveLength(0);
});

test('Product Catalogue: Should have add to catalogue', () => {
  const productCatalogue = new ProductCatalogue();
  const productOne = new Product(
    'VOUCHER',
    'Voucher details here',
    1,
    'Euro',
    'IN_STOCK'
  );
  expect(productCatalogue.add).toBeDefined();
  productCatalogue.add(productOne);
  expect(Object.keys(productCatalogue.items)).toHaveLength(1);
  expect(productCatalogue.items[productOne.code]).toEqual(productOne);
});

test('Product Catalogue: Should have remove from catalogue', () => {
  const productCatalogue = new ProductCatalogue();
  const productOne = new Product(
    'VOUCHER',
    'Voucher details here',
    1,
    'Euro',
    'IN_STOCK'
  );
  expect(productCatalogue.add).toBeDefined();
  productCatalogue.add(productOne);
  expect(Object.keys(productCatalogue.items)).toHaveLength(1);
  productCatalogue.remove(productOne.code);
  expect(Object.keys(productCatalogue.items)).toHaveLength(0);
});

test('Product Catalogue: Should have getProduct from catalogue', () => {
  const productCatalogue = new ProductCatalogue();
  const productOne = new Product(
    'VOUCHER',
    'Voucher details here',
    1,
    'Euro',
    'IN_STOCK'
  );
  expect(productCatalogue.add).toBeDefined();
  productCatalogue.add(productOne);
  expect(productCatalogue.findProduct).toBeDefined();
  expect(productCatalogue.findProduct(productOne.code)).toBeDefined();
  expect(productCatalogue.findProduct(productOne.code)).toEqual(productOne);
});

test('Product Catalogue: Should have getTotalProducts from catalogue', () => {
  const productCatalogue = new ProductCatalogue();
  const productOne = new Product(
    'VOUCHER',
    'Voucher details here',
    1,
    'Euro',
    'IN_STOCK'
  );
  expect(productCatalogue.add).toBeDefined();
  productCatalogue.add(productOne);
  expect(productCatalogue.getTotalProducts()).toEqual(1);
});
