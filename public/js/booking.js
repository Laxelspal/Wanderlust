const stripe =Stripe('pk_test_51P8MIISCv8WrgjUVCyfNsi5ql0zA66fccGHRTWJ01T12jECQE50uYuoZqizdWPQxIe7HoDsKl6uiLpU4clBVRcPI004tsYQZJ8');

let bookingbtn = document.getElementById("booking");

bookingbtn.addEventListener("click",async(e)=>{
    console.log("reserve btn clicked "); 
    const { listingId } = e.target.dataset;
    // console.log(listingId);

    try{
       let res= await axios.get(`http://localhost:8080/api/v1/bookings/checkout-session/${listingId}`);
       console.log(res);
       let session=res.data.session;

       await stripe.redirectToCheckout({
        sessionId: session.id
      });

    }
    catch(err){
        console.log(err);
    }
})