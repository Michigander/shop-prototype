export async function* productQuery(productId) {
  yield mockStock.find(({ name }) => name === productId);
}
