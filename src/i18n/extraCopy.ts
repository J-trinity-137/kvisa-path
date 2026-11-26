import type { SupportedLangCode } from '../kbridge';

export const MULTICULTURAL_NOTE: Record<SupportedLangCode, string> = {
  ko: '2027 수시에서 다문화 가정 자녀 전형이 있는 곳은 한국 국적자용입니다. 외국 국적의 이주 학생은 보통 쓸 수 없습니다. 그해 요강을 다시 보세요. 숭실대 2027 수시는 이번 목록에 없습니다.',
  en: 'Where a 2027 early-admission track exists for multicultural-family children, it is for Korean nationals. Foreign-national migrant students generally cannot use it. Check that year’s guide. Soongsil’s 2027 early admission is not in this list.',
  'zh-Hans': '2027随时招生里有多文化家庭子女选拔的，对象是韩国国籍。外国国籍的移民学生通常不能用。请再看当年简章。崇实大学2027随时招生不在这个名单里。',
  'zh-Hant': '2027隨時招生裡有多元文化家庭子女選拔的，對象是韓國國籍。外國國籍的移民學生通常不能用。請再看當年簡章。崇實大學2027隨時招生不在這個名單裡。',
  vi: 'Tuyển sớm 2027 cho con em gia đình đa văn hóa, nếu có, dành cho người quốc tịch Hàn. Học sinh di cư mang quốc tịch nước ngoài thường không dùng được. Hãy xem hướng dẫn của năm đó. Tuyển sớm 2027 của Soongsil không có trong danh sách này.',
  ru: 'Если в раннем наборе 2027 года есть трек для детей мультикультурных семей, он для граждан Кореи. Студенты-мигранты с иностранным гражданством обычно не могут им пользоваться. Проверьте руководство того года. Ранний набор Сунсиль 2027 года в этот список не входит.',
  mn: '2027 оны эрт элсэлтэд олон соёлын гэр бүлийн хүүхдийн зам байвал Солонгос иргэнд зориулсан. Гадаад иргэншилтэй нүүдлийн сурагч ихэвчлэн ашиглаж чадахгүй. Тухайн жилийн гарын авлагыг дахин үз. Сүнсилийн 2027 оны эрт элсэлт энэ жагсаалтад алга.',
  ar: 'حيث يوجد مسار 2027 المبكر لأبناء الأسر متعددة الثقافات فهو لمواطني كوريا. الطلاب المهاجرون من جنسية أجنبية لا يستطيعون استخدامه عادة. راجع دليل تلك السنة. القبول المبكر 2027 لجامعة سونغسيل ليس في هذه القائمة.',
};

