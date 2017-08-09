(function (root, Rx) {

    function dataService () {
        // First time running the app, create an empty array.
        if (localStorage.getItem('selectedPeople') === null) {
            localStorage.setItem('selectedPeople', '[]');
        }
        
        var self = this;
        let apiUrl = 'http://beta.json-generator.com/api/json/get/VJL5OKWv7';
        

         function getRemoteData() {
                return Rx.Observable.fromPromise(
                    fetch(apiUrl).then((response) => {
                        return response.json();
                    }));
            }

            // TODO: Move into seperate class
        function getSelectedGuids() {
            return JSON.parse(localStorage.getItem('selectedPeople'));
        }

        function isSelected(person) {
            return getSelectedGuids().indexOf(person.guid) == -1;
        }

        // NOTE: If there were multiple targets of where
            //       a person could be dropped, this would 
            //       have to be implemented in another way. 
            //       But, the current problem is a binary choice
            //       of selected or not selected. 

          function addSelected (person) {
                if (isSelected(person) === false) {
                    let selectedPeople = localStorage.getItem('selectedPeople');
                    selectedPeople.push(person.guid);
                    localStorage.setItem(JSON.stringify(selectedPeople));
                }
            }

            function removeSelected (person) {
                if (isSelected(person)) {
                    let selectedPeople = localStorage.getItem('selectedPeople');
                    selectedPeople.splice(selectedPeople.indexOf(person.guid), 1);
                    localStorage.setItem(JSON.stringify(selectedPeople));
                }
            }

        return {            
            getRemoteData: getRemoteData,
            // TODO: Move into seperate class
            getSelectedGuids: getSelectedGuids,
            isSelected: isSelected,            
        }
    }

    root.dataService = dataService();

}(this, this.Rx));