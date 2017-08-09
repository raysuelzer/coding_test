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
        
        // Data source
        let apiUrl = 'http://beta.json-generator.com/api/json/get/VJL5OKWv7';
        
        function getRemoteData() {
            return Rx.Observable.fromPromise(
                fetch(apiUrl).then((response) => {
                    return response.json();
                }));
        }

        function getGroupings() {
            return JSON.parse(localStorage.getItem('savedGrouping'));
        }

        function getGroupName(person) {            
            let groupName = getGroupings()[person.guid];            
            return groupName;
        }

        function setGroup(person, groupName) {
            let savedGrouping = getGroupings();
            savedGrouping[person.guid] = groupName;
            localStorage.setItem('savedGrouping', JSON.stringify(savedGrouping));
        }
        
        // Public API
        return {
            /**
             * Returns an RxObservable from the 
             * JSON data source
             */
            getRemoteData: getRemoteData,            
            /**
             * A list of all the locally stored grouping data.
             */            
            getGroupings: getGroupings,
            /**
             * Given a person, this will return the group
             * name they belong in from the data store.              
             */
            getGroupName: getGroupName,
            /**
             * Given a person and a group name, will save the information
             * in the data store.
             */
            setGroup: setGroup        
        }
    }

    root.dataService = dataService();

}(this, this.Rx));