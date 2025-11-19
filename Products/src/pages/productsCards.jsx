import { useState, useEffect } from "react";
import ProductsCards from "@/components/Product-cards";
import { useNavigate } from "react-router";
import { SearchIcon, Bell, Share2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";

export default function ProductsCardsPage() {
  const [limit, setLimit] = useState(8);
  const [userName, setUserName] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState("");
  const navigate = useNavigate();

  const [state, setState] = useState({
    page: 0,
    searchTerm: "",
    minPrice: "",
    maxPrice: "",
    view: "cards",
  });

  const { page, searchTerm, minPrice, maxPrice, view } = state;

  // 🧠 Fetch logged-in user and permissions
  const { data: userData } = useApi("/user/profile", "GET", []);
  const user = userData?.user || null;
  const userPermissions = user?.permissions || [];

  // 🧩 Permission checks
  const canView = userPermissions.includes("view_product");
  const canCreate = userPermissions.includes("create_product");

  // 🧠 Fetch merchants and products
  const { data: merchants } = useApi("/merchants", "GET", [
    userData?.user?.merchant_id,
  ]);

  const {
    data: productsData,
    loading: productsLoading,
    error: productsError,
  } = useApi(
    selectedMerchant ? `/products?merchantId=${selectedMerchant}` : "/products",
    "GET",
    [selectedMerchant]
  );

  const products = productsData?.products || [];

  useEffect(() => {
    if (user?.name) {
      const firstName = user.name.split(" ")[0] || "";
      setUserName(firstName);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setState((s) => ({ ...s, page: 0 }));
    }
  }, [selectedMerchant, user]);

  const handleSearch = () => {
    setState((s) => ({ ...s, page: 0 }));
  };

  const filteredData = products.filter((item) => {
    const price = item.price || 0;
    const min = minPrice ? parseFloat(minPrice) : -Infinity;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;

    const matchesPrice = price >= min && price <= max;
    const matchesSearch =
      searchTerm.trim() === "" ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesPrice && matchesSearch;
  });

  const start = page * limit;
  const paginatedData = filteredData.slice(start, start + limit);
  const totalFiltered = filteredData.length;

  const nextPage = () => {
    if ((page + 1) * limit < totalFiltered) {
      setState((s) => ({ ...s, page: s.page + 1 }));
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setState((s) => ({ ...s, page: s.page - 1 }));
    }
  };

  // 🧩 Restrict entire page if user cannot view products
  if (!canView) {
    return (
      <section className="flex items-center justify-center h-[70vh]">
        <p className="text-gray-600 text-lg font-medium">
          You don’t have permission to view products.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto space-y-4">
      {productsError && <p className="text-red-500">{productsError}</p>}

      <div className="bg-white border rounded-md px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800 px-2">
          {userName ? `Hello ${userName}` : "Hello..."}
        </h2>

        <div className="flex-1 max-w-3xl mx-6 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) =>
              setState((s) => ({ ...s, searchTerm: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full h-9 rounded-md bg-gray-100 border border-gray-200 pl-9 pr-3 text-sm text-gray-700 placeholder-gray-700 focus:ring-1 focus:ring-gray-300 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <div className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <Bell className="w-5 h-5 text-gray-700" />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <Share2 className="w-5 h-5 text-gray-700" />
          </div>
          <div className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 overflow-hidden cursor-pointer bg-gray-100">
            <span className="text-sm font-semibold text-gray-700">
              {userName ? userName.charAt(0) : "?"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl px-6 py-6">
        <ProductsCards
          view={view}
          setView={(next) =>
            setState((s) => ({
              ...s,
              view: typeof next === "function" ? next(s.view) : next,
            }))
          }
          products={paginatedData}
          searchTerm={searchTerm}
          setSearchTerm={(val) => setState((s) => ({ ...s, searchTerm: val }))}
          onSearch={handleSearch}
          onCreate={() => canCreate && navigate("/products/add")}
          page={page}
          total={totalFiltered}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          limit={limit}
          setLimit={setLimit}
          loading={productsLoading}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setState={setState}
          merchants={merchants || []}
          selectedMerchant={selectedMerchant}
          setSelectedMerchant={setSelectedMerchant}
          user={user}
          permissions={userPermissions} // ✅ Pass permissions
        />
      </div>
    </section>
  );
}
