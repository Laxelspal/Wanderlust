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


let  nav_btn = document.querySelector(".navbar-toggler");
console.log(nav_btn);

nav_btn.addEventListener('click',()=>{

  let right = document.querySelector(".right");
  let navbox= document.querySelector(".navbar");
  console.log(right);

  if(navbox.style.height!= "17rem"){
    navbox.style.height= "17rem";
    right.classList.remove("ms-auto");
  } 
  else{
    navbox.style.height= "5rem";
    right.classList.add("ms-auto");
  }  

})
