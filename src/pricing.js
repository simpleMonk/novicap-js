import { Product, getProductItem } from './product';
import { ProductCatalogue } from './product-catalogue';
import { Discount } from './discount';

/**
 * Pricing utility
 */
const PricingUtil = () => {
  //Initial Catalogue and Discount rules
  let catalogue = new ProductCatalogue();
  let rules = [];

  const hasAnyItemIn = item => item.length > 0;

  /**
   * takes product codes and return total
   * @param {*} items 
   */
  const calculateTotal = items => {
    //If not product catalogue, please set it 
    if (catalogue.getTotalProducts() == 0) {
      throw new Error(
        'Product Catalogue is Empty. Please add it items to Catalogue'
      );
    }
    const productsWithPrice = getProducts(items);
    let cart = [];
    let allDiscountedItems = [];
    const addToCart = item => cart.push(item);

    // for given list of product items , iterate through each discount rule
    for (let i = 0; i < productsWithPrice.length; i++) {
      let currentItem = productsWithPrice[i];
      let discountedItems = [];
      let atleastOneDiscountApplied = false;

      // if no rules
      if (hasAnyItemIn(rules)) {
        for (let j = 0; j < rules.length; j++) {
          const currentRule = rules[j];
          discountedItems = currentRule.applier.call(null, cart, currentItem,allDiscountedItems);
          const discountedItemsId = discountedItems.map(it => it.id);
          if (hasAnyItemIn(discountedItems)) {
            atleastOneDiscountApplied = true;
            cart = removeDiscountedItemsFromCart(cart, discountedItemsId);
            break;
          } 
    
          if (!hasAnyItemIn(cart)) {
            break;
          }
        }
      } 

      if(!atleastOneDiscountApplied){
        addToCart(currentItem);
      }
      allDiscountedItems = allDiscountedItems.concat(discountedItems);
    }
    const finalCartItems = cart.concat(allDiscountedItems);
    return getTotalPrice(finalCartItems);
  };

  /**
   * Set product catalogure
   * @param {*} productCatalogue 
   */
  const setProductCatalogue = productCatalogue => {
    catalogue = productCatalogue;
  };

  /**
   * Set discount rules
   * @param {*} discountRules 
   */
  const setDiscountRules = discountRules => {
    rules = discountRules;
  };

  /**
   * Returns final price of the order
   * @param {*} products 
   */
  const getTotalPrice = products => {
    return products.reduce((accumulator, currentValue, currentIndex, array) => {
      return accumulator + currentValue.getPrice();
    }, 0);
  };

  /**
   * For given product code, return the product with discountApplier
   * @param {*} productCodes 
   */
  const getProducts = productCodes => {
    return productCodes.map(item =>
      getProductItem(catalogue.findProduct(item))
    );
  };

  /**
   * Remove's discounted item from general cart 
   * @param {*} unDiscountedItemsInCart 
   * @param {*} discountedItemsId 
   */
  function removeDiscountedItemsFromCart(
    unDiscountedItemsInCart,
    discountedItemsId
  ) {
    return unDiscountedItemsInCart.filter(it => {
      return discountedItemsId.indexOf(it.id) === -1;
    });
  }

  return {
    calculateTotal,
    setProductCatalogue,
    setDiscountRules
  };
};

const Pricing = Object.freeze(PricingUtil());

export { Pricing };
