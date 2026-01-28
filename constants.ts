
export const KOSIS_API_URL: string =
  // 'Failed to fetch' 오류는 주로 CORS (Cross-Origin Resource Sharing) 정책 위반 때문에 발생합니다.
  // KOSIS API 서버가 현재 앱이 실행되는 출처에서의 요청을 허용하도록 설정되어 있지 않을 수 있습니다.
  // 개발 및 테스트 목적으로 CORS 프록시(예: https://corsproxy.io/)를 사용하여 이 문제를 우회할 수 있습니다.
  // 프로덕션 환경에서는 보안 및 안정성을 위해 자체 백엔드 프록시를 구축하는 것을 권장합니다.
  'https://corsproxy.io/?https://kosis.kr/openapi/Param/statisticsParameterData.do?method=getList&apiKey=MTkzNGU4ZmU3OGFkNmM3YTVmZmY4NWM5ZDNmNDQ1OGE=&itmId=T001+&objL1=ALL&objL2=ALL&objL3=&objL4=&objL5=&objL6=&objL7=&objL8=&format=json&jsonVD=Y&prdSe=F&newEstPrdCnt=3&orgId=154&tblId=DT_154013_24BB001100';

export const GEMINI_MODEL_NAME: string = 'gemini-3-flash-preview';
