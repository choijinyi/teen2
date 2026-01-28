
import React, { useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import { InfographicResponse } from '../types';

interface InfographicDisplayProps {
  infographicData: InfographicResponse;
}

const InfographicDisplay: React.FC<InfographicDisplayProps> = ({ infographicData }) => {
  const infographicRef = useRef<HTMLDivElement>(null);

  const handleDownloadImage = useCallback(() => {
    if (infographicRef.current) {
      html2canvas(infographicRef.current, {
        useCORS: true, // 이미지에 외부 리소스가 포함될 경우 필요
        scale: 2, // 고해상도 이미지를 위해 스케일 증가
        windowWidth: infographicRef.current.scrollWidth,
        windowHeight: infographicRef.current.scrollHeight,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'youth_activity_infographic.png';
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div
        ref={infographicRef}
        className="infographic-container bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl border border-gray-200"
        aria-live="polite"
      >
        <h2 className="text-3xl font-extrabold text-indigo-800 mb-6 text-center">{infographicData.title}</h2>

        <section className="mb-8 p-4 bg-indigo-50 rounded-md">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">요약</h3>
          <p className="text-gray-700 leading-relaxed text-base">{infographicData.summary}</p>
        </section>

        {infographicData.keyStatistics && infographicData.keyStatistics.length > 0 && (
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">주요 통계</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {infographicData.keyStatistics.map((stat, index) => (
                <div key={index} className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-200 flex flex-col justify-center items-center">
                  <p className="text-sm text-gray-600 mb-1">{stat.label} {stat.year ? `(${stat.year}년)` : ''}</p>
                  <p className="text-4xl font-black text-purple-700 mb-2">
                    {stat.value}{stat.unit}
                  </p>
                  {stat.description && (
                    <p className="text-xs text-gray-500 text-center">{stat.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {infographicData.trendAnalysis && (
          <section className="mb-8 p-4 bg-gray-100 rounded-md">
            <h3 className="text-xl font-bold text-gray-800 mb-2">추세 분석</h3>
            <p className="text-gray-700 leading-relaxed text-base">{infographicData.trendAnalysis}</p>
          </section>
        )}

        <section className="mb-8 p-4 bg-indigo-100 rounded-md">
          <h3 className="text-xl font-bold text-indigo-700 mb-2">결론</h3>
          <p className="text-gray-700 leading-relaxed text-base">{infographicData.conclusion}</p>
        </section>

        {infographicData.source && (
          <footer className="text-center text-gray-500 text-xs mt-6 border-t pt-4">
            데이터 출처: {infographicData.source}
          </footer>
        )}
      </div>

      <button
        onClick={handleDownloadImage}
        className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-200 text-lg font-semibold"
        aria-label="인포그래픽 이미지 다운로드"
      >
        인포그래픽 이미지 다운로드
      </button>
    </div>
  );
};

export default InfographicDisplay;
