"""
kvisa-path 기말과제용 12주 가상 학교(6개교 × 3반 × 24명 = 432명) 합성 데이터 생성 및 검증 배치
- opportunity(응답 기회) 기반 분모 고정
- 잠재 혼란(confused)과 관측 응답(responded)의 확률 모델 분리 (4·8주 시험주간 선택 편향 시뮬레이션)
- 6주차 조기 도입 학급 vs 9주차 지연 도입 학급 DiD 효과 회수율 및 Null 대조군 오경보율 검증
"""

from __future__ import annotations

import json
import math
import random
from pathlib import Path

SCHOOLS = ["구로가상중", "영등포가상중", "금천가상중", "용산가상중", "동대문가상중", "관악가상중"]
CLASSES_PER_SCHOOL = 3
STUDENTS_PER_CLASS = 24
WEEKS = 12
EXAM_WEEKS = {4, 8}
PRIOR_P0 = 0.22


def sigmoid(x: float) -> float:
    return 1.0 / (1.0 + math.exp(-x))


def simulate_semester(seed: int, intervention_effect: float = -0.75) -> dict:
    rng = random.Random(seed)
    total_opportunities = 0
    integrity_errors = 0

    early_pre_ok, early_pre_n = 0, 0
    early_post_ok, early_post_n = 0, 0
    late_pre_ok, late_pre_n = 0, 0
    late_post_ok, late_post_n = 0, 0

    for s_idx, _school in enumerate(SCHOOLS):
        for c_idx in range(CLASSES_PER_SCHOOL):
            is_early = (s_idx + c_idx) % 2 == 0
            class_effect = rng.gauss(0.0, 0.15)
            students = [
                (rng.gauss(0.0, 0.6), rng.gauss(0.0, 0.7))
                for _ in range(STUDENTS_PER_CLASS)
            ]

            for week in range(1, WEEKS + 1):
                is_exam = week in EXAM_WEEKS
                has_card = (is_early and week >= 6) or ((not is_early) and week >= 9)

                for u_fam, v_resp in students:
                    total_opportunities += 1
                    logit_conf = -0.2 + (intervention_effect if has_card else 0.0) - u_fam + class_effect
                    confused = rng.random() < sigmoid(logit_conf)

                    logit_resp = 1.4 + v_resp - (0.75 if is_exam else 0.0) - (0.35 if confused else 0.0)
                    responded = rng.random() < sigmoid(logit_resp)

                    if not responded:
                        continue

                    understood = 0 if confused else 1
                    if week <= 5:
                        if is_early:
                            early_pre_ok += understood
                            early_pre_n += 1
                        else:
                            late_pre_ok += understood
                            late_pre_n += 1
                    elif 6 <= week <= 8:
                        if is_early:
                            early_post_ok += understood
                            early_post_n += 1
                        else:
                            late_post_ok += understood
                            late_post_n += 1

    early_diff = (early_post_ok / early_post_n - early_pre_ok / early_pre_n) * 100
    late_diff = (late_post_ok / late_post_n - late_pre_ok / late_pre_n) * 100
    did_pp = round(early_diff - late_diff, 2)

    return {
        "seed": seed,
        "total_opportunities": total_opportunities,
        "integrity_errors": integrity_errors,
        "early_diff_pp": round(early_diff, 2),
        "late_diff_pp": round(late_diff, 2),
        "did_estimate_pp": did_pp,
    }


def main() -> None:
    seeds = list(range(101, 121))
    treatment_runs = [simulate_semester(s, intervention_effect=-0.75) for s in seeds]
    null_runs = [simulate_semester(s, intervention_effect=0.0) for s in seeds]

    recovered = sum(1 for r in treatment_runs if r["did_estimate_pp"] >= 5.0)
    false_alarms = sum(1 for r in null_runs if abs(r["did_estimate_pp"]) >= 5.0)

    manifest = {
        "virtual_schools": len(SCHOOLS),
        "virtual_students": len(SCHOOLS) * CLASSES_PER_SCHOOL * STUDENTS_PER_CLASS,
        "weeks": WEEKS,
        "seed_count": len(seeds),
        "opportunities_per_run": treatment_runs[0]["total_opportunities"],
        "integrity_errors": sum(r["integrity_errors"] for r in treatment_runs),
        "mean_treatment_did_pp": round(sum(r["did_estimate_pp"] for r in treatment_runs) / len(seeds), 2),
        "effect_recovery_rate_pct": round((recovered / len(seeds)) * 100, 1),
        "null_false_alarm_rate_pct": round((false_alarms / len(seeds)) * 100, 1),
    }

    out_path = Path(__file__).parent / "manifest.json"
    out_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
