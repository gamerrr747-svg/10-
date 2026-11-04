export type LangCode = 'kz' | 'en' | 'ru';

export const LANGS: [LangCode, string, string][] = [
  ['kz', 'ҚАЗ', 'Қазақша'],
  ['en', 'ENG', 'English'],
  ['ru', 'РУС', 'Русский'],
];

export const UI: Record<string, [string, string, string]> = {
  eyebrow: [
    'Геометрия · 10-сынып · №1 «Білім-Инновация» лицейі',
    'Geometry · Grade 10 · №1 «Bilim-Innovation» lyceum',
    'Геометрия · 10 класс · Лицей №1 «Білім-Инновация»',
  ],
  home: ['Басты бет', 'Home', 'Главная'],
  lessons: ['Сабақтар', 'Lessons', 'Уроки'],
  studio: ['3D Студия', '3D Studio', '3D-студия'],
  labs: ['Зертханалар', 'Labs', 'Лаборатории'],
  theory: ['Теория', 'Theory', 'Теория'],
  assessment: ['Бағалау', 'Assessment', 'Оценивание'],
  term2: ['2-тоқсан', 'Term 2', '2 четверть'],
  term3: ['3-тоқсан', 'Term 3', '3 четверть'],
  goto: ['Өту', 'Go to', 'Перейти'],
  closure: ['Тоқсанды қорыту', 'Term closure', 'Итоги четверти'],
  handbook: ['Анықтамалық', 'Handbook', 'Справочник'],
  theoryItem: ['Теория: анықтамалар мен теоремалар', 'Theory: definitions and theorems', 'Теория: определения и теоремы'],
  tools: ['3D құралдар', '3D tools', '3D-инструменты'],
  lab: ['Зертхана', 'Lab', 'Лаборатория'],
  figure: ['◆ Сызба', '◆ Figure', '◆ Чертёж'],
  hideFigure: ['◆ Сызбаны жасыру', '◆ Hide figure', '◆ Скрыть чертёж'],
  yourAns: ['жауабыңыз', 'your answer', 'ваш ответ'],
  check: ['Тексеру', 'Check', 'Проверить'],
  typeNum: ['Сан жазыңыз, мысалы 2sqrt(3) немесе 3.46', 'Type a number, e.g. 2sqrt(3) or 3.46', 'Введите число, например 2sqrt(3) или 3.46'],
  correct: ['✓ Дұрыс', '✓ Correct', '✓ Верно'],
  notYet: ['✗ Әлі емес — қадамдарыңызды тексеріңіз', '✗ Not yet — check your steps', '✗ Пока нет — проверьте шаги'],
  taughtOf: ['Өтілді: {0} / {1} сабақ', 'Taught: {0} of {1} lessons', 'Проведено: {0} из {1} уроков'],
  cont: ['Жалғастыру', 'Continue', 'Продолжить'],
  openStudio: ['3D Студияны ашу', 'Open 3D Studio', 'Открыть 3D-студию'],
  f1t: ['Не табу керегін көрсететін сызбалар', 'Figures that show what to find', 'Чертежи, которые показывают, что найти'],
  f1: [
    'Әр мысалдың 3D сызбасы бар: берілгендері көк, ізделетіні алтын түсті. Шешім қадам-қадаммен құрылады.',
    'Every worked example has a 3D figure: givens in blue, the unknown in gold. The solution builds up step by step.',
    'У каждого примера есть 3D-чертёж: данные — синие, искомое — золотое. Решение строится шаг за шагом.',
  ],
  f2: [
    'Desmos сияқты нүктелерді, жазықтықтарды, денелерді жазыңыз; жүгірткілер, анимация және өлшеулер.',
    'Type points, planes and solids like in Desmos; sliders, animation and measurements.',
    'Вводите точки, плоскости и тела, как в Desmos; ползунки, анимация и измерения.',
  ],
  f3t: ['Көрсету режимі', 'Present mode', 'Режим показа'],
  f3: [
    'Кез келген сабақты проекторға ашыңыз: бір экранда бір кезең, көрсеткі пернелерімен.',
    'Open any lesson on the projector, one stage per screen, with the arrow keys.',
    'Откройте любой урок на проекторе: один этап на экран, переключение стрелками.',
  ],
  f4t: ['Жауапты тексеру', 'Answer checks', 'Проверка ответов'],
  f4: [
    'Оқушы 3√11 немесе 9.95 деп жазып, бірден нәтиже алады.',
    'Students type 3√11 or 9.95 and get instant feedback.',
    'Ученик вводит 3√11 или 9.95 и сразу видит результат.',
  ],
  nLessons: ['{0} сабақ', '{0} lessons', 'уроков: {0}'],
  startUnit: ['Бөлімді бастау', 'Start unit', 'Начать раздел'],
  howRuns: ['Әр сабақ қалай өтеді', 'How every lesson runs', 'Как проходит каждый урок'],
  plan: ['Тоқсандық жоспар', 'Term plan', 'План четверти'],
  no: ['№', 'No.', '№'],
  lesson: ['Сабақ', 'Lesson', 'Урок'],
  objectives: ['Мақсаттар', 'Objectives', 'Цели'],
  textbook: ['Оқулық', 'Textbook', 'Учебник'],
  glossary: ['Сөздік', 'Glossary', 'Словарь'],
  ido: ['МЕН ЖАСАЙМЫН', 'I DO', 'Я ДЕЛАЮ'],
  wedo: ['БІРГЕ ЖАСАЙМЫЗ', 'WE DO', 'ДЕЛАЕМ ВМЕСТЕ'],
  example: ['МЫСАЛ', 'EXAMPLE', 'ПРИМЕР'],
  next: ['Келесі қадам', 'Next step', 'Следующий шаг'],
  all: ['Барлығын көрсету', 'Show all', 'Показать всё'],
  restart: ['Қайта бастау', 'Restart', 'Сначала'],
  s1: ['1. Ой қозғау', '1. Warm-up', '1. Разминка'],
  s2: ['2. Зерттеу (CPA моделі: заттық → бейнелік → таңбалық)', '2. Explore (CPA model: concrete → pictorial → abstract)', '2. Исследование (модель CPA: предметно → наглядно → абстрактно)'],
  s3: ['3. Түйінді теория мен дәлелдеу', '3. Key Theory & Proof', '3. Теория и доказательства'],
  s4: ['4. Үлгі есептер мен шешім алгоритмі', '4. Worked Examples', '4. Разобранные примеры'],
  s5: ['5. Деңгейлік жаттығулар мен есептер', '5. Tiered Practice', '5. Дифференцированная практика'],
  s6: ['6. Қорытындылау және рефлексия', '6. Summary & Reflection', '6. Обобщение и рефлексия'],
  hw: ['Үй тапсырмасы', 'Homework', 'Домашнее задание'],
  min: ['мин', 'min', 'мин'],
  concrete: ['Нақты', 'Concrete', 'Предметно'],
  pictorial: ['Бейнелі', 'Pictorial', 'Наглядно'],
  abstract: ['Дерексіз', 'Abstract', 'Абстрактно'],
  openIn: ['{0} ашу ↗', 'Open in {0} ↗', 'Открыть: {0} ↗'],
  fluency: ['Дағды', 'Fluency', 'Навык'],
  reasoning: ['Пайымдау', 'Reasoning', 'Рассуждение'],
  challenge: ['Күрделі', 'Challenge', 'Сложнее'],
  forAll: ['бәрі', 'all', 'все'],
  forMost: ['көпшілік', 'most', 'большинство'],
  forSome: ['кейбірі', 'some', 'некоторые'],
  showAllAns: ['Барлық жауапты көрсету', 'Show all answers', 'Показать все ответы'],
  hideAns: ['Жауаптарды жасыру', 'Hide answers', 'Скрыть ответы'],
  showAns: ['Жауаптарды көрсету', 'Show answers', 'Показать ответы'],
  reflect: ['Рефлексия:', 'Reflect:', 'Рефлексия:'],
  reflectDef: [
    'Бүгінгі қай қадамды сыныптасыңызға бірінші түсіндірер едіңіз және неге?',
    'Which step today would you explain to a classmate first, and why?',
    'Какой сегодняшний шаг вы объяснили бы однокласснику первым и почему?',
  ],
  sc: ['Табыс критерийлері', 'Success criteria', 'Критерии успеха'],
  lo: ['Оқу мақсаттары', 'Learning objectives', 'Цели обучения'],
  terms: ['Терминдер · ҚАЗ / ENG / РУС', 'Terms · KZ / EN / RU', 'Термины · ҚАЗ / ENG / РУС'],
  watch: ['Назар аударыңыз:', 'Watch for:', 'Обратите внимание:'],
  diff: ['Саралау', 'Differentiation', 'Дифференциация'],
  tabPassport: ['1. Сабақ төлқұжаты & Құндылықтар', '1. Passport & Values', '1. Паспорт и ценности'],
  tabTheory: ['2. Түйінді теория & Әлемдік әдістер', '2. Theory & Global Methods', '2. Теория и мировые методы'],
  tabExamples: ['3. Мысалдар мен сызбалар', '3. Worked Examples & Visuals', '3. Примеры и чертежи'],
  tabErrors: ['4. Қатемен жұмыс', '4. Error Analysis', '4. Работа над ошибками'],
  tabPractice: ['5. Тәжірибе & PISA тапсырмалары', '5. Practice & PISA Tasks', '5. Практика и PISA-задачи'],
  tabExit: ['6. Рефлексия & Экспресс-тест', '6. Reflection & Exit Quiz', '6. Рефлексия и экспресс-тест'],
  sideNote: ['Назар аударыңыз', 'Key Insight', 'Обратите внимание'],
  sideWarning: ['Ескерту', 'Warning', 'Предупреждение'],
  sideTerms: ['3 тілді терминдер', 'Trilingual Glossary', 'Трёхъязычный глоссарий'],
  sideFormulas: ['Формулалар', 'Formulas', 'Формулы'],
  togglePanel: ['Оң жақ көмекші панель', 'Companion Panel', 'Панель-помощник'],
  feynmanTitle: ['Фейнман әдісі (Қарапайым тілмен)', 'The Feynman Technique (Simple Analogy)', 'Метод Фейнмана (Простое объяснение)'],
  dualCodingTitle: ['Қос кодтау (Dual Coding: Сөз + Бейне)', 'Dual Coding (Verbal + Visual)', 'Двойное кодирование (Слово + Чертёж)'],
  cpaTitle: ['CPA моделі (Заттық → Бейнелік → Дерексіз)', 'CPA Model (Concrete → Pictorial → Abstract)', 'Модель CPA (Предметно → Наглядно → Абстрактно)'],
  misconceptionTitle: ['Қай жерден қателесуге болады? (Типтік қателер)', 'Common Misconceptions & Pitfalls', 'Где легко ошибиться? (Типичные ошибки)'],
  whyWrongTitle: ['Неге бұлай істеуге болмайды?', 'Why this is incorrect', 'Почему так делать нельзя?'],
  correctWayTitle: ['Дұрыс математикалық тәсіл:', 'Correct mathematical way:', 'Правильный математический подход:'],
  pisaTitle: ['PISA / Өмірмен байланысты қолданбалы есеп', 'Real-World Context & PISA Task', 'Связь с жизнью (PISA-задача)'],
  valuesTitle: ['Мектеп құндылықтары', 'Core Values', 'Ценности образования'],
  stepByStepProof: ['Қадамдық геометриялық дәлелдеу', 'Step-by-step geometric proof', 'Пошаговое геометрическое доказательство'],
  quickCheck: ['Өзін-өзі экспресс-тексеру', 'Express Self-Check', 'Экспресс-самопроверка'],
  lessonOf: ['{0}-сабақ / {1}', 'Lesson {0} of {1}', 'Урок {0} из {1}'],
  yearNo: ['жылдық жоспар №{0}', 'year plan No. {0}', 'годовой план № {0}'],
  present: ['▶ Көрсету', '▶ Present', '▶ Показ'],
  markTaught: ['Өтілді деп белгілеу', 'Mark as taught', 'Отметить как проведённый'],
  taught: ['✓ Өтілді', '✓ Taught', '✓ Проведён'],
  sasIn: ['<b>{0}</b> осы сабақта жазылады ({1}).', '<b>{0}</b> is written in this lesson ({1}).', '<b>{0}</b> пишется на этом уроке ({1}).'],
  sasRun: [' Тек 1, 3 және 6-кезеңдерді өткізіңіз; жаттығуды үйге беріңіз.', ' Run stages 1, 3 and 6 only; set practice as homework.', ' Проведите только этапы 1, 3 и 6; практику задайте на дом.'],
  openPaper: ['{0} ашу →', 'Open {0} paper →', 'Открыть {0} →'],
  full: ['Толық экран', 'Full screen', 'Во весь экран'],
  close: ['Жабу ✕', 'Close ✕', 'Закрыть ✕'],
  back: ['← Артқа', '← Back', '← Назад'],
  nextS: ['Келесі →', 'Next →', 'Далее →'],
  finish: ['Аяқтау', 'Finish', 'Завершить'],
  keyIdea: ['Негізгі идея', 'Key idea', 'Ключевая идея'],
  exampleN: ['{0}-мысал', 'Example {0}', 'Пример {0}'],
  i3d: ['Интерактивті 3D', 'Interactive 3D', 'Интерактивное 3D'],
  labsLead: [
    'Әр зертхана — тышқанмен немесе саусақпен бұрауға болатын 3D модель. Сабақтар тиісті зертхананы дайын күйінде ашады.',
    'Every lab is a 3D model you can turn with the mouse or a finger. Lessons open the matching lab already set up.',
    'Каждая лаборатория — 3D-модель, которую можно вращать мышью или пальцем. Уроки открывают нужную лабораторию уже настроенной.',
  ],
  allUnits: ['Барлық бөлімдер', 'All units', 'Все разделы'],
  studioDesc: [
    '3D графиктік калькулятор: нүктелер, жазықтықтар, денелер, сфералар, қисықтар, жүгірткілер және анимация.',
    'A 3D graphing calculator: points, planes, solids, spheres, curves, sliders and animation.',
    '3D-графический калькулятор: точки, плоскости, тела, сферы, кривые, ползунки и анимация.',
  ],
  studioLead: [
    'Әр жолға бір объект жазыңыз. Сан жазылған жол жүгірткіге айналады. Жолдың соңына “// find” немесе “// given” қосса, ол боялады, ал басына “@2” жазса, 2-қадамда шығады.',
    'Type one object per line. A number line becomes a slider. Add “// find” or “// given” after a line to colour it, and “@2” in front to show it at step 2.',
    'Вводите по одному объекту в строке. Строка с числом становится ползунком. Добавьте “// find” или “// given” в конце строки, чтобы раскрасить её, и “@2” в начале, чтобы показать её на шаге 2.',
  ],
  t2labs: ['2-тоқсан · Перпендикулярлық', 'Term 2 · Perpendicularity', '2 четверть · Перпендикулярность'],
  t3labs: ['3-тоқсан · Координаталар және векторлар', 'Term 3 · Coordinates and vectors', '3 четверть · Координаты и векторы'],
  labUi: ['Зертхананың ішкі басқару элементтері ағылшын тілінде.', 'Lab controls are in English.', 'Элементы управления лаборатории — на английском.'],
  thLead: [
    'Тоқсанның барлық анықтамасы мен теоремасы. Әр карточка 3D Студияда дайын модельді ашады: сандарды өзгертіп, фигураны бұраңыз.',
    'Every definition and theorem of the term. Each card opens a ready-made model in the 3D Studio: change the numbers and turn the figure.',
    'Все определения и теоремы четверти. Каждая карточка открывает готовую модель в 3D-студии: меняйте числа и поворачивайте фигуру.',
  ],
  why: ['Неге:', 'Why:', 'Почему:'],
  lessonN: ['{0}-сабақ', 'Lesson {0}', 'Урок {0}'],
  Theorem: ['Теорема', 'Theorem', 'Теорема'],
  Definition: ['Анықтама', 'Definition', 'Определение'],
  Method: ['Тәсіл', 'Method', 'Метод'],
  Model: ['Модель', 'Model', 'Модель'],
  summ: ['Жиынтық бағалау', 'Summative assessment', 'Суммативное оценивание'],
  asmLead: [
    'Әр жұмыс: спецификация, екі нұсқа, балл қою кестесі, дескрипторлар және не табу керегін көрсететін шешу сызбалары.',
    'Each paper: specification, two variants, marking scheme, descriptors and solution figures that show what students must find.',
    'Каждая работа: спецификация, два варианта, схема выставления баллов, дескрипторы и чертежи решений, показывающие, что нужно найти.',
  ],
  lessonW: ['сабақ', 'lesson', 'урок'],
  marksW: ['балл', 'marks', 'баллов'],
  solFigs: ['◆ Шешу сызбалары', '◆ Solution figures', '◆ Чертежи решений'],
  figLead: [
    '1-нұсқа. Берілгендері көк, ізделетіні алтын түсті. Тексеру үшін “Жауапты көрсету”, шешімді құру үшін қадам батырмаларын басыңыз.',
    'Variant 1. Givens are blue, the unknown is gold. Use “Show answer” to check, and the step buttons to build the solution.',
    'Вариант 1. Данные — синие, искомое — золотое. Нажмите “Показать ответ” для проверки, а кнопки шагов — чтобы построить решение.',
  ],
  task: ['ТАПСЫРМА', 'TASK', 'ЗАДАНИЕ'],
  enOnly: ['3-тоқсан материалдары әзірге ағылшын тілінде. Аударма 2-тоқсанға қосылған.', 'Term 3 materials are in English for now.', 'Материалы 3 четверти пока на английском. Перевод добавлен для 2 четверти.'],
  heroTip: ['3D Студияны ашу үшін екі рет басыңыз', 'Double-click to open the 3D Studio', 'Дважды щёлкните, чтобы открыть 3D-студию'],
  extra: ['қосымша', 'extra', 'доп.'],
  show: ['Жауапты көрсету', 'Show answer', 'Показать ответ'],
  hide: ['Жауапты жасыру', 'Hide answer', 'Скрыть ответ'],
  step: ['қадам', 'step', 'шаг'],
  given0: ['берілгені', 'given', 'дано'],
  steps: ['қадам', 'steps', 'шаг.'],
  Given: ['Берілгені', 'Given', 'Дано'],
  Find: ['Табу керек', 'Find', 'Найти'],
  reset: ['Көріністі қалпына келтіру', 'Reset view', 'Сбросить вид'],
};

