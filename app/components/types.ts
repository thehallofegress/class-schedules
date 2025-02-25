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
  id: string;
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
}

export interface ContactData {
  id: string;
  contact: ContactInfo;
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

export interface PricingInfo{
  hourlyRates: HourlyRate[];
  specialRates: SpecialRate;
  paymentInfo: PaymentInfo;
}

export interface PricingData {
  id: string;
  pricing: PricingInfo;
  lastUpdated?: string; // Optional timestamp
}

export interface LocationInfo {
  city: string;
  address: string;
  name?: string;
}

export interface LocationData {
  id: string;
  locations: LocationInfo[];
  lastUpdated?: string; // Optional timestamp
}

export type MetadataType = {
  latestFiles: Record<string, string>; // 🔹 Maps original file names to latest uploaded versions
};

// Table names for Supabase
export const TABLES = {
  schedule: "schedule",
  contact: "contact",
  pricing: "pricing",
  locations: "locations",
};
