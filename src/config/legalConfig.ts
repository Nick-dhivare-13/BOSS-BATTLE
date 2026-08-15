export interface LegalConfig {
  appName: string;
  legalOperatorName: string;
  supportEmail: string;
  privacyEmail: string;
  grievanceEmail: string;
  locationAddress: string;
  minimumAge: string;
  minimumAgeNotice: string;
  disclaimerNotice: string;
}

export const LEGAL_CONFIG: LegalConfig = {
  appName: 'Boss Battles',
  legalOperatorName: 'NIKHIL GAUTAM DHIVARE',
  supportEmail: 'bossbattles.support@gmail.com',
  privacyEmail: 'bossbattles.support@gmail.com',
  grievanceEmail: 'bossbattles.support@gmail.com',
  locationAddress: 'Jalgaon, Maharashtra 425001, India',
  minimumAge: '18+',
  minimumAgeNotice: 'Boss Battles is intended for users aged 18 and older.',
  disclaimerNotice:
    'Technical privacy controls implemented; legal/regulatory review of policies, users, jurisdictions, and data practices should be completed prior to production launch. Boss Battles does not claim compliance with specific statutory frameworks without formal legal verification.',
};

export const getMailtoLink = (
  type: 'support' | 'problem' | 'feedback' | 'data_request' | 'data_deletion' | 'grievance'
): string => {
  const email = LEGAL_CONFIG.supportEmail;
  switch (type) {
    case 'support':
      return `mailto:${email}?subject=${encodeURIComponent('Support Request - Boss Battles')}`;
    case 'problem':
      return `mailto:${email}?subject=${encodeURIComponent('Report a Problem - Boss Battles')}`;
    case 'feedback':
      return `mailto:${email}?subject=${encodeURIComponent('User Feedback - Boss Battles')}`;
    case 'data_request':
      return `mailto:${LEGAL_CONFIG.privacyEmail}?subject=${encodeURIComponent('Data Access / Export Request - Boss Battles')}`;
    case 'data_deletion':
      return `mailto:${LEGAL_CONFIG.privacyEmail}?subject=${encodeURIComponent('Account / Data Deletion Request - Boss Battles')}`;
    case 'grievance':
      return `mailto:${LEGAL_CONFIG.grievanceEmail}?subject=${encodeURIComponent('Grievance Officer Communication - Boss Battles')}`;
    default:
      return `mailto:${email}`;
  }
};
