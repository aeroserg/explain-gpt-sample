import React from 'react';
import { useChatStore } from '@/store/chat/chatStore';
import { AssistantType } from '@/api/contracts';
import { SimplifiedHeader } from './SimplifiedHeader';
import SvgIcon from '@/components/ui/SvgIcon';
import SettingsModal from '@/modules/Settings/SettingsModal';
import { useUIStore } from '@/store/ui/uiStore';

const models = [
    {
        id: "ExplainLaw",
        name: "ExplainLAW",
        description: "Проконсультируйся по юридическим вопросам",
        assistantType: AssistantType.ExplainLaw,
    },
    {
        id: "ExplainGPT",
        name: "ExplainGPT",
        description: "Задай вопрос по любой теме",
        assistantType: AssistantType.ExplainGpt,
    },
    {
        id: "ExplainEstate",
        name: "ExplainESTATE",
        description: "Объяснение рынка недвижимости",
        assistantType: AssistantType.ExplainEstate,
    },
];

export const ModelSelectionPage: React.FC = () => {
    const { setPickedModel } = useChatStore();
    const { isSettingsModalOpen, closeSettingsModal } = useUIStore();
    const handleModelSelect = (assistantType: AssistantType) => {
        setPickedModel(assistantType);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-white dark:bg-[#1B1B1D] text-[#2B2B2B] dark:text-white p-4">
            <SimplifiedHeader />
            <div className="text-center mb-8 md:mb-16">
                <h1 className="text-2xl md:text-3xl font-medium tracking-tight">
                    Выбери свою модель, чтобы начать работать
                </h1>
            </div>
            <div className="flex flex-col md:flex-row flex-wrap items-center justify-center gap-8">
                {models.map((model) => (
                    <div
                        key={model.id}
                        className="relative w-[242px] h-[194px] flex flex-col items-start justify-center p-6 cursor-pointer group"
                        onClick={() => handleModelSelect(model.assistantType)}
                    >
                        <div className="absolute inset-0">
                            <SvgIcon src="/icons/folder-large.svg" className="w-full h-full" preserveColors />
                        </div>
                        <div className="relative z-10 pl-4">
                            <h2 className="text-base font-semibold tracking-tighter text-[#2B2B2B]">
                                {model.name}
                            </h2>
                            <p className="mt-8 text-sm text-[#4F5159] tracking-tighter">
                                {model.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            <SettingsModal isOpen={isSettingsModalOpen} onClose={closeSettingsModal} />
        </div>
    );
}; 