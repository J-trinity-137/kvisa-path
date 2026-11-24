"""
kvisa-path 기말과제용 비정형 입시·진로 구절 문자 2~4그램 TF-IDF + 코사인 유사도 분류 검증 스크립트
- 외부 패키지 없이 Python 표준 라이브러리만으로 즉시 재현 가능
- 문서(안내문/질문 출처) 단위로 Train/Test를 엄격히 분리해 데이터 누수(Leakage) 방지
- 주제별 Precision / Recall / F1 및 전체 macro-F1 산출 -> analytics/tfidf_eval.json 저장
"""

from __future__ import annotations

import json
import math
from collections import Counter, defaultdict
from pathlib import Path

# (doc_id, topic, phrase) — 같은 doc_id는 Train 또는 Test 한쪽에만 배치
LABELED_CORPUS: list[tuple[str, str, str]] = [
    # Train 문서군 (doc_01 ~ doc_12)
    ("doc_01", "해외 학력 인증 서류", "외국학교 전 학년 성적증명서 아포스티유 발급"),
    ("doc_01", "해외 학력 인증 서류", "비협약국 졸업증명서 재외동포청 영사확인"),
    ("doc_02", "해외 학력 인증 서류", "사립학교 재학증명서 현지 공증 및 번역 공증"),
    ("doc_02", "해외 학력 인증 서류", "해외 학교 학력인정 심의 서류 제출"),
    ("doc_03", "전형 유형·정원 규정", "부모 모두 외국인 정원 외 특별전형 모집"),
    ("doc_03", "전형 유형·정원 규정", "고른기회 다문화가정 자녀 수시 특별전형"),
    ("doc_04", "전형 유형·정원 규정", "고입 특례 신입학 정원 외 2퍼센트 선발"),
    ("doc_04", "전형 유형·정원 규정", "특성화고교 졸업자 동일계열 특별전형 마이스터고 제외"),
    ("doc_05", "비자·체류자격 전환", "대학 입학 후 D-2 유학비자 체류자격 변경"),
    ("doc_05", "비자·체류자격 전환", "국내성장인력 E-7-Y 취업비자 및 D-10 구직 3년"),
    ("doc_06", "비자·체류자격 전환", "미등록 이주아동 구제대책 D-4 및 형제 G-1 부여"),
    ("doc_06", "비자·체류자격 전환", "지역특화형 F-2-R 비자 TOPIK 3급 완화"),
    ("doc_07", "장학금·비용 지원", "TOPIK 5급 6급 외국인 신입생 등록금 장학금 감면"),
    ("doc_07", "장학금·비용 지원", "우리다문화장학재단 중위소득 100 이하 학업장학금"),
    ("doc_08", "장학금·비용 지원", "은행 잔고증명서 재정능력 입증 서류 비용 부담"),
    ("doc_08", "장학금·비용 지원", "등록금 납부 사설환전소 주의 공식 가상계좌 이용"),
    ("doc_09", "시간제 취업·알바", "유학생 시간제 취업 아르바이트 사전 허가 기준"),
    ("doc_09", "시간제 취업·알바", "고등학생 F-1 F-3 비자 알바 금지 및 배달업 제한"),
    ("doc_10", "시간제 취업·알바", "D-2 학사 주중 25시간 시간제취업 우대시간"),
    ("doc_10", "시간제 취업·알바", "미허가 불법취업 적발 시 범칙금 및 E-7 전환 제한"),
    ("doc_11", "검정고시·학력인정", "외국 국적 학생 검정고시 합격 시 순수외국인 전형 불인정"),
    ("doc_11", "검정고시·학력인정", "중학교 졸업학력 검정고시 특성화고 방문 원서접수"),
    ("doc_12", "검정고시·학력인정", "GED 해외 검정고시 및 홈스쿨링 지원 자격 제외"),
    ("doc_12", "검정고시·학력인정", "중도입국 학년 강등 후 검정고시 선택 주의"),
    # Test 문서군 (doc_13 ~ doc_18 — Train과 완전히 독립된 문서)
    ("doc_13", "해외 학력 인증 서류", "베트남 졸업장 아포스티유 협약 발효 후 공증 방법"),
    ("doc_13", "해외 학력 인증 서류", "태국 고교 성적증명서 영사확인 및 번역 공증"),
    ("doc_13", "해외 학력 인증 서류", "외국학교 재학증명서 학력인정 절차 문의"),
    ("doc_14", "전형 유형·정원 규정", "순수외국인 정원 외 선발 수시 6회 제한 여부"),
    ("doc_14", "전형 유형·정원 규정", "다문화가족 자녀 고른기회 기회균형 전형 자격"),
    ("doc_14", "전형 유형·정원 규정", "특성화고 졸업자 특별전형 동일계열 기준학과"),
    ("doc_15", "비자·체류자격 전환", "F-3 동반비자에서 대학 D-2 체류자격 변경 서류"),
    ("doc_15", "비자·체류자격 전환", "고졸 E-7-Y 국내성장인력 비자 7년 체류 요건"),
    ("doc_15", "비자·체류자격 전환", "장기체류 미등록 아동 구제 D-4 및 부모 G-1"),
    ("doc_16", "장학금·비용 지원", "TOPIK 4급 5급 입학 장학금 등록금 감면율 비교"),
    ("doc_16", "장학금·비용 지원", "외국인 전형 은행 잔고증명서 재정능력 입증 면제"),
    ("doc_16", "장학금·비용 지원", "다문화 장학재단 생활비 장학금 중위소득 기준"),
    ("doc_17", "시간제 취업·알바", "D-2 유학생 아르바이트 주중 허용시간 사전 허가"),
    ("doc_17", "시간제 취업·알바", "고교생 F-1 알바 가능 여부 및 배달 라이더 금지"),
    ("doc_17", "시간제 취업·알바", "시간제취업 미허가 근무 범칙금 불이익"),
    ("doc_18", "검정고시·학력인정", "검정고시 합격자가 서울시립대 외국인전형 지원 가능한가"),
    ("doc_18", "검정고시·학력인정", "해외 GED 검정고시 홈스쿨링 학력 인정 여부"),
    ("doc_18", "검정고시·학력인정", "중학교 검정고시 출신 특성화고 원서접수 방법"),
]

