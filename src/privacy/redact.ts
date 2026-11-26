export interface Redaction {
  text: string;
  flags: string[];
  blocked: boolean;
}

const STATUS_WORDS =
  '미등록|불법\\s?체류|체류\\s?기간\\s?(?:만료|초과)|난민\\s?신청|overstay|undocumented|без документов|nhập cảnh trái phép|بدون إقامة';

const KO_COUNTRIES =
  '우즈베키스탄|카자흐스탄|키르기스스탄|방글라데시|인도네시아|스리랑카|파키스탄|캄보디아|베트남|필리핀|미얀마|러시아|몽골|네팔|태국|중국|일본|미국|인도|라오스|대만';

const SCHOOL_SUFFIXES = [
  '여자고등학교',
  '여자중학교',
  '초등학교',
  '중학교',
  '고등학교',
  '과학고',
  '국제고',
  '여고',
  '여중',
  '공고',
  '상고',
  '외고',
  '초',
  '중',
  '고',
];

const GENERIC_SCHOOL = new Set(['초등학교', '중학교', '고등학교', '초', '중', '고', '특성화고', '마이스터고']);

function pushFlag(flags: string[], flag: string) {
  if (!flags.includes(flag)) flags.push(flag);
}

function shield(text: string, re: RegExp, box: string[]): string {
  return text.replace(re, (match) => {
    const token = `\uE000${box.length}\uE001`;
    box.push(match);
    return token;
  });
}

function restore(text: string, box: string[]): string {
  return text.replace(/\uE000(\d+)\uE001/g, (_, index: string) => box[Number(index)] ?? '');
}

function replaceAll(text: string, re: RegExp, token: string, flag: string, flags: string[]): string {
  return text.replace(re, () => {
    pushFlag(flags, flag);
    return token;
  });
}

function redactSchools(text: string, flags: string[]): string {
  const suffix = SCHOOL_SUFFIXES.join('|');
  const re = new RegExp(`([가-힣A-Za-z]{2,12})(${suffix})(?=[\\s,.!?을를에이가은는의]|$)`, 'gu');
  return text.replace(re, (full, prefix: string, end: string) => {
    if (GENERIC_SCHOOL.has(`${prefix}${end}`.replace(/\s/g, ''))) return full;
    pushFlag(flags, 'school');
    return '[학교]';
  });
}

function redactChineseSchools(text: string, flags: string[]): string {
  return text.replace(/(?<=在)[\u4e00-\u9fff]{1,8}(?:中学|高中|小学)/gu, () => {
    pushFlag(flags, 'school');
    return '[학교]';
  });
}

export function redact(input: string): Redaction {
  const flags: string[] = [];
  const kept: string[] = [];
  let text = input.replace(/\p{Cf}/gu, '');
  text = shield(text, /TOPIK\s?\d{1,2}\s?급/giu, kept);
  text = shield(text, /D-?day/giu, kept);
  text = shield(text, /(?<!\d)\d{1,2}\s?급/gu, kept);
  text = shield(text, /특성화고|마이스터고/gu, kept);

  text = replaceAll(text, /\b\d{6}\s*[-–]?\s*[1-8]\d{6}\b/gu, '[등록번호]', 'rrn', flags);
  text = replaceAll(text, /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/gu, '[이메일]', 'email', flags);
  if (/https?:\/\/\S+|www\.\S+/iu.test(text)) {
    pushFlag(flags, 'url');
    text = text.replace(/https?:\/\/\S+|www\.\S+/giu, '[링크]');
  }
  text = replaceAll(text, /(?:\+?82[-\s]?)?0?1[016789][-\s.]?\d{3,4}[-\s.]?\d{4}/gu, '[전화]', 'phone', flags);
  text = replaceAll(text, /\b0\d{1,2}[-\s.)]\d{3,4}[-\s.]\d{4}\b/gu, '[전화]', 'phone', flags);
  text = replaceAll(text, /\b[A-Z]{1,2}\d{7,8}\b/g, '[번호]', 'passport', flags);
  text = replaceAll(
    text,
    /\b[A-HR-Z]\s?[-‐–]?\s?\d{1,2}(?:\s?-\s?[0-9A-Z]{1,2}){0,2}\b/g,
    '[체류자격]',
    'visa_code',
    flags,
  );
  text = replaceAll(text, new RegExp(STATUS_WORDS, 'giu'), '[체류관련]', 'status_word', flags);
  text = replaceAll(
    text,
    new RegExp(`(?:${KO_COUNTRIES})\\s*(?:국적|사람|출신|인|에서\\s?왔)`, 'gu'),
    '[국적]',
    'nationality',
    flags,
  );
  text = replaceAll(text, /(?:제|내)\s*이름은\s*\S+?(?=이에요|예요|입니다)/gu, '[이름]', 'name', flags);
  text = replaceAll(text, /저는\s?[가-힣]{2,4}(?=이에요|예요|입니다)/gu, '[이름]', 'name', flags);
  text = replaceAll(text, /my name is \p{L}+(?:\s\p{L}+)?/giu, '[이름]', 'name', flags);
  text = replaceAll(text, /我叫[\u4e00-\u9fff]{1,4}/gu, '[이름]', 'name', flags);
  text = replaceAll(text, /меня зовут \p{L}+/giu, '[이름]', 'name', flags);
  text = replaceAll(text, /tôi tên(?: là)? \p{L}+(?:\s\p{L}+){0,3}/giu, '[이름]', 'name', flags);
  text = replaceAll(text, /миний нэр(?:ийг)? \p{L}+/giu, '[이름]', 'name', flags);
  text = replaceAll(text, /اسمي \p{L}+/gu, '[이름]', 'name', flags);
  text = replaceAll(text, /[가-힣]{2,4}\s?(?:선생님|쌤|씨|님)\b/gu, '[이름]', 'name', flags);
  text = redactSchools(text, flags);
  text = redactChineseSchools(text, flags);
  text = replaceAll(text, /만?\s?\d{1,2}\s?(?:살|세)/gu, '[나이]', 'age', flags);
  text = replaceAll(text, /\d{1,2}\s?years?\s?old/giu, '[나이]', 'age', flags);
  text = replaceAll(text, /\d{1,2}\s?(?:岁|歲|tuổi|лет|года|нас|سنة|عام)/gu, '[나이]', 'age', flags);
  text = replaceAll(text, /\b(?:19|20)\d{2}[./-]\d{1,2}[./-]\d{1,2}\b/g, '[날짜]', 'age', flags);
  text = replaceAll(text, /[가-힣]+(?:동|로|길)\s?\d+(?:-\d+)?(?:번지)?/gu, '[주소]', 'address', flags);
  text = replaceAll(text, /\d+\s?(?:동|호)\s?\d*호?/gu, '[주소]', 'address', flags);
  text = replaceAll(
    text,
    /(?:카톡|카카오톡|kakao|zalo|wechat|微信|telegram|instagram|인스타)\s*(?:id|아이디)?\s*[:：]?\s*\S+/giu,
    '[연락처]',
    'handle',
    flags,
  );
  text = replaceAll(text, /@[\w.]{3,}/gu, '[연락처]', 'handle', flags);
  text = restore(text, kept);
  text = replaceAll(text, /\d(?:[\s-]*\d){6,}/g, '[번호]', 'digits', flags);

  const digitsOnly = text.replace(/[^\d]/g, '');
  const blocked = flags.includes('url') || /\d{7,}/.test(digitsOnly);
  return { text, flags, blocked };
}
