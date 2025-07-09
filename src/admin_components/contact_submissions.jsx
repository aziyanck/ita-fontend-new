import React, { useState, useEffect } from 'react';
// Make sure the import path to your services file is correct
import { getContactSubmissions } from '../supabaseServices'; 

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await getContactSubmissions();
        setSubmissions(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  if (loading) return <div className="p-4 text-center">Loading submissions...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-4">Contact Form Submissions</h1>
      <p className="mb-6 text-gray-600">Here are all the messages received from your website's contact form.</p>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {submissions.length > 0 ? (
              submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-500 whitespace-nowrap">{new Date(submission.created_at).toLocaleString()}</td>
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">{submission.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    <div>{submission.email}</div>
                    <div>{submission.phone}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 max-w-md whitespace-pre-wrap">{submission.message}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10 text-gray-500">No submissions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactSubmissions;
