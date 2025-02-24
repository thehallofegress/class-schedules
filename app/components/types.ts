export interface ClassSchedule {
  time: string;
  name: string;
  location: string;
}

export interface DaySchedule {
  [key: string]: ClassSchedule[];
}

export interface ClassType {
  id: string;
  name: string;
}

export interface ScheduleData {
  schedule: DaySchedule;
  lastUpdated?: string; // Optional timestamp
}

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
  lastUpdated?: string; // Optional timestamp
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
  specialRates: SpecialRate;
  paymentInfo: PaymentInfo;
  lastUpdated?: string; // Optional timestamp
}

export interface Location {
  city: string;
  address: string;
  name?: string;
}

export interface LocationData {
  locations: Location[];
  lastUpdated?: string; // Optional timestamp
}
