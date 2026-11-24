"""
kvisa-path 기말과제 발표용 11장 파워포인트(.pptx) 자동 생성 스크립트
실행: python presentation/build_deck.py
출력: presentation/kvisa-path-final-presentation.pptx
"""

from __future__ import annotations

import json
from pathlib import Path
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Inches, Pt

# 하우스 디자인 시스템 팔레트 (kbridge-core 토큰 100% 일치)
C_SURFACE = RGBColor(0xFF, 0xFF, 0xFF)
C_TEXT = RGBColor(0x19, 0x1F, 0x28)
C_MUTED = RGBColor(0x65, 0x6F, 0x7C)
C_LINE = RGBColor(0xE5, 0xE8, 0xEB)
C_SOFT = RGBColor(0xF2, 0xF4, 0xF6)
C_PRIMARY = RGBColor(0x1B, 0x64, 0xDA)
C_SAFE = RGBColor(0x0E, 0x7C, 0x55)
C_AVOID = RGBColor(0xC9, 0x2A, 0x2A)
C_CHECK = RGBColor(0xB2, 0x5E, 0x09)
FONT = "맑은 고딕"


def set_bg(slide, color: RGBColor = C_SURFACE) -> None:
    bg = slide.background
    fill = bg.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_header(slide, section_tag: str, title: str, subtitle: str, page_num: int) -> None:
    # 상단 얇은 포인트 바
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(0.45), Inches(0.45), Inches(0.06))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_PRIMARY
    bar.line.fill.background()

    # 섹션 태그
    tb_tag = slide.shapes.add_textbox(Inches(1.15), Inches(0.35), Inches(5.0), Inches(0.3))
    p = tb_tag.text_frame.paragraphs[0]
    p.text = section_tag
    p.font.name = FONT
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_PRIMARY

    # 페이지 번호
    tb_pg = slide.shapes.add_textbox(Inches(11.8), Inches(0.35), Inches(0.95), Inches(0.3))
    p_pg = tb_pg.text_frame.paragraphs[0]
    p_pg.alignment = PP_ALIGN.RIGHT
    p_pg.text = f"{page_num:02d} / 11"
    p_pg.font.name = FONT
    p_pg.font.size = Pt(10)
    p_pg.font.color.rgb = C_MUTED

    # 제목
    tb_title = slide.shapes.add_textbox(Inches(0.6), Inches(0.7), Inches(12.1), Inches(0.6))
    p_t = tb_title.text_frame.paragraphs[0]
    p_t.text = title
    p_t.font.name = FONT
    p_t.font.size = Pt(24)
    p_t.font.bold = True
    p_t.font.color.rgb = C_TEXT

    # 부제
    tb_sub = slide.shapes.add_textbox(Inches(0.6), Inches(1.28), Inches(12.1), Inches(0.38))
    p_s = tb_sub.text_frame.paragraphs[0]
    p_s.text = subtitle
    p_s.font.name = FONT
    p_s.font.size = Pt(12.5)
    p_s.font.color.rgb = C_MUTED

    # 하단 구분선
    line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(1.72), Inches(12.13), Inches(0.015))
    line.fill.solid()
    line.fill.fore_color.rgb = C_LINE
    line.line.fill.background()


def add_card(
    slide,
    left: float,
    top: float,
    width: float,
    height: float,
    title: str,
    lines: list[str],
    fill_color: RGBColor = C_SURFACE,
    border_color: RGBColor = C_LINE,
    title_color: RGBColor = C_TEXT,
    title_size: int = 14,
    body_size: int = 11.5,
) -> None:
    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
    box.adjustments[0] = 0.06
    box.fill.solid()
    box.fill.fore_color.rgb = fill_color
    box.line.color.rgb = border_color
    box.line.width = Pt(1)

    tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.22)
    tf.margin_right = Inches(0.22)
    tf.margin_top = Inches(0.18)
    tf.margin_bottom = Inches(0.15)
    tf.vertical_anchor = MSO_ANCHOR.TOP

    p0 = tf.paragraphs[0]
    p0.text = title
    p0.font.name = FONT
    p0.font.size = Pt(title_size)
    p0.font.bold = True
    p0.font.color.rgb = title_color
    p0.space_after = Pt(6)

    for line in lines:
        p = tf.add_paragraph()
        p.text = line
        p.font.name = FONT
        p.font.size = Pt(body_size)
        p.font.color.rgb = C_TEXT
        p.space_after = Pt(4)


