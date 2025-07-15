import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const BackupPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [folderPath, setFolderPath] = useState('');

  const handleBackup = async () => {
    setLoading(true);
    setMessage('');
    setFolderPath('');
    try {
      const res = await axios.get(`${backendUrl}/api/backup/database`, {
        withCredentials: true
      });

      setMessage(res.data.message || 'Backup completed.');
      setFolderPath(res.data.folder || '');
    } catch (err) {
      console.error(err);
      setMessage('❌ Backup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20 bg-white shadow-xl rounded-xl text-center border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Backup Database</h2>

      <button
        onClick={handleBackup}
        className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={loading}
      >
        {loading ? 'Backing up...' : 'Backup Now'}
      </button>

      {message && (
        <div className="mt-6">
          <p className={`font-medium ${message.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
          {folderPath && (
            <p className="text-sm text-gray-600 mt-1 break-all">
              Stored at: <code>{folderPath}</code>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default BackupPage;
