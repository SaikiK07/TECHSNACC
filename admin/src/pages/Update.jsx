import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Update = ({ token }) => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState('');
  const [brands, setBrands] = useState([]);
  const [bestseller, setBestseller] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([null, null, null, null]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(`${backendUrl}/api/product/single`, { productId: id });
        if (response.data.success) {
          const data = response.data.product;
          setProduct(data);
          setName(data.name);
          setDescription(data.description);
          setPrice(data.price);
          setCategory(data.category?._id || '');
          setBrand(data.brand);
          setBestseller(data.bestseller);
        }
      } catch (error) {
        toast.error('Failed to fetch product');
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/category/list`);
        if (res.data.success) setCategories(res.data.categories);
      } catch (error) {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/brand/list`);
        if (res.data.success) setBrands(res.data.brands);
      } catch (error) {
        toast.error('Failed to load brands');
      }
    };
    fetchBrands();
  }, []);

  const handleImageChange = (file, index) => {
    const updated = [...images];
    updated[index] = file;
    setImages(updated);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('brand', brand);
      formData.append('bestseller', bestseller);

      images.forEach((file, i) => {
        if (file) formData.append(`image${i + 1}`, file);
      });

      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data', token } }
      );

      if (response.data.success) {
        toast.success('Product Updated Successfully');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Update Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col w-full items-start gap-4 p-4">
      <p className="text-lg font-semibold">Upload Images</p>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <label key={i} htmlFor={`image${i}`}>
            <img
              src={images[i] ? URL.createObjectURL(images[i]) : product.image?.[i] || assets.upload_area}
              className="w-20 h-20 object-cover border rounded"
              alt={`product-${i}`}
            />
            <input
              type="file"
              id={`image${i}`}
              hidden
              onChange={(e) => handleImageChange(e.target.files[0], i)}
            />
          </label>
        ))}
      </div>

      <div className="w-full max-w-lg">
        <p>Product Name</p>
        <input className="w-full p-2 border rounded" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="w-full max-w-lg">
        <p>Description</p>
        <textarea className="w-full p-2 border rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      <div className="flex flex-wrap gap-4">
        <div>
          <p>Category</p>
          <select className="p-2 border rounded" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <p>Brand</p>
          <select className="p-2 border rounded" value={brand} onChange={(e) => setBrand(e.target.value)} required>
            <option value="">Select Brand</option>
            {brands.map((br) => (
              <option key={br.name} value={br.name}>{br.name}</option>
            ))}
          </select>
        </div>
        <div>
          <p>Price</p>
          <input className="p-2 border rounded w-[120px]" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
      </div>

      <button type="submit" disabled={loading} className={`mt-4 px-6 py-3 text-white rounded ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}>
        {loading ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
};

export default Update;
