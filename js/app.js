/*=========================================================
    SentinelLink Beta v2.0
    Core Module
=========================================================*/

"use strict";

const SentinelLink = {

    version: "2.0 Beta",

    appName: "SentinelLink",

    storageKeys: {

        users: "sl_users",

        reports: "sl_reports",

        session: "sl_session",

        settings: "sl_settings"

    },

    currentUser: null,

    settings: {

        autoRefresh: true,

        refreshRate: 3000

    }

};

/*=========================================================
    Storage Manager
=========================================================*/

SentinelLink.Storage = {

    get(key){

        try{

            const value = localStorage.getItem(key);

            if(value===null){

                return null;

            }

            return JSON.parse(value);

        }

        catch(error){

            console.error(error);

            return null;

        }

    },

    set(key,value){

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    },

    remove(key){

        localStorage.removeItem(key);

    },

    exists(key){

        return localStorage.getItem(key)!==null;

    }

};

/*=========================================================
    Default Data
=========================================================*/

SentinelLink.initializeStorage = function(){

    if(

        !SentinelLink.Storage.exists(

            SentinelLink.storageKeys.users

        )

    ){

        SentinelLink.Storage.set(

            SentinelLink.storageKeys.users,

            [

                {

                    id:"USR001",

                    username:"admin",

                    password:"admin123",

                    name:"Administrator",

                    role:"Administrator"

                }

            ]

        );

    }

    if(

        !SentinelLink.Storage.exists(

            SentinelLink.storageKeys.reports

        )

    ){

        SentinelLink.Storage.set(

            SentinelLink.storageKeys.reports,

            []

        );

    }

    if(

        !SentinelLink.Storage.exists(

            SentinelLink.storageKeys.settings

        )

    ){

        SentinelLink.Storage.set(

            SentinelLink.storageKeys.settings,

            SentinelLink.settings

        );

    }

};

/*=========================================================
    Users
=========================================================*/

SentinelLink.getUsers=function(){

    return SentinelLink.Storage.get(

        SentinelLink.storageKeys.users

    )||[];

};

SentinelLink.saveUsers=function(users){

    SentinelLink.Storage.set(

        SentinelLink.storageKeys.users,

        users

    );

};

/*=========================================================
    Reports
=========================================================*/

SentinelLink.getReports=function(){

    return SentinelLink.Storage.get(

        SentinelLink.storageKeys.reports

    )||[];

};

SentinelLink.saveReports=function(reports){

    SentinelLink.Storage.set(

        SentinelLink.storageKeys.reports,

        reports

    );

};

/*=========================================================
    Session
=========================================================*/

SentinelLink.loadSession=function(){

    const session=

    SentinelLink.Storage.get(

        SentinelLink.storageKeys.session

    );

    if(session){

        SentinelLink.currentUser=session;

    }

};

SentinelLink.saveSession=function(user){

    SentinelLink.currentUser=user;

    SentinelLink.Storage.set(

        SentinelLink.storageKeys.session,

        user

    );

};

SentinelLink.logoutSession=function(){

    SentinelLink.currentUser=null;

    SentinelLink.Storage.remove(

        SentinelLink.storageKeys.session

    );

};

/*=========================================================
    Utilities
=========================================================*/

SentinelLink.uuid=function(){

    return "RPT-"

    +

    Date.now()

    +

    "-"

    +

    Math.floor(

        Math.random()*100000

    );

};

SentinelLink.now=function(){

    return new Date()

    .toLocaleString();

};

SentinelLink.page=function(){

    return window.location.pathname

    .split("/")

    .pop()

    .toLowerCase();

};

SentinelLink.isLoggedIn=function(){

    return SentinelLink.currentUser!==null;

};

/*=========================================================
    Startup
=========================================================*/

SentinelLink.initializeStorage();

SentinelLink.loadSession();

/*=========================================================
    End Part 1
=========================================================*/
/*=========================================================
    Authentication Module
=========================================================*/

SentinelLink.Auth = {};

/*=========================================================
    Find User
=========================================================*/

SentinelLink.Auth.findUser = function(username){

    return SentinelLink.getUsers().find(function(user){

        return user.username.toLowerCase() ===
        username.toLowerCase();

    });

};

