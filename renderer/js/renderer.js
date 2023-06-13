const form_create = document.getElementById("form_create");
if (form_create) {
    form_create.onsubmit = async function (e) {
      e.preventDefault();


      const formData = new FormData(form_create);
        let create = formData.get("create");

      if (create.length <= 8) {
        alertMessage("error", "Please input at least 8 characters!");
      return;

    }

    const response = await window.axios.openAI(formData.get("create"));
    const interviewText = response.choices[0].text;
    const listArray = interviewText.split('. ');

    let listText = '';
    for (let i = 0; i < listArray.length; i++) {
      listText += listArray[i] + '. ';
    }

    document.getElementById("list").textContent = listText;

        // Pass Data to OpenAI
         //const response = await window.axios.openAI(create);

        // Show Div Result
        //const div_result = document.querySelector("#div-result");
        //div_result.classList.remove('d-none');
        //div_result.classList.add('d-block');

        // Check Error if it exist
        //if( response.error ) {
        //  document.querySelector("#div-result textarea").innerHTML = response.error.message;
        //  return;
        //}

        // Provide result if there are no error
        //let result = response.choices[0].text;
        //document.querySelector("#div-result textarea").innerHTML = result.replace(/\n/g, "");

    // Store to database the prompt and result
    const store_response = await window.axios.store('prompts', {
            message: create ,
            response: listText,
          });
        console.log(store_response);

        // Enable Button
    //btn_submit.innerHTML = 'Submit';
    //btn_submit.disabled = false;
  };

        // console.log(formData.get("create"));

        /**for (const [key, value] of formData) {
            console.log(`${key}: ${value}\n`);
        } */

        //const response = await window.axios.openAI(formData.get("create"));
        //document.getElementById("list").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
    //};
}


function alertMessage(status, create){
    window.Toastify.showToast({
      text: create,
      duration: 5000,
      stopOnFocus: true,
      style: {
        textAlign: "center",
        background: status == "error" ? "red":"green",
        color: "white",
        padding: "5px",
        marginTop: "2px"
      }
    });
  }