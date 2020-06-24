
function showFaceting() {
    var x = document.getElementById("facet");
    if (x.style.display == "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
  }
  //DROPDOWN MENU CODE
  $(".dropdown-menu li a").click(function(){
    $(this).parents(".btn-group").find('.selection').text($(this).text());
    $(this).parents(".btn-group").find('.selection').val($(this).text()); 
  });

  function getOption() { 
    selectElement = document.querySelector('#select1'); 
              
    output =  
      selectElement.options[selectElement.selectedIndex].value; 

    return output;
} 

const userActionAll = async (buttonSource) =>
{
 console.log("IN USER ACTION ALL");
 let txt = "";

  let url = buildSearchAPI(buttonSource);
  console.log("Button Source is: " + buttonSource);
  console.log("WEBURL IS: " + url);


fetch(url)
    .then(function (response) {
            return response.json();
        }).then(function (moviesJSON) {
       
        if (moviesJSON["$undefined"] === true) {
            console.log('NO FETCH RESULT');
            txt += `<br><br><br><b><h3>IMPLEMENT FULL TEXT SEARCH AGGREGATION TO SEARCH MOVIE COLLECTION</h3></b>`;
        } else {
            if (moviesJSON.length !== 0) {
                txt = buildMoviesDisplay(moviesJSON);
            }
        }  // end of ELSE

        document.getElementById("movieResults").innerHTML = txt;
    });
}
// function to build url api - depending on whether the search is basic or faceted.
function buildSearchAPI(buttonSource){

    let webhook_url = "https://webhooks.mongodb-stitch.com/api/client/v2.0/app/atlassearchmovies-krwpx/service/Movies/incoming_webhook/titlefacet";
    let searchString = document.getElementById('myInput').value;
    
    let webUrl = webhook_url + "?arg=" + searchString;
    if (buttonSource == "faceted"){
        let runtime = document.getElementById("runtime").value;
        let rating = document.getElementById("rating").value;
        let start = document.getElementById("start").value;
        let end = document.getElementById("end").value;
        let genre = getOption();
        console.log("GENRE IS " + genre);            
    
        webUrl = webUrl + "&runtime=" + runtime + "&rating=" + rating + "&start=" + start + "&end=" + end;
        if (genre!= 'All')
            webUrl = webUrl + "&genre=" + genre;
        }
    // console.log("WEBURL IS: " + webUrl);
        
    return webUrl;
}
    


function buildMoviesDisplay(movieList){

    console.log("IN BUILDMOVIESDISPLAY");
    console.log(movieList);       // prints out objects
    // CREATE BEST MATCH ENTRY
    buildBestMatch(movieList[0]);

    // BUILDING OUT CARDS FOR OTHER MOVIE MATCHES

    let poster;

    let txt=   `<hr><div class="row">`;                     // BEGINNING OF TXT DEFINITION

    for (let i= 1; i < movieList.length; i++) {
        
        if (movieList[i].poster){
            poster =movieList[i].poster;
        } else {
            poster="public/noposter.jpg";
        }
        let truncScore = movieList[i].score["$numberDouble"].toString();
        truncScore = truncScore.slice(0, (truncScore.indexOf("."))+4);
        
       // let txt_plot = buildTextPlot(movieList[i]);
       let txt_plot = movieList[i].plot;

        txt +=   `<div class="col-lg-3 col-md-6 mb-lg-0 mb-4">
        <!-- Card -->
        <div class="card card-cascade narrower card-ecommerce">
        <!-- Card image -->
        <div class="view view-cascade overlay">
            <img src=${poster} alt="Card image cap" class="card-img-top"
            alt="sample photo">
            <a>
            <div class="mask rgba-white-slight"></div>
            </a>
        </div>
        <!-- Card image -->
        <!-- Card content -->
        <div class="card-body card-body-cascade text-center">
            <!-- Category & Title -->
            <a href="" class="grey-text">
            <h5 style="color: green;">Score: ${truncScore}</h5>
            </a>
            <h4 class="card-title">
            <strong>
                <a href="" style="color:black;">${movieList[i].title}</a>
            </strong>
            </h4>

           <br>
           <h5>Year: ${movieList[i].year["$numberInt"]} </h5>
           <h5>Rating: ${movieList[i].imdb.rating["$numberDouble"]}</h5>
           <h5>Runtime: ${movieList[i].runtime["$numberInt"]}</h5>
           <br>
            <!-- Description -->
            <p class="card-text">${txt_plot} </p>
            <!-- Card footer -->
            <div class="card-footer px-1">
            <span class="float-left font-weight-bold">
                <strong>9$</strong>
            </span>
            <span class="float-right">
                <a data-toggle="tooltip" data-placement="top" title="Add to Cart">
                <i class="fas fa-shopping-cart grey-text ml-3"></i>
                </a>
                <a data-toggle="tooltip" data-placement="top" title="Share">
                <i class="fas fa-share-alt grey-text ml-3"></i>
                </a>
                <a class="active" data-toggle="tooltip" data-placement="top" title="Added to Wishlist">
                <i class="fas fa-heart ml-3"></i>
                </a>
            </span>
            </div>
        </div>
        <!-- Card content -->
        </div>
        <!-- Card -->                
    </div>`;                // END OF TXT DEFINITION
    }                       // END OF FOR LOOP

    return txt;
}



// helper function for buildMoviesDisplay(). Builds the card for the best matched movie.
function buildBestMatch (bestMatchedMovie) {
    let first_plot =  bestMatchedMovie.plot;
    let truncScore = bestMatchedMovie.score["$numberDouble"].toString();
        truncScore = truncScore.slice(0, (truncScore.indexOf("."))+4);
    
    let poster;
    if (bestMatchedMovie.poster == null) {
        poster = "public/noposter.jpg";
    } else
        poster = bestMatchedMovie.poster;
    document.getElementById("first-image").innerHTML = `<img src=${poster} class="img-fluid " height:300px;>`;

    let first_txt = `<b><h2>BEST MATCH</h2><br><h4 style="color: green;">Score:  ${truncScore} </h4></b><br>
        <b>${bestMatchedMovie.title }</b><br><br>
        Year: ${bestMatchedMovie.year["$numberInt"]} <br>
        Rating: ${bestMatchedMovie.imdb.rating["$numberDouble"]} <br>
        Runtime: ${bestMatchedMovie.runtime["$numberInt"]} <br><br>
        ${first_plot}<br><br>`;
    document.getElementById("first-description").innerHTML = first_txt;
}



// UNCOMMENT WHEN CALLING PREFIX:TRUE API for AUTOCOMPLETED TITLES
//window.addEventListener('DOMContentLoaded', getTitles);



