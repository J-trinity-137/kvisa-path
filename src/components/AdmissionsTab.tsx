import { useEffect, useState } from 'react';
import {
  SpeakCard,
  recordAnonymousEvent,
  type SupportedLangCode,
} from 'kbridge-core';
import {
  ADMISSION_TERMS,
  ADMISSION_TRACKS,
  APOSTILLE_COUNTRIES,
  EXTERNAL_SCHOLARSHIPS,
  SEOUL_VOCATIONAL_SCHOOLS,
  UNIVERSITY_TOPIK_TABLE,
  VISA_SKILL_TREE,
  type BackgroundType,
  type InterestField,
  type KoreanLevel,
  type SchoolLevel,
} from '../data/admissionsData';
import { SEOUL_DISTRICTS, SEOUL_SUPPORT_CENTERS } from '../data/centersData';
import { getUiMessages } from '../i18n/messages';
import { fetchSeoulVocationalMajors, type NeisSchoolQueryResult } from '../services/neisClient';

export interface AdmissionsTabProps {
  lang: SupportedLangCode;
  neisApiKey: string;
  onEventLogged: () => void;
}

const BACKGROUND_OPTIONS: { value: BackgroundType; label: string }[] = [
  { value: 'both_foreign', label: '부모 모두 외국인' },
  { value: 'multicultural', label: '국제결혼·다문화' },
  { value: 'mid_entry', label: '중도입국(해외 수학)' },
  { value: 'undocumented', label: '미등록·체류 미확인' },
];

const KOREAN_OPTIONS: { value: KoreanLevel; label: string }[] = [
  { value: 'beginner', label: '초급·TOPIK 미보유' },
  { value: 'topik_3_4', label: '중급(TOPIK 3~4급)' },
  { value: 'topik_5_6', label: '고급(TOPIK 5~6급)' },
];

const FIELD_OPTIONS: { value: InterestField; label: string }[] = [
  { value: 'it', label: 'IT·SW' },
  { value: 'culinary', label: '조리·관광' },
  { value: 'design', label: '디자인' },
  { value: 'business', label: '경영·무역' },
  { value: 'health', label: '보건·간호' },
];