export const MULTICULTURAL_ROWS: Record<SupportedLangCode, Record<string, string>> = {
  ko: {
    khu: '학생부종합 기회균형전형Ⅱ(정원외). 결혼 전 외국 국적이던 부모와 한국 국적 부모 사이의 자녀. 그 부모가 한국 국적을 포기했으면 안 됩니다.',
    hanyang: '학생부종합(사회통합) 신설. 한양인터칼리지학부 자연 5명. 다문화 가정 자녀이면서 대한민국 국적자.',
    cau: '학생부종합(어울림). 다문화 가정 자녀이면서 대한민국 국적자. 외국 고등학교 졸업자는 지원할 수 없습니다.',
    uos: '학생부종합 사회공헌·통합전형 46명. 자격 ④ 다문화 가정 자녀이면서 대한민국 국적자.',
    kookmin: '2027 수시에 다문화 자녀 전형이 없습니다.',
    seoultech: '2027 수시에 다문화 자녀 전형이 없습니다.',
    hufs: '2027 수시에 다문화 자녀 전형이 없습니다.',
    skku: '2027 수시에 다문화 자녀 전형이 없습니다.',
    smwu: '2027 수시에 다문화 자녀 전형이 없습니다.',
    konkuk: '서울캠퍼스 2027 수시에 다문화 자녀 전형이 없습니다.',
    dongguk: '2027 수시 기회균형통합에 다문화 자녀 자격이 없습니다.',
    korea: '학생부종합 다문화전형 20명. 다문화가족지원법상 다문화가족 자녀이면서 대한민국 국적자. 수능 최저 없음.',
    sogang: '학생부종합 서강가치 34명. 자격별 인원 구분은 없습니다. 다문화가족 자녀이면서 대한민국 국적자. 서류 100%, 수능 최저 없음.',
    ewha: '학생부종합 사회기여자 16명. 결혼 전 외국 국적이던 친부 또는 친모와 대한민국 국적 부모 사이의 자녀이면서 대한민국 국적자.',
    hongik: '학생부종합 고른기회Ⅰ 15명. 다문화가족 자녀. 외국 국적이던 부모가 한국 국적을 포기한 사실이 있으면 인정하지 않습니다.',
    sejong: '학생부종합 사회기여 및 배려자 42명(인문·자연 합산). 다문화 가정 자녀이면서 대한민국 국적자. 그 부모가 한국 국적을 포기한 사실이 있으면 인정하지 않습니다. 수능 최저 없음.',
    mju: '학생부종합 사회적배려대상자 35명. 다문화가족지원법 제2조 가정 자녀 중 대한민국 국적자. 서류 100%.',
  },
  en: {
    khu: 'Holistic equal-opportunity II, outside quota. Child of a parent who was a foreign national before marriage and a Korean parent. Not if that parent renounced Korean nationality.',
    hanyang: 'New holistic social-integration track. Hanyang Intercollege, natural sciences, 5 seats. Multicultural-family child who is a Korean national.',
    cau: 'Holistic Eoullim track. Multicultural-family child who is a Korean national. Graduates of a foreign high school cannot apply.',
    uos: 'Holistic social-contribution track, 46 seats. Item 4: a multicultural-family child who is a Korean national.',
    kookmin: 'No multicultural-child track in the 2027 early admission.',
    seoultech: 'No multicultural-child track in the 2027 early admission.',
    hufs: 'No multicultural-child track in the 2027 early admission.',
    skku: 'No multicultural-child track in the 2027 early admission.',
    smwu: 'No multicultural-child track in the 2027 early admission.',
    konkuk: 'No multicultural-child track in Seoul campus 2027 early admission.',
    dongguk: 'The 2027 equal-opportunity track does not list multicultural-family children.',
    korea: 'Holistic multicultural track, 20 seats. Child of a multicultural family under the Multicultural Families Act and a Korean national. No CSAT minimum.',
    sogang: 'Holistic Seogang Value, 34 seats, not split by qualification. Multicultural-family child and a Korean national. Documents 100%, no CSAT minimum.',
    ewha: 'Holistic social-contributor track, 16 seats. Child of a parent who was a foreign national before marriage and a Korean parent, and a Korean national.',
    hongik: 'Holistic equal-opportunity I, 15 seats. Multicultural-family child. Not recognized if the foreign-national parent renounced Korean nationality.',
    sejong: 'Holistic social-contribution track, 42 seats (humanities and sciences combined). Multicultural-family child and a Korean national. Not recognized if that parent renounced Korean nationality. No CSAT minimum.',
    mju: 'Holistic socially-considered track, 35 seats. Child of a household under Article 2 of the Multicultural Families Act who is a Korean national. Documents 100%.',
  },
  'zh-Hans': {
    khu: '学生部综合机会均衡Ⅱ（定员外）。婚前为外国国籍的父母与韩国国籍父母所生子女。该父母放弃过韩国国籍则不可。',
    hanyang: '新设学生部综合（社会统合）。汉阳跨学院学部自然科学5人。多文化家庭子女且为韩国国籍。',
    cau: '学生部综合（어울림）。多文化家庭子女且为韩国国籍。外国高中毕业生不能申请。',
    uos: '学生部综合社会贡献·统合，46人。资格④：多文化家庭子女且为韩国国籍。',
    kookmin: '2027随时招生没有多文化子女选拔。',
    seoultech: '2027随时招生没有多文化子女选拔。',
    hufs: '2027随时招生没有多文化子女选拔。',
    skku: '2027随时招生没有多文化子女选拔。',
    smwu: '2027随时招生没有多文化子女选拔。',
    konkuk: '首尔校区2027随时招生没有多文化子女选拔。',
    dongguk: '2027机会均衡统合没有多文化子女资格。',
    korea: '学生部综合多文化选拔20人。多文化家庭支援法上的多文化家庭子女且为韩国国籍。无高考最低标准。',
    sogang: '学生部综合西江价值34人，不按资格分名额。多文化家庭子女且为韩国国籍。材料100%，无高考最低标准。',
    ewha: '学生部综合社会贡献者16人。婚前为外国国籍的生父或生母与韩国国籍父母所生、且本人为韩国国籍。',
    hongik: '学生部综合均衡机会Ⅰ15人。多文化家庭子女。曾为外国国籍的父母放弃过韩国国籍则不承认。',
    sejong: '学生部综合社会贡献及关怀者42人（人文与自然合计）。多文化家庭子女且为韩国国籍。该父母放弃过韩国国籍则不承认。无高考最低标准。',
    mju: '学生部综合社会关怀对象35人。多文化家庭支援法第2条家庭的子女中韩国国籍者。材料100%。',
  },
  'zh-Hant': {
    khu: '學生部綜合機會均衡Ⅱ（定員外）。婚前為外國國籍的父母與韓國國籍父母所生子女。該父母放棄過韓國國籍則不可。',
    hanyang: '新設學生部綜合（社會統合）。漢陽跨學院學部自然科學5人。多元文化家庭子女且為韓國國籍。',
    cau: '學生部綜合（어울림）。多元文化家庭子女且為韓國國籍。外國高中畢業生不能申請。',
    uos: '學生部綜合社會貢獻·統合，46人。資格④：多元文化家庭子女且為韓國國籍。',
    kookmin: '2027隨時招生沒有多元文化子女選拔。',
    seoultech: '2027隨時招生沒有多元文化子女選拔。',
    hufs: '2027隨時招生沒有多元文化子女選拔。',
    skku: '2027隨時招生沒有多元文化子女選拔。',
    smwu: '2027隨時招生沒有多元文化子女選拔。',
    konkuk: '首爾校區2027隨時招生沒有多元文化子女選拔。',
    dongguk: '2027機會均衡統合沒有多元文化子女資格。',
    korea: '學生部綜合多元文化選拔20人。多元文化家庭支援法上的多元文化家庭子女且為韓國國籍。無學測最低標準。',
    sogang: '學生部綜合西江價值34人，不按資格分名額。多元文化家庭子女且為韓國國籍。資料100%，無學測最低標準。',
    ewha: '學生部綜合社會貢獻者16人。婚前為外國國籍的生父或生母與韓國國籍父母所生、且本人為韓國國籍。',
    hongik: '學生部綜合均衡機會Ⅰ15人。多元文化家庭子女。曾為外國國籍的父母放棄過韓國國籍則不承認。',
    sejong: '學生部綜合社會貢獻及關懷者42人（人文與自然合計）。多元文化家庭子女且為韓國國籍。該父母放棄過韓國國籍則不承認。無學測最低標準。',
    mju: '學生部綜合社會關懷對象35人。多元文化家庭支援法第2條家庭的子女中韓國國籍者。資料100%。',
  },
  vi: {
    khu: 'Hồ sơ tổng hợp cơ hội bình đẳng II, ngoài chỉ tiêu. Con của cha hoặc mẹ từng là người nước ngoài trước hôn nhân và cha hoặc mẹ quốc tịch Hàn. Không được nếu người đó đã từ bỏ quốc tịch Hàn.',
    hanyang: 'Tuyển mới hồ sơ tổng hợp hội nhập xã hội. Hanyang Intercollege khoa tự nhiên, 5 chỗ. Con gia đình đa văn hóa và có quốc tịch Hàn.',
    cau: 'Hồ sơ tổng hợp Eoullim. Con gia đình đa văn hóa và có quốc tịch Hàn. Người tốt nghiệp THPT nước ngoài không được nộp.',
    uos: 'Hồ sơ tổng hợp đóng góp xã hội, 46 chỗ. Điều ④: con gia đình đa văn hóa và có quốc tịch Hàn.',
    kookmin: 'Tuyển sớm 2027 không có diện con em đa văn hóa.',
    seoultech: 'Tuyển sớm 2027 không có diện con em đa văn hóa.',
    hufs: 'Tuyển sớm 2027 không có diện con em đa văn hóa.',
    skku: 'Tuyển sớm 2027 không có diện con em đa văn hóa.',
    smwu: 'Tuyển sớm 2027 không có diện con em đa văn hóa.',
    konkuk: 'Cơ sở Seoul, tuyển sớm 2027 không có diện con em đa văn hóa.',
    dongguk: 'Diện cơ hội bình đẳng 2027 không có tư cách con em đa văn hóa.',
    korea: 'Hồ sơ tổng hợp đa văn hóa, 20 chỗ. Con gia đình đa văn hóa theo luật và có quốc tịch Hàn. Không có điểm sàn thi đại học.',
    sogang: 'Hồ sơ tổng hợp Seogang Value, 34 chỗ, không chia theo tư cách. Con gia đình đa văn hóa và quốc tịch Hàn. Hồ sơ 100%, không điểm sàn.',
    ewha: 'Hồ sơ tổng hợp người đóng góp xã hội, 16 chỗ. Con của cha hoặc mẹ từng là người nước ngoài trước hôn nhân và cha hoặc mẹ quốc tịch Hàn, bản thân quốc tịch Hàn.',
    hongik: 'Hồ sơ tổng hợp cơ hội I, 15 chỗ. Con gia đình đa văn hóa. Không công nhận nếu cha hoặc mẹ từng là người nước ngoài đã từ bỏ quốc tịch Hàn.',
    sejong: 'Hồ sơ tổng hợp đóng góp xã hội, 42 chỗ (khối xã hội và tự nhiên cộng lại). Con gia đình đa văn hóa và quốc tịch Hàn. Không công nhận nếu cha hoặc mẹ đó từ bỏ quốc tịch Hàn. Không điểm sàn.',
    mju: 'Hồ sơ tổng hợp đối tượng được quan tâm, 35 chỗ. Con của gia đình theo điều 2 luật đa văn hóa và có quốc tịch Hàn. Hồ sơ 100%.',
  },
  ru: {
    khu: 'Целостный набор равных возможностей II, вне квоты. Ребёнок родителя, который до брака был иностранцем, и корейского родителя. Нельзя, если тот родитель отказался от корейского гражданства.',
    hanyang: 'Новый целостный набор социальной интеграции. Hanyang Intercollege, естественные науки, 5 мест. Ребёнок мультикультурной семьи и гражданин Кореи.',
    cau: 'Целостный набор Eoullim. Ребёнок мультикультурной семьи и гражданин Кореи. Выпускник зарубежной школы подать не может.',
    uos: 'Целостный набор социального вклада, 46 мест. Пункт ④: ребёнок мультикультурной семьи и гражданин Кореи.',
    kookmin: 'В раннем наборе 2027 года нет трека для мультикультурных детей.',
    seoultech: 'В раннем наборе 2027 года нет трека для мультикультурных детей.',
    hufs: 'В раннем наборе 2027 года нет трека для мультикультурных детей.',
    skku: 'В раннем наборе 2027 года нет трека для мультикультурных детей.',
    smwu: 'В раннем наборе 2027 года нет трека для мультикультурных детей.',
    konkuk: 'На сеульском кампусе в раннем наборе 2027 года такого трека нет.',
    dongguk: 'В треке равных возможностей 2027 года нет квалификации для мультикультурных детей.',
    korea: 'Целостный мультикультурный трек, 20 мест. Ребёнок мультикультурной семьи по закону и гражданин Кореи. Без минимума CSAT.',
    sogang: 'Целостный трек Seogang Value, 34 места, без деления по квалификации. Ребёнок мультикультурной семьи и гражданин Кореи. Документы 100%, без минимума CSAT.',
    ewha: 'Целостный трек социальных вкладчиков, 16 мест. Ребёнок родителя, который до брака был иностранцем, и корейского родителя, сам гражданин Кореи.',
    hongik: 'Целостный трек равных возможностей I, 15 мест. Ребёнок мультикультурной семьи. Не признаётся, если родитель-иностранец отказался от корейского гражданства.',
    sejong: 'Целостный трек социального вклада, 42 места (гуманитарные и естественные вместе). Ребёнок мультикультурной семьи и гражданин Кореи. Не признаётся, если тот родитель отказался от гражданства. Без минимума CSAT.',
    mju: 'Целостный трек социально учитываемых, 35 мест. Ребёнок семьи по статье 2 закона и гражданин Кореи. Документы 100%.',
  },
  mn: {
    khu: 'Боломжийн тэгш II, квотын гадна. Гэрлэхээс өмнө гадаад иргэн байсан эцэг/эх ба Солонгос иргэн эцэг/эхийн хүүхэд. Тэр хүн Солонгос иргэншлээс татгалзсан бол болохгүй.',
    hanyang: 'Шинэ нийгмийн нэгдлийн элсэлт. Ханьян интерколлеж, байгалийн ухаан, 5 суудал. Олон соёлын гэр бүлийн хүүхэд бөгөөд Солонгос иргэн.',
    cau: 'Eoullim элсэлт. Олон соёлын гэр бүлийн хүүхэд бөгөөд Солонгос иргэн. Гадаад ахлах төгсөгч өргөдөл гаргаж болохгүй.',
    uos: 'Нийгмийн хувь нэмрийн элсэлт, 46 суудал. ④: олон соёлын гэр бүлийн хүүхэд бөгөөд Солонгос иргэн.',
    kookmin: '2027 оны эрт элсэлтэд олон соёлын хүүхдийн зам алга.',
    seoultech: '2027 оны эрт элсэлтэд олон соёлын хүүхдийн зам алга.',
    hufs: '2027 оны эрт элсэлтэд олон соёлын хүүхдийн зам алга.',
    skku: '2027 оны эрт элсэлтэд олон соёлын хүүхдийн зам алга.',
    smwu: '2027 оны эрт элсэлтэд олон соёлын хүүхдийн зам алга.',
    konkuk: 'Сөүл кампусын 2027 оны эрт элсэлтэд ийм зам алга.',
    dongguk: '2027 оны тэгш боломжид олон соёлын хүүхдийн шалгуур алга.',
    korea: 'Олон соёлын элсэлт 20 суудал. Хуулийн олон соёлын гэр бүлийн хүүхэд бөгөөд Солонгос иргэн. ЭЕШ-ийн доод хязгааргүй.',
    sogang: 'Seogang Value 34 суудал, шалгуураар хуваахгүй. Олон соёлын гэр бүлийн хүүхэд бөгөөд Солонгос иргэн. Баримт 100%, доод хязгааргүй.',
    ewha: 'Нийгэмд хувь нэмэр оруулагч 16 суудал. Гэрлэхээс өмнө гадаад иргэн байсан эцэг/эх ба Солонгос иргэн эцэг/эхийн хүүхэд, өөрөө Солонгос иргэн.',
    hongik: 'Тэгш боломж I, 15 суудал. Олон соёлын гэр бүлийн хүүхэд. Гадаад иргэн байсан эцэг/эх Солонгос иргэншлээс татгалзсан бол хүлээн зөвшөөрөхгүй.',
    sejong: 'Нийгмийн хувь нэмэр 42 суудал (хүмүүнлэг, байгалийн нийлбэр). Олон соёлын гэр бүлийн хүүхэд бөгөөд Солонгос иргэн. Тэр эцэг/эх иргэншлээс татгалзсан бол болохгүй. Доод хязгааргүй.',
    mju: 'Нийгмийн анхаарал 35 суудал. Хуулийн 2 дугаар зүйлийн гэр бүлийн хүүхдээс Солонгос иргэн. Баримт 100%.',
  },
  ar: {
    khu: 'فرص متكافئة II خارج الحصة. ابن والد كان أجنبيًا قبل الزواج ووالد كوري الجنسية. لا يُقبل إذا تخلى ذلك الوالد عن الجنسية الكورية.',
    hanyang: 'مسار جديد للدمج الاجتماعي. كلية هانيانغ المشتركة، علوم طبيعية، 5 مقاعد. ابن أسرة متعددة الثقافات ومواطن كوري.',
    cau: 'مسار Eoullim. ابن أسرة متعددة الثقافات ومواطن كوري. خريج ثانوية أجنبية لا يستطيع التقديم.',
    uos: 'مسار المساهمة الاجتماعية، 46 مقعدًا. البند ④: ابن أسرة متعددة الثقافات ومواطن كوري.',
    kookmin: 'لا مسار لأبناء الأسر متعددة الثقافات في القبول المبكر 2027.',
    seoultech: 'لا مسار لأبناء الأسر متعددة الثقافات في القبول المبكر 2027.',
    hufs: 'لا مسار لأبناء الأسر متعددة الثقافات في القبول المبكر 2027.',
    skku: 'لا مسار لأبناء الأسر متعددة الثقافات في القبول المبكر 2027.',
    smwu: 'لا مسار لأبناء الأسر متعددة الثقافات في القبول المبكر 2027.',
    konkuk: 'لا مسار كهذا في القبول المبكر 2027 لحرم سيول.',
    dongguk: 'مسار تكافؤ الفرص 2027 لا يذكر أبناء الأسر متعددة الثقافات.',
    korea: 'مسار متعدد الثقافات، 20 مقعدًا. ابن أسرة متعددة الثقافات بموجب القانون ومواطن كوري. بلا حد أدنى لاختبار القدرات.',
    sogang: 'مسار سيوغانغ للقيمة، 34 مقعدًا بلا تقسيم حسب الأهلية. ابن أسرة متعددة الثقافات ومواطن كوري. الوثائق 100% وبلا حد أدنى.',
    ewha: 'مسار المساهم الاجتماعي، 16 مقعدًا. ابن والد كان أجنبيًا قبل الزواج ووالد كوري، والطالب مواطن كوري.',
    hongik: 'فرص متكافئة I، 15 مقعدًا. ابن أسرة متعددة الثقافات. لا يُعترف به إذا تخلى الوالد الأجنبي عن الجنسية الكورية.',
    sejong: 'مساهمة اجتماعية، 42 مقعدًا (الإنسانيات والعلوم معًا). ابن أسرة متعددة الثقافات ومواطن كوري. لا يُعترف به إذا تخلى ذلك الوالد عن الجنسية. بلا حد أدنى.',
    mju: 'رعاية اجتماعية، 35 مقعدًا. ابن أسرة وفق المادة 2 ومواطن كوري. الوثائق 100%.',
  },
};

