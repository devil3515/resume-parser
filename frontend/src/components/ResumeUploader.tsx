
import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface ResumeUploaderProps {
  onUpload: (file: File) => void;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onUpload(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onUpload(selectedFile);
      }
    }
  };

  const validateFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive"
      });
      return false;
    }
    
    // 10MB max file size
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="p-6 w-full">
      <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? 'border-resume-secondary bg-blue-50' : 'border-gray-300'
        } ${file ? 'bg-blue-50' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
        />
        
        {!file ? (
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-12 h-12 text-resume-primary mb-2" />
            <p className="text-gray-700 mb-2">Drag & drop your resume here</p>
            <p className="text-gray-500 text-sm mb-4">Supports PDF, DOC, DOCX (Max 10MB)</p>
            <Button onClick={triggerFileInput} className="bg-resume-primary hover:bg-resume-secondary">
              Select File
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-8 h-8 text-resume-primary mr-3" />
              <div className="text-left">
                <p className="font-medium text-resume-text truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={removeFile}
              className="text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResumeUploader;





// import React, { useRef } from 'react';
// import { Upload, X, FileText } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
// import { useToast } from '@/components/ui/use-toast';

// interface ResumeUploaderProps {
//   onUpload: (file: File) => void;
// }

// const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUpload }) => {
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   const validateFile = (file: File) => {
//     const allowedTypes = [
//       'application/pdf',
//       'application/msword',
//       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//     ];
//     if (!allowedTypes.includes(file.type)) {
//       toast({
//         title: 'Invalid file type',
//         description: 'Please upload a PDF or Word document',
//         variant: 'destructive',
//       });
//       return false;
//     }
//     if (file.size > 10 * 1024 * 1024) {
//       toast({
//         title: 'File too large',
//         description: 'Please upload a file smaller than 10MB',
//         variant: 'destructive',
//       });
//       return false;
//     }
//     return true;
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file && validateFile(file)) {
//       onUpload(file);
//     }
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   return (
//     <Card className="p-6 w-full max-w-2xl mx-auto">
//       <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
//       <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
//         <input
//           ref={fileInputRef}
//           type="file"
//           className="hidden"
//           accept=".pdf,.doc,.docx"
//           onChange={handleFileChange}
//         />
//         <div className="flex flex-col items-center justify-center">
//           <Upload className="w-12 h-12 text-resume-primary mb-2" />
//           <p className="text-gray-700 mb-2">Drag & drop your resume here</p>
//           <p className="text-gray-500 text-sm mb-4">Supports PDF, DOC, DOCX (Max 10MB)</p>
//           <Button onClick={triggerFileInput} className="bg-resume-primary hover:bg-resume-secondary">
//             Select File
//           </Button>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default ResumeUploader;

