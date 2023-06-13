// Form Login
const form_login = document.getElementById("form_login");
if (form_login) {
    form_login.onsubmit = async function (e) {
    e.preventDefault();

    const btn_submit = document.querySelector("#form_login button[type='submit']");
    const formData = new FormData(form_login);

    btn_submit.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
    btn_submit.disabled = true;

    // Pass data to Laravel
    const response = await window.axios.backendLaravel('post', 'login', {
            email: formData.get("email"),
            password: formData.get("password"),
        });

    // If email and password validation fails
    if ( response.user == null ) {
        const field_email = document.querySelector("#form_login input[name='email']");
        const field_password = document.querySelector("#form_login input[name='password']");
        const invalid_email = document.getElementById("invalid_email");
        const invalid_password = document.getElementById("invalid_password");

        if ( response.errors.email == undefined ) {
            invalid_email.innerHTML = '';
            field_email.classList.remove('is-invalid');
        }
        else {
            invalid_email.innerHTML = response.errors.email;
            field_email.classList.add('is-invalid');
        }

        if ( response.errors.password == undefined ) {
            invalid_password.innerHTML = '';
            field_password.classList.remove('is-invalid');
        }
        else {
            invalid_password.innerHTML = response.errors.password;
            field_password.classList.add('is-invalid');
        }

        btn_submit.innerHTML = 'Login';
        btn_submit.disabled = false;
        return;
    }

    // Store Token for Backend Laravel API access
    sessionStorage.setItem('token', response.token);
    alertMessage("success", "Successfully logged in account!");

    // Hide Login Form and Show prompts Table
    const div_login = document.getElementById("div_login");
    const div_prompts = document.getElementById("div_prompts");
    div_login.classList.add('d-none');
    div_prompts.classList.remove('d-none');
    div_prompts.classList.add('d-flex');

    // Enable Button
    btn_submit.innerHTML = 'Login';
    btn_submit.disabled = false;

    // Load Table
    getPrompts();
  };
}

// Btn Logout
const btn_logout = document.getElementById('btn_logout');

if (btn_logout) {
    btn_logout.onclick = async function() {
        const confirmed = confirm("Are you sure you want to log out?");

        if (confirmed) {
            btn_logout.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Loading...';
            btn_logout.disabled = true;

            // Use Token to Logout
            const token = sessionStorage.getItem('token');
            const response = await window.axios.backendLaravel('post', 'logout', null, token);
            console.log(response);

            // Hide Login Form and Show prompts Table
            const div_login = document.getElementById("div_login");
            const div_prompts = document.getElementById("div_prompts");
            div_login.classList.remove('d-none');
            div_login.classList.add('d-flex');
            div_prompts.classList.remove('d-flex');
            div_prompts.classList.add('d-none');

            // Clear Login Form Fields
            const field_email = document.querySelector("#form_login input[name='email']");
            const field_password = document.querySelector("#form_login input[name='password']");
            const invalid_email = document.getElementById("invalid_email");
            const invalid_password = document.getElementById("invalid_password");
            invalid_email.innerHTML = '';
            field_email.value = '';
            field_email.classList.remove('is-invalid');
            invalid_password.innerHTML = '';
            field_password.value = '';
            field_password.classList.remove('is-invalid');

            // Enable Button
            btn_logout.innerHTML = 'Logout';
            btn_logout.disabled = false;
        }
    };
}

// Read prompts from Backend Laravel
async function getPrompts () {
    // Fetch API Response
    try {
        const response = await window.axios.backendLaravel('get', 'prompts');

        // Load table from API Response
        let htmlResult = '';
        Object.keys(response).forEach(count => {
            let created_at = new Date(response[count].created_at).toLocaleString('en-US', { timeZone: 'Asia/Manila'});

            htmlResult += '<tr>' +
                '<th scope="row">' +  response[count].prompt_id + '</th>' +
                '<td>' + response[count].message + '</td>' +
                '<td>' + response[count].response + '</td>' +
                '<td>' + created_at + '</td>' +

            '</tr>';
        });

        const tbody = document.getElementById('tbl_prompts');
        tbody.innerHTML = htmlResult;
    } catch (error) {
        console.error(error);
    }
}

getPrompts();

// Set Btn Delete Prompt Click functionality from Table Prompts
const tbl_prompts = document.getElementById('tbl_prompts');
if (tbl_prompts) {
    tbl_prompts.onclick = async function (e) {
        if(e.target && e.target.id == "btn_prompts_del") {
            const token = sessionStorage.getItem('token');
            const id = e.target.name;
            const response = await window.axios.destroy('delete', id,'',token);
            console.log(response);

            alertMessage("success", "Successfully deleted id " + id + '!');
            getPrompts();
        }
    };
}

getPrompts();

const btn_clear = document.getElementById('btn_clear');

if (btn_clear) {
    btn_clear.onclick = async function(e) {
        const confirmed = confirm("Are you sure you want to delete?");

        if (confirmed) {
            const token = sessionStorage.getItem('token');
            const response = await window.axios.backendLaravel('delete', 'prompts', '', token);
            console.log(response);

            alertMessage("success", "Successfully deleted!");
            getPrompts();
        }
    };
}







