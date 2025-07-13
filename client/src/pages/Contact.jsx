import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const Contact = () => {

    const { backendUrl} = useContext(ShopContext)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault() 
    
    try {
      axios.defaults.withCredentials = true
      const { data } = await axios.post(backendUrl + '/api/contact/add', {username, email, subject, message})
      if (data.success) {
        toast.success("Success")
        e.target.reset(); 
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <section className="py-12">
      <div className=" mx-auto px-4">
        <div className="flex flex-wrap">
          <div className="w-full">
            <div className="mb-8">
              <div id="map" className="w-full h-[450px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.325715981089!2d77.229513315051!3d28.61289998243393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2daa9eb4d0b%3A0x717971125923e5d!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1698765432100!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
          <div className="w-full mt-8">
            <div className="flex flex-wrap">
              <div className="w-full md:w-7/12">
                <form onSubmit={onSubmitHandler} className="space-y-4">
                  <div className="flex flex-wrap -mx-2">
                    <div className="w-full md:w-6/12 px-2 mb-4">
                      <div>
                      <label className="input input-bordered flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="h-4 w-4 opacity-70">
                          <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                        </svg>
                        <input onChange={(e) => setUsername(e.target.value)} type="text" className="grow" placeholder="Username" />
                      </label>
                      </div>
                    </div>
                    <div className="w-full md:w-6/12 px-2 mb-4">
                      <div>
                      <label className="input input-bordered flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="h-4 w-4 opacity-70">
                          <path
                            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                          <path
                            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input onChange={(e) => setEmail(e.target.value)} type="text" className="grow" placeholder="Email" />
                      </label>
                      </div>
                    </div>
                    <div className="w-full px-2 mb-4">
                      <div >
                      <label className="input input-bordered flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="h-4 w-4 opacity-70"
                        >
                          <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3h-13Z" />
                        </svg>
                        <input onChange={(e) => setSubject(e.target.value)}
                          type="text"
                          className="grow"
                          placeholder="Subject"
                          required
                        />
                      </label>
                      </div>
                    </div>
                    
                    <div className="w-full px-2 mb-4">
                      <div className="relative">
                        <textarea onChange={(e) => setMessage(e.target.value)}
                          className="textarea textarea-bordered w-full pl-8" // Add padding-left for the icon
                          placeholder="Message"
                          required
                        ></textarea>
                        {/* Icon positioned absolutely inside the textarea */}
                        <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70"
                          >
                            <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3h-13Z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    
                    <div className="w-full px-2 text-center">
                      <button
                        type="submit"
                        className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-black transition duration-300"
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="w-full md:w-5/12 mt-8 md:mt-0">
                <div className="flex items-center mb-8">
                  <div className="mr-4">
                    <span className="bi bi-envelope text-2xl"></span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Say Hello</h4>
                    <p className="mt-2">
                      Email: <span className="text-green-800">contact@example.com</span>
                    </p>
                    <p className="mt-1">
                      Phone: <span className="text-green-800">+54 356 945234</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center mb-8">
                  <div className="mr-4">
                    <span className=" bi bi-geo-alt text-2xl"></span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">Find us in</h4>
                    <p className="mt-2 text-green-800">Kartavya Path, India Gate, New Delhi, Delhi 110001</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4">
                    <span className="bi bi-share text-2xl"></span>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;