# Freight Insights Hub

Build a premium, modern, highly polished web application called "FreightIQ".

FreightIQ is an AI-powered maritime freight intelligence and decision-support platform designed to help companies make smarter decisions for bulk cargo chartering and procurement, particularly for cargo transported from overseas ports to ports on the East Coast of India.

The platform should help users analyze freight market uncertainty, forecast likely freight rates, evaluate voyage feasibility, compare vessel and charter options, and make data-driven recommendations.

This is a Smart India Hackathon project, so the product should look innovative, technically sophisticated, realistic, and presentation-ready.

IMPORTANT:

This should initially be a frontend-focused application using realistic mock/demo data. Structure the application cleanly so real backend APIs and machine learning predictions can later be connected easily.

==================================================

PRODUCT NAME AND BRANDING

==================================================

Product Name:

FreightIQ

Tagline:

"Intelligence for Smarter Maritime Decisions"

Alternative supporting line:

"Forecast. Evaluate. Charter with Confidence."

The branding should feel:

- Premium

- Intelligent

- Professional

- Maritime

- Data-driven

- Enterprise-grade

- Modern AI platform

Avoid making it look like a generic college project or basic dashboard.

==================================================

CORE PROBLEM BEING SOLVED

==================================================

Bulk cargo chartering decisions involve significant uncertainty.

Companies need to decide:

- Which vessel should be selected?

- Which charter type is suitable?

- Which origin and destination ports are feasible?

- What freight rate is likely?

- Is the current market favorable for chartering?

- What is the estimated total voyage cost?

- Which option provides the best economic value?

- How confident is the prediction?

- What risks could affect the voyage?

FreightIQ brings relevant information together into one intelligent decision-support platform.

The system should focus initially on a limited number of major ports and a few major bulk cargo categories for the prototype.

Example cargo categories:

- Coal

- Iron Ore

- Steel / Bulk Steel Products

Example destination region:

Major ports on the East Coast of India.

Use realistic demo examples but clearly label all data as "Demo Data" or "Simulated" where appropriate.

==================================================

MAIN APPLICATION STRUCTURE

==================================================

Create a full multi-page web application with the following main sections:

1. Dashboard

2. Freight Forecast

3. Voyage Planner

4. Vessel Feasibility

5. Market Intelligence

6. Recommendations

7. Data & Analytics

8. Settings

Use a left sidebar navigation on desktop.

The application should feel like a professional enterprise intelligence platform similar to modern financial analytics, logistics intelligence, or AI decision-support software.

==================================================

DESIGN DIRECTION

==================================================

Overall style:

Dark premium interface.

Use:

- Deep navy / near-black background

- Subtle blue accents

- Cyan highlights

- White and muted gray typography

- Green for positive trends

- Amber/orange for warnings

- Red only for critical risk indicators

Do NOT make the interface overly colorful.

The UI should feel clean, focused and sophisticated.

Use:

- Rounded cards

- Subtle borders

- Soft shadows

- Smooth hover effects

- Modern charts

- Data tables

- Minimal but meaningful icons

- Generous spacing

- Strong typography hierarchy

Use a modern sans-serif font.

The interface must be fully responsive.

==================================================

GLOBAL LAYOUT

==================================================

Create a persistent left sidebar.

Sidebar branding:

FreightIQ

Include a subtle maritime/intelligence-inspired logo mark.

Navigation:

Dashboard

Freight Forecast

Voyage Planner

Vessel Feasibility

Market Intelligence

Recommendations

Data & Analytics

At the bottom:

Settings

Help / Documentation

Top navigation bar should include:

- Global search

- Notification icon

- "Demo Mode" indicator

- User profile/avatar

Add a subtle status indicator showing:

AI Engine: Online

This should be purely visual for now.

==================================================

PAGE 1 — DASHBOARD

==================================================

Create a powerful executive dashboard.

Top header:

"Good Evening"

Main heading:

Maritime Freight Intelligence

