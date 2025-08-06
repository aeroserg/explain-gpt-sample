import { useChatStore } from '@/store/chat/chatStore';
import { ChatPageLayout } from '@/layouts/ChatPageLayout';
import { ModelSelectionPage } from './components/ModelSelectionPage';
import { useAuthStore } from '@/store/auth/authStore';
import { useTopicsStore } from '@/store/topics/topicsStore';
import { useEffect } from 'react';
import { AssistantType, TopicsType, TopicStatusRequest } from '@/api/contracts';
import { Loader } from '@/components/ui/loader';
import { useNavigate } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';

/**
 * Determines the appropriate `TopicsType` based on the selected assistant model.
 * Defaults to `TopicsType.All` if no model is selected.
 * @param model - The current assistant type, or null if none is selected.
 * @returns The corresponding `TopicsType` for API requests.
 */
const getTopicsTypeForModel = (model: AssistantType | null): TopicsType => {
    if (!model) return TopicsType.All;
    switch (model) {
        case AssistantType.ExplainLaw:
            return TopicsType.Law;
        case AssistantType.ExplainGpt:
            return TopicsType.Gpt;
        case AssistantType.ExplainEstate:
            return TopicsType.Estate;
        default:
            return TopicsType.All;
    }
};

/**
 * @component MainPageWrapper
 * @description A wrapper component that handles the logic for the main application view.
 * It determines whether to show the model selection page, a loading state, or the main
 * chat layout based on authentication status, topic availability, and loading states.
 * It also triggers fetching topics based on the selected model.
 */
const MainPageWrapper = () => {
    const { pickedModel } = useChatStore();
    const { auth } = useAuthStore();
    const { topics, topicsAreLoading, getTopics, lastLoadedType } = useTopicsStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth?.access_token) {
            return;
        }

        const requiredTopicsType = getTopicsTypeForModel(pickedModel ?? null);

        // Fetch topics only if they are for a different model type or not loaded yet
        if (lastLoadedType !== requiredTopicsType && !topicsAreLoading) {
            getTopics(auth.access_token, requiredTopicsType, TopicStatusRequest.Active);
        }
    }, [auth?.access_token, pickedModel, topicsAreLoading, lastLoadedType, getTopics]);

    // Redirect to new chat if no topics are loaded for the selected model
    useEffect(() => {
        if (!topicsAreLoading && topics?.length === 0 && lastLoadedType === getTopicsTypeForModel(pickedModel ?? null)) {
            navigate(AppRoutes.Main, { replace: true });
        }
    }, [topics, topicsAreLoading, pickedModel, lastLoadedType, navigate]);


    if (topicsAreLoading && !topics) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader variant="dots" />
            </div>
        );
    }

    if (!auth?.access_token) {
        return <ModelSelectionPage />;
    }

    const hasChats = topics && topics.length > 0;

    if (!pickedModel && !hasChats && !topicsAreLoading) {
        return <ModelSelectionPage />;
    }

    return <ChatPageLayout />;
}

export default MainPageWrapper; 