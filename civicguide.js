console.log("CivicGuide WebMCP starting...");

// ============================================================
// CivicGuide Core Engine
// ============================================================

const CivicGuide = {

    identifyIssue(situation) {

        const text = situation.toLowerCase().trim();

        if (
            text.includes("challan") ||
            text.includes("traffic fine") ||
            text.includes("traffic violation") ||
            text.includes("traffic ticket") ||
            text.includes("red light") ||
            text.includes("signal violation") ||
            text.includes("speeding") ||
            text.includes("wrong parking") ||
            text.includes("parking violation") ||
            text.includes("driving violation")
        ) {
            return {
                category: "traffic_challan",
                title: "Traffic Challan / Dispute"
            };
        }

        if (
            text.includes("start a business") ||
            text.includes("starting a business") ||
            text.includes("small business") ||
            text.includes("open a shop") ||
            text.includes("opening a shop") ||
            text.includes("business registration") ||
            text.includes("business licence") ||
            text.includes("business license") ||
            text.includes("trade licence") ||
            text.includes("trade license") ||
            text.includes("company registration") ||
            text.includes("startup registration")
        ) {
            return {
                category: "small_business",
                title: "Small Business Setup"
            };
        }

        if (
            text.includes("government service") ||
            text.includes("government office") ||
            text.includes("certificate") ||
            text.includes("government document") ||
            text.includes("administrative service") ||
            text.includes("municipal service") ||
            text.includes("government application") ||
            text.includes("birth certificate") ||
            text.includes("death certificate") ||
            text.includes("residence certificate") ||
            text.includes("income certificate") ||
            text.includes("caste certificate")
        ) {
            return {
                category: "government_service",
                title: "Government / Administrative Service"
            };
        }

        return {
            category: "general",
            title: "General Civic Guidance"
        };
    },


    buildRoadmap(situation) {

        const issue = this.identifyIssue(situation);

        let steps = [];
        let missingInformation = [];
        let explanation = "";
        let confidence = "medium";
        let humanReview = false;

        switch (issue.category) {

            case "traffic_challan":

                steps = [
                    "Review the challan details and stated violation.",
                    "Confirm the vehicle, date, location and alleged violation.",
                    "Identify the appropriate authority or dispute mechanism.",
                    "Gather relevant supporting information or evidence.",
                    "Follow the applicable dispute or review procedure."
                ];

                missingInformation = [
                    "Challan number or details",
                    "Date and location of the alleged violation",
                    "Reason for disputing the challan",
                    "Any supporting evidence"
                ];

                explanation =
                    "The situation appears to concern a traffic challan. " +
                    "CivicGuide can help identify the applicable procedure and information needed, " +
                    "but does not make a legal determination about whether the challan is valid.";

                confidence = "medium";
                humanReview = true;

                break;


            case "small_business":

                steps = [
                    "Identify the type and structure of the business.",
                    "Determine the operating location and relevant jurisdiction.",
                    "Identify registrations, licences or permissions that may apply.",
                    "Check the requirements of the relevant authorities.",
                    "Prepare the required documents and complete the applicable procedures."
                ];

                missingInformation = [
                    "Business type",
                    "Business location",
                    "Nature of activities",
                    "Number of employees, if relevant",
                    "Whether the business already operates"
                ];

                explanation =
                    "The situation appears to concern starting or operating a small business. " +
                    "The exact requirements depend on the business activity and jurisdiction.";

                confidence = "medium";
                humanReview = false;

                break;


            case "government_service":

                steps = [
                    "Identify the exact government service or document required.",
                    "Determine the responsible authority.",
                    "Check eligibility and required documents.",
                    "Identify the applicable application procedure.",
                    "Complete the required steps and retain confirmation or reference details."
                ];

                missingInformation = [
                    "Exact service or document required",
                    "Applicant's location",
                    "Relevant personal or procedural circumstances",
                    "Documents already available"
                ];

                explanation =
                    "The situation appears to concern a government or administrative service. " +
                    "More information may be required before a precise procedure can be identified.";

                confidence = "medium";
                humanReview = false;

                break;


            default:

                steps = [
                    "Describe the civic problem in more detail.",
                    "Identify the relevant location or jurisdiction.",
                    "Determine which authority or procedure may apply.",
                    "Gather the information needed to verify the procedure."
                ];

                missingInformation = [
                    "Nature of the problem",
                    "Location or jurisdiction",
                    "Relevant authority or service"
                ];

                explanation =
                    "CivicGuide needs more information before it can identify a specific civic procedure.";

                confidence = "low";
                humanReview = true;
        }

        return {
            scenario: issue.category,
            scenario_title: issue.title,
            situation: situation,
            explanation: explanation,
            steps: steps,
            missing_information: missingInformation,
            confidence: confidence,
            human_review: humanReview
        };
    }

};


// ============================================================
// WebMCP Integration
// ============================================================

if ("modelContext" in document) {

    console.log("WebMCP is available.");


    // --------------------------------------------------------
    // Tool 1 — Identify Civic Issue
    // --------------------------------------------------------

    document.modelContext.registerTool({

        name: "identify_civic_issue",

        title: "Identify Civic Issue",

        description:
            "Identify the type of civic problem a person is facing and determine which CivicGuide scenario is relevant.",

        inputSchema: {

            type: "object",

            properties: {

                situation: {
                    type: "string",
                    description:
                        "A plain-language description of the person's civic problem."
                }

            },

            required: ["situation"]
        },

        execute: async ({ situation }) => {

            const issue = CivicGuide.identifyIssue(situation);

            return {
                category: issue.category,
                title: issue.title,
                situation: situation
            };
        }

    });


    // --------------------------------------------------------
    // Tool 2 — Build Civic Roadmap
    // --------------------------------------------------------

    document.modelContext.registerTool({

        name: "build_civic_roadmap",

        title: "Build Civic Roadmap",

        description:
            "Create a structured civic procedure roadmap showing likely next steps, missing information, confidence and whether human review is appropriate.",

        inputSchema: {

            type: "object",

            properties: {

                situation: {
                    type: "string",
                    description:
                        "A plain-language description of the person's civic problem or administrative need."
                }

            },

            required: ["situation"]
        },

        execute: async ({ situation }) => {

            const result = CivicGuide.buildRoadmap(situation);

            // If a human-facing CivicGuide interface is present,
            // update it when an AI agent invokes this WebMCP tool.
            if (typeof window.renderRoadmap === "function") {
                window.renderRoadmap(result, "WebMCP agent");
            }

            return result;
        }

    });


    console.log("identify_civic_issue registered.");
    console.log("build_civic_roadmap registered.");

} else {

    console.log("WebMCP is NOT available.");

}