Subheading:

Monitor market conditions, analyze voyage economics, and make smarter chartering decisions.

At the top, show four important KPI cards:

1. Freight Market Index

Example:

Baltic Freight Indicator

2,184

+4.8% from previous period

2. Forecasted Route Rate

Example:

Australia → India

$24.6 / MT

Forecast for next period

3. Market Volatility

Example:

Moderate

Show visual risk level

4. Recommendation Confidence

Example:

87%

High Confidence

Below this, create a large chart:

"Freight Market Trend & Forecast"

Show:

- Historical freight rate line

- Forecasted continuation

- Shaded confidence interval

The forecasted area should visually differ from historical data.

Include a legend:

Historical

Forecast

Confidence Range

Add a time filter:

7 Days

30 Days

90 Days

1 Year

On the right side, add a card:

"AI Market Insight"

Example insight:

"Freight rates are showing moderate upward momentum. Based on current market signals, delaying chartering may increase expected voyage cost."

Below this:

"Active Market Signals"

Show small cards such as:

- Demand Rising

- Port Congestion Moderate

- Fuel Cost Increasing

- Vessel Availability Stable

Use icons and risk indicators.

==================================================

PAGE 2 — FREIGHT FORECAST

==================================================

This is one of the most important pages.

Heading:

Freight Rate Forecasting

Subheading:

Analyze historical trends and AI-generated freight rate projections.

Create a large input panel where the user can select:

Cargo Type

Dropdown:

- Coal

- Iron Ore

- Steel Products

Origin Port

Example options:

- Newcastle

- Richards Bay

- Port Hedland

Destination Port

Example East Coast India options:

- Paradip

- Visakhapatnam

- Haldia

- Chennai

Vessel Category

Options:

- Handysize

- Supramax

- Panamax

- Capesize

Forecast Horizon:

- 7 Days

- 30 Days

- 90 Days

Primary CTA button:

Generate AI Forecast

When clicked, simulate a loading state and then show forecast results.

Results should include:

Predicted Freight Rate

Example:

$24.60 / MT

Expected Range:

$22.80 – $26.90 / MT

Prediction Confidence:

87%

Market Direction:

Moderately Bullish

Expected Change:

+5.2%

Below this, display a premium chart showing:

Historical freight rates

Forecasted rates

Upper confidence band

Lower confidence band

Include tooltips and interactive hover states.

Also include:

"Key Forecast Drivers"

Example cards:

Fuel Prices

High Impact

Port Congestion

Medium Impact

Seasonal Demand

High Impact

Vessel Availability

Medium Impact

Add an "AI Explanation" section:

Example:

"The forecast indicates moderate upward pressure on freight rates driven primarily by increasing bulk cargo demand and stable vessel availability. The projected confidence range reflects uncertainty associated with fuel price fluctuations and port congestion."

Make this section look like an AI-generated explanation.

==================================================

PAGE 3 — VOYAGE PLANNER

==================================================

Heading:

Voyage Intelligence

Subheading:

Evaluate the operational and economic feasibility of a proposed maritime voyage.

Create a voyage configuration form.

Fields:

Cargo Type

Cargo Quantity in MT

Origin Port

Destination Port

Vessel Type

Estimated Vessel Speed

Fuel Cost

Laytime / Port Time

CTA:

Analyze Voyage

Show results in an elegant summary dashboard.

Key metrics:

Estimated Distance

Example:

5,420 NM

Estimated Voyage Duration

Example:

24.6 Days

Estimated Fuel Consumption

Example:

1,180 MT

Estimated Voyage Cost

Example:

$1.84M

Estimated Freight Cost Per MT

Example:

$24.60

Below this show:

Voyage Route Visualization

Use a stylized map-like visual representation.

Do not require an actual mapping API initially.

Show:

Origin

→ Ocean Route

→ Destination

Use animated or subtle visual route lines.

Also show a timeline:

Port Departure

Transit

Port Arrival

