import { describe, expect, it } from 'vitest';
import { redact } from '../src/privacy/redact';

const CASES: Array<{ input: string; output: string; flags: string[]; blocked?: boolean }> = [
  { input: '제 번호 010-1234-5678로 연락 주세요', output: '제 번호 [전화]로 연락 주세요', flags: ['phone'] },
  { input: '+82 10 1234 5678', output: '[전화]', flags: ['phone'] },
  { input: '구로 센터 02-869-0317 맞아요?', output: '구로 센터 [전화] 맞아요?', flags: ['phone'] },
  { input: '등록번호 900101-5123456', output: '등록번호 [등록번호]', flags: ['rrn'] },
  { input: 'abc.d@gmail.com 으로 보내 주세요', output: '[이메일] 으로 보내 주세요', flags: ['email'] },
  { input: '저 D-2 비자인데 알바 돼요?', output: '저 [체류자격] 비자인데 알바 돼요?', flags: ['visa_code'] },
  { input: '엄마가 F-6이고 저는 F-1-9예요', output: '엄마가 [체류자격]이고 저는 [체류자격]예요', flags: ['visa_code'] },
  { input: 'E-7-Y 나이 조건?', output: '[체류자격] 나이 조건?', flags: ['visa_code'] },
  { input: '저는 미등록인데 고등학교 갈 수 있어요?', output: '저는 [체류관련]인데 고등학교 갈 수 있어요?', flags: ['status_word'] },
  { input: '저는 베트남 사람이에요', output: '저는 [국적]이에요', flags: ['nationality'] },
  { input: '제 이름은 응우옌반안이에요', output: '[이름]이에요', flags: ['name'] },
  { input: 'my name is Ali Hassan, 17 years old', output: '[이름], [나이]', flags: ['name', 'age'] },
  { input: 'Меня зовут Анна', output: '[이름]', flags: ['name'] },
  { input: '我叫王伟，在大林中学', output: '[이름]，在[학교]', flags: ['name', 'school'] },
  { input: '안산원곡중 다니는 만 15세예요', output: '[학교] 다니는 [나이]예요', flags: ['school', 'age'] },
  { input: 'TOPIK 4급이면 장학금 돼요?', output: 'TOPIK 4급이면 장학금 돼요?', flags: [] },
  { input: '특성화고 원서 언제예요?', output: '특성화고 원서 언제예요?', flags: [] },
  { input: '고2인데 검정고시 봐도 돼요?', output: '고2인데 검정고시 봐도 돼요?', flags: [] },
  { input: '카톡 아이디 abc123 추가해 주세요', output: '[연락처] 추가해 주세요', flags: ['handle'] },
  { input: 'https://bit.ly/xx 확인', output: '[링크] 확인', flags: ['url'], blocked: true },
  { input: '계좌 1002 345 678901', output: '계좌 [번호]', flags: ['digits'] },
];

describe('redact', () => {
  it.each(CASES)('$input', ({ input, output, flags, blocked }) => {
    const result = redact(input);
    expect(result.text).toBe(output);
    expect(result.flags).toEqual(flags);
    expect(result.blocked).toBe(Boolean(blocked));
  });

  it('is idempotent and leaves no 7-digit run', () => {
    let seed = 20261126;
    const next = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed;
    };
    for (let i = 0; i < 1000; i += 1) {
      const length = (next() % 40) + 1;
      let sample = '';
      for (let n = 0; n < length; n += 1) sample += String.fromCharCode(32 + (next() % 90));
      const once = redact(sample);
      expect(redact(once.text).text).toBe(once.text);
      expect(once.text.replace(/[\s-]/g, '')).not.toMatch(/\d{7,}/);
    }
  });

  it('still catches a phone and an ID when Arabic marks are mixed in', () => {
    const mark = '\u200f';
    const phone = redact(`${mark}010-1234-5678${mark}`);
    const id = redact(`900101${mark}-5123456`);
    expect(phone.flags).toContain('phone');
    expect(phone.text).toContain('[전화]');
    expect(id.flags).toContain('rrn');
    expect(id.text).toContain('[등록번호]');
  });
});
