const generateForm = document.querySelector(".generate-form");
const imggallery = document.querySelector(".img-gallery");
const PEXEL_API_KEY = "KZVX6VmoexU6t1zzqKpPHIg8xh02On9aHiHzQ5gYQy1CHXIaAcjs3CjJ";


// Function to get a random sample of elements from an array:
function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)    // If the requested quantity is greater than or equal to the array length, return the entire array
        return arr;
        // throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];  // If the selected index is already taken, use the next available index
        taken[x] = --len in taken ? taken[len] : len;    // Mark the selected index as taken
    }
    return result;
}

const updateImageCard =(imgDataArray) => {

    // Iterate through each element in the imgDataArray
    imgDataArray.forEach((imageUrl,index)=> {

        //console.log(imageUrl);
        const imgCard = imggallery.querySelectorAll(".img-card")[index];
        const imgElement = imgCard.querySelector("img");

        // Set the source of the img element to the current imageUrl
        imgElement.src = imageUrl;

        // when image is loaded removing the loading class
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
        }
       });
}

const searchPexelImages = async(userPrompt, userImgQuantity) => {
    try{
        // Attempting to fetch data from the Pexels API with the specified user prompt
        fetch("https://api.pexels.com/v1/search?query=".concat(userPrompt),{
    headers: {
        Authorization: PEXEL_API_KEY
    }
    })
    .then(resp => {
        return resp.json()
      })
      .then(resp_json => {

        // Extracting original image URLs from the response using the 'map' function
        const image_arr_urls = resp_json.photos.map(i => i['src']['original']);

        // Getting random image URLs using the 'getRandom' function
        const imgDataSamples = getRandom(image_arr_urls, userImgQuantity);

        // Updating the image cards with the retrieved data
        updateImageCard(imgDataSamples);
      })
        
    }catch(error){
        alert(error.message);
    }
}

    const searchLexicaImages = async(userPrompt, userImgQuantity) => {
        try{
            
            fetch("https://lexica.art/api/v1/search?q=".concat(userPrompt))
        .then(resp => {
            return resp.json()
          })
          .then(resp_json => {
            const image_arr_urls = resp_json.images.map(i => i['srcSmall']);
            const imgDataSamples = getRandom(image_arr_urls, userImgQuantity);
            updateImageCard(imgDataSamples);
          })
            
        }catch(error){
            alert(error.message);
        }

}
const handleFormSubmission = (e) => {

    // Prevent the default form submission behavior to handle the form submission manually
    e.preventDefault();

    // Getting user input and image quantity value from the form

    const userPrompt = e.srcElement[0].value;  //Retrieves the user input (search query) from the first input field of the form.

    const userImgQuantity = e.srcElement[1].value;  // Retrieves the user input (image quantity) from the second input field of the form.
    
    const api = e.srcElement[2].value;  // Retrieves the selected API (Lexica or Pexels) from the third input field of the form.

    //Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length: userImgQuantity},() =>
    `<div class="img-card">
    <img src="images/loader.svg">
    <a href="#" class="download-btn">
        <img src="images/download.svg">
    </a>
    </div>`
    ).join("");
    imggallery.innerHTML = imgCardMarkup;
    if (api == "Lexica"){
    searchLexicaImages(userPrompt, userImgQuantity);
    }
    else{
        searchPexelImages(userPrompt, userImgQuantity);  
    }

}
generateForm.addEventListener("submit" , handleFormSubmission);