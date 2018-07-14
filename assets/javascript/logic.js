var quorum = 30;

function Application(id, name) {
    this.id = id;
    this.name = name;
    this.tags = [];
    this.yesVotes = 0;
    this.noVotes = 0;
    this.totalVotes = 0;
    this.calcTotalVotes = function () {
        this.totalVotes = this.yesVotes + this.noVotes;
        return this.totalVotes;
    }
    this.meterSize = 0;
    this.quorumLeft = 0;
    this.yesMeterP = 0;
    this.noMeterP = 0;
    this.approval = 0;
    this.appHTML = 
    `<div id="${this.id}" class="app-thread" data-name="${this.id}">
    <div class="app-top-row">
        <div class="vote-status"></div>
        <div class="app-name">${this.name}</div>
        <div class="vote-meter">
            <span id="quorum-${this.id}" class="quorum">${this.totalVotes}/${quorum} votes</span>
            <div id="yMeter-${this.id}" class="yes-meter"></div>
            <div id="nMeter-${this.id}" class="no-meter"></div>
        </div>
        <div class="approval">Approval:
            <span id="approval-${this.id}">\n${this.approval}%</span>
        </div>
    </div>
    <div style="display: inline-block;">
            <button id="yes" data-name="${this.id}">Yes</button>
            <button id="no" data-name="${this.id}">No</button>
        </div>
    <div id="tags">
        Tags: 
    </div>
</div>`;
    this.calcMeter = function () {
        var quRemainder = quorum - this.totalVotes;
        if (quRemainder > -1) {
            this.quorumLeft = quorum - quRemainder;
            this.meterSize = this.totalVotes + quRemainder;
        } else {
            this.meterSize = this.totalVotes;
        }
        return this.meterSize;
    },
        this.yesVoteMeter = function () {
            var a = this.yesVotes / this.meterSize;
            this.yesMeterP = Math.round(a * 100);
            return this.yesMeterP;
        },
        this.noVoteMeter = function () {
            var a = this.noVotes / this.meterSize;
            this.noMeterP = Math.round(a * 100);
            return this.noMeterP;
        },
        this.calcApproval = function () {
            var a = this.yesVotes / this.totalVotes;
            this.approval = Math.round(a * 100);
            return this.approval;
        },
        this.updateStats = function () {
            this.calcTotalVotes();
            this.calcMeter();
            this.yesVoteMeter();
            this.noVoteMeter();
            this.calcApproval();
            console.log("totalVotes: " + this.totalVotes)
        }
        this.updateHTML = function() {
            $(`#quorum-${this.id}`).text(this.totalVotes + "/" + quorum + " votes")
            $(`#approval-${this.id}`).text(this.approval + "%")
            $(`#yMeter-${this.id}`).animate({ width: this.yesMeterP + "%" }, { duration: 10 })
            $(`#nMeter-${this.id}`).animate({ width: this.noMeterP + "%" }, { duration: 10 })
        }
}

var spooky_comic = new Application("spooky_comic", "Spooky Comic");
var sciFi_Soap_Opera = new Application("sciFi_Soap_Opera", "Sci-Fi Soap Opera");

var applications = [spooky_comic, sciFi_Soap_Opera]




$(document).ready(function () {

    for (var i = 0; i < applications.length; i++) {
        console.log(applications[i])
        $(".app-index").append(applications[i].appHTML)
    }


    $(document.body).on("click", `#yes`, function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        thisApp.yesVotes++;
        console.log("You voted yes.")
        thisApp.updateStats();
        thisApp.updateHTML();
    })

    $(document.body).on("click", `#no`, function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        thisApp.noVotes++;
        console.log("You voted no.")
        thisApp.updateStats();
        thisApp.updateHTML();
    })



}); //end doc ready