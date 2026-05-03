// =============================================================================
// AIAdvisor — Floating glass tooltip with real-time strategic insights.
// Generates charismatic, agency-grade advice based on dominant archetype.
// Fully multilingual (RU/EN/AR) with instant switching.
// =============================================================================

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useArchetypeEngine } from "../useArchetypeEngine";
import type { ArchetypeId } from "../archetypeWeights";
import { getVisualBenchmark, type LocaleCode } from "../cultureLoader";
import { generateDesignTokens } from "./generateDesignTokens";

// =============================================================================
// ADVISOR MESSAGES — Curated strategic tips per archetype × locale
// =============================================================================

interface AdvisorMessage {
  headline: string;
  body: string;
  tip: string;
}

const ADVISOR_DB: Record<
  ArchetypeId,
  Record<"ru" | "en" | "ar", AdvisorMessage>
> = {
  ruler: {
    ru: {
      headline: "Империя требует архитектуры",
      body: "Ваш бренд звучит как «Правитель». Сайт должен транслировать безупречный контроль: симметрия, иерархия, драгоценные паузы.",
      tip: "Используйте золотые акценты и чёткую модульную сетку. Никакого визуального шума — только статус.",
    },
    en: {
      headline: "An Empire Demands Architecture",
      body: "Your brand resonates as a 'Ruler'. The website must project flawless control: symmetry, hierarchy, precious pauses.",
      tip: "Use gold accents and a strict modular grid. Zero visual noise — pure status.",
    },
    ar: {
      headline: "الإمبراطورية تتطلب هندسة معمارية",
      body: "علامتك التجارية تتناغم مع نمط 'الحاكم'. يجب أن يعكس الموقع تحكماً لا تشوبه شائبة: تناظر، تسلسل هرمي، فترات توقف ثمينة.",
      tip: "استخدم لمسات ذهبية وشبكة نمطية صارمة. لا ضوضاء بصرية — مكانة فقط.",
    },
  },
  creator: {
    ru: {
      headline: "Холст ждёт мастера",
      body: "Ваш бренд — «Творец». Интерфейс должен дышать как мастерская: пространство для эксперимента, неожиданные акценты, живая типографика.",
      tip: "Используйте асимметрию, мягкие тени и градиенты. Дайте пользователю инструменты, а не инструкции.",
    },
    en: {
      headline: "The Canvas Awaits the Master",
      body: "Your brand is a 'Creator'. The interface should breathe like an atelier: room for experiment, unexpected accents, living typography.",
      tip: "Use asymmetry, soft shadows and gradients. Give the user tools, not instructions.",
    },
    ar: {
      headline: "اللوحة تنتظر المبدع",
      body: "علامتك التجارية هي 'المبدع'. يجب أن تتنفس الواجهة مثل المشغل: مساحة للتجريب، لمسات غير متوقعة، طباعة حية.",
      tip: "استخدم عدم التناظر والظلال الناعمة والتدرجات. امنح المستخدم أدوات، لا تعليمات.",
    },
  },
  sage: {
    ru: {
      headline: "Истина в ясности",
      body: "Ваш бренд — «Мудрец». Сайт должен быть кристально чистым: данные, структура, глубина без перегрузки.",
      tip: "Используйте разреженную вёрстку, длинные строки и аналитические визуализации. Меньше украшений — больше смысла.",
    },
    en: {
      headline: "Truth Lies in Clarity",
      body: "Your brand is a 'Sage'. The site must be crystal-clear: data, structure, depth without overload.",
      tip: "Use airy layouts, long line lengths and analytical visualizations. Less decoration — more meaning.",
    },
    ar: {
      headline: "الحقيقة في الوضوح",
      body: "علامتك التجارية هي 'الحكيم'. يجب أن يكون الموقع واضحاً كالبلور: بيانات، هيكل، عمق دون إغراق.",
      tip: "استخدم تخطيطات متجددة الهواء وأسطراً طويلة ورسوماً تحليلية. زخرفة أقل — معنى أكثر.",
    },
  },
  innocent: {
    ru: {
      headline: "Свет возвращается",
      body: "Ваш бренд — «Невинный». Дизайн должен излучать чистоту: пастель, воздух, доверие с первого пикселя.",
      tip: "Используйте много белого пространства, округлые формы и оптимистичные акценты. Никакой агрессии.",
    },
    en: {
      headline: "The Light Returns",
      body: "Your brand is an 'Innocent'. The design must radiate purity: pastels, air, trust from the first pixel.",
      tip: "Use abundant white space, rounded forms and optimistic accents. Zero aggression.",
    },
    ar: {
      headline: "النور يعود",
      body: "علامتك التجارية هي 'البريء'. يجب أن يشع التصميم بالنقاء: باستيل، هواء، ثقة من أول بكسل.",
      tip: "استخدم مساحة بيضاء وفيرة وأشكالاً مدورة ولمسات متفائلة. لا عدوانية.",
    },
  },
  explorer: {
    ru: {
      headline: "Горизонт зовёт",
      body: "Ваш бренд — «Исследователь». Навигация должна быть приключением: нелинейные переходы, карты, ощущение пути.",
      tip: "Используйте интерактивные карты, параллакс-скролл и открытые композиции. Пусть пользователь открывает.",
    },
    en: {
      headline: "The Horizon Calls",
      body: "Your brand is an 'Explorer'. Navigation must be an adventure: non-linear transitions, maps, a sense of journey.",
      tip: "Use interactive maps, parallax scroll and open compositions. Let the user discover.",
    },
    ar: {
      headline: "الأفق ينادي",
      body: "علامتك التجارية هي 'المستكشف'. يجب أن يكون التنقل مغامرة: انتقالات غير خطية، خرائط، إحساس بالرحلة.",
      tip: "استخدم خرائط تفاعلية وتمريراً متعدد الطبقات وتركيبات مفتوحة. دع المستخدم يكتشف.",
    },
  },
  hero: {
    ru: {
      headline: "Время действовать",
      body: "Ваш бренд — «Герой». Каждое взаимодействие должно вести к победе: чёткий путь, мощные CTA, энергия преодоления.",
      tip: "Используйте жирную типографику, контрастные кнопки и линейную навигацию. Ведите пользователя к цели.",
    },
    en: {
      headline: "Time to Act",
      body: "Your brand is a 'Hero'. Every interaction must lead to victory: a clear path, powerful CTAs, the energy of overcoming.",
      tip: "Use bold typography, high-contrast buttons and linear navigation. Lead the user to the goal.",
    },
    ar: {
      headline: "حان وقت الفعل",
      body: "علامتك التجارية هي 'البطل'. يجب أن يؤدي كل تفاعل إلى النصر: مسار واضح، دعوات قوية للإجراء، طاقة التغلب.",
      tip: "استخدم طباعة جريئة وأزراراً عالية التباين وتنقلاً خطياً. قد المستخدم نحو الهدف.",
    },
  },
  magician: {
    ru: {
      headline: "Магия в каждом касании",
      body: "Ваш бренд — «Маг». Интерфейс должен трансформировать реальность: неожиданные переходы, микро-анимации, ощущение чуда.",
      tip: "Используйте morphing-анимации, частицы и градиентные переходы. Каждое нажатие — маленькое волшебство.",
    },
    en: {
      headline: "Magic in Every Touch",
      body: "Your brand is a 'Magician'. The interface must transform reality: unexpected transitions, micro-animations, a sense of wonder.",
      tip: "Use morphing animations, particles and gradient transitions. Every tap is a little magic.",
    },
    ar: {
      headline: "سحر في كل لمسة",
      body: "علامتك التجارية هي 'الساحر'. يجب أن تحول الواجهة الواقع: انتقالات غير متوقعة، رسوم متحركة دقيقة، إحساس بالعجب.",
      tip: "استخدم رسوماً متحولة وجسيمات وانتقالات متدرجة. كل نقرة هي سحر صغير.",
    },
  },
  outlaw: {
    ru: {
      headline: "Правила созданы, чтобы их нарушать",
      body: "Ваш бренд — «Бунтарь». Дизайн должен ломать ожидания: сломанные сетки, резкие контрасты, визуальный протест.",
      tip: "Используйте асимметрию, монохром с ярким акцентом и нестандартную навигацию. Шокируйте — но с интеллектом.",
    },
    en: {
      headline: "Rules Are Made to Be Broken",
      body: "Your brand is an 'Outlaw'. The design must shatter expectations: broken grids, sharp contrasts, visual protest.",
      tip: "Use asymmetry, monochrome with a bright accent and unconventional navigation. Shock — but with intelligence.",
    },
    ar: {
      headline: "القواعد وضعت لتُكسر",
      body: "علامتك التجارية هي 'المتمرد'. يجب أن يحطم التصميم التوقعات: شبكات مكسورة، تباينات حادة، احتجاج بصري.",
      tip: "استخدم عدم التناظر وأحادية اللون مع لمسة مشرقة وتنقلاً غير تقليدي. اصدم — لكن بذكاء.",
    },
  },
  jester: {
    ru: {
      headline: "Серьёзно — это скучно",
      body: "Ваш бренд — «Шут». Сайт должен играть с пользователем: неожиданные Easter eggs, игривая типографика, живой ритм.",
      tip: "Используйте яркие акценты, упругие анимации и интерактивные сюрпризы. Улыбка — ваша конверсия.",
    },
    en: {
      headline: "Serious Is Boring",
      body: "Your brand is a 'Jester'. The site must play with the user: unexpected Easter eggs, playful typography, living rhythm.",
      tip: "Use bright accents, bouncy animations and interactive surprises. The smile is your conversion.",
    },
    ar: {
      headline: "الجدية مملة",
      body: "علامتك التجارية هي 'المهرج'. يجب أن يلعب الموقع مع المستخدم: بيض عيد الفصح غير متوقع، طباعة مرحة، إيقاع حي.",
      tip: "استخدم لمسات مشرقة ورسوماً نطاطة ومفاجآت تفاعلية. الابتسامة هي تحويلك.",
    },
  },
  lover: {
    ru: {
      headline: "Красота в деталях",
      body: "Ваш бренд — «Любовник». Дизайн должен соблазнять: чувственные кривые, богатые текстуры, интимная типографика.",
      tip: "Используйте мягкие градиенты, засечные шрифты и тактильные hover-эффекты. Создайте желание прикоснуться.",
    },
    en: {
      headline: "Beauty Is in the Details",
      body: "Your brand is a 'Lover'. The design must seduce: sensual curves, rich textures, intimate typography.",
      tip: "Use soft gradients, serif fonts and tactile hover effects. Create a desire to touch.",
    },
    ar: {
      headline: "الجمال في التفاصيل",
      body: "علامتك التجارية هي 'العاشق'. يجب أن يغوي التصميم: منحنيات حسية، أنسجة غنية، طباعة حميمية.",
      tip: "استخدم تدرجات ناعمة وخطوطاً serif وتأثيرات hover حسية. اصنع رغبة في اللمس.",
    },
  },
  caregiver: {
    ru: {
      headline: "Пространство доверия",
      body: "Ваш бренд — «Заботливый». Сайт должен обнимать пользователя: тепло, безопасность, интуитивная доступность.",
      tip: "Используйте тёплые тона, крупные кликабельные зоны и поддерживающие микро-тексты. Пользователь должен чувствовать себя в безопасности.",
    },
    en: {
      headline: "A Space of Trust",
      body: "Your brand is a 'Caregiver'. The site must embrace the user: warmth, safety, intuitive accessibility.",
      tip: "Use warm tones, large clickable areas and supportive micro-copy. The user must feel safe.",
    },
    ar: {
      headline: "مساحة من الثقة",
      body: "علامتك التجارية هي 'الراعي'. يجب أن يحتضن الموقع المستخدم: دفء، أمان، سهولة وصول بديهية.",
      tip: "استخدم نغمات دافئة ومناطق نقر كبيرة ونصوصاً مصغرة داعمة. يجب أن يشعر المستخدم بالأمان.",
    },
  },
  everyman: {
    ru: {
      headline: "Свой среди своих",
      body: "Ваш бренд — «Свой человек». Дизайн должен быть честным: никаких уловок, прямой язык, надёжная типографика.",
      tip: "Используйте нейтральные тона, читаемые шрифты и предсказуемую навигацию. Будьте теми, кому доверяют.",
    },
    en: {
      headline: "One of Us",
      body: "Your brand is an 'Everyman'. The design must be honest: no tricks, direct language, reliable typography.",
      tip: "Use neutral tones, readable fonts and predictable navigation. Be the one people trust.",
    },
    ar: {
      headline: "واحد منا",
      body: "علامتك التجارية هي 'الإنسان العادي'. يجب أن يكون التصميم صادقاً: لا حيل، لغة مباشرة، طباعة موثوقة.",
      tip: "استخدم نغمات محايدة وخطوطاً مقروءة وتنقلاً متوقعاً. كن الشخص الذي يثق به الناس.",
    },
  },
};

