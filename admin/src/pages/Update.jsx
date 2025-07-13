import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Update = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState('');
  const [brands, setBrands] = useState([]); // Add state for brands
  const [bestseller, setBestseller] = useState(false);

  // Fetch product data for updating
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
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/list`);
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/brand/list`); // Fetch brands from backend
        if (response.data.success) {
          setBrands(response.data.brands);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchBrands();
  }, []);

  // Handle update submission
  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('bestseller', bestseller);

    // Append images only if they are updated
    if (image1) formData.append('image1', image1);
    if (image2) formData.append('image2', image2);
    if (image3) formData.append('image3', image3);
    if (image4) formData.append('image4', image4);

    try {
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
        console.log(error);
        toast.error('Update Failed');
    }
};

  return (
    <form onSubmit={handleUpdate} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[setImage1, setImage2, setImage3, setImage4].map((setImage, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img
                className="w-20"
                src={
                  eval(`image${index + 1}`)
                    ? URL.createObjectURL(eval(`image${index + 1}`))
                    : product.image?.[index] || assets.upload_area
                }
                alt={`Product Image ${index + 1}`}
              />
              <input
                type="file"
                id={`image${index + 1}`}
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          ))}
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input className="w-full max-w-[500px] px-3 py-2" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea className="w-full max-w-[500px] px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select className="w-full px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Product Brand</p>
          <select className='w-full px-3 py-2' value={brand} onChange={(e) => setBrand(e.target.value)} required>
            <option value="">Select Brand</option>
            {brands.map((brandItem) => (
              <option key={brandItem.name} value={brandItem.name}>{brandItem.name}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input className="w-full px-3 py-2 sm:w-[120px]" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
      </div>

      

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">Update</button>
    </form>
  );
};

export default Update;