TRAIN_DOCS = {f"doc_{i:02d}" for i in range(1, 13)}


def char_ngrams(text: str, n_min: int = 2, n_max: int = 4) -> list[str]:
    clean = " ".join(text.lower().split())
    grams: list[str] = []
    for n in range(n_min, n_max + 1):
        for i in range(max(0, len(clean) - n + 1)):
            grams.append(clean[i : i + n])
    return grams


def build_idf(docs: list[list[str]]) -> dict[str, float]:
    df: Counter[str] = Counter()
    for grams in docs:
        for g in set(grams):
            df[g] += 1
    n_docs = len(docs)
    return {g: math.log((1 + n_docs) / (1 + count)) + 1.0 for g, count in df.items()}


def tfidf_vector(grams: list[str], idf: dict[str, float]) -> dict[str, float]:
    tf = Counter(grams)
    vec = {g: (cnt / len(grams)) * idf[g] for g, cnt in tf.items() if g in idf}
    norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
    return {g: v / norm for g, v in vec.items()}


def cosine_sim(a: dict[str, float], b: dict[str, float]) -> float:
    if len(a) > len(b):
        a, b = b, a
    return sum(v * b.get(k, 0.0) for k, v in a.items())


def main() -> None:
    train_items = [row for row in LABELED_CORPUS if row[0] in TRAIN_DOCS]
    test_items = [row for row in LABELED_CORPUS if row[0] not in TRAIN_DOCS]

    train_grams = [char_ngrams(text) for _, _, text in train_items]
    idf = build_idf(train_grams)

    # 주제별 평균 벡터(Centroid) 구축
    topic_sums: dict[str, defaultdict[str, float]] = defaultdict(lambda: defaultdict(float))
    topic_counts: Counter[str] = Counter()
    for (_, topic, _), grams in zip(train_items, train_grams):
        vec = tfidf_vector(grams, idf)
        for k, v in vec.items():
            topic_sums[topic][k] += v
        topic_counts[topic] += 1

    centroids: dict[str, dict[str, float]] = {}
    for topic, sums in topic_sums.items():
        norm = math.sqrt(sum(v * v for v in sums.values())) or 1.0
        centroids[topic] = {k: v / norm for k, v in sums.items()}

    # 문서 단위 분리된 Test 세트 평가
    topics = sorted(centroids.keys())
    tp: Counter[str] = Counter()
    fp: Counter[str] = Counter()
    fn: Counter[str] = Counter()

    predictions = []
    for doc_id, true_topic, text in test_items:
        vec = tfidf_vector(char_ngrams(text), idf)
        pred_topic = max(topics, key=lambda t: cosine_sim(vec, centroids[t]))
        predictions.append({"doc_id": doc_id, "true": true_topic, "pred": pred_topic, "text": text})
        if pred_topic == true_topic:
            tp[true_topic] += 1
        else:
            fp[pred_topic] += 1
            fn[true_topic] += 1

    per_topic = {}
    f1_list = []
    for t in topics:
        p = tp[t] / (tp[t] + fp[t]) if (tp[t] + fp[t]) > 0 else 0.0
        r = tp[t] / (tp[t] + fn[t]) if (tp[t] + fn[t]) > 0 else 0.0
        f1 = (2 * p * r / (p + r)) if (p + r) > 0 else 0.0
        per_topic[t] = {"precision": round(p, 3), "recall": round(r, 3), "f1": round(f1, 3)}
        f1_list.append(f1)

    macro_f1 = round(sum(f1_list) / len(f1_list), 3)
    accuracy = round(sum(1 for row in predictions if row["true"] == row["pred"]) / len(predictions), 3)

    result = {
        "method": "char 2-4gram TF-IDF + cosine centroid (document-level split)",
        "train_docs": len(TRAIN_DOCS),
        "test_docs": len({row[0] for row in test_items}),
        "train_phrases": len(train_items),
        "test_phrases": len(test_items),
        "accuracy": accuracy,
        "macro_f1": macro_f1,
        "per_topic": per_topic,
    }

    out_path = Path(__file__).parent / "tfidf_eval.json"
    out_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
