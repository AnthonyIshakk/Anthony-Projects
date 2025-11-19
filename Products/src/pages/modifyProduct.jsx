import { useParams, useNavigate } from "react-router";
import ProductForm from "../components/ProductForm";
import { useApi } from "@/hooks/useApi";

export default function ModifyProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data,
    loading,
    error,
    makeRequest: fetchProduct,
  } = useApi(`/products/${id}`, "GET", [id]);
  const { makeRequest: updateProduct } = useApi(`/products/${id}`, "PUT", null);
  const { makeRequest: deleteProduct } = useApi(
    `/products/${id}`,
    "DELETE",
    null
  );

  console.log("ModifyProduct data:", data);

  const product = data?.product ?? data ?? null;

  async function handleUpdate(updated) {
    const formData = new FormData();
    formData.append("title", updated.title);
    formData.append("description", updated.description);
    formData.append("price", updated.price);
    if (updated.image) formData.append("image", updated.image);
    if (updated.merchantId) formData.append("merchantId", updated.merchantId);

    const result = await updateProduct(formData);
    if (!result) return alert("Failed to update product");

    alert("Product updated!");
    navigate("/cards");
  }

  async function handleDelete(updated) {
    const result = await deleteProduct({ merchantId: updated?.merchantId });
    if (!result) return alert("Failed to delete product");

    alert("Product deleted!");
    navigate("/cards");
  }

  if (loading)
    return <p className="text-center text-gray-500">Loading product...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!product)
    return <p className="text-center text-gray-500">No product found</p>;

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white border rounded-xl shadow-sm p-8 w-full max-w-lg space-y-6">
        <h1 className="text-xl font-semibold">Edit Product</h1>
        <ProductForm
          product={product}
          mode="update"
          onSubmit={handleUpdate}
          onDelete={() => handleDelete(product)}
        />
      </div>
    </section>
  );
}
