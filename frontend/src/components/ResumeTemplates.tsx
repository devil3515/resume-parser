
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Download, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
}

interface ResumeTemplatesProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplate: string | null;
}

const TEMPLATES: Template[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design with a modern touch',
    thumbnail: '/placeholder.svg',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional resume layout for conservative industries',
    thumbnail: '/placeholder.svg',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold design for standing out in creative fields',
    thumbnail: '/placeholder.svg',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant design with focus on content',
    thumbnail: '/placeholder.svg',
  },
];

const ResumeTemplates: React.FC<ResumeTemplatesProps> = ({ onSelectTemplate, selectedTemplate }) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Resume Templates</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map((template) => (
            <div
              key={template.id}
              className={cn(
                "border rounded-md overflow-hidden cursor-pointer transition-all",
                selectedTemplate === template.id ? "ring-2 ring-resume-primary" : "hover:border-resume-accent"
              )}
              onClick={() => onSelectTemplate(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
            >
              <div className="relative h-32 bg-gray-100">
                <img
                  src={template.thumbnail}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
                {(hoveredTemplate === template.id || selectedTemplate === template.id) && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    {selectedTemplate === template.id ? (
                      <span className="bg-resume-primary text-white px-2 py-1 rounded-full flex items-center text-sm">
                        <Check className="w-4 h-4 mr-1" /> Selected
                      </span>
                    ) : (
                      <span className="bg-white text-resume-primary px-2 py-1 rounded-full text-sm">
                        Select
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{template.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button
            className="bg-resume-primary hover:bg-resume-secondary flex items-center"
            disabled={!selectedTemplate}
          >
            <Download className="mr-2 h-4 w-4" />
            Generate Resume
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeTemplates;
