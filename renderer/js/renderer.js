const form = document.getElementById("form_create");
if (form) {
    form.onsubmit = async function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        let create = formData.get("create");

        if (create.length <= 8) {
            alertMessage("error", "Please input at least 8 characters!");
            return;
          }

        // console.log(formData.get("create"));

        /**for (const [key, value] of formData) {
            console.log(`${key}: ${value}\n`);
        } */

        const response = await window.axios.openAI(formData.get("create"));
        document.getElementById("list").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
    };
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