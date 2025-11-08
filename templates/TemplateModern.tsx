
import React from 'react';
import { ResumeData } from '../types';

const TemplateModern: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, workExperience, education, skills } = data;
    return (
        <div className="p-6 font-sans bg-white text-gray-800 flex text-xs">
            {/* Left Column */}
            <div className="w-1/3 pr-6 bg-gray-100 p-6">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold text-indigo-700">{personalInfo.name || 'Your Name'}</h1>
                </header>
                <section className="mb-6">
                    <h2 className="section-title">Contact</h2>
                    <p>{personalInfo.phone}</p>
                    <p>{personalInfo.email}</p>
                    <p>{personalInfo.address}</p>
                </section>
                {skills.length > 0 && skills[0] && (
                    <section className="mb-6">
                        <h2 className="section-title">Skills</h2>
                        <ul className="list-disc list-inside">
                            {skills.map((skill, i) => <li key={i}>{skill}</li>)}
                        </ul>
                    </section>
                )}
                {education.length > 0 && (
                    <section>
                        <h2 className="section-title">Education</h2>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-2">
                               <h3 className="font-semibold">{edu.institution}</h3>
                               <p className="text-gray-600">{edu.degree}</p>
                            </div>
                        ))}
                    </section>
                )}
            </div>

            {/* Right Column */}
            <div className="w-2/3 pl-6">
                {summary && (
                    <section className="mb-6">
                        <h2 className="section-title-main">Summary</h2>
                        <p>{summary}</p>
                    </section>
                )}
                 {workExperience.length > 0 && (
                    <section>
                        <h2 className="section-title-main">Experience</h2>
                        {workExperience.map(exp => (
                            <div key={exp.id} className="mb-4">
                                <h3 className="font-semibold text-base">{exp.jobTitle}</h3>
                                <p className="italic text-gray-600">{exp.company}</p>
                                <p className="mt-1 whitespace-pre-wrap">{exp.responsibilities}</p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
            
             <style>{`
                .section-title { font-weight: bold; color: #4338ca; margin-bottom: 0.5rem; text-transform: uppercase; }
                .section-title-main { font-weight: bold; color: #4338ca; margin-bottom: 0.75rem; text-transform: uppercase; font-size: 1.125rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; }
            `}</style>
        </div>
    );
};

export default TemplateModern;
