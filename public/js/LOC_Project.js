document.getElementById('form').onreset = () =>{
    clearErrors()
}

document.getElementById('form').onsubmit= () => {
    clearErrors();


        let isValid = true;


        let divName = document.getElementById('divName').value.trim();
        let dean = document.getElementById('dean').value.trim();
        let penContact = document.getElementById('penContact').value.trim();
        let locRep = document.getElementById('locRep').value.trim();
        let chair = document.getElementById('chair').value.trim();
      

        if (!divName){
              document.getElementById('err-divName').style.display = "block";
              isValid = false;
        };

        if (!dean){
            document.getElementById('err-dean').style.display = "block";
            isValid = false;
        };

        if (!penContact){
            document.getElementById('err-penContact').style.display = "block";
            isValid = false;
        };

        if (!locRep){
            document.getElementById('err-locRep').style.display = "block";
            isValid = false;
        };

        if (!chair){
            document.getElementById('err-chair').style.display = "block";
            isValid = false;
        };
        

        return isValid;

    }

    function clearErrors()  {
        let errors = document.getElementsByClassName("errors");
            for (let i = 0; i < errors.length; i++){
                errors[i].style.display = "none"
            }
    }

