import { useState } from 'react';
import { recordAnonymousEvent, type AnonymousEvent, type SupportedLangCode } from '../kbridge';
import { ADMISSION_TERMS } from '../data/admissionsData';
import { gapUi } from '../i18n/gapUi';
import { shareOrCopy } from '../share/parentShare';
import {
  WEEKLY_DID_SERIES,
  computeDidEffect,
  computeDistrictFunnels,
  computeStudentSignalSummary,
  computeTermBottlenecks,
} from '../data/syntheticAnalytics';

export interface AnalyticsTabProps {
  lang: SupportedLangCode;
  liveEvents: AnonymousEvent[];
  onEventLogged: () => void;
}

export function AnalyticsTab({ lang, liveEvents, onEventLogged }: AnalyticsTabProps) {
  const [regionFilter, setRegionFilter] = useState<'all' | 'south' | 'central'>('all');
  const [appliedInterventions, setAppliedInterventions] = useState<string[]>(() =>
    Array.from(
      new Set(
        liveEvents
          .filter((ev) => ev.kind === 'intervention_applied' && ev.choiceCode)
          .map((ev) => ev.choiceCode as string),
      ),
    ),
  );

  const gap = gapUi(lang);
  const termRows = computeTermBottlenecks(liveEvents);
  const allFunnelRows = computeDistrictFunnels(liveEvents);
  const funnelRows = allFunnelRows.filter((row) => {
    if (regionFilter === 'south') return ['구로구', '영등포구', '금천구'].includes(row.district);
    if (regionFilter === 'central') return !['구로구', '영등포구', '금천구'].includes(row.district);
    return true;
  });
  const did = computeDidEffect();
  const signals = computeStudentSignalSummary(liveEvents);

  const handleApplyIntervention = (termId: string) => {
    if (appliedInterventions.includes(termId)) return;
    setAppliedInterventions((prev) => [...prev, termId]);
    recordAnonymousEvent('kvisa-path.events', {
      app: 'kvisa-path',
      opportunityId: `intervention-${termId}`,
      kind: 'intervention_applied',
      lang,
      choiceCode: termId,
    });
    onEventLogged();
  };

  const topTerm = termRows[0];
  const validFunnels = funnelRows.filter((r) => !r.masked);
  const totalEp = validFunnels.reduce((s, r) => s + r.episodes, 0);
  const totalConn = validFunnels.reduce((s, r) => s + r.connected7d, 0);
  const overall7dRate = totalEp > 0 ? Math.round((totalConn / totalEp) * 100) : 0;

  // SVG DiD 차트 좌표 계산
  const chartW = 640;
  const chartH = 220;
  const padL = 44;
  const padR = 20;
  const padT = 18;
  const padB = 34;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;

  const toX = (week: number) => padL + ((week - 1) / 11) * plotW;
  const toY = (pct: number) => padT + ((100 - pct) / 100) * plotH;

  const earlyPath = WEEKLY_DID_SERIES.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.week).toFixed(1)} ${toY(p.earlyAccuracy).toFixed(1)}`,
  ).join(' ');
  const latePath = WEEKLY_DID_SERIES.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.week).toFixed(1)} ${toY(p.lateAccuracy).toFixed(1)}`,
  ).join(' ');
  const respPath = WEEKLY_DID_SERIES.map(
    (p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.week).toFixed(1)} ${toY(p.responseRate).toFixed(1)}`,
  ).join(' ');

  return (
    <div className="kb-stack">
      <div className="kv-notice-box" role="note">
        <strong>{gap.counselorNotice}</strong> {gap.exampleFigure}. {liveEvents.length}
      </div>

      {/* KPI 4개 */}
      <section className="kv-grid-4">
        <div className="kb-card">
          <p className="kv-kpi-label">최다 병목 입시 용어 1위</p>
          <p className="kv-kpi-value" style={{ fontSize: 18 }}>
            {topTerm.term}
          </p>
          <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
            평활화 병목률 {(topTerm.smoothedRate * 100).toFixed(1)}% ({topTerm.selectedUsers}/{topTerm.validRespondents})
          </p>
        </div>

        <div className="kb-card">
          <p className="kv-kpi-label">개입 DiD 효과 <span className="kb-tag">가상·예시</span></p>
          <p className="kv-kpi-value">+{did.didEstimate}%p</p>
          <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
            조기군 +{did.earlyDiff}%p vs 지연군 +{did.lateDiff}%p (6~8주 비교)
          </p>
        </div>

        <div className="kb-card">
          <p className="kv-kpi-label">7일 상담 연결확인율</p>
          <p className="kv-kpi-value">{overall7dRate}%</p>
          <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
            공개 기준(10명+) 통과 {validFunnels.length}개 셀 집계
          </p>
        </div>

        <div className="kb-card">
          <p className="kv-kpi-label">진로정보 격차 지수(CIGI)</p>
          <p className="kv-kpi-value">0.38</p>
          <p className="kb-subtitle" style={{ margin: '4px 0 0' }}>
            0.38 · 71.6% · 44.4% — {gap.exampleFigure}
          </p>
        </div>
      </section>

      {/* 표 1: 비정형 입시 용어 병목 랭킹 */}
      <section className="kb-section">
        <h2 className="kb-section-title">1. 입시·서류 비정형 용어 병목 우선순위 (평활화 병목률 p̃)</h2>
        <p className="kb-subtitle" style={{ marginBottom: 12 }}>
          1번 탭에서 <strong>? 용어 버튼</strong>을 누르면 아래 표의 실시간 추가 건수와 병목률이 즉시 갱신돼요.
          (문자 2~4그램 TF-IDF 군집 매핑, p₀=0.22)
        </p>
        <div className="kb-card kv-table-wrap">
          <table className="kv-table">
            <thead>
              <tr>
                <th>입시 용어</th>
                <th>TF-IDF 주제 군집</th>
                <th className="num">선택/유효응답 (x/n)</th>
                <th className="num">응답률</th>
                <th className="num">평활화 병목률</th>
                <th className="num">예상 영향 인원</th>
                <th>교사 개입 시뮬레이션</th>
              </tr>
            </thead>
            <tbody>
              {termRows.map((row) => {
                const respPct = Math.round((row.validRespondents / row.assignedOpportunities) * 100);
                const isIntervened = appliedInterventions.includes(row.termId);
                const projectedRate = Math.max(0.05, row.smoothedRate - did.didEstimate / 100);
                const savedStudents = Math.max(
                  1,
                  row.expectedAffected - Math.round(180 * projectedRate),
                );
                return (
                  <tr key={row.termId}>
                    <td>
                      <strong>{row.term}</strong>
                      {row.liveAddedCount > 0 ? (
                        <span className="kb-tag" style={{ marginLeft: 6 }}>
                          실시간 +{row.liveAddedCount}
                        </span>
                      ) : null}
                    </td>
                    <td>{row.cluster}</td>
                    <td className="num">
                      {row.selectedUsers}/{row.validRespondents}
                    </td>
                    <td className="num">{respPct}%</td>
                    <td className="num">
                      <strong>{(row.smoothedRate * 100).toFixed(1)}%</strong>
                    </td>
                    <td className="num">{row.expectedAffected}명</td>
                    <td>
                      {isIntervened ? (
                        <span className="kb-tag kb-status-safe">
                          개입 적용됨 (예상 -{savedStudents}명 감소)
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="kv-term-btn"
                          onClick={() => {
                            handleApplyIntervention(row.termId);
                            const term = ADMISSION_TERMS[row.termId];
                            const text = term ? `${term.term}\n${term.easyKo}` : row.term;
                            void shareOrCopy(text);
                          }}
                        >
                          {gap.shareCard}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 차트 2: 조기·지연 도입 학급 DiD 전후 검증 */}
      <section className="kb-section">
        <h2 className="kb-section-title">2. 이해도 변화 예시 (DiD) <span className="kb-tag kb-status-check">가상·예시 데이터</span></h2>
        <p className="kb-subtitle" style={{ marginBottom: 12 }}>
          6주차에 조기 도입한 학급(실선)과 9주차에 지연 도입한 학급(점선)의 전형 이해 정답률을 비교해요.
          4·8주차 시험주간의 응답률 하락(회색 점선)을 정답률과 분리해 선택 편향을 통제했어요.
        </p>
        <div className="kb-card">
          <svg
            className="kv-chart-svg"
            viewBox={`0 0 ${chartW} ${chartH}`}
            role="img"
            aria-label="1주차부터 12주차까지 조기 도입 학급과 지연 도입 학급의 전형 이해 정답률 및 응답률 추이"
          >
            {[0, 25, 50, 75, 100].map((v) => (
              <g key={v}>
                <line
                  x1={padL}
                  y1={toY(v)}
                  x2={chartW - padR}
                  y2={toY(v)}
                  stroke="var(--kb-line)"
                  strokeWidth="1"
                />
                <text x={padL - 8} y={toY(v) + 4} textAnchor="end" fontSize="11" fill="var(--kb-muted)">
                  {v}%
                </text>
              </g>
            ))}

            {/* 6주차·9주차 개입 도입 세로선 */}
            <line
              x1={toX(6)}
              y1={padT}
              x2={toX(6)}
              y2={chartH - padB}
              stroke="var(--kb-primary)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text x={toX(6) + 4} y={padT + 12} fontSize="11" fill="var(--kb-primary)">
              6주 조기도입
            </text>

            <line
              x1={toX(9)}
              y1={padT}
              x2={toX(9)}
              y2={chartH - padB}
              stroke="var(--kb-safe)"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />
            <text x={toX(9) + 4} y={padT + 12} fontSize="11" fill="var(--kb-safe)">
              9주 지연도입
            </text>

            {/* 응답률(회색) · 지연군(초록 점선) · 조기군(파랑 실선) */}
            <path d={respPath} fill="none" stroke="var(--kb-muted)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d={latePath} fill="none" stroke="var(--kb-safe)" strokeWidth="2.5" strokeDasharray="6 3" />
            <path d={earlyPath} fill="none" stroke="var(--kb-primary)" strokeWidth="2.5" />

            {WEEKLY_DID_SERIES.map((p) => (
              <text
                key={p.week}
                x={toX(p.week)}
                y={chartH - 12}
                textAnchor="middle"
                fontSize="11"
                fill="var(--kb-muted)"
              >
                {p.week}주
              </text>
            ))}
          </svg>
          <div className="kb-row" style={{ marginTop: 10 }}>
            <span className="kb-tag">실선: 조기 도입 학급(6주)</span>
            <span className="kb-tag">점선: 지연 도입 학급(9주)</span>
            <span className="kb-tag">회색 점선: 전체 응답률(4·8주 시험주간)</span>
          </div>
        </div>
      </section>

      {/* 표 3: 서울시교육청 자치구 × 언어권 7일 상담 연결 퍼널 (k-익명성 마스킹) */}
      <section className="kb-section">
        <div className="kb-row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h2 className="kb-section-title" style={{ margin: 0 }}>
            3. 서울시교육청 환류: 자치구×언어권 7일 상담 연결 퍼널
          </h2>
          <div className="kb-row">
            <button
              type="button"
              className="kv-term-btn"
              aria-pressed={regionFilter === 'all'}
              onClick={() => setRegionFilter('all')}
            >
              서울 전체
            </button>
            <button
              type="button"
              className="kv-term-btn"
              aria-pressed={regionFilter === 'south'}
              onClick={() => setRegionFilter('south')}
            >
              남부 3구 거점(구로·영등포·금천)
            </button>
            <button
              type="button"
              className="kv-term-btn"
              aria-pressed={regionFilter === 'central'}
              onClick={() => setRegionFilter('central')}
            >
              중부·기타권(용산·동대문·관악)
            </button>
          </div>
        </div>
        <p className="kb-subtitle" style={{ marginBottom: 12 }}>
          관찰 완료 에피소드 기준 <strong>연결 실패 보고</strong>와 <strong>후속 미응답</strong>을 분리해요.
          고유 응답자 10명 미만 셀은 k-익명성 보호를 위해 자동 마스킹돼요.
        </p>
        <div className="kb-card kv-table-wrap">
          <table className="kv-table">
            <thead>
              <tr>
                <th>자치구</th>
                <th>요청 언어</th>
                <th className="num">필요 표시</th>
                <th className="num">연락 시도</th>
                <th className="num">7일 연결됨</th>
                <th className="num">실패 보고</th>
                <th className="num">후속 미응답</th>
                <th className="num">7일 연결율</th>
                <th>주요 중단 원인 · 통역 배치</th>
              </tr>
            </thead>
            <tbody>
              {funnelRows.map((r) => (
                <tr key={`${r.district}-${r.langLabel}`}>
                  <td>
                    <strong>{r.district}</strong>
                  </td>
                  <td>{r.langLabel}</td>
                  <td className="num">{r.masked ? '-' : r.episodes}</td>
                  <td className="num">{r.masked ? '-' : r.contactTried}</td>
                  <td className="num">{r.masked ? '-' : r.connected7d}</td>
                  <td className="num">{r.masked ? '-' : r.failedReported}</td>
                  <td className="num">{r.masked ? '-' : r.noFollowup}</td>
                  <td className="num">
                    <strong>{r.rateDisplay}</strong>
                  </td>
                  <td>
                    {r.mainDropReason} ({r.interpreterNote})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 섹션 4: 서류 장애 사유 · 비정형 질문 토픽 · 실측 퀴즈 정답률 */}
      <section className="kb-section">
        <h2 className="kb-section-title">4. 서류 준비 장애 사유 · 비정형 질문 토픽 · 퀴즈 실측</h2>
        <p className="kb-subtitle" style={{ marginBottom: 12 }}>
          2번 탭(서류 · 퀴즈 · 질문)에서 입력한 실시간 학생 데이터가 아래 집계에 즉시 반영돼요.
        </p>
        <div className="kv-grid-2">
          <div className="kb-card kv-table-wrap">
            <strong style={{ fontSize: 14 }}>입시 서류 준비 장애 사유 (정형)</strong>
            <table className="kv-table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>장애 사유</th>
                  <th className="num">누적 건수</th>
                </tr>
              </thead>
              <tbody>
                {signals.docBarriers.map((item) => (
                  <tr key={item.reason}>
                    <td>
                      {item.reason}
                      {item.liveAdded > 0 ? (
                        <span className="kb-tag" style={{ marginLeft: 6 }}>
                          실시간 +{item.liveAdded}
                        </span>
                      ) : null}
                    </td>
                    <td className="num">
                      <strong>{item.count}건</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="kb-card kv-table-wrap">
            <strong style={{ fontSize: 14 }}>자유 질문 토픽 분포 (비정형 텍스트)</strong>
            <table className="kv-table" style={{ marginTop: 8 }}>
              <thead>
                <tr>
                  <th>분류 토픽</th>
                  <th className="num">질문 건수</th>
                </tr>
              </thead>
              <tbody>
                {signals.questionTopics.map((item) => (
                  <tr key={item.topic}>
                    <td>
                      {item.topic}
                      {item.liveAdded > 0 ? (
                        <span className="kb-tag" style={{ marginLeft: 6 }}>
                          실시간 +{item.liveAdded}
                        </span>
                      ) : null}
                    </td>
                    <td className="num">
                      <strong>{item.count}건</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="kb-card-soft" style={{ marginTop: 12 }}>
          <strong style={{ fontSize: 14 }}>현재 세션 1분 O/X 퀴즈 실측 최초 정답률: </strong>
          {signals.quizTotal === 0 ? (
            <span>아직 풀이 기록이 없어요. 2번 탭에서 퀴즈를 풀면 실측값이 표시돼요.</span>
          ) : (
            <span>
              <strong>
                {signals.quizAccuracyPct}% ({signals.quizCorrect}/{signals.quizTotal}문항 정답)
              </strong>
            </span>
          )}
        </div>
      </section>
    </div>
  );
}
