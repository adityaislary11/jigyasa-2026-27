/* ===========================================================
   SentinelLink
   analytics.js
   Part 1/4
   Analytics Engine & KPI Calculations
=========================================================== */

"use strict";

/* ===========================================================
   ANALYTICS CONFIGURATION
=========================================================== */

const Analytics={

    reports:[],

    statistics:{},

    charts:{},

    lastUpdated:null

};

/* ===========================================================
   LOAD DATA
=========================================================== */

function loadAnalyticsData(){

    Analytics.reports=

    getReports();

    Analytics.lastUpdated=

    getCurrentDateTime();

}

/* ===========================================================
   BASIC COUNTERS
=========================================================== */

function totalIncidents(){

    return Analytics.reports.length;

}

function totalResolved(){

    return Analytics.reports.filter(

        report=>report.status==="Resolved"

    ).length;

}

function totalPending(){

    return Analytics.reports.filter(

        report=>report.status==="Pending"

    ).length;

}

function totalActive(){

    return Analytics.reports.filter(

        report=>report.status==="Active"

    ).length;

}

/* ===========================================================
   INCIDENT CATEGORY COUNTS
=========================================================== */

function countCategory(category){

    return Analytics.reports.filter(

        report=>

        (report.category||"")===category

    ).length;

}

function categoryStatistics(){

    return{

        railway:countCategory("Railway"),

        flood:countCategory("Flood"),

        fire:countCategory("Fire"),

        landslide:countCategory("Landslide"),

        medical:countCategory("Medical"),

        accident:countCategory("Road Accident")

    };

}

/* ===========================================================
   RESPONSE RATE
=========================================================== */

function responseRate(){

    const total=

    totalIncidents();

    if(total===0){

        return 0;

    }

    return Math.round(

        (totalResolved()/total)*100

    );

}

/* ===========================================================
   AVERAGE RESPONSE TIME
=========================================================== */

function averageResponseTime(){

    const resolved=

    Analytics.reports.filter(

        report=>report.responseTime

    );

    if(resolved.length===0){

        return 0;

    }

    const total=

    resolved.reduce(

        (sum,report)=>

        sum+Number(report.responseTime),

        0

    );

    return Math.round(

        total/resolved.length

    );

}

/* ===========================================================
   SDG PROGRESS
=========================================================== */

function sdgProgress(){

    return{

        sdg3:78,

        sdg9:84,

        sdg11:82,

        sdg13:74,

        sdg16:88

    };

}

/* ===========================================================
   KPI SUMMARY
=========================================================== */

function calculateKPIs(){

    Analytics.statistics={

        totalReports:totalIncidents(),

        resolved:totalResolved(),

        pending:totalPending(),

        active:totalActive(),

        responseRate:responseRate(),

        averageResponse:averageResponseTime(),

        categories:categoryStatistics(),

        sdgs:sdgProgress(),

        generated:getCurrentDateTime()

    };

}

/* ===========================================================
   DASHBOARD WIDGETS
=========================================================== */