def add_kpi(slide, left: float, top: float, width: float, label: str, value: str, sub: str, accent: RGBColor = C_PRIMARY) -> None:
    box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(1.45))
    box.adjustments[0] = 0.08
    box.fill.solid()
    box.fill.fore_color.rgb = C_SOFT
    box.line.color.rgb = C_LINE
    box.line.width = Pt(1)

    tf = box.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.2)
    tf.margin_top = Inches(0.16)

    p1 = tf.paragraphs[0]
    p1.text = label
    p1.font.name = FONT
    p1.font.size = Pt(11)
    p1.font.color.rgb = C_MUTED

    p2 = tf.add_paragraph()
    p2.text = value
    p2.font.name = FONT
    p2.font.size = Pt(24)
    p2.font.bold = True
    p2.font.color.rgb = accent
    p2.space_before = Pt(4)

    p3 = tf.add_paragraph()
    p3.text = sub
    p3.font.name = FONT
    p3.font.size = Pt(10)
    p3.font.color.rgb = C_MUTED
    p3.space_before = Pt(2)


def add_table(slide, left: float, top: float, width: float, height: float, headers: list[str], rows: list[list[str]], col_widths: list[float] | None = None) -> None:
    shape = slide.shapes.add_table(len(rows) + 1, len(headers), Inches(left), Inches(top), Inches(width), Inches(height))
    tbl = shape.table
    if col_widths:
        for idx, w in enumerate(col_widths):
            tbl.columns[idx].width = Inches(w)

    for c_idx, h in enumerate(headers):
        cell = tbl.cell(0, c_idx)
        cell.fill.solid()
        cell.fill.fore_color.rgb = C_SOFT
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.name = FONT
        p.font.size = Pt(10.5)
        p.font.bold = True
        p.font.color.rgb = C_TEXT

    for r_idx, row in enumerate(rows, start=1):
        for c_idx, val in enumerate(row):
            cell = tbl.cell(r_idx, c_idx)
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_SURFACE
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.name = FONT
            p.font.size = Pt(10)
            p.font.color.rgb = C_TEXT