export const LANGUAGE_SUPPORT_LEAD: Record<SupportedLangCode, string> = {
  ko: '2026-11 기준 언어 지원입니다. 인원 수가 아니고, 바뀔 수 있으니 먼저 전화하세요.',
  en: 'Language support as of November 2026. These are languages, not headcounts, and they may change — call first.',
  'zh-Hans': '这是2026年11月的语言支持。是语言而不是人数，可能变化，请先打电话。',
  'zh-Hant': '這是2026年11月的語言支持。是語言而不是人數，可能變化，請先打電話。',
  vi: 'Hỗ trợ ngôn ngữ tính đến tháng 11/2026. Đây là ngôn ngữ, không phải số người, và có thể đổi — hãy gọi trước.',
  ru: 'Языковая поддержка на ноябрь 2026 года. Это языки, не число сотрудников, и список может измениться — сначала позвоните.',
  mn: '2026 оны 11-р сарын байдлаарх хэлний дэмжлэг. Энэ нь хэл, тоо биш, өөрчлөгдөж болно — эхлээд залга.',
  ar: 'دعم اللغات حتى نوفمبر 2026. هذه لغات وليست أعدادًا، وقد تتغير — اتصل أولًا.',
};

export const SUPPORT_LANGUAGE: Record<SupportedLangCode, Record<'vi' | 'zh' | 'km' | 'mn' | 'ja', string>> = {
  ko: { vi: '베트남어', zh: '중국어', km: '캄보디아어', mn: '몽골어', ja: '일본어' },
  en: { vi: 'Vietnamese', zh: 'Chinese', km: 'Khmer', mn: 'Mongolian', ja: 'Japanese' },
  'zh-Hans': { vi: '越南语', zh: '中文', km: '高棉语', mn: '蒙古语', ja: '日语' },
  'zh-Hant': { vi: '越南語', zh: '中文', km: '高棉語', mn: '蒙古語', ja: '日語' },
  vi: { vi: 'Tiếng Việt', zh: 'Tiếng Trung', km: 'Tiếng Khmer', mn: 'Tiếng Mông Cổ', ja: 'Tiếng Nhật' },
  ru: { vi: 'вьетнамский', zh: 'китайский', km: 'кхмерский', mn: 'монгольский', ja: 'японский' },
  mn: { vi: 'вьетнам', zh: 'хятад', km: 'кхмер', mn: 'монгол', ja: 'япон' },
  ar: { vi: 'الفيتنامية', zh: 'الصينية', km: 'الخميرية', mn: 'المنغولية', ja: 'اليابانية' },
};

