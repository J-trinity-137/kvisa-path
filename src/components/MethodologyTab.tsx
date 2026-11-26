import { useState } from 'react';
import type { AnonymousEvent, SupportedLangCode } from '../kbridge';
import { gapUi } from '../i18n/gapUi';
import { VALIDATION_SUMMARY, computeDistrictFunnels, computeTermBottlenecks } from '../data/syntheticAnalytics';

export interface MethodologyTabProps {
  lang: SupportedLangCode;
  liveEvents: AnonymousEvent[];
  onClearEvents: () => void;
}

export function MethodologyTab({
  lang,
  liveEvents,
  onClearEvents,
}: MethodologyTabProps) {
  const gap = gapUi(lang);
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
        <h2 className="kb-section-title">1. 학교 정보 출처</h2>
        <div className="kb-card kb-stack">
          <p style={{ margin: 0, fontSize: 14 }}>
            학생 화면은 NEIS 인증키를 받지 않아요. 학교코드는 2026-11-26에 NEIS schoolInfo로 확인한 스냅샷이고, 학과명은 서울시교육청 특성화고·마이스터고 안내(문서상 2025학년도)를 따릅니다.
          </p>
          <p className="kb-subtitle" style={{ margin: 0 }}>
            커리어넷 Open API와 서울열린데이터광장 OA-21713은 이 앱에서 호출하지 않아요. 직업·학과 예시는 앱 안의 고정 목록입니다.
          </p>
        </div>
      </section>

      <section className="kb-section">
        <h2 className="kb-section-title">2. 합성 데이터 검증 결과 <span className="kb-tag kb-status-check">가상·예시 데이터</span></h2>
        <p className="kb-subtitle">
          {gap.counselorNotice} {gap.exampleFigure}. TF-IDF macro-F1 {VALIDATION_SUMMARY.tfidfMacroF1}.
        </p>
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
              <strong>개인정보:</strong> 질문 원문과 체류자격은 저장하지 않아요. 학생 화면의 ‘이 기기의 기록 지우기’로 이 브라우저의 선택 기록을 지울 수 있어요. 화면 언어는 내용이 준비된 8개입니다.
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
