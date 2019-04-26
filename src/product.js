/**
 * Product
 */
class Product {
  constructor(code, description, price, currency, status) {
    this.code = code;
    this.description = description;
    this.price = price;
    this.currency = currency;
    this.status = status;
    this._discountApplier = function() {
      return this.price;
    };
  }

  /**
   * This is a function which modifies the price and return it
   * @param {*} discountApplier 
   */
  setDiscountApplier(discountApplier) {
    this._discountApplier = discountApplier;
  }

  /**
   * This will apply any discount price modification to cost price and return
   */
  getPrice() {
    if (typeof this._discountApplier === 'function') {
      return this._discountApplier(this.price);
    }
    return this.price;
  }
}

/**
 * Unique Product item
 * @param {*} product 
 */
const getProductItem = product => {
  const { code, price, getPrice, setDiscountApplier } = product;
  const productItem = Object.assign(
    {},
    {
      code,
      price,
      getPrice,
      setDiscountApplier,
      id: uuidv4()
    }
  );
  return productItem;
};

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export { Product, getProductItem };