==================================================

PAGE 4 — VESSEL FEASIBILITY

==================================================

Heading:

Vessel Feasibility Analysis

Subheading:

Evaluate whether a vessel is operationally and economically suitable for the selected cargo and voyage.

Allow user to select or enter:

Vessel Type

Deadweight Tonnage

Draft

Cargo Capacity

Origin Port

Destination Port

Cargo Quantity

Show a large:

Feasibility Score

Example:

92 / 100

Label:

Highly Suitable

Break down the analysis into:

Cargo Capacity

PASS

Draft Compatibility

PASS

Port Compatibility

PASS

Estimated Voyage Economics

GOOD

Operational Risk

LOW

Create a visual score breakdown using progress bars or radial indicators.

Include:

"Potential Constraints"

Example:

- Destination berth draft should be verified

- Seasonal port congestion may affect arrival time

Include an:

"AI Recommendation"

Example:

"Panamax-class vessels provide the strongest balance between cargo capacity, port accessibility, and projected voyage economics for this route."

==================================================

PAGE 5 — MARKET INTELLIGENCE

==================================================

Heading:

Market Intelligence

Create a professional market monitoring dashboard.

Sections:

Freight Rates

Fuel Prices

Port Congestion

Vessel Availability

Cargo Demand

Use charts and indicators.

Create a "Market Heatmap" showing routes and market conditions.

Example columns:

Route

Current Rate

7-Day Change

30-Day Trend

Volatility

Signal

Example rows:

Australia → Paradip

South Africa → Visakhapatnam

Australia → Haldia

Signals:

Bullish

Neutral

Bearish

Use subtle colored indicators.

Add a section:

"Latest Market Signals"

Use demo information cards.

Example:

Rising Demand

High

Fuel Cost Pressure

Medium

Port Congestion

Moderate

Vessel Supply

Stable

==================================================

PAGE 6 — RECOMMENDATIONS

==================================================

This page should feel like the intelligence center of the product.

Heading:

AI Decision Recommendations

Subheading:

Compare available options and identify the most favorable chartering strategy.

Show 3–4 recommended scenarios.

Example:

OPTION A

Coal

Newcastle → Paradip

Panamax

Projected Cost:

$1.84M

Risk:

Low

Forecast Confidence:

87%

Overall Score:

92 / 100

Recommended

OPTION B

Coal

Richards Bay → Paradip

Supramax

Projected Cost:

$1.91M

Risk:

Medium

Forecast Confidence:

81%

Overall Score:

84 / 100

OPTION C

Another scenario.

Highlight the best option visually.

Create a comparison table.

Columns:

Option

Route

Vessel

Estimated Cost

Freight Rate

Risk

Confidence

Score

At the top, show an AI recommendation card:

"Recommended Strategy"

Example:

"Proceed with Option A. Current analysis indicates the strongest balance between projected freight cost, vessel feasibility, and market risk."

Add:

Why this recommendation?

Use 3–4 explainable factors.

Example:

✓ Lower projected freight cost

✓ High vessel compatibility

✓ Low operational risk

✓ Strong prediction confidence

==================================================

PAGE 7 — DATA & ANALYTICS

==================================================

Create a data-focused page.

Heading:

Data & Analytics

Show tabs:

Freight Data

Port Data

Vessel Data

Market Signals

Include professional data tables.

Columns could include:

Date

Route

Cargo

Vessel Type

Freight Rate

Fuel Price

Port Condition

Include:

Search

Filters

Date range

Export button

Use realistic mock data.

Make it clear that this is structured so APIs can later populate these tables.

==================================================

AI / BACKEND INTEGRATION READINESS

==================================================

IMPORTANT:

Structure the frontend so backend APIs can later be integrated easily.

Create reusable data/service patterns.

Do not hard-code everything directly inside UI components.

Use clearly separated mock data and service layers where appropriate.

Prepare conceptual API integration points such as:

GET /market-data

