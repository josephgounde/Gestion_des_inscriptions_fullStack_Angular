// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8085/api',
  apiTimeout: 30000,
  maxFileSize: 5242880, // 5MB in bytes
  allowedFileTypes: {
    documents: ['application/pdf'],
    images: ['image/jpeg', 'image/png', 'image/jpg']
  },
  oauth: {
    google: {
      clientId: 'YOUR_GOOGLE_CLIENT_ID'
    },
    microsoft: {
      clientId: 'YOUR_MICROSOFT_CLIENT_ID'
    }
  },
  recaptcha: {
    siteKey: 'YOUR_RECAPTCHA_SITE_KEY'
  },
  features: {
    smsNotifications: true,
    emailNotifications: true,
    ocrValidation: true,
    autoSave: true,
    documentPreview: true
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  }
};

// src/environments/environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'https://api.enrollpro.com/api',
  apiTimeout: 30000,
  maxFileSize: 5242880,
  allowedFileTypes: {
    documents: ['application/pdf'],
    images: ['image/jpeg', 'image/png', 'image/jpg']
  },
  oauth: {
    google: {
      clientId: 'YOUR_PRODUCTION_GOOGLE_CLIENT_ID'
    },
    microsoft: {
      clientId: 'YOUR_PRODUCTION_MICROSOFT_CLIENT_ID'
    }
  },
  recaptcha: {
    siteKey: 'YOUR_PRODUCTION_RECAPTCHA_SITE_KEY'
  },
  features: {
    smsNotifications: true,
    emailNotifications: true,
    ocrValidation: true,
    autoSave: true,
    documentPreview: true
  },
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100]
  }
};