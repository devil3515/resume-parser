
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Zap } from 'lucide-react';

interface JobDescriptionProps {
  onProcess: (jobDescription: string) => void;
  isLoading: boolean;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ onProcess, isLoading }) => {
  const [jobDescription, setJobDescription] = useState('');

  const handleProcess = () => {
    if (jobDescription.trim()) {
      onProcess(jobDescription);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Job Description</h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => {
              // This would be replaced with actual sample data in a real application
              setJobDescription(`Senior Frontend Developer

We are looking for a Senior Frontend Developer to join our team. The ideal candidate should have:

Requirements:
- 5+ years of experience with React
- Strong TypeScript skills
- Experience with responsive design
- Knowledge of modern frontend tooling
- Experience with state management libraries
- Ability to optimize for performance

Responsibilities:
- Develop new user-facing features
- Build reusable components and libraries
- Optimize applications for maximum speed and scalability
- Collaborate with backend developers and designers
`);
            }}
          >
            <FileText className="h-4 w-4" />
            <span>Sample</span>
          </Button>
        </div>
        
        <Textarea
          placeholder="Paste the job description here to analyze how well the resume matches the requirements..."
          className="min-h-[200px] mb-4"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        
        <Button 
          className="w-full bg-resume-primary hover:bg-resume-secondary"
          onClick={handleProcess}
          disabled={!jobDescription.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Analyzing Resume...
            </>
          ) : (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Analyze Resume Match
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobDescription;
