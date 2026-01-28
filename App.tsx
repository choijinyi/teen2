
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchKosisData } from './services/kosisService';
import { queryGemini } from './services/geminiService';
import { KosisData, InfographicResponse } from './types';
import PromptInput from './components/PromptInput';
import InfographicDisplay from './components/InfographicDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { KOSIS_API_URL } from './constants';

function App() {
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [kosisData, setKosisData] = useState<KosisData[] | null>(null);
  const [infographicData, setInfographicData] = useState<InfographicResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKosisData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchKosisData(KOSIS_API_URL);
        setKosisData(data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Failed to fetch KOSIS data:', err);
        setError('통계 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    loadKosisData();
  }, []);

  const handleGenerateInfographic = useCallback(async () => {
    if (!userPrompt.trim()) {
      setError('질문을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setInfographicData(null); // Clear previous infographic

    if (!kosisData) {
      setError('아직 통계 데이터를 불러오지 못했습니다. 잠시 기다려 주시거나 다시 시도해 주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await queryGemini(kosisData, userPrompt);
      setInfographicData(response);
    } catch (err) {
      console.error('Error generating infographic:', err);
      setError(`인포그래픽 생성 중 오류가 발생했습니다: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [userPrompt, kosisData]);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
      <header className="bg-indigo-600 text-white p-4 text-center font-bold text-xl shadow-md">
        청소년활동 통계 인포그래픽 생성기
      </header>
      <div className="text-gray-600 text-sm text-center py-2 bg-white border-b border-gray-100">
        Created by Professor Choi Jin-yi (최진이 교수 제작)
      </div>

      <div className="p-4 border-b border-gray-200">
        <PromptInput
          userPrompt={userPrompt}
          setUserPrompt={setUserPrompt}
          onGenerate={handleGenerateInfographic}
          isLoading={isLoading}
          isKosisDataLoaded={!!kosisData}
        />
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {isLoading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {infographicData && !isLoading && !error && (
          <InfographicDisplay infographicData={infographicData} />
        )}

        {!isLoading && !error && !infographicData && (
          <div className="text-center text-gray-500 p-8">
            <p>궁금한 통계에 대해 질문을 입력하고 인포그래픽을 생성해보세요!</p>
            <p className="mt-2 text-sm">예: "청소년활동 참여율의 최근 3년간 변화 추이를 분석하고 주요 통계를 포함한 인포그래픽을 만들어줘."</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
