import { ResultResponseData } from "@type/api/common";

export type getMemberInfoYouthResponse= ResultResponseData<{
        wakeUpTime: string;
        sleepTime: string;
        breakfast: string;
        lunch: string;
        dinner: string;
        outgoingTime: string;
        wakeUpAlarm: boolean;
        sleepAlarm: boolean;
        breakfastAlarm: boolean;
        lunchAlarm: boolean;
        dinnerAlarm: boolean;
        outgoingAlarm: boolean;
    }>