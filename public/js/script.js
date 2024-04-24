

(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();


let hearts = document.querySelectorAll(".heart_icon");
let wishlist = document.querySelector(".wishlist");
let forgotbtn = document.querySelector("#forgot_passowrd");

for( let heart of hearts  ){
    heart.addEventListener("click",(e)=>{
      e.preventDefault();
      // parent.style.opacity=0.2;
      let id = heart.getAttribute("id");
      let wish_route = document.querySelector(".wish_route");
      
      if(heart.classList.contains("red")){
         wish_route.setAttribute("href",`/listings/ReWishlist/${id}`);
         wishlist.children[0].children[0].innerText = "Remove from wishlist";
         console.log(wishlist.children[0].children[0].innerText);
      }
      else{
        wish_route.setAttribute("href",`/listings/wishlist/${id}`);
      }
      wishlist.classList.remove("popbox");
      console.log("heart was clicked");
    })
}
let cross = document.querySelector(".cross");

cross.addEventListener("click",()=>{
    // parent.style.opacity=1;
    wishlist.classList.add("popbox");
});


let user_logo = document.querySelector(".user_logo");
let user_box = document.querySelector(".user_box");
let user_cross = document.querySelector(".user_cross");

user_logo.addEventListener("click",()=>{
  console.log("user box clicked");
   user_box.classList.toggle("popbox");
});

user_cross.addEventListener("click",()=>{
  console.log("user cross clicked");
   user_box.classList.toggle("popbox");
});

let delete_list = document.querySelectorAll(".wish_cross");
console.log("wish cross",delete_list);

for(let delbtn of delete_list){
    delbtn.addEventListener("click",(e)=>{
      e.preventDefault();
      let id = delbtn.children[0].getAttribute("id");
      console.log(id,delbtn);
      let wish_route = document.querySelector(".wish_route");
      wish_route.setAttribute("href",`/listings/ReWishlist/${id}`);
      wishlist.children[0].children[0].innerText = "Remove from wishlist";
      wishlist.classList.remove("popbox");
      console.log("listing is deleted from wishlist");
    })
}

if(forgotbtn){
  forgotbtn.addEventListener("click",(e)=>{
  let forgotForm = document.querySelector("#forgot_form");
  if(forgotForm.classList.contains("hide")){
    forgotForm.classList.remove("hide");

  }
  else{
    forgotForm.classList.add("hide");
  }
})
}



var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  // spaceBetween: 1,
  pagination: {
  el: ".swiper-pagination",
  clickable: true,
},
breakpoints: {
 "@0.00": {
     slidesPerView: 1,
     spaceBetween: 10,
  },
 "@0.75": {
     slidesPerView: 1,
     spaceBetween: 20,
  },
 "@1.00": {
     slidesPerView: 2,
     spaceBetween: 30,
  },
 "@1.50": {
      slidesPerView: 3,
      spaceBetween: 50,
  },
},
});


