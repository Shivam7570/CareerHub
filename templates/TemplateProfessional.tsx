
import React from 'react';
import { ResumeData } from '../types';

const TemplateProfessional: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, workExperience, education, skills } = data;
    return (
        <div className="p-8 font-serif text-sm bg-white text-gray-900">
            <header className="text-center mb-6">
                <h1 className="text-4xl font-bold tracking-normal">{personalInfo.name || 'Your Name'}</h1>
                <div className="flex justify-center items-center gap-x-4 text-xs mt-2 text-gray-600">
                    <span>{personalInfo.address}</span>
                    <span>{personalInfo.phone}</span>
                    <span>{personalInfo.email}</span>
                </div>
            </header>

            {summary && (
                <section className="mb-6">
                    <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
                    <p className="text-justify leading-relaxed">{summary}</p>
                </section>
            )}

            {workExperience.length > 0 && (
                <section className="mb-6">
                    <h2 className="section-title">PROFESSIONAL EXPERIENCE</h2>
                    {workExperience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base">{exp.jobTitle}</h3>
                                <p className="text-xs text-gray-600">{exp.company}</p>
                            </div>
                            <ul className="list-disc list-inside mt-1 text-justify">
                                {exp.responsibilities.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim()}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
            )}

            {education.length > 0 && (
                 <section className="mb-6">
                    <h2 className="section-title">EDUCATION</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                           <h3 className="font-bold">{edu.institution}</h3>
                           <p className="text-gray-700">{edu.degree}</p>
                        </div>
                    ))}
                </section>
            )}
            
            {skills.length > 0 && skills[0] && (
                <section>
                    <h2 className="section-title">KEY SKILLS</h2>
                    <p className="leading-relaxed">{skills.join(' | ')}</p>
                </section>
            )}
            
            <style>{`.section-title { font-weight: 700; font-size: 0.875rem; letter-spacing: 0.1em; color: #374151; border-bottom: 1px solid #D1D5DB; margin-bottom: 0.75rem; padding-bottom: 0.25rem; }`}</style>
        </div>
    );
};

export default TemplateProfessional;
