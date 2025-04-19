import React, { useState } from 'react';
import Header from '@/components/Header';
import ResumeUploader from '@/components/ResumeUploader';
import ATSFields from '@/components/ATSFields';
import JobDescription from '@/components/JobDescription';
import MatchAnalysis from '@/components/MatchAnalysis';
import ResumeTemplates from '@/components/ResumeTemplates';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setParsedData(null);
    setMatchData(null);
  };

  const handleProcess = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a resume first",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setParsedData(null);

    const formData = new FormData();
    formData.append('pdf_doc', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/process', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setParsedData(data);

      toast({
        title: 'Resume processed',
        description: 'Successfully extracted resume information',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Failed to process resume',
        description: 'Please try again or check your backend.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleJobMatch = (jobDescription: string) => {
    if (!parsedData) {
      toast({
        title: "No resume data",
        description: "Please process a resume first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setMatchData(null);

    // Simulate API call
    setTimeout(() => {
      // Mock data
      const mockMatchData = {
        overallMatch: 78,
        skillsMatch: 85,
        experienceMatch: 70,
        educationMatch: 80,
        missingKeywords: [
          "React Native experience",
          "GraphQL knowledge",
          "CI/CD pipeline experience"
        ],
        recommendedImprovements: [
          "Add quantifiable achievements to your experience section",
          "Highlight any React Native projects you've worked on",
          "Mention any experience with GraphQL, even if it was a small project"
        ]
      };
      setMatchData(mockMatchData);
      setIsAnalyzing(false);
      toast({
        title: "Analysis complete",
        description: "Resume has been analyzed against the job description",
      });
    }, 2500);
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template selected",
      description: `You've selected the ${templateId.charAt(0).toUpperCase() + templateId.slice(1)} template`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 gap-6 mb-6">
          <ResumeUploader onUpload={handleUpload} />
          
          {file && (
            <div className="flex justify-end">
              <Button 
                className="bg-resume-primary hover:bg-resume-secondary"
                onClick={handleProcess}
                disabled={isProcessing || !file}
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Process Resume
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {parsedData || isProcessing ? (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <ATSFields parsedData={parsedData} isLoading={isProcessing} />
          </div>
        ) : null}

        {parsedData && (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <JobDescription onProcess={handleJobMatch} isLoading={isAnalyzing} />
          </div>
        )}

        {(matchData || isAnalyzing) && parsedData && (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <MatchAnalysis matchData={matchData} isLoading={isAnalyzing} />
          </div>
        )}

        {matchData && (
          <div className="grid grid-cols-1 gap-6">
            <ResumeTemplates
              onSelectTemplate={handleSelectTemplate}
              selectedTemplate={selectedTemplate}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;







// import React, { useState } from 'react';
// import Header from '@/components/Header';
// import ResumeUploader from '@/components/ResumeUploader';
// import ATSFields from '@/components/ATSFields';
// import JobDescription from '@/components/JobDescription';
// import MatchAnalysis from '@/components/MatchAnalysis';
// import ResumeTemplates from '@/components/ResumeTemplates';
// import { Button } from '@/components/ui/button';
// import { FileText } from 'lucide-react';
// import { useToast } from '@/components/ui/use-toast';

// const Index = () => {
//   const [file, setFile] = useState<File | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [parsedData, setParsedData] = useState<any>(null);
//   const [matchData, setMatchData] = useState<any>(null);
//   const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
//   const { toast } = useToast();

//   const handleUpload = async (uploadedFile: File) => {
//     setFile(uploadedFile);
//     setParsedData(null);
//     setMatchData(null);
//     setIsProcessing(true);

//     const formData = new FormData();
//     formData.append('pdf_doc', uploadedFile);

//     try {
//       const res = await fetch('http://127.0.0.1:8000/process', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await res.json();
//       setParsedData(data);

//       toast({
//         title: 'Resume processed',
//         description: 'Successfully extracted resume information',
//       });
//     } catch (error) {
//       console.error('Upload error:', error);
//       toast({
//         title: 'Failed to process resume',
//         description: 'Please try again or check your backend.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleJobMatch = (jobDescription: string) => {
//     if (!parsedData) {
//       toast({
//         title: 'No resume data',
//         description: 'Please process a resume first',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setIsAnalyzing(true);
//     setMatchData(null);

//     // TODO: Replace with real job-matching API call
//     setTimeout(() => {
//       setMatchData({
//         overallMatch: 78,
//         skillsMatch: 85,
//         experienceMatch: 70,
//         educationMatch: 80,
//         missingKeywords: [
//           'React Native experience',
//           'GraphQL knowledge',
//           'CI/CD pipeline experience',
//         ],
//         recommendedImprovements: [
//           'Add quantifiable achievements to your experience section',
//           'Highlight any React Native projects you\'ve worked on',
//           'Mention any experience with GraphQL, even if it was a small project',
//         ],
//       });
//       setIsAnalyzing(false);
//       toast({
//         title: 'Analysis complete',
//         description: 'Resume has been analyzed against the job description',
//       });
//     }, 2500);
//   };

//   const handleSelectTemplate = (templateId: string) => {
//     setSelectedTemplate(templateId);
//     toast({
//       title: 'Template selected',
//       description: `You've selected the ${templateId.charAt(0).toUpperCase() + templateId.slice(1)} template`,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />

//       <main className="container mx-auto py-6 px-4">
//         <div className="grid grid-cols-1 gap-6 mb-6">
//           <ResumeUploader onUpload={handleUpload} />
//         </div>

//         {parsedData || isProcessing ? (
//           <div className="grid grid-cols-1 gap-6 mb-6">
//             <ATSFields parsedData={parsedData} isLoading={isProcessing} />
//           </div>
//         ) : null}

//         {parsedData && (
//           <div className="grid grid-cols-1 gap-6 mb-6">
//             <JobDescription onProcess={handleJobMatch} isLoading={isAnalyzing} />
//           </div>
//         )}

//         {(matchData || isAnalyzing) && parsedData && (
//           <div className="grid grid-cols-1 gap-6 mb-6">
//             <MatchAnalysis matchData={matchData} isLoading={isAnalyzing} />
//           </div>
//         )}

//         {matchData && (
//           <div className="grid grid-cols-1 gap-6">
//             <ResumeTemplates
//               onSelectTemplate={handleSelectTemplate}
//               selectedTemplate={selectedTemplate}
//             />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default Index;

