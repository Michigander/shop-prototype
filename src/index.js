import { html, render } from "lit-html";
import { asyncReplace } from "lit-html/directives/async-replace.js";
import { mockStock } from "./stock";
import { addProductToCart, subscribeToProduct } from "./cart";

const rootElementId = "product-cards-root";

/**
 * PRODUCT CARD
 */

async function* productQuery(productId) {
  const product = mockStock.find(({ name }) => name === productId);
  for await (const cart of subscribeToProduct(productId)) {
    yield { product, cart };
  }
}

async function* createProductCard(productId) {
  for await (const productSnapshot of productQuery(productId)) {
    yield productCard(productSnapshot);
  }
}

function productCard({ product, cart }) {
  return html`
    <div class="product-card">
      <img src=${product.src} />
      <span class="product-card-name">${product.name}</span>
      <button
        class="product-card-add-button"
        @click=${() => addProductToCart(product.name)}
      >
        add it (${cart.numberInCart})
      </button>
    </div>
  `;
}

/**
 * PRODUCT CARDS
 */

async function* productIdsQuery() {
  yield mockStock.map(({ name }) => name);
}

async function* createProductCards() {
  for await (const productIds of productIdsQuery()) {
    yield productCards({ productIds });
  }
}

function productCards({ productIds }) {
  return productIds.map((id) => asyncReplace(createProductCard(id)));
}

render(
  asyncReplace(createProductCards()),
  document.getElementById(rootElementId)
);