export const SCHOOL_MAJOR_LEAD: Record<SupportedLangCode, string> = {
  ko: '아래는 이 앱에 이미 있는 서울 직업계 고등학교 학과입니다. 새 직업 통계가 아닙니다.',
  en: 'These are majors already listed on the Seoul vocational schools in this app. They are not a new jobs survey.',
  'zh-Hans': '下面是这个应用里已有的首尔职业高中学科，不是新的职业统计。',
  'zh-Hant': '下面是這個應用裡已有的首爾職業高中學科，不是新的職業統計。',
  vi: 'Đây là ngành đã có trong các trường nghề Seoul của ứng dụng. Không phải khảo sát việc làm mới.',
  ru: 'Это специальности сеульских профессиональных школ, которые уже есть в приложении. Это не новый обзор профессий.',
  mn: 'Эдгээр нь апп дахь Сөүлийн мэргэжлийн сургуулийн мэргэжил. Шинэ ажлын судалгаа биш.',
  ar: 'هذه تخصصات مدارس مهنية في سيول موجودة أصلًا في التطبيق. ليست مسحًا جديدًا للوظائف.',
};

type Lang7 = Exclude<SupportedLangCode, 'ko'>;

type Doc = { name: string; whereToGet: string; tip: string };
type Quiz = { question: string; explanation: string };

