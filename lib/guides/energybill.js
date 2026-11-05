/* Home and Garden — long-form 23-step household electricity-bill analysis guide. */

module.exports = {
  slug: "Read-a-Home-Energy-Bill-and-Build-a-Usage-Reduction-Plan",
  title: "Read a Home Energy Bill and Build a Usage Reduction Plan",
  category: "Home-and-Garden",
  hero_image: "/img/categories/home-hero.jpg",
  author: "Natalie Greene, Household Energy & Utility Literacy Editor",
  read_time: 27,
  featured: 0,
  summary:
    "Turn a household electricity bill into a measured, low-risk reduction plan. These 23 steps cover billing days, actual and estimated reads, kW versus kWh, current charges versus old balances, fixed and variable charges, delivery and tax line items, tiered and time-of-use rates, blended and marginal cost, appliance-energy estimates, safe plug-in measurements, HVAC and laundry priorities, lighting, standby loads, daily-kWh targets, weather-aware bill comparisons, and ongoing review.",
  intro:
    "The amount due is not a complete explanation of electricity use: it can include a previous balance, fixed charges, delivery, taxes, a different number of billing days, or an estimated meter read. Use these 23 steps in our [Home and Garden](/category/Home-and-Garden) collection to reconcile the statement first, estimate where energy goes, and verify changes with daily kWh rather than chasing a single appliance or copying another household's rate.",
  methods: [
    {
      title: "Gathering and Reconciling the Bill",
      steps: [
        {
          text: "Collect the current bill, up to 12 earlier bills, and the utility's current residential rate schedule. Use the company's official website, app, or customer-service channel, and keep complete statements rather than relying only on a payment notification; seasonal comparisons need the same home and a consistent rate history. Redact the account number, service identifiers, payment details, and address before sharing a worksheet, because an energy-analysis project does not require public disclosure of utility-account information.",
        },
        {
          text: "Verify the service period, number of billing days, meter-read dates, and actual or estimated read status. Record the start and end dates exactly as printed, check whether a bill covers an unusually short or long period, and find the utility's legend for estimated, corrected, or customer reads. If an estimate appears inconsistent, follow the official correction process and retain the statement rather than silently replacing its numbers with a home reading.",
        },
        {
          text: "Reconcile the previous and current meter readings with the billed kWh when the statement provides them. Subtract the earlier reading from the later reading only when the units and meter identifier match, apply a printed meter multiplier if one exists, and compare the result with the billed usage before investigating a discrepancy. EIA [electricity measurement guidance](https://www.eia.gov/energyexplained/electricity/measuring-electricity.php) explains that meters record electricity use; read only an accessible closed meter display and never open a meter base or electrical enclosure.",
        },
        {
          text: "Separate the total amount due from the charges for the current service period. Identify previous balances, payments, late fees, deposits, one-time service charges, and separately billed water, gas, or municipal services so they do not distort an electricity-use comparison. Keep the payment total for budgeting, but use current-period electricity line items and kWh for the usage analysis, and contact the utility through an official channel about an unexplained balance rather than assuming it represents consumption.",
        },
        {
          text: "Build a bill worksheet with billing days, total kWh, average daily kWh, current charges, and read type. Calculate average daily kWh as billed kWh divided by billing days, and optionally calculate a blended current-charge cost per kWh by dividing the relevant current charges by kWh while labeling exactly which charges are included. Preserve the raw statement values beside every calculation so a long billing cycle, an estimated read, or an omitted fixed fee cannot be mistaken for a change in appliance behavior.",
        },
      ],
    },
    {
      title: "Understanding kWh, Charges, and Rate Structure",
      steps: [
        {
          text: "Distinguish kilowatts from kilowatt-hours before estimating any appliance. EIA [measurement guidance](https://www.eia.gov/energyexplained/electricity/measuring-electricity.php) defines a kilowatt as power and a kilowatt-hour as energy used over time: a 1,000-watt device operating for one hour uses 1 kWh, while a 40-watt device operating for five hours uses 0.2 kWh. Record watts for the power label, hours for actual operation, and kWh for the result rather than treating a nameplate wattage as a monthly consumption figure.",
        },
        {
          text: "Identify fixed customer or service charges separately from charges that vary with kWh. Copy the bill's own labels and note which amount would remain even if usage fell, rather than assigning every line item to a homemade energy rate. DOE's [utility-bill guide](https://betterbuildingssolutioncenter.energy.gov/sites/default/files/attachments/BP%20Understanding%20your%20Utility%20Bill%20-%20Electricity_FINAL.pdf) distinguishes fixed, energy, and other charge concepts, although a household must use its own utility tariff because names and structures vary by jurisdiction.",
        },
        {
          text: "Group delivery, distribution, transmission, riders, public-program charges, and taxes according to the statement's definitions. Determine from the tariff whether each item is fixed, per-kWh, seasonal, or calculated another way, and avoid adding a summary total to its component lines a second time. Keep these charges visible even when you cannot control them, because a reduction in energy use may lower only the variable portions and will not necessarily reduce the total bill by the same percentage.",
        },
        {
          text: "Check whether the rate has tiers, seasons, time-of-use periods, or a demand component. Record the exact kWh thresholds, peak and off-peak hours, seasonal months, and any demand units only if they appear in your residential tariff; do not assume every home has a demand charge or time-varying price. DOE [rate-option guidance](https://www.energy.gov/cmei/femp/evaluating-your-utility-rate-options) explains why energy, demand, fixed charges, and time-dependent rates must be evaluated separately, so use the utility's current schedule rather than another customer's example.",
        },
        {
          text: "Choose an appropriate rate for estimating savings and label it as marginal or blended. Use the applicable variable per-kWh charge and rate block for a small expected change, include variable riders when the tariff supports them, and exclude fixed charges that will remain; reserve the blended bill divided by kWh for a broad average-cost observation. Recheck the calculation if a change crosses a tier, shifts time-of-use consumption, or alters taxes, and never promise an exact dollar saving from a universal cents-per-kWh assumption.",
        },
      ],
    },
    {
      title: "Estimating Where Electricity Is Used",
      steps: [
        {
          text: "Create an inventory of major appliances, heating and cooling equipment, electronics, and high-use lighting. Record the location, nameplate or manual wattage when available, estimated hours per day, days per billing period, and whether the device runs continuously, cycles, or has variable power; keep hardwired equipment on the list without dismantling it. Our [home-inventory guide](/how-to/Create-a-Home-Inventory-for-Renters-and-Homeowners) offers a useful room-by-room structure, but this worksheet should focus on energy use and safe observations rather than appliance replacement values.",
        },
        {
          text: "Estimate appliance kWh with watts multiplied by hours and days, then divided by 1,000. For example, a steady 100-watt load used 10 hours per day for 30 days gives 100 × 10 × 30 ÷ 1,000 = 30 kWh; DOE's [appliance-energy guide](https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use) provides the underlying estimation approach. Label cycling refrigerators, variable-speed equipment, and thermostatically controlled devices as rough estimates unless you account for actual runtime, because continuous nameplate power can overstate consumption.",
        },
        {
          text: "Measure a compatible plug-in appliance with a properly rated, certified plug-in energy meter when a runtime estimate is too uncertain. Follow the meter and appliance instructions on a dry, accessible outlet, record watts and accumulated kWh over a representative period, and keep the setup within every voltage, current, and load rating. Do not adapt the meter to a hardwired appliance, damaged cord, or higher-voltage load it is not designed for; ask a licensed electrician about safe measurement of fixed equipment.",
        },
        {
          text: "Prioritize heating, cooling, water heating, refrigeration, laundry, and other long-runtime loads before chasing tiny indicators. Use billing season, thermostat runtime information where available, household behavior, and safe visual inspection to identify which systems can plausibly explain a change, then compare their estimated kWh with smaller electronics on the same basis. DOE's [do-it-yourself energy assessment](https://www.energy.gov/energysaver/do-it-yourself-home-energy-assessments) supports a whole-home review, but leave panels, wiring, refrigerant, gas components, and other hazardous work to qualified professionals.",
        },
        {
          text: "Quantify high-use lighting and selected standby loads with the same kWh method. Multiply each bulb's actual watts by its daily hours, prioritize frequently used fixtures, and measure a suitable entertainment or office cluster if standby use is uncertain; DOE [LED guidance](https://www.energy.gov/energysaver/save-electricity-and-fuel/lighting-choices-save-you-money/led-lighting) explains the efficiency advantage of LED products. Switch off only nonessential devices whose settings and function you understand, and never treat a refrigerator, medical device, network service, alarm, or other critical load as a discretionary standby saving.",
        },
      ],
    },
    {
      title: "Building a Low-Risk Reduction Plan",
      steps: [
        {
          text: "Choose practical heating and cooling actions that preserve health, comfort, and equipment requirements. Follow the thermostat and HVAC manuals, replace or clean filters at the manufacturer-specified interval, keep accessible vents and outdoor units clear without opening equipment, and schedule qualified service for abnormal operation. DOE's [home energy checklist](https://www.energy.gov/cmei/femp/home-energy-checklist) includes HVAC maintenance; record any thermostat schedule change and avoid temperature settings that endanger occupants, pets, pipes, or humidity control.",
        },
        {
          text: "Reduce laundry and hot-water-related electricity through appropriate operating habits before changing equipment settings. Run suitably full loads, choose cooler wash cycles compatible with garment and hygiene instructions, clean the dryer lint screen as the manufacturer directs, and have damaged ducts or appliances serviced rather than improvising repairs. Keep water-heater temperature and maintenance decisions within manufacturer and local health guidance, and do not lower a setpoint or disable a safety control solely to chase an estimated kWh saving.",
        },
        {
          text: "Replace suitable high-use bulbs with correctly matched LED lamps and use controls where they add real value. Check fixture rating, bulb shape, dimmer compatibility, enclosed-fixture approval, and color preference before buying, then calculate expected kWh from the wattage reduction and actual hours rather than counting every rarely used bulb equally. Turn off unneeded lights without compromising stairs, entrances, or task visibility, and retain a few baseline runtime notes so the next bill can test the change.",
        },
        {
          text: "Write a measurable plan with actions, owners, dates, expected kWh, and any time-of-use constraints. Select a small set of changes, such as an HVAC maintenance task, a lighting swap, and a laundry routine, and shift dishwasher or charging schedules only when the appliance manufacturer and household needs allow it; load shifting can change cost without reducing kWh. Set a review target such as average daily kWh rather than guaranteeing a percentage, and keep essential refrigeration, medical, communications, and safety equipment outside the shutdown list.",
        },
      ],
    },
    {
      title: "Verifying Savings and Reviewing the Plan",
      steps: [
        {
          text: "Record the baseline and each implemented change in a dated energy log. Note meter-read status, billing days, weather or occupancy changes, thermostat schedules, appliance replacements, and measured kWh where available, then introduce a few changes at a time so their effects remain interpretable. Include comfort and equipment-performance observations beside the numbers, and reverse or seek help for any action that causes unsafe temperatures, moisture, nuisance trips, or unreliable essential service.",
        },
        {
          text: "Compare the next bill using average daily kWh and matching service conditions. Check that both bills use actual rather than estimated reads where possible, account for different billing-day counts, and note major weather, guest, work-from-home, or occupancy differences before declaring success. Use utility-provided temperature or usage-comparison tools when available, and compare a seasonally similar earlier period as a secondary reference rather than expecting adjacent summer and winter bills to isolate one appliance change.",
        },
        {
          text: "Recalculate expected dollar savings with the current marginal rate and compare them with the actual statement. Apply measured or revised kWh to the relevant variable rate and time period, retain fixed charges and nonenergy balances separately, and investigate whether tier thresholds, seasonal prices, taxes, or estimated reads explain a difference. Treat the result as a reconciliation rather than a guarantee, and update the appliance assumptions when measured runtime or the next bill shows that the original estimate was unrealistic.",
        },
        {
          text: "Review the plan quarterly and after a major household, equipment, or rate change. Keep the current tariff, bill worksheet, and energy log together, repeat the inventory when an appliance is added or removed, and ask the utility or a licensed electrician to investigate an unexplained surge, damaged equipment, or electrical hazard rather than experimenting. Connect verified current charges to our [monthly savings guide](/how-to/Save-Money-Every-Month) and [personal-budget guide](/how-to/Manage-Personal-Finances-and-Budget), while keeping account credentials and detailed consumption patterns private.",
        },
      ],
    },
  ],
  tips: [
    "Compare average daily kWh before comparing total kWh or amount due; billing periods often contain different numbers of days.",
    "Keep fixed charges, variable energy charges, and previous balances in separate worksheet columns so each saving estimate uses the correct cost basis.",
    "Prioritize loads with both meaningful power and long runtime, and use a representative measurement for cycling appliances instead of assuming continuous nameplate operation.",
    "Save a dated copy of the rate schedule with each analysis because tiers, time periods, riders, and prices can change independently of household behavior.",
  ],
  warnings: [
    "Never open a meter base, electrical panel, appliance enclosure, or wiring junction to collect data, and never exceed a plug-in energy meter's ratings; use the utility or a licensed electrician for fixed-equipment investigation.",
    "Do not switch off refrigeration, medical equipment, essential communications, alarms, or other critical loads, and do not adopt temperatures that endanger occupants, pets, pipes, or indoor-air quality.",
    "A nameplate calculation and a blended bill rate are estimates, not guaranteed savings; weather, cycling, billing days, tiers, estimated reads, and fixed charges can change the result.",
    "Use only official utility channels for billing corrections and payments, and redact account, address, payment, and meter identifiers before sharing a bill or worksheet.",
  ],
  things: [
    "The current statement and up to 12 earlier electricity bills",
    "The utility's current residential rate schedule and charge definitions",
    "A worksheet with billing days, kWh, read type, and separated charge columns",
    "A calculator and a room-by-room appliance and lighting inventory",
    "Optional certified, correctly rated plug-in energy meter for compatible appliances",
    "Appliance, thermostat, HVAC, and fixture manuals for safe operating requirements",
  ],
  faqs: [
    {
      question: "What is the difference between kW and kWh?",
      answer: "A kilowatt (kW) is power at a moment; a kilowatt-hour (kWh) is energy accumulated over time. A 1 kW appliance running for one hour uses 1 kWh, while a 0.04 kW (40 W) load running for five hours uses 0.2 kWh. Your consumption charge is generally based on kWh, although some tariffs also include other charge types.",
    },
    {
      question: "Why did my bill rise when my kWh stayed similar?",
      answer: "Check the rate schedule, seasonal prices, tier, time-of-use allocation, fixed and variable riders, taxes, previous balances, late fees, and other services on the statement. Also compare billing days and read type. Similar total kWh does not guarantee the same amount due when prices or nonenergy charges change.",
    },
    {
      question: "Can I divide the whole bill by kWh to estimate every saving?",
      answer: "That produces a blended average only if you define exactly which current charges are included. It can be useful for an overview, but a small reduction often avoids only variable charges while fixed fees remain. Use the applicable marginal rate and riders for a saving estimate, then recheck tiers, time periods, and taxes on the actual bill.",
    },
    {
      question: "What should I do about an estimated meter reading?",
      answer: "Mark it as estimated in the worksheet and follow the utility's official process for a customer read, correction, or explanation. Compare the next actual-read bill for any reconciliation, and avoid treating an estimated bill as proof of an appliance problem. Never open a meter or electrical enclosure to obtain information.",
    },
  ],
  references: [
    {
      title: "Measuring Electricity",
      publisher: "U.S. Energy Information Administration",
      url: "https://www.eia.gov/energyexplained/electricity/measuring-electricity.php",
    },
    {
      title: "Understanding Your Utility Bill: Electricity",
      publisher: "U.S. Department of Energy, Better Buildings",
      url: "https://betterbuildingssolutioncenter.energy.gov/sites/default/files/attachments/BP%20Understanding%20your%20Utility%20Bill%20-%20Electricity_FINAL.pdf",
    },
    {
      title: "Estimating Appliance and Home Electronic Energy Use",
      publisher: "U.S. Department of Energy",
      url: "https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use",
    },
    {
      title: "Do-It-Yourself Home Energy Assessments",
      publisher: "U.S. Department of Energy",
      url: "https://www.energy.gov/energysaver/do-it-yourself-home-energy-assessments",
    },
    {
      title: "Home Energy Checklist",
      publisher: "U.S. Department of Energy",
      url: "https://www.energy.gov/cmei/femp/home-energy-checklist",
    },
    {
      title: "LED Lighting",
      publisher: "U.S. Department of Energy",
      url: "https://www.energy.gov/energysaver/save-electricity-and-fuel/lighting-choices-save-you-money/led-lighting",
    },
  ],
};
