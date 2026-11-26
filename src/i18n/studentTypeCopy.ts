import type { SupportedLangCode } from '../kbridge';
import type { StudentType } from '../data/studentType';

export interface StudentTypeCopy {
  ask: string;
  privateNote: string;
  change: string;
  types: Record<StudentType, string>;
  domesticLead: string;
  unsureLead: string;
  tracksTitle: string;
  noTrackTitle: string;
  parentTitle: string;
  parentLead: string;
  teacherDomestic: string;
}

export const STUDENT_TYPE_COPY: Record<SupportedLangCode, StudentTypeCopy> = {
  ko: {
    ask: '어떤 학생인가요?',
    privateNote: '이 선택은 이 기기에만 저장되고, 서버로 보내지 않아요.',
    change: '학생 유형 바꾸기',
    types: {
      foreign_family: '외국인가정',
      mid_entry: '중도입국',
      domestic_multicultural: '국내출생 다문화',
      unsure: '잘 모르겠어요',
    },
    domesticLead: '국내에서 태어나고 한국 국적인 다문화가정 학생입니다. 비자·체류 칸은 보이지 않습니다.',
    unsureLead: '유형을 아직 정하지 않았습니다. 비자·체류 칸은 열지 않습니다.',
    tracksTitle: '2027학년도 수시, 다문화 전형이 확인된 대학',
    noTrackTitle: '같은 점검에서 다문화 전형을 찾지 못한 대학',
    parentTitle: '부모 통역은 가족센터',
    parentLead: '구 가족센터에 전화해 통역과 상담을 문의하세요. 언어 지원은 2026년 11월에 확인한 내용이며 바뀔 수 있습니다.',
    teacherDomestic: '국내출생 다문화 경로입니다. 체류자격은 묻지 않습니다.',
  },
  en: {
    ask: 'Which student is this?',
    privateNote: 'This choice stays on this device and is not sent to a server.',
    change: 'Change student type',
    types: {
      foreign_family: 'Foreign-national family',
      mid_entry: 'Mid-entry',
      domestic_multicultural: 'Born in Korea, multicultural family',
      unsure: 'Not sure',
    },
    domesticLead: 'This path is for a student born in Korea with Korean nationality and one foreign-born parent. Visa sections stay hidden.',
    unsureLead: 'The type is not chosen yet. Visa sections stay closed.',
    tracksTitle: '2027 early admission: universities with a checked multicultural track',
    noTrackTitle: 'Universities where the same check found no multicultural track',
    parentTitle: 'Parent interpretation: family centers',
    parentLead: 'Call the district family center for interpretation and counselling. Language support was checked in November 2026 and can change.',
    teacherDomestic: 'Domestic-born multicultural path. Status of stay is not asked.',
  },
  'zh-Hans': {
    ask: '是哪一类学生？',
    privateNote: '这个选择只存在这台设备上，不会送到服务器。',
    change: '更改学生类型',
    types: {
      foreign_family: '外国人家庭',
      mid_entry: '中途入学',
      domestic_multicultural: '在韩国出生的多元文化家庭',
      unsure: '还不确定',
    },
    domesticLead: '这是在韩国出生、拥有韩国国籍、父母一方在国外出生的学生。签证和停留栏不显示。',
    unsureLead: '还没有选定类型。签证和停留栏保持关闭。',
    tracksTitle: '2027学年度随时招生中，已核对多元文化选拔的大学',
    noTrackTitle: '同一次核对中没有找到多元文化选拔的大学',
    parentTitle: '家长口译请联系家庭中心',
    parentLead: '请致电区家庭中心询问口译和咨询。语言支持是2026年11月核对的，以后可能变化。',
    teacherDomestic: '这是在韩国出生的多元文化路径。不问停留资格。',
  },
  'zh-Hant': {
    ask: '是哪一類學生？',
    privateNote: '這個選擇只存在這台裝置上，不會送到伺服器。',
    change: '更改學生類型',
    types: {
      foreign_family: '外國人家庭',
      mid_entry: '中途入學',
      domestic_multicultural: '在韓國出生的多元文化家庭',
      unsure: '還不確定',
    },
    domesticLead: '這是在韓國出生、擁有韓國國籍、父母一方在國外出生的學生。簽證和停留欄不顯示。',
    unsureLead: '還沒有選定類型。簽證和停留欄保持關閉。',
    tracksTitle: '2027學年度隨時招生中，已核對多元文化選拔的大學',
    noTrackTitle: '同一次核對中沒有找到多元文化選拔的大學',
    parentTitle: '家長口譯請聯繫家庭中心',
    parentLead: '請致電區家庭中心詢問口譯和諮詢。語言支援是2026年11月核對的，以後可能變化。',
    teacherDomestic: '這是在韓國出生的多元文化路徑。不問停留資格。',
  },
  vi: {
    ask: 'Học sinh thuộc nhóm nào?',
    privateNote: 'Lựa chọn này chỉ lưu trên máy này và không được gửi lên máy chủ.',
    change: 'Đổi nhóm học sinh',
    types: {
      foreign_family: 'Gia đình quốc tịch nước ngoài',
      mid_entry: 'Nhập học giữa chừng',
      domestic_multicultural: 'Sinh tại Hàn, gia đình đa văn hóa',
      unsure: 'Chưa rõ',
    },
    domesticLead: 'Đây là học sinh sinh tại Hàn Quốc, quốc tịch Hàn, có một phụ huynh sinh ở nước ngoài. Mục visa và lưu trú được ẩn.',
    unsureLead: 'Chưa chọn nhóm. Mục visa và lưu trú vẫn đóng.',
    tracksTitle: 'Tuyển sớm 2027: trường đã kiểm tra có tuyển sinh đa văn hóa',
    noTrackTitle: 'Trường mà cùng lần kiểm tra không thấy tuyển sinh đa văn hóa',
    parentTitle: 'Phiên dịch cho phụ huynh: trung tâm gia đình',
    parentLead: 'Gọi trung tâm gia đình quận để hỏi phiên dịch và tư vấn. Hỗ trợ ngôn ngữ được kiểm vào tháng 11/2026 và có thể đổi.',
    teacherDomestic: 'Lộ trình đa văn hóa sinh tại Hàn. Không hỏi tư cách lưu trú.',
  },
  ru: {
    ask: 'К какой группе относится ученик?',
    privateNote: 'Этот выбор хранится только на этом устройстве и не отправляется на сервер.',
    change: 'Сменить тип ученика',
    types: {
      foreign_family: 'Семья иностранных граждан',
      mid_entry: 'Приезд в середине учёбы',
      domestic_multicultural: 'Родился в Корее, мультикультурная семья',
      unsure: 'Не уверен',
    },
    domesticLead: 'Это ученик, родившийся в Корее, с гражданством Кореи и одним родителем, родившимся за рубежом. Разделы визы и пребывания скрыты.',
    unsureLead: 'Тип ещё не выбран. Разделы визы и пребывания закрыты.',
    tracksTitle: 'Досрочный набор 2027: вузы, где проверена мультикультурная дорожка',
    noTrackTitle: 'Вузы, где та же проверка не нашла мультикультурную дорожку',
    parentTitle: 'Перевод для родителей: семейные центры',
    parentLead: 'Позвоните в районный семейный центр про перевод и консультацию. Языковая поддержка проверена в ноябре 2026 и может измениться.',
    teacherDomestic: 'Путь для родившихся в Корее в мультикультурной семье. Статус пребывания не спрашиваем.',
  },
  mn: {
    ask: 'Ямар сурагч вэ?',
    privateNote: 'Энэ сонголт зөвхөн энэ төхөөрөмжид хадгалагдаж, сервер лүү явахгүй.',
    change: 'Сурагчийн төрөл солих',
    types: {
      foreign_family: 'Гадаадын гэр бүл',
      mid_entry: 'Дунд нь орсон',
      domestic_multicultural: 'Солонгост төрсөн олон соёлт гэр бүл',
      unsure: 'Сайн мэдэхгүй',
    },
    domesticLead: 'Солонгост төрсөн, Солонгос иргэншилтэй, эцэг эхийн нэг нь гадаадад төрсөн сурагчийн зам. Виз, оршин суух хэсгийг харуулахгүй.',
    unsureLead: 'Төрлийг хараахан сонгоогүй. Виз, оршин суух хэсэг хаалттай.',
    tracksTitle: '2027 эрт элсэлт: олон соёлт элсэлтийг нягталсан их сургууль',
    noTrackTitle: 'Тэр нягтлалтаар олон соёлт элсэлт олдоогүй их сургууль',
    parentTitle: 'Эцэг эхийн орчуулга: гэр бүлийн төв',
    parentLead: 'Дүүргийн гэр бүлийн төв рүү залгаж орчуулга, зөвлөгөөг асуу. Хэлний дэмжлэгийг 2026 оны 11-р сард нягталсан бөгөөд өөрчлөгдөж болно.',
    teacherDomestic: 'Солонгост төрсөн олон соёлт зам. Оршин суух эрхийг асуухгүй.',
  },
  ar: {
    ask: 'أي نوع من الطلاب؟',
    privateNote: 'يبقى هذا الاختيار على هذا الجهاز ولا يُرسل إلى خادم.',
    change: 'تغيير نوع الطالب',
    types: {
      foreign_family: 'أسرة أجنبية الجنسية',
      mid_entry: 'التحاق في منتصف الدراسة',
      domestic_multicultural: 'مولود في كوريا من أسرة متعددة الثقافات',
      unsure: 'لست متأكدًا',
    },
    domesticLead: 'هذا المسار لطالب وُلد في كوريا ويحمل الجنسية الكورية وأحد والديه مولود في الخارج. أقسام التأشيرة والإقامة مخفية.',
    unsureLead: 'لم يُختر النوع بعد. أقسام التأشيرة والإقامة تبقى مغلقة.',
    tracksTitle: 'القبول المبكر 2027: جامعات تأكد وجود مسار متعدد الثقافات فيها',
    noTrackTitle: 'جامعات لم يُعثر فيها على مسار متعدد الثقافات في المراجعة نفسها',
    parentTitle: 'ترجمة للوالدين عبر مراكز الأسرة',
    parentLead: 'اتصل بمركز الأسرة في الحي للترجمة والاستشارة. دعم اللغات فُحص في نوفمبر 2026 وقد يتغير.',
    teacherDomestic: 'مسار متعدد الثقافات لمولود في كوريا. لا نسأل عن صفة الإقامة.',
  },
};