export const EXTRA_DOCS: Record<Lang7, Record<string, Doc>> = {
  en: {
    'doc-special-form': {
      name: '2026 special high-school admission form (blank)',
      whereToGet: 'The hwp attachment on the Seoul education office post',
      tip: 'That post has no filled sample. Use the blank form only.',
    },
    'doc-elementary-residence': {
      name: 'Proof of residence for elementary enrollment',
      whereToGet: 'A lease or a residence guarantee',
      tip: 'Article 19 says these replace an immigration check when the guardian refuses it. The article names the elementary principal.',
    },
  },
  'zh-Hans': {
    'doc-special-form': {
      name: '2026学年高中特例申请表（空白）',
      whereToGet: '首尔教育厅帖子的 hwp 附件',
      tip: '那篇帖子没有填写范例。只用空白表格。',
    },
    'doc-elementary-residence': {
      name: '小学入学的居住证明',
      whereToGet: '租赁合同或居住保证书',
      tip: '施行令第19条说，监护人拒绝出入境核对时用这些文件只确认居住。条文的对象是小学校长。',
    },
  },
  'zh-Hant': {
    'doc-special-form': {
      name: '2026學年高中特例申請表（空白）',
      whereToGet: '首爾教育廳貼文的 hwp 附件',
      tip: '那篇貼文沒有填寫範例。只用空白表格。',
    },
    'doc-elementary-residence': {
      name: '小學入學的居住證明',
      whereToGet: '租賃合約或居住保證書',
      tip: '施行令第19條說，監護人拒絕出入境核對時用這些文件只確認居住。條文的對象是小學校長。',
    },
  },
  vi: {
    'doc-special-form': {
      name: 'Đơn đặc cách vào THPT 2026 (mẫu trống)',
      whereToGet: 'File hwp đính kèm trên bài của Sở giáo dục Seoul',
      tip: 'Bài đó không có mẫu đã điền. Chỉ dùng mẫu trống.',
    },
    'doc-elementary-residence': {
      name: 'Giấy cư trú để vào tiểu học',
      whereToGet: 'Hợp đồng thuê hoặc giấy bảo lãnh cư trú',
      tip: 'Điều 19 nói dùng các giấy này khi người giám hộ không đồng ý kiểm tra xuất nhập cảnh. Điều này chỉ nêu hiệu trưởng tiểu học.',
    },
  },
  ru: {
    'doc-special-form': {
      name: 'Бланк особого приёма в старшую школу 2026 года',
      whereToGet: 'Вложение hwp в записи управления образования Сеула',
      tip: 'Заполненного образца там нет. Используйте пустой бланк.',
    },
    'doc-elementary-residence': {
      name: 'Подтверждение проживания для начальной школы',
      whereToGet: 'Договор аренды или гарантия проживания',
      tip: 'Статья 19 говорит использовать их, если опекун отказывается от проверки въезда. Статья обращена к директору начальной школы.',
    },
  },
  mn: {
    'doc-special-form': {
      name: '2026 оны ахлах сургуулийн тусгай маягт (хоосон)',
      whereToGet: 'Сөүлийн боловсролын газрын нийтлэлийн hwp хавсралт',
      tip: 'Бөглөсөн жишээ алга. Зөвхөн хоосон маягтыг ашигла.',
    },
    'doc-elementary-residence': {
      name: 'Бага сургуульд орох оршин суух баримт',
      whereToGet: 'Түрээсийн гэрээ эсвэл оршин суух баталгаа',
      tip: '19-р зүйлд асран хамгаалагч хил нэвтрэлтийг шалгуулахгүй бол эдгээр баримтаар зөвхөн оршин суухыг батална гэж бичсэн. Өргөдөл хүлээн авагч нь бага сургуулийн захирал.',
    },
  },
  ar: {
    'doc-special-form': {
      name: 'نموذج القبول الخاص للثانوية لعام 2026 (فارغ)',
      whereToGet: 'مرفق hwp في منشور مكتب التعليم في سيول',
      tip: 'المنشور بلا نموذج معبّأ. استخدم النموذج الفارغ فقط.',
    },
    'doc-elementary-residence': {
      name: 'إثبات سكن للالتحاق بالابتدائية',
      whereToGet: 'عقد إيجار أو ضمان سكن',
      tip: 'المادة 19 تقول إن هذه الوثائق تكفي لإثبات السكن إذا رفض الوصي فحص الهجرة. المخاطب هو مدير المدرسة الابتدائية.',
    },
  },
};

