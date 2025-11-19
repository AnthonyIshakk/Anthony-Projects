import ProductForm from "../components/ProductForm";
import { useNavigate } from "react-router";
import { useApi } from "@/hooks/useApi";

export default function CreateProduct() {
  const navigate = useNavigate();

  const { makeRequest: createProduct } = useApi("/products", "POST", null);

  async function handleCreate(product) {
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("price", product.price);

    if (product.image) {
      formData.append("image", product.image);
    }

    if (product.merchantId) {
      formData.append("merchantId", product.merchantId);
    }

    const result = await createProduct(formData);

    if (!result) {
      alert("Failed to create product");
      return;
    }

    alert("Product created!");
    navigate("/cards");
  }

  return (
    <section className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white border rounded-xl shadow-sm p-8 w-full max-w-lg space-y-6">
        <h1 className="text-xl font-semibold">Create Product</h1>
        <ProductForm mode="create" onSubmit={handleCreate} />
      </div>
    </section>
  );
}
