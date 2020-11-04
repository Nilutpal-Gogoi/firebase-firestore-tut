const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

// create element and render cafe

function renderCafe(doc){
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");


  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  // appending name and city to li
  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);

  cafeList.appendChild(li);

  // ------------------------ Deleting Data ------------------------------------
  cross.addEventListener("click", e => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  })
}


// --------------------- Getting Data ----------------------------------------------
// First we want to go to firestore and grab the data that we have stored in cafes collection in firestore.
// .get() will grab all the documents from cafe's collections are return it to us.

// db.collection("cafes").get().then((snapshot) => {
//   snapshot.docs.forEach(doc => {
//     renderCafe(doc);
//   })
// })  // This is an asynch request.

// This method returns us a promise. The promise tells us that at some point this method is going to return a data.
// .then() will help us in a way that when the action is complete and retrieve the data, this method fires(.then() method fires) and takes back a call back function. This function will execute when the db.collection.get() is complete


// ---------------------- Saving Data --------------------------------------- 
// --------------- Adding element to the database using front end ------------
form.addEventListener("submit", e => {
  e.preventDefault();
  db.collection("cafes").add({
    name: form.name.value,
    city: form.city.value
  });
  form.name.value = "";
  form.city.value = "";
})


// ------------- Making Queries -------------------------------------
// Here we'll use .where() to make queries
// db.collection("cafes").where("city", "==", "london").get().then(snapshot => {
//   snapshot.docs.forEach(doc => {
//     renderCafe(doc);
//   })
// })


//  ------------------------ Ordering Data ---------------------------------
//  Here we'll use .orderBy() to order data
// db.collection("cafes").orderBy("name").get().then(snapshot => {
//   snapshot.docs.forEach( doc => {
//     renderCafe(doc);
//   })
// })

// db.collection("cafes").where("city", "==", "manchester").orderBy("name").get().then(snapshot=>{
//   snapshot.docs.forEach(doc =>{
//     renderCafe(doc);
//   })
// })


// ------------------------- Real Time Data ----------------------------------------
// Here we'll be using real time listener, i.e we'll use .onSnapshot(). 

db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    });
});

// // Updating data
// // .set method - It updates all the fields if one is changed. i.e if only city is changed then name will disappear
// db.collection("cafes").doc("NES52IIosWbZ8NO6GD2G").set({name:"shaun's cafe", city: "Liverpool"})
// // .update method = It updates only the specified field.
// db.collection("cafes").doc("NES52IIosWbZ8NO6GD2G").update({name:"shaun's cafe", city: "Liverpool"})