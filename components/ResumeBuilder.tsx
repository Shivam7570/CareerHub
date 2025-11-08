
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { ResumeData } from '../types';
import ResumeForm from './resume-builder/ResumeForm';
import ResumePreview from './resume-builder/ResumePreview';
import Loader from './shared/Loader';
import { TemplateName } from './resume-builder/TemplateSelector';

const initialResumeData: ResumeData = {
    personalInfo: { name: '', email: '', phone: '', linkedin: '', website: '', address: '' },
    summary: '',
    workExperience: [],
    education: [],
    skills: [],
};

const ResumeBuilder: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTemplate, setActiveTemplate] = useState<TemplateName>('classic');
    const { user } = useAuth();

    const fetchResumeData = useCallback(async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/resume', config);
            if (data) {
                // Ensure arrays are not null
                setResumeData({
                    ...initialResumeData,
                    ...data.content,
                    workExperience: data.content.workExperience || [],
                    education: data.content.education || [],
                    skills: data.content.skills || [],
                });
            } else {
                setResumeData(initialResumeData);
            }
        } catch (err) {
            console.error("No existing resume found or failed to fetch.", err);
            setResumeData(initialResumeData); // Start fresh if no resume exists
        } finally {
            setLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        fetchResumeData();
    }, [fetchResumeData]);

    const handleSave = async () => {
        if (!user?.token) return;
        setSaving(true);
        setError(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('/api/resume', { content: resumeData }, config);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save resume.');
        } finally {
            setSaving(false);
        }
    };
    
    if (loading) {
        return <div className="flex justify-center items-center h-96"><Loader size="lg" /></div>;
    }

    return (
        <div className="pb-16 md:pb-0">
             <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Resume Builder</h2>
                <p className="mt-4 text-lg text-slate-400">
                  Craft a professional resume from scratch or upload an existing one to get started.
                </p>
            </div>
            {error && <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4">{error}</div>}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <ResumeForm resumeData={resumeData} setResumeData={setResumeData} onSave={handleSave} isSaving={saving} />
                </div>
                <div className="lg:fixed lg:right-0 lg:top-20 lg:w-1/2 lg:h-screen lg:overflow-y-auto lg:pl-4 lg:pr-8 pt-2">
                     <ResumePreview 
                        resumeData={resumeData} 
                        activeTemplate={activeTemplate} 
                        setActiveTemplate={setActiveTemplate}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResumeBuilder;
