
import React from 'react';
import { FileText, BarChart } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-resume-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="mr-2 h-6 w-6" />
          <h1 className="text-xl font-bold">Resume Parser & ATS Analyzer</h1>
        </div>
        <div className="flex items-center text-sm">
          <BarChart className="mr-1 h-4 w-4" />
          <span>ATS Optimization Tool</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
