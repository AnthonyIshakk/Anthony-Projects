import {
  productsList,
  CountProducts,
  SearchProducts,
  CountSearch,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductById,
} from "../repositories/prod_repo.js";

const AllowedSorts = ["id", "title", "description", "price"];
const AllowedOrders = ["asc", "desc"];

function getDefault(query) {
  let sort = query.sort || "id";
  let order = query.order || "asc";
  const limit = parseInt(query.limit) || 30;
  const offset = parseInt(query.offset) || 0;
  const q = query.q || "";
  if (!AllowedSorts.includes(sort)) sort = "id";
  if (!AllowedOrders.includes(order)) order = "asc";
  return { sort, order, limit, offset, q };
}

//merge both list w search
export async function ProductsListService(query, merchantId) {
  const { sort, order, limit, offset } = getDefault(query);
  const [items, total] = await Promise.all([
    productsList({ sort, order, limit, offset, merchantId }),
    CountProducts({ merchantId }),
  ]);
  return { items, total, limit, offset };
}

export async function SearchProductsService(query, merchantId) {
  const { sort, order, limit, offset, q } = getDefault(query);
  const [items, total] = await Promise.all([
    SearchProducts({ sort, order, limit, offset, q, merchantId }),
    CountSearch({ q, merchantId }),
  ]);
  return { items, total, limit, offset, q };
}

export async function createProductService({ title, price, description, image_url, merchantId }) {
  return await createProduct({ title, price, description, image_url, merchantId });
}

export async function updateProductService({ id, title, price, description, image_url, merchantId, overrideMerchantId }) {
  const upd = await updateProduct({ id, title, price, description, image_url, merchantId, overrideMerchantId });
  if (!upd) throw new Error("Product not updated or found!");
  return upd;
}


export async function deleteProductService({ id, merchantId }) {
  const dlt = await deleteProduct({ id, merchantId });
  if (!dlt) throw new Error("Product not deleted!");
  return dlt;
}

export async function findProductService({ id, merchantId }) {
  const find = await findProductById({ id, merchantId });
  if (!find) throw new Error("Product not found!");
  return find;
}
