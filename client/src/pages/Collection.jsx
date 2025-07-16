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

  // ✅ Fetch brands & categories from backend
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

  // ✅ Handlers for toggling filters
  const toggleBrand = (e) => {
    const value = e.target.value;
    setSelectedBrands((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleCategory = (e) => {
    const value = e.target.value;
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // ✅ Filtering logic
  const applyFilter = () => {
    let filtered = [...products];

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((item) =>
        selectedBrands.includes(item.brand?.name)
      );
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

    setFilterProducts(filtered);
  };

  // ✅ Sorting logic
  useEffect(() => {
    let sorted = [...filterProducts];
    if (sortType === 'low-high') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortType === 'high-low') {
      sorted.sort((a, b) => b.price - a.price);
    }
    setFilterProducts(sorted);
  }, [sortType]);

  // ✅ Apply filters when selections change
  useEffect(() => {
    applyFilter();
  }, [selectedBrands, selectedCategories, search, showSearch, products]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Sidebar */}
      <div className="min-w-60">
        <p onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>

        {/* Brand Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">BRANDS</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {brands.map((brand) => (
              <label key={brand._id} className={`flex items-center gap-2 cursor-pointer ${selectedBrands.includes(brand.name) ? 'text-green-700 font-medium' : ''}`}>
                <input
                  type="checkbox"
                  className="w-3 accent-green-700"
                  value={brand.name}
                  onChange={toggleBrand}
                  checked={selectedBrands.includes(brand.name)}
                />
                {brand.name}
              </label>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {categories.map((category) => (
              <label key={category._id} className={`flex items-center gap-2 cursor-pointer ${selectedCategories.includes(category.name) ? 'text-green-700 font-medium' : ''}`}>
                <input
                  type="checkbox"
                  className="w-3 accent-green-700"
                  value={category.name}
                  onChange={toggleCategory}
                  checked={selectedCategories.includes(category.name)}
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1="ALL" text2="COLLECTIONS" />
          <select
            className="border-2 border-gray-300 text-sm px-2"
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="relavent">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item) => (
            <ProductItem
              key={item._id}
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
              averageRating={item.averageRating}
              totalRatings={item.totalRatings}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
