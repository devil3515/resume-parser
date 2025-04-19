
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchData {
  overallMatch: number;
  skillsMatch: number;
  experienceMatch: number;
  educationMatch: number;
  missingKeywords: string[];
  recommendedImprovements: string[];
}

interface MatchAnalysisProps {
  matchData: MatchData | null;
  isLoading: boolean;
}

const MatchAnalysis: React.FC<MatchAnalysisProps> = ({ matchData, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Job Match Analysis</h2>
          <div className="text-center py-8 animate-pulse-opacity">
            <Sparkles className="h-12 w-12 text-resume-secondary mx-auto mb-2" />
            <p className="text-gray-500">Analyzing your resume against the job description...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!matchData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Job Match Analysis</h2>
          <p className="text-gray-500 text-center py-8">
            Add a job description and click "Analyze Resume Match" to see how well your resume aligns with the job requirements
          </p>
        </CardContent>
      </Card>
    );
  }

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getMatchBg = (percentage: number) => {
    if (percentage >= 80) return "bg-green-600";
    if (percentage >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Job Match Analysis</h2>
        
        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-md font-medium">Overall Match</h3>
            <span className={cn("text-2xl font-bold", getMatchColor(matchData.overallMatch))}>
              {matchData.overallMatch}%
            </span>
          </div>
          <Progress 
            value={matchData.overallMatch} 
            className={cn("h-3", getMatchBg(matchData.overallMatch))}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Skills Match</h4>
            <div className="flex justify-between items-center">
              <Progress 
                value={matchData.skillsMatch} 
                className={cn("h-2 flex-grow mr-3", getMatchBg(matchData.skillsMatch))}
              />
              <span className={cn("font-semibold", getMatchColor(matchData.skillsMatch))}>
                {matchData.skillsMatch}%
              </span>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Experience Match</h4>
            <div className="flex justify-between items-center">
              <Progress 
                value={matchData.experienceMatch} 
                className={cn("h-2 flex-grow mr-3", getMatchBg(matchData.experienceMatch))}
              />
              <span className={cn("font-semibold", getMatchColor(matchData.experienceMatch))}>
                {matchData.experienceMatch}%
              </span>
            </div>
          </div>
          
          <div className="border rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Education Match</h4>
            <div className="flex justify-between items-center">
              <Progress 
                value={matchData.educationMatch} 
                className={cn("h-2 flex-grow mr-3", getMatchBg(matchData.educationMatch))}
              />
              <span className={cn("font-semibold", getMatchColor(matchData.educationMatch))}>
                {matchData.educationMatch}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-3">
              <AlertTriangle className="text-yellow-500 mr-2 h-5 w-5" />
              <h3 className="text-md font-medium">Missing Keywords</h3>
            </div>
            {matchData.missingKeywords.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {matchData.missingKeywords.map((keyword, index) => (
                  <li key={index} className="text-sm">{keyword}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No missing keywords found</p>
            )}
          </div>
          
          <div>
            <div className="flex items-center mb-3">
              <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
              <h3 className="text-md font-medium">Recommended Improvements</h3>
            </div>
            {matchData.recommendedImprovements.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {matchData.recommendedImprovements.map((improvement, index) => (
                  <li key={index} className="text-sm">{improvement}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No improvements needed</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MatchAnalysis;