// =============================================================================
// COMPONENT
// =============================================================================

export const AIAdvisor: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const {
    dominantArchetype,
    secondaryArchetype,
    normalizedScores,
    uiTheme,
    locale,
    direction,
  } = useArchetypeEngine();

  // Generate design tokens
  const tokens = useMemo(() => {
    if (!dominantArchetype) return null;
    return generateDesignTokens(
      dominantArchetype as any,
      secondaryArchetype as any,
      uiTheme,
      direction as "ltr" | "rtl",
    );
  }, [dominantArchetype, secondaryArchetype, uiTheme, direction]);

  // Get advisor message
  const message = useMemo(() => {
    if (!dominantArchetype) return null;
    const archetypeMessages = ADVISOR_DB[dominantArchetype as ArchetypeId];
    return (
      archetypeMessages?.[locale as "ru" | "en" | "ar"] ?? archetypeMessages?.en
    );
  }, [dominantArchetype, locale]);

  const harmonyScore = dominantArchetype
    ? Math.round((normalizedScores as any)[dominantArchetype] ?? 0)
    : 0;

  if (!message || !dominantArchetype || !tokens) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className={`bg-white/35 backdrop-blur-xl border border-white/40 rounded-2xl p-5 space-y-4
        shadow-[0_8px_32px_rgba(0,0,0,0.03),inset_0_0.5px_0_rgba(255,255,255,0.6)]
        ${className}`}
    >
      {/* Headline + Harmony badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-slate-700 leading-snug">
          {message.headline}
        </h3>
        <span className="flex-shrink-0 text-[10px] font-medium px-2 py-1 rounded-full bg-white/50 text-slate-500 border border-white/40">
          {harmonyScore}% match
        </span>
      </div>

      {/* Strategic body */}
      <p className="text-[13px] text-slate-500 leading-relaxed">
        {message.body}
      </p>

      {/* Practical tip */}
      <div className="bg-white/40 rounded-xl p-3 border border-white/30">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
          {locale === "ru" ? "Совет" : locale === "ar" ? "نصيحة" : "Tip"}
        </div>
        <p className="text-[12px] text-slate-600 leading-relaxed">
          {message.tip}
        </p>
      </div>

      {/* Cultural insight — key difference per locale */}
      {(() => {
        const benchmark = getVisualBenchmark(dominantArchetype, locale as LocaleCode);
        if (!benchmark) return null;
        return (
          <div className="bg-white/20 rounded-xl p-3 border border-white/20">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
              {locale === "ru" ? "Культурный контекст" : locale === "ar" ? "السياق الثقافي" : "Cultural Context"}
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              {benchmark.key_difference}
            </p>
          </div>
        );
      })()}
      {/* Design token chips */}
      <div className="space-y-2 pt-1">
        <div className="text-[10px] text-slate-400 uppercase tracking-wider">
          {locale === "ru"
            ? "Дизайн-токены"
            : locale === "ar"
              ? "رموز التصميم"
              : "Design Tokens"}
        </div>

        {/* Color dots */}
        <div className="flex gap-2 flex-wrap">
          {(
            [
              { label: "P", hex: tokens.palette.primary.hex },
              { label: "S", hex: tokens.palette.secondary.hex },
              { label: "A", hex: tokens.palette.accent.hex },
              { label: "L", hex: tokens.palette.neutralLight.hex },
              { label: "D", hex: tokens.palette.neutralDark.hex },
            ] as const
          ).map(({ label, hex }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                style={{ backgroundColor: hex }}
              />
              <span className="text-[10px] text-slate-500 font-medium">
                {label}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {hex}
              </span>
            </div>
          ))}
        </div>

        {/* Font + spacing */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="bg-white/30 rounded-lg px-3 py-2">
            <span className="text-slate-400">Font</span>
            <span className="ml-2 text-slate-600 font-medium">
              {tokens.typography.heading}
            </span>
          </div>
          <div className="bg-white/30 rounded-lg px-3 py-2">
            <span className="text-slate-400">Radius</span>
            <span className="ml-2 text-slate-600 font-medium tabular-nums">
              {tokens.ui.borderRadius.lg}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
