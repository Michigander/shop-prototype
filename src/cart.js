import createObservedCache from "../lib/generac/build/src/create-observed-cache.js";

const cacheKey = "citybloomers/cart/key";

let { data, subscribe } = createObservedCache(cacheKey);

export const addProductToCart = (productId) => {
  const currentCount = data[productId] || 0;
  data[productId] = currentCount + 1;
};

export const subscribeToCart = subscribe;

export async function* subscribeToProduct(productId) {
  console.log(`[cart] subscribing to ${productId}`);
  for await (const cart of subscribe()) {
    console.log(`[cart] update to ${productId} : ${cart}`);
    yield {
      numberInCart: cart[productId] || 0,
    };
  }
}

export function clearCart() {
  console.log("[cart] clearing...");
  Object.keys(data).forEach((key) => (data[key] = undefined));
  console.log("[cart] cleared.");
}
