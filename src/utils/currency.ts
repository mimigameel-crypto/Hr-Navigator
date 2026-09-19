import { Currency, Language } from '../types';

export interface CurrencyConfig {
  code: Currency;
  nameAr: string;
  nameEn: string;
  symbolAr: string;
  symbolEn: string;
  flag: string;
  rateFromSAR: number; // 1 SAR = X in this currency
  decimals: number;
  region: 'gcc' | 'international';
}

export const ALL_CURRENCIES: Currency[] = [
  'SAR', // السعودية
  'AED', // الإمارات
  'KWD', // الكويت
  'QAR', // قطر
  'BHD', // البحرين
  'OMR', // عمان
  'USD', // الدولار
  'EGP'  // مصر
];

export const GCC_CURRENCIES: Currency[] = ['SAR', 'AED', 'KWD', 'QAR', 'BHD', 'OMR'];

export const currencies: Record<Currency, CurrencyConfig> = {
  SAR: {
    code: 'SAR',
    nameAr: 'ريال سعودي',
    nameEn: 'Saudi Riyal',
    symbolAr: 'ر.س',
    symbolEn: 'SAR',
    flag: '🇸🇦',
    rateFromSAR: 1.0,
    decimals: 0,
    region: 'gcc'
  },
  AED: {
    code: 'AED',
    nameAr: 'درهم إماراتي',
    nameEn: 'UAE Dirham',
    symbolAr: 'د.إ',
    symbolEn: 'AED',
    flag: '🇦🇪',
    rateFromSAR: 0.9793, // 1 SAR ≈ 0.9793 AED
    decimals: 0,
    region: 'gcc'
  },
  KWD: {
    code: 'KWD',
    nameAr: 'دينار كويتي',
    nameEn: 'Kuwaiti Dinar',
    symbolAr: 'د.ك',
    symbolEn: 'KWD',
    flag: '🇰🇼',
    rateFromSAR: 0.0818, // 1 SAR ≈ 0.0818 KWD
    decimals: 1,
    region: 'gcc'
  },
  QAR: {
    code: 'QAR',
    nameAr: 'ريال قطري',
    nameEn: 'Qatari Riyal',
    symbolAr: 'ر.ق',
    symbolEn: 'QAR',
    flag: '🇶🇦',
    rateFromSAR: 0.9707, // 1 SAR ≈ 0.9707 QAR
    decimals: 0,
    region: 'gcc'
  },
  BHD: {
    code: 'BHD',
    nameAr: 'دينار بحريني',
    nameEn: 'Bahraini Dinar',
    symbolAr: 'د.ب',
    symbolEn: 'BHD',
    flag: '🇧🇭',
    rateFromSAR: 0.1003, // 1 SAR ≈ 0.1003 BHD
    decimals: 1,
    region: 'gcc'
  },
  OMR: {
    code: 'OMR',
    nameAr: 'ريال عماني',
    nameEn: 'Omani Rial',
    symbolAr: 'ر.ع',
    symbolEn: 'OMR',
    flag: '🇴🇲',
    rateFromSAR: 0.1025, // 1 SAR ≈ 0.1025 OMR
    decimals: 1,
    region: 'gcc'
  },
  USD: {
    code: 'USD',
    nameAr: 'دولار أمريكي',
    nameEn: 'US Dollar',
    symbolAr: '$',
    symbolEn: '$',
    flag: '🇺🇸',
    rateFromSAR: 0.2667, // 1 SAR ≈ 0.2667 USD
    decimals: 0,
    region: 'international'
  },
  EGP: {
    code: 'EGP',
    nameAr: 'جنيه مصري',
    nameEn: 'Egyptian Pound',
    symbolAr: 'ج.م',
    symbolEn: 'EGP',
    flag: '🇪🇬',
    rateFromSAR: 13.20, // 1 SAR ≈ 13.20 EGP
    decimals: 0,
    region: 'international'
  }
};

export const convertFromSAR = (amountInSAR: number, targetCurrency: Currency): number => {
  const config = currencies[targetCurrency] || currencies.SAR;
  const converted = amountInSAR * config.rateFromSAR;
  if (config.decimals === 0) {
    return Math.round(converted);
  }
  return Number(converted.toFixed(config.decimals));
};

export const formatCurrencyValue = (
  amountInSAR: number,
  currency: Currency,
  lang: Language = 'ar',
  exactPriceOverride?: number
): { value: number; formatted: string; symbol: string; displayWithSymbol: string } => {
  const config = currencies[currency] || currencies.SAR;
  const value = exactPriceOverride !== undefined ? exactPriceOverride : convertFromSAR(amountInSAR, currency);
  const symbol = lang === 'ar' ? config.symbolAr : config.symbolEn;
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';

  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals
  }).format(value);

  const displayWithSymbol = lang === 'ar' 
    ? `${formatted} ${symbol}` 
    : `${symbol} ${formatted}`;

  return {
    value,
    formatted,
    symbol,
    displayWithSymbol
  };
};

export const getServiceDisplayPrice = (
  service: { price: number; exactPrices?: Partial<Record<Currency, number>> },
  currency: Currency,
  lang: Language = 'ar'
) => {
  const exact = service.exactPrices?.[currency];
  return formatCurrencyValue(service.price, currency, lang, exact);
};

export const getServiceOriginalDisplayPrice = (
  service: { originalPrice?: number; exactOriginalPrices?: Partial<Record<Currency, number>> },
  currency: Currency,
  lang: Language = 'ar'
) => {
  if (!service.originalPrice && !service.exactOriginalPrices) return null;
  const exact = service.exactOriginalPrices?.[currency];
  const base = service.originalPrice || 0;
  return formatCurrencyValue(base, currency, lang, exact);
};
