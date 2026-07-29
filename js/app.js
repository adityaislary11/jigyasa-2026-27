/*
=================================================
 SentinelLink Beta
 Main Application Controller
 Part 1 - Authentication & Session Management
=================================================
*/


// ================================================
// Global Configuration
// ================================================

const SentinelApp = {

    version: "0.9",

    storageKeys: {

        session: "sentinelSession",

        reports: "sentinelReports",

        settings: "sentinelSettings"

    }

};



// ================================================
// Session Management
// ================================================


function getSession(){

    const localSession =
        localStorage.getItem(
            SentinelApp.storageKeys.session
        );


    const temporarySession =
        sessionStorage.getItem(
            SentinelApp.storageKeys.session
        );


    return JSON.parse(
        localSession ||
        temporarySession ||
        "null"
    );

}




function saveSession(userData, remember=false){


    const sessionData = {

        username:userData.username,

        role:userData.role || "Citizen",

        loginTime:new Date().toISOString()

    };



    const storage =
        remember
        ? localStorage
        : sessionStorage;



    storage.setItem(

        SentinelApp.storageKeys.session,

        JSON.stringify(sessionData)

    );


}




function clearSession(){


    localStorage.removeItem(
        SentinelApp.storageKeys.session
    );


    sessionStorage.removeItem(
        SentinelApp.storageKeys.session
    );


}



// ================================================
// Authentication Check
// ================================================


function isLoggedIn(){


    return getSession() !== null;


}





function requireLogin(){


    if(!isLoggedIn()){


        window.location.href =
            "login.html";


    }


}





// ================================================
// User Information
// ================================================


function getCurrentUser(){


    const session =
        getSession();


    if(session){

        return session.username;

    }


    return "Guest";


}



function getUserRole(){


    const session =
        getSession();


    if(session){

        return session.role;

    }


    return null;


}
/*
=================================================
 SentinelLink Beta
 Main Application Controller
 Part 2 - Reports & Statistics Management
=================================================
*/


// ================================================
// Report Database
// ================================================


function getReports(){

    const reports =

        localStorage.getItem(
            SentinelApp.storageKeys.reports
        );


    return JSON.parse(
        reports || "[]"
    );

}




function saveReports(reports){


    localStorage.setItem(

        SentinelApp.storageKeys.reports,

        JSON.stringify(reports)

    );


}





// ================================================
// Create New Report
// ================================================


function createReport(reportData){


    const reports =
        getReports();



    const newReport = {


        id:
            "SL-" +
            Date.now(),


        reporter:
            reportData.reporter || "Anonymous",


        contact:
            reportData.contact || "Not provided",


        type:
            reportData.type || "General Emergency",


        priority:
            reportData.priority || "Medium",


        location:
            reportData.location || "Unknown",


        description:
            reportData.description || "",


        status:
            "Pending",


        createdAt:
            new Date().toISOString()


    };



    reports.push(newReport);


    saveReports(reports);



    return newReport;


}





// ================================================
// Update Report
// ================================================


function updateReportStatus(id, newStatus){


    const reports =
        getReports();



    const updatedReports =
        reports.map(report => {


            if(report.id === id){


                report.status =
                    newStatus;


            }


            return report;


        });



    saveReports(updatedReports);



    return updatedReports;


}





// ================================================
// Delete Report
// ================================================


function deleteReport(id){


    const reports =
        getReports();



    const filteredReports =

        reports.filter(
            report =>
            report.id !== id
        );



    saveReports(filteredReports);


    return filteredReports;


}





// ================================================
// Report Statistics
// ================================================


function getStatistics(){


    const reports =
        getReports();



    return {


        total:

            reports.length,



        pending:

            reports.filter(
                report =>
                report.status === "Pending"
            ).length,



        active:

            reports.filter(
                report =>
                report.status === "Active"
            ).length,



        resolved:

            reports.filter(
                report =>
                report.status === "Resolved"
            ).length


    };


}





// ================================================
// Category Statistics
// ================================================


function getCategoryStats(){


    const reports =
        getReports();



    const categories = {};



    reports.forEach(report => {


        if(categories[report.type]){


            categories[report.type]++;


        }

        else{


            categories[report.type] = 1;


        }


    });



    return categories;


}





// ================================================
// Latest Reports
// ================================================


function getLatestReports(limit=5){


    const reports =
        getReports();



    return reports

        .sort(
            (a,b)=>
            new Date(b.createdAt)
            -
            new Date(a.createdAt)
        )

        .slice(0,limit);


}
/*
=================================================
 SentinelLink Beta
 Main Application Controller
 Part 3 - UI Control & Startup
=================================================
*/


// ================================================
// Logout
// ================================================


function logout(){


    clearSession();


    window.location.href =
        "login.html";


}





// ================================================
// Update Homepage Statistics
// ================================================


function updateStatisticsUI(){


    const stats =
        getStatistics();



    const total =
        document.getElementById(
            "totalReports"
        );


    const pending =
        document.getElementById(
            "pendingReports"
        );


    const active =
        document.getElementById(
            "activeReports"
        );


    const resolved =
        document.getElementById(
            "resolvedReports"
        );



    if(total){

        total.textContent =
            stats.total;

    }


    if(pending){

        pending.textContent =
            stats.pending;

    }


    if(active){

        active.textContent =
            stats.active;

    }


    if(resolved){

        resolved.textContent =
            stats.resolved;

    }


}





// ================================================
// Update User Information
// ================================================


function updateUserUI(){


    const username =
        getCurrentUser();



    const userElements =

        document.querySelectorAll(
            "[data-user]"
        );



    userElements.forEach(element => {


        element.textContent =
            username;


    });


}





// ================================================
// Recent Activity
// ================================================


function updateRecentActivity(){


    const container =
        document.getElementById(
            "recentActivity"
        );



    if(!container){

        return;

    }



    const reports =
        getLatestReports();



    if(reports.length === 0){


        container.innerHTML =
        `
        <li>
            No incidents available.
        </li>
        `;


        return;

    }




    container.innerHTML = "";



    reports.forEach(report => {


        const item =
            document.createElement("li");



        item.innerHTML =
        `
        <strong>
            ${report.type}
        </strong>

        <br>

        Status:
        ${report.status}

        <br>

        Location:
        ${report.location}

        `;



        container.appendChild(item);


    });


}





// ================================================
// Page Protection
// ================================================


function protectPages(){


    const currentPage =
        window.location.pathname;



    const protectedPages = [

        "dashboard.html",

        "report.html",

        "reports.html",

        "analytics.html",

        "settings.html",

        "admin.html"

    ];



    protectedPages.forEach(page => {


        if(currentPage.includes(page)){


            requireLogin();


        }


    });


}





// ================================================
// Application Startup
// ================================================


document.addEventListener(
    "DOMContentLoaded",
    function(){


        protectPages();


        updateStatisticsUI();


        updateUserUI();


        updateRecentActivity();



    }
);





// ================================================
// Global Error Handling
// ================================================


window.addEventListener(
    "error",
    function(event){


        console.error(
            "SentinelLink Error:",
            event.error
        );


    }
);