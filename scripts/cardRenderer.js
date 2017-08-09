(function (window) {
    // Little trick to prevent issues with closures

    function init() {
        var self = this;
        return {
            makeCard: function (person) {
                return `<div>
                        ${person.name.first} ${person.name.last}
                        </div>`;
            }
        };
    }

    this.cardRenderer = init();
})(this);