import React, { useState } from 'react';
import { useReports, Report } from '../context/ReportContext';
import { Trash2, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const AdminReports: React.FC = () => {
  const { reports, updateReportStatus, deleteReport } = useReports();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          report.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id: string, newStatus: Report['status']) => {
    updateReportStatus(id, newStatus);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this incident report? This action cannot be undone.')) {
      deleteReport(id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Incident Reports Management</h2>
        
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500 w-full sm:w-64"
            />
          </div>
          
          <div className="relative flex items-center">
            <Filter className="absolute left-3 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Responding">Responding</option>
              <option value="Resolved">Resolved</option>
              <option value="False Alarm">False Alarm</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Incident Details
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location & Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No reports found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{report.title}</div>
                    <div className="text-sm text-gray-500 mt-1 max-w-xs truncate" title={report.description}>
                      {report.description}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Reported by: {report.reportedBy}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{report.location}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {format(new Date(report.date), 'MMM d, yyyy HH:mm')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${report.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        report.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }
                    `}>
                      {report.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={report.status}
                      onChange={(e) => handleStatusChange(report.id, e.target.value as Report['status'])}
                      className={`text-sm rounded-md border-gray-300 py-1 pl-2 pr-6 focus:outline-none focus:ring-red-500 focus:border-red-500
                        ${report.status === 'Pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                          report.status === 'Responding' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          report.status === 'Resolved' ? 'bg-green-50 text-green-800 border-green-200' :
                          'bg-gray-50 text-gray-800 border-gray-200'
                        }
                      `}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Responding">Responding</option>
                      <option value="Resolved">Resolved</option>
                      <option value="False Alarm">False Alarm</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(report.id)}
                      className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-2 rounded-md transition-colors inline-flex items-center"
                      title="Delete Report"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReports;