export const EXTRA_QUIZ: Record<Lang7, Record<string, Quiz>> = {
  en: {
    'quiz-2': {
      question: 'Article 19 says a foreign child may apply to the elementary principal of the school district.',
      explanation: 'If the guardian refuses an immigration check, a lease or a residence guarantee confirms residence only. The article names the elementary principal, not middle or high school.',
    },
    'quiz-5': {
      question: 'The D-10 job-seeker stay cap is two years for everyone.',
      explanation: 'The June 2026 manual sets the ceiling at up to three years. General D-10-1 is three years at 80 points or more, and one year from 60 up to 80.',
    },
    'quiz-6': {
      question: 'Soongsil pays the same TOPIK scholarship rate every semester.',
      explanation: 'The university page says one time, the first semester after entry for students admitted from 2025. Level 3 is 40%, 4 is 60%, 5 is 80%, and 6 is 100%.',
    },
    'quiz-7': {
      question: 'After an E-9 stay ends, you can change to D-2 inside Korea in order to study.',
      explanation: 'The June 2026 manual says study itself may not need a permit, but changing to D-2 for study after that stay ends is not allowed. You leave and get a visa.',
    },
    'quiz-8': {
      question: 'Konkuk’s spring 2027 foreign-student track accepts the GED.',
      explanation: 'The spring 2027 guide says the GED, correspondence, online, lifelong, and language courses are not accepted as academic credentials.',
    },
  },
  'zh-Hans': {
    'quiz-2': {
      question: '施行令第19条写明，外国儿童可以向学区的小学校长申请入学。',
      explanation: '监护人拒绝出入境核对时，用租赁合同或居住保证书只确认居住。条文的对象是小学校长，不是中学或高中。',
    },
    'quiz-5': {
      question: '求职 D-10 的停留上限对所有人都是两年。',
      explanation: '2026年6月手册把上限写成最多三年。一般 D-10-1 在80分以上是三年，60分到不满80分是一年。',
    },
    'quiz-6': {
      question: '崇实大学的外国人 TOPIK 奖学金每个学期按同一比例发放。',
      explanation: '学校页面写的是2025学年及以后入学的人，入学后第一个学期一次。3级40%、4级60%、5级80%、6级100%。',
    },
    'quiz-7': {
      question: 'E-9 停留结束后，可以在韩国国内以学业为由改成 D-2。',
      explanation: '2026年6月手册写，学习本身可以不另许可，但那段停留结束后不能以学业为由改成 D-2，要出境后办签证。',
    },
    'quiz-8': {
      question: '建国大学2027春季外国人特别招生承认检定考试学历。',
      explanation: '2027春季简章写明检定考试、函授、网课、终身教育和语言课程不算学历。',
    },
  },
  'zh-Hant': {
    'quiz-2': {
      question: '施行令第19條寫明，外國兒童可以向學區的小學校長申請入學。',
      explanation: '監護人拒絕出入境核對時，用租賃合約或居住保證書只確認居住。條文的對象是小學校長，不是中學或高中。',
    },
    'quiz-5': {
      question: '求職 D-10 的停留上限對所有人都是兩年。',
      explanation: '2026年6月手冊把上限寫成最多三年。一般 D-10-1 在80分以上是三年，60分到不滿80分是一年。',
    },
    'quiz-6': {
      question: '崇實大學的外國人 TOPIK 獎學金每個學期按同一比例發放。',
      explanation: '學校頁面寫的是2025學年及以後入學的人，入學後第一個學期一次。3級40%、4級60%、5級80%、6級100%。',
    },
    'quiz-7': {
      question: 'E-9 停留結束後，可以在韓國國內以學業為由改成 D-2。',
      explanation: '2026年6月手冊寫，學習本身可以不另許可，但那段停留結束後不能以學業為由改成 D-2，要出境後辦簽證。',
    },
    'quiz-8': {
      question: '建國大學2027春季外國人特別招生承認檢定考試學歷。',
      explanation: '2027春季簡章寫明檢定考試、函授、網課、終身教育和語言課程不算學歷。',
    },
  },
  vi: {
    'quiz-2': {
      question: 'Điều 19 nói trẻ em nước ngoài có thể nộp đơn cho hiệu trưởng tiểu học của học khu.',
      explanation: 'Nếu người giám hộ không đồng ý kiểm tra xuất nhập cảnh, hợp đồng thuê hoặc giấy bảo lãnh chỉ xác nhận cư trú. Điều này nêu hiệu trưởng tiểu học, không phải trung học.',
    },
    'quiz-5': {
      question: 'Trần thời gian D-10 tìm việc là hai năm với mọi người.',
      explanation: 'Sổ tay tháng 6/2026 đặt trần tối đa ba năm. D-10-1 thường là ba năm từ 80 điểm, và một năm từ 60 đến dưới 80.',
    },
    'quiz-6': {
      question: 'Đại học Soongsil trả học bổng TOPIK cùng một tỷ lệ mỗi học kỳ.',
      explanation: 'Trang trường nói một lần ở học kỳ đầu sau nhập học, với người nhập học từ 2025. Cấp 3 là 40%, 4 là 60%, 5 là 80%, 6 là 100%.',
    },
    'quiz-7': {
      question: 'Sau khi E-9 kết thúc, có thể đổi sang D-2 trong Hàn Quốc để học.',
      explanation: 'Sổ tay tháng 6/2026 nói việc học có thể không cần giấy phép riêng, nhưng hết thời hạn đó thì không đổi sang D-2 vì học. Phải xuất cảnh rồi xin visa.',
    },
    'quiz-8': {
      question: 'Tuyển sinh nước ngoài xuân 2027 của Đại học Konkuk công nhận GED.',
      explanation: 'Hướng dẫn xuân 2027 nói GED, học từ xa, học trực tuyến, giáo dục suốt đời và khóa tiếng không được tính là học lực.',
    },
  },
  ru: {
    'quiz-2': {
      question: 'Статья 19 говорит, что иностранный ребёнок может подать заявление директору начальной школы района.',
      explanation: 'Если опекун отказывается от проверки въезда, договор аренды или гарантия подтверждают только проживание. Статья обращена к директору начальной школы, не средней и не старшей.',
    },
    'quiz-5': {
      question: 'Потолок D-10 для поиска работы — два года для всех.',
      explanation: 'Справочник июня 2026 года ставит потолок до трёх лет. Обычный D-10-1 — три года от 80 баллов и один год от 60 до 80.',
    },
    'quiz-6': {
      question: 'Университет Сунсиль платит одну и ту же долю стипендии TOPIK каждый семестр.',
      explanation: 'Страница университета говорит об одном разе в первом семестре для поступивших с 2025 года. 3 уровень 40%, 4 — 60%, 5 — 80%, 6 — 100%.',
    },
    'quiz-7': {
      question: 'После окончания E-9 можно сменить статус на D-2 внутри Кореи ради учёбы.',
      explanation: 'Справочник июня 2026 года говорит, что учёба может не требовать отдельного разрешения, но после окончания этого пребывания менять статус на D-2 ради учёбы нельзя. Нужно выехать и получить визу.',
    },
    'quiz-8': {
      question: 'Весенний набор иностранцев 2027 года университета Конкук принимает GED.',
      explanation: 'Весеннее руководство 2027 года говорит, что GED, заочное, онлайн, непрерывное образование и языковые курсы не считаются образованием.',
    },
  },
  mn: {
    'quiz-2': {
      question: '19-р зүйлд гадаадын хүүхэд сургуулийн тойргийн бага сургуулийн захиралд өргөдөл гаргаж болно гэж бичсэн.',
      explanation: 'Асран хамгаалагч хил нэвтрэлтийг шалгуулахгүй бол түрээс эсвэл оршин суух баталгаа зөвхөн оршин суухыг батална. Зүйл бага сургуулийн захирлыг заасан, дунд ба ахлахыг биш.',
    },
    'quiz-5': {
      question: 'Ажил хайх D-10-ийн дээд хугацаа хүн бүрт хоёр жил.',
      explanation: '2026 оны 6-р сарын гарын авлага дээд хязгаарыг хамгийн ихдээ гурван жил гэж бичсэн. Ердийн D-10-1 нь 80 ба түүнээс дээш бол гурван жил, 60-аас 80 хүртэл бол нэг жил.',
    },
    'quiz-6': {
      question: 'Сүнсил их сургууль TOPIK-ийн тэтгэлгийг улирал бүр ижил хувиар өгнө.',
      explanation: 'Сургуулийн хуудас 2025 оноос элсэгчдийн эхний улиралд нэг удаа гэж бичсэн. 3-р зэрэг 40%, 4: 60%, 5: 80%, 6: 100%.',
    },
    'quiz-7': {
      question: 'E-9 дууссаны дараа сурах гэж Солонгос дотор D-2 болгож болно.',
      explanation: '2026 оны 6-р сарын гарын авлагад суралцах нь тусдаа зөвшөөрөлгүй байж болох ч тэр хугацаа дууссаны дараа сурах гэж D-2 болгохгүй, гарч виз авна гэж бичсэн.',
    },
    'quiz-8': {
      question: 'Конкук их сургуулийн 2027 хаврын гадаадын элсэлт GED-г хүлээн зөвшөөрнө.',
      explanation: '2027 хаврын гарын авлагад GED, захидал, цахим, насан туршийн болон хэлний сургалтыг боловсрол гэж үзэхгүй гэж бичсэн.',
    },
  },
  ar: {
    'quiz-2': {
      question: 'المادة 19 تقول إن الطفل الأجنبي يمكنه التقديم إلى مدير المدرسة الابتدائية في منطقته.',
      explanation: 'إذا رفض الوصي فحص الهجرة، فعقد الإيجار أو ضمان السكن يثبت السكن فقط. المادة تخاطب مدير الابتدائية لا المتوسطة ولا الثانوية.',
    },
    'quiz-5': {
      question: 'سقف إقامة D-10 للبحث عن عمل سنتان للجميع.',
      explanation: 'دليل يونيو 2026 يضع السقف عند ثلاث سنوات كحد أقصى. D-10-1 العام ثلاث سنوات من 80 نقطة، وسنة واحدة من 60 إلى أقل من 80.',
    },
    'quiz-6': {
      question: 'جامعة سونغسيل تدفع منحة TOPIK بالنسبة نفسها كل فصل.',
      explanation: 'صفحة الجامعة تقول مرة واحدة في الفصل الأول بعد الالتحاق لمن التحق من 2025. المستوى 3 بنسبة 40%، و4 بنسبة 60%، و5 بنسبة 80%، و6 بنسبة 100%.',
    },
    'quiz-7': {
      question: 'بعد انتهاء E-9 يمكن التغيير إلى D-2 داخل كوريا من أجل الدراسة.',
      explanation: 'دليل يونيو 2026 يقول إن الدراسة قد لا تحتاج إذنًا منفصلًا، لكن بعد انتهاء تلك الإقامة لا يُسمح بالتغيير إلى D-2 للدراسة. تغادر ثم تحصل على تأشيرة.',
    },
    'quiz-8': {
      question: 'قبول الأجانب لربيع 2027 في جامعة كونكوك يعترف باختبار المعادلة.',
      explanation: 'دليل ربيع 2027 يقول إن المعادلة والتعليم بالمراسلة وعبر الإنترنت والتعليم مدى الحياة ودورات اللغة لا تُعد مؤهلًا دراسيًا.',
    },
  },
};

