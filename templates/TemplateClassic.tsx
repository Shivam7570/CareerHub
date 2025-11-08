
import React from 'react';
import { ResumeData } from '../types';

const TemplateClassic: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, workExperience, education, skills } = data;
    return (
        <div className="p-8 font-serif text-sm bg-white text-gray-800">
            <header className="text-center mb-6">
                <h1 className="text-3xl font-bold tracking-wider uppercase">{personalInfo.name || 'Your Name'}</h1>
                <p className="text-xs mt-1">
                    {personalInfo.address} {personalInfo.phone && `| ${personalInfo.phone}`} {personalInfo.email && `| ${personalInfo.email}`}
                </p>
            </header>

            {summary && (
                <section className="mb-6">
                    <h2 className="section-title">Summary</h2>
                    <p>{summary}</p>
                </section>
            )}

            {workExperience.length > 0 && (
                <section className="mb-6">
                    <h2 className="section-title">Experience</h2>
                    {workExperience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <h3 className="font-bold">{exp.jobTitle}</h3>
                            <p className="italic text-gray-600">{exp.company}</p>
                            <p className="text-xs whitespace-pre-wrap">{exp.responsibilities}</p>
                        </div>
                    ))}
                </section>
            )}

            {education.length > 0 && (
                 <section className="mb-6">
                    <h2 className="section-title">Education</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                           <h3 className="font-bold">{edu.institution}</h3>
                           <p>{edu.degree}</p>
                        </div>
                    ))}
                </section>
            )}
            
            {skills.length > 0 && skills[0] && (
                <section>
                    <h2 className="section-title">Skills</h2>
                    <p>{skills.join(', ')}</p>
                </section>
            )}
            
            <style>{`.section-title { font-weight: bold; font-size: 1.125rem; text-transform: uppercase; border-bottom: 2px solid #000; margin-bottom: 0.5rem; padding-bottom: 0.25rem; }`}</style>
        </div>
    );
};

export default TemplateClassic;
