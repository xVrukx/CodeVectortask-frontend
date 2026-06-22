import { useEffect, useState } from "react";

export const App = () => {
  const [search_item, setsearch_item] = useState("");
  const [Filter_catagery, setFilter_catagery] = useState("");
  const [Showing_data, setShowing_data] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [add_data, setadd_data] = useState({
    name: "",
    model_number: "",
    category: "",
  });

  const [Update_data, setupdate_data] = useState({
    _id: "",
    name: "",
    model_number: "",
    category: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [updateProducts, setUpdateProducts] = useState([]);
  const [updatePage, setUpdatePage] = useState(1);
  const [updateTotalPages, setUpdateTotalPages] = useState(1);
  const [updateLoading, setUpdateLoading] = useState(false);

  const LIMIT = 12;

const getAllData = async (page = 1) => {
  try {
    setLoading(true);
    setError("");

    const query = new URLSearchParams({
      page: String(page),
      limit: String(LIMIT),
    });

    if (Filter_catagery.trim()) {
      query.append("category", Filter_catagery.trim());
    }

    if (search_item.trim()) {
      query.append("search", search_item.trim());
    }

    const res = await fetch(
      `http://localhost:5000/api/alldata?${query.toString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      setError("failed to get data");
      return;
    }

    const data = await res.json();

    setShowing_data(data.data || []);
    setCurrentPage(data.page || 1);
    setTotalPages(data.totalPages || 1);
  } catch (err) {
    setError("failed to get data");
  } finally {
    setLoading(false);
  }
};

  const getUpdateList = async (page = 1) => {
    try {
      setUpdateLoading(true);
      setError("");

      const query = new URLSearchParams({
        page: String(page),
        limit: String(LIMIT),
      });

      const res = await fetch(`http://localhost:5000/api/alldata?${query.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        setError("failed to get update list");
        return;
      }

      const data = await res.json();

      const products = Array.isArray(data) ? data : data?.data || data?.products || [];
      setUpdateProducts(products);
      setUpdateTotalPages(data?.totalPages || 1);
      setUpdatePage(data?.page || page);
    } catch (err) {
      setError("failed to get update list");
    } finally {
      setUpdateLoading(false);
    }
  };

const getfilteredData = async () => {
  setCurrentPage(1);
  await getAllData(1);
};

const getsearchData = async () => {
  setCurrentPage(1);
  await getAllData(1);
};

  const addData = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/Add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(add_data),
      });

      if (!res.ok) {
        setError("failed to add data");
        return;
      }

      await res.json();

      setadd_data({
        name: "",
        model_number: "",
        category: "",
      });

      setShowAddModal(false);
      getAllData(1);
    } catch (err) {
      setError("failed to add data");
    }
  };

  const updateData = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Update_data),
      });

      if (!res.ok) {
        setError("failed to update data");
        return;
      }

      await res.json();

      setupdate_data({
        _id: "",
        name: "",
        model_number: "",
        category: "",
      });

      setShowUpdateModal(false);
      getAllData(1);
    } catch (err) {
      setError("failed to update data");
    }
  };

  useEffect(() => {
    getAllData(1);
  }, []);

  const products = Array.isArray(Showing_data) ? Showing_data : [];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="sticky top-0 z-20 border-b border-white/20 bg-purple-700 px-4 py-3 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-2 md:w-auto">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
            >
              Add
            </button>

            <button
              type="button"
              onClick={() => {
                setShowUpdateModal(true);
                getUpdateList(1);
              }}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 md:hidden"
            >
              Update
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              getsearchData();
            }}
            className="flex w-full items-center gap-2 md:max-w-2xl md:flex-1 md:justify-center"
          >
            <input
              type="text"
              value={search_item}
              onChange={(e) => setsearch_item(e.target.value)}
              placeholder="Search product"
              className="w-full rounded-2xl border border-white/20 bg-white/90 px-4 py-2 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
            >
              Search
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setShowUpdateModal(true);
              getUpdateList(1);
            }}
            className="hidden rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 md:inline-flex"
          >
            Update
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Products</h1>
            <p className="text-sm text-slate-500">
              Browse newest first, filter by category, and paginate later.
            </p>
          </div>

          <div className="w-full sm:w-56">
            <select
              value={Filter_catagery}
              onChange={(e) => setFilter_catagery(e.target.value)}
              onBlur={() => {
                if (Filter_catagery.trim()) getfilteredData();
                else getAllData(1);
              }}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Category</option>
              <option value="Laptop">Laptop</option>
              <option value="Mobile">Mobile</option>
              <option value="MotherBoard">MotherBoard</option>
              <option value="Processer">Processer</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl border bg-white p-6 text-center text-slate-500">
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed bg-white p-8 text-center text-slate-500">
            No products found.
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((item, index) => (
              <article
                key={item._id || item.model_number || index}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold">{item.name}</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.model_number}
                    </p>
                  </div>

                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                    {item.category}
                  </span>
                </div>

                <div className="mt-4 space-y-1 text-sm text-slate-600">
                  <p>
                    <span className="font-medium">Created:</span>{" "}
                    {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
                  </p>
                  <p>
                    <span className="font-medium">Updated:</span>{" "}
                    {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "-"}
                  </p>
                </div>
              </article>
            ))}
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => getAllData(currentPage - 1)}
                className="rounded-xl border border-slate-300 px-4 py-2 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => getAllData(currentPage + 1)}
                className="rounded-xl border border-slate-300 px-4 py-2 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        )}
      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add Product</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl px-3 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={addData} className="space-y-4">
              <input
                type="text"
                value={add_data.name}
                onChange={(e) =>
                  setadd_data({ ...add_data, name: e.target.value })
                }
                placeholder="Name"
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
              />

              <input
                type="text"
                value={add_data.model_number}
                onChange={(e) =>
                  setadd_data({ ...add_data, model_number: e.target.value })
                }
                placeholder="Model Number"
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
              />

              <select
                value={add_data.category}
                onChange={(e) =>
                  setadd_data({ ...add_data, category: e.target.value })
                }
                className="w-full rounded-2xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Category</option>
                <option value="Laptop">Laptop</option>
                <option value="Mobile">Mobile</option>
                <option value="MotherBoard">MotherBoard</option>
                <option value="Processer">Processer</option>
              </select>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-2xl border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-purple-700 px-4 py-2 font-medium text-white hover:bg-purple-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 px-4 py-6">
          <div className="mx-auto w-full max-w-6xl rounded-3xl bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Update Product</h2>
              <button
                type="button"
                onClick={() => setShowUpdateModal(false)}
                className="rounded-xl px-3 py-1 text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-600">
                  Select a product
                </h3>

                {updateLoading ? (
                  <div className="rounded-2xl border bg-slate-50 p-4 text-center text-slate-500">
                    Loading products...
                  </div>
                ) : (
                  <div className="space-y-3">
                    {updateProducts.map((item) => (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() =>
                          setupdate_data({
                            _id: item._id,
                            name: item.name,
                            model_number: item.model_number,
                            category: item.category,
                          })
                        }
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          Update_data._id === item._id
                            ? "border-purple-600 bg-purple-50"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-slate-500">
                              {item.model_number}
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                            {item.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={updatePage <= 1}
                    onClick={() => getUpdateList(updatePage - 1)}
                    className="rounded-2xl border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <p className="text-sm text-slate-500">
                    Page {updatePage} of {updateTotalPages}
                  </p>

                  <button
                    type="button"
                    disabled={updatePage >= updateTotalPages}
                    onClick={() => getUpdateList(updatePage + 1)}
                    className="rounded-2xl border border-slate-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-600">
                  Edit selected product
                </h3>

                <form onSubmit={updateData} className="space-y-4">
                  <input
                    type="text"
                    value={Update_data.name}
                    onChange={(e) =>
                      setupdate_data({ ...Update_data, name: e.target.value })
                    }
                    placeholder="Name"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!Update_data._id}
                  />

                  <input
                    type="text"
                    value={Update_data.model_number}
                    onChange={(e) =>
                      setupdate_data({
                        ...Update_data,
                        model_number: e.target.value,
                      })
                    }
                    placeholder="Model Number"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!Update_data._id}
                  />

                  <select
                    value={Update_data.category}
                    onChange={(e) =>
                      setupdate_data({
                        ...Update_data,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-2xl border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                    disabled={!Update_data._id}
                  >
                    <option value="">Select Category</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Mobile">Mobile</option>
                    <option value="MotherBoard">MotherBoard</option>
                    <option value="Processer">Processer</option>
                  </select>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowUpdateModal(false)}
                      className="flex-1 rounded-2xl border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!Update_data._id}
                      className="flex-1 rounded-2xl bg-purple-700 px-4 py-2 font-medium text-white hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Save Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};