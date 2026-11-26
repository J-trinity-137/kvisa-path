import type { SupportedLangCode } from '../kbridge';

export const FAQ_EMPTY: Record<SupportedLangCode, { title: string; empty: string }> = {
  ko: { title: '자주 묻는 질문', empty: '아직 검토해서 올린 질문이 없습니다. 인터넷이 없어도 이 화면은 열립니다.' },
  en: { title: 'FAQ', empty: 'No reviewed question has been published yet. This screen works offline.' },
  'zh-Hans': { title: '常见问题', empty: '还没有审核后发布的问题。没有网络也能打开这个画面。' },
  'zh-Hant': { title: '常見問題', empty: '還沒有審核後發布的問題。沒有網路也能打開這個畫面。' },
  vi: { title: 'Câu hỏi thường gặp', empty: 'Chưa có câu hỏi đã duyệt. Màn hình này mở được khi không có mạng.' },
  ru: { title: 'Частые вопросы', empty: 'Проверенных вопросов пока нет. Этот экран открывается без сети.' },
  mn: { title: 'Түгээмэл асуулт', empty: 'Нягталсан асуулт хараахан алга. Сүлжээгүйгээр нээгдэнэ.' },
  ar: { title: 'الأسئلة الشائعة', empty: 'لا توجد أسئلة مراجعة بعد. تعمل هذه الشاشة دون اتصال.' },
};
