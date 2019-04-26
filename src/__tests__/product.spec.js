import { Product } from '../product';

test('Product: should be defined', () => {
  expect(new Product()).toBeDefined();
});

test('Product: should take params', () => {
  const voucher = new Product(
    'VOUCHER',
    'Voucher details here',
    1,
    'Euro',
    'IN_STOCK'
  );
  expect(voucher.code).toEqual('VOUCHER');
  expect(voucher.description).toEqual('Voucher details here');
  expect(voucher.price).toEqual(1);
  expect(voucher.currency).toEqual('Euro');
  expect(voucher.status).toEqual('IN_STOCK');
});
