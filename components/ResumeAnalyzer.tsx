
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { analyzeResume } from '../services/geminiService';
import { ResumeAnalysis } from '../types';
import Card from './shared/Card';
import Button from './shared/Button';
import Loader from './shared/Loader';
import ScoreCircle from './shared/ScoreCircle';

const ResumeAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setAnalysis(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a resume file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeResume(file);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderAnalysis = () => {
    if (!analysis) return null;
    return (
      <Card className="mt-8 animate-fade-in">
        <div className="p-6 md:p-8">
          <h3 className="text-2xl font-bold text-center text-white mb-6">Analysis Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex justify-center md:col-span-1">
              <ScoreCircle score={analysis.score} />
            </div>
            <div className="md:col-span-2 space-y-6">
              <div>
                <h4 className="font-semibold text-lg text-emerald-400 mb-2">Strengths</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg text-amber-400 mb-2">Areas for Improvement</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                  {analysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          </div>
           <div className="mt-8 pt-6 border-t border-slate-700">
              <h4 className="font-semibold text-lg text-indigo-400 mb-2">Actionable Suggestions</h4>
              <ul className="list-disc list-inside space-y-2 text-slate-300">
                {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 md:pb-0">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">AI Resume Analyzer</h2>
        <p className="mt-4 text-lg text-slate-400">
          Get instant feedback on your resume. See how well it scores against Applicant Tracking Systems (ATS) and get actionable advice.
        </p>
      </div>

      {error && (
         <Card><div className="p-4 bg-red-900/50 text-red-300 rounded-lg"><p className="font-semibold">Error</p><p>{error}</p></div></Card>
      )}

      <Card>
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`flex justify-center items-center w-full px-6 py-12 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragActive ? 'border-indigo-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <p className="text-slate-400">
                {isDragActive ? 'Drop the file here ...' : "Drag 'n' drop your resume here, or click to select a file"}
              </p>
              <p className="text-xs text-slate-500 mt-1">(.pdf, .docx, .txt)</p>
            </div>
          </div>

          {file && (
            <div className="mt-4 text-center text-slate-300">
              Selected file: <span className="font-semibold">{file.name}</span>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={handleAnalyze} disabled={!file || isLoading}>
              {isLoading ? <><Loader size="sm" /> Analyzing...</> : 'Analyze Resume'}
            </Button>
          </div>
        </div>
      </Card>

      {isLoading && <div className="flex justify-center pt-8"><Loader /></div>}
      {analysis && renderAnalysis()}
    </div>
  );
};

export default ResumeAnalyzer;
