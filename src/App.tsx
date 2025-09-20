import React, { useState } from 'react';
import { Brain, BarChart3, Users, Target } from 'lucide-react';
import { JobForm } from './components/JobForm';
import { ResumeUpload } from './components/ResumeUpload';
import { EvaluationResults } from './components/EvaluationResults';
import { Button } from './components/ui/Button';
import { Card, CardContent } from './components/ui/Card';
import { JobDescription, Resume, Evaluation } from './types';
import { evaluationService } from './services/evaluationService';

type Step = 'job' | 'resume' | 'evaluating' | 'results';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('job');
  const [currentJob, setCurrentJob] = useState<JobDescription | null>(null);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleJobCreated = (job: JobDescription) => {
    setCurrentJob(job);
    setCurrentStep('resume');
  };

  const handleResumeUploaded = async (resume: Resume) => {
    setCurrentResume(resume);
    setCurrentStep('evaluating');
    setIsEvaluating(true);
    
    if (currentJob) {
      try {
        const result = await evaluationService.evaluateResume(resume, currentJob);
        setEvaluation(result);
        setCurrentStep('results');
      } catch (error) {
        console.error('Evaluation failed:', error);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  const startNewEvaluation = () => {
    setCurrentStep('job');
    setCurrentJob(null);
    setCurrentResume(null);
    setEvaluation(null);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-8">
        <div className={`flex items-center ${currentStep === 'job' ? 'text-blue-600' : currentStep === 'resume' || currentStep === 'evaluating' || currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'job' ? 'bg-blue-600 text-white' : currentStep === 'resume' || currentStep === 'evaluating' || currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
            1
          </div>
          <span className="ml-2 font-medium">Create Job</span>
        </div>
        
        <div className={`w-16 h-1 ${currentStep === 'resume' || currentStep === 'evaluating' || currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
        
        <div className={`flex items-center ${currentStep === 'resume' ? 'text-blue-600' : currentStep === 'evaluating' || currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'resume' ? 'bg-blue-600 text-white' : currentStep === 'evaluating' || currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
            2
          </div>
          <span className="ml-2 font-medium">Upload Resume</span>
        </div>
        
        <div className={`w-16 h-1 ${currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
        
        <div className={`flex items-center ${currentStep === 'results' ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
            3
          </div>
          <span className="ml-2 font-medium">View Results</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ResumeAI</h1>
                <p className="text-sm text-gray-500">Automated Resume Relevance Check System</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>AI-Powered Matching</span>
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>Detailed Analytics</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Bias Detection</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentStep !== 'results' && renderStepIndicator()}

        {/* Job Creation Step */}
        {currentStep === 'job' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Start with a Job Description</h2>
              <p className="text-lg text-gray-600">Create a detailed job posting to evaluate candidate resumes against</p>
            </div>
            <JobForm onJobCreated={handleJobCreated} />
          </div>
        )}

        {/* Resume Upload Step */}
        {currentStep === 'resume' && currentJob && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Resume to Evaluate</h2>
              <p className="text-lg text-gray-600">
                Evaluating against: <span className="font-semibold text-blue-600">{currentJob.title}</span> at {currentJob.company}
              </p>
            </div>
            <ResumeUpload onResumeUploaded={handleResumeUploaded} />
            <div className="mt-6 text-center">
              <Button variant="outline" onClick={() => setCurrentStep('job')}>
                Back to Job Creation
              </Button>
            </div>
          </div>
        )}

        {/* Evaluating Step */}
        {currentStep === 'evaluating' && (
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardContent className="p-12">
                <div className="animate-spin w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">AI Analysis in Progress</h2>
                <div className="space-y-2 text-gray-600">
                  <p>🔍 Parsing resume content</p>
                  <p>🧠 Running semantic analysis</p>
                  <p>📊 Calculating relevance score</p>
                  <p>💡 Generating personalized feedback</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results Step */}
        {currentStep === 'results' && evaluation && (
          <div className="max-w-6xl mx-auto">
            <EvaluationResults 
              evaluation={evaluation} 
              onNewEvaluation={startNewEvaluation} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">Built with ❤️ for efficient recruitment and candidate development</p>
            <p className="text-sm">AI-powered • Bias-aware • Production-ready</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;