POST /forecast

POST /voyage-analysis

POST /vessel-feasibility

POST /recommendations

These endpoints do not need to actually work yet.

Use mock responses so the UI behaves realistically.

The frontend should be easy for a backend developer to connect later.

==================================================

LOADING AND INTERACTION STATES

==================================================

When users click buttons such as:

Generate AI Forecast

Analyze Voyage

Evaluate Vessel

Generate Recommendations

Show a premium AI analysis loading experience.

For example:

"Analyzing Market Signals..."

"Processing Historical Freight Data..."

"Evaluating Vessel Constraints..."

"Generating Recommendation..."

Use subtle animated loading indicators.

After a short simulated delay, reveal the analysis.

==================================================

IMPORTANT DATA DISCLAIMERS

==================================================

Since this is currently a prototype:

Add subtle indicators where appropriate:

Demo Data

Simulated Forecast

Prototype Analysis

Do not overuse these labels.

The product should still feel realistic and presentation-ready.

==================================================

TECHNICAL REQUIREMENTS

==================================================

Use a modern React-based frontend.

Create reusable components.

Maintain clean architecture.

Use responsive design.

Use modern charts and visualization components.

Use icons consistently.

Avoid placeholder-looking UI.

Avoid excessive gradients.

Avoid giant blocks of text.

Do not make every card identical.

Prioritize a polished, professional hierarchy.

The final product should feel like a real maritime intelligence SaaS platform that could be demonstrated to industry experts and Smart India Hackathon judges.

==================================================

MOST IMPORTANT EXPERIENCE

==================================================

When someone opens FreightIQ, they should immediately understand:

"This platform helps organizations predict freight costs, evaluate vessel and voyage feasibility, understand market uncertainty, and make smarter bulk cargo chartering decisions."

The application should look sophisticated enough to make the AI, backend, and data components feel like parts of one unified intelligent platform.

Start by building the complete frontend experience with realistic mock data and working navigation between all pages.Build a premium, modern, highly polished web application called "FreightIQ".

FreightIQ is an AI-powered maritime freight intelligence and decision-support platform designed to help companies make smarter decisions for bulk cargo chartering and procurement, particularly for cargo transported from overseas ports to ports on the East Coast of India.

The platform should help users analyze freight market uncertainty, forecast likely freight rates, evaluate voyage feasibility, compare vessel and charter options, and make data-driven recommendations.

This is a Smart India Hackathon project, so the product should look innovative, technically sophisticated, realistic, and presentation-ready.

IMPORTANT:

This should initially be a frontend-focused application using realistic mock/demo data. Structure the application cleanly so real backend APIs and machine learning predictions can later be connected easily.

==================================================

PRODUCT NAME AND BRANDING

==================================================

Product Name:

FreightIQ

Tagline:

"Intelligence for Smarter Maritime Decisions"

Alternative supporting line:

"Forecast. Evaluate. Charter with Confidence."

The branding should feel:

- Premium

- Intelligent

- Professional

- Maritime

- Data-driven

- Enterprise-grade

- Modern AI platform

Avoid making it look like a generic college project or basic dashboard.

==================================================

CORE PROBLEM BEING SOLVED

==================================================

Bulk cargo chartering decisions involve significant uncertainty.

Companies need to decide:

- Which vessel should be selected?

- Which charter type is suitable?

- Which origin and destination ports are feasible?

- What freight rate is likely?

- Is the current market favorable for chartering?

- What is the estimated total voyage cost?

- Which option provides the best economic value?

- How confident is the prediction?

- What risks could affect the voyage?

FreightIQ brings relevant information together into one intelligent decision-support platform.

The system should focus initially on a limited number of major ports and a few major bulk cargo categories for the prototype.

Example cargo categories:

- Coal

- Iron Ore

- Steel / Bulk Steel Products

Example destination region:

Major ports on the East Coast of India.

Use realistic demo examples but clearly label all data as "Demo Data" or "Simulated" where appropriate.

