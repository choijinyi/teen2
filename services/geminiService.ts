
import { GoogleGenAI, Type } from "@google/genai";
import { KosisData, InfographicResponse, StatisticItem } from '../types';
import { GEMINI_MODEL_NAME } from '../constants';

export async function queryGemini(kosisData: KosisData[], userQuery: string): Promise<InfographicResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Format the KOSIS data into a readable string for the model
  const formattedKosisData = kosisData.map(item =>
    `항목: ${item.ITM_NM}, 분류: ${item.OBJ_NM}, 연도: ${item.DT}, 값: ${item.DT_VAL}${item.UNIT_NM}`
  ).join('\n');

  const prompt = `
  당신은 KOSIS(국가통계포털) 청소년활동 통계 데이터 전문 분석가이자 인포그래픽 디자이너입니다.
  사용자의 질문에 따라 주어진 KOSIS 통계 데이터를 분석하여 인포그래픽에 포함될 내용을 JSON 형식으로 생성해 주세요.
  답변은 다음과 같은 JSON Schema를 정확히 따라야 합니다.

  --- KOSIS 통계 데이터 ---
  ${formattedKosisData}
  ---

  --- 사용자 질문 ---
  ${userQuery}
  ---

  응답 형식은 아래 JSON 스키마를 따르며, 데이터에 기반한 상세하고 정확한 정보를 제공해야 합니다.
  데이터에 없는 내용은 없다고 명확히 언급하거나 관련 섹션을 비워두세요.
  모든 텍스트는 한국어로 작성해야 합니다.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts: [{ text: prompt }] },
      config: {
        temperature: 0.2, // Keep it factual
        maxOutputTokens: 2000, // Increased token limit for detailed infographic data
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: '인포그래픽의 메인 제목 (예: "청소년활동 참여율 분석 및 추이")',
            },
            summary: {
              type: Type.STRING,
              description: '인포그래픽 전체에 대한 간략한 요약 (2-3문장)',
            },
            keyStatistics: {
              type: Type.ARRAY,
              description: '가장 중요한 통계 수치 및 설명',
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING, description: '통계 항목의 이름 (예: "2023년 전체 참여율")' },
                  value: { type: Type.STRING, description: '통계 값 (예: "70.5")' },
                  unit: { type: Type.STRING, description: '단위 (예: "%", "명")' },
                  year: { type: Type.STRING, description: '해당 데이터의 연도' },
                  description: { type: Type.STRING, description: '통계에 대한 추가 설명' },
                },
                required: ['label', 'value'],
              },
            },
            trendAnalysis: {
              type: Type.STRING,
              description: '통계 데이터의 주요 추세 및 변화에 대한 분석 (2-4문장)',
              nullable: true,
            },
            conclusion: {
              type: Type.STRING,
              description: '인포그래픽의 결론 또는 주요 시사점',
            },
            source: {
              type: Type.STRING,
              description: '데이터 출처 (예: "KOSIS 국가통계포털")',
              nullable: true,
            }
          },
          required: ['title', 'summary', 'keyStatistics', 'conclusion'],
          propertyOrdering: ['title', 'summary', 'keyStatistics', 'trendAnalysis', 'conclusion', 'source'],
        },
      },
    });

    const jsonStr = response.text.trim();
    if (!jsonStr) {
      throw new Error("Gemini API returned an empty JSON response.");
    }
    
    // Attempt to parse the JSON string
    const infographicResponse: InfographicResponse = JSON.parse(jsonStr);
    
    // Basic validation for required fields
    if (!infographicResponse.title || !infographicResponse.summary || !infographicResponse.keyStatistics || !infographicResponse.conclusion) {
      throw new Error("Gemini API returned incomplete infographic data. Missing one or more required fields (title, summary, keyStatistics, conclusion).");
    }

    return infographicResponse;

  } catch (error) {
    console.error('Error from Gemini API:', error);
    if (error instanceof Error) {
        if (error.message.includes("Requested entity was not found.")) {
          return Promise.reject(new Error("API 호출 중 문제가 발생했습니다 (엔티티를 찾을 수 없음). API 키 설정을 확인해 주세요."));
        }
        if (error.message.includes("Unexpected token 'O' at position 0")) {
          // Often means the response was not JSON, but plain text like "Output blocked."
          return Promise.reject(new Error("Gemini API가 유효한 JSON 대신 예상치 못한 응답을 반환했습니다. 질문을 다시 시도하거나 내용을 변경해 보세요."));
        }
        return Promise.reject(new Error(`API 요청 중 오류가 발생했습니다: ${error.message}`));
    }
    return Promise.reject(new Error("알 수 없는 오류가 발생했습니다."));
  }
}
