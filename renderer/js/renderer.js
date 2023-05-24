const form = document.getElementById("form_create");
if (form) {
    form.onsubmit = async function (e) {
        e.preventDefault();

        const formData = new FormData(form);

       // console.log(formData.get("create"));

        /**for (const [key, value] of formData) {
            console.log(`${key}: ${value}\n`);
        } */

        const response = await window.axios.openAI(formData.get("create"));
        document.getElementById("list").innerHTML = JSON.stringify(response.choices[0].text).replace(/\\n/g, '');
    }
}