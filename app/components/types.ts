export interface ContactInfo {
  zoomInfo: {
    title: string;
    zoomId: string;
    zoomLink: string;
  };
  teacherInfo: {
    title: string;
    name: string;
    wechatId: string;
  };
}

export interface HourlyRate {
  hours: string;
  rate: number;
}

export interface SpecialRate {
  dropIn: number;
  online: number;
  trial: number;
}

export interface PaymentInfo {
  registration: {
    title: string;
    fee: string;
    note: string;
  };
  paymentCycle: {
    title: string;
    offline: string;
    online: string;
  };
  paymentMethods: {
    title: string;
    methods: string[];
  };
}

export interface PricingData {
  hourlyRates: HourlyRate[];
  paymentInfo: PaymentInfo;
}

export interface Location {
  city: string;
  address: string;
}

export interface LocationData {
  locations: Location[];
}
