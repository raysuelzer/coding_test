function CodeTest(dataService, cardRenderer) {

    // pass in the group name and
    // find the drop element zone on the 
    // DOM. 
    function getDropZoneEl(groupName) {
        return $('[data-group-name="' + groupName + '"]');
    }

    function resizeDropZones() {
           let largestHeight = $('.drop').map(function(e) { return $(this).height()}).toArray().sort((a,b) => b-a)[0];                         
           $('.drop').css({'min-height': largestHeight+'px'});
    }

    return {
        init: function () {
            dataService.getRemoteData()
                .flatMap(function (data) {
                    return data; // Will treat data as iterable (it's an array)
                })
                // We are now iterating over each person object
                .map(function (person) {
                    // Card renderer contains the HTML template.
                    // We convert that template into a jquery Object.
                    let $html = $(cardRenderer.makeCard(person));

                    // Set the person data on the jQuery object.
                    // In a large application, the data would be stored
                    // in a data store instead of on the person dom object.                     
                    $html.data('person', person);

                    // Return back a mapped object for each of the persons
                    // containing original json data and the html object
                    return {
                        json: person,
                        $html: $html
                    };
                })

                .subscribe( 
                // Contains three functions, OnNext(item) which is called on each item, 
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
                    //Set initial drop zone heights;
                    resizeDropZones();
                    
                    // Set all cards to be draggable.
                    // Revert option puts the draggable object
                    // back to the original position if not placed
                    // within a drop zone, or if it is placed in the
                    // same drop zone.
                    $(".card").draggable({
                        revert: function (dropTarget) {
                            // Dropped outside of a drop zone
                            if (!dropTarget) {
                                return true; // revert
                            }
                            // If the drop target is the same as the current 
                            // drop target of the person, then revert to original position.
                            let savedGroup = dataService.getGroupName($(this).data().person);
                            if (savedGroup === dropTarget.data().groupName) {
                                return true; //revert
                            }
                            // Should not revert
                            return false;
                        }
                    });

                    // Set up the drop zones to accept
                    // any .card items
                    $(".drop").droppable({
                        accept: ".card",
                        // Drop function will put the item at the top of the list
                        // and resize the two drop containers to be the same height.
                        // An enhancement would be to place the item closet to where it was
                        // dropped, but would add complexity. 
                        drop: function (event, ui) {
                            let $droppedItem = $(ui.draggable),
                                $targetZone = $(this),                            
                                person = $droppedItem.data().person,
                                targetZoneGroup = $targetZone.data().groupName;

                            // Ignore if dropped in same group.    
                            if (targetZoneGroup == dataService.getGroupName(person)) {                                
                                return;
                            }

                            // Remove the dropped item from current dropzone
                            // Move to new drop zone.
                            // And shake so user notices it.
                            $droppedItem.detach()
                                .css({ top: 0, left: 0 })
                                .prependTo($targetZone)
                                .effect("shake", {times: 1});
                                

                            // Resize the drop zones so that they are both
                            // the same height. This makes it easier to 
                            // drag and drop between sides. 
                            resizeDropZones();
                           
                            // Call into the data service to persist the drop zone
                            // for the person
                            dataService.setGroup(person, $targetZone.data().groupName);

                        }
                    });

                });
        }
    }

}