/*=========================================================
    Login
=========================================================*/

SentinelLink.Auth.login = function(username,password){

    username = username.trim();

    password = password.trim();

    if(username==="" || password===""){

        SentinelLink.UI.toast(
            "Please enter username and password.",
            "error"
        );

        return false;

    }

    const user = SentinelLink.Auth.findUser(username);

    if(!user){

        SentinelLink.UI.toast(
            "User not found.",
            "error"
        );

        return false;

    }

    if(user.password!==password){

        SentinelLink.UI.toast(
            "Incorrect password.",
            "error"
        );

        return false;

    }

    SentinelLink.saveSession(user);

    if(document.getElementById("rememberMe")?.checked){

        localStorage.setItem(
            "sl_remember",
            username
        );

    }else{

        localStorage.removeItem(
            "sl_remember"
        );

    }

    SentinelLink.UI.toast(
        "Login successful.",
        "success"
    );

    setTimeout(function(){

        window.location.href="dashboard.html";

    },800);

    return true;

};

/*=========================================================
    Logout
=========================================================*/

SentinelLink.Auth.logout=function(){

    SentinelLink.logoutSession();

    SentinelLink.UI.toast(
        "Logged out successfully.",
        "success"
    );

    setTimeout(function(){

        window.location.href="login.html";

    },500);

};

/*=========================================================
    Session Protection
=========================================================*/

SentinelLink.Auth.protect=function(){

    const publicPages=[

        "index.html",

        "login.html",

        "about.html",

        "help.html"

    ];

    const page=SentinelLink.page();

    if(publicPages.includes(page)){

        return;

    }

    if(!SentinelLink.isLoggedIn()){

        window.location.href="login.html";

    }

};

/*=========================================================
    Auto Redirect
=========================================================*/

SentinelLink.Auth.redirectLoggedIn=function(){

    const page=SentinelLink.page();

    if(

        page==="login.html" &&

        SentinelLink.isLoggedIn()

    ){

        window.location.href="dashboard.html";

    }

};

/*=========================================================
    Session Timeout
=========================================================*/

SentinelLink.Auth.startSessionMonitor=function(){

    const LIMIT=30*60*1000;

    function update(){

        localStorage.setItem(

            "sl_activity",

            Date.now()

        );

    }

    function check(){

        if(!SentinelLink.isLoggedIn()){

            return;

        }

        const last=Number(

            localStorage.getItem(

                "sl_activity"

            )

        );

        if(

            last &&

            Date.now()-last>LIMIT

        ){

            SentinelLink.Auth.logout();

        }

    }

    [

        "click",

        "keydown",

        "touchstart",

        "mousemove"

    ].forEach(function(eventName){

        document.addEventListener(

            eventName,

            update

        );

    });

    setInterval(check,60000);

};

/*=========================================================
    Login Form
=========================================================*/

SentinelLink.Auth.initializeLogin=function(){

    const form=document.getElementById(

        "loginForm"

    );

    if(!form){

        return;

    }

    const remembered=

    localStorage.getItem(

        "sl_remember"

    );

    if(remembered){

        const username=

        document.getElementById(

            "username"

        );

        if(username){

            username.value=remembered;

        }

        const remember=

        document.getElementById(

            "rememberMe"

        );

        if(remember){

            remember.checked=true;

        }

    }

    form.addEventListener(

        "submit",

        function(event){

            event.preventDefault();

            SentinelLink.Auth.login(

                document.getElementById(

                    "username"

                ).value,

                document.getElementById(

                    "password"

                ).value

            );

        }

    );

};

/*=========================================================
    Current User
=========================================================*/

SentinelLink.Auth.showCurrentUser=function(){

    const element=document.getElementById(

        "currentUser"

    );

    if(

        !element ||

        !SentinelLink.isLoggedIn()

    ){

        return;

    }

    element.textContent=

    SentinelLink.currentUser.name;

};

/*=========================================================
    Logout Button
=========================================================*/

SentinelLink.Auth.initializeLogout=function(){

    const button=document.getElementById(

        "logoutButton"

    );

    if(!button){

        return;

    }

    button.addEventListener(

        "click",

        SentinelLink.Auth.logout

    );

};
/*=========================================================
    Report Manager
=========================================================*/

