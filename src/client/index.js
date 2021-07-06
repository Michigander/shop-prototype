import { html, render } from "lit-html";

// mocked product data
const productData = [
  { name: "OK bloomer", src: "https://i.imgur.com/GQeRsSI.jpeg" },
  { name: "lab coat", src: "https://i.imgur.com/SuTz9sf.jpg" },
  { name: "lab coat coral", src: "https://i.imgur.com/Gj5nc66.jpeg" },
];

// cart
if (!window.localStorage) {
  console.warn("NO LOCAL STORAGE! THINGS WILL BREAK!");
}
const localStorageItemId = "my-rando-key";
let item = JSON.parse(localStorage.getItem(localStorageItemId));
if (!item) {
  console.log("Initializing store item");
  const initialStoreItem = {
    cart: {},
    productData: [
      { name: "OK bloomer", src: "https://i.imgur.com/GQeRsSI.jpeg" },
      { name: "lab coat", src: "https://i.imgur.com/SuTz9sf.jpg" },
      { name: "lab coat coral", src: "https://i.imgur.com/Gj5nc66.jpeg" },
    ],
  };
  localStorage.setItem(localStorageItemId, JSON.stringify(initialStoreItem));
}
item = JSON.parse(localStorage.getItem(localStorageItemId));
const subscribers = [];
const subscribe = (func) => subscribers.push(func);
const store = new Proxy(item, {
  get: function (obj, prop) {
    return obj[prop];
  },
  set: function (obj, prop, value) {
    obj[prop] = value;
    localStorage.setItem(localStorageItemId, JSON.stringify(obj));
    subscribers.forEach((func) => func(obj));
    return true;
  },
});

/**
 * Creates an element connected to the store.
 * @param {*} id
 * @param {*} lens
 * @param {*} template
 * @returns
 */
const createElement = (id, lens, template) =>
  subscribe((data) =>
    render(template(lens(data)), document.getElementById(id))
  );

// product card
const addProductToCart = (productName) => () => {
  if (!store.cart[productName]) {
    return (store.cart = {
      ...store.cart,
      [productName]: {
        numberInCart: 1,
      },
    });
  } else {
    return (store.cart = {
      ...store.cart,
      [productName]: {
        numberInCart: store.cart[productName].numberInCart + 1,
      },
    });
  }
};
const productCardLens = (productId) => (state) => {
  const productDatum = state.productData.find(({ name }) => name === productId);

  return !productDatum
    ? { error: new Error("no product data") }
    : {
        src: productDatum.src,
        name: productDatum.name,
        numberInCart: state.cart[productId]
          ? state.cart[productId].numberInCart
          : 0,
      };
};

const productCardTemplate = ({ error, ...productDatum }) =>
  error
    ? html`no product data found`
    : html`
        <div class="product-card">
          <img src=${productDatum.src} />
          <span class="product-card-name">${productDatum.name}</span>
          <button
            class="product-card-add-button"
            @click=${addProductToCart(productDatum.name)}
          >
            add it (${productDatum.numberInCart})
          </button>
        </div>
      `;

// product cards
const productsRootId = "product-cards-root";
const productsLens = (state) => ({
  productData: state.productData,
});
const productsTemplate = ({ productData }) =>
  productData.map(({ name }) =>
    productCardTemplate(productCardLens(name)(store))
  );
createElement(productsRootId, productsLens, productsTemplate);

subscribers.forEach((func) => func(store));
