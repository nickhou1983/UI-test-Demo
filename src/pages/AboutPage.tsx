import { useTranslation } from 'react-i18next';
import { teamMembers } from '../data/team';
import { assetUrl } from '../utils/assetUrl';

export default function AboutPage() {
  const { t } = useTranslation();

  const values = [
    { emoji: '🌍', titleKey: 'about.value1.title', descKey: 'about.value1.desc' },
    { emoji: '✨', titleKey: 'about.value2.title', descKey: 'about.value2.desc' },
    { emoji: '❤️', titleKey: 'about.value3.title', descKey: 'about.value3.desc' },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
        <img
          src={assetUrl('images/hero/hero-main.jpg')}
          alt="About"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('about.title')}</h1>
          <p className="text-orange-100 text-lg">{t('about.subtitle')}</p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-orange-800 mb-6">{t('about.mission')}</h2>
        <p className="text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">{t('about.mission.text')}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.titleKey} className="bg-white rounded-xl shadow-md p-8">
              <div className="text-4xl mb-4">{v.emoji}</div>
              <h3 className="font-bold text-orange-800 text-lg mb-2">{t(v.titleKey)}</h3>
              <p className="text-slate-500 text-sm">{t(v.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-orange-800 text-center mb-10">{t('about.team')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((m) => (
              <div key={m.nameKey} className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 bg-gradient-to-br from-orange-400 to-emerald-400 flex items-center justify-center">
                  <span className="text-4xl text-white">👤</span>
                </div>
                <h3 className="font-bold text-orange-800">{t(m.nameKey)}</h3>
                <p className="text-emerald-600 text-sm">{t(m.titleKey)}</p>
                <p className="text-slate-400 text-xs mt-1">{t(m.bioKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-orange-800 mb-4">{t('about.contact')}</h2>
        <p className="text-slate-600 mb-4">{t('about.contact.text')}</p>
        <a href={`mailto:${t('about.email')}`} className="text-orange-600 hover:text-orange-800 font-medium text-lg">
          {t('about.email')}
        </a>
      </section>
    </main>
  );
}
