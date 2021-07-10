import createObservedCache from "../lib/generac/build/src/create-observed-cache.js";

let { data, subscribe } = createObservedCache("citybloomers/cart/key");

export const addProductToCart = (productId) => {
  const currentCount = data[productId] || 0;
  data[productId] = currentCount + 1;
};

export async function* subscribeToProduct(productId) {
  console.log(`[cart] subscribing to ${productId}`);
  for await (const cart of subscribe()) {
    console.log(`[cart] update to ${productId} : ${cart}`);
    yield {
      numberInCart: cart[productId] || 0,
    };
  }
}