export function AdmissionsTab({ lang, neisApiKey, onEventLogged }: AdmissionsTabProps) {
  const [schoolLevel, setSchoolLevel] = useState<SchoolLevel>('high');
  const [background, setBackground] = useState<BackgroundType>('both_foreign');
  const [koreanLevel, setKoreanLevel] = useState<KoreanLevel>('topik_3_4');
  const [field, setField] = useState<InterestField>('it');
  const [district, setDistrict] = useState<string>(SEOUL_DISTRICTS[0]);
  const [originCountry, setOriginCountry] = useState<string>('VN');
  const [schoolSearch, setSchoolSearch] = useState<string>('');

  const [activeTermId, setActiveTermId] = useState<string | null>(null);
  const [neisResult, setNeisResult] = useState<NeisSchoolQueryResult | null>(null);
  const [referralFeedback, setReferralFeedback] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void fetchSeoulVocationalMajors(field, neisApiKey).then((res) => {
      if (active) setNeisResult(res);
    });
    return () => {
      active = false;
    };
  }, [field, neisApiKey]);

  const levelTracks = ADMISSION_TRACKS.filter(
    (track) => track.level === schoolLevel && track.eligibleBackgrounds.includes(background),
  );
  const matchedTracks = levelTracks.filter((track) => track.minKorean.includes(koreanLevel));
  const gapTracks = levelTracks.filter((track) => !track.minKorean.includes(koreanLevel));

  const query = schoolSearch.trim().toLowerCase();
  const baseVocationalSchools =
    neisResult?.source === 'live_neis'
      ? neisResult.schools
      : SEOUL_VOCATIONAL_SCHOOLS.filter((s) => (query ? true : s.field === field));
  const filteredVocationalSchools = baseVocationalSchools.filter(
    (s) =>
      !query ||
      s.name.toLowerCase().includes(query) ||
      s.district.toLowerCase().includes(query) ||
      s.majors.some((m) => m.toLowerCase().includes(query)),
  );

  const filteredUniversities = UNIVERSITY_TOPIK_TABLE.filter(
    (u) =>
      !query ||
      u.university.toLowerCase().includes(query) ||
      u.note.toLowerCase().includes(query) ||
      u.vocationalTrack.toLowerCase().includes(query),
  );

  const matchedScholarships = EXTERNAL_SCHOLARSHIPS.filter((s) =>
    s.eligibleBackgrounds.includes(background),
  );

  const visaTree = VISA_SKILL_TREE[background];
  const center = SEOUL_SUPPORT_CENTERS.find((c) => c.district === district) ?? SEOUL_SUPPORT_CENTERS[0];
  const interpreterCount = center.interpreters[lang];
  const apostilleRule = APOSTILLE_COUNTRIES.find((c) => c.code === originCountry) ?? APOSTILLE_COUNTRIES[0];

  const handleTermHelpClick = (termId: string) => {
    setActiveTermId(termId);
    recordAnonymousEvent('kvisa-path.events', {
      app: 'kvisa-path',
      opportunityId: `admission-${schoolLevel}-2026`,
      kind: 'term_confused',
      lang,
      choiceCode: termId,
    });
    onEventLogged();
  };

  const handleReferralStep = (kind: 'referral_opened' | 'referral_connected' | 'referral_failed', msg: string) => {
    recordAnonymousEvent('kvisa-path.events', {
      app: 'kvisa-path',
      opportunityId: `referral-${district}`,
      kind,
      lang,
      spanText: district,
    });
    setReferralFeedback(msg);
    onEventLogged();
  };

  const activeTerm = activeTermId ? ADMISSION_TERMS[activeTermId] : null;
  const activeTermTranslation = activeTerm
    ? activeTerm.translations[lang] ?? activeTerm.translations.en ?? ''
    : '';
  const ui = getUiMessages(lang);

  return (
    <div className="kb-stack">
      <div className="kv-notice-box kb-row" style={{ justifyContent: 'space-between' }} role="note">
        <span>
          <strong>{ui.statelessNoticeTitle}</strong> {ui.statelessNoticeBody}
        </span>
        <button
          type="button"
          className="kv-term-btn kv-no-print"
          onClick={() => {
            if (typeof window !== 'undefined') window.print();
          }}
        >
          {ui.printSummaryBtn}
        </button>
      </div>

      {/* 1. 조건 선택 */}
      <section className="kb-section" style={{ marginTop: 12 }}>
        <h2 className="kb-section-title">1. 내 조건 선택하기 (4단계)</h2>
        <div className="kb-card kb-stack">
          <div>
            <span className="kv-label">현재 학교급</span>
            <div className="kb-row">
              <button
                type="button"
                className="kb-chip"
                aria-pressed={schoolLevel === 'middle'}
                onClick={() => setSchoolLevel('middle')}
              >
                중학생 (고교 입학전형)
              </button>
              <button
                type="button"
                className="kb-chip"
                aria-pressed={schoolLevel === 'high'}
                onClick={() => setSchoolLevel('high')}
              >
                고등학생 (대학 입학전형 · TOPIK 장학)
              </button>
            </div>
          </div>

          <div>
            <span className="kv-label">가정·학력 배경 (서버 미저장)</span>
            <div className="kb-row">
              {BACKGROUND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="kb-chip"
                  aria-pressed={background === opt.value}
                  onClick={() => setBackground(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="kv-label">한국어 수준</span>
            <div className="kb-row">
              {KOREAN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="kb-chip"
                  aria-pressed={koreanLevel === opt.value}
                  onClick={() => setKoreanLevel(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="kv-label">관심 계열 (NEIS·커리어넷 연계)</span>
            <div className="kb-row">
              {FIELD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="kb-chip"
                  aria-pressed={field === opt.value}
                  onClick={() => setField(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pre-flight 치명적 함정 경고 */}
      {(background === 'both_foreign' || background === 'mid_entry') ? (
        <div className="kb-card" style={{ borderColor: 'var(--kb-avoid)' }} role="alert">
          <div className="kb-row" style={{ justifyContent: 'space-between' }}>
            <strong style={{ color: 'var(--kb-avoid)' }}>사전 경고: 입시·비자 3대 함정 체크</strong>
            <span className="kb-tag kb-status-avoid">필독</span>
          </div>
          <ul className="kv-list">
            <li>
              <strong>검정고시 함정:</strong> 외국 국적 학생이 검정고시를 선택하면 서울시립대·서울과기대·한국외대 등 주요 대학 순수외국인 전형 지원 자격이 박탈돼요.
            </li>
            <li>
              <strong>마이스터고 대입 제외:</strong> 마이스터고 졸업생은 대입 정원 외 특성화고교 졸업자 특별전형에 지원할 수 없어요.
            </li>
            <li>
              <strong>고교생 알바 금지 &amp; 사설환전소 주의:</strong> F-1·F-3·D-4-3 고교생은 알바가 원칙 금지되며, 등록금은 반드시 대학 공식 은행 가상계좌로 납부하세요.
            </li>
          </ul>
        </div>
      ) : null}

      {/* 2. 지원 가능 입학전형 조회 결과 + Gap 진단 */}
      <section className="kb-section">
        <h2 className="kb-section-title">
          2. 지원 가능한 {schoolLevel === 'middle' ? '고교 입학전형' : '대학 특별전형'} ({matchedTracks.length}건)
        </h2>

        {matchedTracks.length > 0 ? (
          <div className="kb-stack">
            {matchedTracks.map((track) => (
              <article key={track.id} className="kb-card kb-stack">
                <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: 16 }}>{track.title}</strong>
                  <span className="kb-tag">
                    {track.quotaType} · {track.asOfYear}
                  </span>
                </div>
                <p style={{ margin: 0 }}>{track.summary}</p>
                <p className="kb-subtitle" style={{ margin: 0 }}>
                  근거: {track.legalBasis}
                </p>

                <div className="kv-grid-2">
                  <div className="kb-card-soft">
                    <strong style={{ fontSize: 13 }}>주요 지원 자격</strong>
                    <ul className="kv-list">
                      {track.requirements.map((req) => (
                        <li key={req}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="kb-card-soft">
                    <strong style={{ fontSize: 13 }}>필요 서류 체크리스트</strong>
                    <ul className="kv-list">
                      {track.requiredDocs.map((doc) => (
                        <li key={doc}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <span className="kv-label">이해가 어려운 입시 용어를 눌러 보세요 (쉬운 풀이 + 익명 통계 반영)</span>
                  <div className="kb-row">
                    {track.termIds.map((tid) => {
                      const t = ADMISSION_TERMS[tid];
                      if (!t) return null;
                      return (
                        <button
                          key={tid}
                          type="button"
                          className="kv-term-btn"
                          aria-pressed={activeTermId === tid}
                          onClick={() => handleTermHelpClick(tid)}
                        >
                          ? {t.term}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                  <span className="kb-subtitle" style={{ margin: 0 }}>
                    {track.visaNote}
                  </span>
                  <a className="kv-link" href={track.referenceUrl} target="_blank" rel="noreferrer">
                    {track.referenceLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : null}

        {/* 조건 미충족(Gap) 진단 카드 */}
        {gapTracks.length > 0 ? (
          <div className="kb-stack" style={{ marginTop: 12 }}>
            {gapTracks.map((track) => (
              <div key={track.id} className="kb-card-soft kb-stack">
                <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                  <strong>{track.title}</strong>
                  <span className="kb-tag kb-status-check">조건 보완 시 지원 가능</span>
                </div>
                <p style={{ margin: 0, fontSize: 14 }}>
                  <strong>부족한 조건(Gap) 해결 가이드:</strong> {track.gapHint}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {activeTerm ? (
          <div className="kb-card-soft kb-stack" style={{ marginTop: 12 }} role="status">
            <div className="kb-row" style={{ justifyContent: 'space-between' }}>
              <strong>{activeTerm.term}</strong>
              <span className="kb-tag">주제: {activeTerm.cluster}</span>
            </div>
            <p style={{ margin: 0 }}>{activeTerm.easyKo}</p>
            {activeTermTranslation ? (
              <p className="kb-subtitle" style={{ margin: 0 }}>
                {activeTermTranslation}
              </p>
            ) : null}
          </div>
        ) : null}
      </section>

      {/* 3. 서울 특성화고 12개교 / 주요 대학 12개교 TOPIK 장학금 비교 + 검색 */}
      <section className="kb-section">
        <h2 className="kb-section-title">
          3. {schoolLevel === 'middle' ? '서울 특성화고·마이스터고 12개교 조회 (NEIS 연계)' : '서울 주요 대학 12개교 TOPIK 장학금 · 전형 비교 (2026~2027)'}
        </h2>

        <div style={{ marginBottom: 12 }}>
          <label htmlFor="school-search-input" className="kv-label">
            학교명 · 학과 · 키워드 검색
          </label>
          <input
            id="school-search-input"
            type="text"
            className="kv-input"
            value={schoolSearch}
            onChange={(e) => setSchoolSearch(e.target.value)}
            placeholder={
              schoolLevel === 'middle'
                ? '예: 성암국제무역, 관광, 소프트웨어, 마이스터'
                : '예: 숭실대, 건국대, 검정고시, 수시'
            }
          />
        </div>

        {schoolLevel === 'middle' ? (
          <div className="kb-stack">
            <p className="kb-subtitle" style={{ margin: 0 }}>
              {neisResult?.notice ?? '서울 특성화고 학과 정보를 불러오는 중이에요.'} ({neisResult?.asOf ?? '-'})
            </p>
            <div className="kv-grid-2">
              {filteredVocationalSchools.map((s) => (
                <div key={s.neisCode} className="kb-card">
                  <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                    <strong>{s.name}</strong>
                    <span className={`kb-tag ${s.univSpecialEligible ? 'kb-status-safe' : 'kb-status-avoid'}`}>
                      {s.schoolType} · {s.district}
                    </span>
                  </div>
                  <p className="kb-subtitle">{s.specialTrack}</p>
                  <p style={{ margin: '8px 0 0', fontSize: 14 }}>대표 학과: {s.majors.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="kb-stack">
            <div className="kb-card kv-table-wrap">
              <table className="kv-table">
                <thead>
                  <tr>
                    <th>대학</th>
                    <th>검정고시</th>
                    <th className="num">TOPIK 3급</th>
                    <th className="num">4급</th>
                    <th className="num">5급</th>
                    <th className="num">6급</th>
                    <th>특성화고졸 · 비고</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUniversities.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.university}</strong>
                      </td>
                      <td>
                        <span className={`kb-tag ${u.gedAccepted === '불인정' ? 'kb-status-avoid' : ''}`}>
                          {u.gedAccepted}
                        </span>
                      </td>
                      <td className="num">{u.topik3}</td>
                      <td className="num">{u.topik4}</td>
                      <td className="num">
                        <strong>{u.topik5}</strong>
                      </td>
                      <td className="num">
                        <strong>{u.topik6}</strong>
                      </td>
                      <td style={{ fontSize: 13 }}>
                        {u.vocationalTrack} · {u.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="kb-card kb-stack">
              <strong style={{ fontSize: 14 }}>
                내 배경({BACKGROUND_OPTIONS.find((b) => b.value === background)?.label}) 맞춤 외부 장학금 필터
              </strong>
              {matchedScholarships.length === 0 ? (
                <p className="kb-subtitle" style={{ margin: 0 }}>
                  미등록 상태에서는 먼저 구제대책(D-4) 전환 후 장학금 지원 자격을 확인해 보세요.
                </p>
              ) : (
                <div className="kv-grid-2">
                  {matchedScholarships.map((sc) => (
                    <div key={sc.id} className="kb-card-soft">
                      <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                        <strong>{sc.name}</strong>
                        <span className="kb-tag">{sc.asOfYear}</span>
                      </div>
                      <p style={{ margin: '6px 0 0', fontSize: 14 }}>{sc.benefit}</p>
                      <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
                        제외 기준: {sc.excludeRule}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 4. 출신국 해외 서류 인증 (2026.9 아포스티유 vs 영사확인 자동 분기) */}
      <section className="kb-section">
        <h2 className="kb-section-title">4. 해외 학력 서류 인증 판정 (2026년 9월 최신 협약 기준)</h2>
        <div className="kb-card kb-stack">
          <div className="kb-row">
            {APOSTILLE_COUNTRIES.map((c) => (
              <button
                key={c.code}
                type="button"
                className="kv-term-btn"
                aria-pressed={originCountry === c.code}
                onClick={() => setOriginCountry(c.code)}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="kb-card-soft">
            <div className="kb-row" style={{ justifyContent: 'space-between' }}>
              <strong>{apostilleRule.name}</strong>
              <span
                className={`kb-tag ${
                  apostilleRule.status === 'apostille'
                    ? 'kb-status-safe'
                    : apostilleRule.status === 'transition'
                      ? 'kb-status-check'
                      : 'kb-status-avoid'
                }`}
              >
                {apostilleRule.status === 'apostille'
                  ? '아포스티유 적용'
                  : apostilleRule.status === 'transition'
                    ? '전환기 (제출일 확인)'
                    : '영사확인 필수'}
                {' · '}
                {apostilleRule.effectiveDate}
              </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 14 }}>{apostilleRule.guide}</p>
          </div>
        </div>
      </section>

      {/* 5. 체류자격·진로 스킬트리 */}
      <section className="kb-section">
        <h2 className="kb-section-title">5. {visaTree.title}</h2>
        <p className="kb-subtitle" style={{ marginBottom: 12 }}>
          {visaTree.warning}
        </p>
        <div className="kv-grid-2">
          {visaTree.nodes.map((node, idx) => (
            <div key={node.code} className="kb-card">
              <div className="kb-row" style={{ justifyContent: 'space-between' }}>
                <span className="kb-tag">
                  {idx + 1}단계 · {node.stage}
                </span>
                <strong>{node.code}</strong>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: 14 }}>{node.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 자치구 가족센터 통역·상담 연결 + 4단계 퍼널 기록 */}
      <section className="kb-section">
        <h2 className="kb-section-title">6. 우리 구 무료 진로·입시 통역 상담 연결</h2>
        <div className="kb-row" style={{ marginBottom: 12 }}>
          {SEOUL_DISTRICTS.map((d) => (
            <button
              key={d}
              type="button"
              className="kb-chip"
              aria-pressed={district === d}
              onClick={() => {
                setDistrict(d);
                setReferralFeedback(null);
              }}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="kb-card kb-stack">
          <div className="kb-row" style={{ justifyContent: 'space-between' }}>
            <strong>{center.name}</strong>
            <span className="kb-tag">{center.asOfDate}</span>
          </div>
          <p style={{ margin: 0, fontSize: 14 }}>
            대표 전화: <strong>{center.phone}</strong> · 운영: {center.hours}
          </p>
          <p className="kb-subtitle" style={{ margin: 0 }}>
            진로 프로그램: {center.freeCareerProgram}
          </p>
          <p className="kb-subtitle" style={{ margin: 0 }}>
            선택 언어({lang}) 통번역지원사 배치:{' '}
            <strong>
              {interpreterCount === undefined
                ? '공공자료 미제공 (다누리 1577-1366 3자 통역 이용)'
                : interpreterCount === 0
                  ? '배치 0명 (인근 거점센터·다누리 1577-1366 연계 필요)'
                  : `${interpreterCount}명 배치 (실시간 예약 여부는 전화 확인)`}
            </strong>
          </p>

          <div className="kb-row kv-no-print">
            <button
              type="button"
              className="kb-chip"
              onClick={() => handleReferralStep('referral_opened', `${district} 상담 안내 열람을 익명으로 기록했어요.`)}
            >
              상담 필요 표시
            </button>
            <button
              type="button"
              className="kb-chip"
              onClick={() => handleReferralStep('referral_connected', `${district} 7일 내 상담 연결 완료를 기록했어요.`)}
            >
              상담 연결됨
            </button>
            <button
              type="button"
              className="kb-chip"
              onClick={() =>
                handleReferralStep('referral_failed', `${district} 연결 실패(시간·통역 부족)를 교육청 지표에 반영했어요.`)
              }
            >
              연결 안 됨 보고
            </button>
          </div>
          {referralFeedback ? <p className="kb-subtitle" style={{ margin: 0 }}>{referralFeedback}</p> : null}
        </div>
      </section>

      {/* 7. 진로상담실 소통 카드 */}
      <section className="kb-section">
        <h2 className="kb-section-title">7. 진로상담 선생님께 보여 주는 카드</h2>
        <SpeakCard
          caption={ui.speakCardCaption}
          koreanText="제가 지원할 수 있는 고입·대입 특별전형과 필요한 해외 서류 목록을 쉬운 한국어로 알려 주세요."
          nativeText={ui.speakCardNative}
        />
      </section>

      <footer className="kb-subtitle" style={{ marginTop: 12 }}>
        면책 고지: 입학전형·TOPIK 장학금·비자 규정은 매년 변경될 수 있으므로 원서 접수 및 체류 변경 전 반드시 대학 입학처·어디가(adiga.kr)·하이코리아(hikorea.go.kr) 공식 요강을 최종 확인하세요.
      </footer>
    </div>
  );
}
