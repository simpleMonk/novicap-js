import { Pricing } from '../pricing';
import { ProductCatalogue } from '../product-catalogue';
import { Product } from '../product';
import { Discount } from '../discount';

test('Pricing: should be defined', () => {
  expect(Pricing).toBeDefined();
});

test('Pricing: should have calculate total and takes list of product codes', () => {
  expect(Pricing.calculateTotal).toBeDefined();
});

test('Pricing: should have setProductCatalogue', () => {
  expect(Pricing.setProductCatalogue).toBeDefined();
});

test('Pricing: should have setDiscountRules', () => {
  expect(Pricing.setDiscountRules).toBeDefined();
});

test('Pricing: calculateTotal for unique items - error', () => {
  const scannedItems = ['VOUCHER', 'TSHIRT'];
  expect(() => {
    Pricing.calculateTotal(scannedItems);
  }).toThrow(
    new Error('Product Catalogue is Empty. Please add it items to Catalogue')
  );
});

it('Pricing: calculateTotal for unique items - happy path', () => {
  const scannedItems = ['VOUCHER', 'TSHIRT'];
  const productCatalogue = new ProductCatalogue();
  productCatalogue.add(
    new Product('VOUCHER', 'Voucher details here', 5, 'Euro', 'IN_STOCK')
  );
  productCatalogue.add(
    new Product('TSHIRT', 'FC Barcelona TSHIRT', 20, 'Euro', 'IN_STOCK')
  );
  Pricing.setProductCatalogue(productCatalogue);
  const total = Pricing.calculateTotal(scannedItems);
  expect(total).toEqual(25);
});

test('Pricing: calculateTotal for discount items  - voucher', () => {
  const scannedItems = ['VOUCHER', 'TSHIRT', 'VOUCHER', 'VOUCHER', 'VOUCHER'];
  const productCatalogue = new ProductCatalogue();
  productCatalogue.add(
    new Product('VOUCHER', 'Voucher details here', 5, 'Euro', 'IN_STOCK')
  );
  productCatalogue.add(
    new Product('TSHIRT', 'FC Barcelona TSHIRT', 20, 'Euro', 'IN_STOCK')
  );
  const discountRule = new Discount('Buy 2 Voucher, Get 1 free', function(
    currentItemsInCart,
    currentItem
  ) {
    let discountedItems = [];
    let existingItemsInCart = currentItemsInCart;
    let discountedItemsId = [];

    let matchingItems = existingItemsInCart.filter(item => {
      return item.code === 'VOUCHER';
    });

    if (
      existingItemsInCart.length > 0 &&
      matchingItems.length == 2 &&
      currentItem.code === 'VOUCHER'
    ) {
      currentItem.setDiscountApplier(function(price) {
        return 0;
      });
      discountedItems = discountedItems.concat(matchingItems);
      discountedItems.push(currentItem);
    }
    return discountedItems;
  });
  Pricing.setProductCatalogue(productCatalogue);
  Pricing.setDiscountRules([discountRule]);
  const total = Pricing.calculateTotal(scannedItems);
  expect(total).toEqual(5 + 20 + 5 + 0 + 5);
});

test('Pricing: calculateTotal for discount items - T Shirts', () => {
  const scannedItems = [
    'VOUCHER',
    'TSHIRT',
    'VOUCHER',
    'VOUCHER',
    'VOUCHER',
    'TSHIRT',
    'TSHIRT',
    'TSHIRT'
  ];
  const productCatalogue = new ProductCatalogue();
  productCatalogue.add(
    new Product('VOUCHER', 'Voucher details here', 5, 'Euro', 'IN_STOCK')
  );
  productCatalogue.add(
    new Product('TSHIRT', 'FC Barcelona TSHIRT', 20, 'Euro', 'IN_STOCK')
  );
  const discountRule = new Discount(
    '10% of for TSHIRT , if purchased more than 3',
    function(currentItemsInCart, currentItem) {
      let discountedItems = [];
      let existingItemsInCart = currentItemsInCart;
      let discountedItemsId = [];

      let matchingItems = existingItemsInCart.filter(item => {
        return item.code === 'TSHIRT';
      });

      if (
        existingItemsInCart.length > 0 &&
        matchingItems.length >= 3 &&
        currentItem.code === 'TSHIRT'
      ) {
        matchingItems.push(currentItem);  
        matchingItems = matchingItems.map(function(item) {
          item.setDiscountApplier(function(price) {
            return (price - (price * (10 / 100)));
          });
          return item;
        });
        discountedItems = discountedItems.concat(matchingItems);
      }
      return discountedItems;
    }
  );
  Pricing.setProductCatalogue(productCatalogue);
  Pricing.setDiscountRules([discountRule]);
  const total = Pricing.calculateTotal(scannedItems);
  expect(total).toEqual(20+(80-8));
});