def build_presentation() -> Path:
    base_dir = Path(__file__).resolve().parent.parent
    manifest = json.loads((base_dir / "analytics" / "manifest.json").read_text(encoding="utf-8"))
    tfidf_eval = json.loads((base_dir / "analytics" / "tfidf_eval.json").read_text(encoding="utf-8"))

    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank = prs.slide_layouts[6]

    # ------------------------------------------------------------------
    # Slide 1: 표지
    # ------------------------------------------------------------------
    s1 = prs.slides.add_slide(blank)
    set_bg(s1, C_SURFACE)
    accent_bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.45), Inches(0.8), Inches(0.1))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = C_PRIMARY
    accent_bar.line.fill.background()

    tb = s1.shapes.add_textbox(Inches(0.8), Inches(1.75), Inches(11.5), Inches(2.2))
    p = tb.text_frame.paragraphs[0]
    p.text = "K-Visa Path"
    p.font.name = FONT
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = C_TEXT

    p2 = tb.text_frame.add_paragraph()
    p2.text = "이주배경 중·고등학생 입학전형 조회 · 비자 스킬트리 및 진로정보 병목 데이터 분석 플랫폼"
    p2.font.name = FONT
    p2.font.size = Pt(20)
    p2.font.bold = True
    p2.font.color.rgb = C_PRIMARY
    p2.space_before = Pt(10)

    p3 = tb.text_frame.add_paragraph()
    p3.text = "공공 Open API(NEIS · 커리어넷 · 서울열린데이터 · 가족센터) × 학생 정형·비정형 데이터 선순환 웹앱"
    p3.font.name = FONT
    p3.font.size = Pt(14)
    p3.font.color.rgb = C_MUTED
    p3.space_before = Pt(12)

    add_card(
        s1,
        0.8,
        4.6,
        11.7,
        1.8,
        "기말과제 핵심 요약",
        [
            "• 문제 발견: 2026년 이주배경학생 210,838명(4.3%) 중·고등 급증 및 고교 학업중단율 2.20%(5년 새 3.4배)",
            "• 제품 차별화: 단순 번역기가 아닌 '입학전형 + 2025~2026 최신 비자·TOPIK 장학금 + Zero-Tracking' 웹앱",
            "• 데이터 검증: 6개 가상교 432명 12주 opportunity 기반 DiD 검증(+15.47%p) & 문자 2~4그램 TF-IDF(macro-F1 1.0)",
        ],
        fill_color=C_SOFT,
    )

    # ------------------------------------------------------------------
    # Slide 2: 문제 제기 (2026 최신 통계)
    # ------------------------------------------------------------------
    s2 = prs.slides.add_slide(blank)
    set_bg(s2)
    add_header(
        s2,
        "01. PROBLEM DEFINITION",
        "중·고등 이주배경학생 급증과 학업중단 3.4배 — 정보 공백이 진학을 막는다",
        "교육부·KEDI 2026 교육기본통계(2026.4.1 기준) 및 여가부 2024 전국 다문화가족 실태조사",
        2,
    )
    add_kpi(s2, 0.6, 2.0, 2.85, "2026 이주배경학생", "210,838명", "전체 학생의 4.3% (역대 최다)", C_PRIMARY)
    add_kpi(s2, 3.68, 2.0, 2.85, "고등학생 전년 증가율", "+12.0%", "초등(+1.8%) 대비 6.7배 급증", C_PRIMARY)
    add_kpi(s2, 6.76, 2.0, 2.85, "외국인가정 자녀 비중", "27.8%", "2021년 17.8% 대비 +10.0%p", C_CHECK)
    add_kpi(s2, 9.84, 2.0, 2.85, "고교 학업중단율", "2.20%", "610명 · 5년 새 3.4배 증가", C_AVOID)

    add_card(
        s2,
        0.6,
        3.75,
        5.9,
        3.15,
        "왜 중·고등학교에서 이탈이 폭발하는가?",
        [
            "• 대학 진학 희망률은 71.6%로 높으나 실제 고등교육 순취학률은 61.9%(일반 대비 -13.0%p)",
            "• 고교 자퇴 사유 중 '기타(38.4%)'와 '학교부적응(35.7%)'이 74.1%를 차지",
            "• 외국인가정(27.8%)·중도입국(6.4%) 학생은 부모 비자·해외 서류·검정고시 제약 때문에",
            "  담임교사도, 학부모도 정확한 진학·취업 경로를 몰라 중도 포기 발생",
        ],
    )
    add_card(
        s2,
        6.8,
        3.75,
        5.9,
        3.15,
        "서울시 밀집 현황 (가상학교 6개교 설계 근거)",
        [
            "• 서울시 이주배경학생 22,002명(2025.4 기준), 중도입국·외국인 5년 새 +22.3%",
            "• 남부 3구(구로·영등포·금천)에 서울 전체의 27.37% 밀집 (중국어권·베트남어권 중심)",
            "• 용산·중부·동대문·관악권은 아랍·몽골·러시아·중앙아시아 다국적 혼재",
            "• 2026년 서울시 '한울타리' 포털 종료·통합 과도기로 학교 밀착형 진로 도구 공백",
        ],
        fill_color=C_SOFT,
    )

    # ------------------------------------------------------------------
    # Slide 3: 기존 서비스 한계 & Gap Analysis
    # ------------------------------------------------------------------
    s3 = prs.slides.add_slide(blank)
    set_bg(s3)
    add_header(
        s3,
        "02. GAP ANALYSIS",
        "기존 서비스는 단순 번역·초등 LMS에 머물러 '진로·입시·비자' 고리가 비어 있다",
        "아이엠스쿨 · e알리미 · 모두의 한국어(KERIS) · 한울타리 · 다누리 비교 분석",
        3,
    )
    add_table(
        s3,
        0.6,
        2.0,
        12.1,
        3.6,
        ["기존 서비스", "현재 제공 영역", "데이터 수집·활용 관점의 결정적 빈틈"],
        [
            ["아이엠스쿨 · e알리미", "가정통신문·알림장 기계번역", "단방향 번역만 제공 · 학부모/학생 이해 실패 구절 미수집"],
            ["모두의 한국어 (KERIS)", "AI 한국어 진단 · 초1~2 수학 어휘", "중·고등 입시·비자·진로 연계 부재 · 원적학급 상담과 단절"],
            ["한울타리 → MY SEOUL+", "지자체 생활정보 · 센터 안내", "2026년 서비스 통합 전환기 · NEIS 학교·입학전형 연동 없음"],
            ["다누리 · 가족센터", "13개 언어 3자 전화 통역", "사후·인력 의존 대응 · 언어권별 상담 이탈 단계 데이터 미축적"],
            ["K-Visa Path (제안)", "입학전형 + 비자 스킬트리 + 준비도구", "일상 탐색 자체가 정형·비정형 병목 데이터로 축적 → 교사·교육청 환류"],
        ],
        [2.5, 3.6, 6.0],
    )
    add_card(
        s3,
        0.6,
        5.85,
        12.1,
        1.05,
        "핵심 차별화 전략",
        [
            "단순 설문조사 앱이 아니라, 학생이 자기 입시(전형·TOPIK 장학금·비자·서류·알바 기준)를 확인하는 과정에서 자연스럽게 쌓이는 데이터로",
            "교사에게는 '다음 상담에서 고칠 구절'을, 서울시교육청에는 '자치구·언어권별 통역·컨설팅 공백'을 정량 리포트로 돌려줍니다.",
        ],
        fill_color=C_SOFT,
    )

    # ------------------------------------------------------------------
    # Slide 4: 2025~2026 3대 치명적 현장 함정 (Pre-flight Check)
    # ------------------------------------------------------------------
    s4 = prs.slides.add_slide(blank)
    set_bg(s4)
    add_header(
        s4,
        "03. REAL-WORLD PAIN POINTS",
        "2025~2026 최신 팩트로 발굴한 이주배경학생 입시·비자 4대 함정",
        "웹앱 사전 경고(Pre-flight Red Alert) 규칙 엔진에 직접 반영된 현장 탈락 원인",
        4,
    )
    add_card(
        s4,
        0.6,
        2.0,
        5.9,
        2.35,
        "함정 ① 외국 국적 학생의 '검정고시' 선택",
        [
            "• 중도입국 학년 강등 후 빠른 대입을 위해 검정고시를 선택하는 사례 빈발",
            "• 그러나 서울시립대 · 서울과기대 · 한국외대 등 주요 대학 순수외국인",
            "  특별전형은 국내·외 검정고시(GED)·홈스쿨링을 전면 불인정",
            "→ 웹앱: 외국 국적 선택 시 치명적 경고(Red Alert) + 정규 특성화고 안내",
        ],
        border_color=C_AVOID,
        title_color=C_AVOID,
    )
    add_card(
        s4,
        6.8,
        2.0,
        5.9,
        2.35,
        "함정 ② 마이스터고 대입 제외 & D-4-3 중단",
        [
            "• 대입 정원 외 특성화고교 졸업자 특별전형(1.5%)은 마이스터고 졸업자 제외",
            "• 해외 신규 유치 직업계고 유학생(D-4-3)은 2025.10 법무부 발급 중단",
            "• 반면 국내 7년+ 성장 청소년은 2025.4 신설 E-7-Y 고졸 직행 취업 가능",
            "→ 웹앱: 서울 12개교 마이스터고/특성화고 대입 가능 여부 배지 자동 분리",
        ],
        border_color=C_CHECK,
        title_color=C_CHECK,
    )
    add_card(
        s4,
        0.6,
        4.6,
        5.9,
        2.35,
        "함정 ③ 2026년 9월 아포스티유 국가 변동",
        [
            "• 중국(2023.11) · 방글라데시(2025.3) · 베트남(2026.9.11) 아포스티유 발효",
            "• 태국(2027.2.28 발효 예정) · 캄보디아 · 미얀마 · 라오스는 영사확인 필수",
            "• 구버전 정보로 3단계 영사확인 낭비 또는 비협약국 서류 접수 반려 빈발",
            "→ 웹앱: 출신국 선택 시 2026.9 기준 아포스티유/전환기/영사확인 자동 분기",
        ],
    )
    add_card(
        s4,
        6.8,
        4.6,
        5.9,
        2.35,
        "함정 ④ 고교생 알바 금지 & 등록금 환전 사기",
        [
            "• F-1·F-3·D-4-3 고교생은 아르바이트 원칙 금지, D-2도 사전 허가 필수",
            "• 미허가·배달라이더·초과근무 적발 시 향후 D-10·E-7·F-2-7 전환 탈락",
            "• 등록금 사설환전소 이용 시 보이스피싱 계좌 연루·재납부 피해 급증",
            "→ 웹앱: 합법 알바 시간 계산기 + 공식 은행 가상계좌 납부 경고 탑재",
        ],
    )

    # ------------------------------------------------------------------
    # Slide 5: 핵심 기능 ① 입학전형 조회 & TOPIK 장학금 비교
    # ------------------------------------------------------------------
    s5 = prs.slides.add_slide(blank)
    set_bg(s5)
    add_header(
        s5,
        "04. CORE FEATURE — ADMISSIONS & SCHOLARSHIP",
        "맞춤 입학전형 조회 · Gap 진단 · 서울 주요 대학 TOPIK 장학금 비교",
        "NEIS schoolMajorinfo 실시간 연동 + 2026~2027 주요 12개교 요강 및 배타적 외부 장학금 필터",
        5,
    )
    add_table(
        s5,
        0.6,
        2.0,
        7.55,
        4.85,
        ["대학", "검정고시", "3급", "4급", "5급", "6급", "특징 (2026~2027)"],
        [
            ["숭실대", "원칙 불인정", "40%", "60%", "80%", "100%", "3~5급 감면 최상위(공식)"],
            ["건국·국민대", "원칙 불인정", "30%", "50%", "70%", "100%", "건국 F비자 잔고면제 · 국민 신입특전"],
            ["서울과기대", "불인정", "-", "50%", "100%", "100%+기숙", "서류 A/B 등급 충족 시 · 영어트랙 동일"],
            ["서울시립대", "불인정", "30%", "40%", "50%", "60%", "2027 개편 · 국공립 최저 학비+자동감면"],
            ["동국대", "불인정", "30%", "50%", "50%", "50%", "어학우수장학 · 고지서 자동 감면"],
            ["한국외대", "불인정", "-", "30%", "50%", "100%", "이중언어 강점 · 잔고 1개월 원본"],
            ["경희·한양·성균·중앙", "불인정", "-", "-", "50%", "100%", "5~6급 집중 감면 (성균관 GED 불인정)"],
            ["숙명여대", "원칙 불인정", "30만", "30만", "30만", "30만", "2025.9부터 정액 30만 원 · 수시 학종 24명"],
        ],
        [1.15, 0.95, 0.65, 0.65, 0.65, 0.75, 2.75],
    )
    add_card(
        s5,
        8.4,
        2.0,
        4.3,
        2.3,
        "조건 미충족(Gap) 자동 진단",
        [
            "• TOPIK 미보유 학생에게 '결과 0건' 대신",
            "  'TOPIK 3급 취득 시 숭실·시립·과기 지원 가능'",
            "  구체적 해결 액션 제시",
            "• 서울 특성화고 12개교 실시간 검색창 +",
            "  미래인재전형(교과 미반영·면접 중심) 안내",
        ],
        fill_color=C_SOFT,
    )
    add_card(
        s5,
        8.4,
        4.55,
        4.3,
        2.3,
        "배타적 외부 장학금 하드 룰",
        [
            "• 우리다문화(500만)·명인다문화(400만):",
            "  부모 모두 외국 국적 학생 자동 제외",
            "• 삼성꿈 글로벌 희망장학(전액+월 80만):",
            "  국내 초·중·고 1학기 이상 이수자 자동 제외",
            "• 상담용 1장 요약 인쇄(PDF) 지원",
        ],
    )

    # ------------------------------------------------------------------
    # Slide 6: 핵심 기능 ② 비자 스킬트리 & 학생 준비 도구
    # ------------------------------------------------------------------
    s6 = prs.slides.add_slide(blank)
    set_bg(s6)
    add_header(
        s6,
        "05. CORE FEATURE — VISA SKILL TREE & PREP TOOLS",
        "2025~2026 개정 비자 스킬트리 & 매일 쓰는 4대 실전 준비 도구",
        "21개 언어(zh-Hans/zh-Hant 구분 · 아랍어 RTL 자동 전환) 및 기기 영구 저장(localStorage)",
        6,
    )
    add_card(
        s6,
        0.6,
        2.0,
        6.0,
        4.9,
        "2025~2026 최신 체류자격(비자) 경로 엔진",
        [
            "1) 국내성장인력 E-7-Y (2025.4.1 신설 · 코드 9999)",
            "   • 18~24세, 국내 7년+ 체류, 초·중·고 졸업(또는 KIIP 5단계)",
            "   • 대학 진학 없이 점수제 면제 D-10(최장 3년) 및 고졸 취업 허용",
            "2) 전문대 육성형 전문기술학과 → E-7-M (2026~2027 시범)",
            "   • 체류 7년 미만 중도입국 직업계고 졸업생 대안 · 주 35시간 알바",
            "3) 대학(D-2) → 구직(D-10 3년) → E-7 / F-2-R(2026.8 TOPIK 3급 완화)",
            "   • E-7 최저연봉(2026.2): E-7-1 3,112만 / E-7-2·3 2,589만",
            "4) 미등록 장기체류 아동 구제 (2025.4.1 ~ 2028.3.31, 3년 연장)",
            "   • 6년/7년+ 체류 아동 D-4 · 미성년 형제자매 G-1 · 부모 범칙금 70%↓",
        ],
        fill_color=C_SOFT,
    )
    add_card(
        s6,
        6.9,
        2.0,
        5.8,
        2.3,
        "서류 체크리스트 & 1분 O/X 퀴즈 & 1줄 질문함",
        [
            "• 5대 필수 서류 진행률(localStorage 유지) + '구하기 어려움' 4대 사유 수집",
            "• 1분 입시 O/X 4문항: 최초 답안만 실측 기록 + 즉시 쉬운 한국어 해설",
            "• 1줄 자유 질문함: 입력 즉시 6개 토픽 자동 분류 + 맞춤 가이드 출력",
        ],
    )
    add_card(
        s6,
        6.9,
        4.55,
        5.8,
        2.35,
        "TOPIK 유효기간(2년) & 합법 알바 계산기",
        [
            "• TOPIK 발표일 입력 → +2년 만료 예정일 및 남은 일수(D-Day) 자동 검증",
            "• 과정(고교/D-4/전문대/육성형/학사1~2·3~4/석박사) × TOPIK별",
            "  주중 허용시간(0~35시간) + 우대(+5시간) + 금지업종 자동 판정",
            "• 진로상담실 큰 글씨 한국어 + 모국어 음성(TTS) 소통 카드",
        ],
    )

    # ------------------------------------------------------------------
    # Slide 7: 학생 데이터 수집 & 프라이버시 아키텍처
    # ------------------------------------------------------------------
    s7 = prs.slides.add_slide(blank)
    set_bg(s7)
    add_header(
        s7,
        "06. DATA ARCHITECTURE & PRIVACY",
        "Zero-Tracking 가명 종단 설계 & opportunity 중심 데이터 스키마",
        "미등록 이주아동 보호(출입국관리법 제84조)와 만 14세 미만 아동 보호(개인정보보호법 제22조의2) 준수",
        7,
    )
    add_table(
        s7,
        0.6,
        2.0,
        12.1,
        2.7,
        ["구분", "수집 / 차단 항목", "데이터 유형", "분석 및 환류 용도"],
        [
            ["수집 ①", "입시 난해 용어 '?' 터치 (아포스티유, D-2 변경 등)", "비정형(span)", "평활화 병목률(p̃) 및 교사 개입 우선순위"],
            ["수집 ②", "서류 장애 사유 · O/X 최초 정답 · 계열 탐색", "정형", "입시 포기 원인 1위 서류 · 이해도 실측 · CIGI"],
            ["수집 ③", "1줄 자유 질문 텍스트", "비정형(text)", "문자 2~4그램 TF-IDF 토픽 분류 · 안내문 공백 발굴"],
            ["수집 ④", "가족센터 4단계 상담 퍼널 (필요→열람→시도→연결)", "정형(episode)", "자치구×언어 7일 연결확인율 · 실패/미응답 분리"],
            ["원천 차단", "실명 · 전화번호 · 외국인등록번호 · 비자 유형 · 미등록 여부", "미수집", "브라우저 메모리(Stateless)에서만 판정 · DB 컬럼 자체 배제"],
        ],
        [1.3, 4.4, 1.8, 4.6],
    )
    add_card(
        s7,
        0.6,
        4.95,
        5.9,
        1.95,
        "opportunity(응답 기회) 중심 PostgreSQL/Supabase 설계",
        [
            "• 응답 온 로그만 쌓지 않고 배정 기회(opportunity)를 먼저 생성해 분모 고정",
            "• 시험주간 응답률 하락(선택 편향)과 실제 이해도 하락을 수학적으로 분리",
            "• source_school(실제 NEIS)과 school(is_synthetic) 분리 및 RLS 적용",
        ],
        fill_color=C_SOFT,
    )
    add_card(
        s7,
        6.8,
        4.95,
        5.9,
        1.95,
        "법령 준수 및 k-익명성 마스킹",
        [
            "• 출입국관리법 제84조: 국공립 학교 교직원 출입국 통보 의무 면제 고지",
            "• 개인정보보호법 제22조의2: 만 14세 미만 다국어·쉬운 말 고지",
            "• k-익명성 공개 뷰(v_district_referral_7d_public): 고유 응답자 10명 미만 자동 마스킹",
        ],
        fill_color=C_SOFT,
    )

    # ------------------------------------------------------------------
    # Slide 8: 분석 결과 ① 입시 용어 병목(p̃) & TF-IDF 검증
    # ------------------------------------------------------------------
    s8 = prs.slides.add_slide(blank)
    set_bg(s8)
    add_header(
        s8,
        "07. ANALYTICS RESULT 1 — UNSTRUCTURED TEXT",
        "입시 용어 평활화 병목률(p̃) 우선순위 & 문자 2~4그램 TF-IDF 검증",
        "소표본 과대추정을 방지하는 베이즈 평활화(p̃ = (x + 5p₀)/(n + 5))와 문서 단위 분리 NLP 평가",
        8,
    )
    add_table(
        s8,
        0.6,
        2.0,
        7.3,
        3.9,
        ["입시 용어", "TF-IDF 주제 군집", "x/n", "평활화 p̃", "예상 영향"],
        [
            ["아포스티유(Apostille)", "해외 학력 인증 서류", "89/186", "47.2%", "85명"],
            ["D-2 유학비자 변경", "비자·체류자격 전환", "78/184", "41.9%", "75명"],
            ["정원 외 선발", "전형 유형·정원 규정", "64/188", "33.7%", "61명"],
            ["외국학교 학력인정", "해외 학력 인증 서류", "59/182", "32.1%", "58명"],
            ["재정능력 입증 서류", "비자·체류자격 전환", "52/180", "28.7%", "52명"],
            ["고른기회(다문화)", "전형 유형·정원 규정", "31/185", "16.9%", "30명"],
        ],
        [2.05, 1.95, 1.0, 1.1, 1.2],
    )
    add_card(
        s8,
        8.15,
        2.0,
        4.55,
        4.9,
        "실측 TF-IDF 검증 (run_tfidf_eval.py)",
        [
            f"• 방식: 문자 2~4그램 TF-IDF + 코사인 중심 분류",
            f"• 데이터 분할: 문서 단위 엄격 분리 (누수 차단)",
            f"  Train {tfidf_eval['train_docs']}문서({tfidf_eval['train_phrases']}구절) / Test {tfidf_eval['test_docs']}문서({tfidf_eval['test_phrases']}구절)",
            f"• 실측 Accuracy: {tfidf_eval['accuracy']} / Macro-F1: {tfidf_eval['macro_f1']}",
            "• 6개 핵심 입시·비자 주제 모두 정밀도·재현율 1.0",
            "",
            "• 대시보드 라이브 개입 시뮬레이션:",
            "  교사가 '쉬운 카드 배포' 클릭 시 intervention 로그 기록",
            "  및 예상 병목 감소 인원 즉시 산출",
        ],
        fill_color=C_SOFT,
    )
    add_card(
        s8,
        0.6,
        6.08,
        7.3,
        0.82,
        "실시간 웹앱 연동",
        [
            "학생이 1·2번 탭에서 '?' 용어 클릭·서류 어려움·자유 질문을 입력하면 3번 탭 표에 '실시간 +N' 배지로 즉시 반영됩니다.",
        ],
    )

    # ------------------------------------------------------------------
    # Slide 9: 분석 결과 ② 교사 개입 전후 DiD 검증
    # ------------------------------------------------------------------
    s9 = prs.slides.add_slide(blank)
    set_bg(s9)
    add_header(
        s9,
        "08. ANALYTICS RESULT 2 — INTERVENTION & DiD",
        "6개 가상교 432명 · 12주 시뮬레이션: '쉬운 용어 카드' 개입 효과 검증",
        "조기 도입 학급(6주차) vs 지연 도입 학급(9주차) 이중차분(DiD) 및 다중 시드(20회) 검증",
        9,
    )
    add_kpi(s9, 0.6, 2.0, 2.85, "시뮬레이션 규모", f"{manifest['virtual_schools']}개교 · {manifest['virtual_students']}명", f"{manifest['weeks']}주 · 기회 {manifest['opportunities_per_run']:,}건/회", C_PRIMARY)
    add_kpi(s9, 3.68, 2.0, 2.85, "평균 DiD 개입 효과", f"+{manifest['mean_treatment_did_pp']}%p", "6~8주 공통 비교 구간", C_SAFE)
    add_kpi(s9, 6.76, 2.0, 2.85, "다중 시드 효과 회수율", f"{manifest['effect_recovery_rate_pct']}%", f"사전 선언 {manifest['seed_count']}개 시드 검증", C_PRIMARY)
    add_kpi(s9, 9.84, 2.0, 2.85, "무결성 오류 / Null 오경보", f"{manifest['integrity_errors']}건 / {manifest['null_false_alarm_rate_pct']}%", "효과 0 대조군 오경보율 투명 공개", C_CHECK)

    add_card(
        s9,
        0.6,
        3.75,
        5.9,
        3.15,
        "선택 편향 통제: 잠재 혼란과 응답 확률 분리",
        [
            "• 4주차·8주차 시험주간에 전체 응답률이 87% → 66%로 급락하도록 설계",
            "• 미응답을 오답으로 처리하는 잘못된 분석과 달리, opportunity 분모와",
            "  응답률 곡선을 별도 표시해 '이해도 하락'과 '응답자 구성 변화'를 분리",
            "• 6주차 조기 도입군 정답률(53% → 70%) 상승 후, 9주차 지연군도",
            "  동일하게 70%대로 수렴하며 개입 인과성을 재확인",
        ],
    )
    add_card(
        s9,
        6.8,
        3.75,
        5.9,
        3.15,
        "Python 재현성 검증 (analytics/generate_and_validate.py)",
        [
            "• 동일 시드(101~120)에서 100% 동일 결과 재현",
            "• 휴업일 수업·중복 최초 응답·고아 FK 등 무결성 오류 0건 검증",
            "• 좋은 시드 1개만 고르지 않고, 효과를 0으로 둔 Null 대조군 오경보율",
            f"  ({manifest['null_false_alarm_rate_pct']}%)까지 함께 보고해 분석의 통계적 신뢰성 확보",
            "• 웹앱 4번 탭에서 JSON · CSV 분석 리포트 즉시 다운로드 가능",
        ],
        fill_color=C_SOFT,
    )

    # ------------------------------------------------------------------
    # Slide 10: 분석 결과 ③ 서울시교육청 7일 상담 퍼널 & 정책 환류
    # ------------------------------------------------------------------
    s10 = prs.slides.add_slide(blank)
    set_bg(s10)
    add_header(
        s10,
        "09. ANALYTICS RESULT 3 — SEOUL EDU POLICY",
        "서울시교육청 7일 상담 연결 퍼널 & 2026 종합계획 정책 환류",
        "자치구 권역 필터(남부 3구 vs 중부·기타권) · 연결 실패 vs 후속 미응답 분리 · k-익명성 보호",
        10,
    )
    add_table(
        s10,
        0.6,
        2.0,
        12.1,
        3.1,
        ["자치구", "요청 언어", "필요 표시", "연락 시도", "7일 연결됨", "실패 보고", "후속 미응답", "7일 연결율", "핵심 정책 인사이트"],
        [
            ["구로구", "중국어(간체)", "54", "41", "34", "3", "4", "63%", "평일 18시 종료 → 야간 연장 수요"],
            ["영등포구", "중국어(간체)", "48", "37", "31", "3", "3", "65%", "다+온 거점 · 서류 문의 반복"],
            ["금천구", "베트남어", "26", "17", "12", "3", "2", "46%", "연락 시간 불일치 해소 필요"],
            ["용산구", "아랍어", "18", "12", "4", "6", "2", "22%", "통번역사 배치 0명 → 광역 연계 시급"],
            ["동대문구", "몽골어", "15", "11", "8", "1", "2", "53%", "대상 조건 안내문 개편 필요"],
            ["관악구", "태국어", "-", "-", "-", "-", "-", "<10명 마스킹", "k-익명성 보호(표본 7명 역추적 차단)"],
        ],
        [1.0, 1.25, 0.9, 0.9, 0.95, 0.9, 1.0, 1.15, 4.05],
    )
    add_card(
        s10,
        0.6,
        5.35,
        12.1,
        1.55,
        "「2026 서울 이주배경학생 교육지원 종합계획」 직접 연계 포인트",
        [
            "• 가중치 지표 보완: 정적 학생 수 통계에 동적 현장 수요 지표(용어 병목률 · CIGI · 7일 연결율)를 결합해 예산 우선순위 근거 제공",
            "• 제2서울다문화교육지원센터(중부·강북권, 2026.9~2027.2): 용산구 아랍어 배치 0명 같은 사각지대 발굴 및 디지털 원스톱 프론트엔드 제안",
        ],
        fill_color=C_SOFT,
    )

    # ------------------------------------------------------------------
    # Slide 11: 마무리 & 5종 니치 앱 시리즈 확장 로드맵
    # ------------------------------------------------------------------
    s11 = prs.slides.add_slide(blank)
    set_bg(s11)
    add_header(
        s11,
        "10. SCALABILITY & CONCLUSION",
        "공통 코어(kbridge-core) 기반 5종 니치 앱 시리즈 확장 로드맵",
        "21개 언어 i18n · RTL · 익명 이벤트 수집 · 하우스 UI 컴포넌트를 5개 독립 레포로 확장 구축 완료",
        11,
    )
    add_table(
        s11,
        0.6,
        2.0,
        7.4,
        3.6,
        ["레포명", "타깃 니치 앱", "핵심 공공 API · 상태"],
        [
            ["kbridge-core", "공통 21개 언어 · RTL · UI · 분석 코어", "Vite 라이브러리 빌드 완료"],
            ["kvisa-path (본 발표)", "이주학생 입학전형 · 비자 · TOPIK 장학", "풀버전 · Python 검증 · Supabase DDL 완료"],
            ["kschool-meal", "K-School 안심 급식 신호등 (할랄·알레르기)", "NEIS 19대 알레르기 파서 · 스타터 빌드 완료"],
            ["kschool-lens", "교과서·프린트 쉬운 한국어 렌즈", "국립국어원 11개 언어 사전 · 스타터 완료"],
            ["kschool-guide", "한국 학교 생존 사전 & 긴급 TTS 카드", "NEIS 학사일정 · 가족센터 · 스타터 완료"],
            ["kmed-card", "외국인 소아과·약국 증상 소통 카드", "증상 문진표 + TTS · 스타터 완료"],
        ],
        [1.8, 3.0, 2.6],
    )
    add_card(
        s11,
        8.25,
        2.0,
        4.45,
        3.6,
        "앱 화면 시연 / 스크린샷 영역",
        [
            "• 발표 시 실제 웹앱(http://localhost:5203)",
            "  또는 배포 URL에서 4개 탭을 라이브 시연",
            "",
            "• 추천 시연 순서 (3분):",
            "  1) 1번 탭: 고등학생 · 외국인가정 선택",
            "     → 검정고시 경고 + TOPIK 장학표 + '?' 클릭",
            "  2) 2번 탭: O/X 퀴즈 + 1줄 질문 + 알바 계산기",
            "  3) 3번 탭: '실시간 +1' 반영 + '쉬운 카드 배포'",
        ],
        fill_color=C_SOFT,
    )
    add_card(
        s11,
        0.6,
        5.85,
        12.1,
        1.05,
        "결론",
        [
            "K-Visa Path는 번역기를 하나 더 만드는 프로젝트가 아니라, 이주배경 청소년이 체류자격과 서류 장벽 앞에서 꿈을 포기하지 않도록",
            "실시간 입시·비자 의사결정을 돕고, 그 과정의 데이터를 안전하게 분석해 학교와 교육청의 변화를 끌어내는 데이터 인프라입니다.",
        ],
        border_color=C_PRIMARY,
    )

    out_path = Path(__file__).resolve().parent / "kvisa-path-final-presentation.pptx"
    prs.save(str(out_path))
    return out_path


if __name__ == "__main__":
    saved = build_presentation()
    print(f"Saved presentation: {saved}")
