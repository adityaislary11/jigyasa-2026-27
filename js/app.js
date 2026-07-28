/* ===========================================================
   SentinelLink
   app.js
   Global Application Script
   Part 1/5
=========================================================== */

"use strict";

/* ===========================================================
   APPLICATION
=========================================================== */

const SentinelLink = {

    appName: "SentinelLink",

    version: "1.0",

    storagePrefix: "sentinellink_",

    currentUser: null,

    currentTheme: "dark",

    notifications: [],

    reports: [],

    settings: {},

    initialized: false

};

/* ===========================================================
   DOM HELPERS
=========================================================== */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

const create = (tag) => document.createElement(tag);

/* ===========================================================
   UTILITIES
=========================================================== */

function generateID(prefix = "SL"){

    return prefix +
           "-" +
           Date.now() +
           "-" +
           Math.floor(Math.random()*9999);

}

function getCurrentDate(){

    return new Date().toLocaleDateString();

}

function getCurrentTime(){

    return new Date().toLocaleTimeString();

}

function getCurrentDateTime(){

    return new Date().toLocaleString();

}

function formatDate(date){

    return new Date(date).toLocaleDateString();

}

function formatTime(date){

    return new Date(date).toLocaleTimeString();

}

function delay(ms){

    return new Promise(resolve=>setTimeout(resolve,ms));

}

/* ===========================================================
   LOCAL STORAGE
=========================================================== */

function save(key,value){

    localStorage.setItem(

        SentinelLink.storagePrefix + key,

        JSON.stringify(value)

    );

}

function load(key,defaultValue=null){

    const value = localStorage.getItem(

        SentinelLink.storagePrefix + key

    );

    if(value===null){

        return defaultValue;

    }

    return JSON.parse(value);

}

function remove(key){

    localStorage.removeItem(

        SentinelLink.storagePrefix + key

    );

}

/* ===========================================================
   SESSION
=========================================================== */

function saveSession(user){

    SentinelLink.currentUser = user;

    save("session",user);

}

function loadSession(){

    SentinelLink.currentUser = load("session");

}

function logout(){

    remove("session");

    window.location.href="login.html";

}

/* ===========================================================
   LOGIN
=========================================================== */

function login(username,password){

    if(

        username.trim()==="" ||

        password.trim()===""

    ){

        showToast(

            "Please enter username and password",

            "warning"

        );

        return;

    }

    const user={

        id:generateID("USER"),

        username:username,

        role:"Administrator",

        login:getCurrentDateTime()

    };

    saveSession(user);

    showToast(

        "Login Successful",

        "success"

    );

    setTimeout(()=>{

        window.location.href="dashboard.html";

    },1000);

}

/* ===========================================================
   NAVIGATION
=========================================================== */

function navigate(page){

    window.location.href=page;

}

function setActiveMenu(){

    const page=

    window.location.pathname

    .split("/")

    .pop();

    $$(".menu a").forEach(link=>{

        link.classList.remove("active");

        if(

            link.getAttribute("href")===page

        ){

            link.classList.add("active");

        }

    });

}

/* ===========================================================
   MOBILE SIDEBAR
=========================================================== */

function toggleSidebar(){

    const sidebar=$(".sidebar");

    if(!sidebar)return;

    sidebar.classList.toggle("open");

}

/* ===========================================================
   PAGE TITLE
=========================================================== */

function setPageTitle(title){

    document.title=

    "SentinelLink | " + title;

}

/* ===========================================================
   USER INFO
=========================================================== */

function displayCurrentUser(){

    loadSession();

    if(!SentinelLink.currentUser)return;

    const userName=$(".user-name");

    if(userName){

        userName.textContent=

        SentinelLink.currentUser.username;

    }

}

/* ===========================================================
   END PART 1
=========================================================== */
/* ===========================================================
   SentinelLink
   app.js
   Part 2/5
   Notifications, Modals & UI
=========================================================== */

