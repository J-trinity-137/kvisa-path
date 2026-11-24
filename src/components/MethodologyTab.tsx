import { useState } from 'react';
import type { AnonymousEvent } from 'kbridge-core';
import { VALIDATION_SUMMARY, computeDistrictFunnels, computeTermBottlenecks } from '../data/syntheticAnalytics';

export interface MethodologyTabProps {
  neisApiKey: string;
  onNeisApiKeyChange: (key: string) => void;
  liveEvents: AnonymousEvent[];
  onClearEvents: () => void;
}

export function MethodologyTab({
  neisApiKey,
  onNeisApiKeyChange,
  liveEvents,
  onClearEvents,
}: MethodologyTabProps) {
  const [draftKey, setDraftKey] = useState(neisApiKey);
  const [exportedMsg, setExportedMsg] = useState<string | null>(null);

  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      validation: VALIDATION_SUMMARY,
      termBottlenecks: computeTermBottlenecks(liveEvents),
      districtFunnels: computeDistrictFunnels(liveEvents),
      liveEventCount: liveEvents.length,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kvisa-path-analytics-report.json';
    a.click();
    URL.revokeObjectURL(url);
    setExportedMsg('기말과제 첨부용 분석 리포트 JSON 파일을 내려받았어요.');
  };

  const handleExportCsv = () => {
    const rows = computeTermBottlenecks(liveEvents);
    const header = 'term_id,term,cluster,selected_users,valid_respondents,smoothed_rate,expected_affected,live_added';
    const lines = rows.map(
      (r) =>
        `${r.termId},"${r.term}","${r.cluster}",${r.selectedUsers},${r.validRespondents},${r.smoothedRate.toFixed(4)},${r.expectedAffected},${r.liveAddedCount}`,
    );
    const csv = `\uFEFF${[header, ...lines].join('\n')}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kvisa-path-term-bottlenecks.csv';
    a.click();
    URL.revokeObjectURL(url);
    setExportedMsg('엑셀·파이썬용 입시 용어 병목 CSV 파일을 내려받았어요.');
  };

  return (
    <div className="kb-stack">
      <section className="kb-section" style={{ marginTop: 12 }}>
        <h2 className="kb-section-title">1. NEIS 실시간 API 키 연동 설정 (선택)</h2>
        <div className="kb-card kb-stack">
          <div>
            <label htmlFor="neis-key-input" className="kv-label">
              나이스(NEIS) 교육정보 개방 포털 인증키
            </label>
            <p className="kb-subtitle" style={{ margin: '0 0 8px' }}>
              인증키를 입력하면 1번 탭에서 서울 특성화고 개설 학과(schoolMajorinfo)를 실시간으로 조회해요.
              키가 없어도 2026 서울 특성화고 스냅샷으로 정상 동작해요.
            </p>
            <input
              id="neis-key-input"
              type="password"
              className="kv-input"
              value={draftKey}
              onChange={(e) => setDraftKey(e.target.value)}
              placeholder="발급받은 NEIS 인증키 입력 (브라우저 메모리에만 유지)"
            />
          </div>
          <div className="kb-row">
            <button type="button" className="kb-chip" onClick={() => onNeisApiKeyChange(draftKey)}>
              인증키 적용하기
            </button>
            <button
              type="button"
              className="kb-chip"
              onClick={() => {
                setDraftKey('');
                onNeisApiKeyChange('');
              }}
            >
              스냅샷 모드로 전환
            </button>
          </div>
        </div>
      </section>

      <section className="kb-section">
        <h2 className="kb-section-title">2. 합성 데이터 생성기 검증 결과 (Python 배치 기준)</h2>
        <div className="kv-grid-4">
          <div className="kb-card">
            <p className="kv-kpi-label">가상학교 · 학생 규모</p>
            <p className="kv-kpi-value">
              {VALIDATION_SUMMARY.virtualSchools}개교 · {VALIDATION_SUMMARY.virtualStudents}명
            </p>
          </div>
          <div className="kb-card">
            <p className="kv-kpi-label">12주 응답 기회(opportunity)</p>
            <p className="kv-kpi-value">{VALIDATION_SUMMARY.totalOpportunities.toLocaleString()}건</p>
          </div>
          <div className="kb-card">
            <p className="kv-kpi-label">효과 회수율 / Null 오경보율</p>
            <p className="kv-kpi-value">
              {VALIDATION_SUMMARY.effectRecoveryRate}% / {VALIDATION_SUMMARY.nullFalseAlarmRate}%
            </p>
          </div>
          <div className="kb-card">
            <p className="kv-kpi-label">TF-IDF 구절 분류 macro-F1</p>
            <p className="kv-kpi-value">{VALIDATION_SUMMARY.tfidfMacroF1}</p>
          </div>
        </div>
      </section>

      <section className="kb-section">
        <h2 className="kb-section-title">3. 미등록 아동 보호 및 개인정보 법령 준수 설계</h2>
        <div className="kb-card">
          <ul className="kv-list" style={{ marginTop: 0 }}>
            <li>
              <strong>식별자·체류자격 비저장(Zero-Tracking):</strong> 외국인등록번호, 실명, 주소, 비자 유형은 DB에 저장하지 않고 브라우저 메모리에서만 경로를 계산해요.
            </li>
            <li>
              <strong>출입국관리법 제84조·초·중등교육법 시행령 제19조:</strong> 미등록 아동도 거주사실 확인으로 공교육 입학이 보장되며, 학교 교직원의 통보 의무가 면제됨을 명시해요.
            </li>
            <li>
              <strong>개인정보보호법 제22조의2:</strong> 만 14세 미만 아동 대상 고지는 21개 언어 및 쉬운 한국어로 제공해요.
            </li>
            <li>
              <strong>k-익명성 마스킹:</strong> 교육청·교사 집계 화면에서 고유 응답자 10명 미만 셀(예: 관악구 태국어 7명)은 수치를 자동 마스킹해 역추적을 차단해요.
            </li>
          </ul>
        </div>
      </section>

      <section className="kb-section">
        <h2 className="kb-section-title">4. 기말과제 제출용 리포트 내보내기</h2>
        <div className="kb-card kb-stack">
          <p style={{ margin: 0, fontSize: 14 }}>
            현재 세션에서 기록된 실시간 익명 이벤트: <strong>{liveEvents.length}건</strong>
          </p>
          <div className="kb-row">
            <button type="button" className="kb-chip" onClick={handleExportJson}>
              분석 리포트 JSON 내려받기
            </button>
            <button type="button" className="kb-chip" onClick={handleExportCsv}>
              병목 데이터 CSV 내려받기
            </button>
            <button type="button" className="kb-chip" onClick={onClearEvents}>
              실시간 세션 로그 초기화
            </button>
          </div>
          {exportedMsg ? <p className="kb-subtitle" style={{ margin: 0 }}>{exportedMsg}</p> : null}
        </div>
      </section>
    </div>
  );
}
