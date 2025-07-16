import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const Contact = () => {
  const { backendUrl } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/contact/add`, formData);

      if (data.success) {
        toast.success('Your message has been sent!');
        setFormData({ username: '', email: '', subject: '', message: '' });
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-10 px-4 sm:px-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Map */}
        <div className="w-full h-[450px] rounded-lg overflow-hidden shadow">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14010.760057305275!2d77.22260514713238!3d28.609074898809116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2db961be393%3A0xf6c7ef5ee6dd10ae!2sIndia%20Gate%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1752655484153!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        </div>


        {/* Form */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Us</h2>

          <form onSubmit={onSubmitHandler} className="space-y-4">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              required
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white text-sm font-semibold ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800 transition'
              }`}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-gray-800">
        <div>
          <div className="text-3xl mb-2">📧</div>
          <h4 className="font-bold text-lg">Email</h4>
          <p className="text-green-700 mt-1">contact@example.com</p>
        </div>
        <div>
          <div className="text-3xl mb-2">📞</div>
          <h4 className="font-bold text-lg">Phone</h4>
          <p className="text-green-700 mt-1">+91 9999999999</p>
        </div>
        <div>
          <div className="text-3xl mb-2">📍</div>
          <h4 className="font-bold text-lg">Address</h4>
          <p className="text-green-700 mt-1">India Gate, New Delhi</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
