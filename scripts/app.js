function CodeTest(dataService, cardRenderer) {
    $left = document.getElementById('left_side');
    $right = document.getElementById('right_side');
    return {
        init: function() {
            dataService.getRemoteData()
                .flatMap(function (data) {
                    return data;
                })
                .map(function (person) {
                    return {
                        json: person,
                        html: cardRenderer.makeCard(person)
                    };
                })
                // NOTE: This can be optimized using DocumentFragment,
                //       but a naive implementation is below.
                .subscribe(function (person) {
                    let domNodeToInsert = document.createElement('div');
                    domNodeToInsert.innerHTML = person.html;
                    
                    
                    if (!dataService.isSelected(person.json)) {
                        $left.appendChild(domNodeToInsert);
                    } else {
                        $right.appendChild(domNodeToInsert);
                    }                    
                });
        }
    }

}