(function (window) {

    this.cardRenderer = {
            makeCard: function (person) {
                return `<div class="card">
                        ${person.name.first} ${person.name.last}<br>
                        ${person.email}
                        </div>`;
            }
        };
})(this);