// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Skeleton } from '@/components/ui/skeleton';

// interface ParsedResumeData {
//   name?: string;
//   email?: string;
//   phone?: string;
//   address?: string;
//   education?: string[];
//   experience?: Array<{
//     title?: string;
//     company?: string;
//     duration?: string;
//     description?: string;
//   }>;
//   skills?: string[];
//   summary?: string;
//   projects?: Array<{
//     name: string;
//     description?: string;
//     technologies?: string[];
//   }>;
// }

// interface ATSFieldsProps {
//   parsedData: ParsedResumeData | null;
//   isLoading: boolean;
// }

// const ATSFields: React.FC<ATSFieldsProps> = ({ parsedData, isLoading }) => {
//   if (isLoading) {
//     return (
//       <Card className="w-full">
//         <CardContent className="p-6">
//           <h2 className="text-lg font-semibold mb-4">Parsed Resume Data</h2>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-[100px]" />
//               <Skeleton className="h-8 w-full" />
//             </div>
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-[100px]" />
//               <Skeleton className="h-8 w-full" />
//             </div>
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-[100px]" />
//               <Skeleton className="h-8 w-full" />
//             </div>
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-[120px]" />
//               <Skeleton className="h-20 w-full" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!parsedData) {
//     return (
//       <Card className="w-full">
//         <CardContent className="p-6">
//           <h2 className="text-lg font-semibold mb-4">Parsed Resume Data</h2>
//           <p className="text-gray-500 text-center py-8">
//             Upload and process a resume to see extracted information here
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="w-full">
//       <CardContent className="p-6">
//         <h2 className="text-lg font-semibold mb-4">Parsed Resume Data</h2>
        
//         <div className="space-y-4">
//           {/* Personal Information */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Name</p>
//                 <p className="font-medium">{parsedData.name || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-medium">{parsedData.email || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Phone</p>
//                 <p className="font-medium">{parsedData.phone || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Address</p>
//                 <p className="font-medium">{parsedData.address || 'N/A'}</p>
//               </div>
//             </div>
//           </div>
          
//           <Separator />
          
//           {/* Summary */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Summary</h3>
//             <p className="text-sm">{parsedData.summary || 'No summary found in resume'}</p>
//           </div>
          
//           <Separator />
          
//           {/* Skills */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
//             {parsedData.skills && parsedData.skills.length > 0 ? (
//               <div className="flex flex-wrap gap-2">
//                 {parsedData.skills.map((skill, index) => (
//                   <span 
//                     key={index} 
//                     className="bg-resume-background text-resume-text px-2 py-1 rounded-md text-sm"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">No skills found in resume</p>
//             )}
//           </div>
          
//           <Separator />
          
