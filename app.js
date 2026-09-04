console.log("CivicGuide UI starting...");

const situationInput = document.getElementById("situation");
const analyzeBtn = document.getElementById("analyzeBtn");

const resultBox = document.getElementById("result");
const scenarioTitle = document.getElementById("scenarioTitle");
const scenarioTag = document.getElementById("scenarioTag");
const explanation = document.getElementById("explanation");
const stepsBox = document.getElementById("steps");
const missingBox = document.getElementById("missing");
const confidenceBox = document.getElementById("confidence");
const humanReviewBox = document.getElementById("humanReview");
const statusBox = document.getElementById("status");


function renderRoadmap(result, source = "CivicGuide") {

    resultBox.classList.remove("hidden");

    scenarioTitle.textContent = result.scenario_title;
    scenarioTag.textContent = result.scenario;

    explanation.textContent = result.explanation;

    stepsBox.innerHTML = "";

    result.steps.forEach((step, index) => {

        const div = document.createElement("div");

        div.className = "step";

        div.textContent = `${index + 1}. ${step}`;

        stepsBox.appendChild(div);

    });


    missingBox.innerHTML = "";

    result.missing_information.forEach(item => {

        const div = document.createElement("div");

        div.className = "step";

        div.textContent = item;

        missingBox.appendChild(div);

    });


    confidenceBox.textContent = result.confidence;


    if (result.human_review) {
        humanReviewBox.classList.remove("hidden");
    } else {
        humanReviewBox.classList.add("hidden");
    }


    statusBox.textContent =
        source === "WebMCP agent"
            ? "🤖 CivicGuide was activated by an AI agent through WebMCP."
            : "✓ CivicGuide analyzed your situation.";
}


window.renderRoadmap = renderRoadmap;


analyzeBtn.addEventListener("click", () => {

    const situation = situationInput.value.trim();

    if (!situation) {

        statusBox.textContent =
            "Please describe your civic problem first.";

        return;
    }


    const result = CivicGuide.buildRoadmap(situation);

    renderRoadmap(result);

});