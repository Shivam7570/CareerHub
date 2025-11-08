
import React from 'react';

export type TemplateName = 'classic' | 'modern' | 'minimalist' | 'creative' | 'professional';

interface TemplateSelectorProps {
    activeTemplate: TemplateName;
    setActiveTemplate: (template: TemplateName) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ activeTemplate, setActiveTemplate }) => {
    const templates: { id: TemplateName, name: string }[] = [
        { id: 'classic', name: 'Classic' },
        { id: 'modern', name: 'Modern' },
        { id: 'minimalist', name: 'Minimalist' },
        { id: 'creative', name: 'Creative' },
        { id: 'professional', name: 'Professional' },
    ];

    return (
        <div className="flex items-center flex-wrap gap-2 bg-slate-800 p-1 rounded-lg">
            {templates.map(template => (
                <button
                    key={template.id}
                    onClick={() => setActiveTemplate(template.id)}
                    className={`px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold rounded-md transition-all ${
                        activeTemplate === template.id
                            ? 'bg-indigo-600 text-white shadow'
                            : 'text-slate-300 hover:bg-slate-700'
                    }`}
                >
                    {template.name}
                </button>
            ))}
        </div>
    );
};

export default TemplateSelector;
