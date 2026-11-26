import {
  ADMISSION_TRACKS,
  SEOUL_VOCATIONAL_SCHOOLS,
  type AdmissionTrack,
  type BackgroundType,
  type InterestField,
  type KoreanLevel,
  type SchoolLevel,
  type SeoulVocationalSchool,
} from './admissionsData';

export function filterAdmissionTracks(
  level: SchoolLevel,
  background: BackgroundType,
  koreanLevel: KoreanLevel,
  tracks: readonly AdmissionTrack[] = ADMISSION_TRACKS,
): { matched: AdmissionTrack[]; gaps: AdmissionTrack[] } {
  const levelTracks = tracks.filter((track) => track.level === level && track.eligibleBackgrounds.includes(background));
  return {
    matched: levelTracks.filter((track) => track.minKorean.includes(koreanLevel)),
    gaps: levelTracks.filter((track) => !track.minKorean.includes(koreanLevel)),
  };
}

export function filterVocationalSchools(
  field: InterestField,
  query: string,
  schools: readonly SeoulVocationalSchool[] = SEOUL_VOCATIONAL_SCHOOLS,
): SeoulVocationalSchool[] {
  const q = query.trim().toLowerCase();
  return schools.filter((school) => {
    if (!q && school.field !== field) return false;
    if (!q) return true;
    return (
      school.name.toLowerCase().includes(q) ||
      school.district.toLowerCase().includes(q) ||
      school.majors.some((major) => major.toLowerCase().includes(q)) ||
      school.neisCode.includes(q)
    );
  });
}
