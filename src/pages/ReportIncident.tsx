import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports, Report } from '../context/ReportContext';
import { AlertTriangle, MapPin, AlignLeft, Send } from 'lucide-react';

const ReportIncident: React.FC = () => {
  const { user } = useAuth();
  const { addReport } = useReports();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    severity: 'Medium' as Report['severity'],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addReport({
      ...formData,
      reportedBy: user.name,
    });

    // Simulate flash message
    alert('Incident reported successfully!');
    navigate('/user');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
        <div className="bg-red-600 px-6 py-4 flex items-center gap-3">
          <AlertTriangle className="text-white" size={24} />
          <h2 className="text-xl font-bold text-white">Report Fire Incident</h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md">
            <p className="text-red-800 font-medium text-sm">
              WARNING: False reporting is punishable by law. Please ensure all details provided are accurate to help responders react effectively.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Incident Title
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="e.g., House Fire, Grass Fire"
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Exact Location
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="location"
                  id="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Street address, landmarks, etc."
                />
              </div>
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                Estimated Severity
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                <option value="Low">Low (Small fire, easily contained)</option>
                <option value="Medium">Medium (Growing fire, property at risk)</option>
                <option value="High">High (Large fire, structures involved)</option>
                <option value="Critical">Critical (Life-threatening, fast-spreading)</option>
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Incident Description
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <AlignLeft className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Describe what is burning, color of smoke, people trapped, etc."
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/user')}
                className="mr-4 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Send size={16} className="mr-2" />
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