export const PROCEDURE_COPY: Record<Lang7, Record<string, { title: string; body: string }>> = {
  en: {
    'ksl-online': {
      title: 'Official online Korean study',
      body: 'Danuri’s free online Korean page lists Nuri-Sejong (speaking, listening, reading, writing) and EBS Durian for marriage migrants and multicultural children, including school clips. The National Institute of Korean Language textbook search includes materials for multicultural elementary, middle, and high school students in Korea. These pages do not assign a school seat.',
    },
  },
  'zh-Hans': {
    'ksl-online': {
      title: '官方在线韩语学习',
      body: '多文化门户的免费在线韩语页列出了世宗学堂在线（听说读写）和 EBS Durian（结婚移民和多文化家庭子女，含中小学课程片段）。国立国语院教材检索包含国内多文化小学生和中高中生的教材。这些页面不分配学校名额。',
    },
  },
  'zh-Hant': {
    'ksl-online': {
      title: '官方線上韓語學習',
      body: '多元文化入口的免費線上韓語頁列出了世宗學堂線上（聽說讀寫）和 EBS Durian（結婚移民和多元文化家庭子女，含中小學課程片段）。國立國語院教材檢索包含國內多元文化小學生和中高中生的教材。這些頁面不分配學校名額。',
    },
  },
  vi: {
    'ksl-online': {
      title: 'Học tiếng Hàn trực tuyến chính thức',
      body: 'Trang tiếng Hàn miễn phí của Danuri nêu Nuri-Sejong (nói, nghe, đọc, viết) và EBS Durian cho người kết hôn nhập cư và con em gia đình đa văn hóa, gồm clip môn học. Trang giáo trình của Viện quốc ngữ có tài liệu cho học sinh tiểu học, trung học đa văn hóa trong nước. Các trang này không xếp chỗ ở trường.',
    },
  },
  ru: {
    'ksl-online': {
      title: 'Официальное онлайн-изучение корейского',
      body: 'Бесплатная страница Данури называет Нури-Седжон (говорение, аудирование, чтение, письмо) и EBS Durian для супругов-мигрантов и детей мультикультурных семей, включая школьные ролики. Поиск учебников Национального института корейского языка включает материалы для мультикультурных учеников начальной, средней и старшей школы. Эти страницы не распределяют место в школе.',
    },
  },
  mn: {
    'ksl-online': {
      title: 'Албан ёсны цахим солонгос хэл',
      body: 'Дануригийн үнэгүй хуудас Нури-Сежон (ярих, сонсох, унших, бичих) болон гэрлэлтийн цагаач, олон соёлын хүүхдэд зориулсан EBS Durian-г бичсэн. Үндэсний хэлний хүрээлэнгийн сурах бичгийн хайлт дотоодын олон соёлын бага, дунд, ахлах сурагчдын материалтай. Эдгээр хуудас сургуулийн суудал хуваарилдаггүй.',
    },
  },
  ar: {
    'ksl-online': {
      title: 'تعلم كوري رسمي عبر الإنترنت',
      body: 'صفحة دانوري المجانية تذكر نوري-سيجونغ (كلام واستماع وقراءة وكتابة) وEBS دوريان للمهاجرين بالزواج وأبناء الأسر متعددة الثقافات، بما في ذلك مقاطع مدرسية. بحث كتب المعهد الوطني للغة الكورية يشمل مواد لطلاب ابتدائي ومتوسط وثانوي متعددي الثقافات داخل كوريا. هذه الصفحات لا تخصص مقعدًا مدرسيًا.',
    },
  },
};
