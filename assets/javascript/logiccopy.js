


var applications = ["spooky_comic", "sciFi_Soap_Opera"]
var appHTML = $("<div id='app-thread' data-name=''><div class='app-top-row'><div id='vote-status'></div><div id='app-name'></div>" +
    "<div id='vote-meter'><span id='qu-meet'>0/30</span><div id='yes-meter'></div><div id='no-meter'></div></div>" +
    "<div class='approval'>Approval: <span id='approval'>0%</span></div></div>" +
    "<div style='display: inline-block;'><button id='yes'>Yes</button><button id='no'>No</button></div>" +
    "<div id='tags'></div></div>");

var yesVotes;
var noVotes;
var quorum = 30;
var approval;
var vetos;
var meterSpace;
var yesMeter;
var noMeter;


function calcTotalVotes() {
    totalVotes = yesVotes + noVotes;
}

function calcQuorum() {
    var quRemainder = quorum - totalVotes;
    if (quRemainder > -1) {
        thisQuorum = quorum - quRemainder;
        meterSpace = totalVotes + quRemainder;
    } else {
        meterSpace = totalVotes;
    }
    console.log("MeterSpace: " + meterSpace)
    return meterSpace;
}

function approvalRate(yv, t) {
    var a = yv / t;
    approval = Math.round(a * 100);
    return approval;
}

function yesVoteMeter(ap, cq) {
    var a = ap / cq;
    yesMeter = Math.round(a * 100);
    return yesMeter;
}

function noVoteMeter(nv, cq) {
    var b = nv / cq;
    noMeter = Math.round(b * 100);
    return noMeter;
}



$(document).ready(function () {
         yesVotes = 0;
         noVotes = 0;


        $(document.body).on("click", "#yes", function () {
            var thisApp = $(this).attr("data-name");
            yesVotes++;
            console.log("You voted yes.")
            updateData();
        })

        $(document.body).on("click", "#no", function () {
            var thisApp = $(this).attr("data-name");
            noVotes++;
            console.log("You voted no.")
            updateData();
        })

    function updateData() {
        calcTotalVotes();
        calcQuorum();
        yesVoteMeter(yesVotes, meterSpace);
        noVoteMeter(noVotes, meterSpace);
        approvalRate(yesVotes, totalVotes);
        $("#qu-meet").html(totalVotes + "/" + quorum + " votes")
        $("#approval").html(approval + "%")
        $("#yes-meter").animate({ width: yesMeter + "%" }, { duration: 10 });
        $("#no-meter").animate({ width: noMeter + "%" }, { duration: 10 });
        console.log("totalVotes: " + totalVotes)
    }
}); //end doc ready