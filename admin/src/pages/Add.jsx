import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [brand, setBrand] = useState('');
  const [brands, setBrands] = useState([]);

  // Fetch categories and brands from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([
          axios.get(`${backendUrl}/api/category/list`),
          axios.get(`${backendUrl}/api/brand/list`)
        ]);

        if (categoryRes.data.success) setCategories(categoryRes.data.categories);
        if (brandRes.data.success) setBrands(brandRes.data.brands);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("brand", brand);

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData, { headers: { token } });

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setPrice('');
        setCategory('');
        setBrand('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-3">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[setImage1, setImage2, setImage3, setImage4].map((setImage, index) => (
            <label key={index} htmlFor={`image${index + 1}`}>
              <img className="w-20" src={!eval(`image${index + 1}`) ? assets.upload_area : URL.createObjectURL(eval(`image${index + 1}`))} alt="" />
              <input onChange={(e) => setImage(e.target.files[0])} type="file" id={`image${index + 1}`} hidden />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Type here" required />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder="Write content here" required />
      </div>

      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
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
            {brands.map((br) => (
              <option key={br.name} value={br.name}>{br.name}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input onChange={(e) => setPrice(e.target.value)} value={price} className="w-full px-3 py-2 sm:w-[120px]" type="number" placeholder="25" required />
        </div>
      </div>

      

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">ADD</button>
    </form>
  );
};

export default Add;