export const FIG_WORDS: Record<string, [string, string, string]> = {
  projection: ['проекция', 'projection', 'проекция'],
  angle: ['бұрыш', 'angle', 'угол'],
  normal: ['нормаль', 'normal', 'нормаль'],
  same: ['дәл осылай', 'same', 'так же'],
};

export function getLangIndex(lang: LangCode): number {
  return lang === 'kz' ? 0 : lang === 'en' ? 1 : 2;
}

export function t(lang: LangCode, key: string, ...args: (string | number)[]): string {
  const e = UI[key];
  let s = e ? e[getLangIndex(lang)] : key;
  args.forEach((v, i) => {
    s = s.replace('{' + i + '}', String(v));
  });
  return s;
}

export function figLabel(lang: LangCode, s: string): string {
  if (!s || lang === 'en') return s;
  const idx = getLangIndex(lang);
  return s.replace(/\b(projection|angle|normal|same)\b/g, (w) => (FIG_WORDS[w] ? FIG_WORDS[w][idx] : w));
}

export function typesetMath(el?: HTMLElement | null) {
  if (typeof window !== 'undefined' && (window as any).MathJax?.typesetPromise) {
    const mjx = (window as any).MathJax;
    try {
      if (el) {
        if (mjx.typesetClear) mjx.typesetClear([el]);
        mjx.typesetPromise([el]).catch(() => {});
      } else {
        mjx.typesetPromise().catch(() => {});
      }
    } catch {}
  }
}