==================================================

MAIN APPLICATION STRUCTURE

==================================================

Create a full multi-page web application with the following main sections:

1. Dashboard

2. Freight Forecast

3. Voyage Planner

4. Vessel Feasibility

5. Market Intelligence

6. Recommendations

7. Data & Analytics

8. Settings

Use a left sidebar navigation on desktop.

The application should feel like a professional enterprise intelligence platform similar to modern financial analytics, logistics intelligence, or AI decision-support software.

==================================================

DESIGN DIRECTION

==================================================

Overall style:

Dark premium interface.

Use:

- Deep navy / near-black background

- Subtle blue accents

- Cyan highlights

- White and muted gray typography

- Green for positive trends

- Amber/orange for warnings

- Red only for critical risk indicators

Do NOT make the interface overly colorful.

The UI should feel clean, focused and sophisticated.

Use:

- Rounded cards

- Subtle borders

- Soft shadows

- Smooth hover effects

- Modern charts

- Data tables

- Minimal but meaningful icons

- Generous spacing

- Strong typography hierarchy

Use a modern sans-serif font.

The interface must be fully responsive.

==================================================

GLOBAL LAYOUT

==================================================

Create a persistent left sidebar.

Sidebar branding:

FreightIQ

Include a subtle maritime/intelligence-inspired logo mark.

Navigation:

Dashboard

Freight Forecast

Voyage Planner

Vessel Feasibility

Market Intelligence

Recommendations

Data & Analytics

At the bottom:

Settings

Help / Documentation

Top navigation bar should include:

- Global search

- Notification icon

- "Demo Mode" indicator

- User profile/avatar

Add a subtle status indicator showing:

AI Engine: Online

This should be purely visual for now.

==================================================

PAGE 1 — DASHBOARD

==================================================

Create a powerful executive dashboard.

Top header:

"Good Evening"

Main heading:

Maritime Freight Intelligence

Subheading:

Monitor market conditions, analyze voyage economics, and make smarter chartering decisions.

At the top, show four important KPI cards:

1. Freight Market Index

Example:

Baltic Freight Indicator

2,184

+4.8% from previous period

2. Forecasted Route Rate

Example:

Australia → India

$24.6 / MT

Forecast for next period

3. Market Volatility

Example:

Moderate

Show visual risk level

4. Recommendation Confidence

Example:

87%

High Confidence

Below this, create a large chart:

"Freight Market Trend & Forecast"

Show:

- Historical freight rate line

- Forecasted continuation

- Shaded confidence interval

The forecasted area should visually differ from historical data.

Include a legend:

Historical

Forecast

Confidence Range

Add a time filter:

7 Days

30 Days

90 Days

1 Year

On the right side, add a card:

"AI Market Insight"

Example insight:

"Freight rates are showing moderate upward momentum. Based on current market signals, delaying chartering may increase expected voyage cost."

Below this:

"Active Market Signals"

Show small cards such as:

- Demand Rising

- Port Congestion Moderate

- Fuel Cost Increasing

- Vessel Availability Stable

Use icons and risk indicators.

==================================================

PAGE 2 — FREIGHT FORECAST

==================================================

This is one of the most important pages.

Heading:

Freight Rate Forecasting

Subheading:

Analyze historical trends and AI-generated freight rate projections.

Create a large input panel where the user can select:

Cargo Type

Dropdown:

- Coal

- Iron Ore

- Steel Products

Origin Port

Example options:

- Newcastle

- Richards Bay

- Port Hedland

Destination Port

Example East Coast India options:

- Paradip

- Visakhapatnam

- Haldia

- Chennai

Vessel Category

Options:

- Handysize

- Supramax

- Panamax

- Capesize

Forecast Horizon:

- 7 Days

- 30 Days

- 90 Days

Primary CTA button:

Generate AI Forecast

When clicked, simulate a loading state and then show forecast results.

Results should include:

Predicted Freight Rate

