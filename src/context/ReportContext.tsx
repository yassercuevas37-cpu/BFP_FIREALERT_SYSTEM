import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Report {
  id: string;
  title: string;
  location: string;
  description: string;
  date: string;
  status: 'Pending' | 'Responding' | 'Resolved' | 'False Alarm';
  reportedBy: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'date' | 'status'>) => void;
  updateReportStatus: (id: string, status: Report['status']) => void;
  deleteReport: (id: string) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

const initialReports: Report[] = [
  {
    id: '1',
    title: 'Structural Fire in Downtown',
    location: '123 Main St, City Center',
    description: 'Smoke coming from the 3rd floor of a commercial building.',
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'Resolved',
    reportedBy: 'John Doe',
    severity: 'High'
  },
  {
    id: '2',
    title: 'Grass Fire near Highway',
    location: 'Northbound Route 99, Mile 45',
    description: 'Dry grass caught fire, spreading quickly due to wind.',
    date: new Date().toISOString(),
    status: 'Responding',
    reportedBy: 'Jane Smith',
    severity: 'Medium'
  }
];

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('firealert_reports');
    return saved ? JSON.parse(saved) : initialReports;
  });

  useEffect(() => {
    localStorage.setItem('firealert_reports', JSON.stringify(reports));
  }, [reports]);

  const addReport = (reportData: Omit<Report, 'id' | 'date' | 'status'>) => {
    const newReport: Report = {
      ...reportData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'Pending',
    };
    setReports([newReport, ...reports]);
  };

  const updateReportStatus = (id: string, status: Report['status']) => {
    setReports(reports.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter(r => r.id !== id));
  };

  return (
    <ReportContext.Provider value={{ reports, addReport, updateReportStatus, deleteReport }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};
