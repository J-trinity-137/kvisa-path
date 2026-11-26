import type { BackgroundType, InterestField, KoreanLevel } from '../data/admissionsData';
import type { DocBarrierReason, QuestionTopicCode } from '../data/interactiveModules';
import { EXTRA_DOCS, EXTRA_QUIZ } from './extraCopy';
import type { SupportedLangCode } from '../kbridge';

export interface TrackCopy {
  title: string;
  summary: string;
  requirements: string[];
  requiredDocs: string[];
  visaNote: string;
  gapHint: string;
}

export interface CoreCopy {
  backgrounds: Record<BackgroundType, string>;
  koreanLevels: Record<KoreanLevel, string>;
  fields: Record<InterestField, string>;
  levelMiddle: string;
  levelHigh: string;
  backgroundHeading: string;
  koreanHeading: string;
  fieldHeading: string;
  conditionsTitle: string;
  warningTitle: string;
  warnings: string[];
  matchedTitle: string;
  gapBadge: string;
  gapLead: string;
  requirementsLabel: string;
  docsLabel: string;
  termHint: string;
  legalLead: string;
  schoolsTitle: string;
  universitiesTitle: string;
  searchLabel: string;
  searchMiddle: string;
  searchHigh: string;
  majorsLead: string;
  gedHead: string;
  scholarshipTitle: string;
  noScholarship: string;
  unverified: string;
  verified: string;
  applies: string;
  apostilleTitle: string;
  apostilleStatus: Record<'apostille' | 'transition' | 'consular', string>;
  countries: Record<string, { name: string; guide: string }>;
  visaLead: string;
  referralTitle: string;
  counselNeed: string;
  counselDone: string;
  counselFail: string;
  interpreterMissing: string;
  interpreterZero: string;
  interpreterSome: string;
  speakTitle: string;
  disclaimer: string;
  sourceMissing: string;
  docsTitle: string;
  docsProgress: string;
  docDone: string;
  docMark: string;
  docHard: string;
  whereLead: string;
  tipLead: string;
  barrierPrompt: string;
  barriers: Record<DocBarrierReason, string>;
  quizTitle: string;
  quizLead: string;
  quizYes: string;
  quizNo: string;
  quizCorrect: string;
  quizWrong: string;
  explainLead: string;
  questionTitle: string;
  questionLabel: string;
  questionPlaceholder: string;
  questionSubmit: string;
  topicLead: string;
  topicSaved: string;
  scheduleTitle: string;
  schedules: Record<string, { title: string; target: string }>;
  careerTitle: string;
  jobsLead: string;
  majorsWord: string;
  career: Record<InterestField, { jobs: string; majors: string; note: string }>;
  guides: Record<QuestionTopicCode, string>;
  helpTitle: string;
  helpLead: string;
  centerSnapshot: string;
  tracks: Record<string, TrackCopy>;
  visa: Record<BackgroundType, { title: string; warning: string; nodes: { stage: string; desc: string }[] }>;
  quiz: Record<string, { question: string; explanation: string }>;
  docs: Record<string, { name: string; whereToGet: string; tip: string }>;
  scholarships: Record<string, { name: string; benefit: string; excludeRule: string }>;
}

const en: CoreCopy = {
  backgrounds: {
    both_foreign: 'Both parents are foreign nationals',
    multicultural: 'Marriage migrant / multicultural family',
    mid_entry: 'Entered school in Korea after living abroad',
    undocumented: 'Status not confirmed',
  },
  koreanLevels: {
    beginner: 'Beginner, no TOPIK',
    topik_3_4: 'TOPIK level 3–4',
    topik_5_6: 'TOPIK level 5–6',
  },
  fields: {
    it: 'IT / software',
    culinary: 'Cooking / tourism',
    design: 'Design',
    business: 'Business / trade',
    health: 'Health / nursing',
  },
  levelMiddle: 'Middle school (high-school admission)',
  levelHigh: 'High school (university and TOPIK scholarships)',
  backgroundHeading: 'Family background (not saved)',
  koreanHeading: 'Korean level',
  fieldHeading: 'Field of interest',
  conditionsTitle: '1. Choose your situation',
  warningTitle: 'Read this first: three common traps',
  warnings: [
    'GED trap: if a student with foreign nationality uses the Korean qualification exam (검정고시) instead of a regular high school, many pure-foreigner university tracks will not accept it. In this app every listed university is marked not accepted. Only Soongsil’s 2027 spring guide was re-checked.',
    'Meister high schools (마이스터고) cannot use the extra university quota for vocational-high-school graduates.',
    'High-school students on F-1, F-3, or D-4-3 are generally not allowed to work. Pay tuition only through the university’s official bank account.',
  ],
  matchedTitle: '2. Tracks you can apply for now',
  gapBadge: 'Possible after you fill a gap',
  gapLead: 'What is missing:',
  requirementsLabel: 'Main requirements',
  docsLabel: 'Documents to prepare',
  termHint: 'Tap a term you do not understand. Only the term code is saved on this device.',
  legalLead: 'Basis',
  schoolsTitle: '3. Seoul vocational and Meister high schools (checked school codes)',
  universitiesTitle: '3. TOPIK scholarships at Seoul universities',
  searchLabel: 'Search by school, major, or keyword',
  searchMiddle: 'Example: trade, tourism, software, Meister',
  searchHigh: 'Example: Soongsil, TOPIK, vocational',
  majorsLead: 'Majors',
  gedHead: 'GED (검정고시)',
  scholarshipTitle: 'Outside scholarships for the background you selected',
  noScholarship: 'If your stay is not yet regular, check a support route first, then the scholarship rules.',
  unverified: 'Not re-checked',
  verified: 'Checked',
  applies: 'Applies to',
  apostilleTitle: '4. How to certify school papers from your country',
  apostilleStatus: {
    apostille: 'Apostille applies',
    transition: 'Changing rules (check the submit date)',
    consular: 'Consular legalization required',
  },
  countries: {
    CN: {
      name: 'China (mainland)',
      guide: 'Apostille country. Use an apostille instead of an extra consular stamp.',
    },
    VN: {
      name: 'Vietnam',
      guide: 'The apostille convention took effect on 11 September 2026. Private-school papers are notarized locally, then apostilled.',
    },
    MN: {
      name: 'Mongolia',
      guide: 'Apostille country. Ask the foreign ministry of the country that issued the paper.',
    },
    RU: {
      name: 'Russia, Uzbekistan, Kazakhstan',
      guide: 'Apostille countries. Prepare an apostille and a notarized translation of the diploma and transcript.',
    },
    PH: {
      name: 'Philippines',
      guide: 'Apostille country (DFA Apostille). Also check the local notary step for private schools.',
    },
    BD: {
      name: 'Bangladesh',
      guide: 'The apostille convention took effect on 30 March 2025.',
    },
    TH: {
      name: 'Thailand',
      guide: 'Papers submitted before 28 February 2027 still need consular legalization. Apostille applies from 28 February 2027.',
    },
    KH: {
      name: 'Cambodia, Myanmar, Laos',
      guide: 'Not apostille countries. After the foreign ministry certifies the paper, get consular legalization.',
    },
  },
  visaLead: '5.',
  referralTitle: '6. Free interpreting help in your district',
  counselNeed: 'I need counseling',
  counselDone: 'Counseling connected',
  counselFail: 'Could not connect',
  interpreterMissing: 'No public count for this language. Use Danuri 1577-1366.',
  interpreterZero: 'None listed. Ask a nearby center or Danuri 1577-1366.',
  interpreterSome: 'listed. Call to ask if someone is free.',
  speakTitle: '7. Card to show a counselor',
  disclaimer:
    'Rules change. Before you apply or change your stay, check the university, adiga, and HiKorea. Rows marked “not re-checked” were not confirmed against the original notice in this update.',
  sourceMissing: 'No specific official page was confirmed for this item.',
  docsTitle: '1. My document checklist',
  docsProgress: 'done',
  docDone: 'Done',
  docMark: 'Mark done',
  docHard: 'Hard to get',
  whereLead: 'Where',
  tipLead: 'Tip',
  barrierPrompt: 'What is the hardest part? Only the reason code is saved.',
  barriers: {
    overseas: 'Hard to get from abroad',
    cost: 'Translation or notary cost',
    format: 'I do not know the form',
    deadline: 'Not enough time',
  },
  quizTitle: '2. One-minute true / false check',
  quizLead: 'Four common points of confusion. Your first answer is stored only as correct or wrong.',
  quizYes: 'True',
  quizNo: 'False',
  quizCorrect: 'Correct',
  quizWrong: 'Not quite. Answer:',
  explainLead: 'Why',
  questionTitle: '3. One-line question',
  questionLabel: 'Ask one question. Do not type your name, phone number, or alien-registration number.',
  questionPlaceholder: 'Example: Can I apply with the GED? Where are scholarships?',
  questionSubmit: 'See a guide',
  topicLead: 'Topic',
  topicSaved: 'Only the topic code is saved. The sentence is not.',
  scheduleTitle: '4. Exam and admission dates',
  schedules: {
    'sched-meister-apply': { title: 'Seoul Meister high school applications', target: 'Grade 9' },
    'sched-voc-apply': { title: 'Seoul vocational high school, special admission', target: 'Grade 9' },
    'sched-voc-interview': { title: 'Seoul vocational high school interviews', target: 'Grade 9' },
    'sched-topik-109': { title: '109th TOPIK I·II (paper test)', target: 'All students' },
    'sched-topik-110': { title: '110th TOPIK I·II (paper test)', target: 'All students' },
    'sched-foreign-early-2028': { title: '2028 overseas Korean / foreigner track (July window)', target: 'Grade 12' },
    'sched-susi-2028': { title: '2028 early admission applications', target: 'Grade 12' },
  },
  careerTitle: 'Jobs and majors by field',
  jobsLead: 'Example jobs',
  majorsWord: 'Related majors',
  career: {
    it: {
      jobs: 'Software developer, security specialist, data analyst',
      majors: 'Computer engineering (컴퓨터공학), software, artificial intelligence',
      note: 'This field is often used for professional work visas. Confirm the current visa rules separately.',
    },
    culinary: {
      jobs: 'Hotel cook, tour guide, hotel staff',
      majors: 'Culinary arts (조리학), tourism, food service',
      note: 'Speaking your home language and Korean is a real advantage.',
    },
    design: {
      jobs: 'UI/UX designer, motion designer, brand designer',
      majors: 'Visual design (시각디자인), digital media, film',
      note: 'Portfolios matter, so a written Korean exam is often a smaller part of the review.',
    },
    business: {
      jobs: 'Overseas sales, trade and logistics, finance clerk',
      majors: 'International trade (국제통상), business',
      note: 'Companies that trade with your home country often want bilingual staff.',
    },
    health: {
      jobs: 'Nurse, medical coordinator, dental hygienist',
      majors: 'Nursing (간호학), health administration, dental hygiene',
      note: 'National licenses are required for many of these jobs.',
    },
  },
  guides: {
    ged: 'Passing the Korean GED (검정고시) is treated as the same level of schooling as high-school graduation. University “both parents foreign” tracks are different: the universities in this app’s table are marked as not accepting the GED. Only Soongsil’s spring 2027 guide was checked and it says GED is not accepted. Check each guide again.',
    scholarship:
      'Korean-citizen students look at national and multicultural scholarships. Foreign students look at each university’s TOPIK scholarship. At Soongsil, TOPIK 3/4/5/6 is 40/60/80/100 percent, and only for the first semester. Other universities in the table were not re-checked.',
    part_time:
      'Students with foreign nationality usually need permission before they work. Ask the school’s international office first. The sentence you typed is not saved.',
    visa_status:
      'After a university accepts you, check on HiKorea whether you must change to a student stay. If your stay is uncertain, call a family center or Danuri 1577-1366. Your sentence and visa status are not saved.',
    documents:
      'Foreign transcripts usually need an apostille or consular legalization. They can take many weeks, so start early.',
    other: 'The sentence is not saved. Only a topic code stays on this device. For a real answer, call your district family center or Danuri 1577-1366.',
  },
  helpTitle: 'Official help',
  helpLead: 'These links were opened and checked on 26 Nov 2026. District phone numbers already on this page were not re-checked one by one.',
  centerSnapshot: 'The phone number and interpreter count below are an older snapshot. Confirm before you visit.',
  tracks: {
    'hs-special-2c': {
      title: 'Seoul high-school special admission, type 2-da (foreign student)',
      summary:
        'A foreign student who transferred into a Korean middle school and will graduate can be admitted outside the normal quota, within 2% at each school. This description was not tied to one confirmed notice in this update.',
      requirements: [
        'You studied abroad, then transferred into a Korean middle school and will graduate.',
        'You pass Seoul’s special-admission review. The review runs more than once a year; confirm the current notice.',
      ],
      requiredDocs: [
        'Special-admission review form',
        'Foreign school transcript and enrollment certificate (apostille or consular stamp)',
        'Alien-registration facts for you and your parents',
        'Entry and exit record',
      ],
      visaNote: 'Apostille or consular stamps can take 2–6 weeks. Start around early July of grade 9.',
      gapHint: 'If you never studied at a foreign school, look at the vocational-school future-talent track below.',
    },
    'hs-vocational-future': {
      title: 'Seoul vocational high school: future-talent and social-integration tracks',
      summary:
        'The future-talent track does not use subject grades. It looks at attendance, service, and an interview, so it is often the most open door. For 2027 entry, the special-application window was 23–24 November 2026.',
      requirements: [
        'Special admission: 23–24 Nov 2026. General admission: 30 Nov–1 Dec 2026. These dates are from the Seoul education notice.',
        'If you later want the university quota for vocational graduates, choose a vocational high school (특성화고), not a Meister high school (마이스터고).',
      ],
      requiredDocs: [
        'Application (online for Seoul middle-school students; in person for GED or other cities)',
        'Middle-school record or GED pass certificate',
        'Social-diversity papers only if your household is at or below 160% of the median income',
      ],
      visaNote: 'A separate work-visa route exists for some long-stay graduates. Confirm it on HiKorea; do not assume it from this page.',
      gapHint: 'This is the high-school track open to every background and Korean level in this app.',
    },
    'univ-foreign-parents': {
      title: 'University track: student and both parents are foreign nationals',
      summary:
        'If you and both parents are foreign nationals, many universities admit you with documents, an interview, and TOPIK, outside the normal quota. The GED is marked not accepted at every university in this app. Only Soongsil’s guide was re-checked.',
      requirements: [
        'You and both parents are foreign nationals. Rules for one parent or dual nationality differ by university.',
        'A regular high-school diploma, plus the TOPIK level that university asks for.',
      ],
      requiredDocs: [
        'Regular high-school diploma and transcript (apostille or consular stamp)',
        'Notarized family papers',
        'TOPIK score still inside its two-year validity',
        'Bank balance only if you need a D-2 visa. Many F-status holders are exempt.',
      ],
      visaNote: 'Pay tuition only through the university’s official account.',
      gapHint: 'If your Korean is still beginner level, reach the TOPIK level that your target university publishes before you apply.',
    },
    'univ-multicultural-eq': {
      title: 'University equal-opportunity track for multicultural families',
      summary:
        'This is for a Korean citizen whose family fits the Multicultural Families Act, usually through a marriage migrant or naturalized parent. If both parents are foreign nationals, use the foreigner track instead. University details here were not re-checked.',
      requirements: [
        'You are a Korean citizen who fits the multicultural-family rule. Both-parents-foreign students are not in this track.',
        'Check income limits and any test minimums in that university’s guide.',
      ],
      requiredDocs: ['School record', 'Family and marriage certificates', 'Basic certificate if there is a naturalization history'],
      visaNote: 'Korean citizens can look at national scholarships. Those scholarship pages were not re-checked in this update.',
      gapHint: 'Academic Korean around TOPIK 4 makes the document review easier.',
    },
    'univ-vocational-grad': {
      title: 'Extra quota for vocational high-school graduates in the same field',
      summary:
        'Some universities keep a small extra quota for vocational high-school graduates in a matching field. Meister graduates are excluded. The headcount examples in the Korean text were not re-checked against each guide.',
      requirements: [
        'You are graduating from a general vocational high school. Meister schools and general tracks inside mixed schools are excluded.',
        'Your major matches, or you completed the required vocational credits. The credit number changes under the later high-school credit system.',
      ],
      requiredDocs: ['Vocational high-school record', 'A same-field confirmation from the principal'],
      visaNote: 'Some shorter college programs link to a work visa. Confirm the current rule on HiKorea.',
      gapHint: 'Keep the vocational credit requirement and the TOPIK level together.',
    },
  },
  visa: {
    both_foreign: {
      title: 'Path for a student whose parents are foreign nationals',
      warning: 'The background you tap is not saved. High-school students on F-1, F-3, or D-4-3 are generally not allowed to work part-time.',
      nodes: [
        { stage: 'Work after high school (7+ years in Korea)', desc: 'A score-exempt job-seeking stay and a work status can be possible without university if age, years in Korea, and schooling match the rule. Confirm on HiKorea.' },
        { stage: 'College or university', desc: 'A change to D-2 is often required. Some F statuses are exempt. A linked technical program can have different work-hour rules.' },
        { stage: 'After graduation', desc: 'Job-seeking stay rules were expanded in 2025. Check the current length and TOPIK condition before you rely on them.' },
        { stage: 'Work and longer stay', desc: 'Work-visa salary floors and the F-2-R Korean requirement have changed. Use the current HiKorea rule, not this summary.' },
      ],
    },
    multicultural: {
      title: 'Path for a student in an international-marriage family',
      warning: 'If you have Korean citizenship, visa limits usually do not apply. You can look at equal-opportunity admission and Korean scholarships.',
      nodes: [
        { stage: 'Middle school to high school', desc: 'Seoul vocational future-talent (no subject grades, interview-centered) or a general high school.' },
        { stage: 'High school', desc: 'Keep your home language and Korean, and the vocational credits if you chose a vocational school.' },
        { stage: 'University', desc: 'Equal-opportunity or the vocational-graduate quota. University counts on this page were not re-checked.' },
      ],
    },
    mid_entry: {
      title: 'Path after moving to Korea during school age',
      warning: 'A foreign student who chooses the Korean GED can be blocked from pure-foreigner university tracks. New vocational-school student visas from abroad were reported as paused; confirm before you plan on one.',
      nodes: [
        { stage: 'Enter a Korean school', desc: 'China and Vietnam (from 11 Sep 2026) use apostille. Thailand before 28 Feb 2027, and Cambodia, still need consular legalization.' },
        { stage: 'High school', desc: 'The outside-quota special admission, or the vocational future-talent track.' },
        { stage: 'College or university', desc: 'A regular high-school diploma plus the pure-foreigner track, or a linked technical college. Check each guide.' },
      ],
    },
    undocumented: {
      title: 'Support route when a long stay was never registered',
      warning: 'This choice is not saved on any server. Public schools do not have a duty to report you to immigration for enrollment.',
      nodes: [
        { stage: 'Who can be considered', desc: 'The relief rules use years lived in Korea and school enrollment. Confirm the current dates and the 2028 end date on an official page before you rely on them.' },
        { stage: 'Stay for the child and siblings', desc: 'A study status can cover school, and a later rule can cover minor siblings. This summary was not re-checked against the latest notice.' },
        { stage: 'Parents', desc: 'A parent who is actually raising the child may receive a temporary stay and a reduced penalty. Get legal help; do not decide from this card alone.' },
        { stage: 'After high school', desc: 'University, job search, or a work status may become possible. HiKorea and a family center should confirm the step.' },
      ],
    },
  },
  quiz: {
    'quiz-1': {
      question: 'The outside-quota track for two foreign parents competes directly with Korean students in the normal quota.',
      explanation: 'Outside-quota admission is separate from the normal seats, so you are not in the same competition.',
    },
    'quiz-2': {
      question: 'A child whose stay is not confirmed can still enter a Korean public school if residence can be shown.',
      explanation: 'The school enrollment rule protects the right to education, and public-school staff are not required to report the child to immigration.',
    },
    'quiz-3': {
      question: 'After you enter a university, a dependent visa continues automatically, so you never change status.',
      explanation: 'You usually need the standard admission certificate and must check a change to a student stay (D-2).',
    },
    'quiz-4': {
      question: 'Seoul vocational future-talent admission uses middle-school grades for 100% of the decision.',
      explanation: 'It looks at the wish to work or start a business, attendance, and an interview, not grades alone.',
    },
  },
  docs: {
    'doc-apostille': {
      name: 'Apostille or consular stamp',
      whereToGet: 'The foreign ministry of the issuing country, or a consular section',
      tip: 'It can take 2–6 weeks. Start about two months before the deadline.',
    },
    'doc-transcript': {
      name: 'Full foreign-school transcript and enrollment certificate',
      whereToGet: 'The school abroad, plus a Korean or English notarized translation',
      tip: 'Check that dates and grade levels are printed.',
    },
    'doc-topik': {
      name: 'TOPIK score report',
      whereToGet: 'The official TOPIK site (topik.go.kr)',
      tip: 'The score is valid for two years from the result date.',
    },
    'doc-finance': {
      name: 'Proof of money (bank balance)',
      whereToGet: 'Your bank or a parent’s bank. A scholarship letter can sometimes replace it.',
      tip: 'The amount and the “issued within 30 days” rule differ by university.',
    },
    'doc-family': {
      name: 'Family papers',
      whereToGet: 'Government24, a community center, or a notarized foreign family record',
      tip: 'If someone naturalized, also get the detailed basic certificate.',
    },
  },
  scholarships: {
    kosaf: {
      name: 'National scholarship (Korea Student Aid Foundation)',
      benefit: 'Tuition support that depends on the income bracket',
      excludeRule: 'For Korean-citizen students. Students whose parents are both foreign are generally outside it. Not re-checked.',
    },
    woori: {
      name: 'Woori Multicultural Scholarship Foundation',
      benefit: 'A fixed grant by school level for households at or below median income. Not re-checked.',
      excludeRule: 'The old note says both-parents-foreign families and North Korean defectors cannot apply. Not re-checked.',
    },
    myungin: {
      name: 'Myungin Multicultural Scholarship',
      benefit: 'A living-cost grant for university students. Not re-checked.',
      excludeRule: 'The old note excludes both-parents-foreign families and the first and last semesters. Not re-checked.',
    },
    gks: {
      name: 'Korean Government Scholarship (GKS)',
      benefit: 'Tuition and a living stipend. A high TOPIK score can skip the language year. Not re-checked.',
      excludeRule: 'For foreign students entering a degree. Read the embassy and university calls. Not re-checked.',
    },
    sdream: {
      name: 'Samsung Dream Scholarship, global hope',
      benefit: 'Tuition plus a monthly stipend at partner universities, with a TOPIK condition. Not re-checked.',
      excludeRule: 'The old note says a student who attended even one semester of Korean school cannot apply. Not re-checked.',
    },
  },
};