SentinelLink.Reports = {};

/*=========================================================
    Get All Reports
=========================================================*/

SentinelLink.Reports.all = function(){

    return SentinelLink.getReports();

};

/*=========================================================
    Save
=========================================================*/

SentinelLink.Reports.save = function(reports){

    SentinelLink.saveReports(reports);

};

/*=========================================================
    Create Report
=========================================================*/

SentinelLink.Reports.create = function(data){

    const reports = SentinelLink.Reports.all();

    const report = {

        id: SentinelLink.uuid(),

        reporter: data.reporter,

        phone: data.phone,

        category: data.category,

        priority: data.priority,

        location: data.location,

        description: data.description,

        status: "Pending",

        createdBy: SentinelLink.currentUser ?
        SentinelLink.currentUser.username :
        "Guest",

        createdAt: SentinelLink.now(),

        updatedAt: SentinelLink.now()

    };

    reports.unshift(report);

    SentinelLink.Reports.save(reports);

    SentinelLink.UI.toast(

        "Report submitted successfully.",

        "success"

    );

    return report;

};

/*=========================================================
    Find Report
=========================================================*/

SentinelLink.Reports.find = function(id){

    return SentinelLink.Reports.all()

    .find(function(report){

        return report.id===id;

    });

};

/*=========================================================
    Delete Report
=========================================================*/

SentinelLink.Reports.remove = function(id){

    const reports =

    SentinelLink.Reports.all()

    .filter(function(report){

        return report.id!==id;

    });

    SentinelLink.Reports.save(reports);

    SentinelLink.UI.toast(

        "Report deleted.",

        "success"

    );

};

/*=========================================================
    Update Status
=========================================================*/

SentinelLink.Reports.updateStatus=function(

    id,

    status

){

    const reports=

    SentinelLink.Reports.all();

    const report=

    reports.find(function(item){

        return item.id===id;

    });

    if(!report){

        return false;

    }

    report.status=status;

    report.updatedAt=

    SentinelLink.now();

    SentinelLink.Reports.save(reports);

    return true;

};

/*=========================================================
    Search
=========================================================*/

SentinelLink.Reports.search=function(keyword){

    keyword=

    keyword.toLowerCase();

    return SentinelLink.Reports.all()

    .filter(function(report){

        return JSON.stringify(report)

        .toLowerCase()

        .includes(keyword);

    });

};

/*=========================================================
    Filter
=========================================================*/

SentinelLink.Reports.filterStatus=function(status){

    if(status==="All"){

        return SentinelLink.Reports.all();

    }

    return SentinelLink.Reports.all()

    .filter(function(report){

        return report.status===status;

    });

};

/*=========================================================
    Validate Report
=========================================================*/

SentinelLink.Reports.validate=function(data){

    if(!data.reporter.trim()){

        SentinelLink.UI.toast(

            "Reporter name required.",

            "error"

        );

        return false;

    }

    if(!data.phone.trim()){

        SentinelLink.UI.toast(

            "Phone number required.",

            "error"

        );

        return false;

    }

    if(!data.location.trim()){

        SentinelLink.UI.toast(

            "Location required.",

            "error"

        );

        return false;

    }

    if(!data.description.trim()){

        SentinelLink.UI.toast(

            "Description required.",

            "error"

        );

        return false;

    }

    return true;

};

/*=========================================================
    Report Form
=========================================================*/

SentinelLink.Reports.initializeForm=function(){

    const form=

    document.getElementById(

        "reportForm"

    );

    if(!form){

        return;

    }

    form.addEventListener(

        "submit",

        function(event){

            event.preventDefault();

            const data={

                reporter:

                document.getElementById("reporter").value,

                phone:

                document.getElementById("phone").value,

                category:

                document.getElementById("category").value,

                priority:

                document.getElementById("priority").value,

                location:

                document.getElementById("location").value,

                description:

                document.getElementById("description").value

            };

            if(

                !SentinelLink.Reports.validate(data)

            ){

                return;

            }

            SentinelLink.Reports.create(data);

            form.reset();

        }

    );

};

