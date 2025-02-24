"use client";
import { useState, useEffect } from "react";
import { ContactInfo, LocationData, PricingData, ScheduleData } from "@/app/components/types";

export const useClassSchedule = () => {
  const [scheduleData, setScheduleData] = useState<ScheduleData>({ schedule: {}, lastUpdated: undefined });
  const [contactData, setContactData] = useState<ContactInfo>({ zoomInfo: { title: "网课信息", zoomId: "", zoomLink: "" }, teacherInfo: { title: "老师联系方式", name: "", wechatId: "" }, lastUpdated: undefined });
  const [pricingData, setPricingData] = useState<PricingData>({ hourlyRates: [], specialRates: { dropIn: 0, online: 0, trial: 0 }, paymentInfo: { registration: { title: "新生报名", fee: "", note: "" }, paymentCycle: { title: "付款周期", offline: "", online: "" }, paymentMethods: { title: "支付方式", methods: [] } } , lastUpdated: undefined});
  const [locationData, setLocationData] = useState<LocationData>({ locations: [], lastUpdated: undefined });

  const [scheduleLastUpdated, setScheduleLastUpdated] = useState<string | undefined>();
  const [contactLastUpdated, setContactLastUpdated] = useState<string | undefined>();
  const [pricingLastUpdated, setPricingLastUpdated] = useState<string | undefined>();
  const [locationLastUpdated, setLocationLastUpdated] = useState<string | undefined>();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Function to Fetch Data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

      const [scheduleResponse, priceResponse, contactResponse, locationResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/class-schedule.json?t=${Date.now()}`),
        fetch(`${API_BASE_URL}/class-pricing.json?t=${Date.now()}`),
        fetch(`${API_BASE_URL}/class-contact.json?t=${Date.now()}`),
        fetch(`${API_BASE_URL}/class-locations.json?t=${Date.now()}`),
      ]);

      if (!scheduleResponse.ok) throw new Error("Failed to fetch schedule data");
      if (!priceResponse.ok) throw new Error("Failed to fetch price data");
      if (!contactResponse.ok) throw new Error("Failed to fetch contact data");
      if (!locationResponse.ok) throw new Error("Failed to fetch location data");

      const scheduleData = await scheduleResponse.json();
      setScheduleData(scheduleData);
      setScheduleLastUpdated(scheduleData.lastUpdated);

      const priceData = await priceResponse.json();
      setPricingData(priceData);
      setPricingLastUpdated(priceData.lastUpdated);

      const contactData = await contactResponse.json();
      setContactData(contactData.contact);
      setContactLastUpdated(contactData.lastUpdated);

      const locationData = await locationResponse.json();
      setLocationData(locationData);
      setLocationLastUpdated(locationData.lastUpdated);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load class data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-reload when any `lastUpdated` changes
  useEffect(() => {
    fetchData();
  }, [scheduleLastUpdated, contactLastUpdated, pricingLastUpdated, locationLastUpdated]); // ✅ Triggers re-fetch when any dataset changes

  return {
    schedule: scheduleData.schedule,
    scheduleLastUpdated,
    contactData,
    pricingData,
    locationData,
    setScheduleData,
    setContactData,
    setPricingData,
    setLocationData,
    setScheduleLastUpdated,
    setContactLastUpdated,
    setPricingLastUpdated,
    setLocationLastUpdated,
    isLoading,
    error,
  };
};