function zh(kind: 'hans' | 'hant'): CoreCopy {
  const s = kind === 'hant';
  const t = (hans: string, hant: string) => (s ? hant : hans);
  return {
    backgrounds: {
      both_foreign: t('父母都是外国国籍', '父母都是外國國籍'),
      multicultural: t('国际婚姻·多元文化家庭', '國際婚姻·多元文化家庭'),
      mid_entry: t('中途来韩上学', '中途來韓上學'),
      undocumented: t('停留情况尚未确认', '停留情形尚未確認'),
    },
    koreanLevels: {
      beginner: t('初级，还没有 TOPIK', '初級，還沒有 TOPIK'),
      topik_3_4: 'TOPIK 3–4级',
      topik_5_6: 'TOPIK 5–6级',
    },
    fields: {
      it: t('信息技术 / 软件', '資訊技術 / 軟體'),
      culinary: t('烹饪 / 观光', '烹飪 / 觀光'),
      design: t('设计', '設計'),
      business: t('经营 / 贸易', '經營 / 貿易'),
      health: t('保健 / 护理', '保健 / 護理'),
    },
    levelMiddle: t('初中（高中入学）', '國中（高中入學）'),
    levelHigh: t('高中（大学与 TOPIK 奖学金）', '高中（大學與 TOPIK 獎學金）'),
    backgroundHeading: t('家庭背景（不会保存）', '家庭背景（不會保存）'),
    koreanHeading: t('韩语水平', '韓語程度'),
    fieldHeading: t('感兴趣的方向', '感興趣的方向'),
    conditionsTitle: t('1. 选择我的情况', '1. 選擇我的情況'),
    warningTitle: t('先看这三件容易踩坑的事', '先看這三件容易踩坑的事'),
    warnings: [
      t(
        '检定考试（검정고시）：外国国籍学生如果用检定考试代替正规高中毕业，很多“父母都是外国人”的大学专项不收。本应用列表里的大学都标成不收。这次只核对了崇实大学 2027 年第一学期简章。',
        '檢定考試（검정고시）：外國國籍學生如果用檢定考試代替正規高中畢業，很多「父母都是外國人」的大學專項不收。本應用列表裡的大學都標成不收。這次只核對了崇實大學 2027 年第一學期簡章。',
      ),
      t('Meister 高中（마이스터고）不能报大学“特性化高中毕业生”的额外名额。', 'Meister 高中（마이스터고）不能報大學「特性化高中畢業生」的額外名額。'),
      t('F-1、F-3、D-4-3 的高中生原则上不能打工。学费只付到大学的官方账户。', 'F-1、F-3、D-4-3 的高中生原則上不能打工。學費只付到大學的官方帳戶。'),
    ],
    matchedTitle: t('2. 现在可以申请的途径', '2. 現在可以申請的途徑'),
    gapBadge: t('补上条件后可以申请', '補上條件後可以申請'),
    gapLead: t('还缺什么：', '還缺什麼：'),
    requirementsLabel: t('主要条件', '主要條件'),
    docsLabel: t('要准备的材料', '要準備的材料'),
    termHint: t('看不懂的词可以点开。这台设备只保存词的代码。', '看不懂的詞可以點開。這台裝置只保存詞的代碼。'),
    legalLead: t('依据', '依據'),
    schoolsTitle: t('3. 首尔特性化高中与 Meister 高中（已核对学校代码）', '3. 首爾特性化高中與 Meister 高中（已核對學校代碼）'),
    universitiesTitle: t('3. 首尔大学的 TOPIK 奖学金', '3. 首爾大學的 TOPIK 獎學金'),
    searchLabel: t('按学校、专业或关键词搜索', '按學校、科系或關鍵詞搜尋'),
    searchMiddle: t('例如：贸易、观光、软件', '例如：貿易、觀光、軟體'),
    searchHigh: t('例如：崇实大学、TOPIK', '例如：崇實大學、TOPIK'),
    majorsLead: t('专业', '科系'),
    gedHead: t('检定考试（검정고시）', '檢定考試（검정고시）'),
    scholarshipTitle: t('按你选的背景筛选的校外资助', '按你選的背景篩選的校外資助'),
    noScholarship: t('停留还不稳定时，先看救济途径，再看奖学金条件。', '停留還不穩定時，先看協助途徑，再看獎學金條件。'),
    unverified: t('这次未核对原文', '這次未核對原文'),
    verified: t('已核对', '已核對'),
    applies: t('适用', '適用'),
    apostilleTitle: t('4. 海外学历文件怎么认证', '4. 海外學歷文件怎麼認證'),
    apostilleStatus: {
      apostille: t('可用海牙认证（아포스티유）', '可用海牙認證（아포스티유）'),
      transition: t('规则更换中（看提交日期）', '規則更換中（看提交日期）'),
      consular: t('必须领事认证', '必須領事認證'),
    },
    countries: {
      CN: { name: t('中国（内地）', '中國（內地）'), guide: t('海牙认证国家。不必再做多余的领事确认。', '海牙認證國家。不必再做多餘的領事確認。') },
      VN: { name: t('越南', '越南'), guide: t('海牙公约于 2026 年 9 月 11 日生效。私立学校文件先在当地公证，再做海牙认证。', '海牙公約於 2026 年 9 月 11 日生效。私立學校文件先在當地公證，再做海牙認證。') },
      MN: { name: t('蒙古', '蒙古'), guide: t('海牙认证国家。向发证国外交部申请。', '海牙認證國家。向發證國外交部申請。') },
      RU: { name: t('俄罗斯、乌兹别克、哈萨克', '俄羅斯、烏茲別克、哈薩克'), guide: t('海牙认证国家。毕业证和成绩单要海牙认证，并做翻译公证。', '海牙認證國家。畢業證和成績單要海牙認證，並做翻譯公證。') },
      PH: { name: t('菲律宾', '菲律賓'), guide: t('海牙认证国家（DFA）。私立学校还要确认当地公证。', '海牙認證國家（DFA）。私立學校還要確認當地公證。') },
      BD: { name: t('孟加拉', '孟加拉'), guide: t('海牙公约于 2025 年 3 月 30 日生效。', '海牙公約於 2025 年 3 月 30 日生效。') },
      TH: { name: t('泰国', '泰國'), guide: t('2027 年 2 月 28 日之前提交仍要领事认证。此后用海牙认证。', '2027 年 2 月 28 日之前提交仍要領事認證。此後用海牙認證。') },
      KH: { name: t('柬埔寨、缅甸、老挝', '柬埔寨、緬甸、寮國'), guide: t('不是海牙认证国家。外交部认证后，还要领事认证。', '不是海牙認證國家。外交部認證後，還要領事認證。') },
    },
    visaLead: '5.',
    referralTitle: t('6. 我们所在区的免费传译咨询', '6. 我們所在區的免費傳譯諮詢'),
    counselNeed: t('我需要咨询', '我需要諮詢'),
    counselDone: t('已经连上咨询', '已經連上諮詢'),
    counselFail: t('没有连上', '沒有連上'),
    interpreterMissing: t('没有这一语言的公开人数。请打多文化热线 1577-1366。', '沒有這一語言的公開人數。請打多元文化熱線 1577-1366。'),
    interpreterZero: t('名单上是 0 人。请联系附近中心或 1577-1366。', '名單上是 0 人。請聯繫附近中心或 1577-1366。'),
    interpreterSome: t('人。是否能预约，请打电话确认。', '人。是否能預約，請打電話確認。'),
    speakTitle: t('7. 给升学老师看的卡片', '7. 給升學老師看的卡片'),
    disclaimer: t(
      '规定每年会变。报名前请看大学、어디가和 HiKorea。标成“未核对”的格子，这次没有对照原始公告。',
      '規定每年會變。報名前請看大學、어디가和 HiKorea。標成「未核對」的格子，這次沒有對照原始公告。',
    ),
    sourceMissing: t('这一项没有确认到具体的官方页面。', '這一項沒有確認到具體的官方頁面。'),
    docsTitle: t('1. 我的材料清单', '1. 我的材料清單'),
    docsProgress: t('完成', '完成'),
    docDone: t('已完成', '已完成'),
    docMark: t('标成完成', '標成完成'),
    docHard: t('很难拿到', '很難拿到'),
    whereLead: t('去哪里办', '去哪裡辦'),
    tipLead: t('提示', '提示'),
    barrierPrompt: t('最难的是哪一点？只保存原因代码。', '最難的是哪一點？只保存原因代碼。'),
    barriers: {
      overseas: t('国外不好办理', '國外不好辦理'),
      cost: t('翻译、公证费用', '翻譯、公證費用'),
      format: t('不知道表格和步骤', '不知道表格和步驟'),
      deadline: t('时间不够', '時間不夠'),
    },
    quizTitle: t('2. 一分钟对错题', '2. 一分鐘對錯題'),
    quizLead: t('四个容易搞错的规则。只保存第一次是对还是错。', '四個容易搞錯的規則。只保存第一次是對還是錯。'),
    quizYes: t('对', '對'),
    quizNo: t('不对', '不對'),
    quizCorrect: t('答对了', '答對了'),
    quizWrong: t('不是这个。答案：', '不是這個。答案：'),
    explainLead: t('说明', '說明'),
    questionTitle: t('3. 用一句话提问', '3. 用一句話提問'),
    questionLabel: t('写一个问题。不要写姓名、电话或外国人登录号。', '寫一個問題。不要寫姓名、電話或外國人登錄號。'),
    questionPlaceholder: t('例如：检定考试可以报外国人专项吗？', '例如：檢定考試可以報外國人專項嗎？'),
    questionSubmit: t('看说明', '看說明'),
    topicLead: t('主题', '主題'),
    topicSaved: t('只保存主题代码，不保存你写的句子。', '只保存主題代碼，不保存你寫的句子。'),
    scheduleTitle: t('4. 考试和招生日期', '4. 考試和招生日期'),
    schedules: {
      'sched-meister-apply': { title: t('首尔 Meister 高中报名', '首爾 Meister 高中報名'), target: t('初三', '國三') },
      'sched-voc-apply': { title: t('首尔特性化高中特别招生报名', '首爾特性化高中特別招生報名'), target: t('初三', '國三') },
      'sched-voc-interview': { title: t('首尔特性化高中特别招生面试', '首爾特性化高中特別招生面試'), target: t('初三', '國三') },
      'sched-topik-109': { title: t('第109届 TOPIK I·II（纸笔）', '第109屆 TOPIK I·II（紙筆）'), target: t('全体', '全體') },
      'sched-topik-110': { title: t('第110届 TOPIK I·II（纸笔）', '第110屆 TOPIK I·II（紙筆）'), target: t('全体', '全體') },
      'sched-foreign-early-2028': { title: t('2028学年外国人等专项（7月窗口）', '2028學年外國人等專項（7月窗口）'), target: t('高三', '高三') },
      'sched-susi-2028': { title: t('2028学年随时招生报名', '2028學年隨時招生報名'), target: t('高三', '高三') },
    },
    careerTitle: t('按方向看的职业和专业', '按方向看的職業和科系'),
    jobsLead: t('例子职业', '例子職業'),
    majorsWord: t('相关专业', '相關科系'),
    career: {
      it: { jobs: t('软件开发、信息安全、数据分析', '軟體開發、資訊安全、數據分析'), majors: t('计算机工学（컴퓨터공학）、软件、人工智能', '電腦工程（컴퓨터공학）、軟體、人工智慧'), note: t('这个方向常被提到专业就业签证，具体以现行规定为准。', '這個方向常被提到專業就業簽證，具體以現行規定為準。') },
      culinary: { jobs: t('酒店厨师、导游、酒店服务', '飯店廚師、導遊、飯店服務'), majors: t('烹饪（조리학）、观光、餐饮', '烹飪（조리학）、觀光、餐飲'), note: t('母语加韩语是面试和就业的优势。', '母語加韓語是面試和就業的優勢。') },
      design: { jobs: t('界面设计、影像、品牌设计', '介面設計、影像、品牌設計'), majors: t('视觉设计（시각디자인）、数字媒体', '視覺設計（시각디자인）、數位媒體'), note: t('作品集比重高，韩语笔试压力相对小。', '作品集比重高，韓語筆試壓力相對小。') },
      business: { jobs: t('海外营业、贸易物流、金融事务', '海外營業、貿易物流、金融事務'), majors: t('国际贸易（국제통상）、经营', '國際貿易（국제통상）、經營'), note: t('和母语国家做贸易的岗位需要双语人才。', '和母語國家做貿易的崗位需要雙語人才。') },
      health: { jobs: t('护士、医疗协调、牙科卫生', '護理師、醫療協調、牙科衛生'), majors: t('护理（간호학）、保健行政', '護理（간호학）、保健行政'), note: t('很多岗位需要国家执照。', '很多崗位需要國家證照。') },
    },
    guides: {
      ged: t('检定考试合格在韩国等于高中毕业学历。但是“父母都是外国人”的大学专项常常不收，本表全部标成不收。这次只确认崇实大学 2027 年第一学期简章写明不收。其他学校请再看简章。', '檢定考試合格在韓國等於高中畢業學歷。但是「父母都是外國人」的大學專項常常不收，本表全部標成不收。這次只確認崇實大學 2027 年第一學期簡章寫明不收。其他學校請再看簡章。'),
      scholarship: t('韩国国籍看国家奖学金和多元文化奖学金。外国国籍看各大学 TOPIK 奖学金。崇实大学 3/4/5/6 级是 40/60/80/100%，而且只在入学后的第一学期。其他大学这次没有核对原文。', '韓國國籍看國家獎學金和多元文化獎學金。外國國籍看各大學 TOPIK 獎學金。崇實大學 3/4/5/6 級是 40/60/80/100%，而且只在入學後的第一學期。其他大學這次沒有核對原文。'),
      part_time: t('外国国籍学生打工前通常要先获准。先问学校国际处。你写的句子不会被保存。', '外國國籍學生打工前通常要先獲准。先問學校國際處。你寫的句子不會被保存。'),
      visa_status: t('拿到大学录取后，到 HiKorea 确认要不要改成留学停留。停留不稳定时，打家庭中心或多文化热线 1577-1366。句子和签证种类都不会保存。', '拿到大學錄取後，到 HiKorea 確認要不要改成留學停留。停留不穩定時，打家庭中心或多元文化熱線 1577-1366。句子和簽證種類都不會保存。'),
      documents: t('海外成绩单通常要海牙认证或领事认证。办理要几周，请提前准备。', '海外成績單通常要海牙認證或領事認證。辦理要幾週，請提前準備。'),
      other: t('句子不会保存，只在这台设备留下主题代码。具体问题请打本区家庭中心或 1577-1366。', '句子不會保存，只在這台裝置留下主題代碼。具體問題請打本區家庭中心或 1577-1366。'),
    },
    helpTitle: t('官方帮助', '官方幫助'),
    helpLead: t('这些链接在 2026-11-26 打开确认过。页面上各区电话没有逐个重核。', '這些連結在 2026-11-26 打開確認過。頁面上各區電話沒有逐個重核。'),
    centerSnapshot: t('下面的电话和传译人数是旧快照，去之前请再确认。', '下面的電話和傳譯人數是舊快照，去之前請再確認。'),
    tracks: {
      'hs-special-2c': {
        title: t('首尔高中特例入学（类型 2-다，外国学生）', '首爾高中特例入學（類型 2-다，外國學生）'),
        summary: t('在国外读过书、再转入韩国初中并即将毕业的外国学生，可以在普通名额之外、各校 2% 以内入学。这次没有把这段说明钉到某一份已核对的公告上。', '在國外讀過書、再轉入韓國國中並即將畢業的外國學生，可以在普通名額之外、各校 2% 以內入學。這次沒有把這段說明釘到某一份已核對的公告上。'),
        requirements: [
          t('国外学校就读后转入韩国初中，并即将毕业。', '國外學校就讀後轉入韓國國中，並即將畢業。'),
          t('通过首尔教育厅的特例审查。一年有多次，日期以最新公告为准。', '通過首爾教育廳的特例審查。一年有多次，日期以最新公告為準。'),
        ],
        requiredDocs: [
          t('特例审查申请书', '特例審查申請書'),
          t('外国学校成绩与在学证明（海牙认证或领事认证）', '外國學校成績與在學證明（海牙認證或領事認證）'),
          t('本人和父母的外国人登录事实证明', '本人和父母的外國人登錄事實證明'),
          t('出入境记录', '出入境紀錄'),
        ],
        visaNote: t('海牙认证或领事认证可能要 2 到 6 周。初三 7 月初就该开始。', '海牙認證或領事認證可能要 2 到 6 週。國三 7 月初就該開始。'),
        gapHint: t('如果没有国外学校经历，看下面的特性化高中未来人才专项。', '如果沒有國外學校經歷，看下面的特性化高中未來人才專項。'),
      },
      'hs-vocational-future': {
        title: t('首尔特性化高中：未来人才与社会统合专项', '首爾特性化高中：未來人才與社會統合專項'),
        summary: t('未来人才专项不看学科成绩，主要看出勤、志愿服务和面试，门槛相对开放。2027 学年特别报名是 2026 年 11 月 23–24 日。', '未來人才專項不看學科成績，主要看出勤、志願服務和面試，門檻相對開放。2027 學年特別報名是 2026 年 11 月 23–24 日。'),
        requirements: [
          t('特别招生：2026-11-23 至 24 日。一般招生：11-30 至 12-01。日期来自首尔教育厅公告。', '特別招生：2026-11-23 至 24 日。一般招生：11-30 至 12-01。日期來自首爾教育廳公告。'),
          t('如果以后想用大学的特性化高中额外名额，要选特性化高中（특성화고），不要选 Meister 高中（마이스터고）。', '如果以後想用大學的特性化高中額外名額，要選特性化高中（특성화고），不要選 Meister 高中（마이스터고）。'),
        ],
        requiredDocs: [
          t('入学申请（首尔初中生可在线；检定考试或其他城市到校提交）', '入學申請（首爾國中生可線上；檢定考試或其他城市到校提交）'),
          t('初中学生记录或检定考试合格证', '國中學生紀錄或檢定考試合格證'),
          t('只有家庭收入在中位收入 160% 以下时才需要社会多样性证明', '只有家庭收入在中位收入 160% 以下時才需要社會多樣性證明'),
        ],
        visaNote: t('长期停留毕业生另有就业签证途径。以 HiKorea 现行规定为准。', '長期停留畢業生另有就業簽證途徑。以 HiKorea 現行規定為準。'),
        gapHint: t('在这个应用里，这是各种背景和韩语水平都能看的高中途径。', '在這個應用裡，這是各種背景和韓語程度都能看的高中途徑。'),
      },
      'univ-foreign-parents': {
        title: t('大学专项：本人和父母都是外国国籍', '大學專項：本人和父母都是外國國籍'),
        summary: t('本人和父母都是外国国籍时，很多大学用材料、面试和 TOPIK 在普通名额之外录取。本表大学都标成不收检定考试。这次只重核了崇实大学。', '本人和父母都是外國國籍時，很多大學用材料、面試和 TOPIK 在普通名額之外錄取。本表大學都標成不收檢定考試。這次只重核了崇實大學。'),
        requirements: [
          t('本人和父母都是外国国籍。单亲或双重国籍要看各校。', '本人和父母都是外國國籍。單親或雙重國籍要看各校。'),
          t('正规高中毕业，并达到该校要求的 TOPIK。', '正規高中畢業，並達到該校要求的 TOPIK。'),
        ],
        requiredDocs: [
          t('正规高中毕业证和成绩单（海牙认证或领事认证）', '正規高中畢業證和成績單（海牙認證或領事認證）'),
          t('亲属关系公证', '親屬關係公證'),
          t('仍在两年有效期内的 TOPIK 成绩', '仍在兩年有效期內的 TOPIK 成績'),
          t('只有需要 D-2 签证时才交存款证明。许多 F 签证可免。', '只有需要 D-2 簽證時才交存款證明。許多 F 簽證可免。'),
        ],
        visaNote: t('学费只付到大学官方账户。', '學費只付到大學官方帳戶。'),
        gapHint: t('韩语还是初级时，先考到目标学校公布的 TOPIK 等级。', '韓語還是初級時，先考到目標學校公布的 TOPIK 等級。'),
      },
      'univ-multicultural-eq': {
        title: t('大学均等机会专项（多元文化家庭子女）', '大學均等機會專項（多元文化家庭子女）'),
        summary: t('给符合多元文化家庭法、通常持韩国国籍的学生。父母都是外国国籍时走外国人专项。各校细节这次没有重核。', '給符合多元文化家庭法、通常持韓國國籍的學生。父母都是外國國籍時走外國人專項。各校細節這次沒有重核。'),
        requirements: [
          t('韩国国籍，且符合多元文化家庭规定。父母都是外国人的不在这项。', '韓國國籍，且符合多元文化家庭規定。父母都是外國人的不在這項。'),
          t('收入上限和最低学力要看该校简章。', '收入上限和最低學力要看該校簡章。'),
        ],
        requiredDocs: [t('学校生活记录簿', '學校生活紀錄簿'), t('家族与婚姻关系证明', '家族與婚姻關係證明'), t('如有归化，附详细基本证明', '如有歸化，附詳細基本證明')],
        visaNote: t('韩国国籍可以看国家奖学金。那些页面这次没有重核。', '韓國國籍可以看國家獎學金。那些頁面這次沒有重核。'),
        gapHint: t('学业韩语到 TOPIK 4 级左右，材料会更有竞争力。', '學業韓語到 TOPIK 4 級左右，材料會更有競爭力。'),
      },
      'univ-vocational-grad': {
        title: t('特性化高中毕业生同系列额外名额', '特性化高中畢業生同系列額外名額'),
        summary: t('部分大学为对口专业的特性化高中毕业生留少量额外名额。Meister 高中除外。文中的人数例子没有逐校重核。', '部分大學為對口科系的特性化高中畢業生留少量額外名額。Meister 高中除外。文中的人數例子沒有逐校重核。'),
        requirements: [
          t('普通特性化高中毕业（预计）。Meister 高中和综合高中普通班除外。', '普通特性化高中畢業（預計）。Meister 高中和綜合高中普通班除外。'),
          t('专业对口，或修满规定的专业学分。以后的高中学分制会改数字。', '科系對口，或修滿規定的專業學分。以後的高中學分制會改數字。'),
        ],
        requiredDocs: [t('特性化高中学生记录', '特性化高中學生紀錄'), t('校长出具的同系列确认书', '校長出具的同系列確認書')],
        visaNote: t('有的专门大学课程连接就业签证。以 HiKorea 现行规定为准。', '有的專門大學課程連接就業簽證。以 HiKorea 現行規定為準。'),
        gapHint: t('专业学分和 TOPIK 等级要一起准备。', '專業學分和 TOPIK 等級要一起準備。'),
      },
    },
    visa: {
      both_foreign: {
        title: t('父母都是外国国籍的升学与就业路径', '父母都是外國國籍的升學與就業路徑'),
        warning: t('你点的背景不会被保存。F-1、F-3、D-4-3 高中生原则上不能打工。', '你點的背景不會被保存。F-1、F-3、D-4-3 高中生原則上不能打工。'),
        nodes: [
          { stage: t('高中毕业直接就业（在韩 7 年以上）', '高中畢業直接就業（在韓 7 年以上）'), desc: t('年龄、在韩年限和学历符合时，有可能不读大学就申请求职或就业停留。以 HiKorea 为准。', '年齡、在韓年限和學歷符合時，有可能不讀大學就申請求職或就業停留。以 HiKorea 為準。') },
          { stage: t('大学或专门大学', '大學或專門大學'), desc: t('常常要把停留改成 D-2。部分 F 签证可免。连接技工课程的打工时间不同。', '常常要把停留改成 D-2。部分 F 簽證可免。連接技工課程的打工時間不同。') },
          { stage: t('毕业后求职', '畢業後求職'), desc: t('2025 年求职停留有过放宽。年限和 TOPIK 条件请看现行规定。', '2025 年求職停留有過放寬。年限和 TOPIK 條件請看現行規定。') },
          { stage: t('就业与长期居留', '就業與長期居留'), desc: t('就业签证的最低工资和 F-2-R 的韩语要求会变。以 HiKorea 为准。', '就業簽證的最低工資和 F-2-R 的韓語要求會變。以 HiKorea 為準。') },
        ],
      },
      multicultural: {
        title: t('国际婚姻家庭学生的升学路径', '國際婚姻家庭學生的升學路徑'),
        warning: t('有韩国国籍时，通常没有签证限制，可以看均等机会招生和韩国奖学金。', '有韓國國籍時，通常沒有簽證限制，可以看均等機會招生和韓國獎學金。'),
        nodes: [
          { stage: t('初中到高中', '國中到高中'), desc: t('首尔特性化高中未来人才（不看学科成绩、重面试）或普通高中。', '首爾特性化高中未來人才（不看學科成績、重面試）或普通高中。') },
          { stage: t('高中', '高中'), desc: t('保持母语和韩语。选了特性化高中就要注意专业学分。', '保持母語和韓語。選了特性化高中就要注意專業學分。') },
          { stage: t('大学', '大學'), desc: t('均等机会或特性化高中毕业生名额。人数这次没有重核。', '均等機會或特性化高中畢業生名額。人數這次沒有重核。') },
        ],
      },
      mid_entry: {
        title: t('上学期间来到韩国的路径', '上學期間來到韓國的路徑'),
        warning: t('外国国籍学生如果改走检定考试，可能报不了“父母都是外国人”的专项。海外新招职业高中签证曾传出暂停，做计划前请再确认。', '外國國籍學生如果改走檢定考試，可能報不了「父母都是外國人」的專項。海外新招職業高中簽證曾傳出暫停，做計畫前請再確認。'),
        nodes: [
          { stage: t('进入韩国学校', '進入韓國學校'), desc: t('中国，以及 2026-09-11 起的越南，用海牙认证。2027-02-28 前的泰国和柬埔寨仍要领事认证。', '中國，以及 2026-09-11 起的越南，用海牙認證。2027-02-28 前的泰國和柬埔寨仍要領事認證。') },
          { stage: t('高中', '高中'), desc: t('名额外特例，或特性化高中未来人才专项。', '名額外特例，或特性化高中未來人才專項。') },
          { stage: t('大学或专门大学', '大學或專門大學'), desc: t('正规高中毕业后再看外国人专项，或连接技工的专门大学。各看简章。', '正規高中畢業後再看外國人專項，或連接技工的專門大學。各看簡章。') },
        ],
      },
      undocumented: {
        title: t('长期停留但没有登记时的协助途径', '長期停留但沒有登記時的協助途徑'),
        warning: t('这个选择不会保存到服务器。公立学校为了入学，没有向出入境通报的义务。', '這個選擇不會保存到伺服器。公立學校為了入學，沒有向出入境通報的義務。'),
        nodes: [
          { stage: t('谁可以申请协助', '誰可以申請協助'), desc: t('协助条件看在韩年限和在学。结束日期请以官方公告为准，不要只靠这张卡片。', '協助條件看在韓年限和在學。結束日期請以官方公告為準，不要只靠這張卡片。') },
          { stage: t('子女和兄弟姐妹的停留', '子女和兄弟姐妹的停留'), desc: t('读书期间可以有留学类停留，后来的规定也可能覆盖未成年兄弟姐妹。这次没有重核最新公告。', '讀書期間可以有留學類停留，後來的規定也可能覆蓋未成年兄弟姐妹。這次沒有重核最新公告。') },
          { stage: t('父母', '父母'), desc: t('实际抚养的父母可能获得临时停留和罚款减免。请找法律协助，不要只按这张卡片决定。', '實際撫養的父母可能獲得臨時停留和罰款減免。請找法律協助，不要只按這張卡片決定。') },
          { stage: t('高中毕业后', '高中畢業後'), desc: t('之后可能是大学、求职或就业停留。请让 HiKorea 或家庭中心确认。', '之後可能是大學、求職或就業停留。請讓 HiKorea 或家庭中心確認。') },
        ],
      },
    },
    quiz: {
      'quiz-1': {
        question: t('父母都是外国人的名额外专项，要和普通韩国学生直接竞争。', '父母都是外國人的名額外專項，要和普通韓國學生直接競爭。'),
        explanation: t('名额外招生和普通名额分开，不直接竞争。', '名額外招生和普通名額分開，不直接競爭。'),
      },
      'quiz-2': {
        question: t('停留还没确认的儿童，只要能证明住在这里，也可以上韩国的公立中小学。', '停留還沒確認的兒童，只要能證明住在這裡，也可以上韓國的公立中小學。'),
        explanation: t('入学规定保障受教育权，公立学校教职员没有通报出入境的义务。', '入學規定保障受教育權，公立學校教職員沒有通報出入境的義務。'),
      },
      'quiz-3': {
        question: t('考上大学后，家属签证会自动继续，不必改停留资格。', '考上大學後，家屬簽證會自動繼續，不必改停留資格。'),
        explanation: t('通常要拿标准入学许可，并确认是否改成留学停留 D-2。', '通常要拿標準入學許可，並確認是否改成留學停留 D-2。'),
      },
      'quiz-4': {
        question: t('首尔特性化高中的未来人才专项，100% 只看初中成绩。', '首爾特性化高中的未來人才專項，100% 只看國中成績。'),
        explanation: t('它看就业或创业意愿、出勤和面试，不只看成绩。', '它看就業或創業意願、出勤和面試，不只看成績。'),
      },
    },
    docs: {
      'doc-apostille': {
        name: t('海牙认证或领事认证', '海牙認證或領事認證'),
        whereToGet: t('发证国外交部，或领事部门', '發證國外交部，或領事部門'),
        tip: t('可能要 2 到 6 周。截止日前大约两个月开始。', '可能要 2 到 6 週。截止日前大約兩個月開始。'),
      },
      'doc-transcript': {
        name: t('外国学校全部成绩和在学证明', '外國學校全部成績和在學證明'),
        whereToGet: t('海外学校，并做韩文或英文翻译公证', '海外學校，並做韓文或英文翻譯公證'),
        tip: t('确认日期和年级有没有印上。', '確認日期和年級有沒有印上。'),
      },
      'doc-topik': {
        name: 'TOPIK 成绩单',
        whereToGet: t('TOPIK 官网 topik.go.kr', 'TOPIK 官網 topik.go.kr'),
        tip: t('成绩从公布日起两年有效。', '成績從公布日起兩年有效。'),
      },
      'doc-finance': {
        name: t('资金证明（银行存款）', '資金證明（銀行存款）'),
        whereToGet: t('本人或父母的银行。有时奖学金证明可以代替。', '本人或父母的銀行。有時獎學金證明可以代替。'),
        tip: t('金额和“30 天内签发”的要求因学校而异。', '金額和「30 天內簽發」的要求因學校而異。'),
      },
      'doc-family': {
        name: t('家庭关系材料', '家庭關係材料'),
        whereToGet: t('Government24、居民中心，或国外亲属公证', 'Government24、居民中心，或國外親屬公證'),
        tip: t('如果有归化，一并开详细基本证明。', '如果有歸化，一併開詳細基本證明。'),
      },
    },
    scholarships: {
      kosaf: {
        name: t('国家奖学金（韩国奖学财团）', '國家獎學金（韓國獎學財團）'),
        benefit: t('按收入区间补助学费', '按收入區間補助學費'),
        excludeRule: t('对象是韩国国籍大学生。父母都是外国人的通常不包括。这次未核对。', '對象是韓國國籍大學生。父母都是外國人的通常不包括。這次未核對。'),
      },
      woori: {
        name: t('友利多元文化奖学财团', '友利多元文化獎學財團'),
        benefit: t('按学校阶段发给、收入在中位数以下的定额奖学金。这次未核对。', '按學校階段發給、收入在中位數以下的定額獎學金。這次未核對。'),
        excludeRule: t('旧记录写父母都是外国人以及脱北居民不能申请。这次未核对。', '舊紀錄寫父母都是外國人以及脫北居民不能申請。這次未核對。'),
      },
      myungin: {
        name: t('名人多元文化奖学财团', '名人多元文化獎學財團'),
        benefit: t('大学生生活费奖学金。这次未核对。', '大學生生活費獎學金。這次未核對。'),
        excludeRule: t('旧记录排除父母都是外国人，以及入学第一学期和毕业前一学期。这次未核对。', '舊紀錄排除父母都是外國人，以及入學第一學期和畢業前一學期。這次未核對。'),
      },
      gks: {
        name: t('政府邀请外国人奖学金（GKS）', '政府邀請外國人獎學金（GKS）'),
        benefit: t('学费加生活费。TOPIK 高分可能免语言研修。这次未核对。', '學費加生活費。TOPIK 高分可能免語言研修。這次未核對。'),
        excludeRule: t('给读学位的外国学生。看使馆和大学招募。这次未核对。', '給讀學位的外國學生。看使館和大學招募。這次未核對。'),
      },
      sdream: {
        name: t('三星梦想奖学财团全球希望奖', '三星夢想獎學財團全球希望獎'),
        benefit: t('合作大学的学费加每月生活费，有 TOPIK 条件。这次未核对。', '合作大學的學費加每月生活費，有 TOPIK 條件。這次未核對。'),
        excludeRule: t('旧记录写在韩国中小学即使读过一个学期也不能申请。这次未核对。', '舊紀錄寫在韓國中小學即使讀過一個學期也不能申請。這次未核對。'),
      },
    },
  };
}

