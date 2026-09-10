/* ============================================================
   lang-toggle.js — <lang-toggle> custom element.

   English is the base. Translates every [data-i18n] element in
   place and flips the page to RTL + an Arabic font when Arabic
   is active. Persists the choice in localStorage.

   Classic script (IIFE), same pattern as theme-toggle.js, so it
   also works when the page is opened straight from disk.

   Exposes window.i18n = { t(key), lang, apply() } so other
   scripts (e.g. more-projects.js) can re-translate text they
   change themselves (the "View more / Hide projects" label).
   ============================================================ */

(function () {
  var KEY = 'yousif-lang';

  // English text is already in the HTML — only Arabic needs listing here.
  var AR = {
    cvBtn: 'تحميل السيرة الذاتية',

    identityEyebrow: 'مهندس برمجيات',
    identityHeadline: 'أبني الذكاء الاصطناعي داخل برمجيات حقيقية.',
    identityRole: 'هندسة الواجهة الخلفية والتطوير المتكامل المدعوم بالذكاء الاصطناعي.',
    identityLocation: 'الشارقة، الإمارات العربية المتحدة',
    identitySummary:
      'خريج هندسة برمجيات متخصص في أنظمة الاسترجاع المعزز (RAG)، وتطبيقات معالجة اللغة الطبيعية ' +
      'والرؤية الحاسوبية، والمنصات المالية القابلة للتوسع، لبناء برمجيات موثوقة تدمج الذكاء ' +
      'الاصطناعي بحلول أعمال واقعية.',

    labelFlagship: 'المشروع الرئيسي',
    invoxTitle: 'InVox — ذكاء الفواتير',
    invoxImpact:
      'خط معالجة من 9 مراحل يجمع بين استخراج النصوص (OCR) ونماذج اللغة الكبيرة، مع محرك RAG هجين ' +
      'مستقل عن المزوّد (استرجاع المتجهات، إعادة صياغة الاستعلام، إعادة الترتيب، وتوجيه النوايا) ' +
      'لتوليد إجابات مالية مبنية على نتائج قاعدة البيانات وملفات الامتثال التنظيمي، ' +
      'مضيفًا طبقة ذكاء إلى منصة معالجة الفواتير.',

    labelExperience: 'الخبرة',
    quenetTitle: 'Quenet — لوحة تحكم QMS',
    quenetImpact:
      'بناء لوحة تحكم متكاملة وفورية باستخدام واجهات Qmatic البرمجية، لعرض مؤشرات أداء الفروع ' +
      'والطوابير ونقاط الخدمة مباشرة. خطوط معالجة Node/Express تجمّع البيانات التشغيلية وتُطبّعها ' +
      'في مقاييس وتنبيهات حية.',

    moreBtnShow: 'عرض المزيد من المشاريع',
    moreBtnHide: 'إخفاء المشاريع',

    mentalEyebrow: 'معالجة اللغة الطبيعية · تعلم عميق',
    mentalTitle: 'مصنّف نصوص الصحة النفسية',
    mentalImpact:
      'ضبط دقيق لنموذج DistilBERT على 42,380 عبارة مصنّفة عبر 7 فئات (دقة تحقق 83%، ' +
      'ومقياس F1 كلي 0.81)، مع استرجاع دلالي عبر FAISS وتقييم كامل لكل فئة.',

    footballEyebrow: 'الرؤية الحاسوبية',
    footballTitle: 'تحليل مباريات كرة القدم',
    footballImpact:
      'خط معالجة قائم على YOLOv8 لتتبّع اللاعبين والكرة عبر لقطات المباراة — تجميع الفرق عبر ' +
      'تحليل ألوان القمصان بخوارزمية K-means، وتعويض حركة الكاميرا بالتدفق البصري، وتحويل منظوري ' +
      'إلى إحداثيات الملعب، وحساب سرعة ومسافة كل لاعب.',

    coachEyebrow: 'تحليل صوتي بالذكاء الاصطناعي',
    coachTitle: 'مدرّب المحادثة العربية',
    coachImpact:
      'تصميم وبناء منصة تدريب على المحادثة من البداية للنهاية لغير الناطقين بالعربية، بواجهة FastAPI ' +
      'خلفية ذات بنية طبقية صارمة، ومزوّدات ASR/LLM قابلة للتبديل عبر أنماط ABC والمصنع، ' +
      'ومصادقة JWT بتسجيل دخول آمن زمنيًا وحماية من BOLA، ومراقبة عبر معرّفات ارتباط لكل طلب، ' +
      'وخط استقبال محدود التزامن يتحمّل ذروة الاستخدام الصفّي. واجهة أمامية SPA بجافاسكربت خالصة، ' +
      'وترحيل قاعدة بيانات Postgres عبر Alembic. تم النشر كخدمة Docker على Render مع Supabase ' +
      'لقاعدة البيانات والتخزين، وواجهة أمامية ثابتة على Vercel.',

    toolboxEyebrow: 'الأدوات',
    skillLanguagesLabel: 'لغات البرمجة',
    skillAiLabel: 'الذكاء الاصطناعي / تعلم الآلة',
    skillFrameworksLabel: 'أطر العمل',
    skillDataLabel: 'قواعد البيانات ومخازن المتجهات',

    footerEyebrow: 'تواصل معي',
    footerHeadline: 'لنتحدث.',
  };

  // Cache the original English text the first time we see each element,
  // so switching back to English is exact — not a re-typed guess.
  var EN = {};

  function collectEnglish() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!(key in EN)) EN[key] = el.textContent;
    });
  }

  function currentLang() {
    return document.documentElement.getAttribute('lang') === 'ar' ? 'ar' : 'en';
  }

  function t(key) {
    var lang = currentLang();
    if (lang === 'ar' && AR[key]) return AR[key];
    return EN[key] !== undefined ? EN[key] : key;
  }

  function apply() {
    var lang = currentLang();
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    // The "more projects" toggle swaps its own label depending on state.
    var moreBtn = document.querySelector('.more-btn');
    if (moreBtn) {
      var open = moreBtn.getAttribute('aria-expanded') === 'true';
      var textEl = moreBtn.querySelector('.more-btn__text');
      if (textEl) {
        textEl.setAttribute('data-i18n', open ? 'moreBtnHide' : 'moreBtnShow');
        textEl.textContent = t(open ? 'moreBtnHide' : 'moreBtnShow');
      }
    }
  }

  function setLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode */ }
    apply();
  }

  // Expose for other scripts (more-projects.js uses this).
  window.i18n = { t: t, apply: apply, get lang() { return currentLang(); } };

  class LangToggle extends HTMLElement {
    connectedCallback() {
      collectEnglish();

      this.btn = document.createElement('button');
      this.btn.className = 'icon-btn lang-btn';
      this.btn.type = 'button';
      this.append(this.btn);

      // Restore saved language (English stays the default on first visit).
      var saved = null;
      try { saved = localStorage.getItem(KEY); } catch (e) { /* private mode */ }
      if (saved === 'ar') setLang('ar');

      this.render();
      this.btn.addEventListener('click', this.toggle.bind(this));
    }

    toggle() {
      setLang(currentLang() === 'ar' ? 'en' : 'ar');
      this.render();
    }

    render() {
      var lang = currentLang();
      // Button shows the language you'd switch TO.
      this.btn.textContent = lang === 'ar' ? 'EN' : 'ع';
      var label = lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية';
      this.btn.setAttribute('aria-label', label);
      this.btn.setAttribute('title', label);
    }
  }

  customElements.define('lang-toggle', LangToggle);
})();
