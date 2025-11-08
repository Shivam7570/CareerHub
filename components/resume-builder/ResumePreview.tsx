
import React, { useRef } from 'react';
import { ResumeData } from '../../types';
import TemplateClassic from '../../templates/TemplateClassic';
import TemplateModern from '../../templates/TemplateModern';
import TemplateMinimalist from '../../templates/TemplateMinimalist';
import TemplateCreative from '../../templates/TemplateCreative';
import TemplateProfessional from '../../templates/TemplateProfessional';
import TemplateSelector, { TemplateName } from './TemplateSelector';
import Button from '../shared/Button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ResumePreviewProps {
    resumeData: ResumeData;
    activeTemplate: TemplateName;
    setActiveTemplate: (template: TemplateName) => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ resumeData, activeTemplate, setActiveTemplate }) => {
    const previewRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = () => {
        const input = previewRef.current;
        if (input) {
            html2canvas(input, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [canvas.width, canvas.height]
                });
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
                pdf.save("resume.pdf");
            });
        }
    };

    const renderTemplate = () => {
        switch (activeTemplate) {
            case 'classic':
                return <TemplateClassic data={resumeData} />;
            case 'modern':
                return <TemplateModern data={resumeData} />;
            case 'minimalist':
                return <TemplateMinimalist data={resumeData} />;
            case 'creative':
                return <TemplateCreative data={resumeData} />;
            case 'professional':
                return <TemplateProfessional data={resumeData} />;
            default:
                return <TemplateClassic data={resumeData} />;
        }
    };

    return (
        <div className="sticky top-24">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <TemplateSelector activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate} />
                <Button onClick={handleDownloadPdf}>Download PDF</Button>
            </div>
            <div className="bg-white text-black p-2 rounded-lg shadow-2xl">
                <div ref={previewRef} className="aspect-[8.5/11] w-full overflow-auto">
                    {renderTemplate()}
                </div>
            </div>
        </div>
    );
};

export default ResumePreview;