const vi: CoreCopy = {
  ...en,
  backgrounds: {
    both_foreign: 'Cả bố và mẹ là người nước ngoài',
    multicultural: 'Hôn nhân quốc tế / gia đình đa văn hóa',
    mid_entry: 'Vào học ở Hàn giữa chừng',
    undocumented: 'Tình trạng cư trú chưa xác nhận',
  },
  koreanLevels: {
    beginner: 'Sơ cấp, chưa có TOPIK',
    topik_3_4: 'TOPIK bậc 3–4',
    topik_5_6: 'TOPIK bậc 5–6',
  },
  fields: {
    it: 'CNTT / phần mềm',
    culinary: 'Nấu ăn / du lịch',
    design: 'Thiết kế',
    business: 'Kinh doanh / thương mại',
    health: 'Y tế / điều dưỡng',
  },
  levelMiddle: 'Trung học cơ sở (tuyển sinh cấp 3)',
  levelHigh: 'Trung học phổ thông (đại học và học bổng TOPIK)',
  backgroundHeading: 'Hoàn cảnh gia đình (không lưu)',
  koreanHeading: 'Trình độ tiếng Hàn',
  fieldHeading: 'Ngành quan tâm',
  conditionsTitle: '1. Chọn tình huống của tôi',
  warningTitle: 'Đọc trước: ba điểm dễ nhầm',
  warnings: [
    'Bẫy GED (검정고시): học sinh quốc tịch nước ngoài dùng kỳ thi tương đương thay cho tốt nghiệp THPT thường bị loại khỏi diện “cả bố mẹ là người nước ngoài”. Mọi trường trong bảng này đều ghi không nhận. Lần này chỉ đối chiếu hướng dẫn học kỳ xuân 2027 của Đại học Soongsil.',
    'Trường Meister (마이스터고) không được dùng chỉ tiêu riêng của đại học dành cho tốt nghiệp trường nghề thông thường.',
    'Học sinh THPT visa F-1, F-3 hoặc D-4-3 nói chung không được làm thêm. Học phí chỉ nộp vào tài khoản chính thức của trường.',
  ],
  matchedTitle: '2. Diện có thể nộp hiện nay',
  gapBadge: 'Nộp được sau khi bổ sung điều kiện',
  gapLead: 'Còn thiếu:',
  requirementsLabel: 'Điều kiện chính',
  docsLabel: 'Giấy tờ cần chuẩn bị',
  termHint: 'Bấm từ chưa hiểu. Máy này chỉ lưu mã của từ.',
  legalLead: 'Căn cứ',
  schoolsTitle: '3. Trường nghề và Meister ở Seoul (đã kiểm mã trường)',
  universitiesTitle: '3. Học bổng TOPIK ở các đại học Seoul',
  searchLabel: 'Tìm theo tên trường, ngành hoặc từ khóa',
  searchMiddle: 'Ví dụ: thương mại, du lịch, phần mềm',
  searchHigh: 'Ví dụ: Soongsil, TOPIK',
  majorsLead: 'Ngành',
  gedHead: 'Thi tương đương (검정고시)',
  scholarshipTitle: 'Học bổng bên ngoài theo hoàn cảnh đã chọn',
  noScholarship: 'Nếu cư trú chưa ổn định, hãy xem hướng hỗ trợ trước, rồi mới xem học bổng.',
  unverified: 'Chưa đối chiếu lại',
  verified: 'Đã kiểm',
  applies: 'Áp dụng',
  apostilleTitle: '4. Cách chứng nhận học bạ nước ngoài',
  apostilleStatus: {
    apostille: 'Dùng apostille (아포스티유)',
    transition: 'Đang đổi quy tắc (xem ngày nộp)',
    consular: 'Phải hợp pháp hóa lãnh sự',
  },
  countries: {
    CN: { name: 'Trung Quốc (đại lục)', guide: 'Nước apostille. Không cần thêm dấu lãnh sự thừa.' },
    VN: { name: 'Việt Nam', guide: 'Công ước apostille có hiệu lực từ 11/09/2026. Hồ sơ trường tư được công chứng tại chỗ, rồi apostille.' },
    MN: { name: 'Mông Cổ', guide: 'Nước apostille. Xin tại bộ ngoại giao nước cấp giấy.' },
    RU: { name: 'Nga, Uzbekistan, Kazakhstan', guide: 'Các nước apostille. Chuẩn bị apostille và bản dịch công chứng của bằng và bảng điểm.' },
    PH: { name: 'Philippines', guide: 'Nước apostille (DFA). Trường tư vẫn cần kiểm tra bước công chứng địa phương.' },
    BD: { name: 'Bangladesh', guide: 'Công ước apostille có hiệu lực từ 30/03/2025.' },
    TH: { name: 'Thái Lan', guide: 'Hồ sơ nộp trước 28/02/2027 vẫn cần hợp pháp hóa lãnh sự. Apostille áp dụng từ 28/02/2027.' },
    KH: { name: 'Campuchia, Myanmar, Lào', guide: 'Không phải nước apostille. Sau xác nhận của bộ ngoại giao, cần hợp pháp hóa lãnh sự.' },
  },
  referralTitle: '6. Thông dịch miễn phí tại quận của bạn',
  counselNeed: 'Tôi cần tư vấn',
  counselDone: 'Đã nối được tư vấn',
  counselFail: 'Không nối được',
  interpreterMissing: 'Không có số liệu công khai cho ngôn ngữ này. Gọi Danuri 1577-1366.',
  interpreterZero: 'Danh sách ghi 0 người. Hãy hỏi trung tâm gần đó hoặc 1577-1366.',
  interpreterSome: 'người. Hãy gọi để hỏi còn lịch không.',
  speakTitle: '7. Thẻ đưa cho giáo viên hướng nghiệp',
  disclaimer:
    'Quy định thay đổi. Trước khi nộp hồ sơ hoặc đổi cư trú, hãy xem trang trường, adiga và HiKorea. Ô “chưa đối chiếu” chưa được kiểm với văn bản gốc trong lần cập nhật này.',
  sourceMissing: 'Chưa xác nhận được một trang chính thức cụ thể cho mục này.',
  docsTitle: '1. Danh sách giấy tờ của tôi',
  docsProgress: 'xong',
  docDone: 'Đã xong',
  docMark: 'Đánh dấu xong',
  docHard: 'Khó xin',
  whereLead: 'Xin ở đâu',
  tipLead: 'Gợi ý',
  barrierPrompt: 'Khó nhất là gì? Chỉ lưu mã lý do.',
  barriers: {
    overseas: 'Khó xin từ nước ngoài',
    cost: 'Phí dịch và công chứng',
    format: 'Không rõ mẫu',
    deadline: 'Không đủ thời gian',
  },
  quizTitle: '2. Kiểm tra đúng/sai trong một phút',
  quizLead: 'Bốn điểm hay nhầm. Lần trả lời đầu chỉ được lưu là đúng hoặc sai.',
  quizYes: 'Đúng',
  quizNo: 'Sai',
  quizCorrect: 'Đúng',
  quizWrong: 'Chưa đúng. Đáp án:',
  explainLead: 'Vì sao',
  questionTitle: '3. Hỏi một câu',
  questionLabel: 'Viết một câu hỏi. Đừng ghi tên, số điện thoại hoặc số đăng ký người nước ngoài.',
  questionPlaceholder: 'Ví dụ: Thi tương đương có nộp được không?',
  questionSubmit: 'Xem hướng dẫn',
  topicLead: 'Chủ đề',
  topicSaved: 'Chỉ lưu mã chủ đề. Câu bạn gõ không được lưu.',
  scheduleTitle: '4. Ngày thi và ngày nộp hồ sơ',
  schedules: {
    'sched-meister-apply': { title: 'Nộp hồ sơ trường Meister Seoul', target: 'Lớp 9' },
    'sched-voc-apply': { title: 'Trường nghề Seoul, diện đặc biệt', target: 'Lớp 9' },
    'sched-voc-interview': { title: 'Phỏng vấn trường nghề Seoul', target: 'Lớp 9' },
    'sched-topik-109': { title: 'TOPIK lần 109 (thi giấy)', target: 'Mọi học sinh' },
    'sched-topik-110': { title: 'TOPIK lần 110 (thi giấy)', target: 'Mọi học sinh' },
    'sched-foreign-early-2028': { title: 'Diện người nước ngoài 2028 (cửa sổ tháng 7)', target: 'Lớp 12' },
    'sched-susi-2028': { title: 'Nộp hồ sơ sớm năm 2028', target: 'Lớp 12' },
  },
  careerTitle: 'Nghề và ngành theo hướng',
  jobsLead: 'Ví dụ nghề',
  majorsWord: 'Ngành liên quan',
  career: {
    it: { jobs: 'Lập trình, an ninh thông tin, phân tích dữ liệu', majors: 'Kỹ thuật máy tính (컴퓨터공학), phần mềm', note: 'Hướng này thường được nhắc với visa việc làm chuyên môn. Hãy kiểm quy định hiện hành.' },
    culinary: { jobs: 'Đầu bếp khách sạn, hướng dẫn viên, nhân viên khách sạn', majors: 'Nấu ăn (조리학), du lịch', note: 'Biết tiếng mẹ đẻ và tiếng Hàn là lợi thế.' },
    design: { jobs: 'Thiết kế giao diện, hình động, thương hiệu', majors: 'Thiết kế đồ họa (시각디자인), truyền thông số', note: 'Hồ sơ năng lực quan trọng, nên phần thi viết tiếng Hàn thường nhẹ hơn.' },
    business: { jobs: 'Kinh doanh quốc tế, logistics, văn phòng tài chính', majors: 'Thương mại quốc tế (국제통상), quản trị', note: 'Công ty giao thương với nước bạn thường cần người song ngữ.' },
    health: { jobs: 'Điều dưỡng, điều phối y tế, vệ sinh răng miệng', majors: 'Điều dưỡng (간호학), quản lý y tế', note: 'Nhiều việc cần chứng chỉ quốc gia.' },
  },
  guides: {
    ged: 'Đỗ kỳ thi tương đương Hàn Quốc (검정고시) được coi là cùng bậc với tốt nghiệp THPT. Diện đại học “cả bố mẹ là người nước ngoài” thì khác: các trường trong bảng đều ghi không nhận. Chỉ hướng dẫn học kỳ xuân 2027 của Soongsil đã được kiểm và nói không nhận. Hãy đọc lại từng hướng dẫn.',
    scholarship:
      'Học sinh quốc tịch Hàn xem học bổng nhà nước và đa văn hóa. Học sinh nước ngoài xem học bổng TOPIK của từng trường. Ở Soongsil, TOPIK 3/4/5/6 là 40/60/80/100% và chỉ học kỳ đầu. Các trường khác trong bảng chưa được đối chiếu lại.',
    part_time: 'Học sinh quốc tịch nước ngoài thường phải được phép trước khi làm thêm. Hỏi phòng quốc tế của trường. Câu bạn gõ không được lưu.',
    visa_status:
      'Sau khi đỗ đại học, hãy xem trên HiKorea có phải đổi sang diện du học không. Nếu cư trú chưa rõ, gọi trung tâm gia đình hoặc Danuri 1577-1366. Câu chữ và loại visa không được lưu.',
    documents: 'Bảng điểm nước ngoài thường cần apostille hoặc hợp pháp hóa lãnh sự. Có thể mất nhiều tuần, nên làm sớm.',
    other: 'Câu không được lưu. Chỉ mã chủ đề ở lại trên máy này. Để được trả lời cụ thể, gọi trung tâm gia đình quận hoặc 1577-1366.',
  },
  helpTitle: 'Nơi hỗ trợ chính thức',
  helpLead: 'Các liên kết này đã được mở và kiểm vào 26/11/2026. Số điện thoại từng quận trên trang chưa được kiểm lại từng số.',
  centerSnapshot: 'Số điện thoại và số thông dịch viên bên dưới là ảnh chụp cũ. Hãy xác nhận trước khi đến.',
  tracks: {
    'hs-special-2c': {
      title: 'Tuyển sinh đặc biệt cấp 3 Seoul, loại 2-다 (học sinh nước ngoài)',
      summary: 'Học sinh nước ngoài đã học ở nước ngoài, rồi chuyển vào THCS Hàn và sắp tốt nghiệp, có thể vào ngoài chỉ tiêu thường, trong 2% mỗi trường. Đoạn này chưa được gắn với một thông báo đã đối chiếu trong lần cập nhật này.',
      requirements: ['Đã học ở nước ngoài, rồi chuyển vào THCS Hàn và sắp tốt nghiệp.', 'Qua thẩm định đặc cách của Seoul. Một năm có nhiều đợt; xem thông báo mới nhất.'],
      requiredDocs: ['Đơn thẩm định đặc cách', 'Bảng điểm và giấy đang học ở nước ngoài (apostille hoặc lãnh sự)', 'Giấy đăng ký người nước ngoài của bạn và bố mẹ', 'Lịch sử xuất nhập cảnh'],
      visaNote: 'Apostille hoặc dấu lãnh sự có thể mất 2–6 tuần. Nên bắt đầu khoảng đầu tháng 7 lớp 9.',
      gapHint: 'Nếu chưa từng học trường nước ngoài, xem diện tài năng tương lai của trường nghề bên dưới.',
    },
    'hs-vocational-future': {
      title: 'Trường nghề Seoul: tài năng tương lai và hòa nhập xã hội',
      summary: 'Diện tài năng tương lai không dùng điểm môn học. Họ xem chuyên cần, tình nguyện và phỏng vấn. Với nhập học 2027, cửa nộp đặc biệt là 23–24/11/2026.',
      requirements: ['Đặc biệt: 23–24/11/2026. Thường: 30/11–1/12/2026. Ngày lấy từ thông báo của Sở Giáo dục Seoul.', 'Nếu sau này muốn chỉ tiêu đại học cho tốt nghiệp trường nghề, hãy chọn trường nghề (특성화고), không chọn Meister (마이스터고).'],
      requiredDocs: ['Đơn (trực tuyến với học sinh THCS Seoul; nộp tay nếu thi tương đương hoặc tỉnh khác)', 'Học bạ THCS hoặc giấy đỗ thi tương đương', 'Giấy đa dạng xã hội chỉ khi thu nhập hộ ở mức 160% trung vị trở xuống'],
      visaNote: 'Có lối visa việc làm riêng cho một số người tốt nghiệp ở lại lâu. Xác nhận trên HiKorea.',
      gapHint: 'Đây là lối vào cấp 3 mở với mọi hoàn cảnh và mọi mức tiếng Hàn trong ứng dụng này.',
    },
    'univ-foreign-parents': {
      title: 'Đại học: bản thân và cả bố mẹ là người nước ngoài',
      summary: 'Nếu bạn và cả bố mẹ là người nước ngoài, nhiều trường xét hồ sơ, phỏng vấn và TOPIK, ngoài chỉ tiêu thường. Mọi trường trong bảng đều ghi không nhận GED. Chỉ Soongsil được đối chiếu lại.',
      requirements: ['Bạn và cả bố mẹ là người nước ngoài. Một bố/mẹ hoặc hai quốc tịch thì tùy trường.', 'Bằng THPT chính quy, cộng mức TOPIK trường đó yêu cầu.'],
      requiredDocs: ['Bằng và bảng điểm THPT chính quy (apostille hoặc lãnh sự)', 'Giấy gia đình có công chứng', 'Điểm TOPIK còn trong hai năm hiệu lực', 'Sao kê chỉ khi cần visa D-2. Nhiều visa F được miễn.'],
      visaNote: 'Chỉ nộp học phí vào tài khoản chính thức của trường.',
      gapHint: 'Nếu tiếng Hàn còn sơ cấp, hãy đạt mức TOPIK trường mục tiêu công bố trước khi nộp.',
    },
    'univ-multicultural-eq': {
      title: 'Đại học: cơ hội công bằng cho gia đình đa văn hóa',
      summary: 'Dành cho công dân Hàn thuộc diện gia đình đa văn hóa, thường qua bố hoặc mẹ kết hôn hoặc nhập tịch. Nếu cả bố mẹ là người nước ngoài, dùng diện người nước ngoài. Chi tiết từng trường chưa được đối chiếu lại.',
      requirements: ['Bạn là công dân Hàn và thuộc quy tắc gia đình đa văn hóa. Diện cả bố mẹ là người nước ngoài không nằm ở đây.', 'Xem giới hạn thu nhập và điểm sàn trong hướng dẫn của trường.'],
      requiredDocs: ['Học bạ', 'Giấy gia đình và hôn nhân', 'Giấy cơ bản chi tiết nếu có nhập tịch'],
      visaNote: 'Công dân Hàn có thể xem học bổng nhà nước. Các trang đó chưa được đối chiếu lại.',
      gapHint: 'Tiếng Hàn học thuật khoảng TOPIK 4 giúp hồ sơ dễ hơn.',
    },
    'univ-vocational-grad': {
      title: 'Chỉ tiêu riêng cho tốt nghiệp trường nghề cùng ngành',
      summary: 'Một số đại học giữ chỉ tiêu nhỏ ngoài định mức cho tốt nghiệp trường nghề đúng ngành. Trường Meister bị loại. Số chỗ nêu trong bản tiếng Hàn chưa được đối chiếu từng hướng dẫn.',
      requirements: ['Sắp tốt nghiệp trường nghề thông thường. Meister và ban thường trong trường hỗn hợp bị loại.', 'Ngành khớp, hoặc đủ tín chỉ nghề. Con số sẽ đổi khi hệ tín chỉ THPT mới áp dụng.'],
      requiredDocs: ['Học bạ trường nghề', 'Giấy cùng ngành của hiệu trưởng'],
      visaNote: 'Một số chương trình cao đẳng nối với visa việc làm. Xem quy định hiện hành trên HiKorea.',
      gapHint: 'Giữ đủ tín chỉ nghề và mức TOPIK cùng lúc.',
    },
  },
  visa: {
    both_foreign: {
      title: 'Lối đi khi bố mẹ là người nước ngoài',
      warning: 'Lựa chọn hoàn cảnh không được lưu. Học sinh THPT visa F-1, F-3 hoặc D-4-3 nói chung không được làm thêm.',
      nodes: [
        { stage: 'Đi làm sau THPT (ở Hàn từ 7 năm)', desc: 'Nếu tuổi, số năm ở Hàn và việc học khớp quy tắc, có thể xin cư trú tìm việc hoặc đi làm mà không cần đại học. Xác nhận trên HiKorea.' },
        { stage: 'Cao đẳng hoặc đại học', desc: 'Thường phải đổi sang D-2. Một số visa F được miễn. Chương trình kỹ thuật liên kết có giờ làm khác.' },
        { stage: 'Sau tốt nghiệp', desc: 'Quy tắc cư trú tìm việc đã được nới năm 2025. Kiểm thời hạn và điều kiện TOPIK hiện hành.' },
        { stage: 'Đi làm và ở lâu hơn', desc: 'Mức lương tối thiểu của visa việc làm và yêu cầu tiếng Hàn của F-2-R đã đổi. Dùng quy tắc HiKorea hiện tại.' },
      ],
    },
    multicultural: {
      title: 'Lối đi cho học sinh gia đình hôn nhân quốc tế',
      warning: 'Nếu bạn có quốc tịch Hàn, hạn visa thường không áp dụng. Có thể xem tuyển sinh cơ hội công bằng và học bổng Hàn Quốc.',
      nodes: [
        { stage: 'Từ THCS lên cấp 3', desc: 'Diện tài năng tương lai của trường nghề Seoul (không dùng điểm môn, trọng tâm phỏng vấn) hoặc trường THPT thường.' },
        { stage: 'Cấp 3', desc: 'Giữ tiếng mẹ đẻ và tiếng Hàn, cùng tín chỉ nghề nếu học trường nghề.' },
        { stage: 'Đại học', desc: 'Cơ hội công bằng hoặc chỉ tiêu tốt nghiệp trường nghề. Số chỗ trên trang chưa được đối chiếu lại.' },
      ],
    },
    mid_entry: {
      title: 'Lối đi khi chuyển đến Hàn trong độ tuổi đi học',
      warning: 'Học sinh nước ngoài chọn GED Hàn Quốc có thể bị chặn khỏi diện đại học “cả bố mẹ là người nước ngoài”. Visa học nghề mới từ nước ngoài từng được thông báo tạm dừng; hãy xác nhận trước khi trông vào đó.',
      nodes: [
        { stage: 'Vào trường Hàn', desc: 'Trung Quốc và Việt Nam (từ 11/09/2026) dùng apostille. Thái Lan trước 28/02/2027 và Campuchia vẫn cần hợp pháp hóa lãnh sự.' },
        { stage: 'Cấp 3', desc: 'Tuyển sinh đặc biệt ngoài chỉ tiêu, hoặc diện tài năng tương lai của trường nghề.' },
        { stage: 'Cao đẳng hoặc đại học', desc: 'Bằng THPT chính quy rồi diện người nước ngoài, hoặc cao đẳng kỹ thuật liên kết. Đọc từng hướng dẫn.' },
      ],
    },
    undocumented: {
      title: 'Hướng hỗ trợ khi ở lâu nhưng chưa được đăng ký',
      warning: 'Lựa chọn này không được lưu trên máy chủ. Trường công không có nghĩa vụ báo bạn với xuất nhập cảnh chỉ để nhập học.',
      nodes: [
        { stage: 'Ai có thể được xem xét', desc: 'Quy tắc hỗ trợ dùng số năm ở Hàn và việc đang đi học. Xác nhận ngày và mốc kết thúc trên trang chính thức trước khi tin.' },
        { stage: 'Cư trú của trẻ và anh chị em', desc: 'Diện học có thể bao thời gian đi học, và quy tắc sau có thể gồm anh chị em chưa thành niên. Bản tóm tắt này chưa được đối chiếu thông báo mới nhất.' },
        { stage: 'Bố mẹ', desc: 'Bố hoặc mẹ đang thực sự nuôi con có thể được cư trú tạm và giảm phạt. Hãy tìm trợ giúp pháp lý; đừng quyết chỉ từ thẻ này.' },
        { stage: 'Sau THPT', desc: 'Đại học, tìm việc hoặc diện đi làm có thể mở ra. HiKorea và trung tâm gia đình nên xác nhận bước tiếp.' },
      ],
    },
  },
  quiz: {
    'quiz-1': { question: 'Diện ngoài chỉ tiêu khi cả bố mẹ là người nước ngoài cạnh tranh trực tiếp với học sinh Hàn trong chỉ tiêu thường.', explanation: 'Tuyển ngoài chỉ tiêu tách khỏi ghế thường, nên không cùng một cuộc cạnh tranh.' },
    'quiz-2': { question: 'Trẻ chưa xác nhận được cư trú vẫn có thể vào trường công nếu chứng minh được nơi ở.', explanation: 'Quy tắc nhập học bảo vệ quyền đi học, và nhân viên trường công không phải báo trẻ cho xuất nhập cảnh.' },
    'quiz-3': { question: 'Sau khi vào đại học, visa phụ thuộc tự kéo dài nên không bao giờ phải đổi diện.', explanation: 'Thường cần giấy nhập học chuẩn và phải kiểm việc đổi sang diện du học (D-2).' },
    'quiz-4': { question: 'Diện tài năng tương lai của trường nghề Seoul dùng 100% điểm THCS.', explanation: 'Họ xem mong muốn đi làm hoặc khởi nghiệp, chuyên cần và phỏng vấn, không chỉ điểm.' },
  },
  docs: {
    'doc-apostille': { name: 'Apostille hoặc dấu lãnh sự', whereToGet: 'Bộ ngoại giao nước cấp giấy, hoặc phòng lãnh sự', tip: 'Có thể mất 2–6 tuần. Bắt đầu khoảng hai tháng trước hạn.' },
    'doc-transcript': { name: 'Toàn bộ bảng điểm và giấy đang học ở nước ngoài', whereToGet: 'Trường ở nước ngoài, kèm bản dịch công chứng tiếng Hàn hoặc Anh', tip: 'Kiểm tra ngày và khối lớp đã được in.' },
    'doc-topik': { name: 'Phiếu điểm TOPIK', whereToGet: 'Trang TOPIK chính thức (topik.go.kr)', tip: 'Điểm có giá trị hai năm kể từ ngày công bố.' },
    'doc-finance': { name: 'Chứng minh tài chính (số dư ngân hàng)', whereToGet: 'Ngân hàng của bạn hoặc của bố mẹ. Thư học bổng đôi khi thay được.', tip: 'Số tiền và quy tắc “cấp trong 30 ngày” khác nhau theo trường.' },
    'doc-family': { name: 'Giấy gia đình', whereToGet: 'Government24, trung tâm hành chính, hoặc giấy gia đình nước ngoài có công chứng', tip: 'Nếu có người nhập tịch, xin thêm giấy cơ bản chi tiết.' },
  },
  scholarships: {
    kosaf: { name: 'Học bổng nhà nước (Quỹ hỗ trợ sinh viên Hàn Quốc)', benefit: 'Hỗ trợ học phí theo bậc thu nhập', excludeRule: 'Cho sinh viên quốc tịch Hàn. Người có cả bố mẹ là người nước ngoài thường không thuộc. Chưa đối chiếu lại.' },
    woori: { name: 'Quỹ học bổng đa văn hóa Woori', benefit: 'Khoản cố định theo cấp học cho hộ ở hoặc dưới thu nhập trung vị. Chưa đối chiếu lại.', excludeRule: 'Ghi chú cũ nói hộ cả bố mẹ là người nước ngoài và người thoát Bắc không nộp được. Chưa đối chiếu lại.' },
    myungin: { name: 'Học bổng đa văn hóa Myungin', benefit: 'Khoản sinh hoạt cho sinh viên. Chưa đối chiếu lại.', excludeRule: 'Ghi chú cũ loại hộ cả bố mẹ là người nước ngoài, cùng học kỳ đầu và học kỳ cuối. Chưa đối chiếu lại.' },
    gks: { name: 'Học bổng chính phủ Hàn Quốc (GKS)', benefit: 'Học phí và sinh hoạt phí. TOPIK cao có thể bỏ năm học tiếng. Chưa đối chiếu lại.', excludeRule: 'Cho du học sinh vào chương trình cấp bằng. Đọc thông báo sứ quán và trường. Chưa đối chiếu lại.' },
    sdream: { name: 'Học bổng Samsung Dream, hy vọng toàn cầu', benefit: 'Học phí cộng trợ cấp tháng tại trường đối tác, có điều kiện TOPIK. Chưa đối chiếu lại.', excludeRule: 'Ghi chú cũ nói học dù một học kỳ ở trường Hàn thì không nộp được. Chưa đối chiếu lại.' },
  },
};

