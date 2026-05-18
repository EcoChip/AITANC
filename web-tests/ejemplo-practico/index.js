/**
 * ============================================
 * SCRIPT PRINCIPAL - Web Premium Negocio Local
 * ============================================
 * Gestiona: menú interactivo, smooth scroll,
 * consulta de disponibilidad (API/iframe),
 * validación de formulario y toasts de feedback.
 *
 * Requiere HTML5 semántico con los siguientes IDs/clases:
 * - #botonHamburguesa, #navMobile, .enlace-mobile (menú)
 * - #formularioContacto (formulario)
 * - #telefono, #email, #politica (campos)
 * - #contenedorCitas (donde se inserta iframe)
 * - Un elemento <div id="toastContainer"> para los toasts
 */

(function () {
  'use strict';

  /* =========================================
     CONFIGURACIÓN CENTRAL
     ========================================= */
  const CONFIG = {
    // API de disponibilidad (Cal.com)
    apiCitas: {
      url: 'https://api.cal.com/v1/event-types?apiKey=TU_API_KEY',
      fallbackWidget: 'https://cal.com/tu-usuario/consulta-30min', // Widget público
    },
    // Regex validación
    regex: {
      telefono: /^(\+34)?[6789]\d{8}$/, // Formato español
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    // Duración toast (ms)
    toastDuracion: 4500,
  };

  /* =========================================
     MÓDULO 1: MENÚ INTERACTIVO & SMOOTH SCROLL
     ========================================= */
  const MenuManager = {
    boton: null,
    navMobile: null,
    enlaces: null,

    init() {
      this.boton = document.getElementById('botonHamburguesa');
      this.navMobile = document.getElementById('navMobile');
      this.enlaces = document.querySelectorAll('.enlace-mobile, .nav-desktop a[href^="#"]');

      if (!this.boton || !this.navMobile) return;

      this.boton.addEventListener('click', this.toggleMenu.bind(this));
      this.enlaces.forEach((enlace) =>
        enlace.addEventListener('click', this.handleEnlaceClick.bind(this))
      );
      document.addEventListener('keydown', this.cerrarConEscape.bind(this));
    },

    toggleMenu() {
      const expanded = this.boton.getAttribute('aria-expanded') === 'true';
      this.boton.setAttribute('aria-expanded', !expanded);
      this.boton.classList.toggle('activo');
      this.navMobile.classList.toggle('activo');
      document.body.style.overflow = expanded ? '' : 'hidden';
    },

    cerrarMenu() {
      this.boton.setAttribute('aria-expanded', 'false');
      this.boton.classList.remove('activo');
      this.navMobile.classList.remove('activo');
      document.body.style.overflow = '';
    },

    handleEnlaceClick(e) {
      const href = e.currentTarget.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const destino = document.querySelector(href);
        if (destino) {
          destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Cierra menú móvil si está abierto
        if (this.navMobile.classList.contains('activo')) {
          this.cerrarMenu();
        }
      }
    },

    cerrarConEscape(e) {
      if (e.key === 'Escape' && this.navMobile.classList.contains('activo')) {
        this.cerrarMenu();
      }
    },
  };

  /* =========================================
     MÓDULO 2: INTEGRACIÓN API DE CITAS
     ========================================= */
  const CitasManager = {
    contenedor: null,

    init() {
      this.contenedor = document.getElementById('contenedorCitas');
      if (!this.contenedor) return;
      this.cargarDisponibilidad();
    },

    async cargarDisponibilidad() {
      try {
        const response = await fetch(CONFIG.apiCitas.url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: 'Bearer TU_TOKEN' // si es necesario
          },
        });

        if (!response.ok) throw new Error(`Error API: ${response.status}`);

        const data = await response.json();
        this.renderizarDisponibilidad(data);
      } catch (error) {
        console.warn('No se pudo conectar con la API de citas. Cargando widget alternativo...', error);
        this.cargarWidgetIframe();
      }
    },

    renderizarDisponibilidad(data) {
      // Ejemplo: renderiza slots de tiempo en el contenedor
      this.contenedor.innerHTML = '<h3>Horarios disponibles</h3>';
      if (data.event_types && data.event_types.length) {
        const lista = document.createElement('ul');
        data.event_types.forEach((tipo) => {
          const item = document.createElement('li');
          item.textContent = `${tipo.title} - ${tipo.length} min`;
          lista.appendChild(item);
        });
        this.contenedor.appendChild(lista);
      } else {
        this.contenedor.innerHTML += '<p>No hay horarios disponibles. Prueba más tarde.</p>';
      }
    },

    cargarWidgetIframe() {
      const iframe = document.createElement('iframe');
      iframe.src = CONFIG.apiCitas.fallbackWidget;
      iframe.width = '100%';
      iframe.height = '600';
      iframe.style.border = 'none';
      iframe.title = 'Reserva tu cita';
      this.contenedor.innerHTML = ''; // Limpia
      this.contenedor.appendChild(iframe);
    },
  };

  /* =========================================
     MÓDULO 3: VALIDACIÓN DE FORMULARIO PREMIUM
     ========================================= */
  const FormValidator = {
    formulario: null,
    campoTelefono: null,
    campoEmail: null,
    campoPolitica: null,

    init() {
      this.formulario = document.getElementById('formularioContacto');
      if (!this.formulario) return;

      this.campoTelefono = document.getElementById('telefono');
      this.campoEmail = document.getElementById('email');
      this.campoPolitica = document.getElementById('politica');

      // Validación en tiempo real
      if (this.campoTelefono) {
        this.campoTelefono.addEventListener('input', this.validarTelefonoEnTiempoReal.bind(this));
      }
      if (this.campoEmail) {
        this.campoEmail.addEventListener('input', this.validarEmailEnTiempoReal.bind(this));
      }

      this.formulario.addEventListener('submit', this.manejarEnvio.bind(this));
    },

    validarTelefonoEnTiempoReal() {
      const valor = this.campoTelefono.value.trim();
      if (valor && !CONFIG.regex.telefono.test(valor)) {
        this.campoTelefono.setCustomValidity('Formato español: +34 6XX XXX XXX');
        this.campoTelefono.classList.add('invalido');
      } else {
        this.campoTelefono.setCustomValidity('');
        this.campoTelefono.classList.remove('invalido');
      }
    },

    validarEmailEnTiempoReal() {
      const valor = this.campoEmail.value.trim();
      if (valor && !CONFIG.regex.email.test(valor)) {
        this.campoEmail.setCustomValidity('Introduce un email válido');
        this.campoEmail.classList.add('invalido');
      } else {
        this.campoEmail.setCustomValidity('');
        this.campoEmail.classList.remove('invalido');
      }
    },

    validarFormulario() {
      let esValido = true;

      // Validar teléfono
      const telefono = this.campoTelefono?.value.trim();
      if (!telefono || !CONFIG.regex.telefono.test(telefono)) {
        this.campoTelefono?.setCustomValidity('Teléfono obligatorio (móvil español)');
        this.campoTelefono?.classList.add('invalido');
        esValido = false;
      }

      // Validar email
      const email = this.campoEmail?.value.trim();
      if (!email || !CONFIG.regex.email.test(email)) {
        this.campoEmail?.setCustomValidity('Email obligatorio y válido');
        this.campoEmail?.classList.add('invalido');
        esValido = false;
      }

      // Validar checkbox política
      if (this.campoPolitica && !this.campoPolitica.checked) {
        this.campoPolitica.setCustomValidity('Debes aceptar la política de privacidad');
        this.campoPolitica.classList.add('invalido');
        esValido = false;
      }

      return esValido;
    },

    manejarEnvio(e) {
      e.preventDefault();
      // Limpiar mensajes anteriores
      this.limpiarValidaciones();

      if (!this.validarFormulario()) {
        // Mostrar errores nativos (o toast de error)
        this.formulario.reportValidity();
        return;
      }

      // Simular envío exitoso (podría ser un fetch real)
      this.enviarFormulario();
    },

    limpiarValidaciones() {
      [this.campoTelefono, this.campoEmail, this.campoPolitica].forEach((campo) => {
        if (campo) {
          campo.setCustomValidity('');
          campo.classList.remove('invalido');
        }
      });
    },

    async enviarFormulario() {
      // Aquí podrías hacer un fetch POST a tu endpoint
      // Simulamos éxito con un pequeño retardo
      try {
        // const response = await fetch('/api/contacto', { method: 'POST', body: new FormData(this.formulario) });
        // if (!response.ok) throw new Error('Error en el envío');
        ToastManager.mostrar('¡Formulario enviado con éxito! Nos pondremos en contacto pronto.', 'exito');
        this.formulario.reset();
      } catch (error) {
        ToastManager.mostrar('Hubo un problema al enviar. Intenta de nuevo.', 'error');
      }
    },
  };

  /* =========================================
     MÓDULO 4: SISTEMA DE TOASTS ANIMADOS
     ========================================= */
  const ToastManager = {
    contenedor: null,

    init() {
      this.contenedor = document.getElementById('toastContainer');
      if (!this.contenedor) {
        this.contenedor = document.createElement('div');
        this.contenedor.id = 'toastContainer';
        this.contenedor.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
        `;
        document.body.appendChild(this.contenedor);
      }
    },

    mostrar(mensaje, tipo = 'exito') {
      const toast = document.createElement('div');
      toast.className = `toast toast-${tipo}`;
      toast.textContent = mensaje;
      // Estilos base (pueden personalizarse con CSS)
      toast.style.cssText = `
        background: ${tipo === 'exito' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        font-weight: 500;
        animation: slideInToast 0.4s ease, fadeOutToast 0.4s ${CONFIG.toastDuracion / 1000 - 0.4}s ease forwards;
        max-width: 350px;
      `;

      this.contenedor.appendChild(toast);

      // Eliminar después de la duración
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, CONFIG.toastDuracion);
    },
  };

  // Añadir estilos de animación de toasts dinámicamente
  const estiloToast = document.createElement('style');
  estiloToast.textContent = `
    @keyframes slideInToast {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOutToast {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    .invalido {
      border-color: #ef4444 !important;
      background-color: #fef2f2 !important;
    }
  `;
  document.head.appendChild(estiloToast);

  /* =========================================
     INICIALIZACIÓN GLOBAL
     ========================================= */
  function iniciarApp() {
    MenuManager.init();
    CitasManager.init();
    FormValidator.init();
    ToastManager.init();
  }

  // Arrancar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarApp);
  } else {
    iniciarApp();
  }
})();
