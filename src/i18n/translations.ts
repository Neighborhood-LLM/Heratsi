export type Lang = "en" | "ru" | "hy";

type T = Record<Lang, string>;

const t = (en: string, ru: string, hy: string): T => ({ en, ru, hy });

const translations = {
  nav: {
    home: t("Home", "\u0413\u043b\u0430\u0432\u043d\u0430\u044f", "\u0533\u056c\u056d\u0561\u057e\u0578\u0580"),
    about: t("About", "\u041e \u043f\u0440\u043e\u0435\u043a\u0442\u0435", "\u053e\u0580\u0561\u0563\u0580\u056b \u0574\u0561\u057d\u056b\u0576"),
    services: t("Services", "\u0423\u0441\u043b\u0443\u0433\u0438", "\u053e\u0561\u057c\u0561\u0575\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580"),
    telemedicine: t("Telemedicine", "\u0422\u0435\u043b\u0435\u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0430", "\u0540\u0565\u057c\u0561\u0562\u056a\u0577\u056f\u0578\u0582\u0569\u0575\u0578\u0582\u0576"),
    faq: t("FAQ", "\u0412\u043e\u043f\u0440\u043e\u0441\u044b", "\u0540\u054f\u0540"),
    contact: t("Contact", "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b", "\u053f\u0578\u0576\u057f\u0561\u056f\u057f\u0576\u0565\u0580"),
    doctors: t("Doctors", "Врачи", "Բժիշկներ"),
    aiAnalysis: t("AI Analysis", "AI анализ", "AI անալիզ"),
    signIn: t("Sign In", "Войти", "Մուտք"),
    dashboard: t("Dashboard", "Кабинет", "Վահանակ"),
  },
  hero: {
    title: t(
      "Redefining Access to Healthcare",
      "Переосмысливая доступ к здравоохранению",
      "Վերաիմաստավորելով առողժապահության հասանելիությունը"
    ),
    subtitle: t(
      "Expert care, medical knowledge, and digital support — without borders.",
      "Экспертная медицинская помощь, проверенные знания и цифровая поддержка — без границ.",
      "Մասնագիտական բժշկական օգնություն, վստահելի բժշկական գիտելիք և թվային աժակցություն՝ առանց սահմանների։"
    ),
    cta: t(
      "Book a Consultation",
      "Записаться на консультацию",
      "Գրանցվել խորհրդատվության"
    ),
  },
  about: {
    heading: t("About the Project", "О проекте", "Նախագծի մասին"),
    intro: t(
      "Insula is a medical and educational project that integrates clinical care with patient education.",
      "Insula — это медицинский и образовательный проект, объединяющий клиническую практику и обучение пациентов.",
      "Insula-ն բժշկական և կրթական նախագիծ է, որը միավորում է կլինիկական բժշկությունն ու պացիենտների կրթությունը։"
    ),
    philosophy: t(
      "At the core of Insula is a modern approach to endocrine and metabolic health, where treatment goes beyond a single consultation and continues through understanding, education, and ongoing support.",
      "В основе Insula — современный подход к эндокринологии и метаболическому здоровью, где лечение не ограничивается консультацией, а продолжается через понимание, обучение и поддержку.",
      "Insula-ի հիմքում ժամանակակից մոտեցումն է էնդոկրին և նյութափոխանակության առողժությանը, որտեղ բուժումը չի սահմանափակվում մեկ խորհրդատվությամբ, այլ շարունակվում է հասկանալու, կրթության և շարունակական աժակցության միժոցով։"
    ),
    pillars: [
      {
        title: t("Clinical Consultations", "Консультации", "Խորհրդատվություններ"),
        desc: t(
          "Consultations for patients with endocrine disorders",
          "Консультации пациентов с эндокринными заболеваниями",
          "Էնդոկրին հիվանդություններով պացիենտների խորհրդատվություն"
        ),
      },
      {
        title: t("Telemedicine", "Телемедицина", "Հեռաբժշկություն"),
        desc: t(
          "Enabling access to medical care regardless of location",
          "Телемедицина, которая позволяет получать медицинскую помощь вне зависимости от места нахождения",
          "Հեռաբժշկություն (telemedicine), որը հնարավորություն է տալիս ստանալ բժշկական օգնություն՝ անկախ գտնվելու վայրից"
        ),
      },
      {
        title: t("Educational Programs", "Образовательные программы", "Կրթական ծրագրեր"),
        desc: t(
          "Structured educational programs, including for people with diabetes, where education is a key component of effective treatment",
          "Образовательные программы, в том числе для людей с сахарным диабетом, где обучение является ключевым элементом эффективного лечения",
          "Կրթական ծրագրեր, այդ թվում՝ շաքարային դիաբետ ունեցող մարդկանց համար, որտեղ կրթությունը հանդիսանում է արդյունավետ բուժման հիմնասյուներից մեկը"
        ),
      },
    ],
    belief: t(
      "We believe that sustainable results are not possible without understanding. That is why Insula combines classical medicine with structured education — helping patients not only receive recommendations, but truly manage their condition.",
      "Мы убеждены, что устойчивый результат невозможен без понимания. Именно поэтому Insula объединяет классическую медицину и системное обучение, помогая пациенту не просто получать рекомендации, а осознанно управлять своим состоянием.",
      "Մենք վստահ ենք, որ կայուն արդյունքը հնարավոր չէ առանց հասկանալու։ Այդ պատճառով Insula-ն միավորում է դասական բժշկությունն ու համակարգված կրթությունը՝ օգնելով պացիենտին ոչ միայն ստանալ խորհուրդներ, այլ իրականում կառավարել իր առողժությունը։"
    ),
    closing: t(
      "Insula is healthcare that extends beyond the doctor's office and becomes part of everyday life.",
      "Insula — это медицина, которая выходит за пределы кабинета врача и становится частью повседневной жизни пациента.",
      "Insula-ն այն բժշկությունն է, որը դուրս է գալիս բժշկի կաբինետի սահմաններից և դառնում է մարդու առօրյա կյանքի մաս։"
    ),
  },
  telemedicine: {
    heading: t("What is Telemedicine?", "\u0427\u0442\u043e \u0442\u0430\u043a\u043e\u0435 \u0442\u0435\u043b\u0435\u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0430?", "\u053b\u055e\u0576\u0579 \u0567 \u0570\u0565\u057c\u0561\u0562\u056a\u0577\u056f\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568\u0589"),
    description: t(
      "Telemedicine allows you to consult with healthcare professionals remotely using video calls, chat, or phone. It's safe, convenient, and modern.",
      "\u0422\u0435\u043b\u0435\u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0430 \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f \u0441 \u0432\u0440\u0430\u0447\u0430\u043c\u0438 \u0434\u0438\u0441\u0442\u0430\u043d\u0446\u0438\u043e\u043d\u043d\u043e \u0447\u0435\u0440\u0435\u0437 \u0432\u0438\u0434\u0435\u043e, \u0447\u0430\u0442 \u0438\u043b\u0438 \u0442\u0435\u043b\u0435\u0444\u043e\u043d.",
      "\u0540\u0565\u057c\u0561\u0562\u056a\u0577\u056f\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568 \u0569\u0578\u0582\u0575\u056c \u0567 \u057f\u0561\u056c\u056b\u057d \u056d\u0578\u0580\u0570\u0580\u0564\u0561\u056f\u0581\u0565\u056c \u0562\u056a\u0577\u056f\u0576\u0565\u0580\u056b \u0570\u0565\u057f \u057f\u0565\u057d\u0561\u0566\u0561\u0576\u0563\u056b, \u0579\u0561\u057f\u056b \u056f\u0561\u0574 \u0570\u0565\u057c\u0561\u056d\u0578\u057d\u056b \u0574\u056b\u057b\u0578\u0581\u0578\u057e:"
    ),
    points: [
      t("Talk to doctors online from anywhere", "\u041e\u0431\u0449\u0430\u0439\u0442\u0435\u0441\u044c \u0441 \u0432\u0440\u0430\u0447\u0430\u043c\u0438 \u043e\u043d\u043b\u0430\u0439\u043d", "\u053d\u0578\u057d\u0565\u0584 \u0562\u056a\u0577\u056f\u0576\u0565\u0580\u056b \u0570\u0565\u057f \u0561\u057c\u0581\u0561\u0576\u0581"),
      t("Save time \u2014 no travel needed", "\u042d\u043a\u043e\u043d\u043e\u043c\u044c\u0442\u0435 \u0432\u0440\u0435\u043c\u044f", "\u053d\u0576\u0561\u0575\u0565\u0584 \u056a\u0561\u0574\u0561\u0576\u0561\u056f"),
      t("Get professional help from home", "\u041f\u043e\u043b\u0443\u0447\u0430\u0439\u0442\u0435 \u043f\u043e\u043c\u043e\u0449\u044c \u0438\u0437 \u0434\u043e\u043c\u0430", "\u054d\u057f\u0561\u0581\u0565\u0584 \u0585\u0563\u0576\u0578\u0582\u0569\u0575\u0578\u0582\u0576 \u057f\u0576\u056b\u0581"),
      t("Secure and private consultations", "\u0411\u0435\u0437\u043e\u043f\u0430\u0441\u043d\u044b\u0435 \u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0438\u0438", "\u0531\u0576\u057e\u057f\u0561\u0576\u0563 \u0587 \u0563\u0561\u0572\u057f\u0576\u056b \u056d\u0578\u0580\u0570\u0580\u0564\u0561\u057f\u057e\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580"),
    ],
  },
  cta: {
    heading: t("Ready to See a Doctor?", "\u0413\u043e\u0442\u043e\u0432\u044b \u043a \u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0438\u0438?", "\u054a\u0561\u057f\u0580\u0561\u057d\u057f\u055e \u0565\u0584 \u0562\u056a\u0577\u056f\u056b \u0564\u056b\u0574\u0565\u056c\u0578\u0582\u0589"),
    subtitle: t(
      "Book your online consultation today and get expert medical advice without leaving home.",
      "\u0417\u0430\u043f\u0438\u0448\u0438\u0442\u0435\u0441\u044c \u043d\u0430 \u043e\u043d\u043b\u0430\u0439\u043d-\u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0438\u044e \u0441\u0435\u0433\u043e\u0434\u043d\u044f.",
      "\u0533\u0580\u0561\u0576\u0581\u057e\u0565\u0584 \u0561\u057c\u0581\u0561\u0576\u0581 \u056d\u0578\u0580\u0570\u0580\u0564\u0561\u057f\u057e\u0578\u0582\u0569\u0575\u0561\u0576 \u0561\u0575\u057d\u0585\u0580:"
    ),
    button: t("Book a Consultation", "\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u043a\u043e\u043d\u0441\u0443\u043b\u044c\u0442\u0430\u0446\u0438\u044e", "\u0533\u0580\u0561\u0576\u0581\u057e\u0565\u056c \u056d\u0578\u0580\u0570\u0580\u0564\u0561\u057f\u057e\u0578\u0582\u0569\u0575\u0561\u0576"),
  },
  faq: {
    heading: t("Frequently Asked Questions", "\u0427\u0430\u0441\u0442\u043e \u0437\u0430\u0434\u0430\u0432\u0430\u0435\u043c\u044b\u0435 \u0432\u043e\u043f\u0440\u043e\u0441\u044b", "\u0540\u0561\u0573\u0561\u056d \u057f\u0580\u057e\u0578\u0572 \u0570\u0561\u0580\u0581\u0565\u0580"),
    items: [
      {
        q: t("What medical specialties are available at Insula?", "Какие направления представлены в Insula?", "Ի՞նչ ուղղություններ են ներկայացված Insula-ում։"),
        a: t(
          "Insula provides services in the following areas:\n-Endocrinology\n-Diabetology\n-Dietetics and Nutrition\n-Endocrine Gynecology",
          "В Insula представлены следующие направления:\n-эндокринология\n-диабетология\n-диетология и нутрициология\n-эндокринная гинекология",
          "Insula-ում ներկայացված են հետևյալ ուղղությունները՝\n-էնդոկրինոլոգիա\n-դիաբետոլոգիա\n-դիետոլոգիա և նուտրիցիոլոգիա\n-էնդոկրին գինեկոլոգիա"
        ),
      },
      {
        q: t("Is online consultation available?", "Можно ли получить онлайн-консультацию?", "Հնարավո՞ր է ստանալ օնլայն խորհրդատվություն։"),
        a: t(
          "Yes. One of the key areas of Insula is telemedicine. Patients can receive online consultations, laboratory result reviews, diagnostic recommendations, and ongoing medical support regardless of their country of residence. To book an online consultation, please select a specialist, consultation format, and convenient time in the [Consultations section](/services#consultations).",
          "Да. Одним из ключевых направлений Insula является телемедицина. Пациенты могут получать дистанционные консультации, разбор анализов, рекомендации по обследованию и медицинское сопровождение вне зависимости от страны проживания. Для записи на онлайн-консультацию необходимо в разделе [Консультации](/services#consultations) сайта выбрать специалиста, формат консультации и удобное время.",
          "Այո՛։ Insula-ի հիմնական ուղղություններից մեկը հեռաբժշկությունն է։ Պացիենտները կարող են ստանալ հեռավար խորհրդատվություն, անալիզների մեկնաբանություն, հետազոտությունների վերաբերյալ առաջարկություններ և բժշկական ուղեկցում՝ անկախ բնակության երկրից։ Օնլայն խորհրդատվության համար անհրաժեշտ է կայքի [Խորհրդատվություններ](/services#consultations) բաժնում ընտրել մասնագետին, խորհրդատվության ձևաչափը և հարմար ժամանակը։"
        ),
      },
      {
        q: t("Do you provide laboratory test interpretation?", "Проводите ли вы расшифровку анализов?", "Կատարու՞մ եք անալիզների մեկնաբանություն։"),
        a: t(
          "Yes. Insula offers an [AI-assisted laboratory test interpretation service](/services#ai-lab-results) on the website. It is important to understand that laboratory test interpretation does not replace a physician consultation. Results should always be evaluated in the context of symptoms, medical history, complaints, and the overall clinical situation.",
          "Да. На сайте Insula доступен [сервис интерпретации анализов с использованием AI](/services#ai-lab-results). Важно понимать, что интерпретация анализов не заменяет консультацию врача. Результаты всегда должны оцениваться с учетом жалоб, симптомов, анамнеза и клинической ситуации.",
          "Այո՛։ Insula-ի կայքում հասանելի է [AI-ի միջոցով անալիզների մեկնաբանության ծառայություն](/services#ai-lab-results)։ Կարևոր է հասկանալ, որ անալիզների մեկնաբանությունը չի փոխարինում բժշկի խորհրդատվությանը։ Արդյունքները միշտ պետք է գնահատվեն գանգատների, ախտանիշների, անամնեզի և ընդհանուր կլինիկական պատկերի համատեքստում։"
        ),
      },
      {
        q: t("Is telemedicine safe?", "Безопасна ли телемедицина?", "Արդո՞ք հեռաբժշկությունը անվտանգ է։"),
        a: t(
          "Yes. Insula uses modern technologies to protect patients' personal and medical data. Telemedicine consultations are conducted in accordance with confidentiality standards and medical data security principles.",
          "Да. В Insula используются современные технологии для защиты персональных и медицинских данных пациентов. Телемедицинские консультации проводятся с соблюдением принципов конфиденциальности и безопасности медицинской информации.",
          "Այո՛։ Insula-ում կիրառվում են ժամանակակից տեխնոլոգիաներ՝ պացիենտների անձնական և բժշկական տվյալների պաշտպանության համար։ Հեռավար խորհրդատվություններն իրականացվում են գաղտնիության և բժշկական տեղեկատվության անվտանգության սկզբունքների պահպանմամբ։"
        ),
      },
      {
        q: t("Can I contact Insula from another country?", "Можно ли обратиться к вам из другой страны?", "Հնարավո՞ր է դիմել ձեզ այլ երկրից։"),
        a: t(
          "Yes. Insula was created as an international medical project with the ability to provide remote interaction and medical support for patients from different countries.",
          "Да. Insula изначально создавалась как международный медицинский проект с возможностью дистанционного взаимодействия с пациентами из разных стран.",
          "Այո՛։ Insula-ն ստեղծվել է որպես միջազգային բժշկական նախագիծ՝ տարբեր երկրներից պացիենտների հետ հեռավար համագործակցության հնարավորությամբ։"
        ),
      },
      {
        q: t("What services does Insula provide?", "Какие услуги предоставляет Insula?", "Ի՞նչ ծառայություններ է տրամադրում Insula-ն։"),
        a: t(
          "Insula provides the following services:\n-Consultations with medical specialists:\n-Endocrinologist\n-Dietitian\n-Internal medicine physician/therapist\n-Gynecologist\n-Nutritionist consultations\n-Telemedicine consultations\n-AI-assisted laboratory test interpretation\n-Comprehensive patient management programs\n-Educational programs and patient training\n\nConsultations may be provided either in person or remotely, depending on the service and the patient's needs.",
          "Insula предоставляет следующие услуги:\n-Консультации врачей-специалистов:\n-Эндокринолог\n-Диетолог\n-Терапевт\n-Гинеколог\n-Консультация нутрициолога\n-Телемедицинские консультации\n-Интерпретация анализов с помощью AI\n-Комплексные программы ведения пациентов\n-Образовательные программы и обучение для пациентов\n\nФормат консультаций может быть как очным, так и дистанционным, в зависимости от услуги и потребностей пациента.",
          "Insula-ն տրամադրում է հետևյալ ծառայությունները՝\n-Բժիշկ-մասնագետների խորհրդատվություններ՝\n-Էնդոկրինոլոգ\n-Դիետոլոգ\n-Թերապևտ\n-Գինեկոլոգ\n-Նուտրիցիոլոգի խորհրդատվություն\n-Հեռաբժշկական խորհրդատվություններ\n-AI-ի միջոցով անալիզների մեկնաբանություն\n-Պացիենտների համալիր վարման ծրագրեր\n-Կրթական ծրագրեր և ուսուցում պացիենտների համար\n\nԽորհրդատվությունները կարող են իրականացվել ինչպես առկա, այնպես էլ հեռավար ձևաչափով՝ կախված ծառայությունից և պացիենտի կարիքներից։"
        ),
      },
    ],
  },
  contact: {
    heading: t("Contact Us", "\u041a\u043e\u043d\u0442\u0430\u043a\u0442\u044b", "\u053f\u0561\u057a \u0570\u0561\u057d\u057f\u0561\u057f\u0565\u0584"),
    phone: "+374 10 123 456",
    email: "info@insula.am",
    address: t("Yerevan, Armenia", "\u0415\u0440\u0435\u0432\u0430\u043d, \u0410\u0440\u043c\u0435\u043d\u0438\u044f", "\u0535\u0580\u0587\u0561\u0576, \u0540\u0561\u0575\u0561\u057d\u057f\u0561\u0576"),
    form: {
      name: t("Your Name", "\u0412\u0430\u0448\u0435 \u0438\u043c\u044f", "\u0541\u0565\u0580 \u0561\u0576\u0578\u0582\u0576\u0568"),
      phone: t("Phone Number", "\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430", "\u0540\u0565\u057c\u0561\u056d\u0578\u057d\u056b \u0570\u0561\u0574\u0561\u0580"),
      message: t("Message", "\u0421\u043e\u043e\u0431\u0449\u0435\u043d\u0438\u0435", "\u0540\u0561\u0572\u0578\u0580\u0564\u0561\u0563\u0580\u0578\u0582\u0569\u0575\u0578\u0582\u0576"),
      send: t("Send Message", "\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c", "\u0548\u0582\u0572\u0561\u0580\u056f\u0565\u056c"),
    },
  },
  footer: {
    rights: t("All rights reserved.", "\u0412\u0441\u0435 \u043f\u0440\u0430\u0432\u0430 \u0437\u0430\u0449\u0438\u0449\u0435\u043d\u044b.", "\u0532\u0578\u056c\u0578\u0580 \u056b\u0580\u0561\u057e\u0578\u0582\u0576\u0584\u0576\u0565\u0580\u0568 \u057a\u0561\u0577\u057f\u057a\u0561\u0576\u057e\u0561\u056e \u0565\u0576:"),
  },
  services: {
    heading: t("Services", "\u0423\u0441\u043b\u0443\u0433\u0438", "\u053e\u0561\u057c\u0561\u0575\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580"),
    subtitle: t(
      "Choose the medical service you need",
      "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u0443\u044e \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u0443\u044e \u0443\u0441\u043b\u0443\u0433\u0443",
      "\u0538\u0576\u057f\u0580\u0565\u0584 \u0571\u0565\u0566 \u0561\u0576\u0570\u0580\u0561\u056a\u0565\u0577\u057f \u0562\u056a\u0577\u056f\u0561\u056f\u0561\u0576 \u056e\u0561\u057c\u0561\u0575\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0568"
    ),
    duration: t("Duration", "\u0414\u043b\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0441\u0442\u044c", "\u054f\u0587\u0578\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576"),
    price: t("Price", "\u0421\u0442\u043e\u0438\u043c\u043e\u0441\u0442\u044c", "\u0533\u056b\u0576"),
    book: t("Book", "\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f", "\u0533\u0580\u0561\u0576\u0581\u057e\u0565\u056c"),
    complexHeading: t(
      "Complex Medical Services",
      "\u041a\u043e\u043c\u043f\u043b\u0435\u043a\u0441\u043d\u044b\u0435 \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u0438\u0435 \u0443\u0441\u043b\u0443\u0433\u0438",
      "\u0532\u0561\u0580\u0564 \u0562\u056a\u0577\u056f\u0561\u056f\u0561\u0576 \u056e\u0561\u057c\u0561\u0575\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580"
    ),
    complexSubtitle: t(
      "Select a program to learn more",
      "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0443 \u0434\u043b\u044f \u043f\u043e\u0434\u0440\u043e\u0431\u043d\u043e\u0441\u0442\u0435\u0439",
      "\u0538\u0576\u057f\u0580\u0565\u0584 \u056e\u0580\u0561\u0563\u056b\u0580 \u0574\u0561\u0576\u0580\u0561\u0574\u0561\u057d\u0576\u0565\u0580\u056b \u0570\u0561\u0574\u0561\u0580"
    ),
    selectProgram: t(
      "Select a program",
      "\u0412\u044b\u0431\u0435\u0440\u0438\u0442\u0435 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0443",
      "\u0538\u0576\u057f\u0580\u0565\u0584 \u056e\u0580\u0561\u0563\u056b\u0580"
    ),
    items: [
      {
        icon: "endo",
        title: t(
          "Consultation — Endocrinologist",
          "Консультация — Эндокринолог",
          "Խորհրդատվություն — Էնդոկրինոլոգ"
        ),
        desc: t(
          "Get professional advice from an endocrinologist via video consultation.",
          "Получите профессиональный совет эндокринолога по видеосвязи.",
          "Ստացեք էնդոկրինոլոգի մասնագիտական խորհուրդ տեսազանգով:"
        ),
        duration: t("30 min", "30 мин", "30 րոպե"),
        price: t("$20 / 8,000 AMD", "$20 / 8 000 AMD", "$20 / 8,000 AMD"),
      },
      {
        icon: "endoAdvanced",
        title: t(
          "Consultation — Endocrinologist (Advanced)",
          "Консультация — Эндокринолог (расширенная)",
          "Խորհրդատվություն — Էնդոկրինոլոգ (ընդլայնված)"
        ),
        desc: t(
          "Extended consultation or second opinion from a senior endocrinologist.",
          "Расширенная консультация или второе мнение старшего эндокринолога.",
          "Ընդլայնված խորհրդատվություն կամ երկրորդ կարծիք ավագ էնդոկրինոլոգից:"
        ),
        duration: t("45 min", "45 мин", "45 րոպե"),
        price: t("$35 / 14,000 AMD", "$35 / 14 000 AMD", "$35 / 14,000 AMD"),
      },
      {
        icon: "therapist",
        title: t(
          "Consultation — Therapist",
          "Консультация — Терапевт",
          "Խորհրդատվություն — Թերապևտ"
        ),
        desc: t(
          "General health consultation with a licensed therapist.",
          "Общая консультация по здоровью с лицензированным терапевтом.",
          "Ընդհանուր առողջապահական խորհրդատվություն լիցենզավորված թերապևտի հետ:"
        ),
        duration: t("30 min", "30 мин", "30 րոպե"),
        price: t("$18 / 7,000 AMD", "$18 / 7 000 AMD", "$18 / 7,000 AMD"),
      },
      {
        icon: "nutritionist",
        title: t(
          "Consultation — Nutritionist",
          "Консультация — Нутрициолог",
          "Խորհրդատվություն — Սննդաբան"
        ),
        desc: t(
          "Personalized nutrition and diet consultation.",
          "Персональная консультация по питанию и диете.",
          "Անհատական խորհրդատվություն սննդի և դիետայի վերաբերյալ:"
        ),
        duration: t("40 min", "40 мин", "40 րոպե"),
        price: t("$25 / 10,000 AMD", "$25 / 10 000 AMD", "$25 / 10,000 AMD"),
      },
    ],
    online: t("ONLINE", "ОНЛАЙН", "ՕՆԼԱՅՆ"),
    offline: t("OFFLINE", "ОФЛАЙН", "ՕՖԼԱՅՆ"),
    complexItems: [
      {
        title: t("Pregnancy with Hypothyroidism", "\u0411\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0441\u0442\u044c \u0441 \u0433\u0438\u043f\u043e\u0442\u0438\u0440\u0435\u043e\u0437\u043e\u043c", "\u0540\u056b\u057a\u0578\u0569\u056b\u0580\u0565\u0578\u0566\u0578\u057e \u0570\u0572\u056b\u0578\u0582\u0569\u0575\u0578\u0582\u0576"),
        desc: t(
          "Comprehensive monitoring and management during pregnancy with thyroid conditions.",
          "\u041a\u043e\u043c\u043f\u043b\u0435\u043a\u0441\u043d\u043e\u0435 \u043d\u0430\u0431\u043b\u044e\u0434\u0435\u043d\u0438\u0435 \u0432\u043e \u0432\u0440\u0435\u043c\u044f \u0431\u0435\u0440\u0435\u043c\u0435\u043d\u043d\u043e\u0441\u0442\u0438 \u0441 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u044f\u043c\u0438 \u0449\u0438\u0442\u043e\u0432\u0438\u0434\u043d\u043e\u0439 \u0436\u0435\u043b\u0435\u0437\u044b.",
          "\u0540\u0561\u0574\u0561\u057a\u0561\u0580\u0583\u0561\u056f \u0564\u056b\u057f\u0561\u0580\u056f\u0578\u0582\u0574 \u0570\u0572\u056b\u0578\u0582\u0569\u0575\u0561\u0576 \u0568\u0576\u0569\u0561\u0581\u0584\u0578\u0582\u0574:"
        ),
        duration: t("Program: 9 months", "\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430: 9 \u043c\u0435\u0441\u044f\u0446\u0435\u0432", "\u053e\u0580\u0561\u0563\u056b\u0580\u055d 9 \u0561\u0574\u056b\u057d"),
        price: t("$200 / 80,000 AMD", "$200 / 80 000 AMD", "$200 / 80,000 AMD"),
      },
      {
        title: t("Chronic Disease Monitoring", "\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433 \u0445\u0440\u043e\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0445 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u0439", "\u0554\u0580\u0578\u0576\u056b\u056f \u0570\u056b\u057e\u0561\u0576\u0564\u0578\u0582\u0569\u0575\u0578\u0582\u0576\u0576\u0565\u0580\u056b \u0564\u056b\u057f\u0561\u0580\u056f\u0578\u0582\u0574"),
        desc: t(
          "Ongoing medical support and regular check-ups for chronic conditions.",
          "\u041f\u043e\u0441\u0442\u043e\u044f\u043d\u043d\u0430\u044f \u043c\u0435\u0434\u0438\u0446\u0438\u043d\u0441\u043a\u0430\u044f \u043f\u043e\u0434\u0434\u0435\u0440\u0436\u043a\u0430 \u043f\u0440\u0438 \u0445\u0440\u043e\u043d\u0438\u0447\u0435\u0441\u043a\u0438\u0445 \u0437\u0430\u0431\u043e\u043b\u0435\u0432\u0430\u043d\u0438\u044f\u0445.",
          "\u0547\u0561\u0580\u0578\u0582\u0576\u0561\u056f\u0561\u056f\u0561\u0576 \u0562\u056a\u0577\u056f\u0561\u056f\u0561\u0576 \u0561\u057b\u0561\u056f\u0581\u0578\u0582\u0569\u0575\u0578\u0582\u0576:"
        ),
        duration: t("Program: 6 months", "\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430: 6 \u043c\u0435\u0441\u044f\u0446\u0435\u0432", "\u053e\u0580\u0561\u0563\u056b\u0580\u055d 6 \u0561\u0574\u056b\u057d"),
        price: t("$150 / 60,000 AMD", "$150 / 60 000 AMD", "$150 / 60,000 AMD"),
      },
      {
        title: t("Personalized Treatment Plan", "\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u044b\u0439 \u043f\u043b\u0430\u043d \u043b\u0435\u0447\u0435\u043d\u0438\u044f", "\u0531\u0576\u0570\u0561\u057f\u0561\u056f\u0561\u0576 \u0562\u0578\u0582\u056a\u0574\u0561\u0576 \u057a\u056c\u0561\u0576"),
        desc: t(
          "A tailored treatment strategy based on your health profile.",
          "\u041f\u0435\u0440\u0441\u043e\u043d\u0430\u043b\u044c\u043d\u0430\u044f \u0441\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044f \u043b\u0435\u0447\u0435\u043d\u0438\u044f \u043d\u0430 \u043e\u0441\u043d\u043e\u0432\u0435 \u0432\u0430\u0448\u0435\u0433\u043e \u043f\u0440\u043e\u0444\u0438\u043b\u044f \u0437\u0434\u043e\u0440\u043e\u0432\u044c\u044f.",
          "\u0531\u0576\u0570\u0561\u057f\u0561\u056f\u0561\u0576 \u0562\u0578\u0582\u056a\u0574\u0561\u0576 \u057d\u057f\u0580\u0561\u057f\u0565\u0563\u056b\u0561:"
        ),
        duration: t("Program: 3 months", "\u041f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0430: 3 \u043c\u0435\u0441\u044f\u0446\u0430", "\u053e\u0580\u0561\u0563\u056b\u0580\u055d 3 \u0561\u0574\u056b\u057d"),
        price: t("$100 / 40,000 AMD", "$100 / 40 000 AMD", "$100 / 40,000 AMD"),
      },
    ],
    booking: {
      title: t("Book an Appointment", "\u0417\u0430\u043f\u0438\u0441\u0430\u0442\u044c\u0441\u044f \u043d\u0430 \u043f\u0440\u0438\u0451\u043c", "\u0533\u0580\u0561\u0576\u0581\u057e\u0565\u056c \u0568\u0576\u0564\u0578\u0582\u0576\u0574\u0561\u0576"),
      name: t("Your Name", "\u0412\u0430\u0448\u0435 \u0438\u043c\u044f", "\u0541\u0565\u0580 \u0561\u0576\u0578\u0582\u0576\u0568"),
      phone: t("Phone Number", "\u041d\u043e\u043c\u0435\u0440 \u0442\u0435\u043b\u0435\u0444\u043e\u043d\u0430", "\u0540\u0565\u057c\u0561\u056d\u0578\u057d\u056b \u0570\u0561\u0574\u0561\u0580"),
      date: t("Preferred Date", "\u041f\u0440\u0435\u0434\u043f\u043e\u0447\u0438\u0442\u0430\u0435\u043c\u0430\u044f \u0434\u0430\u0442\u0430", "\u0546\u0561\u056d\u0568\u0576\u057f\u0580\u0565\u056c\u056b \u0561\u0574\u057d\u0561\u0569\u056b\u057e"),
      submit: t("Confirm Booking", "\u041f\u043e\u0434\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044c \u0437\u0430\u043f\u0438\u0441\u044c", "\u0540\u0561\u057d\u057f\u0561\u057f\u0565\u056c \u0563\u0580\u0561\u0576\u0581\u0578\u0582\u0574\u0568"),
      success: t("Booking request sent!", "\u0417\u0430\u044f\u0432\u043a\u0430 \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0430!", "\u0540\u0561\u0575\u057f\u0568 \u0578\u0582\u0572\u0561\u0580\u056f\u057e\u0561\u056e \u0567!"),
    },
  },
  doctors: {
    heading: t("Our Doctors", "Наши врачи", "Մեր բժիշկները"),
    subtitle: t("Choose your specialist", "Выберите своего специалиста", "Ընտրեք ձեր մասնագետին"),
    experience: t("Experience", "Опыт", "Փորձ"),
    languages: t("Languages", "Языки", "Լեզուներ"),
    bookConsultation: t("Book a Consultation", "Записаться на консультацию", "Գրանցվել խորհրդատվության"),
    seeDiplomas: t("See diplomas & certificates", "Дипломы и сертификаты", "Դիպլոմներ և վկայականներ"),
    diplomasComingSoon: t(
      "Diplomas and certificates will be available here soon.",
      "Дипломы и сертификаты скоро будут доступны здесь.",
      "Դիպլոմները և վկայականները շուտով հասանելի կլինեն այստեղ։"
    ),
  },
};

export default translations;
