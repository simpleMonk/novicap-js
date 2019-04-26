import { Pricing } from './Pricing';
/**
 * Checkout 
 * 
 *   Supports add/remove and calculate total
 */
class Checkout {
  constructor() {
    this.cart = [];
    this.total = 0;
    this._pricingModule = null;
  }

  scan(productCode) {
    this.cart.push(productCode);
    return this;
  }

  remove(productCode) {
    const lastOccurenceIndex = this.cart.lastIndexOf(productCode);
    if (lastOccurenceIndex >= 0) {
      this.cart.splice(lastOccurenceIndex, 1);
    }
    return this;
  }

  calculateTotal() {
    return  this._pricingModule.calculateTotal(this.cart);
  }

  setPricingModule(pricingModule){
    this._pricingModule = pricingModule;
  }
}

/**
 * Gives a checkout instance with Pricing Module
 * @param {*} pricingModule 
 */
const getCheckoutProcess = (pricingModule) => {
  const co = new Checkout();
  co.setPricingModule(pricingModule);
  return co;
};

export { Checkout, getCheckoutProcess };
