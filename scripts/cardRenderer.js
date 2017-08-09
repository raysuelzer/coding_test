(function (window) {

    this.cardRenderer = {
        /**
         * Takes a person object and 
         * returns the 'templated' HTML for a card. 
         */
        makeCard: function (person) {
            return `<div class="card">
                        ${person.name.first} ${person.name.last}<br>
                        ${person.email}
                        </div>`;
        }
    };
})(this);