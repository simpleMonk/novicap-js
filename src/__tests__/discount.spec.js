import { Discount } from '../discount';

test('Discount: should be defined ', () => {
  expect(new Discount()).toBeDefined();
});

test('Discount: should accept name and applier', () => {
  const applier = function() {};
  const discount = new Discount('2 for 1', applier);
  expect(discount.name).toEqual('2 for 1');
  expect(discount.applier).toEqual(applier);
});
