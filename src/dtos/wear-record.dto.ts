// 착용 이력 저장 요청 DTO (POST api/v1/wear-records)
export interface CreateWearRecordRequestDto {
  wear_date: string;       // "YYYY-MM-DD"
  clothes_ids: number[];   // 선택한 옷들의 ID 리스트
  memo?: string;           // 선택 사항 (코디 메모)
  is_heart?: boolean;      // 하트 표시 여부 (기본값 false)
  is_star?: boolean;       // 즐겨찾기 표시 여부 (기본값 false)
}

// 착용 이력 저장 응답 DTO
export interface CreateWearRecordResponseDto {
  date_id: number;         // Date 테이블 PK
  outfit_id: number;       // Outfit 테이블 PK
}