function Application(id, name) {
    this.id = id;
    this.name = name;
    this.genres = [];
    this.format = [];
    this.updays = [];
    this.contentWarnings = [];
    this.tags = {
        genreTags: this.genres,
        formatTags: this.format,
        contentTags: this.contentWarnings,
        updateTags: this.updays,
        miscTags: []
    }
    this.yesVotes = 0;
    this.noVotes = 0;
    this.totalVotes = 0;
    this.calcTotalVotes = function () {
        this.totalVotes = this.yesVotes + this.noVotes;
        return this.totalVotes;
    };
    this.meter = {
        meterSize: 0,
        yesMeterP: 0,
        noMeterP: 0
    };
    this.approval = 0;
    this.priorityRating = 0;
    this.evalGroup = "";
    this.appStatus = "open";
    this.appCondition = {
        isSticky: false,
        isOpen: true,
        triageMotion: false,
        triageApprove: 2,
        isTriaged: false,
        declined: false,
        accepted: false,
        needsLetter: false,
    }
    this.determineAppStatus = function() {
        if (this.appCondition.isSticky === true) {
            this.appStatus = "sticky";
        }
        else if (this.appCondition.accepted === true) {
            this.appStatus = "accepted";
        }
        else if (this.appCondition.declined === true) {
            this.appStatus = "declined";
        }
        else if (this.appCondition.isTriaged === true || this.appCondition.triageApprove <= 0) {
            this.appStatus = "triaged";
            this.appCondition.isTriaged === true;
        }
        else {
            this.appStatus = "open";
        }
        return this.appStatus;
    }
    this.thisUserVoted = false;
    this.usersVoted = [];
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
        <div class="approval">
            <span id="approval-${this.id}">\n${this.approval}%</span>
            approve
        </div>
    </div>
    <div style="display: inline-block;">
            <button id="${this.id}-yes" class="yes" data-name="${this.id}">Yes</button>
            <button id="${this.id}-no" class="no" data-name="${this.id}">No</button>
            <button id="sticky" data-name="${this.id}">Sticky</button>
            <button id="accept" data-name="${this.id}">Accept</button>
            <button id="decline" data-name="${this.id}">Decline</button>
            <button id="triage" data-name="${this.id}">Triage</button>
        </div>
    <div id="tags">
        Tags: 
    </div>
</div>`;
    this.calcMeter = function () {
        if (this.appQuorum.hasMetQuorum === false) {
            this.meter.meterSize = (this.totalVotes + this.appQuorum.toHitQuorum) - 1;
        } else {
            this.meter.meterSize = this.totalVotes - 1;
        }
        var y = this.yesVotes / this.meter.meterSize;
        this.meter.yesMeterP = Math.round(y * 100);
        var n = this.noVotes / this.meter.meterSize;
        this.meter.noMeterP = Math.round(n * 100);
        return this.meter;
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
        this.calcTotalVotes();
        this.calcQuorumVals();
        this.calcMeter();
        this.calcApproval();
        this.determineAppStatus();
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
            $(`#yMeter-${this.id}`).animate({ width: this.meter.yesMeterP + "%" }, { duration: 0 });
            $(`#nMeter-${this.id}`).animate({ width: this.meter.noMeterP + "%" }, { duration: 0 });
            if (this.appStatus == "triaged" ||
                this.appStatus == "declined" ||
                this.appStatus == "accepted") {
                $(`#${this.id}-yes`).addClass("hide");
                $(`#${this.id}-no`).addClass("hide");
            } else if (this.appStatus == "open" || this.appStatus == "sticky") {
                $(`#${this.id}-yes`).removeClass("hide");
                $(`#${this.id}-no`).removeClass("hide");
            }
        }
}

module.exports = Application;