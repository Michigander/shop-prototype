import { html, render } from "lit-html";
import { asyncReplace } from "lit-html/directives/async-replace.js";
import { subscribeToCart, clearCart, subscribeToProduct } from "./cart.js";

const rootElementId = "bag-items-root";

async function* Bag() {
  for await (const cart of subscribeToCart()) {
    const items = Object.keys(cart)
      .filter((productId) => cart[productId])
      .map(
        (productId) => html` <li>${asyncReplace(BagItem({ productId }))}</li> `
      );

    const list = html`<ul>
      ${items}
    </ul>`;

    yield html`
      ${list}
      <button @click=${clearCart}>clear cart</button>
    `;
  }
}

async function* BagItem({ productId }) {
  for await (const cartInfo of subscribeToProduct(productId)) {
    yield html`<span>${cartInfo.numberInCart} x ${productId}</span>`;
  }
}

render(asyncReplace(Bag()), document.getElementById(rootElementId));
