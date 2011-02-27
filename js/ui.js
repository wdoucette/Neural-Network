// AI User Interface
var sets = 0;

// TODO: Dynamically populate training sets.
function addSet() {

    sets++;
    document.getElementById('nSets').innerHTML = sets;

    var parent = document.getElementById('trainingSets');
    var div;
    var inputs;
    var targets;
    var link;

    div = document.createElement("trainingSet");

    link = document.createElement("span");
    link.setAttribute("onclick", "javascript:remove(this)");
    link.setAttribute("class", "link");
    link.appendChild(document.createTextNode(" -"));

    inputs = document.createElement("input");
    inputs.setAttribute("value", "-5,-5");
    targets = document.createElement("input");
    targets.setAttribute("value", "0,0,0");

    div.appendChild(inputs);
    div.appendChild(targets);
    div.appendChild(link);
    parent.appendChild(div);
}

function remove(set) {

    document.getElementById("trainingSets").removeChild(set.parentNode);
    sets--;
    document.getElementById('nSets').innerHTML = sets;

}

//window.onload = main();

   