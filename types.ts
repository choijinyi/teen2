
export interface KosisData {
  ITM_NM: string;
  ITM_ID: string;
  OBJ_ID: string;
  OBJ_NM: string;
  DT: string;
  UNIT_NM: string;
  PRD_DE: string;
  DT_VAL: string;
}

// 인포그래픽 내 개별 통계 항목 데이터 구조
export interface StatisticItem {
  label: string; // 통계 항목의 이름 (예: "전체 참여율")
  value: string; // 통계 값 (예: "70.5")
  unit?: string; // 단위 (예: "%")
  year?: string; // 해당 데이터의 연도 (예: "2023")
  description?: string; // 통계에 대한 추가 설명
}

// Gemini로부터 받을 인포그래픽 전체 데이터 구조
export interface InfographicResponse {
  title: string; // 인포그래픽의 메인 제목
  summary: string; // 인포그래픽 전체에 대한 간략한 요약
  keyStatistics: StatisticItem[]; // 주요 통계 수치 배열
  trendAnalysis?: string; // 추세 분석 텍스트
  conclusion: string; // 인포그래픽의 결론 또는 주요 시사점
  source?: string; // 데이터 출처 (예: "KOSIS 국가통계포털")
}
