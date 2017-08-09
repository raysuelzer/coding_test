(function (root, Rx) {

    function dataService() {
        // First time running the app, create an empty object
        // I will create a 'dictionary' with the person guid as the
        // key and the current grouping as the value.
        // A default value will be needed to be used by consumer.
        // For items that have not been assigned to a group.
        if (localStorage.getItem('savedGrouping') === null) {
            localStorage.setItem('savedGrouping', '{}');
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
        function getGroupings() {
            return JSON.parse(localStorage.getItem('savedGrouping'));
        }

        function getGroupName(person) {            
            let groupName = getGroupings()[person.guid];            
            return groupName;
        }

        // NOTE: If there were multiple targets of where
        //       a person could be dropped, this would 
        //       have to be implemented in another way. 
        //       But, the current problem is a binary choice
        //       of selected or not selected. 

        function setGroup(person, groupName) {
            let savedGrouping = getGroupings();
            savedGrouping[person.guid] = groupName;
            localStorage.setItem('savedGrouping', JSON.stringify(savedGrouping));
        }
        
        return {
            getRemoteData: getRemoteData,
            // TODO: Move into seperate class
            getGroupings: getGroupings,
            getGroupName: getGroupName,
            setGroup: setGroup
         
        }
    }

    root.dataService = dataService();

}(this, this.Rx));