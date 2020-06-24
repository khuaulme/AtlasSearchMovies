 //Get movie titles from STITCH DATA API
const getTitles = async () => {
    //Calling new autocomplete function  -- to be used for autocomplete
    let webhook_url = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/atlassearchmovies-krwpx/service/Movies/incoming_webhook/new-autocomplete";
    let searchString = document.getElementById('myInput').value;
 
    let webUrl = webhook_url + "?arg=" + searchString;
    const res = await fetch(webUrl);
    let titles = await res.json();

    titles = Object.keys(titles).map(i => titles[i]);
   
    //console.log ("LENGTH: " + titles.length);
    
   return titles;
 };


 function autoComplete (inp){
    console.log("INSIDE AUTOCOMPLETE FUNCTION");
    let currentFocus;

    inp.addEventListener("input", function(e) {  
      
        let df = document.createDocumentFragment();
        let a = document.createElement("DIV");
        let b, i, line;
        closeAllLists();

        currentFocus = -1;
       
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        a.setAttribute("id", this.id + "autocomplete-list");
       
        line = document.createElement("DIV");
        line.innerHTML='<hr>';
       a.appendChild(line);
     /*append the DIV element as a child of the autocomplete container:*/
      //  df.appendChild(a);
          this.parentNode.appendChild(a);
       
       // document.getElementById('myInput').addEventListener("input", function(e) {   
        let arr = getTitles().then(function(arr){
            console.log(arr);
            console.log ("ARR: " + arr.length);

            for (i = 0; i < arr.length; i++) {
               b = document.createElement("DIV");
               b.setAttribute('style', 'padding-left: 20px; display:block;');                 //
                    /*insert a input field that will hold the current array item's value:*/
                b.innerHTML = arr[i];
                b.innerHTML += "<input type='hidden' value='" + String(arr[i]) + "'>";
                b.value= arr[i];
                console.log( i + " : " + arr[i]);

                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    /*insert the value for the autocomplete text field:*/
                    console.log("Picked an auto-completion option");
                    
                   document.getElementById('myInput').value = this.getElementsByTagName("input")[0].value;
                   
                   closeAllLists();
                    autoCompletedAction();
                    }); 
                a.appendChild(b);
                
                }
        });
    });

    // let containerList = document.getElementById("searchBox");
    // containerList.appendChild(df);  

  
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
