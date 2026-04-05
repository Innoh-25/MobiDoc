import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const PendingApproval = () => {
  const [status, setStatus] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctors/onboarding-status');
      const data = res.data.data;
      setStatus(data.verificationStatus);
      setDocuments(data.documents || []);
      // If approved while viewing, redirect to dashboard
      if (data.verificationStatus === 'approved') {
        toast.success('Your account has been approved');
        navigate('/doctor/dashboard');
      }
    } catch (err) {
      console.error('Failed to fetch onboarding status', err);
      toast.error('Failed to fetch status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 30 * 1000); // poll every 30s
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto text-center">
      <div className="card p-8">
        <h1 className="text-2xl font-semibold mb-2">Account Pending Approval</h1>
        <p className="text-gray-600 mb-4">Your account is under review by our administrators. You'll be notified when your account is approved.</p>

        {loading ? (
          <p>Loading status...</p>
        ) : (
          <div className="space-y-4">
            <p className="font-medium">Current status: <span className="capitalize">{status || 'unknown'}</span></p>

            {documents.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Submitted documents</h3>
                <ul className="space-y-2">
                  {documents.map((doc, i) => (
                    <li key={i} className="p-2 bg-gray-50 rounded flex items-center justify-between">
                      <div className="text-sm font-medium">{doc.fileName || doc.fieldname || 'Document'}</div>
                      <div className="flex items-center space-x-3">
                        <div className="text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleString()}</div>
                        {doc.filePath ? (
                          <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">View</a>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex items-center justify-center space-x-3">
              <button onClick={fetchStatus} className="btn-outline">Refresh</button>
              <button onClick={() => navigate('/doctor/onboarding')} className="btn-primary">Edit Submission</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApproval;
