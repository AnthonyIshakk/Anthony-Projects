import { useState, useEffect, useRef } from "react";
import { Button } from "@components/ui/button";
import { Table2, Columns3, Search as SearchIcon, Filter } from "lucide-react";
import CardsGrid from "@components/CardsGrid";
import ProductsTable from "@components/ProductsTable";

export default function ProductsCards({
  view = "cards",
  setView,
  loading = false,
  products = [],
  searchTerm,
  setSearchTerm,
  onSearch,
  onCreate,
  page,
  total,
  limit,
  onPrevPage,
  onNextPage,
  setLimit,
  minPrice,
  maxPrice,
  setState,
  merchants = [],
  selectedMerchant,
  setSelectedMerchant,
  user,
  permissions = [],
}) {
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [cols, setCols] = useState({
    image: true,
    title: true,
    description: true,
    price: true,
    actions: true,
  });
  const [activeTab, setActiveTab] = useState("All");

  const dropdownRef = useRef(null);
  const filterRef = useRef(null);

  // 🧩 Permission checks
  const canUpdate = permissions.includes("update_product");
  const canDelete = permissions.includes("delete_product");
  const canCreate = permissions.includes("create_product");

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setColumnsOpen(false);
      if (filterRef.current && !filterRef.current.contains(event.target))
        setFilterOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs = ["All", "Active", "Non Active"];

  const applyFilter = () => {
    setFilterOpen(false);
    onSearch();
  };

  return (
    <section className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">Management Product</h1>
          <p className="text-xs text-gray-500">Add Product to your store</p>
        </div>

        {canCreate && (
          <Button
            onClick={onCreate}
            className="h-8 px-4 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
          >
            Add Product
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center bg-gray-100 border rounded-md p-1 w-96">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-1.5 text-xs rounded-md transition-all duration-200 ${
                activeTab === tab
                  ? "bg-white text-gray-900 font-medium shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 relative">
          {user && user.merchant_id === null && (
            <div className="relative">
              <select
                value={selectedMerchant}
                onChange={(e) => setSelectedMerchant(e.target.value)}
                className="h-8 px-3 text-xs border rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                <option value="">All Merchants</option>
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Button
            className={`h-8 px-4 text-xs rounded-md ${
              view === "table"
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white border text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setView((v) => (v === "table" ? "cards" : "table"))}
          >
            <Table2 className="size-3 mr-1" />
            {view === "table" ? "Cards" : "Table"}
          </Button>

          <div className="relative" ref={dropdownRef}>
            <Button
              variant="outline"
              className="h-8 px-4 text-xs"
              disabled={view !== "table"}
              onClick={() => setColumnsOpen((o) => !o)}
            >
              <Columns3 className="size-3 mr-1" /> Columns
            </Button>
            {columnsOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white border rounded-md shadow-md p-2 z-10">
                {Object.keys(cols).map((col) => (
                  <label
                    key={col}
                    className="flex items-center gap-2 text-xs px-2 py-1 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={cols[col]}
                      onChange={() =>
                        setCols((prev) => ({ ...prev, [col]: !prev[col] }))
                      }
                    />
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={filterRef}>
            <Button
              variant="outline"
              className="h-8 px-4 text-xs"
              onClick={() => setFilterOpen((o) => !o)}
            >
              <Filter className="size-3 mr-1" /> Filter
            </Button>
            {filterOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white border rounded-md shadow-md p-3 z-10">
                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <label className="w-16 text-gray-600">Min</label>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) =>
                        setState((s) => ({ ...s, minPrice: e.target.value }))
                      }
                      className="flex-1 border rounded-md px-2 py-1 text-xs"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-16 text-gray-600">Max</label>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) =>
                        setState((s) => ({ ...s, maxPrice: e.target.value }))
                      }
                      className="flex-1 border rounded-md px-2 py-1 text-xs"
                      placeholder="9999"
                    />
                  </div>
                  <Button
                    onClick={applyFilter}
                    className="mt-2 h-7 text-xs rounded-md bg-gray-900 text-white hover:bg-gray-800"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="relative w-full max-w-xs">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="w-full h-8 rounded-md bg-gray-100 border border-gray-200 pl-7 pr-2 text-xs text-gray-700 placeholder-gray-600 focus:ring-1 focus:ring-gray-300 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        {view === "cards" ? (
          <CardsGrid
            products={products}
            loading={loading}
            permissions={permissions}
          />
        ) : (
          <ProductsTable
            products={products}
            cols={cols}
            loading={loading}
            canUpdate={canUpdate}
            canDelete={canDelete}
          />
        )}

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-gray-300"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
            <span>per page</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrevPage}
              disabled={page === 0}
              className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm ${
                page === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              ‹
            </button>

            {Array.from(
              { length: Math.max(1, Math.ceil((total ?? 0) / limit)) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (i !== page) {
                      if (i > page) onNextPage();
                      else onPrevPage();
                    }
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm ${
                    i === page
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}

            <button
              onClick={onNextPage}
              disabled={(page + 1) * limit >= total}
              className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm ${
                (page + 1) * limit >= total
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
              }`}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
