import React from 'react';
import { CheckCircle, XCircle, AlertCircle, TrendingUp, Brain, Target } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Progress } from './ui/Progress';
import { Button } from './ui/Button';
import { Evaluation } from '../types';

interface EvaluationResultsProps {
  evaluation: Evaluation;
  onNewEvaluation: () => void;
}

export const EvaluationResults: React.FC<EvaluationResultsProps> = ({ 
  evaluation, 
  onNewEvaluation 
}) => {
  const getScoreVariant = (score: number) => {
    if (score >= 75) return 'success';
    if (score >= 50) return 'warning';
    return 'danger';
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'High': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Medium': return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'Low': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return null;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'High': return 'text-green-700 bg-green-50 border-green-200';
      case 'Medium': return 'text-orange-700 bg-orange-50 border-orange-200';
      case 'Low': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Evaluation Results</h2>
        <Button onClick={onNewEvaluation} variant="outline">
          New Evaluation
        </Button>
      </div>

      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Target className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Overall Score</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {evaluation.relevanceScore}%
            </div>
            <Progress 
              value={evaluation.relevanceScore} 
              variant={getScoreVariant(evaluation.relevanceScore)}
              className="mb-3"
            />
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getVerdictColor(evaluation.verdict)}`}>
              {getVerdictIcon(evaluation.verdict)}
              {evaluation.verdict} Match
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold">Hard Skills</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {evaluation.hardScore}%
            </div>
            <Progress value={evaluation.hardScore} variant="success" className="mb-3" />
            <p className="text-sm text-gray-600">
              Keywords & exact matches
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="h-6 w-6 text-purple-600" />
              <h3 className="text-lg font-semibold">Soft Skills</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {evaluation.softScore}%
            </div>
            <Progress value={evaluation.softScore} variant="default" className="mb-3" />
            <p className="text-sm text-gray-600">
              Semantic & contextual analysis
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Skills Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evaluation.skillsBreakdown.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{skill.skill}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {skill.confidence}%
                    </span>
                    {skill.status === 'found' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {skill.status === 'partial' && (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                    {skill.status === 'missing' && (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missing Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">Missing Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {evaluation.missingSkills.length > 0 ? (
              <div className="space-y-3">
                {evaluation.missingSkills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <span className="text-red-700 font-medium">{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <p className="text-green-700 font-medium">All required skills found!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI-Generated Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {evaluation.feedback}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Bias Detection */}
      {evaluation.biasFlags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5" />
              Bias Detection Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {evaluation.biasFlags.map((flag, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-orange-700">{flag}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};