Example:

$24.60 / MT

Expected Range:

$22.80 – $26.90 / MT

Prediction Confidence:

87%

Market Direction:

Moderately Bullish

Expected Change:

+5.2%

Below this, display a premium chart showing:

Historical freight rates

Forecasted rates

Upper confidence band

Lower confidence band

Include tooltips and interactive hover states.

Also include:

"Key Forecast Drivers"

Example cards:

Fuel Prices

High Impact

Port Congestion

Medium Impact

Seasonal Demand

High Impact

Vessel Availability

Medium Impact

Add an "AI Explanation" section:

Example:

"The forecast indicates moderate upward pressure on freight rates driven primarily by increasing bulk cargo demand and stable vessel availability. The projected confidence range reflects uncertainty associated with fuel price fluctuations and port congestion."

Make this section look like an AI-generated explanation.

==================================================

PAGE 3 — VOYAGE PLANNER

==================================================

Heading:

Voyage Intelligence

Subheading:

Evaluate the operational and economic feasibility of a proposed maritime voyage.

Create a voyage configuration form.

Fields:

Cargo Type

Cargo Quantity in MT

Origin Port

Destination Port

Vessel Type

Estimated Vessel Speed

Fuel Cost

Laytime / Port Time

CTA:

Analyze Voyage

Show results in an elegant summary dashboard.

Key metrics:

Estimated Distance

Example:

5,420 NM

Estimated Voyage Duration

Example:

24.6 Days

Estimated Fuel Consumption

Example:

1,180 MT

Estimated Voyage Cost

Example:

$1.84M

Estimated Freight Cost Per MT

Example:

$24.60

Below this show:

Voyage Route Visualization

Use a stylized map-like visual representation.

Do not require an actual mapping API initially.

Show:

Origin

→ Ocean Route

→ Destination

Use animated or subtle visual route lines.

Also show a timeline:

Port Departure

Transit

Port Arrival

==================================================

PAGE 4 — VESSEL FEASIBILITY

==================================================

Heading:

Vessel Feasibility Analysis

Subheading:

Evaluate whether a vessel is operationally and economically suitable for the selected cargo and voyage.

Allow user to select or enter:

Vessel Type

Deadweight Tonnage

Draft

Cargo Capacity

Origin Port

Destination Port

Cargo Quantity

Show a large:

Feasibility Score

Example:

92 / 100

Label:

Highly Suitable

Break down the analysis into:

Cargo Capacity

PASS

Draft Compatibility

PASS

Port Compatibility

PASS

Estimated Voyage Economics

GOOD

Operational Risk

LOW

Create a visual score breakdown using progress bars or radial indicators.

Include:

"Potential Constraints"

Example:

- Destination berth draft should be verified

- Seasonal port congestion may affect arrival time

Include an:

"AI Recommendation"

Example:

"Panamax-class vessels provide the strongest balance between cargo capacity, port accessibility, and projected voyage economics for this route."

==================================================

PAGE 5 — MARKET INTELLIGENCE

==================================================

Heading:

Market Intelligence

Create a professional market monitoring dashboard.

Sections:

Freight Rates

Fuel Prices

Port Congestion

Vessel Availability

Cargo Demand

Use charts and indicators.

Create a "Market Heatmap" showing routes and market conditions.

Example columns:

Route

Current Rate

7-Day Change

30-Day Trend

Volatility

Signal

Example rows:

Australia → Paradip

South Africa → Visakhapatnam

Australia → Haldia

Signals:

Bullish

Neutral

Bearish

Use subtle colored indicators.

Add a section:

"Latest Market Signals"

Use demo information cards.

Example:

Rising Demand

High

Fuel Cost Pressure

Medium

Port Congestion

Moderate

Vessel Supply

Stable

==================================================

PAGE 6 — RECOMMENDATIONS

==================================================

This page should feel like the intelligence center of the product.

Heading:

AI Decision Recommendations

Subheading:

