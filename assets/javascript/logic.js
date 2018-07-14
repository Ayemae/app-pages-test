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
    this.priorityRating = 0;
    this.isSticky = false;
    this.evalGroup = "";
    this.appStatus = "";
    this.userVoted = false;
    this.appQuorum = {
        hasMetQuorum: false,
        toHitQuorum: quorum,
        withinQuorum: 0,
    }
    this.calcQuorumVals = function () {
        this.appQuorum.toHitQuorum = quorum - this.totalVotes;
        this.appQuorum.withinQuorum = quorum - this.appQuorum.toHitQuorum;
        if (this.appQuorum.toHitQuorum <= 0) {
            this.appQuorum.hasMetQuorum = true;
        }
        return this.appQuorum;
    }
    this.appHTML =
        `<div id="${this.id}" class="app-thread ${this.appStatus}" data-name="${this.id}">
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
        if (this.appQuorum.hasMetQuorum === false) {
            this.meterSize = this.totalVotes + this.appQuorum.toHitQuorum;
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
            if (this.totalVotes) {
                var a = this.yesVotes / this.totalVotes;
                this.approval = Math.round(a * 100);
            }
            return this.approval;
        },
        this.calcPriority = function () {
            var bump = 1;
            var votesNeeded = 1;
            var ambiguity = 1;
            var closeness = Math.abs(58 - this.approval);
            if (this.appQuorum.hasMetQuorum === false) {
                votesNeeded = parseFloat(this.appQuorum.withinQuorum * .033);
            }
            if (closeness < 10) {
                var ambiguity = (10 - closeness);
                if (this.approval < 50) {
                    ambiguity = parseFloat(ambiguity * 2);
                } // FIX THIS
                ambiguity = ( 1 - parseFloat(ambiguity * .01));
            }
            if (votesNeeded < 1 || ambiguity < 1) {
                bump = parseFloat(votesNeeded * ambiguity).toFixed(3);
                console.log(this.name + bump)
            }
            this.priorityRating = parseFloat(this.totalVotes * bump).toFixed(3);
            return this.priorityRating;
        }
    this.updateStats = function () {
        this.calcTotalVotes();
        this.calcQuorumVals();
        this.calcMeter();
        this.yesVoteMeter();
        this.noVoteMeter();
        this.calcApproval();
        this.calcPriority();
        // console.log(this.name + " priority: " + this.priorityRating)
    },
        this.updateHTML = function () {
            $(`#quorum-${this.id}`).text(this.totalVotes + "/" + quorum + " votes")
            $(`#approval-${this.id}`).text(this.approval + "%")
            $(`#yMeter-${this.id}`).animate({ width: this.yesMeterP + "%" }, { duration: 0 })
            $(`#nMeter-${this.id}`).animate({ width: this.noMeterP + "%" }, { duration: 0 })
        }
}

var spooky_comic = new Application("spooky_comic", "Spooky Comic");
var sciFi_Soap_Opera = new Application("sciFi_Soap_Opera", "Sci-Fi Soap Opera");
var world_hoppers = new Application("world_hoppers", "World Hoppers");
var martial_art_endworld = new Application("martial_art_endworld", "Martial Art Endworld");

var applications = [spooky_comic, sciFi_Soap_Opera, world_hoppers, martial_art_endworld]




$(document).ready(function () {

    function sortApps() {
        var appClass = [".sticky", ".need-votes", ".met-quorum", ".has-voted", ".triaged", ".accepted", ".declined"];
        for (var i = 0; i < appClass.length; i++) {
            $(appClass[i]).empty();
        }

        function compare(a,b) {
            if (a.priorityRating < b.priorityRating)
              return -1;
            if (a.priorityRating > b.priorityRating)
              return 1;
            return 0;
          }
          
          applications.sort(compare);

        for (var i = 0; i < applications.length; i++) {
            // is app sticky?
            if (applications[i].isSticky === true) {
                $(".sticky").append(applications[i].appHTML);
            } // is app closed?
            else if (applications[i].appStatus === "accepted") {
                $(".accepted").append(applications[i].appHTML);
            } else if (applications[i].appStatus === "declined") {
                $(".declined").append(applications[i].appHTML);
            } else if (applications[i].appStatus === "triaged") {
                $(".triaged").append(applications[i].appHTML);
            } // has user voted?
            else if (applications[i].userVoted === true) {
                $(".has-voted").append(applications[i].appHTML);
            } // else
            else if (applications[i].appQuorum.hasMetQuorum === true) {
                $(".met-quorum").append(applications[i].appHTML)
            } else {
                $(".need-votes").append(applications[i].appHTML)
            }
            applications[i].updateStats();
            applications[i].updateHTML();
        }
    }

    sortApps();


    $(document.body).on("click", "#yes", function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        thisApp.yesVotes++;
        thisApp.updateStats();
        thisApp.updateHTML();
        sortApps();
    })

    $(document.body).on("click", "#no", function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        thisApp.noVotes++;
        thisApp.updateStats();
        thisApp.updateHTML();
        sortApps();
    })



}); //end doc ready