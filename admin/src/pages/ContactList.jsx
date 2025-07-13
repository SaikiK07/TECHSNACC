import React, { useEffect, useState } from 'react';
import { backendUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrashAlt } from 'react-icons/fa';

const ContactList = ({ token }) => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/contact/list');
      if (response.data.success) {
        setContacts(response.data.contacts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteContact = async (id) => {
    try {
      const response = await axios.post(backendUrl + '/api/contact/delete', { id }, { headers: { token } });
      if (response.data.success) {
        toast.success('Message deleted successfully');
        setContacts(contacts.filter(contact => contact._id !== id));
        setSelectedContact(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className='p-8 bg-gradient-to-r bg-gray-100 min-h-screen flex flex-col items-center'>
      <h2 className='text-3xl font-bold text-gray-700 mb-8'>Contact Messages</h2>
      <div className='w-full max-w-5xl flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden'>
        {/* Contact List */}
        <div className='w-full md:w-1/3 border-r bg-gray-50 p-4'>
          <h3 className='text-lg font-semibold mb-4 text-gray-600'>User Messages</h3>
          {contacts.length > 0 ? (
            <ul className='space-y-2'>
              {contacts.map((contact) => (
                <li
                  key={contact._id}
                  className={`p-3 rounded-lg cursor-pointer transition duration-300 ${selectedContact?._id === contact._id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-100'}`}
                  onClick={() => setSelectedContact(contact)}
                >
                  {contact.username}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>No contact messages available.</p>
          )}
        </div>

        {/* Contact Details */}
        <div className='w-full md:w-2/3 p-6'>
          {selectedContact ? (
            <div className='space-y-4'>
              <h3 className='text-xl font-semibold text-gray-700'>Message Details</h3>
              <div className='bg-gray-100 p-4 rounded-lg shadow'>
                <p className='text-gray-700'><b>Username:</b> {selectedContact.username}</p>
                <p className='text-gray-700'><b>Email:</b> {selectedContact.email}</p>
                <p className='text-gray-700'><b>Subject:</b> {selectedContact.subject}</p>
                <p className='text-gray-700'><b>Message:</b> {selectedContact.message}</p>
              </div>
              <button 
                onClick={() => deleteContact(selectedContact._id)}
                className='flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-red-400 transition duration-300'
              >
                <FaTrashAlt /> Delete Message
              </button>
            </div>
          ) : (
            <p className='text-gray-500'>Select a contact to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactList;