function updateDashboardAnalytics(){

    calculateKPIs
    /* ===========================================================
   SentinelLink
   analytics.js
   Part 2/4
   Chart Data & Visualisation
=========================================================== */

/* ===========================================================
   MONTHLY STATISTICS
=========================================================== */

function monthlyStatistics(){

    const months={};

    Analytics.reports.forEach(report=>{

        const date=new Date(report.date);

        const month=date.toLocaleString(

            "default",

            {month:"short"}

        );

        months[month]=(months[month]||0)+1;

    });

    return months;

}

/* ===========================================================
   INCIDENT TREND
=========================================================== */

function incidentTrend(){

    const trend={};

    Analytics.reports.forEach(report=>{

        const day=new Date(report.date)

        .toLocaleDateString();

        trend[day]=(trend[day]||0)+1;

    });

    return trend;

}

/* ===========================================================
   CATEGORY DISTRIBUTION
=========================================================== */

function categoryDistribution(){

    return [

        {

            label:"Railway",

            value:countCategory("Railway")

        },

        {

            label:"Flood",

            value:countCategory("Flood")

        },

        {

            label:"Fire",

            value:countCategory("Fire")

        },

        {

            label:"Landslide",

            value:countCategory("Landslide")

        },

        {

            label:"Medical",

            value:countCategory("Medical")

        },

        {

            label:"Road Accident",

            value:countCategory("Road Accident")

        }

    ];

}

/* ===========================================================
   RESPONSE TIME DATA
=========================================================== */

function responseTimeData(){

    return Analytics.reports

    .filter(

        report=>report.responseTime

    )

    .map(

        report=>

        Number(report.responseTime)

    );

}

/* ===========================================================
   CHART DATA
=========================================================== */

function prepareCharts(){

    Analytics.charts={

        monthly:monthlyStatistics(),

        trend:incidentTrend(),

        categories:categoryDistribution(),

        responseTimes:responseTimeData()

    };

}

/* ===========================================================
   DASHBOARD CHART PLACEHOLDERS
=========================================================== */

function renderIncidentTrend(){

    const chart=

    document.getElementById(

        "incidentTrendChart"

    );

    if(!chart)return;

    chart.innerHTML=

    "<p>Incident Trend Chart Ready</p>";

}

function renderCategoryChart(){

    const chart=

    document.getElementById(

        "categoryChart"

    );

    if(!chart)return;

    chart.innerHTML=

    "<p>Category Distribution Ready</p>";

}

function renderResponseChart(){

    const chart=

    document.getElementById(

        "responseChart"

    );

    if(!chart)return;

    chart.innerHTML=

    "<p>Response Time Chart Ready</p>";

}

/* ===========================================================
   REFRESH ALL CHARTS
=========================================================== */

function refreshAnalytics(){

    loadAnalyticsData();

    calculateKPIs();

    prepareCharts();

    updateDashboardAnalytics();

    renderIncidentTrend();

    renderCategoryChart();

    renderResponseChart();

    console.log(

        "Analytics refreshed."

    );

}

/* ===========================================================
   SUMMARY OBJECT
=========================================================== */

function analyticsSummary(){

    return{

        reports:totalIncidents(),

        resolved:totalResolved(),

        pending:totalPending(),

        responseRate:responseRate(),

        generated:getCurrentDateTime()

    };

}

/* ===========================================================
   END PART 2
=========================================================== */
/* ===========================================================
   SentinelLink
   analytics.js
   Part 3/4
   Filtering, Reports & Data Export
=========================================================== */

/* ===========================================================
   FILTER BY DATE
=========================================================== */

function filterByDate(startDate,endDate){

    return Analytics.reports.filter(

        report=>{

            const date=

            new Date(report.date);

            return (

                date>=new Date(startDate)

                &&

                date<=new Date(endDate)

            );

        }

    );

}

/* ===========================================================
   FILTER BY CATEGORY
=========================================================== */

function filterByCategory(category){

    if(category==="All"){

        return Analytics.reports;

    }

    return Analytics.reports.filter(

        report=>

        report.category===category

    );

}

/* ===========================================================
   FILTER BY STATUS
=========================================================== */

function filterByStatus(status){

    if(status==="All"){

        return Analytics.reports;

    }

    return Analytics.reports.filter(

        report=>

        report.status===status

    );

}

/* ===========================================================
   ADVANCED FILTER
=========================================================== */

function applyAnalyticsFilter(options={}){

    let results=

    Analytics.reports;

    if(options.category){

        results=

        results.filter(

            report=>

            report.category===options.category

        );

    }

    if(options.status){

        results=

        results.filter(

            report=>

            report.status===options.status

        );

    }

    if(options.keyword){

        const key=

        options.keyword.toLowerCase();

        results=

        results.filter(

            report=>

            JSON.stringify(report)

            .toLowerCase()

            .includes(key)

        );

    }

    return results;

}

/* ===========================================================
   WEEKLY REPORT
=========================================================== */

function weeklyReport(){

    const today=

    new Date();

    const weekAgo=

    new Date();

    weekAgo.setDate(

        today.getDate()-7

    );

    const reports=

    Analytics.reports.filter(

        report=>{

            const date=

            new Date(report.date);

            return date>=weekAgo;

        }

    );

    return{

        total:reports.length,

        resolved:reports.filter(

            r=>r.status==="Resolved"

        ).length,

        pending:reports.filter(

            r=>r.status==="Pending"

        ).length

    };

}

/* ===========================================================
   MONTHLY REPORT
=========================================================== */

function monthlyReport(){

    const month=

    new Date().getMonth();

    const reports=

    Analytics.reports.filter(

        report=>

        new Date(report.date)

        .getMonth()===month

    );

    return{

        total:reports.length,

        categories:

        calculateCategoryFromList(reports)

    };

}

/* ===========================================================
   CATEGORY CALCULATOR
=========================================================== */

function calculateCategoryFromList(list){

    const result={};

    list.forEach(report=>{

        const category=

        report.category||"Unknown";

        result[category]=

        (result[category]||0)+1;

    });

    return result;

}

/* ===========================================================
   EXPORT CSV
=========================================================== */

function exportAnalyticsCSV(){

    const reports=

    Analytics.reports;

    if(reports.length===0){

        showToast(

            "No data available.",

            "warning"

        );

        return;

    }

    const headers=

    Object.keys(reports[0]);

    let csv=

    headers.join(",")+"\n";

    reports.forEach(report=>{

        csv+=

        headers.map(

            h=>

            `"${report[h]||""}"`

        )

        .join(",")+"\n";

    });

    const blob=

    new Blob(

        [csv],

        {

            type:"text/csv"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const link=

    document.createElement("a");

    link.href=url;

    link.download=

    "sentinellink_analytics.csv";

    link.click();

    URL.revokeObjectURL(url);

}

/* ===========================================================
   EXPORT SUMMARY
=========================================================== */

function exportAnalyticsSummary(){

    const data=

    JSON.stringify(

        Analytics.statistics,

        null,

        2

    );

    const blob=

    new Blob(

        [data],

        {

            type:"application/json"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const link=

    document.createElement("a");

    link.href=url;

    link.download=

    "sentinellink_summary.json";

    link.click();

    URL.revokeObjectURL(url);

}

/* ===========================================================
   END PART 3
=========================================================== */
/* ===========================================================
   SentinelLink
   analytics.js
   Part 4/4
   Initialization & Application Integration
=========================================================== */

/* ===========================================================
   ANALYTICS PAGE INITIALIZATION
=========================================================== */

function initializeAnalytics(){

    loadAnalyticsData();

    calculateKPIs();

    prepareCharts();

    updateDashboardAnalytics();

    renderIncidentTrend();

    renderCategoryChart();

    renderResponseChart();

    console.log(

        "Analytics module initialized."

    );

}

/* ===========================================================
   AUTO REFRESH
=========================================================== */

function startAnalyticsRefresh(){

    if(Analytics.refreshTimer){

        clearInterval(

            Analytics.refreshTimer

        );

    }

    Analytics.refreshTimer=

    setInterval(

        function(){

            refreshAnalytics();

        },

        30000

    );

}

function stopAnalyticsRefresh(){

    clearInterval(

        Analytics.refreshTimer

    );

}

/* ===========================================================
   KPI CARD DATA
=========================================================== */

function getKPIData(){

    return [

        {

            title:"Total Incidents",

            value:totalIncidents()

        },

        {

            title:"Resolved Cases",

            value:totalResolved()

        },

        {

            title:"Pending Cases",

            value:totalPending()

        },

        {

            title:"Response Rate",

            value:responseRate()+"%"

        }

    ];

}

/* ===========================================================
   RENDER KPI CARDS
=========================================================== */

function renderKPICards(){

    const container=

    document.getElementById(

        "kpiContainer"

    );

    if(!container)return;

    container.innerHTML="";

    getKPIData()

    .forEach(card=>{

        const item=

        document.createElement("div");

        item.className="card";

        item.innerHTML=`

        <h3>${card.title}</h3>

        <p class="stat-number">

        ${card.value}

        </p>

        `;

        container.appendChild(item);

    });

}

/* ===========================================================
   ANALYTICS EVENT HANDLERS
=========================================================== */

function initializeAnalyticsEvents(){

    const refreshBtn=

    document.getElementById(

        "refreshAnalytics"

    );

    if(refreshBtn){

        refreshBtn.addEventListener(

            "click",

            refreshAnalytics

        );

    }


    const exportBtn=

    document.getElementById(

        "exportAnalytics"

    );

    if(exportBtn){

        exportBtn.addEventListener(

            "click",

            exportAnalyticsCSV

        );

    }

}

/* ===========================================================
   PAGE DETECTION
=========================================================== */

function isAnalyticsPage(){

    return (

        window.location.pathname

        .includes("analytics")

    );

}

/* ===========================================================
   STARTUP
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        if(

            isAnalyticsPage()

        ){

            initializeAnalytics();

            renderKPICards();

            initializeAnalyticsEvents();

            startAnalyticsRefresh();

        }

    }

);

/* ===========================================================
   GLOBAL EXPORTS
=========================================================== */

window.initializeAnalytics=

initializeAnalytics;

window.refreshAnalytics=

refreshAnalytics;

window.exportAnalyticsCSV=

exportAnalyticsCSV;

window.exportAnalyticsSummary=

exportAnalyticsSummary;

window.filterByCategory=

filterByCategory;

window.filterByStatus=

filterByStatus;

window.applyAnalyticsFilter=

applyAnalyticsFilter;

window.weeklyReport=

weeklyReport;

window.monthlyReport=

monthlyReport;

/* ===========================================================
   END OF FILE

   SentinelLink
   analytics.js
   Version 1.0

   National-Level Prototype
=========================================================== */