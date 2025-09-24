import { inngest } from "@/lib/inngest/client";
import { generateIndustryInsights } from "@/lib/inngest/functions";
import {serve}  from "inngest/next";


//create an api that serves 0 functions
export const{GET,POST,PUT}= serve({
    client:inngest,
    functions:[

        /*your functions will be passed here later! */
        generateIndustryInsights,
    ],
});
