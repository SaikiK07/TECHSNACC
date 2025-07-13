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
    try {
      const res = await axios.get(backendUrl +'/api/backup/database', {
        withCredentials: true
      });

      setMessage(res.data.message);
      setFolderPath(res.data.folder);
    } catch (err) {
      console.error(err);
      setMessage('Backup failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20 bg-white shadow-lg rounded-xl text-center">
      <h2 className="text-2xl font-semibold mb-4">Backup Database</h2>
      <button
        onClick={handleBackup}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        disabled={loading}
      >
        {loading ? 'Backing up...' : 'Backup Now'}
      </button>

      {message && (
        <div className="mt-4">
          <p className="text-green-600 font-medium">{message}</p>
          {folderPath && (
            <p className="text-sm text-gray-600">Stored at: <code>{folderPath}</code></p>
          )}
        </div>
      )}
    </div>
  );
};

export default BackupPage;