//           {/* Projects */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Projects</h3>
//             {parsedData.projects && parsedData.projects.length > 0 ? (
//               <div className="space-y-3">
//                 {parsedData.projects.map((project, index) => (
//                   <div key={index} className="border rounded-md p-3">
//                     <p className="font-medium">{project.name}</p>
//                     {project.description && (
//                       <p className="text-sm mt-1">{project.description}</p>
//                     )}
//                     {project.technologies && project.technologies.length > 0 && (
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {project.technologies.map((tech, techIndex) => (
//                           <span 
//                             key={techIndex}
//                             className="bg-resume-background text-resume-text px-2 py-1 rounded-md text-xs"
//                           >
//                             {tech}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">No projects found in resume</p>
//             )}
//           </div>
          
//           <Separator />
          
//           {/* Experience */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Experience</h3>
//             {parsedData.experience && parsedData.experience.length > 0 ? (
//               <div className="space-y-3">
//                 {parsedData.experience.map((exp, index) => (
//                   <div key={index} className="border rounded-md p-3">
//                     <div className="flex justify-between items-start">
//                       <p className="font-medium">{exp.title || 'Unknown Position'}</p>
//                       <p className="text-sm text-gray-500">{exp.duration || 'Unknown Duration'}</p>
//                     </div>
//                     <p className="text-sm text-resume-secondary">{exp.company || 'Unknown Company'}</p>
//                     <p className="text-sm mt-2">{exp.description || 'No description available'}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">No experience found in resume</p>
//             )}
//           </div>
          
//           <Separator />
          
//           {/* Education */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Education</h3>
//             {parsedData.education && parsedData.education.length > 0 ? (
//               <ul className="list-disc pl-5 space-y-1">
//                 {parsedData.education.map((edu, index) => (
//                   <li key={index} className="text-sm">{edu}</li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-500">No education found in resume</p>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ATSFields;



// import React from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { Skeleton } from '@/components/ui/skeleton';

// interface EducationItem {
//   degree?: string;
//   university?: string;
//   graduation_year?: string;
//   field_of_study?: string;
// }

// interface ExperienceItem {
//   title?: string;
//   company?: string;
//   duration?: string;
//   description?: string;
// }

// interface ProjectItem {
//   name: string;
//   description?: string;
//   technologies?: string[];
// }

// interface ParsedResumeData {
//   name?: string;
//   email?: string;
//   phone?: string;
//   address?: string;
//   education?: EducationItem[]; // Changed from string[] to EducationItem[]
//   experience?: ExperienceItem[];
//   skills?: string[];
//   summary?: string;
//   projects?: ProjectItem[];
// }

// interface ATSFieldsProps {
//   parsedData: ParsedResumeData | null;
//   isLoading: boolean;
// }

// const ATSFields: React.FC<ATSFieldsProps> = ({ parsedData, isLoading }) => {
//   if (isLoading) {
//     return (
//       <Card className="w-full">
//         <CardContent className="p-6">
//           <h2 className="text-lg font-semibold mb-4">Parsed Resume Data</h2>
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-[100px]" />
//               <Skeleton className="h-8 w-full" />
//             </div>
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-[100px]" />
//               <Skeleton className="h-8 w-full" />
//             </div>
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-[100px]" />
//               <Skeleton className="h-8 w-full" />
//             </div>
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-[120px]" />
//               <Skeleton className="h-20 w-full" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!parsedData) {
//     return (
//       <Card className="w-full">
//         <CardContent className="p-6">
//           <h2 className="text-lg font-semibold mb-4">Parsed Resume Data</h2>
//           <p className="text-gray-500 text-center py-8">
//             Upload and process a resume to see extracted information here
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card className="w-full">
//       <CardContent className="p-6">
//         <h2 className="text-lg font-semibold mb-4">Parsed Resume Data</h2>
        
//         <div className="space-y-4">
//           {/* Personal Information */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-gray-500">Name</p>
//                 <p className="font-medium">{parsedData.name || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="font-medium">{parsedData.email || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Phone</p>
//                 <p className="font-medium">{parsedData.phone || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-gray-500">Address</p>
//                 <p className="font-medium">{parsedData.address || 'N/A'}</p>
//               </div>
//             </div>
//           </div>
          
//           <Separator />
          
//           {/* Summary */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Summary</h3>
//             <p className="text-sm">{parsedData.summary || 'No summary found in resume'}</p>
//           </div>
          
//           <Separator />
          
//           {/* Skills */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
//             {parsedData.skills && parsedData.skills.length > 0 ? (
//               <div className="flex flex-wrap gap-2">
//                 {parsedData.skills.map((skill, index) => (
//                   <span 
//                     key={index} 
//                     className="bg-resume-background text-resume-text px-2 py-1 rounded-md text-sm"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">No skills found in resume</p>
//             )}
//           </div>
          
//           <Separator />
          
//           {/* Projects */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Projects</h3>
//             {parsedData.projects && parsedData.projects.length > 0 ? (
//               <div className="space-y-3">
//                 {parsedData.projects.map((project, index) => (
//                   <div key={index} className="border rounded-md p-3">
//                     <p className="font-medium">{project.name}</p>
//                     {project.description && (
//                       <p className="text-sm mt-1">{project.description}</p>
//                     )}
//                     {project.technologies && project.technologies.length > 0 && (
//                       <div className="flex flex-wrap gap-2 mt-2">
//                         {project.technologies.map((tech, techIndex) => (
//                           <span 
//                             key={techIndex}
//                             className="bg-resume-background text-resume-text px-2 py-1 rounded-md text-xs"
//                           >
//                             {tech}
//                           </span>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">No projects found in resume</p>
//             )}
//           </div>
          
//           <Separator />
          
//           {/* Experience */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Experience</h3>
//             {parsedData.experience && parsedData.experience.length > 0 ? (
//               <div className="space-y-3">
//                 {parsedData.experience.map((exp, index) => (
//                   <div key={index} className="border rounded-md p-3">
//                     <div className="flex justify-between items-start">
//                       <p className="font-medium">{exp.title || 'Unknown Position'}</p>
//                       <p className="text-sm text-gray-500">{exp.duration || 'Unknown Duration'}</p>
//                     </div>
//                     <p className="text-sm text-resume-secondary">{exp.company || 'Unknown Company'}</p>
//                     <p className="text-sm mt-2">{exp.description || 'No description available'}</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">No experience found in resume</p>
//             )}
//           </div>
          
//           <Separator />
          
//           {/* Education - Updated Section */}
//           <div>
//             <h3 className="text-sm font-medium text-gray-500 mb-2">Education</h3>
//             {parsedData.education && parsedData.education.length > 0 ? (
//               <div className="space-y-3">
//                 {parsedData.education.map((edu, index) => (
//                   <div key={index} className="border rounded-md p-3">
//                     <div className="flex justify-between items-start">
//                       <p className="font-medium">
//                         {edu.degree || 'Degree not specified'}
//                         {edu.field_of_study && ` in ${edu.field_of_study}`}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {edu.graduation_year || 'Year not specified'}
//                       </p>
//                     </div>
//                     <p className="text-sm text-resume-secondary">
//                       {edu.university || 'Institution not specified'}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">No education found in resume</p>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ATSFields;





import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface ExperienceItem {
  title?: string;
  company?: string;
  start_date?: string;
  end_date?: string;
  experience_detail?: string;
}

interface EducationItem {
  degree?: string;
  university?: string;
  graduation_year?: string;
}

interface ProjectItem {
  project_title?: string;
  project_detail?: string;
  project_technologies?: string[];
}

interface ParsedResumeData {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  address?: string;
  portfolio?: string;
  summary?: string;
  skills?: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  projects?: ProjectItem[];
}

const ATSFields: React.FC<{ parsedData: ParsedResumeData | null; isLoading: boolean }> = ({ 
  parsedData, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-1/3 mb-6" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!parsedData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Parsed Resume Data</h2>
          <p className="text-gray-500">Upload a resume to see parsed information</p>
        </CardContent>
      </Card>
    );
  }

  const renderSection = (title: string, content: React.ReactNode) => (
    <>
      <h3 className="text-sm font-medium text-gray-500 mb-3">{title}</h3>
      {content}
      <Separator className="my-4" />
    </>
  );

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        <h2 className="text-lg font-semibold mb-2">Parsed Resume Data</h2>

        {/* Contact Information */}
        {renderSection("Contact Information", (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Name", value: parsedData.name },
              { label: "Email", value: parsedData.email },
              { label: "Phone", value: parsedData.phone },
              { label: "Address", value: parsedData.address },
            ].map((item) => item.value && (
              <div key={item.label}>
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
            {parsedData.linkedin && (
              <div>
                <p className="text-xs text-gray-500">LinkedIn</p>
                <a href={parsedData.linkedin} className="font-medium text-blue-600 hover:underline block truncate">
                  {parsedData.linkedin}
                </a>
              </div>
            )}
            {parsedData.portfolio && (
              <div>
                <p className="text-xs text-gray-500">Portfolio</p>
                <a href={parsedData.portfolio} className="font-medium text-blue-600 hover:underline block truncate">
                  {parsedData.portfolio}
                </a>
              </div>
            )}
          </div>
        ))}

        {/* Professional Summary */}
        {parsedData.summary && renderSection("Professional Summary", (
          <p className="text-sm whitespace-pre-line">{parsedData.summary}</p>
        ))}

        {/* Skills */}
        {parsedData.skills?.length > 0 && renderSection("Skills", (
          <div className="flex flex-wrap gap-2">
            {parsedData.skills.map((skill, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {skill}
              </span>
            ))}
          </div>
        ))}

         {/* Experience */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Experience</h3>
            {parsedData.experience && parsedData.experience.length > 0 ? (
              <div className="space-y-3">
                {parsedData.experience.map((exp, index) => (
                  <div key={index} className="border rounded-md p-3">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{exp.title || 'Unknown Position'}</p>
                      {(exp.start_date || exp.end_date) && (
                        <p className="text-sm text-gray-500">
                          {exp.start_date} {exp.end_date && `- ${exp.end_date}`}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-resume-secondary">{exp.company || 'Unknown Company'}</p>
                    <p className="text-sm mt-2">{exp.experience_detail || 'No description available'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No experience found in resume</p>
            )}
          </div>
          
          <Separator />

        {/* Education */}
        {parsedData.education?.length > 0 && renderSection("Education", (
          <div className="space-y-3">
            {parsedData.education.map((edu, i) => (
              <div key={i}>
                <h4 className="font-medium">{edu.degree}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">{edu.university}</span>
                  {edu.graduation_year && (
                    <span className="text-gray-500">{edu.graduation_year}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}

        {/* Projects */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Projects</h3>
          {parsedData.projects && parsedData.projects.length > 0 ? (
            <div className="space-y-3">
              {parsedData.projects.map((project, index) => (
                <div key={index} className="border rounded-md p-3">
                  <p className="font-medium">{project.project_title || "Untitled Project"}</p>
                  {project.project_detail && (
                    <p className="text-sm mt-1">{project.project_detail}</p>
                  )}
                  {project.project_technologies && project.project_technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {project.project_technologies.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="bg-resume-background text-resume-text px-2 py-1 rounded-md text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No projects found in resume</p>
          )}
        </div>

      </CardContent>
    </Card>
  );
};

export default ATSFields;