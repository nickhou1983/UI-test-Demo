import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';

interface Props {
  keyword: string;
  region: string;
  type: string;
  onKeywordChange: (v: string) => void;
  onRegionChange: (v: string) => void;
  onTypeChange: (v: string) => void;
}

const regions = ['asia', 'europe', 'north-america', 'south-america', 'africa', 'oceania'];
const types = ['beach', 'mountain', 'city', 'culture'];

export default function FilterBar({ keyword, region, type, onKeywordChange, onRegionChange, onTypeChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <SearchBar value={keyword} onChange={onKeywordChange} placeholder={t('destinations.search')} />
      </div>
      <select
        value={region}
        onChange={(e) => onRegionChange(e.target.value)}
        aria-label={t('destinations.region')}
        className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none"
      >
        <option value="">{t('destinations.region')}</option>
        {regions.map((r) => (
          <option key={r} value={r}>{t(`filter.${r}`)}</option>
        ))}
      </select>
      <select
        value={type}
        onChange={(e) => onTypeChange(e.target.value)}
        aria-label={t('destinations.type')}
        className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none"
      >
        <option value="">{t('destinations.type')}</option>
        {types.map((tp) => (
          <option key={tp} value={tp}>{t(`filter.${tp}`)}</option>
        ))}
      </select>
    </div>
  );
}
