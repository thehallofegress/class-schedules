"use client";
import { useState, useEffect } from "react";
import { ContactData, LocationData, PricingData, ScheduleData, TABLES } from "@/app/components/types";
import { supabase } from "@/app/api/supabaseClient";

export const useClassSchedule = () => {
    const [scheduleData, setScheduleData] = useState<ScheduleData>({ id: "", schedule: {}, lastUpdated: undefined });
    const [contactData, setContactData] = useState<ContactData>({ id: "", contact: { zoomInfo: { title: "网课信息", zoomId: "", zoomLink: "" }, teacherInfo: { title: "联系方式", name: "", wechatId: "" }}, lastUpdated: undefined});
    const [pricingData, setPricingData] = useState<PricingData>({id: "", pricing: { hourlyRates: [], specialRates: { dropIn: 0, online: 0, trial: 0 }, paymentInfo: { registration: { title: "新生报名", fee: "", note: "" }, paymentCycle: { title: "付款周期", offline: "", online: "" }, paymentMethods: { title: "支付方式", methods: [] } }}, lastUpdated: undefined });
    const [locationData, setLocationData] = useState<LocationData>({ id: "", locations: [], lastUpdated: undefined });

    const [scheduleLastUpdated, setScheduleLastUpdated] = useState<string | undefined>();
    const [contactLastUpdated, setContactLastUpdated] = useState<string | undefined>();
    const [pricingLastUpdated, setPricingLastUpdated] = useState<string | undefined>();
    const [locationLastUpdated, setLocationLastUpdated] = useState<string | undefined>();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async (forceUpdate = false) => {
        try {
            setIsLoading(true);
            setError(null);
    
            console.log("🔍 Checking lastUpdated timestamps before fetching...");
            // Fetch data from Supabase
            const [scheduleResult, pricingResult, contactResult, locationResult] = await Promise.all([
                supabase.from(TABLES.schedule).select('*').order('id', { ascending: false }).limit(1).single(),
                supabase.from(TABLES.pricing).select('*').order('id', { ascending: false }).limit(1).single(),
                supabase.from(TABLES.contact).select('*').order('id', { ascending: false }).limit(1).single(),
                supabase.from(TABLES.locations).select('*').order('id', { ascending: false }).limit(1).single(),
            ]);
            
            // Check for errors in Supabase responses
            if (scheduleResult.error) throw new Error(`Failed to fetch schedule data: ${scheduleResult.error.message}`);
            if (pricingResult.error) throw new Error(`Failed to fetch pricing data: ${pricingResult.error.message}`);
            if (contactResult.error) throw new Error(`Failed to fetch contact data: ${contactResult.error.message}`);
            if (locationResult.error) throw new Error(`Failed to fetch location data: ${locationResult.error.message}`);
            
            // Extract data from Supabase responses
            const scheduleDataFromDB = scheduleResult.data;
            const pricingDataFromDB = pricingResult.data;
            const contactDataFromDB = contactResult.data;
            const locationDataFromDB = locationResult.data;

            // Always update state on first fetch or if `forceUpdate` is true
            if (!scheduleLastUpdated || forceUpdate || scheduleDataFromDB.lastUpdated !== scheduleLastUpdated) {
                setScheduleData(scheduleDataFromDB);
                setScheduleLastUpdated(scheduleDataFromDB.lastUpdated);
            }
    
            if (!pricingLastUpdated || forceUpdate || pricingDataFromDB.lastUpdated !== pricingLastUpdated) {
                setPricingData(pricingDataFromDB);
                setPricingLastUpdated(pricingDataFromDB.lastUpdated);
            }
    
            if (!contactLastUpdated || forceUpdate || contactDataFromDB.lastUpdated !== contactLastUpdated) {
                setContactData(contactDataFromDB);
                setContactLastUpdated(contactDataFromDB.lastUpdated);
            }
    
            if (!locationLastUpdated || forceUpdate || locationDataFromDB.lastUpdated !== locationLastUpdated) {
                setLocationData(locationDataFromDB);
                setLocationLastUpdated(locationDataFromDB.lastUpdated);
            }
    
        } catch (error) {
            console.error("Fetch error:", error);
            setError("Failed to load class data. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchData(true); // Fetch only once when the component mounts
    }, []); 
    
    return {
        scheduleData,
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
        fetchData,
        isLoading,
        error,
    };
};
