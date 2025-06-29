
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Zap } from 'lucide-react';

interface JobDescriptionProps {
  onProcess: (jobDescription: string) => void;
  isLoading: boolean;
  parsedData: any;
}

const JobDescription: React.FC<JobDescriptionProps> = ({ onProcess, isLoading, parsedData }) => {
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
            onClick={async () => {
              if (!parsedData) return;

              try {
                const res = await fetch('http://127.0.0.1:8000/generate-sample-jd', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ resume: parsedData })
                });

                const data = await res.json();
                if (data.job_description) {
                  setJobDescription(data.job_description);
                } else {
                  alert("Failed to generate job description");
                }
              } catch (err) {
                console.error("JD generation error:", err);
                alert("Error generating sample job description.");
              }
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
