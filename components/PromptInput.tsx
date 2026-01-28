
import React, { useCallback } from 'react';

interface PromptInputProps {
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isKosisDataLoaded: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({
  userPrompt,
  setUserPrompt,
  onGenerate,
  isLoading,
  isKosisDataLoaded,
}) => {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (userPrompt.trim() && !isLoading && isKosisDataLoaded) {
      onGenerate();
    }
  }, [userPrompt, isLoading, isKosisDataLoaded, onGenerate]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
      <textarea
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y h-24 overflow-auto disabled:bg-gray-100 text-base"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={
          isLoading
            ? '인포그래픽 생성 중...'
            : isKosisDataLoaded
            ? '청소년활동 통계에 대한 인포그래픽을 만들 질문을 입력해주세요... (예: 2023년 청소년활동 참여율에 대한 주요 통계와 트렌드를 분석해줘)'
            : '통계 데이터를 불러오는 중입니다...'
        }
        disabled={isLoading || !isKosisDataLoaded}
        aria-label="인포그래픽 생성 질문 입력"
      />
      <button
        type="submit"
        className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-lg font-semibold"
        disabled={isLoading || !userPrompt.trim() || !isKosisDataLoaded}
        aria-live="polite"
      >
        {isLoading ? '생성 중...' : '인포그래픽 생성'}
      </button>
    </form>
  );
};

export default PromptInput;
