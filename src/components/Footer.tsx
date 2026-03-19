import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-orange-900 text-orange-100 py-12">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">{t('footer.brand')}</h3>
          <p className="text-orange-300 text-sm">{t('footer.desc')}</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">{t('footer.links')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-emerald-300 transition">{t('nav.home')}</Link></li>
            <li><Link to="/destinations" className="hover:text-emerald-300 transition">{t('nav.destinations')}</Link></li>
            <li><Link to="/about" className="hover:text-emerald-300 transition">{t('nav.about')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">{t('footer.social')}</h4>
          <div className="flex space-x-6 text-sm">
            <span className="hover:text-emerald-300 cursor-pointer transition">{t('footer.social.weibo')}</span>
            <span className="hover:text-emerald-300 cursor-pointer transition">{t('footer.social.wechat')}</span>
            <span className="hover:text-emerald-300 cursor-pointer transition">{t('footer.social.instagram')}</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-orange-800 text-center text-orange-400 text-sm">
        {t('footer.copyright')}
      </div>
    </footer>
  );
}