const ru: CoreCopy = {
  ...en,
  backgrounds: {
    both_foreign: 'Оба родителя — иностранцы',
    multicultural: 'Межнациональный брак / мультикультурная семья',
    mid_entry: 'Приехал учиться в Корею не с первого класса',
    undocumented: 'Статус пребывания не подтверждён',
  },
  koreanLevels: { beginner: 'Начальный уровень, нет TOPIK', topik_3_4: 'TOPIK 3–4', topik_5_6: 'TOPIK 5–6' },
  fields: { it: 'IT / программы', culinary: 'Кухня / туризм', design: 'Дизайн', business: 'Бизнес / торговля', health: 'Медицина / уход' },
  levelMiddle: 'Средняя школа (поступление в старшую)',
  levelHigh: 'Старшая школа (вуз и стипендии TOPIK)',
  backgroundHeading: 'Семья (выбор не сохраняется)',
  koreanHeading: 'Уровень корейского',
  fieldHeading: 'Интерес',
  conditionsTitle: '1. Выберите свою ситуацию',
  warningTitle: 'Сначала прочитайте три частые ловушки',
  warnings: [
    'Ловушка GED (검정고시): если ученик с иностранным гражданством сдаёт корейский экзамен вместо обычной школы, многие квоты «оба родителя иностранцы» его не примут. В этой таблице все вузы отмечены как не принимающие. Заново сверена только памятка университета Сунсиль на весну 2027.',
    'Школа Meister (마이스터고) не входит в отдельную вузовскую квоту для выпускников профшкол.',
    'Старшеклассникам с визой F-1, F-3 или D-4-3 обычно нельзя подрабатывать. Оплату переводите только на официальный счёт вуза.',
  ],
  matchedTitle: '2. Куда можно податься сейчас',
  gapBadge: 'Можно после того, как закроете пробел',
  gapLead: 'Чего не хватает:',
  requirementsLabel: 'Главные условия',
  docsLabel: 'Какие бумаги готовить',
  termHint: 'Нажмите непонятное слово. На устройстве сохранится только код слова.',
  legalLead: 'Основание',
  schoolsTitle: '3. Профшколы и Meister в Сеуле (коды школ проверены)',
  universitiesTitle: '3. Стипендии TOPIK в сеульских вузах',
  searchLabel: 'Поиск по школе, специальности или слову',
  searchMiddle: 'Например: торговля, туризм, программы',
  searchHigh: 'Например: Сунсиль, TOPIK',
  majorsLead: 'Специальности',
  gedHead: 'Экзамен GED (검정고시)',
  scholarshipTitle: 'Внешние стипендии для выбранной ситуации',
  noScholarship: 'Если пребывание ещё не оформлено, сначала смотрите маршрут поддержки, потом правила стипендии.',
  unverified: 'Текст не сверялся',
  verified: 'Проверено',
  applies: 'Срок',
  apostilleTitle: '4. Как заверить школьные бумаги из вашей страны',
  apostilleStatus: { apostille: 'Нужен апостиль (아포스티유)', transition: 'Правила меняются (смотрите дату подачи)', consular: 'Нужна консульская легализация' },
  countries: {
    CN: { name: 'Китай (материк)', guide: 'Страна апостиля. Лишняя консульская отметка не нужна.' },
    VN: { name: 'Вьетнам', guide: 'Апостиль действует с 11 сентября 2026. Бумаги частной школы сначала заверяют на месте, потом ставят апостиль.' },
    MN: { name: 'Монголия', guide: 'Страна апостиля. Обратитесь в МИД страны, выдавшей документ.' },
    RU: { name: 'Россия, Узбекистан, Казахстан', guide: 'Страны апостиля. Нужны апостиль и нотариальный перевод аттестата и оценок.' },
    PH: { name: 'Филиппины', guide: 'Страна апостиля (DFA). Для частных школ проверьте местный нотариальный шаг.' },
    BD: { name: 'Бангладеш', guide: 'Апостиль действует с 30 марта 2025.' },
    TH: { name: 'Таиланд', guide: 'До 28 февраля 2027 ещё нужна консульская легализация. С 28 февраля 2027 — апостиль.' },
    KH: { name: 'Камбоджа, Мьянма, Лаос', guide: 'Это не страны апостиля. После МИД нужна консульская легализация.' },
  },
  referralTitle: '6. Бесплатный перевод в вашем районе',
  counselNeed: 'Нужна консультация',
  counselDone: 'Консультация состоялась',
  counselFail: 'Связаться не удалось',
  interpreterMissing: 'Открытых данных по этому языку нет. Звоните в Данури 1577-1366.',
  interpreterZero: 'В списке 0 человек. Спросите соседний центр или 1577-1366.',
  interpreterSome: 'чел. Позвоните и спросите, есть ли свободное время.',
  speakTitle: '7. Карточка для консультанта',
  disclaimer: 'Правила меняются. Перед подачей или сменой пребывания проверьте вуз, adiga и HiKorea. Строки «не сверялось» в этом обновлении не проверялись по исходному объявлению.',
  sourceMissing: 'Для этого пункта не найдена конкретная официальная страница.',
  docsTitle: '1. Мой список документов',
  docsProgress: 'готово',
  docDone: 'Готово',
  docMark: 'Отметить готовым',
  docHard: 'Трудно получить',
  whereLead: 'Где получить',
  tipLead: 'Подсказка',
  barrierPrompt: 'Что труднее всего? Сохранится только код причины.',
  barriers: { overseas: 'Трудно получить за границей', cost: 'Цена перевода и нотариуса', format: 'Не знаю бланк', deadline: 'Мало времени' },
  quizTitle: '2. Минута: верно или неверно',
  quizLead: 'Четыре частые путаницы. Первый ответ сохранится только как «верно» или «неверно».',
  quizYes: 'Верно',
  quizNo: 'Неверно',
  quizCorrect: 'Верно',
  quizWrong: 'Не так. Ответ:',
  explainLead: 'Почему',
  questionTitle: '3. Вопрос одной строкой',
  questionLabel: 'Напишите один вопрос. Не указывайте имя, телефон и регистрационный номер иностранца.',
  questionPlaceholder: 'Например: можно ли поступать с GED?',
  questionSubmit: 'Показать подсказку',
  topicLead: 'Тема',
  topicSaved: 'Сохраняется только код темы. Текст вопроса не сохраняется.',
  scheduleTitle: '4. Даты экзаменов и подачи',
  schedules: {
    'sched-meister-apply': { title: 'Подача в школы Meister Сеула', target: '9 класс' },
    'sched-voc-apply': { title: 'Профшколы Сеула, особый набор', target: '9 класс' },
    'sched-voc-interview': { title: 'Собеседования профшкол Сеула', target: '9 класс' },
    'sched-topik-109': { title: '109-й TOPIK I·II (бумага)', target: 'Все' },
    'sched-topik-110': { title: '110-й TOPIK I·II (бумага)', target: 'Все' },
    'sched-foreign-early-2028': { title: 'Квота иностранцев 2028 (июльское окно)', target: '12 класс' },
    'sched-susi-2028': { title: 'Ранняя подача 2028', target: '12 класс' },
  },
  careerTitle: 'Профессии и специальности',
  jobsLead: 'Примеры профессий',
  majorsWord: 'Специальности',
  career: {
    it: { jobs: 'Разработчик, безопасность, анализ данных', majors: 'Информатика (컴퓨터공학), программы', note: 'Эту область часто связывают с рабочей визой. Проверьте действующие правила отдельно.' },
    culinary: { jobs: 'Повар в отеле, гид, сотрудник отеля', majors: 'Кулинария (조리학), туризм', note: 'Родной язык плюс корейский — реальное преимущество.' },
    design: { jobs: 'Дизайнер интерфейсов, моушн, бренд', majors: 'Графический дизайн (시각디자인), медиа', note: 'Портфолио важно, письменный корейский часто весит меньше.' },
    business: { jobs: 'Внешние продажи, торговля, финансы', majors: 'Международная торговля (국제통상), бизнес', note: 'Компаниям, торгующим с вашей страной, нужны двуязычные сотрудники.' },
    health: { jobs: 'Медсестра, координатор, гигиенист', majors: 'Сестринское дело (간호학), управление здравоохранением', note: 'Для многих работ нужна государственная лицензия.' },
  },
  guides: {
    ged: 'Сданный корейский GED (검정고시) равен окончанию старшей школы. Квоты «оба родителя иностранцы» устроены иначе: все вузы в таблице отмечены как не принимающие GED. Проверена только памятка Сунсиля на весну 2027: GED не принимают. Остальные памятки проверьте сами.',
    scholarship: 'Граждане Кореи смотрят государственную и мультикультурную стипендию. Иностранцы — стипендию TOPIK каждого вуза. В Сунсиле TOPIK 3/4/5/6 — это 40/60/80/100%, и только первый семестр. Остальные вузы в таблице заново не сверялись.',
    part_time: 'Ученику с иностранным гражданством обычно нужно разрешение до начала работы. Сначала спросите международный отдел школы. Набранный текст не сохраняется.',
    visa_status: 'После зачисления проверьте на HiKorea, нужно ли менять пребывание на учебное. Если статус неясен, позвоните в семейный центр или Данури 1577-1366. Текст и тип визы не сохраняются.',
    documents: 'Иностранные оценки обычно требуют апостиль или консульскую легализацию. Это занимает недели, начинайте заранее.',
    other: 'Текст не сохраняется. На устройстве остаётся только код темы. За точным ответом звоните в семейный центр района или 1577-1366.',
  },
  helpTitle: 'Официальная помощь',
  helpLead: 'Эти ссылки открыты и проверены 26 ноября 2026. Телефоны районов на странице по одному заново не сверялись.',
  centerSnapshot: 'Телефон и число переводчиков ниже — старый снимок. Уточните перед визитом.',
  tracks: {
    'hs-special-2c': {
      title: 'Особый набор в старшую школу Сеула, тип 2-다 (иностранец)',
      summary: 'Иностранец, который учился за рубежом, затем перевёлся в корейскую среднюю школу и выпускается, может поступить вне обычной квоты, в пределах 2% школы. В этом обновлении текст не привязан к одному сверенному объявлению.',
      requirements: ['Учёба за рубежом, затем перевод в корейскую среднюю школу и выпуск.', 'Нужно пройти особую проверку Сеула. Проверок несколько в год; дату смотрите в свежем объявлении.'],
      requiredDocs: ['Бланк особой проверки', 'Оценки и справка иностранной школы (апостиль или консульский штамп)', 'Факт регистрации вас и родителей', 'Справка о въездах и выездах'],
      visaNote: 'Апостиль или консульский штамп занимают 2–6 недель. Начинайте примерно в начале июля 9 класса.',
      gapHint: 'Если иностранной школы не было, смотрите набор «будущий талант» профшколы ниже.',
    },
    'hs-vocational-future': {
      title: 'Профшколы Сеула: будущий талант и социальная интеграция',
      summary: 'Набор «будущий талант» не использует оценки по предметам. Смотрят посещаемость, волонтёрство и собеседование. Для поступления 2027 особое окно было 23–24 ноября 2026.',
      requirements: ['Особый набор: 23–24 ноября 2026. Обычный: 30 ноября – 1 декабря 2026. Даты из объявления Управления образования Сеула.', 'Если позже нужна вузовская квота выпускников профшкол, выбирайте обычную профшколу (특성화고), а не Meister (마이스터고).'],
      requiredDocs: ['Заявление (онлайн для учеников Сеула; лично для GED и других городов)', 'Личное дело средней школы или справка о GED', 'Бумаги о разнообразии только если доход семьи не выше 160% медианы'],
      visaNote: 'Для части долгих выпускников есть отдельный рабочий маршрут. Подтвердите его на HiKorea.',
      gapHint: 'В этом приложении это самый открытый путь в старшую школу для любого фона и уровня корейского.',
    },
    'univ-foreign-parents': {
      title: 'Вуз: и студент, и оба родителя — иностранцы',
      summary: 'Если вы и оба родителя иностранцы, многие вузы принимают по документам, собеседованию и TOPIK вне обычной квоты. GED отмечен как непринимаемый у всех вузов таблицы. Заново сверен только Сунсиль.',
      requirements: ['Вы и оба родителя — иностранцы. Один родитель или второе гражданство зависят от вуза.', 'Обычный аттестат старшей школы и уровень TOPIK, который просит вуз.'],
      requiredDocs: ['Аттестат и оценки обычной школы (апостиль или консульский штамп)', 'Нотариальные семейные бумаги', 'TOPIK в пределах двух лет', 'Выписка со счёта только для визы D-2. Многие статусы F освобождены.'],
      visaNote: 'Оплату переводите только на официальный счёт вуза.',
      gapHint: 'Если корейский ещё начальный, сначала получите уровень TOPIK, который опубликовал выбранный вуз.',
    },
    'univ-multicultural-eq': {
      title: 'Вуз: равные возможности для мультикультурной семьи',
      summary: 'Для гражданина Кореи, чья семья подходит под закон о мультикультурных семьях, обычно через брак или натурализацию родителя. Если оба родителя иностранцы, это другая квота. Подробности вузов заново не сверялись.',
      requirements: ['Вы гражданин Кореи и подходите под правило мультикультурной семьи. Семьи, где оба родителя иностранцы, сюда не входят.', 'Проверьте предел дохода и минимум баллов в памятке вуза.'],
      requiredDocs: ['Школьное дело', 'Семейные и брачные справки', 'Подробная базовая справка, если была натурализация'],
      visaNote: 'Граждане Кореи могут смотреть государственную стипендию. Эти страницы в обновлении не сверялись.',
      gapHint: 'Учебный корейский около TOPIK 4 сильно помогает документам.',
    },
    'univ-vocational-grad': {
      title: 'Отдельная квота выпускников профшколы той же специальности',
      summary: 'Часть вузов держит небольшую квоту сверх плана для выпускников профшкол нужного профиля. Meister исключены. Цифры мест в корейском тексте по каждой памятке заново не сверялись.',
      requirements: ['Выпуск обычной профшколы. Meister и общеобразовательные классы смешанных школ исключены.', 'Специальность совпадает или набраны нужные профессиональные кредиты. Число изменится с кредитной системой.'],
      requiredDocs: ['Личное дело профшколы', 'Справка директора о той же специальности'],
      visaNote: 'Некоторые короткие программы колледжа связаны с рабочей визой. Проверьте текущее правило на HiKorea.',
      gapHint: 'Держите вместе профессиональные кредиты и уровень TOPIK.',
    },
  },
  visa: {
    both_foreign: {
      title: 'Маршрут, если родители — иностранцы',
      warning: 'Выбранный фон не сохраняется. Старшеклассникам с F-1, F-3 или D-4-3 обычно нельзя подрабатывать.',
      nodes: [
        { stage: 'Работа после школы (7+ лет в Корее)', desc: 'При подходящих возрасте, годах в Корее и учёбе возможны поиск работы и рабочий статус без вуза. Подтвердите на HiKorea.' },
        { stage: 'Колледж или вуз', desc: 'Часто нужна смена на D-2. Часть статусов F освобождена. У связанной технической программы другие часы работы.' },
        { stage: 'После выпуска', desc: 'Правила поиска работы расширяли в 2025 году. Проверьте текущий срок и условие TOPIK.' },
        { stage: 'Работа и долгий статус', desc: 'Пороги зарплаты рабочей визы и корейский для F-2-R менялись. Берите текущее правило HiKorea, а не эту карточку.' },
      ],
    },
    multicultural: {
      title: 'Маршрут ученика из межнациональной семьи',
      warning: 'При гражданстве Кореи визовые ограничения обычно не действуют. Можно смотреть равные возможности и корейские стипендии.',
      nodes: [
        { stage: 'Из средней школы в старшую', desc: 'Профшкола Сеула «будущий талант» (без оценок, с собеседованием) или обычная старшая школа.' },
        { stage: 'Старшая школа', desc: 'Сохраняйте родной язык и корейский, а в профшколе — профессиональные кредиты.' },
        { stage: 'Вуз', desc: 'Равные возможности или квота выпускников профшкол. Числа на странице заново не сверялись.' },
      ],
    },
    mid_entry: {
      title: 'Маршрут, если переезд был в школьном возрасте',
      warning: 'Иностранец, выбравший корейский GED, может потерять квоту «оба родителя иностранцы». Новый набор профшкол из-за рубежа сообщали как приостановленный; подтвердите это до плана.',
      nodes: [
        { stage: 'Вход в корейскую школу', desc: 'Китай и Вьетнам (с 11 сентября 2026) используют апостиль. Таиланд до 28 февраля 2027 и Камбоджа всё ещё требуют консульскую легализацию.' },
        { stage: 'Старшая школа', desc: 'Особый набор вне квоты или «будущий талант» профшколы.' },
        { stage: 'Колледж или вуз', desc: 'Обычный аттестат и квота иностранцев либо связанный технический колледж. Читайте каждую памятку.' },
      ],
    },
    undocumented: {
      title: 'Поддержка, если долгое пребывание не было зарегистрировано',
      warning: 'Этот выбор не сохраняется на сервере. Государственная школа не обязана сообщать о вас в миграционную службу ради зачисления.',
      nodes: [
        { stage: 'Кого могут рассмотреть', desc: 'Правила поддержки смотрят годы в Корее и учёбу. Даты и конец программы подтверждайте на официальной странице.' },
        { stage: 'Пребывание ребёнка и братьев/сестёр', desc: 'Учебный статус может покрыть школу, а более позднее правило — несовершеннолетних братьев и сестёр. Этот текст не сверялся с последним объявлением.' },
        { stage: 'Родители', desc: 'Родитель, который реально растит ребёнка, может получить временное пребывание и снижение штрафа. Нужна юридическая помощь, не решайте только по карточке.' },
        { stage: 'После старшей школы', desc: 'Дальше возможны вуз, поиск работы или рабочий статус. Шаг должны подтвердить HiKorea и семейный центр.' },
      ],
    },
  },
  quiz: {
    'quiz-1': { question: 'Квота вне плана для двух иностранных родителей соревнуется напрямую с корейскими учениками обычной квоты.', explanation: 'Набор вне квоты отделён от обычных мест, это не одно соревнование.' },
    'quiz-2': { question: 'Ребёнок с неподтверждённым пребыванием может пойти в государственную школу, если показано место жительства.', explanation: 'Правило зачисления защищает право на учёбу, и сотрудники государственной школы не обязаны сообщать о ребёнке в миграционную службу.' },
    'quiz-3': { question: 'После поступления в вуз зависимая виза продолжается сама, менять статус не нужно.', explanation: 'Обычно нужна стандартная справка о зачислении и проверка смены на учебное пребывание (D-2).' },
    'quiz-4': { question: 'Набор «будущий талант» профшкол Сеула на 100% решает по оценкам средней школы.', explanation: 'Смотрят желание работать или открыть дело, посещаемость и собеседование, а не только оценки.' },
  },
  docs: {
    'doc-apostille': { name: 'Апостиль или консульский штамп', whereToGet: 'МИД страны, выдавшей бумагу, или консульский отдел', tip: 'Это занимает 2–6 недель. Начинайте примерно за два месяца.' },
    'doc-transcript': { name: 'Полные оценки и справка иностранной школы', whereToGet: 'Школа за рубежом плюс нотариальный перевод на корейский или английский', tip: 'Проверьте, что даты и классы напечатаны.' },
    'doc-topik': { name: 'Справка TOPIK', whereToGet: 'Официальный сайт TOPIK (topik.go.kr)', tip: 'Оценка действует два года с даты результата.' },
    'doc-finance': { name: 'Подтверждение денег (остаток на счёте)', whereToGet: 'Ваш банк или банк родителя. Иногда письмо о стипендии заменяет его.', tip: 'Сумма и правило «выдано за 30 дней» отличаются по вузам.' },
    'doc-family': { name: 'Семейные бумаги', whereToGet: 'Government24, центр района или нотариальная иностранная справка', tip: 'Если была натурализация, возьмите подробную базовую справку.' },
  },
  scholarships: {
    kosaf: { name: 'Государственная стипендия (фонд поддержки студентов)', benefit: 'Помощь с оплатой по уровню дохода', excludeRule: 'Для граждан Кореи. Если оба родителя иностранцы, обычно не подходит. Не сверялось.' },
    woori: { name: 'Фонд Woori для мультикультурных семей', benefit: 'Фиксированная выплата по ступени школы для дохода не выше медианы. Не сверялось.', excludeRule: 'Старая пометка: семьи с двумя иностранными родителями и выходцы из КНДР не могут подать. Не сверялось.' },
    myungin: { name: 'Стипендия Myungin', benefit: 'Выплата на жизнь студентам. Не сверялось.', excludeRule: 'Старая пометка исключает двух иностранных родителей, первый и последний семестр. Не сверялось.' },
    gks: { name: 'Правительственная стипендия GKS', benefit: 'Оплата учёбы и жизнь. Высокий TOPIK может отменить языковой год. Не сверялось.', excludeRule: 'Для иностранцев на программу с дипломом. Читайте набор посольства и вуза. Не сверялось.' },
    sdream: { name: 'Стипендия Samsung Dream, глобальная надежда', benefit: 'Оплата учёбы плюс месяц в вузах-партнёрах, с условием TOPIK. Не сверялось.', excludeRule: 'Старая пометка: даже один семестр корейской школы закрывает подачу. Не сверялось.' },
  },
};