Compare available options and identify the most favorable chartering strategy.

Show 3–4 recommended scenarios.

Example:

OPTION A

Coal

Newcastle → Paradip

Panamax

Projected Cost:

$1.84M

Risk:

Low

Forecast Confidence:

87%

Overall Score:

92 / 100

Recommended

OPTION B

Coal

Richards Bay → Paradip

Supramax

Projected Cost:

$1.91M

Risk:

Medium

Forecast Confidence:

81%

Overall Score:

84 / 100

OPTION C

Another scenario.

Highlight the best option visually.

Create a comparison table.

Columns:

Option

Route

Vessel

Estimated Cost

Freight Rate

Risk

Confidence

Score

At the top, show an AI recommendation card:

"Recommended Strategy"

Example:

"Proceed with Option A. Current analysis indicates the strongest balance between projected freight cost, vessel feasibility, and market risk."

Add:

Why this recommendation?

Use 3–4 explainable factors.

Example:

✓ Lower projected freight cost

✓ High vessel compatibility

✓ Low operational risk

✓ Strong prediction confidence

==================================================

PAGE 7 — DATA & ANALYTICS

==================================================

Create a data-focused page.

Heading:

Data & Analytics

Show tabs:

Freight Data

Port Data

Vessel Data

Market Signals

Include professional data tables.

Columns could include:

Date

Route

Cargo

Vessel Type

Freight Rate

Fuel Price

Port Condition

Include:

Search

Filters

Date range

Export button

Use realistic mock data.

Make it clear that this is structured so APIs can later populate these tables.

==================================================

AI / BACKEND INTEGRATION READINESS

==================================================

IMPORTANT:

Structure the frontend so backend APIs can later be integrated easily.

Create reusable data/service patterns.

Do not hard-code everything directly inside UI components.

Use clearly separated mock data and service layers where appropriate.

Prepare conceptual API integration points such as:

GET /market-data

POST /forecast

POST /voyage-analysis

POST /vessel-feasibility

POST /recommendations

These endpoints do not need to actually work yet.

Use mock responses so the UI behaves realistically.

The frontend should be easy for a backend developer to connect later.

==================================================

LOADING AND INTERACTION STATES

==================================================

When users click buttons such as:

Generate AI Forecast

Analyze Voyage

Evaluate Vessel

Generate Recommendations

Show a premium AI analysis loading experience.

For example:

"Analyzing Market Signals..."

"Processing Historical Freight Data..."

"Evaluating Vessel Constraints..."

"Generating Recommendation..."

Use subtle animated loading indicators.

After a short simulated delay, reveal the analysis.

==================================================

IMPORTANT DATA DISCLAIMERS

==================================================

Since this is currently a prototype:

Add subtle indicators where appropriate:

Demo Data

Simulated Forecast

Prototype Analysis

Do not overuse these labels.

The product should still feel realistic and presentation-ready.

==================================================

TECHNICAL REQUIREMENTS

==================================================

Use a modern React-based frontend.

Create reusable components.

Maintain clean architecture.

Use responsive design.

Use modern charts and visualization components.

Use icons consistently.

Avoid placeholder-looking UI.

Avoid excessive gradients.

Avoid giant blocks of text.

Do not make every card identical.

Prioritize a polished, professional hierarchy.

The final product should feel like a real maritime intelligence SaaS platform that could be demonstrated to industry experts and Smart India Hackathon judges.

==================================================

MOST IMPORTANT EXPERIENCE

==================================================

When someone opens FreightIQ, they should immediately understand:

"This platform helps organizations predict freight costs, evaluate vessel and voyage feasibility, understand market uncertainty, and make smarter bulk cargo chartering decisions."

The application should look sophisticated enough to make the AI, backend, and data components feel like parts of one unified intelligent platform.

Start by building the complete frontend experience with realistic mock data and working navigation between all pages.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b6c0aeb3-7946-4bae-b95f-da15aac0b4a6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
