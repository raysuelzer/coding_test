function CodeTest(dataService, cardRenderer) {

    // pass in the group name and
    // find the drop element zone on the 
    // DOM. 
    function getDropZoneEl(groupName) {
        return $('[data-group-name="'+ groupName +'"]' );
    }

    return {
        init: function () {
            dataService.getRemoteData()
                .flatMap(function (data) {
                    return data;
                })
                .map(function (person) {
                    // Card renderer contains the HTML template.
                    // We convert that template into a jquery Object.
                    let $html = $(cardRenderer.makeCard(person));
                    
                    // Set the person data on the JSON object.
                    // In a large application, the data would be stored
                    // in a dataStore instead of on the person dom object. 
                    // For react or angular, it would be associated with a 'model'.
                    $html.data('person', person);
                    
                    // Return back a mapped object for each of the persons
                    // containing original json data and the html object
                    return {
                        json: person,
                        $html: $html
                    };
                })
                
                .subscribe( // Contains three functions, OnNext(item) which is called on each item, 
                            // OnError(err) 
                            // and OnComplete() after all items have been received. 
                
                
                function (person) { // On Next    
                    let groupName = dataService.getGroupName(person.json) ? dataService.getGroupName(person.json) : "left";                    
                    let $initialDropZone = getDropZoneEl(groupName);                                        
                    $initialDropZone.append(person.$html);                    
                },

                // Error handling
                function (err) { console.error(err); },

                // DONE:
                // After all the items have been added to the DOM
                // add the event listeners
                function () {
                    // Set all cards to be draggable.
                    // Revert option puts the draggable object
                    // back to the original position if not placed
                    // within a drop zone.
                    $(".card").draggable({ revert: "invalid" });
                    
                    // Set up the drop zones to accept
                    // any .card items
                    $(".drop").droppable({
                        accept: ".card",
                        // Drop function will put the item at the top of the list
                        // and resize the two drop containers to be the same height.
                        // An enhancement would be to place the item closet to where it was
                        // dropped, but would add complexity. 
                        drop: function (event, ui) {                            
                            let $droppedItem = $(ui.draggable);
                            let $targetZone = $(this);                            
                            
                            $droppedItem.detach()
                                          .css({ top: 0, left: 0 })
                                          .prependTo($targetZone);
                                       
                            // Set the heights to be the same size so it's easy
                            // to drag and drop between lists 
                            $('.drop').height($('.drop').height());

                            // Call into the data service to store which drop zone
                            // that the user is in using localStorage.
                            dataService.setGroup($droppedItem.data().person, $targetZone.data().groupName);
                            
                        }
                    });
                    $(".drop").sortable();

                });
        }
    }

}