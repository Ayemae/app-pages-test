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
    this.priorityRating = 1;
    //this.isSticky = false;
    this.evalGroup = "";
    this.appStatus = "open";
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
            <button id="${this.id}-yes" class="yes" data-name="${this.id}">Yes</button>
            <button id="${this.id}-no" class="no" data-name="${this.id}">No</button>
            <button id="sticky" data-name="${this.id}">Sticky</button>
            <button id="triage" data-name="${this.id}">Triage</button>
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
            //defaults
            var bump = 1;
            var votesNeeded = 1;
            var ambiguity = 1;

            // First and foremost, the higher the "priortyRate" number is, the lower
            // its priority. Heavier numbers sink to the bottom.

            // how close is the approval rate? All negative numbers are flattened to real numbers
            var closeness = Math.abs(58 - this.approval);
            // If the application hasn't met quorum, then multiply the amount it needs
            // to hit quorum (+1, because anything multiplied by 0 is 0)
            if (this.appQuorum.hasMetQuorum === false) {
                votesNeeded = (parseFloat((this.appQuorum.withinQuorum + .5) * .033)).toFixed(3);
            }
            // If the approval rate is more than 22 points away from
            // 58, the ambiguity factor will decrease by 20%.
            if (this.totalVotes > 14 && closeness > 22) {
                ambiguity = parseFloat(1.2);
            }
            // If the approval rate is within 10 points of 58, then...
            else if (this.totalVotes > 1 && closeness < 9) {
                // We can't use 0, so add 1 to "closeness"
                var ambiguity = (closeness + 1);
                // If approval rating is LOWER than 55, reduce ambiguity to .12
                if (this.approval < 55) {
                    ambiguity = parseFloat(ambiguity * .12);
                }
                else {
                    // If approval rating is HIGHER than 55, reduce ambiguity further to .1
                    ambiguity = parseFloat(ambiguity * .1);
                }
            }
                bump = parseFloat(votesNeeded * ambiguity);
            // multiply the total votes by that bump, and then make the number easier to look at.
            this.priorityRating = ((parseFloat(this.totalVotes * bump) * 10) / 3).toFixed(2);
            return this.priorityRating;
        }
    this.updateStats = function () {
        console.log("*******************")
        this.calcTotalVotes();
        this.calcQuorumVals();
        this.calcMeter();
        this.yesVoteMeter();
        this.noVoteMeter();
        this.calcApproval();
        this.calcPriority();
    },
        this.updateHTML = function () {
            this.updateStats();
            console.log(this.name + ":" +
                "\nStatus is: " + this.appStatus,
                "\nPriority is: " + this.priorityRating, )
            $(`#${this.id}`).addClass(this.appStatus);
            $(`#quorum-${this.id}`).text(this.totalVotes + "/" + quorum + " votes");
            $(`#approval-${this.id}`).text(this.approval + "%");
            $(`#yMeter-${this.id}`).animate({ width: this.yesMeterP + "%" }, { duration: 0 });
            $(`#nMeter-${this.id}`).animate({ width: this.noMeterP + "%" }, { duration: 0 });
            if (this.appStatus == "triaged" ||
                this.appStatus == "declined" ||
                this.appStatus == "accepted") {
                    console.log(this.name + "'s buttons were hidden.")
                $(`#${this.id}-yes`).addClass("hide");
                $(`#${this.id}-no`).addClass("hide");
            }else if (this.appStatus == "open" || this.appStatus == "sticky") {
                $(`#${this.id}-yes`).removeClass("hide");
                $(`#${this.id}-no`).removeClass("hide");
            }
        }
}

var spooky_comic = new Application("spooky_comic", "Spooky Comic");
var sciFi_Soap_Opera = new Application("sciFi_Soap_Opera", "Sci-Fi Soap Opera");
var world_hoppers = new Application("world_hoppers", "World Hoppers");
var martial_art_endworld = new Application("martial_art_endworld", "Martial Art Endworld");

var applications = [spooky_comic, sciFi_Soap_Opera, world_hoppers, martial_art_endworld]




$(document).ready(function () {

    function sortApps() {
        console.log("*******************")
        var appClass = [".sticky-cat", ".need-votes-cat", ".met-quorum-cat", ".has-voted-cat", ".triaged-cat", ".accepted-cat", ".declined-cat"];
        for (var i = 0; i < appClass.length; i++) {
            $(appClass[i]).empty();
        }

        function compare(a, b) {
            return a.priorityRating - b.priorityRating
        }
        applications = applications.sort(compare);

        for (var i = 0; i < applications.length; i++) {
            // is app sticky?
            if (applications[i].appStatus === "sticky") {
                $(".sticky-cat").append(applications[i].appHTML);
            } // is app closed?
            else if (applications[i].appStatus === "accepted") {
                $(".accepted-cat").append(applications[i].appHTML);
            } else if (applications[i].appStatus === "declined") {
                $(".declined-cat").append(applications[i].appHTML);
            } else if (applications[i].appStatus === "triaged") {
                $(".triaged-cat").append(applications[i].appHTML);
            } // has user voted?
            else if (applications[i].userVoted === true) {
                $(".has-voted-cat").append(applications[i].appHTML);
            } // else
            else if (applications[i].appQuorum.hasMetQuorum === true) {
                $(".met-quorum-cat").append(applications[i].appHTML)
            } else {
                $(".need-votes-cat").append(applications[i].appHTML)
            }
            applications[i].updateHTML();
        }
    }

    sortApps();


    $(document.body).on("click", ".yes", function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        thisApp.yesVotes++;
        thisApp.updateHTML();
        sortApps();
    })

    $(document.body).on("click", ".no", function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        thisApp.noVotes++;
        thisApp.updateHTML();
        sortApps();
    })

    $(document.body).on("click", "#sticky", function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        if (thisApp.appStatus != "sticky") {
            thisApp.appStatus = "sticky";
        }
        else { thisApp.appStatus = "open" }
        thisApp.updateHTML();
        sortApps();
    })

    $(document.body).on("click", "#triage", function () {
        var thisAppID = $(this).attr("data-name");
        var thisApp = eval(thisAppID);
        if (thisApp.appStatus != "triaged") {
            if (!thisApp.yesVotes) {
                thisApp.appStatus = "triaged";
            } else {
                var conf = confirm("This application has at least one vote in favor. Are you sure you want to triage?");
                if (conf === true) { thisApp.appStatus = "triaged"; }
            }
        }
        else {
            thisApp.appStatus = "open";
            alert("The triage has been overturned.")
        }
        thisApp.updateHTML();
        sortApps();
    })



}); //end doc ready