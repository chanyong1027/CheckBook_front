/**
 * 도서관 관련 API
 *
 * @description
 * - 도서관 검색, 조회, 가용성 확인
 * - 위치 기반 검색 지원
 */

import { api } from "./index";
import { Library, LibrarySearchFilter, Region } from "@/types/library";
import { API_PATHS } from "@/utils/constants";

/**
 * 도서관 검색
 *
 * @param filter - 검색 필터 (키워드, 지역, 위치 등)
 * @returns 도서관 목록
 *
 * @example
 * // 키워드로 검색
 * const libraries = await fetchLibraries({ keyword: '시립도서관' });
 *
 * @example
 * // 위치 기반 검색 (반경 5km)
 * const nearbyLibraries = await fetchLibraries({
 *   userLatitude: 37.5665,
 *   userLongitude: 126.9780,
 *   radiusKm: 5
 * });
 */
export const fetchLibraries = async (
  filter: LibrarySearchFilter = {}
): Promise<Library[]> => {
  const response = await api.get<Library[]>("/api/libraries/search", {
    params: {
      keyword: filter.keyword,
      regionCode: filter.regionCode,
      districtCode: filter.districtCode,
      latitude: filter.userLatitude,
      longitude: filter.userLongitude,
      radius: filter.radiusKm,
    },
  });
  return response.data;
};

/**
 * 도서관 상세 정보 조회
 *
 * @param id - 도서관 ID
 * @returns 도서관 상세 정보
 *
 * @example
 * const library = await fetchLibraryDetail('lib-123');
 * console.log(library.name, library.address);
 */
export const fetchLibraryDetail = async (id: string): Promise<Library> => {
  const response = await api.get<Library>(`/api/libraries/${id}`);
  return response.data;
};

/**
 * 사용자의 도서관 목록 조회 (내 도서관)
 *
 * @returns 사용자가 등록한 도서관 목록 (최대 3개)
 *
 * @example
 * const myLibraries = await fetchUserLibraries();
 * console.log(`등록된 도서관: ${myLibraries.length}개`);
 */
export const fetchUserLibraries = async (): Promise<Library[]> => {
  const response = await api.get<any[]>(API_PATHS.USER_LIBRARIES);

  // 백엔드 필드명(libName, tel)을 프론트엔드 필드명(name, phone)으로 변환
  return response.data.map((item: any) => ({
    id: String(item.id),
    name: item.libName,
    address: item.address,
    phone: item.tel,
    homepage: item.homepage,
    latitude: item.latitude,
    longitude: item.longitude,
  }));
};

/**
 * 내 도서관 추가
 *
 * @param libraryId - 추가할 도서관 ID
 * @returns void (백엔드에서 빈 응답 반환)
 *
 * @throws {AppError} 최대 3개 제한 초과 시
 *
 * @example
 * await addUserLibrary('lib-456');
 */
export const addUserLibrary = async (libraryId: string): Promise<void> => {
  await api.post<void>(
    `/api/libraries/${libraryId}/my-library`
  );
};

/**
 * 내 도서관 제거
 *
 * @param libraryId - 제거할 도서관 ID
 * @returns void (백엔드에서 빈 응답 반환)
 *
 * @example
 * await removeUserLibrary('lib-456');
 */
export const removeUserLibrary = async (
  libraryId: string
): Promise<void> => {
  await api.delete<void>(
    `/api/libraries/${libraryId}/my-library`
  );
};

/**
 * 내 도서관 순서 변경
 *
 * @param libraryIds - 변경된 순서의 도서관 ID 배열
 * @returns 업데이트된 도서관 목록
 *
 * @example
 * const reordered = await reorderUserLibraries(['lib-3', 'lib-1', 'lib-2']);
 */
export const reorderUserLibraries = async (
  libraryIds: string[]
): Promise<Library[]> => {
  const response = await api.put<Library[]>(API_PATHS.USER_LIBRARIES, {
    libraryIds,
  });
  return response.data;
};

/**
 * 시/도 목록 조회
 *
 * @returns 시/도 지역 목록
 *
 * @example
 * const regions = await fetchRegions();
 * // [{ code: '11', name: '서울특별시' }, ...]
 */
export const fetchRegions = async (): Promise<Region[]> => {
  const response = await api.get<Region[]>("/api/regions");
  return response.data;
};

/**
 * 시/군/구 목록 조회
 *
 * @param regionCode - 시/도 코드
 * @returns 해당 시/도의 시/군/구 목록
 *
 * @example
 * const districts = await fetchDistricts('11'); // 서울의 구 목록
 * // [{ code: '11010', name: '종로구', parentCode: '11' }, ...]
 */
export const fetchDistricts = async (regionCode: string): Promise<Region[]> => {
  const response = await api.get<Region[]>(
    `/api/regions/${regionCode}/districts`
  );
  return response.data;
};

/**
 * 근처 도서관 조회 (위치 기반)
 *
 * @param latitude - 위도
 * @param longitude - 경도
 * @param radiusKm - 검색 반경 (km, 기본 5km)
 * @returns 근처 도서관 목록 (거리순 정렬)
 *
 * @example
 * const nearby = await fetchNearbyLibraries(37.5665, 126.9780, 3);
 * nearby.forEach(lib => {
 *   console.log(`${lib.name}: ${lib.distanceKm}km`);
 * });
 */
export const fetchNearbyLibraries = async (
  latitude: number,
  longitude: number,
  radiusKm = 5
): Promise<Library[]> => {
  const response = await api.get<Library[]>("/api/libraries/nearby", {
    params: { latitude, longitude, radius: radiusKm },
  });
  return response.data;
};

/**
 * 지역별 도서관 검색 (정보나루 API 연동)
 *
 * @param region - 시/도 (예: '서울', '경기')
 * @param dtlRegion - 시/군/구 (예: '강남구', '수원시')
 * @param libraryName - 도서관 이름 (선택적, 검색 후 필터링용)
 * @param pageNo - 페이지 번호 (기본 1)
 * @param pageSize - 페이지 크기 (기본 100)
 * @returns 도서관 목록
 *
 * @example
 * const libraries = await searchLibrariesByRegion('서울', '강남구');
 */
export const searchLibrariesByRegion = async (
  region: string,
  dtlRegion: string,
  libraryName?: string,
  pageNo = 1,
  pageSize = 100
): Promise<Library[]> => {
  const response = await api.get<any>("/api/libraries/search-from-api", {
    params: { region, dtl_region: dtlRegion, pageNo, pageSize },
  });

  // 정보나루 API 응답 구조 파싱
  const libs = response.data?.response?.libs || [];

  let libraries: Library[] = libs.map((item: any) => {
    const lib = item.lib;
    return {
      id: String(lib.libCode),
      name: lib.libName,
      address: lib.address,
      phone: lib.tel,
      homepage: lib.homepage,
      latitude: lib.latitude ? parseFloat(lib.latitude) : undefined,
      longitude: lib.longitude ? parseFloat(lib.longitude) : undefined,
    };
  });

  // 도서관 이름으로 필터링 (선택적)
  if (libraryName && libraryName.trim()) {
    const query = libraryName.trim().toLowerCase();
    libraries = libraries.filter((lib) =>
      lib.name.toLowerCase().includes(query)
    );
  }

  return libraries;
};
