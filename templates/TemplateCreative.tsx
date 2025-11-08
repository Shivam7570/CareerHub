
import React from 'react';
import { ResumeData } from '../types';

const TemplateCreative: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personalInfo, summary, workExperience, education, skills } = data;
    const accentColor = '#DD6B20'; // A vibrant orange

    return (
        <div className="font-sans bg-white text-gray-800 flex text-xs">
            {/* Left Column */}
            <div className="w-1/3 p-6" style={{ backgroundColor: '#F7FAFC' /* gray-100 */ }}>
                 <header className="text-center mb-8">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                        <span className="text-white text-4xl font-bold">
                             {personalInfo.name ? personalInfo.name.charAt(0) : 'U'}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold">{personalInfo.name || 'Your Name'}</h1>
                 </header>

                <section className="mb-6">
                    <h2 className="section-title">Contact</h2>
                    <p>{personalInfo.phone}</p>
                    <p>{personalInfo.email}</p>
                    <p>{personalInfo.address}</p>
                </section>

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
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, i) => <span key={i} className="bg-gray-300 px-2 py-1 rounded-md text-xs">{skill}</span>)}
                        </div>
                    </section>
                )}
            </div>

            {/* Right Column */}
            <div className="w-2/3 p-8">
                {summary && (
                    <section className="mb-8">
                        <h2 className="section-title-main">Profile</h2>
                        <p className="text-gray-700 leading-relaxed">{summary}</p>
                    </section>
                )}
                 {workExperience.length > 0 && (
                    <section>
                        <h2 className="section-title-main">Experience</h2>
                        {workExperience.map(exp => (
                            <div key={exp.id} className="mb-5">
                                <h3 className="font-bold text-base">{exp.jobTitle}</h3>
                                <p className="italic text-gray-500">{exp.company}</p>
                                <p className="mt-2 text-gray-700 whitespace-pre-wrap leading-relaxed">{exp.responsibilities}</p>
                            </div>
                        ))}
                    </section>
                )}
            </div>
            
             <style>{`
                .section-title { font-weight: bold; color: ${accentColor}; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; }
                .section-title-main { font-weight: bold; color: ${accentColor}; margin-bottom: 1rem; text-transform: uppercase; font-size: 1.25rem; border-bottom: 2px solid ${accentColor}; padding-bottom: 0.25rem; }
            `}</style>
        </div>
    );
};

export default TemplateCreative;
