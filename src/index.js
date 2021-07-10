import { html, render } from "lit-html";
import { asyncReplace } from "lit-html/directives/async-replace.js";
import { addProductToCart } from "./cart";
import { productIdsQuery } from "./products";
import { productWithCartQuery } from "./products.js";

const rootElementId = "product-cards-root";

/**
 * PRODUCT CARD
 */
async function* createProductCard(productId) {
  for await (const productSnapshot of productWithCartQuery(productId)) {
    console.log(`[card] : ${JSON.stringify(productSnapshot)}`);
    yield productCard(productSnapshot);
  }
}

function productCard({ product, cart }) {
  if (!product || !cart) {
    console.log(`[productcard] invalid data`);
    return;
  }

  return html`
    <div class="product-card">
      <img src=${product?.src} />
      <span class="product-card-name">${product?.name}</span>
      <button
        class="product-card-add-button"
        @click=${() => addProductToCart(product?.name)}
      >
        add it (${cart?.numberInCart})
      </button>
    </div>
  `;
}

/**
 * PRODUCT CARDS
 */
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