const mn: CoreCopy = {
  ...en,
  backgrounds: {
    both_foreign: 'Эцэг эх хоёулаа гадаадын иргэн',
    multicultural: 'Олон улсын гэрлэлт / олон соёлын гэр бүл',
    mid_entry: 'Суралцаж байхдаа Солонгост ирсэн',
    undocumented: 'Оршин суух байдал баталгаажаагүй',
  },
  koreanLevels: { beginner: 'Анхан шат, TOPIK байхгүй', topik_3_4: 'TOPIK 3–4', topik_5_6: 'TOPIK 5–6' },
  fields: { it: 'МТ / программ', culinary: 'Хоол / аялал', design: 'Дизайн', business: 'Бизнес / худалдаа', health: 'Эрүүл мэнд / сувилал' },
  levelMiddle: 'Дунд сургууль (ахлах сургуульд элсэх)',
  levelHigh: 'Ахлах сургууль (их сургууль ба TOPIK тэтгэлэг)',
  backgroundHeading: 'Гэр бүлийн байдал (хадгалахгүй)',
  koreanHeading: 'Солонгос хэлний түвшин',
  fieldHeading: 'Сонирхсон чиглэл',
  conditionsTitle: '1. Өөрийн нөхцлөө сонго',
  warningTitle: 'Эхлээд энэ гурван алдааг уншаарай',
  warnings: [
    'GED (검정고시)-ийн алдаа: гадаадын иргэн сурагч энгийн ахлах сургуулийн оронд тэнцэх шалгалт өгвөл «эцэг эх хоёулаа гадаадын иргэн» их сургуулийн олон квот хүлээж авахгүй. Энэ хүснэгтийн бүх сургууль хүлээхгүй гэж тэмдэглэгдсэн. Энэ удаа зөвхөн Сүнсиль их сургуулийн 2027 оны хаврын удирдамжийг нягталлаа.',
    'Meister ахлах сургууль (마이스터고) мэргэжлийн сургууль төгсөгчийн нэмэлт их сургуулийн квотод ордоггүй.',
    'F-1, F-3, D-4-3 визтэй ахлах ангийн сурагч ерөнхийдөө ажиллах эрхгүй. Сургалтын төлбөрийг зөвхөн сургуулийн албан дансанд төлнө.',
  ],
  matchedTitle: '2. Одоо өргөдөл гаргаж болох зам',
  gapBadge: 'Дутуугаа нөхөөд өргөдөл гаргаж болно',
  gapLead: 'Дутуу зүйл:',
  requirementsLabel: 'Гол нөхцөл',
  docsLabel: 'Бэлдэх бичиг',
  termHint: 'Ойлгоогүй үгээ дарна уу. Энэ төхөөрөмж дээр зөвхөн үгийн код үлдэнэ.',
  legalLead: 'Үндэслэл',
  schoolsTitle: '3. Сөүлийн мэргэжлийн болон Meister сургуулиуд (сургуулийн код нягтлагдсан)',
  universitiesTitle: '3. Сөүлийн их сургуулиудын TOPIK тэтгэлэг',
  searchLabel: 'Сургууль, мэргэжил, үгээр хайх',
  searchMiddle: 'Жишээ: худалдаа, аялал, программ',
  searchHigh: 'Жишээ: Сүнсиль, TOPIK',
  majorsLead: 'Мэргэжил',
  gedHead: 'Тэнцэх шалгалт (검정고시)',
  scholarshipTitle: 'Сонгосон байдалд таарах гаднын тэтгэлэг',
  noScholarship: 'Оршин суух нь тогтоогүй бол эхлээд дэмжлэгийн замыг, дараа нь тэтгэлгийн дүрмийг шалга.',
  unverified: 'Эх бичгээр нягтлаагүй',
  verified: 'Нягталсан',
  applies: 'Хамрах хугацаа',
  apostilleTitle: '4. Гадаад сургуулийн бичгийг хэрхэн баталгаажуулах вэ',
  apostilleStatus: { apostille: 'Апостиль (아포스티유) хэрэглэнэ', transition: 'Дүрэм солигдож байна (өгсөн өдрөө шалга)', consular: 'Консулын баталгаа заавал' },
  countries: {
    CN: { name: 'Хятад (эх газар)', guide: 'Апостилийн улс. Илүү консулын тамга хэрэггүй.' },
    VN: { name: 'Вьетнам', guide: 'Апостиль 2026 оны 9-р сарын 11-нээс хүчинтэй. Хувийн сургуулийн бичгийг эхлээд газар дээр нь нотариатлуулж, дараа нь апостиль авна.' },
    MN: { name: 'Монгол', guide: 'Апостилийн улс. Бичиг олгосон улсын гадаад харилцааны яаманд хандана.' },
    RU: { name: 'Орос, Узбекистан, Казахстан', guide: 'Апостилийн улсууд. Диплом, дүнгийн апостиль болон орчуулгын нотариат бэлдэнэ.' },
    PH: { name: 'Филиппин', guide: 'Апостилийн улс (DFA). Хувийн сургуульд орон нутгийн нотариатын алхмыг хамт шалга.' },
    BD: { name: 'Бангладеш', guide: 'Апостиль 2025 оны 3-р сарын 30-наас хүчинтэй.' },
    TH: { name: 'Тайланд', guide: '2027 оны 2-р сарын 28-наас өмнө өгвөл консулын баталгаа хэрэгтэй. Түүнээс хойш апостиль.' },
    KH: { name: 'Камбож, Мьянмар, Лаос', guide: 'Апостилийн улс биш. Гадаад харилцааны яамны дараа консулын баталгаа авна.' },
  },
  referralTitle: '6. Танай дүүргийн үнэгүй орчуулга',
  counselNeed: 'Зөвлөгөө хэрэгтэй',
  counselDone: 'Зөвлөгөө холбогдсон',
  counselFail: 'Холбогдож чадаагүй',
  interpreterMissing: 'Энэ хэлний нээлттэй тоо байхгүй. Данури 1577-1366 руу залга.',
  interpreterZero: 'Жагсаалтад 0 хүн. Ойролцоох төв эсвэл 1577-1366-аас асуу.',
  interpreterSome: 'хүн. Сул цаг байгаа эсэхийг утсаар асуу.',
  speakTitle: '7. Зөвлөх багшид үзүүлэх карт',
  disclaimer: 'Дүрэм өөрчлөгдөнө. Өргөдөл эсвэл оршин суух өөрчлөхийн өмнө их сургууль, adiga, HiKorea-г шалга. «Нягтлаагүй» мөрүүдийг энэ шинэчлэлтээр эх бичигтэй тулгаагүй.',
  sourceMissing: 'Энэ зүйлд тодорхой албан ёсны хуудас баталгаажаагүй.',
  docsTitle: '1. Миний бичиг баримтын жагсаалт',
  docsProgress: 'дууссан',
  docDone: 'Дууссан',
  docMark: 'Дууссан гэж тэмдэглэх',
  docHard: 'Авахад хэцүү',
  whereLead: 'Хаанаас авах вэ',
  tipLead: 'Зөвлөмж',
  barrierPrompt: 'Хамгийн хэцүү нь юу вэ? Зөвхөн шалтгааны код хадгалагдана.',
  barriers: { overseas: 'Гадаадаас авахад хэцүү', cost: 'Орчуулга, нотариатын зардал', format: 'Маягтаа мэдэхгүй', deadline: 'Хугацаа хүрэхгүй' },
  quizTitle: '2. Нэг минутын үнэн / худал',
  quizLead: 'Их эндүүрдэг дөрвөн зүйл. Эхний хариу зөвхөн зөв эсвэл буруу гэж хадгалагдана.',
  quizYes: 'Үнэн',
  quizNo: 'Худал',
  quizCorrect: 'Зөв',
  quizWrong: 'Биш. Хариулт:',
  explainLead: 'Яагаад',
  questionTitle: '3. Нэг мөрөөр асуух',
  questionLabel: 'Нэг асуулт бич. Нэр, утас, гадаадын иргэний бүртгэлийн дугаар битгий оруул.',
  questionPlaceholder: 'Жишээ: GED-ээр өргөдөл гаргаж болох уу?',
  questionSubmit: 'Тайлбар харах',
  topicLead: 'Сэдэв',
  topicSaved: 'Зөвхөн сэдвийн код хадгалагдана. Өгүүлбэр хадгалагдахгүй.',
  scheduleTitle: '4. Шалгалт ба элсэлтийн огноо',
  schedules: {
    'sched-meister-apply': { title: 'Сөүлийн Meister сургуулийн өргөдөл', target: '9-р анги' },
    'sched-voc-apply': { title: 'Сөүлийн мэргэжлийн сургууль, тусгай элсэлт', target: '9-р анги' },
    'sched-voc-interview': { title: 'Сөүлийн мэргэжлийн сургуулийн ярилцлага', target: '9-р анги' },
    'sched-topik-109': { title: '109 дэх TOPIK I·II (цаасан)', target: 'Бүх сурагч' },
    'sched-topik-110': { title: '110 дахь TOPIK I·II (цаасан)', target: 'Бүх сурагч' },
    'sched-foreign-early-2028': { title: '2028 оны гадаадын иргэний квот (7-р сарын цонх)', target: '12-р анги' },
    'sched-susi-2028': { title: '2028 оны эрт элсэлтийн өргөдөл', target: '12-р анги' },
  },
  careerTitle: 'Чиглэл бүрийн ажил ба мэргэжил',
  jobsLead: 'Жишээ ажил',
  majorsWord: 'Холбоотой мэргэжил',
  career: {
    it: { jobs: 'Программ хөгжүүлэгч, аюулгүй байдал, өгөгдөл', majors: 'Компьютерын инженер (컴퓨터공학), программ', note: 'Энэ чиглэлийг мэргэжлийн ажлын визтэй холбож ярьдаг. Одоогийн дүрмийг тусад нь шалга.' },
    culinary: { jobs: 'Зочид буудлын тогооч, хөтөч, зочид буудлын ажилтан', majors: 'Хоол (조리학), аялал жуулчлал', note: 'Эх хэл ба солонгос хэл хоёуланг нь мэдэх нь давуу тал.' },
    design: { jobs: 'Интерфейсийн дизайнер, хөдөлгөөн, брэнд', majors: 'Харааны дизайн (시각디자인), дижитал медиа', note: 'Портфолио чухал тул солонгос бичгийн шалгалт харьцангуй бага байдаг.' },
    business: { jobs: 'Гадаад борлуулалт, худалдаа, санхүүгийн бичиг', majors: 'Олон улсын худалдаа (국제통상), бизнес', note: 'Танай улстай худалдаа хийдэг компанид хоёр хэлтэй хүн хэрэгтэй.' },
    health: { jobs: 'Сувилагч, эмнэлгийн зохицуулагч, шүдний эрүүл ахуйч', majors: 'Сувилал (간호학), эрүүл мэндийн удирдлага', note: 'Эдгээр ажлын олонд улсын лиценз хэрэгтэй.' },
  },
  guides: {
    ged: 'Солонгосын тэнцэх шалгалт (검정고시)-д тэнцвэл ахлах сургууль төгссөнтэй адил боловсрол гэж үздэг. «Эцэг эх хоёулаа гадаадын иргэн» их сургуулийн квот өөр: хүснэгтийн бүх сургууль GED хүлээхгүй гэж тэмдэглэгдсэн. Зөвхөн Сүнсилийн 2027 оны хаврын удирдамжийг нягталсан бөгөөд тэнд хүлээхгүй гэжээ. Бусад удирдамжийг дахин унш.',
    scholarship: 'Солонгос иргэн улсын болон олон соёлын тэтгэлгийг харна. Гадаадын иргэн сургууль бүрийн TOPIK тэтгэлгийг харна. Сүнсиль дээр TOPIK 3/4/5/6 нь 40/60/80/100% бөгөөд зөвхөн эхний семестр. Хүснэгтийн бусад сургуулийг дахин нягтлаагүй.',
    part_time: 'Гадаадын иргэн сурагч ажиллахын өмнө ихэвчлэн зөвшөөрөл авна. Эхлээд сургуулийн олон улсын албанаас асуу. Бичсэн өгүүлбэр хадгалагдахгүй.',
    visa_status: 'Их сургуульд орсон хойноо HiKorea дээр оюутны оршин суух руу солих эсэхээ шалга. Оршин суух нь тодорхойгүй бол гэр бүлийн төв эсвэл Данури 1577-1366 руу залга. Өгүүлбэр ба визийн төрөл хадгалагдахгүй.',
    documents: 'Гадаад дүнгийн хуудсанд ихэвчлэн апостиль эсвэл консулын баталгаа хэрэгтэй. Хэдэн долоо хоног болдог тул эрт эхэл.',
    other: 'Өгүүлбэр хадгалагдахгүй. Энэ төхөөрөмж дээр зөвхөн сэдвийн код үлдэнэ. Тодорхой хариу авах бол дүүргийн гэр бүлийн төв эсвэл 1577-1366 руу залга.',
  },
  helpTitle: 'Албан ёсны тусламж',
  helpLead: 'Эдгээр холбоосыг 2026-11-26-нд нээж шалгасан. Хуудсан дээрх дүүргийн утаснуудыг нэг бүрчлэн дахин нягтлаагүй.',
  centerSnapshot: 'Доорх утас ба орчуулагчийн тоо нь хуучин зураг. Очихоосоо өмнө баталгаажуул.',
  tracks: {
    'hs-special-2c': {
      title: 'Сөүлийн ахлах сургуулийн тусгай элсэлт, 2-다 төрөл (гадаадын сурагч)',
      summary: 'Гадаадад сурч, дараа нь Солонгосын дунд сургуульд шилжин орж төгсөх гадаадын сурагч ердийн квотын гадуур, сургууль бүрт 2%-ийн дотор орж болно. Энэ тайлбарыг энэ шинэчлэлтээр нэг баталгаажсан зарлалд уяагүй.',
      requirements: ['Гадаадад сурсны дараа Солонгосын дунд сургуульд шилжин орж төгсөнө.', 'Сөүлийн тусгай хяналтыг давах ёстой. Жилд хэд хэдэн удаа; огноог шинэ зарлалаас харна.'],
      requiredDocs: ['Тусгай хяналтын маягт', 'Гадаад сургуулийн дүн ба суралцсан тодорхойлолт (апостиль эсвэл консул)', 'Та болон эцэг эхийн гадаадын бүртгэл', 'Орсон гарсан бүртгэл'],
      visaNote: 'Апостиль эсвэл консулын тамга 2–6 долоо хоног болдог. 9-р ангийн 7-р сарын эхээр эхэл.',
      gapHint: 'Гадаад сургуульд суугаагүй бол доорх мэргэжлийн сургуулийн ирээдүйн авьяасын квотыг харна.',
    },
    'hs-vocational-future': {
      title: 'Сөүлийн мэргэжлийн сургууль: ирээдүйн авьяас ба нийгмийн нэгдэл',
      summary: 'Ирээдүйн авьяасын квот хичээлийн дүн ашигладаггүй. Ирц, сайн дурын ажил, ярилцлагыг хардаг тул харьцангуй нээлттэй. 2027 оны элсэлтийн тусгай цонх 2026-11-23–24 байсан.',
      requirements: ['Тусгай: 2026-11-23–24. Ердийн: 11-30–12-01. Огноо нь Сөүлийн боловсролын газрын зарлалаас.', 'Хожим их сургуулийн мэргэжлийн квот хүсвэл Meister (마이스터고) биш, энгийн мэргэжлийн сургууль (특성화고) сонго.'],
      requiredDocs: ['Өргөдөл (Сөүлийн дунд сургуулийн сурагч онлайнаар; GED болон өөр хот биеэр)', 'Дунд сургуулийн бүртгэл эсвэл GED-ийн гэрчилгээ', 'Өрхийн орлого дундаж орлогын 160%-иас доош бол нийгмийн олон янз байдлын бичиг'],
      visaNote: 'Удаан оршин суусан зарим төгсөгчид ажлын визийн тусдаа зам бий. HiKorea дээр баталгаажуул.',
      gapHint: 'Энэ апп дээр бүх байдал, бүх солонгос хэлний түвшинд нээлттэй ахлах сургуулийн зам нь энэ.',
    },
    'univ-foreign-parents': {
      title: 'Их сургууль: сурагч ба эцэг эх хоёулаа гадаадын иргэн',
      summary: 'Та болон эцэг эх хоёулаа гадаадын иргэн бол олон сургууль бичиг, ярилцлага, TOPIK-оор ердийн квотын гадуур авдаг. Хүснэгтийн бүх сургууль GED хүлээхгүй гэж тэмдэглэгдсэн. Зөвхөн Сүнсилийг дахин нягталсан.',
      requirements: ['Та болон эцэг эх хоёулаа гадаадын иргэн. Нэг эцэг эх эсвэл давхар иргэншил сургууль бүрээр өөр.', 'Энгийн ахлах сургуулийн диплом, тухайн сургуулийн шаардсан TOPIK.'],
      requiredDocs: ['Энгийн ахлах сургуулийн диплом ба дүн (апостиль эсвэл консул)', 'Гэр бүлийн нотариат', 'Хоёр жилийн хүчинтэй хугацаан дахь TOPIK', 'Зөвхөн D-2 виз хэрэгтэй бол банкны үлдэгдэл. Олон F виз чөлөөлөгдөнө.'],
      visaNote: 'Төлбөрийг зөвхөн сургуулийн албан дансанд төлнө.',
      gapHint: 'Солонгос хэл анхан шатанд бол зорилтот сургуулийн зарласан TOPIK-д эхлээд хүр.',
    },
    'univ-multicultural-eq': {
      title: 'Их сургууль: олон соёлын гэр бүлийн тэгш боломж',
      summary: 'Олон соёлын гэр бүлийн хуульд таарах, ихэвчлэн Солонгос иргэн оюутанд. Эцэг эх хоёулаа гадаадын иргэн бол гадаадын квотыг ашиглана. Сургууль бүрийн дэлгэрэнгүйг дахин нягтлаагүй.',
      requirements: ['Та Солонгос иргэн бөгөөд олон соёлын дүрэмд таарна. Эцэг эх хоёулаа гадаадын иргэн бол энэ квот биш.', 'Орлогын хязгаар ба доод оноог тухайн удирдамжаас харна.'],
      requiredDocs: ['Сургуулийн бүртгэл', 'Гэр бүл, гэрлэлтийн тодорхойлолт', 'Иргэншил авсан бол дэлгэрэнгүй үндсэн тодорхойлолт'],
      visaNote: 'Солонгос иргэн улсын тэтгэлгийг харж болно. Тэдгээр хуудсыг энэ удаа нягтлаагүй.',
      gapHint: 'Хичээлийн солонгос хэл TOPIK 4 орчим бол бичиг баримт илүү өрсөлдөх чадвартай.',
    },
    'univ-vocational-grad': {
      title: 'Ижил чиглэлийн мэргэжлийн сургууль төгсөгчийн нэмэлт квот',
      summary: 'Зарим их сургууль тохирох мэргэжлийн сургууль төгсөгчдөд бага нэмэлт квот үлдээдэг. Meister хасагдана. Солонгос бичвэр дэх суудлын тоог удирдамж бүрээр дахин нягтлаагүй.',
      requirements: ['Энгийн мэргэжлийн сургууль төгсөнө. Meister болон холимог сургуулийн ердийн анги хасагдана.', 'Мэргэжил таарна, эсвэл шаардлагатай мэргэжлийн кредитээ авсан. Кредитийн тоо дараа нь өөрчлөгдөнө.'],
      requiredDocs: ['Мэргэжлийн сургуулийн бүртгэл', 'Захирлын ижил чиглэлийн тодорхойлолт'],
      visaNote: 'Зарим богино коллежийн хөтөлбөр ажлын визтэй холбогдоно. HiKorea дээрх одоогийн дүрмийг харна.',
      gapHint: 'Мэргэжлийн кредит ба TOPIK түвшинг хамтад нь бэлд.',
    },
  },
  visa: {
    both_foreign: {
      title: 'Эцэг эх нь гадаадын иргэн сурагчийн зам',
      warning: 'Сонгосон байдал хадгалагдахгүй. F-1, F-3, D-4-3 визтэй ахлах ангийн сурагч ерөнхийдөө цагийн ажил хийж болохгүй.',
      nodes: [
        { stage: 'Ахлах төгсөөд шууд ажил (Солонгост 7+ жил)', desc: 'Нас, Солонгост байсан жил, сургууль таарвал их сургуульгүйгээр ажил хайх эсвэл ажиллах эрх гарч болно. HiKorea дээр баталгаажуул.' },
        { stage: 'Коллеж эсвэл их сургууль', desc: 'Ихэвчлэн D-2 руу солино. Зарим F виз чөлөөлөгдөнө. Холбогдсон техникийн хөтөлбөрийн ажлын цаг өөр.' },
        { stage: 'Төгссөний дараа', desc: 'Ажил хайх оршин суухыг 2025 онд өргөтгөсөн. Хугацаа ба TOPIK нөхцлийг одоогийн дүрмээс харна.' },
        { stage: 'Ажил ба урт хугацаа', desc: 'Ажлын визийн цалингийн доод хэмжээ ба F-2-R-ийн солонгос хэлний шаардлага өөрчлөгдсөн. HiKorea-ийн одоогийн дүрмийг ашигла.' },
      ],
    },
    multicultural: {
      title: 'Олон улсын гэрлэлтийн гэр бүлийн сурагчийн зам',
      warning: 'Солонгос иргэншилтэй бол визийн хязгаар ихэвчлэн үйлчлэхгүй. Тэгш боломжийн элсэлт ба солонгос тэтгэлгийг харж болно.',
      nodes: [
        { stage: 'Дундаас ахлах руу', desc: 'Сөүлийн мэргэжлийн сургуулийн ирээдүйн авьяас (дүн харахгүй, ярилцлага гол) эсвэл энгийн ахлах.' },
        { stage: 'Ахлах сургууль', desc: 'Эх хэл, солонгос хэлээ хадгал. Мэргэжлийн сургууль сонговол мэргэжлийн кредитийг анхаар.' },
        { stage: 'Их сургууль', desc: 'Тэгш боломж эсвэл мэргэжлийн сургууль төгсөгчийн квот. Тоог дахин нягтлаагүй.' },
      ],
    },
    mid_entry: {
      title: 'Сургуулийн насандаа Солонгост ирсэн зам',
      warning: 'Гадаадын иргэн сурагч GED сонговол «эцэг эх хоёулаа гадаадын иргэн» квотоос хаагдаж болно. Гадаадаас шинээр авдаг мэргэжлийн визийг түр зогсоосон гэж мэдээлсэн тул төлөвлөхөөсөө өмнө баталгаажуул.',
      nodes: [
        { stage: 'Солонгосын сургуульд орох', desc: 'Хятад, мөн 2026-09-11-нээс Вьетнам апостиль ашиглана. 2027-02-28-аас өмнөх Тайланд ба Камбож консулын баталгаатай хэвээр.' },
        { stage: 'Ахлах сургууль', desc: 'Квотын гадуурх тусгай элсэлт, эсвэл мэргэжлийн сургуулийн ирээдүйн авьяас.' },
        { stage: 'Коллеж эсвэл их сургууль', desc: 'Энгийн ахлах сургууль төгсөөд гадаадын квот, эсвэл холбогдсон техникийн коллеж. Удирдамж бүрийг унш.' },
      ],
    },
    undocumented: {
      title: 'Удаан байсан ч бүртгэлгүй үеийн дэмжлэг',
      warning: 'Энэ сонголт серверт хадгалагдахгүй. Улсын сургууль элсүүлэхийн тулд цагаачлалын байгууллагад мэдэгдэх үүрэггүй.',
      nodes: [
        { stage: 'Хэнийг үзэх вэ', desc: 'Дэмжлэгийн дүрэм Солонгост байсан жил ба сургуульд сууж буйг харна. Дуусах огноог албан хуудаснаас баталгаажуул.' },
        { stage: 'Хүүхэд ба ах дүүгийн оршин суух', desc: 'Суралцах эрх сургуулийн хугацааг хамруулж, дараагийн дүрэм насанд хүрээгүй ах дүүсийг хамруулж болно. Энэ хураангуйг хамгийн сүүлийн зарлалтай тулгаагүй.' },
        { stage: 'Эцэг эх', desc: 'Үнэхээр өсгөж буй эцэг эх түр оршин суух ба торгуулийн хөнгөлөлт авч болно. Хуулийн тусламж ав. Зөвхөн энэ картаар шийдэж болохгүй.' },
        { stage: 'Ахлах төгссөний дараа', desc: 'Их сургууль, ажил хайх, эсвэл ажиллах эрх нээгдэж болно. HiKorea ба гэр бүлийн төв алхмыг баталгаажуулна.' },
      ],
    },
  },
  quiz: {
    'quiz-1': { question: 'Эцэг эх хоёулаа гадаадын иргэн байх квотын гадуурх элсэлт ердийн квотын солонгос сурагчидтай шууд өрсөлдөнө.', explanation: 'Квотын гадуурх элсэлт ердийн суудлаас тусдаа тул нэг өрсөлдөөн биш.' },
    'quiz-2': { question: 'Оршин суух нь баталгаажаагүй хүүхэд оршин сууж буйгаа нотлоход улсын сургуульд орж болно.', explanation: 'Элсэлтийн дүрэм боловсрол эзэмших эрхийг хамгаалдаг бөгөөд улсын сургуулийн ажилтан хүүхдийг цагаачлалд мэдэгдэх үүрэггүй.' },
    'quiz-3': { question: 'Их сургуульд орсон хойно хамааралтай виз өөрөө үргэлжилдэг тул статус солих шаардлагагүй.', explanation: 'Ихэвчлэн стандарт элсэлтийн тодорхойлолт авч, оюутны оршин суух (D-2) руу солих эсэхээ шалгана.' },
    'quiz-4': { question: 'Сөүлийн мэргэжлийн сургуулийн ирээдүйн авьяас 100% дунд сургуулийн дүнгээр шалгаруулна.', explanation: 'Ажиллах эсвэл бизнес эхлүүлэх хүсэл, ирц, ярилцлагыг харна. Зөвхөн дүн биш.' },
  },
  docs: {
    'doc-apostille': { name: 'Апостиль эсвэл консулын тамга', whereToGet: 'Бичиг олгосон улсын ГХЯ эсвэл консулын хэлтэс', tip: '2–6 долоо хоног болж болно. Дуусахаас хоёр сарын өмнө эхэл.' },
    'doc-transcript': { name: 'Гадаад сургуулийн бүх дүн ба суралцсан тодорхойлолт', whereToGet: 'Гадаад сургууль, солонгос эсвэл англи орчуулгын нотариаттай', tip: 'Огноо ба анги хэвлэгдсэн эсэхийг шалга.' },
    'doc-topik': { name: 'TOPIK-ийн дүн', whereToGet: 'TOPIK-ийн албан сайт (topik.go.kr)', tip: 'Дүн зарлагдсан өдрөөс хоёр жил хүчинтэй.' },
    'doc-finance': { name: 'Мөнгөний нотолгоо (банкны үлдэгдэл)', whereToGet: 'Өөрийн эсвэл эцэг эхийн банк. Тэтгэлгийн захидал заримдаа орлоно.', tip: 'Дүн ба «30 хоногийн дотор олгосон» дүрэм сургууль бүрээр өөр.' },
    'doc-family': { name: 'Гэр бүлийн бичиг', whereToGet: 'Government24, хорооны төв, эсвэл гадаадын гэр бүлийн нотариат', tip: 'Иргэншил авсан түүх хэрэгтэй бол дэлгэрэнгүй үндсэн тодорхойлолтыг хамт ав.' },
  },
  scholarships: {
    kosaf: { name: 'Улсын тэтгэлэг (Оюутан дэмжих сан)', benefit: 'Орлогын бүлгээр сургалтын төлбөр', excludeRule: 'Солонгос иргэн оюутанд. Эцэг эх хоёулаа гадаадын иргэн бол ихэвчлэн хамаарахгүй. Нягтлаагүй.' },
    woori: { name: 'Woori олон соёлын тэтгэлгийн сан', benefit: 'Дундаж орлогоос доош өрхөд сургуулийн түвшнээр тогтмол олголт. Нягтлаагүй.', excludeRule: 'Хуучин тэмдэглэлд эцэг эх хоёулаа гадаадын иргэн болон хойд солонгосоос ирсэн хүмүүс өргөдөл гаргахгүй гэжээ. Нягтлаагүй.' },
    myungin: { name: 'Myungin олон соёлын тэтгэлэг', benefit: 'Оюутны амьжиргааны тэтгэлэг. Нягтлаагүй.', excludeRule: 'Хуучин тэмдэглэл эхний ба сүүлийн семестрийг, мөн эцэг эх хоёулаа гадаадын иргэнийг хассан. Нягтлаагүй.' },
    gks: { name: 'Засгийн газрын тэтгэлэг (GKS)', benefit: 'Сургалтын төлбөр ба амьжиргаа. Өндөр TOPIK хэлний жилийг алгасаж болно. Нягтлаагүй.', excludeRule: 'Зэрэг горимд орж буй гадаадын оюутанд. Элчин болон сургуулийн урилгыг унш. Нягтлаагүй.' },
    sdream: { name: 'Samsung Dream, дэлхийн итгэл найдвар', benefit: 'Хамтран ажиллах сургуульд сургалтын төлбөр ба сарын олголт, TOPIK-ийн нөхцөлтэй. Нягтлаагүй.', excludeRule: 'Хуучин тэмдэглэлд Солонгосын сургуульд нэг семестер суусан ч өргөдөл гаргахгүй гэжээ. Нягтлаагүй.' },
  },
};

