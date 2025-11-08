
import React from 'react';
import { ResumeData } from '../types';

const TemplateMinimalist: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, workExperience, education, skills } = data;
    return (
        <div className="p-10 font-sans text-xs bg-white text-gray-900">
            <header className="text-left mb-8 border-b pb-4">
                <h1 className="text-3xl font-light tracking-widest uppercase">{personalInfo.name || 'Your Name'}</h1>
                <p className="text-gray-600 mt-2">
                    {personalInfo.address}
                    {personalInfo.phone && ` · ${personalInfo.phone}`}
                    {personalInfo.email && ` · ${personalInfo.email}`}
                </p>
            </header>

            {summary && (
                <section className="mb-6">
                    <h2 className="section-title">Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                </section>
            )}

            {workExperience.length > 0 && (
                <section className="mb-6">
                    <h2 className="section-title">Experience</h2>
                    {workExperience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <h3 className="font-semibold">{exp.jobTitle}</h3>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">{exp.responsibilities}</p>
                        </div>
                    ))}
                </section>
            )}

            {education.length > 0 && (
                 <section className="mb-6">
                    <h2 className="section-title">Education</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                           <h3 className="font-semibold">{edu.institution}</h3>
                           <p className="text-gray-600">{edu.degree}</p>
                        </div>
                    ))}
                </section>
            )}
            
            {skills.length > 0 && skills[0] && (
                <section>
                    <h2 className="section-title">Skills</h2>
                    <p className="text-gray-700">{skills.join(' · ')}</p>
                </section>
            )}
            
            <style>{`.section-title { font-size: 0.875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #4A5568; margin-bottom: 0.75rem; }`}</style>
        </div>
    );
};

export default TemplateMinimalist;
