import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import { Link } from 'react-router-dom';
import { Flame, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { reports } = useReports();

  const userReports = reports.filter(r => r.reportedBy === user?.name);
  const pendingCount = userReports.filter(r => r.status === 'Pending').length;
  const resolvedCount = userReports.filter(r => r.status === 'Resolved').length;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Responding': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'False Alarm': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}</h2>
        <p className="text-gray-500 mt-1">Here is the overview of your submitted fire incident reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-red-100 text-red-600">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Reports</p>
            <p className="text-3xl font-bold text-gray-900">{userReports.length}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-yellow-100 text-yellow-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pending Action</p>
            <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center gap-4">
          <div className="p-4 rounded-full bg-green-100 text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Resolved Cases</p>
            <p className="text-3xl font-bold text-gray-900">{resolvedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Your Recent Reports</h3>
          <Link 
            to="/user/report" 
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-md transition-colors"
          >
            <AlertTriangle size={16} />
            Report New Incident
          </Link>
        </div>
        
        <div className="divide-y divide-gray-200">
          {userReports.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>You haven't submitted any reports yet.</p>
            </div>
          ) : (
            userReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{report.title}</h4>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                      <span className="font-medium">Location:</span> {report.location}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Reported {formatDistanceToNow(new Date(report.date), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      report.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                      report.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                      report.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Severity: {report.severity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
