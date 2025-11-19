import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button";
import { useState, useContext } from "react";
import { useApi } from "@/hooks/useApi";
import { AuthContext } from "@/context/AuthContext";

export default function ProductForm({ product, mode, onSubmit, onDelete }) {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.merchant_id === null;

  const [title, setTitle] = useState(product ? product.title : "");
  const [description, setDescription] = useState(
    product ? product.description : ""
  );
  const [price, setPrice] = useState(product ? product.price : "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [merchantId, setMerchantId] = useState(product?.merchant_id || "");

  const {
    data: merchants,
    loading: merchantsLoading,
    error: merchantsError,
  } = useApi("/merchants", "GET", isAdmin ? [] : null);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    onSubmit({
      title,
      description,
      price,
      image,
      merchantId: isAdmin ? merchantId : undefined,
    });
  }

  let submitButton;
  let deleteButton;

  if (mode === "create") {
    submitButton = (
      <Button type="submit" className="w-full sm:w-auto">
        Create Product
      </Button>
    );
  } else if (mode === "update") {
    submitButton = (
      <Button type="submit" className="w-full sm:w-auto">
        Update Product
      </Button>
    );
    deleteButton = (
      <Button
        type="button"
        onClick={onDelete}
        variant="destructive"
        className="w-full sm:w-auto"
      >
        Delete Product
      </Button>
    );
  }

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6 max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            placeholder="Enter the title of your product"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            value={description}
            placeholder="Enter the description of your product"
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            placeholder="Enter the price of your product"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {isAdmin && (
          <div className="grid gap-2">
            <Label htmlFor="merchant">Merchant</Label>
            {merchantsLoading && (
              <p className="text-xs text-gray-500">Loading merchants...</p>
            )}
            {merchantsError && (
              <p className="text-xs text-red-500">{merchantsError}</p>
            )}
            <select
              id="merchant"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-gray-300"
            >
              <option value="">No merchant (Global Product)</option>
              {merchants?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="image">Product Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 mt-3 object-cover border rounded-md"
            />
          )}
        </div>

        <div className="flex gap-4">
          {submitButton}
          {deleteButton}
        </div>
      </form>
    </div>
  );
}
