import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, User, Mail } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Resume } from '../types';

interface ResumeUploadProps {
  onResumeUploaded: (resume: Resume) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');

  const simulateResumeProcessing = async (file: File): Promise<Resume> => {
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockParsedText = `John Doe
Software Engineer
Email: john@email.com
Phone: (555) 123-4567

EXPERIENCE
Senior Software Developer | TechCorp (2021-Present)
- Developed full-stack web applications using React and Node.js
- Led a team of 5 developers on multiple projects
- Implemented microservices architecture using Docker and Kubernetes
- Collaborated with product managers and designers

Software Engineer | StartupXYZ (2019-2021)
- Built responsive web applications using JavaScript, HTML5, CSS3
- Worked with REST APIs and GraphQL
- Participated in agile development processes

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2015-2019)
GPA: 3.8/4.0

SKILLS
Programming: JavaScript, TypeScript, Python, Java
Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express, Django, Spring Boot
Database: MySQL, PostgreSQL, MongoDB
Cloud: AWS, Docker, Kubernetes
Other: Git, REST APIs, GraphQL, Agile, TDD`;

    const extractedSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
      'Vue.js', 'HTML5', 'CSS3', 'Express', 'Django', 'MySQL', 'PostgreSQL',
      'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Git', 'REST APIs', 'GraphQL'
    ];

    return {
      id: Date.now().toString(),
      fileName: file.name,
      studentName: studentName || 'John Doe',
      studentEmail: studentEmail || 'john@email.com',
      parsedText: mockParsedText,
      extractedSkills,
      education: ['Bachelor of Science in Computer Science'],
      experience: ['Senior Software Developer', 'Software Engineer'],
      uploadedAt: new Date().toISOString()
    };
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const resume = await simulateResumeProcessing(file);
      onResumeUploaded(resume);
      setStudentName('');
      setStudentEmail('');
    } catch (error) {
      console.error('Error processing resume:', error);
    } finally {
      setUploading(false);
    }
  }, [studentName, studentEmail, onResumeUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    multiple: false
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-1" />
              Student Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter student name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="h-4 w-4 inline mr-1" />
              Student Email
            </label>
            <input
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter student email"
            />
          </div>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {uploading ? (
            <div>
              <p className="text-lg font-medium text-blue-600">Processing resume...</p>
              <div className="mt-2 w-48 mx-auto bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          ) : isDragActive ? (
            <p className="text-lg font-medium text-blue-600">Drop the resume here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drag & drop a resume, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOCX, DOC, and TXT files
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};