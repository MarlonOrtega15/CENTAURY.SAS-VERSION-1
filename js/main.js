document.addEventListener("DOMContentLoaded", () => {
    const rolActual = sessionStorage.getItem("centaury_rol");
    const contenedorLoginNav = document.getElementById("contenedorLoginNav");

    if (rolActual && contenedorLoginNav) {
        let urlDashboard = "";
        if (rolActual === "admin") urlDashboard = "admin/dashboard.html";
        else if (rolActual === "empleado" || rolActual === "asesor") urlDashboard = "empleado/dashboard.html";
        else if (rolActual === "cliente") urlDashboard = "cliente/dashboard.html";

        contenedorLoginNav.innerHTML = `
            <div class="sesion-activa-box">
                <a href="${urlDashboard}" style="background:var(--naranja); color:var(--negro); padding:0.4rem 1rem; border-radius:3px; font-size:0.8rem; font-weight:700; text-decoration:none; text-transform:uppercase;">Mi Panel</a>
                <button onclick="cerrarSesionWeb()" class="btn-cerrar-sesion-web">Salir</button>
            </div>
        `;
    }

    window.cerrarSesionWeb = function() {
        sessionStorage.clear();
        window.location.reload();
    };

    const modalLogin = document.getElementById("modalLogin");
    const btnLogin = document.getElementById("btnLogin");
    const cerrarModal = document.getElementById("cerrarModal");
    const rolBtns = document.querySelectorAll(".rol-btn");
    const formLogin = document.getElementById("formLogin");
    
    const linkMostrarRegistro = document.getElementById("linkMostrarRegistro");
    const linkOlvidoPass = document.getElementById("linkOlvidoPass");
    const modalTitulo = document.getElementById("modalTitulo");
    const modalSub = document.getElementById("modalSub");
    const rolSelectorBox = document.getElementById("rolSelectorBox");
    const btnLoginAccion = document.getElementById("btnLoginAccion");
    const camposRegistroExtra = document.getElementById("camposRegistroExtra");
    const campoConfirmPass = document.getElementById("campoConfirmPass");

    let rolSeleccionado = "cliente";
    let modoRegistro = false;

    if (btnLogin && modalLogin && !rolActual) {
        btnLogin.addEventListener("click", (e) => { e.preventDefault(); modalLogin.classList.add("visible"); });
    }
    if (cerrarModal && modalLogin) {
        cerrarModal.addEventListener("click", () => { modalLogin.classList.remove("visible"); });
    }

    rolBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            rolBtns.forEach(b => b.classList.remove("activo"));
            btn.classList.add("activo");
            rolSeleccionado = btn.getAttribute("data-rol");
        });
    });

    window.togglePassword = function() {
        const passInput = document.getElementById("loginPass");
        const passConfirmInput = document.getElementById("loginPassConfirm");
        if (passInput.type === "password") {
            passInput.type = "text";
            if(passConfirmInput) passConfirmInput.type = "text";
        } else {
            passInput.type = "password";
            if(passConfirmInput) passConfirmInput.type = "password";
        }
    };

    if (linkMostrarRegistro) {
        linkMostrarRegistro.addEventListener("click", (e) => {
            e.preventDefault();
            modoRegistro = !modoRegistro;
            if (modoRegistro) {
                modalTitulo.textContent = "Registro de Nuevo Cliente";
                modalSub.textContent = "Completa tus datos personales para acceder";
                rolSelectorBox.style.display = "none";
                camposRegistroExtra.style.display = "block";
                campoConfirmPass.style.display = "block";
                btnLoginAccion.textContent = "Completar Registro →";
                linkMostrarRegistro.textContent = "¿Ya tienes cuenta? Inicia sesión";
                linkOlvidoPass.style.display = "none";
            } else {
                restablecerModalLogin();
            }
        });
    }

    if (linkOlvidoPass) {
        linkOlvidoPass.addEventListener("click", (e) => {
            e.preventDefault();
            const emailRecu = prompt("Ingrese su correo o celular registrado:");
            if (!emailRecu) return;

            let listaUsuarios = JSON.parse(localStorage.getItem("centaury_usuarios")) || [];
            const existe = listaUsuarios.some(u => u.email.toLowerCase() === emailRecu.toLowerCase() || u.celular === emailRecu);

            if (!existe) {
                alert("❌ Usuario no encontrado. El usuario ingresado no se encuentra registrado en el sistema, por lo tanto no es posible enviar ningún código.");
                return;
            }

            const codigoReal = Math.floor(1000 + Math.random() * 9000);
            alert(`📩 Código de recuperación enviado con éxito: ${codigoReal}`);
            const codigoIngresado = prompt("Ingrese el código de 4 dígitos recibido:");
            if (codigoIngresado == codigoReal) {
                const nuevaPass = prompt("¡Código verificado!\nIngrese su nueva contraseña:");
                if (nuevaPass) alert("¡Contraseña actualizada correctamente!");
            } else {
                alert("Código incorrecto.");
            }
        });
    }

    function restablecerModalLogin() {
        modoRegistro = false;
        modalTitulo.textContent = "Iniciar Sesión";
        modalSub.textContent = "Accede con tu cuenta corporativa";
        rolSelectorBox.style.display = "flex";
        camposRegistroExtra.style.display = "none";
        campoConfirmPass.style.display = "none";
        btnLoginAccion.textContent = "Ingresar →";
        linkMostrarRegistro.textContent = "Regístrate como nuevo";
        linkOlvidoPass.style.display = "block";
    }

    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("loginEmail").value.trim().toLowerCase();
            const pass = document.getElementById("loginPass").value;

            if (!email || !pass) return;

            let listaUsuarios = JSON.parse(localStorage.getItem("centaury_usuarios")) || [
                {email: "admin@centaury.com", rol: "admin"},
                {email: "empleado@centaury.com", rol: "empleado"},
                {email: "asesor@asesorcentaury.com", rol: "asesor"},
                {email: "alaska@gmail.com", rol: "cliente", nombres: "Alaska Perez", celular: "3001234567"}
            ];

            if (modoRegistro) {
                const nombres = document.getElementById("regNombres").value.trim();
                const apellidos = document.getElementById("regApellidos").value.trim();
                const celular = document.getElementById("regCelular").value.trim();
                const passConfirm = document.getElementById("loginPassConfirm").value;

                if (!nombres || !apellidos || !celular) { alert("Complete todos los campos."); return; }
                if (pass !== passConfirm) { alert("Las contraseñas no coinciden."); return; }
                if (email.endsWith("@centaury.com") || email.endsWith("@asesorcentaury.com")) { alert("Dominio exclusivo para personal interno."); return; }
                if (listaUsuarios.some(u => u.email === email)) { alert("Este correo ya está registrado."); return; }

                listaUsuarios.push({ email: email, rol: "cliente", nombres: `${nombres} ${apellidos}`, celular: celular });
                localStorage.setItem("centaury_usuarios", JSON.stringify(listaUsuarios));

                alert("¡Registro exitoso! Ya puedes iniciar sesión.");
                restablecerModalLogin();
                formLogin.reset();
                return;
            }

            const usuarioDB = listaUsuarios.find(u => u.email === email);
            if (!usuarioDB) {
                alert("❌ Usuario no encontrado. Este correo no se encuentra registrado en el sistema. Verifique sus datos o regístrese como nuevo cliente.");
                return;
            }

            let rolFinal = rolSeleccionado;
            if (rolSeleccionado === "empleado") {
                if (email.endsWith("@asesorcentaury.com")) rolFinal = "asesor";
                else rolFinal = "empleado";
            }

            if (usuarioDB.rol !== rolFinal && !(usuarioDB.rol === "empleado" && rolFinal === "asesor")) {
                alert(`⚠️ El usuario pertenece al rol '${usuarioDB.rol.toUpperCase()}', no coincide con el rol seleccionado.`);
                return;
            }

            sessionStorage.setItem('centaury_rol', rolFinal);
            sessionStorage.setItem('centaury_email', email);

            if (rolFinal === "admin") window.location.href = "admin/dashboard.html";
            else if (rolFinal === "empleado" || rolFinal === "asesor") window.location.href = "empleado/dashboard.html";
            else if (rolFinal === "cliente") window.location.href = "cliente/dashboard.html";
        });
    }

    // FORMULARIO DE CONTÁCTENOS CONECTADO AL BACKEND EN RENDER
    const formulario = document.getElementById("formulario");
    const formExito = document.getElementById("formExito");
    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            e.preventDefault();
            const telefonoInput = document.getElementById("telefono").value.trim();

            const soloNumeros = telefonoInput.replace(/\D/g, '');
            if (soloNumeros.length < 10) {
                alert("⚠️ El número de celular debe contener al menos 10 dígitos para poder enviar la solicitud.");
                return;
            }

            const nuevaSolicitud = {
                nombre: document.getElementById("nombre").value.trim(),
                empresa: document.getElementById("empresa").value.trim() || "Particular",
                email: document.getElementById("email").value.trim(),
                telefono: telefonoInput,
                servicio: document.getElementById("servicio").value || "General",
                mensaje: document.getElementById("mensaje").value.trim()
            };

            // URL pública de tu backend en Render vinculada directamente al formulario web
            const API_URL = 'https://centaury-sas-version-1.onrender.com/api/contacto';

            fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevaSolicitud)
            })
            .then(response => response.json())
            .then(data => {
                console.log('¡Solicitud guardada en la nube con éxito!', data);
                if (formExito) formExito.style.display = "block";
                formulario.reset();
                setTimeout(() => { if (formExito) formExito.style.display = "none"; }, 4000);
            })
            .catch(error => {
                console.error('Error al conectar con el servidor:', error);
                alert("Hubo un error al enviar la solicitud al servidor. Inténtalo de nuevo.");
            });
        });
    }
});