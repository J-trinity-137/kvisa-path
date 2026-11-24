-- ============================================================================
-- kvisa-path 운영용 PostgreSQL / Supabase 통합 스키마
-- 핵심 원칙:
-- 1. Zero-Tracking: 실명·전화번호·외국인등록번호·체류자격(비자)·미등록 여부 컬럼 원천 배제
-- 2. opportunity(응답 기회) 중심 설계: 미응답(선택 편향)과 실제 혼란/오답 분리
-- 3. k-익명성 공개 뷰: 고유 응답자 10명 미만 셀 자동 마스킹
-- ============================================================================

create schema if not exists private_analytics;

-- 1. 가상/실제 학교 분리 (실제 NEIS 학교에 합성 성과 귀속 방지)
create table if not exists private_analytics.source_school (
  id uuid primary key default gen_random_uuid(),
  office_code text not null,
  neis_school_code text not null,
  district_code text not null,
  unique (office_code, neis_school_code)
);

create table if not exists private_analytics.school (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  source_school_id uuid references private_analytics.source_school(id),
  is_synthetic boolean not null default false
);

-- 2. 가명 참여자 (체류자격·국적·실명 컬럼 없음)
create table if not exists private_analytics.actor (
  id uuid primary key default gen_random_uuid(),
  role text not null check (role in ('student', 'guardian')),
  preferred_lang text not null,
  school_level text check (school_level in ('middle', 'high')),
  created_at timestamptz not null default now()
);

-- 3. 공공 Open API 스냅샷 이력 (NEIS·가족센터·통번역사 배치 고정)
create table if not exists private_analytics.api_snapshot (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  dataset text not null,
  request_hash text not null,
  fetched_at timestamptz not null default now(),
  source_as_of date,
  payload_hash text not null,
  payload jsonb not null,
  status text not null check (status in ('ok', 'error'))
);

-- 4. 응답 기회(opportunity) 및 이벤트(event)
create table if not exists private_analytics.opportunity (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references private_analytics.actor(id),
  school_id uuid references private_analytics.school(id),
  module text not null check (module in ('admission_term', 'doc_checklist', 'quiz', 'referral', 'free_question')),
  prompt_code text not null,
  due_day date not null,
  unique (actor_id, module, prompt_code, due_day)
);

create table if not exists private_analytics.event (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references private_analytics.opportunity(id),
  kind text not null,
  choice_code text,
  topic_code text,
  district text,
  lang text not null,
  day date not null default current_date,
  received_at timestamptz not null default now(),
  client_event_id text unique
);

-- 5. 교사·교육청 개입(intervention) 기록
create table if not exists private_analytics.intervention (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references private_analytics.school(id),
  target_term_id text not null,
  action_code text not null, -- 예: 'easy_term_card_deployed'
  starts_on date not null default current_date,
  created_at timestamptz not null default now()
);

-- 6. 교육청 공개용 k-익명성 뷰 (고유 참여자 10명 미만 자동 마스킹)
create or replace view public.v_district_referral_7d_public as
with ep as (
  select
    e.district,
    e.lang,
    count(distinct o.actor_id) as unique_actors,
    count(*) filter (where e.kind = 'referral_opened') as episodes,
    count(*) filter (where e.kind = 'referral_connected') as connected_7d,
    count(*) filter (where e.kind = 'referral_failed') as failed_reported
  from private_analytics.event e
  join private_analytics.opportunity o on o.id = e.opportunity_id
  where e.district is not null
  group by e.district, e.lang
)
select
  district,
  lang,
  case when unique_actors < 10 then null else episodes end as episodes,
  case when unique_actors < 10 then null else connected_7d end as connected_7d,
  case when unique_actors < 10 then null else failed_reported end as failed_reported,
  (unique_actors < 10) as is_masked
from ep;

-- 7. Row Level Security (원시 이벤트 테이블 직접 열람 차단)
alter table private_analytics.actor enable row level security;
alter table private_analytics.opportunity enable row level security;
alter table private_analytics.event enable row level security;
alter table private_analytics.intervention enable row level security;

-- 익명/인증 클라이언트는 public 집계 뷰만 조회하고, 원시 이벤트는 Edge Function을 통해 검증 적재
revoke all on schema private_analytics from anon, authenticated;
grant select on public.v_district_referral_7d_public to anon, authenticated;
