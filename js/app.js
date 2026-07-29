
// SentinelLink Beta
// Core Application Controller


const SentinelApp = {

    storageKeys: {

        users: "sentinel_users",

        session: "sentinel_session",

        reports: "sentinel_reports",

        settings: "sentinel_settings"

    }

};





// =============================
// INITIAL DATABASE SETUP
// =============================


function initializeDatabase(){


    if(
        !localStorage.getItem(
            SentinelApp.storageKeys.users
        )
    ){


        const defaultUsers = [

            {
                username:"admin",
                password:"admin123",
                role:"Administrator"
            }

        ];



        localStorage.setItem(

            SentinelApp.storageKeys.users,

            JSON.stringify(defaultUsers)

        );


    }




    if(
        !localStorage.getItem(
            SentinelApp.storageKeys.reports
        )
    ){


        localStorage.setItem(

            SentinelApp.storageKeys.reports,

            JSON.stringify([])

        );


    }


}







// =============================
// LOGIN SYSTEM
// =============================


function login(username,password){



    const users = JSON.parse(

        localStorage.getItem(
            SentinelApp.storageKeys.users
        )

    );





    const user = users.find(

        u =>
        u.username === username
        &&
        u.password === password

    );





    if(user){



        const session = {


            username:user.username,

            role:user.role,

            loginTime:
            new Date().toISOString()


        };




        localStorage.setItem(

            SentinelApp.storageKeys.session,

            JSON.stringify(session)

        );



        return true;


    }




    return false;


}








// =============================
// SESSION MANAGEMENT
// =============================


function getSession(){


    const session =

    localStorage.getItem(

        SentinelApp.storageKeys.session

    );



    return session

    ?

    JSON.parse(session)

    :

    null;


}







function requireLogin(){



    const session =
        getSession();



    if(!session){


        window.location.href =
        "login.html";


    }


}







function logout(){



    localStorage.removeItem(

        SentinelApp.storageKeys.session

    );



    window.location.href =
    "login.html";


}







initializeDatabase();

// =============================
// REPORT MANAGEMENT
// =============================



function getReports(){



    const reports =

    localStorage.getItem(

        SentinelApp.storageKeys.reports

    );



    return reports

    ?

    JSON.parse(reports)

    :

    [];

}







function saveReports(reports){



    localStorage.setItem(

        SentinelApp.storageKeys.reports,

        JSON.stringify(reports)

    );


}








// Create new incident report


function createReport(data){



    const reports =
        getReports();




    const report = {



        id:

        "SL-" +

        Date.now()
        .toString()
        .slice(-6),




        reporter:

        data.reporter,



        contact:

        data.contact,



        type:

        data.type,



        priority:

        data.priority,



        location:

        data.location,



        description:

        data.description,



        status:

        "Pending",




        createdAt:

        new Date()
        .toISOString()



    };





    reports.unshift(
        report
    );





    saveReports(
        reports
    );





    return report;


}








// Latest reports


function getLatestReports(limit=5){



    const reports =
        getReports();



    return reports.slice(
        0,
        limit
    );


}








// Update incident status


function updateReportStatus(
    id,
    newStatus
){



    const reports =
        getReports();




    const report =
        reports.find(

            r => r.id === id

        );





    if(report){


        report.status =
        newStatus;



        saveReports(
            reports
        );



        return true;


    }




    return false;


}








// Delete incident


function deleteReport(id){



    let reports =
        getReports();




    reports =

    reports.filter(

        report =>
        report.id !== id

    );




    saveReports(
        reports
    );


}








// Find single report


function getReportById(id){



    const reports =
        getReports();



    return reports.find(

        report =>
        report.id === id

    );


}

// =============================
// ANALYTICS SYSTEM
// =============================



function getStatistics(){



    const reports =
        getReports();




    let total =
        reports.length;



    let pending = 0;

    let active = 0;

    let resolved = 0;





    reports.forEach(report => {



        if(report.status === "Pending"){

            pending++;

        }



        else if(report.status === "Active"){

            active++;

        }



        else if(report.status === "Resolved"){

            resolved++;

        }



    });





    return {


        total,

        pending,

        active,

        resolved


    };


}








function getCategoryStats(){



    const reports =
        getReports();



    const categories = {};





    reports.forEach(report => {



        if(
            categories[report.type]
        ){


            categories[report.type]++;


        }

        else{


            categories[report.type] = 1;


        }



    });





    return categories;


}









// =============================
// SETTINGS MANAGEMENT
// =============================




function saveSettings(settings){



    localStorage.setItem(

        SentinelApp.storageKeys.settings,

        JSON.stringify(settings)

    );


}







function getSettings(){



    const settings =

    localStorage.getItem(

        SentinelApp.storageKeys.settings

    );




    return settings

    ?

    JSON.parse(settings)

    :

    {};



}









// =============================
// DATABASE CONTROL
// =============================




function resetDatabase(){



    localStorage.removeItem(

        SentinelApp.storageKeys.reports

    );



    localStorage.removeItem(

        SentinelApp.storageKeys.settings

    );




    initializeDatabase();


}









// =============================
// EXPORT DATA
// =============================



function exportReports(){



    const reports =
        getReports();




    return JSON.stringify(

        reports,

        null,

        2

    );


}