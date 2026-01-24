import * as closetRepository from "../repositories/closet.repository";
import {
  ClosetsInfoResponseDto,
  HomeClosetDto,
  ClothingInfoResponseDto,
  SectionClothesResponseDto,
  ClothingItemDto,
  ClosetSectionsViewResponseDto,
  SectionViewItemDto,
} from "../dtos/closet.dto";

// 홈화면 옷장목록 조회
export const getHomeClosets = async (
  userId: number,
): Promise<ClosetsInfoResponseDto> => {
  const closets = await closetRepository.getClosetsInfo(userId);

  if (!closets || closets.length === 0) {
    throw new Error("NOT_FOUND: 옷장 정보를 찾을 수 없습니다.");
  }

  // 배열을 직접 반환
  return closets.map(
    (closet): HomeClosetDto => ({
      closet_id: closet.closet_id,
      closet_name: closet.closet_name,
    }),
  );
};

// 옷장 선택 시 섹션 뷰 조회
export const getClosetSectionsView = async (
  closetId: number,
  userId: number,
): Promise<ClosetSectionsViewResponseDto> => {
  // 1. 옷장 존재 및 소유권 확인
  const closet = await closetRepository.findClosetWithTemplate(
    closetId,
    userId,
  );
  if (!closet) {
    throw new Error("FORBIDDEN: 해당 옷장에 접근 권한이 없습니다.");
  }

  // 2. 옷장의 섹션 목록 조회
  const sections = await closetRepository.findSectionsByClosetId(closetId);

  // 3. DTO 변환
  const sectionItems: SectionViewItemDto[] = sections.map((section) => ({
    section_id: section.section_id,
    section_name: section.name, // 사용자가 지정한 별명
    section_type: section.sectionTemplate.section_type, // 템플릿 타입 (예: "행거", "서랍")
    clothing_count: section._count.clothings, // 해당 섹션에 포함된 옷 개수
  }));

  return {
    closet: {
      closet_id: closet.closet_id,
      closet_name: closet.closet_name,
      closet_type: closet.closetTemplate.template_name, // 옷장 템플릿 타입
    },
    sections: sectionItems,
    total_sections: sectionItems.length,
  };
};

// 섹션 속 옷 조회
export const getSectionClothes = async (
  sectionId: number,
  userId: number,
): Promise<SectionClothesResponseDto> => {
  const hasOwnership = await closetRepository.checkSectionOwnership(
    sectionId,
    userId,
  );
  if (!hasOwnership) {
    throw new Error("FORBIDDEN: 해당 섹션에 접근 권한이 없습니다.");
  }

  const section = await closetRepository.findSectionWithCloset(sectionId);
  if (!section) {
    throw new Error("NOT_FOUND: 섹션을 찾을 수 없습니다.");
  }

  const clothes = await closetRepository.findClothesBySection(
    sectionId,
    userId,
  );

  const clothingItems: ClothingItemDto[] = clothes.map((cloth) => ({
    clothing_id: cloth.clothing_id,
    image: cloth.image,
    category: cloth.category.name,
    temperature: cloth.temperature,
    created_at: cloth.created_at,
  }));

  return {
    section: {
      section_id: section.section_id,
      name: section.name,
      closet_name: section.closet.closet_name,
    },
    clothes: clothingItems,
    total_count: clothingItems.length,
  };
};

// 옷 정보 조회
// 방법 2: 에러 구분 (더 복잡하지만 명확함)
export const viewClothing = async (
  clothingId: number,
  userId: number,
): Promise<ClothingInfoResponseDto> => {
  const clothing = await closetRepository.getClothingInfo(clothingId);

  if (!clothing) {
    throw new Error("NOT_FOUND: 옷 정보를 찾을 수 없습니다.");
  }
  if (clothing.user_id !== userId) {
    throw new Error("FORBIDDEN: 해당 옷에 접근 권한이 없습니다.");
  }

  // DTO 변환하여 반환
  return {
    clothing_id: clothing.clothing_id,
    temperature: clothing.temperature,
    image: clothing.image,
    category_id: clothing.category_id,
    section_id: clothing.section_id,
  };
};
