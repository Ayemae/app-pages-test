var quorum = 30;

function Application(id, name) {
    this.id = id;
    this.name = name;
    this.tags = [];
    this.yesVotes = 0;
    this.noVotes = 0;
    this.totalVotes = this.yesVotes + this.noVotes;
    this.meterSize = 0;
    this.quorumLeft = 0;
    this.yesMeter = 0;
    this.noMeter = 0;
    this.approval = 0;
    this.calcMeter = function () {
        var quRemainder = quorum - this.totalVotes;
        if (quRemainder > -1) {
            this.quorumLeft = quorum - quRemainder;
            this.meterSize = this.totalVotes + quRemainder;
        } else {
            meterSize = this.totalVotes;
        }
        return this.meterSize;
    },
        this.yesMeter = function () {
            var a = this.yesVotes / this.meterSize;
            yesMeter = Math.round(a * 100);
            return yesMeter;
        },
        this.noMeter = function () {
            var a = this.noVotes / this.meterSize;
            this.noMeter = Math.round(a * 100);
            return this.noMeter;
        },
        this.approval = function () {
            var a = this.yesVotes / this.totalVotes;
            approval = Math.round(a * 100);
            return approval;
        },
        this.updateStats = function () {
            this.calcMeter();
            this.yesVoteMeter();
            this.noVoteMeter();
            this.approvalRate();
            console.log("totalVotes: " + this.totalVotes)
        }
}

var spooky_comic = new Application("spooky_comic", "Spooky Comic");
var sciFi_Soap_Opera = new Application("sciFi_Soap_Opera", "Sci-Fi Soap Opera");

var applications = [spooky_comic, sciFi_Soap_Opera]




$(document).ready(function () {


    for (var i = 0; i < applications.length; i++) {
        var appHTML = $("<div id='app-thread' data-name=''><div class='app-top-row'>" +
            "<div id='vote-status'></div><div id='app-name'></div>" +
            "<div id='vote-meter'><span id='qu-meet'>0/30</span><div id='yes-meter'></div><div id='no-meter'></div></div>" +
            "<div class='approval'>Approval: <span id='approval'>0%</span></div></div>" +
            `<div style='display: inline-block;'><button id='yes'>Yes</button><button id='no'>No</button></div>` +
            "<div id='tags'></div></div>");
        $("#app-thread").attr("data-name", applications[i].id);
        $("#yes").attr("data-name", applications[i].id);
        $("#no").attr("data-name", applications[i].id);
        $("#app-name").text(applications[i].name);
        $("#app-index").append(appHTML).clone();
    }


    $(document.body).on("click", `#yes`, function () {
        var thisApp = $(this).attr("data-name");
        thisApp.yesVotes++;
        console.log("You voted yes.")
        console.log(thisApp)
        thisApp.updateStats();
        updateHTML();
    })

    $(document.body).on("click", `#no`, function () {
        var thisApp = $(this).attr("data-name");
        thisApp.noVotes++;
        console.log("You voted no.")
        console.log(thisApp.noVotes)
        thisApp.updateStats();
        updateHTML();
    })

    function updateHTML() {
        $("#qu-meet").html(this.totalVotes + "/" + quorum + " votes")
        $("#approval").html(this.approval + "%")
        $("#yes-meter").animate({ width: this.yesMeter + "%" }, { duration: 10 });
        $("#no-meter").animate({ width: this.noMeter + "%" }, { duration: 10 });
    }


}); //end doc ready