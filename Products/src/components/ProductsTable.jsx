import { Button } from "@components/ui/button";
import { useNavigate } from "react-router";

export default function ProductsTable({
  products,
  cols,
  loading,
  canUpdate,
  canDelete,
}) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border">
        <div className="p-6 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!products?.length) {
    return <p className="text-center text-gray-500 py-6">No products found</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm border-collapse">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr className="text-gray-700 font-medium">
            {cols.image && <th className="px-5 py-3 w-28">Image</th>}
            {cols.title && <th className="px-5 py-3 w-1/4">Title</th>}
            {cols.description && <th className="px-5 py-3">Description</th>}
            {cols.price && <th className="px-5 py-3 text-right w-24">Price</th>}
            {cols.actions && (
              <th className="px-5 py-3 text-center w-36">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {products.map((p, i) => (
            <tr
              key={p.id || i}
              className="border-b last:border-0 hover:bg-gray-50 transition-colors"
            >
              {cols.image && (
                <td className="px-5 py-3 align-middle">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 border rounded-md overflow-hidden">
                    <img
                      src={
                        p.image_url ||
                        "https://via.placeholder.com/80x60.png?text=No+Image"
                      }
                      alt={p.title || "Product"}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </td>
              )}

              {cols.title && (
                <td className="px-5 py-3 align-middle font-medium text-gray-800">
                  {p.title || "Untitled Product"}
                </td>
              )}

              {cols.description && (
                <td className="px-5 py-3 align-middle text-gray-600 max-w-xs truncate">
                  {p.description || (
                    <span className="italic text-gray-400">No description</span>
                  )}
                </td>
              )}

              {cols.price && (
                <td className="px-5 py-3 align-middle text-right font-semibold text-gray-700">
                  {p.price ? `$${p.price}` : "N/A"}
                </td>
              )}

              {cols.actions && (
                <td className="px-5 py-3 align-middle">
                  <div className="flex items-center justify-center gap-2">
                    {canUpdate && (
                      <Button
                        size="sm"
                        className="bg-gray-800 text-white hover:bg-gray-700 h-7 px-3 text-xs"
                        onClick={() => navigate(`/products/${p.id}`)}
                      >
                        Edit
                      </Button>
                    )}

                    {canDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 px-3 text-xs"
                        onClick={() => navigate(`/products/${p.id}`)}
                      >
                        Delete
                      </Button>
                    )}

                    {!canUpdate && !canDelete && (
                      <span className="text-xs text-gray-400 italic">
                        No actions
                      </span>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
