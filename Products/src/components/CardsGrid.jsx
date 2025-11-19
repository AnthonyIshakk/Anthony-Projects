import { useNavigate } from "react-router";
import { Card } from "@components/ui/card";
import { Star } from "lucide-react";
import { useState } from "react";

export default function CardsGrid({ products, permissions = [] }) {
  const navigate = useNavigate();
  const canUpdate = permissions.includes("update_product");

  if (!products?.length) {
    return <p className="text-center text-gray-500">No products found</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-6">
      {products.map(({ id, image_url, title, description, price }) => {
        const rating = (Math.random() * (5 - 2) + 2).toFixed(1);

        return (
          <Card
            key={id}
            onClick={() => {
              if (canUpdate) navigate(`/products/${id}`);
            }}
            className={`border rounded-lg p-3 flex flex-col bg-white transition ${
              canUpdate
                ? "cursor-pointer hover:shadow-md"
                : "cursor-default shadow-sm"
            }`}
          >
            <div className="w-full h-40 bg-white flex items-center justify-center rounded-md overflow-hidden border">
              <img
                src={
                  image_url ||
                  "https://via.placeholder.com/300x225.png?text=No+Image"
                }
                alt={title || "Product"}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-2 flex flex-col flex-1 justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-800 truncate">
                  {title || "Untitled Product"}
                </h3>

                {description && <TruncatedText text={description} />}
              </div>

              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">
                  {price ? `$${price}` : "N/A"}
                </p>

                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{rating}</span>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function TruncatedText({ text, limit = 60 }) {
  const [expanded, setExpanded] = useState(false);

  if (text.length <= limit) {
    return <p className="text-xs text-gray-500 mt-1 break-words">{text}</p>;
  }

  return (
    <div className="mt-1">
      <p className="text-xs text-gray-500 break-words">
        {expanded ? text : text.slice(0, limit) + "..."}
      </p>
      <button
        type="button"
        className="text-blue-600 hover:underline text-xs font-medium mt-1 block"
        onClick={(e) => {
          e.stopPropagation();
          setExpanded(!expanded);
        }}
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}
