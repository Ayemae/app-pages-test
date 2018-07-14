var quorum = 30;

function Application(id, name) {
    this.id = id;
    this.name = name;
    this.tags = [];
    this.yesVotes = 0;
    this.noVotes = 0;
    this.calcTotalVotes = function () {
        totalVotes = this.yesVotes + this.noVotes;
        return totalVotes;
    }
    this.totalVotes = 0;
    this.meterSize = 0;
    this.quorumLeft = 0;
    this.yesMeterP = 0;
    this.noMeterP = 0;
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
        this.yesVoteMeter = function () {
            var a = this.yesVotes / this.meterSize;
            yesMeter = Math.round(a * 100);
            return yesMeter;
        },
        this.noVoteMeter = function () {
            var a = this.noVotes / this.meterSize;
            this.noMeter = Math.round(a * 100);
            return this.noMeter;
        },
        this.calcApproval = function () {
            var a = this.yesVotes / this.totalVotes;
            approval = Math.round(a * 100);
            return approval;
        },
        this.updateStats = function () {
            this.calcTotalVotes();
            this.calcMeter();
            this.yesVoteMeter();
            this.noVoteMeter();
            this.calcApproval();
            console.log("totalVotes: " + totalVotes)
        }
}

var spooky_comic = new Application("spooky_comic", "Spooky Comic");
var sciFi_Soap_Opera = new Application("sciFi_Soap_Opera", "Sci-Fi Soap Opera");

var applications = [spooky_comic, sciFi_Soap_Opera]




$(document).ready(function () {

    for (var i = 0; i < applications.length; i++) {

        console.log(applications[i])
        var appHTML = $(
            `<div id="${applications[i].id}" class="app-thread" data-name="${applications[i].id}">
            <div class="app-top-row">
                <div id="vote-status"></div>
                <div id="app-name">${applications[i].name}</div>
                <div id="vote-meter">
                    <span id="qu-meet">${applications[i].totalVotes}/${quorum}</span>
                    <div id="yes-meter"></div>
                    <div id="no-meter"></div>
                </div>
                <div class="approval">Approval:
                    <span id="approval">${applications[i].approval}</span>
                </div>
            </div>
            <div style="display: inline-block;">
                    <button id="yes" data-name="${applications[i].id}">Yes</button>
                    <button id="no" data-name="${applications[i].id}">No</button>
                </div>
            <div id="tags">
                Tags: 
            </div>
        </div>`
        );
        $(".app-index").append(appHTML)
    }


    $(document.body).on("click", `#yes`, function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        thisApp.yesVotes++;
        console.log("You voted yes.")
        console.log(thisApp.name)
        thisApp.updateStats();
        updateHTML(thisApp.id, thisApp.totalVotes, thisApp.yesMeterP, thisApp.noMeterP);
    })

    $(document.body).on("click", `#no`, function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        thisApp.noVotes++;
        console.log("You voted no.")
        thisApp.updateStats();
        updateHTML(thisApp.id, thisApp.totalVotes, thisApp.yesMeterP, thisApp.noMeterP);
    })

    function updateHTML(appID, appTVotes, appAprvl, appYMP, appNMP) {
        console.log(appTVotes)
        var thisApp = $(`#${appID}`);
        thisApp.html(
            $("#qu-meet").text(appTVotes + "/" + quorum + " votes"),
            $("#approval").text(appAprvl + "%"),
            $("#yes-meter").animate({ width: appYMP + "%" }, { duration: 10 }),
            $("#no-meter").animate({ width: appNMP + "%" }, { duration: 10 })
        )
    }


}); //end doc ready