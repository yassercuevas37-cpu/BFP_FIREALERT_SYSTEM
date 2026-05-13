import React from 'react';
import { useReports } from '../context/ReportContext';
import { Link } from 'react-router-dom';
import { ShieldAlert, Activity, CheckCircle, AlertOctagon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const { reports } = useReports();

  const totalReports = reports.length;
  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const respondingCount = reports.filter(r => r.status === 'Responding').length;
  const criticalCount = reports.filter(r => r.severity === 'Critical').length;

  const recentReports = reports.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ShieldAlert className="text-red-500" size={28} />
          <h2 className="text-2xl font-bold">Command Center Overview</h2>
        </div>
        <p className="text-gray-400">System status: <span className="text-green-400 font-medium">Online & Monitoring</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 border-t-4 border-t-gray-500">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Incidents</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{totalReports}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 border-t-4 border-t-yellow-500">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Action</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-yellow-600">{pendingCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 border-t-4 border-t-blue-500">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Units Responding</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">{respondingCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 border-t-4 border-t-red-600">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Critical Alerts</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-red-600">{criticalCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-red-500" />
              Live Incident Feed
            </h3>
            <Link to="/admin/reports" className="text-sm font-medium text-red-600 hover:text-red-700">
              View All
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentReports.length === 0 ? (
              <p className="p-6 text-center text-gray-500">No recent incidents reported.</p>
            ) : (
              recentReports.map(report => (
                <div key={report.id} className="p-4 flex gap-4 hover:bg-gray-50">
                  <div className="flex-shrink-0 mt-1">
                    {report.status === 'Resolved' || report.status === 'False Alarm' ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <AlertOctagon className={report.severity === 'Critical' ? 'text-red-600 animate-pulse' : 'text-orange-500'} size={20} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{report.title}</p>
                    <p className="text-sm text-gray-500 truncate">{report.location}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                      <span>{formatDistanceToNow(new Date(report.date), { addSuffix: true })}</span>
                      <span>•</span>
                      <span>Reporter: {report.reportedBy}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${report.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'Responding' ? 'bg-blue-100 text-blue-800' :
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">System Actions</h3>
          </div>
          <div className="p-6 space-y-4">
            <Link 
              to="/admin/reports" 
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Manage Incidents
            </Link>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Generate PDF Report
            </button>
            <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              System Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
