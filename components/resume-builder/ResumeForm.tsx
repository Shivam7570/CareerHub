
import React from 'react';
import { ResumeData, WorkExperience, Education } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import Button from '../shared/Button';
import Loader from '../shared/Loader';
import Card from '../shared/Card';

interface ResumeFormProps {
    resumeData: ResumeData;
    setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
    onSave: () => void;
    isSaving: boolean;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ resumeData, setResumeData, onSave, isSaving }) => {

    const handleChange = (section: keyof ResumeData, field: string, value: any) => {
        setResumeData(prev => ({
            ...prev,
            [section]: {
                ...(prev[section] as object),
                [field]: value,
            }
        }));
    };

    const handleArrayChange = (section: 'workExperience' | 'education', index: number, field: string, value: string) => {
        setResumeData(prev => {
            const newArray = [...prev[section]];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
    };

    const addArrayItem = (section: 'workExperience' | 'education') => {
        const newItem = section === 'workExperience' 
            ? { id: uuidv4(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: '' }
            : { id: uuidv4(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' };
        
        setResumeData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
    };

    const removeArrayItem = (section: 'workExperience' | 'education', id: string) => {
        setResumeData(prev => ({
            ...prev,
            [section]: prev[section].filter((item: WorkExperience | Education) => item.id !== id)
        }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const skillsArray = e.target.value.split(',').map(skill => skill.trim());
        setResumeData(prev => ({...prev, skills: skillsArray }));
    };

    const renderWorkExperience = () => (
        resumeData.workExperience.map((exp, index) => (
            <div key={exp.id} className="p-4 border border-slate-600 rounded-lg space-y-3 relative mb-4">
                <button type="button" onClick={() => removeArrayItem('workExperience', exp.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">&times;</button>
                <input type="text" placeholder="Job Title" value={exp.jobTitle} onChange={e => handleArrayChange('workExperience', index, 'jobTitle', e.target.value)} className="input-field"/>
                <input type="text" placeholder="Company" value={exp.company} onChange={e => handleArrayChange('workExperience', index, 'company', e.target.value)} className="input-field"/>
                <textarea placeholder="Responsibilities" value={exp.responsibilities} onChange={e => handleArrayChange('workExperience', index, 'responsibilities', e.target.value)} className="input-field min-h-[100px]"/>
            </div>
        ))
    );

     const renderEducation = () => (
        resumeData.education.map((edu, index) => (
            <div key={edu.id} className="p-4 border border-slate-600 rounded-lg space-y-3 relative mb-4">
                <button type="button" onClick={() => removeArrayItem('education', edu.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">&times;</button>
                <input type="text" placeholder="Institution" value={edu.institution} onChange={e => handleArrayChange('education', index, 'institution', e.target.value)} className="input-field"/>
                <input type="text" placeholder="Degree" value={edu.degree} onChange={e => handleArrayChange('education', index, 'degree', e.target.value)} className="input-field"/>
            </div>
        ))
    );

    return (
        <Card>
            <style>{`.input-field { width: 100%; background-color: #1e293b; border: 1px solid #475569; border-radius: 0.375rem; padding: 0.75rem; color: #e2e8f0; }`}</style>
            <div className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-white">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Full Name" value={resumeData.personalInfo.name} onChange={e => handleChange('personalInfo', 'name', e.target.value)} className="input-field"/>
                    <input type="email" placeholder="Email" value={resumeData.personalInfo.email} onChange={e => handleChange('personalInfo', 'email', e.target.value)} className="input-field"/>
                    <input type="tel" placeholder="Phone" value={resumeData.personalInfo.phone} onChange={e => handleChange('personalInfo', 'phone', e.target.value)} className="input-field"/>
                    <input type="text" placeholder="Address" value={resumeData.personalInfo.address} onChange={e => handleChange('personalInfo', 'address', e.target.value)} className="input-field"/>
                </div>

                <h3 className="text-xl font-bold text-white pt-4 border-t border-slate-700">Professional Summary</h3>
                <textarea placeholder="Write a brief summary..." value={resumeData.summary} onChange={e => setResumeData(p => ({...p, summary: e.target.value}))} className="input-field min-h-[120px]"/>

                <div className="pt-4 border-t border-slate-700">
                     <h3 className="text-xl font-bold text-white mb-4">Work Experience</h3>
                     {renderWorkExperience()}
                     <Button type="button" onClick={() => addArrayItem('workExperience')} className="bg-slate-600 hover:bg-slate-500 text-sm py-2">Add Experience</Button>
                </div>

                 <div className="pt-4 border-t border-slate-700">
                     <h3 className="text-xl font-bold text-white mb-4">Education</h3>
                     {renderEducation()}
                     <Button type="button" onClick={() => addArrayItem('education')} className="bg-slate-600 hover:bg-slate-500 text-sm py-2">Add Education</Button>
                </div>
                
                <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-xl font-bold text-white">Skills</h3>
                    <textarea placeholder="Enter skills, separated by commas" value={resumeData.skills.join(', ')} onChange={handleSkillsChange} className="input-field"/>
                </div>

                <div className="flex justify-end pt-6 border-t border-slate-700">
                    <Button onClick={onSave} disabled={isSaving}>
                        {isSaving ? <><Loader size="sm" /> Saving...</> : 'Save Resume'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ResumeForm;