/* ===========================================================
   TOAST NOTIFICATIONS
=========================================================== */

function showToast(message,type="info"){

    let container=$("#toast-container");

    if(!container){

        container=create("div");

        container.id="toast-container";

        container.style.position="fixed";
        container.style.top="20px";
        container.style.right="20px";
        container.style.zIndex="9999";

        document.body.appendChild(container);

    }

    const toast=create("div");

    toast.className="toast " + type;

    toast.style.marginBottom="12px";
    toast.style.padding="14px 18px";
    toast.style.borderRadius="12px";
    toast.style.background="#0f172a";
    toast.style.color="#fff";
    toast.style.border="1px solid rgba(255,255,255,.1)";
    toast.style.boxShadow="0 12px 30px rgba(0,0,0,.3)";
    toast.style.opacity="0";
    toast.style.transition=".3s";

    switch(type){

        case "success":
            toast.style.borderLeft="5px solid #22c55e";
            break;

        case "warning":
            toast.style.borderLeft="5px solid #f59e0b";
            break;

        case "error":
            toast.style.borderLeft="5px solid #ef4444";
            break;

        default:
            toast.style.borderLeft="5px solid #3b82f6";

    }

    toast.textContent=message;

    container.appendChild(toast);

    requestAnimationFrame(()=>{

        toast.style.opacity="1";

    });

    setTimeout(()=>{

        toast.style.opacity="0";

        setTimeout(()=>{

            toast.remove();

        },300);

    },3000);

}

/* ===========================================================
   LOADING SCREEN
=========================================================== */

function showLoader(){

    let loader=$("#sl-loader");

    if(loader)return;

    loader=create("div");

    loader.id="sl-loader";

    loader.innerHTML=`
    <div class="loader-box">
        <h3>Loading...</h3>
    </div>
    `;

    loader.style.position="fixed";
    loader.style.inset="0";
    loader.style.background="rgba(7,17,31,.75)";
    loader.style.display="flex";
    loader.style.alignItems="center";
    loader.style.justifyContent="center";
    loader.style.zIndex="9998";

    document.body.appendChild(loader);

}

function hideLoader(){

    const loader=$("#sl-loader");

    if(loader){

        loader.remove();

    }

}

/* ===========================================================
   MODAL
=========================================================== */

function openModal(title,content){

    closeModal();

    const modal=create("div");

    modal.id="sl-modal";

    modal.style.position="fixed";
    modal.style.inset="0";
    modal.style.background="rgba(0,0,0,.55)";
    modal.style.display="flex";
    modal.style.alignItems="center";
    modal.style.justifyContent="center";
    modal.style.zIndex="9999";

    modal.innerHTML=`

    <div style="
        width:min(550px,92%);
        background:#0f172a;
        border-radius:18px;
        padding:24px;
        border:1px solid rgba(255,255,255,.08);
    ">

        <h2>${title}</h2>

        <div style="margin:18px 0;line-height:1.7;">
            ${content}
        </div>

        <button
        class="primary"
        onclick="closeModal()">

        Close

        </button>

    </div>

    `;

    document.body.appendChild(modal);

}

function closeModal(){

    const modal=$("#sl-modal");

    if(modal){

        modal.remove();

    }

}

/* ===========================================================
   CONFIRMATION
=========================================================== */

function confirmAction(message,callback){

    const confirmed=

    confirm(message);

    if(

        confirmed &&

        typeof callback==="function"

    ){

        callback();

    }

}

/* ===========================================================
   THEME
=========================================================== */

function loadTheme(){

    const theme=

    load("theme","dark");

    SentinelLink.currentTheme=

    theme;

    document.body.dataset.theme=

    theme;

}

function toggleTheme(){

    SentinelLink.currentTheme=

    SentinelLink.currentTheme==="dark"

    ?"light"

    :"dark";

    save(

        "theme",

        SentinelLink.currentTheme

    );

    document.body.dataset.theme=

    SentinelLink.currentTheme;

    showToast(

        "Theme updated",

        "success"

    );

}