/*=========================================================
    Export
=========================================================*/

SentinelLink.Reports.exportJSON=function(){

    const blob=new Blob(

        [

            JSON.stringify(

                SentinelLink.Reports.all(),

                null,

                2

            )

        ],

        {

            type:"application/json"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const link=

    document.createElement("a");

    link.href=url;

    link.download="reports.json";

    link.click();

    URL.revokeObjectURL(url);

};
/*=========================================================
    Dashboard & Reports UI
=========================================================*/

SentinelLink.Dashboard = {};
SentinelLink.ReportUI = {};

/*=========================================================
    Dashboard Statistics
=========================================================*/

SentinelLink.Dashboard.statistics=function(){

    const reports=SentinelLink.Reports.all();

    return{

        total:reports.length,

        pending:reports.filter(r=>r.status==="Pending").length,

        active:reports.filter(r=>r.status==="Active").length,

        resolved:reports.filter(r=>r.status==="Resolved").length

    };

};

/*=========================================================
    Update Dashboard Cards
=========================================================*/

SentinelLink.Dashboard.refresh=function(){

    const stats=

    SentinelLink.Dashboard.statistics();

    const ids={

        totalReports:stats.total,

        pendingReports:stats.pending,

        activeReports:stats.active,

        resolvedReports:stats.resolved

    };

    Object.keys(ids).forEach(function(id){

        const element=document.getElementById(id);

        if(element){

            element.textContent=ids[id];

        }

    });

};

/*=========================================================
    Recent Reports
=========================================================*/

SentinelLink.Dashboard.recent=function(){

    const container=

    document.getElementById(

        "recentReports"

    );

    if(!container){

        return;

    }

    const reports=

    SentinelLink.Reports.all()

    .slice(0,5);

    if(reports.length===0){

        container.innerHTML=

        "<p>No reports available.</p>";

        return;

    }

    container.innerHTML=

    reports.map(function(report){

        return `

        <div class="recent-report">

            <strong>${report.category}</strong>

            <br>

            ${report.location}

            <br>

            ${report.status}

            <br>

            <small>${report.createdAt}</small>

        </div>

        `;

    }).join("");

};

/*=========================================================
    Report Row
=========================================================*/

SentinelLink.ReportUI.row=function(report){

    return `

<tr>

<td>${report.id}</td>

<td>${report.reporter}</td>

<td>${report.category}</td>

<td>${report.priority}</td>

<td>${report.location}</td>

<td>${report.status}</td>

<td>

<select
onchange="SentinelLink.ReportUI.changeStatus('${report.id}',this.value)">

<option value="Pending"
${report.status==="Pending"?"selected":""}>
Pending
</option>

<option value="Active"
${report.status==="Active"?"selected":""}>
Active
</option>

<option value="Resolved"
${report.status==="Resolved"?"selected":""}>
Resolved
</option>

</select>

</td>

<td>

<button
onclick="SentinelLink.ReportUI.remove('${report.id}')">

Delete

</button>

</td>

</tr>

`;

};

/*=========================================================
    Render Table
=========================================================*/

SentinelLink.ReportUI.render=function(list=null){

    const body=

    document.getElementById(

        "reportsTable"

    );

    if(!body){

        return;

    }

    const reports=

    list ||

    SentinelLink.Reports.all();

    if(reports.length===0){

        body.innerHTML=

        `<tr>

        <td colspan="8">

        No reports found.

        </td>

        </tr>`;

        return;

    }

    body.innerHTML=

    reports.map(

        SentinelLink.ReportUI.row

    ).join("");

};

/*=========================================================
    Search
=========================================================*/

SentinelLink.ReportUI.initializeSearch=function(){

    const search=

    document.getElementById(

        "searchReports"

    );

    if(!search){

        return;

    }

    search.addEventListener(

        "input",

        function(){

            const value=

            search.value.trim();

            if(value===""){

                SentinelLink.ReportUI.render();

                return;

            }

            SentinelLink.ReportUI.render(

                SentinelLink.Reports.search(value)

            );

        }

    );

};

/*=========================================================
    Status
=========================================================*/

SentinelLink.ReportUI.changeStatus=function(

    id,

    status

){

    SentinelLink.Reports.updateStatus(

        id,

        status

    );

    SentinelLink.ReportUI.render();

    SentinelLink.Dashboard.refresh();

};

/*=========================================================
    Delete
=========================================================*/

SentinelLink.ReportUI.remove=function(id){

    if(

        !confirm(

            "Delete this report?"

        )

    ){

        return;

    }

    SentinelLink.Reports.remove(id);

    SentinelLink.ReportUI.render();

    SentinelLink.Dashboard.refresh();

};

/*=========================================================
    Auto Refresh
=========================================================*/

SentinelLink.Dashboard.start=function(){

    SentinelLink.Dashboard.refresh();

    SentinelLink.Dashboard.recent();

    setInterval(function(){

        SentinelLink.Dashboard.refresh();

        SentinelLink.Dashboard.recent();

    },3000);

};

/*=========================================================
    Reports Page Start
=========================================================*/

SentinelLink.ReportUI.start=function(){

    SentinelLink.ReportUI.render();

    SentinelLink.ReportUI.initializeSearch();

};
/*=========================================================
    UI Module
=========================================================*/

SentinelLink.UI = {};

/*=========================================================
    Toast Notification
=========================================================*/

SentinelLink.UI.toast=function(message,type="info"){

    let toast=document.getElementById("sl-toast");

    if(!toast){

        toast=document.createElement("div");

        toast.id="sl-toast";

        toast.style.position="fixed";
        toast.style.bottom="20px";
        toast.style.right="20px";
        toast.style.padding="14px 20px";
        toast.style.borderRadius="8px";
        toast.style.color="#ffffff";
        toast.style.fontWeight="600";
        toast.style.zIndex="9999";
        toast.style.display="none";

        document.body.appendChild(toast);

    }

    const colours={

        success:"#16a34a",

        error:"#dc2626",

        warning:"#d97706",

        info:"#2563eb"

    };

    toast.style.background=

    colours[type]||

    colours.info;

    toast.textContent=message;

    toast.style.display="block";

    clearTimeout(toast.timer);

    toast.timer=setTimeout(function(){

        toast.style.display="none";

    },3000);

};

/*=========================================================
    Loading Overlay
=========================================================*/

SentinelLink.UI.showLoading=function(text="Loading..."){

    let overlay=

    document.getElementById(

        "sl-loading"

    );

    if(!overlay){

        overlay=document.createElement("div");

        overlay.id="sl-loading";

        overlay.style.position="fixed";
        overlay.style.top="0";
        overlay.style.left="0";
        overlay.style.width="100%";
        overlay.style.height="100%";
        overlay.style.background="rgba(0,0,0,.45)";
        overlay.style.display="flex";
        overlay.style.alignItems="center";
        overlay.style.justifyContent="center";
        overlay.style.color="#fff";
        overlay.style.fontSize="22px";
        overlay.style.zIndex="9998";

        document.body.appendChild(

            overlay

        );

    }

    overlay.textContent=text;

    overlay.style.display="flex";

};

SentinelLink.UI.hideLoading=function(){

    const overlay=

    document.getElementById(

        "sl-loading"

    );

    if(overlay){

        overlay.style.display="none";

    }

};

/*=========================================================
    Analytics
=========================================================*/

SentinelLink.Analytics={};

SentinelLink.Analytics.statistics=function(){

    const reports=

    SentinelLink.Reports.all();

    const stats={

        total:reports.length,

        pending:0,

        active:0,

        resolved:0,

        categories:{}

    };

    reports.forEach(function(report){

        if(

            report.status==="Pending"

        ){

            stats.pending++;

        }

        if(

            report.status==="Active"

        ){

            stats.active++;

        }

        if(

            report.status==="Resolved"

        ){

            stats.resolved++;

        }

        stats.categories[

            report.category

        ]=(

            stats.categories[

                report.category

            ]||0

        )+1;

    });

    return stats;

};

/*=========================================================
    Update Analytics Page
=========================================================*/

SentinelLink.Analytics.refresh=function(){

    const stats=

    SentinelLink.Analytics.statistics();

    const ids={

        analyticsTotal:

        stats.total,

        analyticsPending:

        stats.pending,

        analyticsActive:

        stats.active,

        analyticsResolved:

        stats.resolved

    };

    Object.keys(ids).forEach(function(id){

        const element=

        document.getElementById(id);

        if(element){

            element.textContent=

            ids[id];

        }

    });

    const categories=

    document.getElementById(

        "analyticsCategories"

    );

    if(categories){

        categories.innerHTML=

        "";

        Object.keys(

            stats.categories

        ).forEach(function(name){

            const item=

            document.createElement("li");

            item.textContent=

            name+

            ": "+

            stats.categories[name];

            categories.appendChild(item);

        });

    }

};

/*=========================================================
    Confirm Dialog
=========================================================*/

SentinelLink.UI.confirm=function(

    message

){

    return confirm(message);

};

/*=========================================================
    Empty State
=========================================================*/

SentinelLink.UI.empty=function(

    element,

    text

){

    if(element){

        element.innerHTML=

        "<p>"+text+"</p>";

    }

};

/*=========================================================
    END PART 5
=========================================================*/
/*=========================================================
    SentinelLink Beta v2.0
    Final Initializer
=========================================================*/

SentinelLink.App = {};

/*=========================================================
    Router
=========================================================*/

SentinelLink.App.page = function () {

    return window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

};

/*=========================================================
    Protected Pages
=========================================================*/

SentinelLink.App.protect = function () {

    const publicPages = [

        "",

        "index.html",

        "login.html",

        "about.html",

        "help.html"

    ];

    const page = SentinelLink.App.page();

    if (publicPages.includes(page)) {

        return;

    }

    if (!SentinelLink.isLoggedIn()) {

        window.location.href = "login.html";

    }

};

/*=========================================================
    Dashboard
=========================================================*/

SentinelLink.App.dashboard = function () {

    SentinelLink.Dashboard.refresh();

    SentinelLink.Dashboard.recent();

    if (SentinelLink.settings.autoRefresh) {

        setInterval(function () {

            SentinelLink.Dashboard.refresh();

            SentinelLink.Dashboard.recent();

        }, SentinelLink.settings.refreshRate);

    }

};

/*=========================================================
    Reports
=========================================================*/

SentinelLink.App.reports = function () {

    SentinelLink.ReportUI.start();

};

/*=========================================================
    Report Form
=========================================================*/

SentinelLink.App.reportForm = function () {

    SentinelLink.Reports.initializeForm();

};

/*=========================================================
    Analytics
=========================================================*/

SentinelLink.App.analytics = function () {

    SentinelLink.Analytics.refresh();

    if (SentinelLink.settings.autoRefresh) {

        setInterval(function () {

            SentinelLink.Analytics.refresh();

        }, SentinelLink.settings.refreshRate);

    }

};

/*=========================================================
    Authentication
=========================================================*/

SentinelLink.App.authentication = function () {

    SentinelLink.Auth.initializeLogin();

    SentinelLink.Auth.initializeLogout();

    SentinelLink.Auth.showCurrentUser();

    SentinelLink.Auth.redirectLoggedIn();

    SentinelLink.Auth.startSessionMonitor();

};

/*=========================================================
    Page Loader
=========================================================*/

SentinelLink.App.loadPage = function () {

    switch (SentinelLink.App.page()) {

        case "dashboard.html":

            SentinelLink.App.dashboard();

            break;

        case "report.html":

            SentinelLink.App.reportForm();

            break;

        case "reports.html":

            SentinelLink.App.reports();

            break;

        case "analytics.html":

            SentinelLink.App.analytics();

            break;

        default:

            break;

    }

};

/*=========================================================
    Application Start
=========================================================*/

SentinelLink.App.start = function () {

    SentinelLink.App.protect();

    SentinelLink.App.authentication();

    SentinelLink.App.loadPage();

    console.log(

        SentinelLink.appName +

        " " +

        SentinelLink.version +

        " started successfully."

    );

};

/*=========================================================
    DOM Ready
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    function () {

        SentinelLink.App.start();

    }

);

/*=========================================================
    End of app.js
=========================================================*/