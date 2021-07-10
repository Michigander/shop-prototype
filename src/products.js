import { createSelector } from "../lib/generac/build/src/create-selector.js";
import { delay } from "../lib/generac/build/src/utils";
import { subscribeToProduct } from "./cart.js";

const mockStock = [
  { name: "OK bloomer", src: "https://i.imgur.com/GQeRsSI.jpeg" },
  { name: "lab coat", src: "https://i.imgur.com/SuTz9sf.jpg" },
  { name: "lab coat coral", src: "https://i.imgur.com/Gj5nc66.jpeg" },
];

export async function* productQuery(productId) {
  yield mockStock.find(({ name }) => name === productId);
}

export async function* productIdsQuery() {
  yield mockStock.map(({ name }) => name);
}

export function productWithCartQuery(productId) {
  const lens = ([product, cart]) => ({
    cart: cart?.value,
    product: product?.value,
  });

  const stream = createSelector(
    lens,
    productQuery(productId),
    subscribeToProduct(productId)
  );

  return stream;
}