/* ===========================================================
   KEYBOARD SHORTCUTS
=========================================================== */

document.addEventListener(

"keydown",

function(e){

    if(

        e.key==="Escape"

    ){

        closeModal();

    }

    if(

        e.ctrlKey &&

        e.key==="l"

    ){

        e.preventDefault();

        logout();

    }

}

);

/* ===========================================================
   SCROLL
=========================================================== */

function scrollTopPage(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/* ===========================================================
   COPY TO CLIPBOARD
=========================================================== */

function copyText(text){

    navigator.clipboard

    .writeText(text)

    .then(()=>{

        showToast(

            "Copied to clipboard",

            "success"

        );

    });

}

/* ===========================================================
   END PART 2
=========================================================== */
/* ===========================================================
   SentinelLink
   app.js
   Part 3/5
   Forms, Reports & Search
=========================================================== */

/* ===========================================================
   FORM VALIDATION
=========================================================== */

function validateRequired(form){

    let valid=true;

    const fields=

    form.querySelectorAll(

    "[required]"

    );

    fields.forEach(field=>{

        if(

            field.value.trim()===""

        ){

            field.style.borderColor=

            "#ef4444";

            valid=false;

        }else{

            field.style.borderColor="";

        }

    });

    return valid;

}

/* ===========================================================
   REPORT STORAGE
=========================================================== */

function getReports(){

    return load("reports",[]);

}

function saveReports(reports){

    save("reports",reports);

}

function createReport(data){

    const reports=getReports();

    const report={

        id:generateID("REP"),

        date:getCurrentDate(),

        time:getCurrentTime(),

        status:"Pending",

        ...data

    };

    reports.push(report);

    saveReports(reports);

    showToast(

        "Incident report submitted.",

        "success"

    );

    return report;

}

function updateReport(id,newData){

    const reports=getReports();

    const index=

    reports.findIndex(

    r=>r.id===id

    );

    if(index!==-1){

        reports[index]={

            ...reports[index],

            ...newData

        };

        saveReports(reports);

        showToast(

            "Report updated.",

            "success"

        );

    }

}

function deleteReport(id){

    let reports=getReports();

    reports=

    reports.filter(

    r=>r.id!==id

    );

    saveReports(reports);

    showToast(

        "Report deleted.",

        "warning"

    );

}

/* ===========================================================
   REPORT SEARCH
=========================================================== */

function searchReports(keyword){

    keyword=

    keyword.toLowerCase();

    return getReports().filter(

    report=>{

        return(

        report.id

        .toLowerCase()

        .includes(keyword)

        ||

        (report.category||"")

        .toLowerCase()

        .includes(keyword)

        ||

        (report.location||"")

        .toLowerCase()

        .includes(keyword)

        ||

        (report.status||"")

        .toLowerCase()

        .includes(keyword)

        );

    }

    );

}

/* ===========================================================
   REPORT FILTER
=========================================================== */

function filterReports(status){

    if(

        status==="All"

    ){

        return getReports();

    }

    return getReports().filter(

    report=>

    report.status===status

    );

}

/* ===========================================================
   SETTINGS
=========================================================== */

function loadSettings(){

    SentinelLink.settings=

    load(

    "settings",

    {

        theme:"dark",

        notifications:true,

        language:"English"

    }

    );

}

function saveSettings(){

    save(

    "settings",

    SentinelLink.settings

    );

    showToast(

        "Settings saved.",

        "success"

    );

}

/* ===========================================================
   NOTIFICATIONS
=========================================================== */

function getNotifications(){

    return load(

    "notifications",

    []

    );

}

function addNotification(

title,

message,

type="info"

){

    const notifications=

    getNotifications();

    notifications.unshift({

        id:generateID("NOT"),

        title,

        message,

        type,

        date:getCurrentDateTime(),

        read:false

    });

    save(

        "notifications",

        notifications

    );

}

function markNotificationRead(id){

    const list=

    getNotifications();

    const item=

    list.find(

    n=>n.id===id

    );

    if(item){

        item.read=true;

        save(

        "notifications",

        list

        );

    }

}

/* ===========================================================
   DASHBOARD COUNTERS
=========================================================== */

function totalReports(){

    return getReports().length;

}

function pendingReports(){

    return getReports()

    .filter(

    r=>r.status==="Pending"

    ).length;

}

function resolvedReports(){

    return getReports()

    .filter(

    r=>r.status==="Resolved"

    ).length;

}

function updateDashboardStats(){

    const total=$("#totalReports");

    const pending=$("#pendingReports");

    const resolved=$("#resolvedReports");

    if(total)

    total.textContent=

    totalReports();

    if(pending)

    pending.textContent=

    pendingReports();

    if(resolved)

    resolved.textContent=

    resolvedReports();

}

/* ===========================================================
   END PART 3
=========================================================== */
/* ===========================================================
   SentinelLink
   app.js
   Part 4/5
   Tables, Sessions & Utilities
=========================================================== */

/* ===========================================================
   REPORT TABLE RENDERING
=========================================================== */

function renderReportsTable(tableBodyId,reports){

    const tableBody=

    document.getElementById(tableBodyId);

    if(!tableBody)return;

    tableBody.innerHTML="";

    if(reports.length===0){

        tableBody.innerHTML=`
        <tr>
            <td colspan="6" style="text-align:center;">
                No reports found.
            </td>
        </tr>`;

        return;

    }

    reports.forEach(report=>{

        const row=document.createElement("tr");

        row.innerHTML=`

        <td>${report.id}</td>

        <td>${report.category||"-"}</td>

        <td>${report.location||"-"}</td>

        <td>${report.date}</td>

        <td>${report.status}</td>

        <td>

            <button
            class="small primary"
            onclick="viewReport('${report.id}')">

            View

            </button>

        </td>

        `;

        tableBody.appendChild(row);

    });

}

/* ===========================================================
   REPORT DETAILS
=========================================================== */

function viewReport(id){

    const report=

    getReports().find(

    r=>r.id===id

    );

    if(!report){

        showToast(

        "Report not found.",

        "error"

        );

        return;

    }

    openModal(

        "Incident Report",

        `
        <p><strong>ID:</strong> ${report.id}</p>
        <p><strong>Category:</strong> ${report.category||"-"}</p>
        <p><strong>Location:</strong> ${report.location||"-"}</p>
        <p><strong>Status:</strong> ${report.status}</p>
        <p><strong>Date:</strong> ${report.date}</p>
        <p><strong>Description:</strong><br>
        ${report.description||"No description"}
        </p>
        `

    );

}

/* ===========================================================
   SORT REPORTS
=========================================================== */

function sortReports(field){

    const reports=getReports();

    reports.sort((a,b)=>{

        if(a[field]<b[field]) return -1;

        if(a[field]>b[field]) return 1;

        return 0;

    });

    return reports;

}

/* ===========================================================
   SESSION CHECK
=========================================================== */

function requireLogin(){

    loadSession();

    const page=

    window.location.pathname

    .split("/")

    .pop();

    if(

        page!=="login.html" &&

        !SentinelLink.currentUser

    ){

        window.location.href=

        "login.html";

    }

}

/* ===========================================================
   USER PROFILE
=========================================================== */

function getCurrentUser(){

    loadSession();

    return SentinelLink.currentUser;

}

function updateCurrentUser(data){

    const user=

    getCurrentUser();

    if(!user)return;

    Object.assign(user,data);

    saveSession(user);

    displayCurrentUser();

}

/* ===========================================================
   AUTO SAVE
=========================================================== */

function autoSave(key,data){

    save(key,data);

}

/* ===========================================================
   EXPORT
=========================================================== */

function exportReports(){

    const data=

    JSON.stringify(

    getReports(),

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

    document.createElement(