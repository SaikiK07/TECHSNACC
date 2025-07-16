import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import axios from 'axios';

const Collection = () => {
  const { products, search, showSearch, backendUrl } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortType, setSortType] = useState('relavent');
  const [loading, setLoading] = useState(true);

  // Fetch brands & categories
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [brandRes, categoryRes] = await Promise.all([
          axios.get(`${backendUrl}/api/brand/list`),
          axios.get(`${backendUrl}/api/category/list`)
        ]);

        if (brandRes.data.success) setBrands(brandRes.data.brands);
        if (categoryRes.data.success) setCategories(categoryRes.data.categories);
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, [backendUrl]);

  const toggleBrand = (value) => {
    setSelectedBrands((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleCategory = (value) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const sortProducts = (productsToSort) => {
    let sorted = [...productsToSort];

    switch (sortType) {
      case 'low-high':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'relavent':
      default:
        break; // no sorting needed
    }

    return sorted;
  };

  const applyFilter = () => {
    let filtered = [...products];

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((item) => selectedBrands.includes(item.brand));
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((item) =>
        selectedCategories.includes(item.category?.name)
      );
    }

    if (showSearch && search) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const finalFiltered = sortProducts(filtered);
    setFilterProducts(finalFiltered);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    applyFilter();
  }, [selectedBrands, selectedCategories, search, showSearch, sortType, products]);

  useEffect(() => {
    if (products.length > 0) {
      setFilterProducts(products);
      setLoading(false);
    }
  }, [products]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* FILTER PANEL */}
      <div className="sm:min-w-[250px]">
        <div
          onClick={() => setShowFilter(!showFilter)}
          className="flex justify-between items-center cursor-pointer text-xl font-semibold mb-2"
        >
          <span>FILTERS</span>
          <img
            src={assets.dropdown_icon}
            alt="toggle"
            className={`h-3 sm:h-4 transition-transform ${showFilter ? 'rotate-90' : ''}`}
          />
        </div>

        {showFilter && (
          <div className="space-y-6">
            <div className="border rounded-lg p-4 shadow-sm bg-white">
              <h3 className="text-sm font-medium mb-2 text-gray-800">BRANDS</h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
                {brands.map((brand) => (
                  <label
                    key={brand._id}
                    className={`cursor-pointer px-3 py-1 text-sm rounded-full border transition-all ${
                      selectedBrands.includes(brand.name)
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      value={brand.name}
                      checked={selectedBrands.includes(brand.name)}
                      onChange={(e) => toggleBrand(e.target.value)}
                    />
                    {brand.name}
                  </label>
                ))}
              </div>
            </div>

            <div className="border rounded-lg p-4 shadow-sm bg-white">
              <h3 className="text-sm font-medium mb-2 text-gray-800">CATEGORIES</h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-auto pr-1">
                {categories.map((category) => (
                  <label
                    key={category._id}
                    className={`cursor-pointer px-3 py-1 text-sm rounded-full border transition-all ${
                      selectedCategories.includes(category.name)
                        ? 'bg-black text-white border-black'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      value={category.name}
                      checked={selectedCategories.includes(category.name)}
                      onChange={(e) => toggleCategory(e.target.value)}
                    />
                    {category.name}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT LISTING */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            className="border-2 border-gray-300 text-sm px-2"
            onChange={(e) => {
              setSortType(e.target.value);
              setLoading(true);
            }}
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="w-full py-20 text-center text-gray-600 text-sm animate-pulse">
            Loading products...
          </div>
        ) : filterProducts.length === 0 ? (
          <div className="w-full py-20 text-center text-gray-600 text-sm">
            😕 No products found matching the filters or search.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={index}
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
                averageRating={item.averageRating}
                totalRatings={item.totalRatings}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
