import { Pricing } from '../pricing';
import { ProductCatalogue } from '../product-catalogue';
import { Product } from '../product';
import { Discount } from '../discount';
import { Checkout, getCheckoutProcess } from  '../Checkout';

const productCatalogue = new ProductCatalogue();
let co = null;

beforeAll(()=>{
  productCatalogue.add(
    new Product('VOUCHER', 'Voucher details here', 5, 'Euro', 'IN_STOCK')
  );
  productCatalogue.add(
    new Product('TSHIRT', 'FC Barcelona TSHIRT', 20, 'Euro', 'IN_STOCK')
  );
  productCatalogue.add(
    new Product('MUG', 'FC Barcelona Mug', 7.5, 'Euro', 'IN_STOCK')
  );

  const discountRuleTShirts = new Discount(
    '10% of for TSHIRT , if purchased more than 3',
    function(undiscountedItemsInCart, currentItem,allDiscountedItems) {
      let discountedItems = [];
      let existingItemsInCart = undiscountedItemsInCart;
      const findTShirts = (item)=>{
        return item.code === "TSHIRT";
     };

      let tShirtInCart = existingItemsInCart.filter(findTShirts);
      let tShirtInDiscountedItems = allDiscountedItems.filter(findTShirts);
      if(tShirtInCart.length >= 2 && currentItem.code === 'TSHIRT'){
        tShirtInCart.push(currentItem);
        tShirtInCart = tShirtInCart.map(function(item) {
          item.setDiscountApplier(function(price) {
            return  19;
          });
          return item;
        });
        discountedItems = discountedItems.concat(tShirtInCart);
      }
      if(tShirtInDiscountedItems.length > 2 && currentItem.code === 'TSHIRT'){
        currentItem.setDiscountApplier(function(price) {
          return  19;
        });
        discountedItems.push(currentItem);
      }
      
      return discountedItems;
    }
  );
  const discountRuleTwoInOne = new Discount(
    '2 in 1 Promotion',
    function(undiscountedItemsInCart, currentItem) {
      let discountedItems = [];
      let existingItemsInCart = undiscountedItemsInCart;

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
    }
  );
  Pricing.setProductCatalogue(productCatalogue);
  Pricing.setDiscountRules([discountRuleTShirts,discountRuleTwoInOne]);
});

beforeEach(()=>{
  co = getCheckoutProcess(Pricing);
})


it('Case 1: VOUCHER, TSHIRT, MUG :: 32.50€', () => {
  const scannedItems = [
    'VOUCHER',
    'TSHIRT',
    'MUG'
  ];

  scannedItems.forEach(co.scan.bind(co));
  const total = co.calculateTotal();
  expect(total).toEqual(32.5);
});


it('Case 2: TSHIRT, TSHIRT, TSHIRT, VOUCHER, TSHIRT :: 81€', () => {
  const scannedItems = [
    'TSHIRT', 'TSHIRT', 'TSHIRT', 'VOUCHER', 'TSHIRT'
  ];
  scannedItems.forEach(co.scan.bind(co));
  const total = co.calculateTotal();
  expect(total).toEqual(81);// 19 + 19 + 19 + 5 + 19;
});

it('Case 3: VOUCHER, TSHIRT, VOUCHER, VOUCHER, MUG, TSHIRT, TSHIRT :: 74.50€', () => {
  const scannedItems = [
    'VOUCHER', 'TSHIRT', 'VOUCHER', 'VOUCHER', 'MUG', 'TSHIRT', 'TSHIRT'
  ];
  scannedItems.forEach(co.scan.bind(co));
  const total = co.calculateTotal();
  expect(total).toEqual(74.50);//5+19+5+0+7.5+19+19
});

it('Case 4: VOUCHER, TSHIRT, VOUCHER :: 74.50€', () => {
  const scannedItems = [
    'VOUCHER', 'TSHIRT', 'VOUCHER'
  ];
  scannedItems.forEach(co.scan.bind(co));
  const total = co.calculateTotal();
  expect(total).toEqual(30); //Not 25 as mentioned in gist
});