const ar: CoreCopy = {
  ...en,
  backgrounds: {
    both_foreign: 'كلا الوالدين أجنبيان',
    multicultural: 'زواج دولي / أسرة متعددة الثقافات',
    mid_entry: 'التحقت بالمدرسة في كوريا بعد العيش في الخارج',
    undocumented: 'وضع الإقامة غير مؤكد',
  },
  koreanLevels: { beginner: 'مبتدئ، بلا TOPIK', topik_3_4: 'TOPIK المستوى 3–4', topik_5_6: 'TOPIK المستوى 5–6' },
  fields: { it: 'تقنية / برمجيات', culinary: 'طبخ / سياحة', design: 'تصميم', business: 'أعمال / تجارة', health: 'صحة / تمريض' },
  levelMiddle: 'المرحلة المتوسطة (قبول الثانوية)',
  levelHigh: 'المرحلة الثانوية (الجامعة ومنح TOPIK)',
  backgroundHeading: 'وضع الأسرة (لا يُحفظ)',
  koreanHeading: 'مستوى الكورية',
  fieldHeading: 'مجال الاهتمام',
  conditionsTitle: '1. اختر وضعك',
  warningTitle: 'اقرأ أولًا: ثلاثة أخطاء شائعة',
  warnings: [
    'فخ اختبار المعادلة (검정고시): إذا استخدم الطالب الأجنبي هذا الاختبار بدل الثانوية النظامية، فكثير من مسارات «الوالدان أجنبيان» لا تقبله. كل الجامعات في هذا الجدول معلّمة بأنها لا تقبله. لم نُعد مراجعة إلا دليل جامعة سونغسيل لربيع 2027.',
    'مدارس مايستر (마이스터고) لا تدخل في المقعد الجامعي الإضافي لخريجي المدارس المهنية.',
    'طلاب الثانوية على F-1 أو F-3 أو D-4-3 لا يُسمح لهم بالعمل عادة. ادفع الرسوم فقط إلى حساب الجامعة الرسمي.',
  ],
  matchedTitle: '2. المسارات المتاحة الآن',
  gapBadge: 'ممكن بعد استكمال الشرط',
  gapLead: 'الناقص:',
  requirementsLabel: 'الشروط الرئيسة',
  docsLabel: 'الأوراق المطلوبة',
  termHint: 'اضغط المصطلح غير المفهوم. يُحفظ رمز المصطلح فقط على هذا الجهاز.',
  legalLead: 'الأساس',
  schoolsTitle: '3. المدارس المهنية ومايستر في سيول (رموز المدارس مُراجعة)',
  universitiesTitle: '3. منح TOPIK في جامعات سيول',
  searchLabel: 'ابحث بالمدرسة أو التخصص أو الكلمة',
  searchMiddle: 'مثال: تجارة، سياحة، برمجيات',
  searchHigh: 'مثال: سونغسيل، TOPIK',
  majorsLead: 'التخصصات',
  gedHead: 'اختبار المعادلة (검정고시)',
  scholarshipTitle: 'منح خارج الجامعة حسب الوضع الذي اخترته',
  noScholarship: 'إذا لم تستقر الإقامة بعد، راجع مسار الدعم أولًا ثم شروط المنحة.',
  unverified: 'لم تُراجع الوثيقة',
  verified: 'تمت المراجعة',
  applies: 'يسري على',
  apostilleTitle: '4. كيف تُصدّق أوراق المدرسة من بلدك',
  apostilleStatus: { apostille: 'الأبوستيل (아포스티유) ينطبق', transition: 'القواعد تتغير (راجع تاريخ التقديم)', consular: 'تصديق قنصلي إلزامي' },
  countries: {
    CN: { name: 'الصين (البر الرئيسي)', guide: 'دولة أبوستيل. لا حاجة لختم قنصلي زائد.' },
    VN: { name: 'فيتنام', guide: 'اتفاق الأبوستيل نافذ من 11 سبتمبر 2026. أوراق المدارس الخاصة تُوثق محليًا ثم يوضع الأبوستيل.' },
    MN: { name: 'منغوليا', guide: 'دولة أبوستيل. اطلبه من وزارة خارجية البلد الذي أصدر الورقة.' },
    RU: { name: 'روسيا وأوزبكستان وكازاخستان', guide: 'دول أبوستيل. جهّز الأبوستيل وترجمة موثقة للشهادة والدرجات.' },
    PH: { name: 'الفلبين', guide: 'دولة أبوستيل (DFA). تحقق أيضًا من خطوة التوثيق المحلي للمدارس الخاصة.' },
    BD: { name: 'بنغلاديش', guide: 'اتفاق الأبوستيل نافذ من 30 مارس 2025.' },
    TH: { name: 'تايلاند', guide: 'الأوراق المقدمة قبل 28 فبراير 2027 ما زالت تحتاج تصديقًا قنصليًا. الأبوستيل من 28 فبراير 2027.' },
    KH: { name: 'كمبوديا وميانمار ولاوس', guide: 'ليست دول أبوستيل. بعد وزارة الخارجية يلزم تصديق قنصلي.' },
  },
  referralTitle: '6. ترجمة مجانية في حيك',
  counselNeed: 'أحتاج استشارة',
  counselDone: 'تم ربط الاستشارة',
  counselFail: 'لم يتم الربط',
  interpreterMissing: 'لا يوجد عدد معلن لهذه اللغة. اتصل بدانوري 1577-1366.',
  interpreterZero: 'القائمة فيها صفر. اسأل مركزًا قريبًا أو 1577-1366.',
  interpreterSome: 'أشخاص. اتصل لتسأل إن كان هناك موعد.',
  speakTitle: '7. بطاقة تُريها للمرشد',
  disclaimer: 'القواعد تتغير. قبل التقديم أو تغيير الإقامة راجع الجامعة وadiga وHiKorea. الصفوف المعلّمة «لم تُراجع» لم تُطابق مع الإعلان الأصلي في هذا التحديث.',
  sourceMissing: 'لم يُؤكد رابط رسمي محدد لهذا البند.',
  docsTitle: '1. قائمة أوراقي',
  docsProgress: 'اكتمل',
  docDone: 'تم',
  docMark: 'علّم كمكتمل',
  docHard: 'صعب الحصول عليه',
  whereLead: 'من أين',
  tipLead: 'ملاحظة',
  barrierPrompt: 'ما الأصعب؟ يُحفظ رمز السبب فقط.',
  barriers: { overseas: 'صعب إصداره من الخارج', cost: 'تكلفة الترجمة أو التوثيق', format: 'لا أعرف النموذج', deadline: 'الوقت لا يكفي' },
  quizTitle: '2. فحص صح / خطأ في دقيقة',
  quizLead: 'أربعة التباسات شائعة. يُحفظ الجواب الأول فقط كصح أو خطأ.',
  quizYes: 'صح',
  quizNo: 'خطأ',
  quizCorrect: 'صحيح',
  quizWrong: 'ليس كذلك. الجواب:',
  explainLead: 'السبب',
  questionTitle: '3. سؤال في سطر واحد',
  questionLabel: 'اكتب سؤالًا واحدًا. لا تكتب الاسم أو الهاتف أو رقم تسجيل الأجنبي.',
  questionPlaceholder: 'مثال: هل أستطيع التقديم باختبار المعادلة؟',
  questionSubmit: 'أظهر الشرح',
  topicLead: 'الموضوع',
  topicSaved: 'يُحفظ رمز الموضوع فقط. الجملة لا تُحفظ.',
  scheduleTitle: '4. مواعيد الاختبار والتقديم',
  schedules: {
    'sched-meister-apply': { title: 'تقديم مدارس مايستر في سيول', target: 'الصف 9' },
    'sched-voc-apply': { title: 'المدارس المهنية في سيول، قبول خاص', target: 'الصف 9' },
    'sched-voc-interview': { title: 'مقابلات المدارس المهنية في سيول', target: 'الصف 9' },
    'sched-topik-109': { title: 'TOPIK رقم 109 (ورقي)', target: 'كل الطلاب' },
    'sched-topik-110': { title: 'TOPIK رقم 110 (ورقي)', target: 'كل الطلاب' },
    'sched-foreign-early-2028': { title: 'مسار الأجانب 2028 (نافذة يوليو)', target: 'الصف 12' },
    'sched-susi-2028': { title: 'التقديم المبكر لعام 2028', target: 'الصف 12' },
  },
  careerTitle: 'وظائف وتخصصات حسب المجال',
  jobsLead: 'أمثلة وظائف',
  majorsWord: 'تخصصات قريبة',
  career: {
    it: { jobs: 'تطوير برمجيات، أمن معلومات، تحليل بيانات', majors: 'هندسة حاسوب (컴퓨터공학)، برمجيات', note: 'يُذكر هذا المجال كثيرًا مع تأشيرات العمل المتخصص. تأكد من القاعدة الحالية.' },
    culinary: { jobs: 'طباخ فندق، مرشد سياحي، موظف فندق', majors: 'طبخ (조리학)، سياحة', note: 'لغتك الأم مع الكورية ميزة حقيقية.' },
    design: { jobs: 'تصميم واجهات، حركة، علامة تجارية', majors: 'تصميم بصري (시각디자인)، وسائط رقمية', note: 'ملف الأعمال مهم، لذا يكون الامتحان الكتابي بالكورية أحيانًا أقل وزنًا.' },
    business: { jobs: 'مبيعات خارجية، تجارة، أعمال مالية', majors: 'تجارة دولية (국제통상)، إدارة', note: 'الشركات التي تتاجر مع بلدك تحتاج موظفين بلغتين.' },
    health: { jobs: 'تمريض، منسق طبي، صحة أسنان', majors: 'تمريض (간호학)، إدارة صحية', note: 'كثير من هذه الوظائف تحتاج رخصة وطنية.' },
  },
  guides: {
    ged: 'النجاح في اختبار المعادلة الكوري (검정고시) يُعامل كنفس مستوى شهادة الثانوية. مسار الجامعة «الوالدان أجنبيان» مختلف: كل الجامعات في الجدول معلّمة بأنها لا تقبل الاختبار. دليل سونغسيل لربيع 2027 فقط هو الذي رُوجع ويقول إن الاختبار غير مقبول. راجع كل دليل مرة أخرى.',
    scholarship: 'الطالب الكوري الجنسية ينظر إلى المنحة الوطنية ومنح الأسر متعددة الثقافات. الطالب الأجنبي ينظر إلى منحة TOPIK في كل جامعة. في سونغسيل، المستويات 3/4/5/6 هي 40/60/80/100 بالمئة، وللفصل الأول فقط. الجامعات الأخرى في الجدول لم تُراجع من جديد.',
    part_time: 'الطالب الأجنبي يحتاج عادة إذنًا قبل العمل. اسأل مكتب العلاقات الدولية في المدرسة أولًا. الجملة التي كتبتها لا تُحفظ.',
    visa_status: 'بعد القبول الجامعي، تحقق على HiKorea إن كان يجب تغيير الإقامة إلى دراسة. إذا كانت الإقامة غير واضحة، اتصل بمركز الأسرة أو دانوري 1577-1366. الجملة ونوع التأشيرة لا يُحفظان.',
    documents: 'كشوف الدرجات الأجنبية تحتاج عادة أبوستيل أو تصديقًا قنصليًا. قد تستغرق أسابيع، فابدأ مبكرًا.',
    other: 'الجملة لا تُحفظ. يبقى رمز الموضوع فقط على هذا الجهاز. لجواب محدد اتصل بمركز الأسرة في حيك أو 1577-1366.',
  },
  helpTitle: 'مساعدة رسمية',
  helpLead: 'فُتحت هذه الروابط ورُوجعت في 26 نوفمبر 2026. أرقام هواتف الأحياء في الصفحة لم تُراجع واحدًا واحدًا.',
  centerSnapshot: 'رقم الهاتف وعدد المترجمين أدناه لقطة قديمة. تأكد قبل الزيارة.',
  tracks: {
    'hs-special-2c': {
      title: 'قبول ثانوي خاص في سيول، النوع 2-다 (طالب أجنبي)',
      summary: 'الطالب الأجنبي الذي درس في الخارج ثم انتقل إلى مدرسة متوسطة كورية وسيتخرج يمكن قبوله خارج المقاعد العادية، ضمن 2% في كل مدرسة. لم يُربط هذا الوصف بإعلان واحد مؤكد في هذا التحديث.',
      requirements: ['درست في الخارج ثم انتقلت إلى مدرسة متوسطة كورية وستتخرج.', 'تجتاز مراجعة سيول الخاصة. المراجعة أكثر من مرة في السنة؛ تأكد من الإعلان الحالي.'],
      requiredDocs: ['نموذج المراجعة الخاصة', 'كشف درجات وشهادة قيد من المدرسة الأجنبية (أبوستيل أو ختم قنصلي)', 'إثبات تسجيل الأجنبي لك ولوالديك', 'سجل الدخول والخروج'],
      visaNote: 'الأبوستيل أو الختم القنصلي قد يأخذ 2–6 أسابيع. ابدأ نحو أوائل يوليو في الصف 9.',
      gapHint: 'إذا لم تدرس في مدرسة أجنبية، انظر مسار الموهبة المستقبلية في المدرسة المهنية أدناه.',
    },
    'hs-vocational-future': {
      title: 'المدارس المهنية في سيول: الموهبة المستقبلية والدمج الاجتماعي',
      summary: 'مسار الموهبة المستقبلية لا يستخدم درجات المواد. ينظر إلى الحضور والخدمة والمقابلة، لذلك يكون غالبًا الباب الأوسع. لدخول 2027 كانت نافذة التقديم الخاص 23–24 نوفمبر 2026.',
      requirements: ['القبول الخاص: 23–24 نوفمبر 2026. القبول العام: 30 نوفمبر–1 ديسمبر 2026. التواريخ من إعلان تعليم سيول.', 'إذا أردت لاحقًا المقعد الجامعي لخريجي المدارس المهنية فاختر مدرسة مهنية (특성화고) لا مدرسة مايستر (마이스터고).'],
      requiredDocs: ['طلب (إلكتروني لطلاب سيول؛ حضوري لاختبار المعادلة أو مدينة أخرى)', 'سجل المدرسة المتوسطة أو شهادة نجاح المعادلة', 'أوراق التنوع الاجتماعي فقط إذا كان دخل الأسرة عند 160% من الوسيط أو أقل'],
      visaNote: 'يوجد مسار عمل منفصل لبعض الخريجين طويلي الإقامة. أكّده على HiKorea.',
      gapHint: 'هذا مسار الثانوية المفتوح لكل الأوضاع ومستويات الكورية في هذا التطبيق.',
    },
    'univ-foreign-parents': {
      title: 'مسار جامعي: الطالب والوالدان أجانب',
      summary: 'إذا كنت أنت ووالداك أجانب، فكثير من الجامعات تقبل بالأوراق والمقابلة وTOPIK خارج المقاعد العادية. اختبار المعادلة معلّم كغير مقبول في كل جامعات هذا التطبيق. أُعيدت مراجعة سونغسيل فقط.',
      requirements: ['أنت ووالداك أجانب. قواعد أحد الوالدين أو الجنسية المزدوجة تختلف حسب الجامعة.', 'شهادة ثانوية نظامية، مع مستوى TOPIK الذي تطلبه الجامعة.'],
      requiredDocs: ['شهادة ثانوية نظامية وكشف درجات (أبوستيل أو ختم قنصلي)', 'أوراق عائلة موثقة', 'درجة TOPIK ضمن سنتين', 'كشف رصيد فقط إذا احتجت تأشيرة D-2. كثير من حالات F معفاة.'],
      visaNote: 'ادفع الرسوم فقط إلى حساب الجامعة الرسمي.',
      gapHint: 'إذا كانت كوريتك ما زالت مبتدئة، فبلغ مستوى TOPIK الذي تنشره الجامعة المستهدفة قبل التقديم.',
    },
    'univ-multicultural-eq': {
      title: 'مسار جامعي لتكافؤ الفرص للأسر متعددة الثقافات',
      summary: 'هذا لمواطن كوري تنطبق أسرته على قانون الأسر متعددة الثقافات، غالبًا عبر والد مهاجر بالزواج أو متجنس. إذا كان الوالدان أجنبيين فاستخدم مسار الأجانب. تفاصيل الجامعات لم تُراجع من جديد.',
      requirements: ['أنت مواطن كوري وتنطبق عليك قاعدة الأسرة متعددة الثقافات. من والدهما أجنبيان ليسا في هذا المسار.', 'تحقق من حدود الدخل وأي حد أدنى للاختبار في دليل تلك الجامعة.'],
      requiredDocs: ['السجل المدرسي', 'شهادات الأسرة والزواج', 'شهادة أساسية مفصلة إذا وُجد تجنيس'],
      visaNote: 'المواطن الكوري يمكنه النظر في المنح الوطنية. تلك الصفحات لم تُراجع في هذا التحديث.',
      gapHint: 'كورية دراسية حول TOPIK 4 تجعل مراجعة الأوراق أسهل.',
    },
    'univ-vocational-grad': {
      title: 'مقعد إضافي لخريجي المدرسة المهنية في التخصص نفسه',
      summary: 'بعض الجامعات تبقي مقعدًا صغيرًا خارج الخطة لخريجي المدارس المهنية في تخصص مطابق. خريجو مايستر مستبعدون. أرقام المقاعد في النص الكوري لم تُراجع مقابل كل دليل.',
      requirements: ['تتخرج من مدرسة مهنية عادية. مدارس مايستر والمسار العام داخل المدارس المختلطة مستبعدة.', 'تخصصك يطابق، أو أكملت الساعات المهنية المطلوبة. الرقم يتغير مع نظام الساعات لاحقًا.'],
      requiredDocs: ['سجل المدرسة المهنية', 'تأكيد التخصص نفسه من المدير'],
      visaNote: 'بعض برامج الكليات القصيرة ترتبط بتأشيرة عمل. تأكد من القاعدة الحالية على HiKorea.',
      gapHint: 'حافظ على شرط الساعات المهنية ومستوى TOPIK معًا.',
    },
  },
  visa: {
    both_foreign: {
      title: 'مسار الطالب الذي والداه أجنبيان',
      warning: 'الخيار الذي تضغطه لا يُحفظ. طلاب الثانوية على F-1 أو F-3 أو D-4-3 لا يُسمح لهم بالعمل الجزئي عادة.',
      nodes: [
        { stage: 'عمل بعد الثانوية (7 سنوات فأكثر في كوريا)', desc: 'إذا تطابق العمر وسنوات الإقامة والدراسة، فقد يمكن البحث عن عمل أو وضع عمل بلا جامعة. أكّد ذلك على HiKorea.' },
        { stage: 'كلية أو جامعة', desc: 'غالبًا يلزم التغيير إلى D-2. بعض أوضاع F معفاة. برنامج تقني مرتبط له ساعات عمل مختلفة.' },
        { stage: 'بعد التخرج', desc: 'قواعد البحث عن عمل وُسّعت في 2025. تحقق من المدة الحالية وشرط TOPIK.' },
        { stage: 'العمل والإقامة الأطول', desc: 'حدود الراتب لتأشيرة العمل وشرط الكورية لـ F-2-R تغيّرت. استخدم قاعدة HiKorea الحالية لا هذا الملخص.' },
      ],
    },
    multicultural: {
      title: 'مسار طالب أسرة الزواج الدولي',
      warning: 'إذا كنت تحمل الجنسية الكورية فقيود التأشيرة لا تنطبق عادة. يمكنك النظر في قبول تكافؤ الفرص والمنح الكورية.',
      nodes: [
        { stage: 'من المتوسطة إلى الثانوية', desc: 'موهبة مستقبلية في مدرسة مهنية بسيول (بلا درجات مواد، والمقابلة هي الأساس) أو ثانوية عامة.' },
        { stage: 'الثانوية', desc: 'حافظ على لغتك الأم والكورية، وعلى الساعات المهنية إذا اخترت مدرسة مهنية.' },
        { stage: 'الجامعة', desc: 'تكافؤ الفرص أو مقعد خريجي المدرسة المهنية. أعداد الجامعات في الصفحة لم تُراجع.' },
      ],
    },
    mid_entry: {
      title: 'مسار من انتقل إلى كوريا أثناء سن الدراسة',
      warning: 'الطالب الأجنبي الذي يختار اختبار المعادلة الكوري قد يُمنع من مسارات الجامعة «الوالدان أجنبيان». أُبلغ عن توقف تأشيرات المدارس المهنية الجديدة من الخارج؛ تأكد قبل أن تعتمد عليها.',
      nodes: [
        { stage: 'دخول مدرسة كورية', desc: 'الصين وفيتنام (من 11 سبتمبر 2026) تستخدمان الأبوستيل. تايلاند قبل 28 فبراير 2027 وكمبوديا ما زالتا تحتاجان تصديقًا قنصليًا.' },
        { stage: 'الثانوية', desc: 'القبول الخاص خارج المقاعد، أو مسار الموهبة المستقبلية في المدرسة المهنية.' },
        { stage: 'كلية أو جامعة', desc: 'شهادة ثانوية نظامية ثم مسار الأجانب، أو كلية تقنية مرتبطة. راجع كل دليل.' },
      ],
    },
    undocumented: {
      title: 'مسار الدعم حين تكون الإقامة الطويلة بلا تسجيل',
      warning: 'هذا الاختيار لا يُحفظ على أي خادم. المدارس الحكومية غير ملزمة بإبلاغ الهجرة عنك لأجل التسجيل.',
      nodes: [
        { stage: 'من يمكن النظر في حالته', desc: 'قواعد الدعم تستخدم سنوات العيش في كوريا والتسجيل المدرسي. أكّد التواريخ ونهاية 2028 على صفحة رسمية قبل الاعتماد عليها.' },
        { stage: 'إقامة الطفل والإخوة', desc: 'وضع الدراسة قد يغطي المدرسة، وقاعدة لاحقة قد تغطي الإخوة القُصّر. هذا الملخص لم يُراجع مقابل أحدث إعلان.' },
        { stage: 'الوالدان', desc: 'الوالد الذي يربي الطفل فعلًا قد يحصل على إقامة مؤقتة وتخفيض غرامة. اطلب مساعدة قانونية؛ لا تقرر من هذه البطاقة وحدها.' },
        { stage: 'بعد الثانوية', desc: 'قد تصبح الجامعة أو البحث عن عمل أو وضع العمل ممكنًا. يجب أن يؤكد HiKorea ومركز الأسرة الخطوة.' },
      ],
    },
  },
  quiz: {
    'quiz-1': { question: 'مسار المقعد الإضافي حين يكون الوالدان أجنبيين يتنافس مباشرة مع الطلاب الكوريين في المقعد العادي.', explanation: 'القبول خارج المقعد منفصل عن المقاعد العادية، لذلك لست في المنافسة نفسها.' },
    'quiz-2': { question: 'الطفل الذي لم تُؤكد إقامته يستطيع دخول مدرسة حكومية إذا أُثبت السكن.', explanation: 'قاعدة التسجيل تحمي الحق في التعليم، وموظفو المدرسة الحكومية غير ملزمين بإبلاغ الهجرة عن الطفل.' },
    'quiz-3': { question: 'بعد دخول الجامعة تستمر تأشيرة التابع تلقائيًا فلا حاجة لتغيير الوضع.', explanation: 'تحتاج عادة شهادة قبول معيارية ويجب أن تتحقق من التغيير إلى إقامة طالب (D-2).' },
    'quiz-4': { question: 'قبول الموهبة المستقبلية في المدارس المهنية بسيول يستخدم درجات المتوسطة بنسبة 100%.', explanation: 'ينظر إلى الرغبة في العمل أو بدء مشروع والحضور والمقابلة، لا إلى الدرجات وحدها.' },
  },
  docs: {
    'doc-apostille': { name: 'أبوستيل أو ختم قنصلي', whereToGet: 'وزارة خارجية بلد الإصدار، أو القسم القنصلي', tip: 'قد يأخذ 2–6 أسابيع. ابدأ قبل الموعد بنحو شهرين.' },
    'doc-transcript': { name: 'كشف درجات كامل وشهادة قيد من المدرسة الأجنبية', whereToGet: 'المدرسة في الخارج، مع ترجمة موثقة بالكورية أو الإنجليزية', tip: 'تأكد أن التواريخ والصفوف مطبوعة.' },
    'doc-topik': { name: 'كشف درجات TOPIK', whereToGet: 'موقع TOPIK الرسمي (topik.go.kr)', tip: 'الدرجة صالحة لسنتين من تاريخ النتيجة.' },
    'doc-finance': { name: 'إثبات المال (رصيد بنكي)', whereToGet: 'بنكك أو بنك أحد الوالدين. خطاب منحة قد يحل محله أحيانًا.', tip: 'المبلغ وقاعدة «صدر خلال 30 يومًا» يختلفان حسب الجامعة.' },
    'doc-family': { name: 'أوراق الأسرة', whereToGet: 'Government24 أو مركز الحي أو سجل أسرة أجنبي موثق', tip: 'إذا تجنس أحد، أحضر أيضًا الشهادة الأساسية المفصلة.' },
  },
  scholarships: {
    kosaf: { name: 'المنحة الوطنية (مؤسسة دعم الطلاب)', benefit: 'دعم رسوم حسب شريحة الدخل', excludeRule: 'للطلاب الكوريي الجنسية. من والداهما أجنبيان خارجها عادة. لم تُراجع.' },
    woori: { name: 'مؤسسة ووري للمنح متعددة الثقافات', benefit: 'مبلغ ثابت حسب المرحلة للأسر عند الوسيط أو دونه. لم تُراجع.', excludeRule: 'الملاحظة القديمة تقول إن الأسر التي والداها أجنبيان والقادمين من كوريا الشمالية لا يقدمون. لم تُراجع.' },
    myungin: { name: 'منحة ميونغين متعددة الثقافات', benefit: 'منحة معيشة لطلاب الجامعة. لم تُراجع.', excludeRule: 'الملاحظة القديمة تستثني من والداهما أجنبيان والفصل الأول والفصل الأخير. لم تُراجع.' },
    gks: { name: 'منحة الحكومة الكورية (GKS)', benefit: 'رسوم ومعيشة. درجة TOPIK العالية قد تلغي سنة اللغة. لم تُراجع.', excludeRule: 'للطلاب الأجانب في برنامج درجة. اقرأ دعوة السفارة والجامعة. لم تُراجع.' },
    sdream: { name: 'منحة سامسونغ دريم، الأمل العالمي', benefit: 'رسوم إضافة إلى مبلغ شهري في جامعات شريكة، مع شرط TOPIK. لم تُراجع.', excludeRule: 'الملاحظة القديمة تقول إن من درس ولو فصلًا واحدًا في مدرسة كورية لا يقدم. لم تُراجع.' },
  },
};

const COPIES: Record<Exclude<SupportedLangCode, 'ko'>, CoreCopy> = {
  en,
  'zh-Hans': zh('hans'),
  'zh-Hant': zh('hant'),
  vi,
  ru,
  mn,
  ar,
};

export function getCoreCopy(lang: SupportedLangCode): CoreCopy | null {
  if (lang === 'ko') return null;
  const base = COPIES[lang];
  return {
    ...base,
    docs: { ...base.docs, ...EXTRA_DOCS[lang] },
    quiz: { ...base.quiz, ...EXTRA_QUIZ[lang] },
  };
}

export const TRANSLATED_LANGS = Object.keys(COPIES) as Array<Exclude<SupportedLangCode, 'ko'>>;
