import { Checkout, getCheckoutProcess } from '../checkout';
import { Product } from '../product';

test('Checkout Process: should be able to create new ', () => {
  expect(new Checkout()).toBeDefined();
  expect(getCheckoutProcess()).toBeDefined();
  expect(getCheckoutProcess().constructor.name).toEqual('Checkout');
});

test('Checkout Process: should have a scan method ', () => {
  const checkout = new Checkout();
  expect(checkout.scan).toBeDefined();
});

test('Checkout Process: should have a remove method ', () => {
  const checkout = new Checkout();
  expect(checkout.remove).toBeDefined();
});

test('Checkout Process: should have a total method ', () => {
  const checkout = new Checkout();
  expect(checkout.calculateTotal).toBeDefined();
  expect(checkout.total).toEqual(0);
});

test('Checkout Process: should have an empty cart method ', () => {
  const checkout = new Checkout();
  expect(checkout.cart).toBeDefined();
  expect(checkout.cart).toHaveLength(0);
});

test('Checkout Process: should return the same checkout process for chaining ', () => {
  const checkout = new Checkout();
  expect(checkout.scan()).toEqual(checkout);
});

test('Checkout Process: should scan a product , takes product code', () => {
  const checkout = new Checkout();
  const voucher = 'VOUCHER';
  checkout.scan(voucher);
  expect(checkout.cart).toHaveLength(1);
  expect(checkout.cart).toContain(voucher);
});

test('Checkout Process: should remove a product , takes product code', () => {
  const checkout = new Checkout();
  const voucher = 'VOUCHER';
  const tShirt = 'TSHIRT';
  checkout.scan(voucher);
  checkout.scan(tShirt);
  checkout.remove('voucher'); //invalid product code
  checkout.remove(voucher); // valid product code
  expect(checkout.cart).toHaveLength(1);
  expect(checkout.cart).toContain(tShirt);
});

// test('Checkout Process: should know about products ', () => {
//   const products = [
//     new Product('VOUCHER', 'Voucher details', 5, 'Euro'),
//     new Product('TSHIRT', 'Barcelona FC TSHIRT', 20, 'Euro')
//   ];
//   const checkout = new Checkout(products);
//   expect(checkout.products).toBeDefined();
//   expect(checkout.products).toHaveLength(2);
// });
