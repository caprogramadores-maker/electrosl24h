// Actualización automática del año de copyright
document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Panel de servicios interactivo en el Hero
  var panelDesc = document.getElementById('panelDesc');
  var breakers = document.querySelectorAll('.breaker-item');

  if (breakers.length > 0) {
    breakers.forEach(function (breaker) {
      breaker.addEventListener('click', function () {
        // Remover clase activa de todos
        breakers.forEach(function (b) {
          b.classList.remove('is-active');
        });

        // Activar el seleccionado
        breaker.classList.add('is-active');

        // Actualizar el texto descriptivo dinámicamente
        var newDesc = breaker.getAttribute('data-desc');
        if (panelDesc && newDesc) {
          panelDesc.textContent = newDesc;
        }
      });
    });
  }

  // Acordeón de Preguntas Frecuentes (FAQ)
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    if (btn) {
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Cerrar todos los demás
        faqItems.forEach(function (other) {
          other.classList.remove('open');
          var otherBtn = other.querySelector('.faq-q');
          if (otherBtn) {
            otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        // Alternar el actual
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // Formulario "Trabaja con nosotros" (envío por AJAX a FormSubmit)
  var jobForm = document.getElementById('jobForm');
  var jobStatus = document.getElementById('jobFormStatus');

  if (jobForm) {
    jobForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var submitBtn = jobForm.querySelector('button[type="submit"]');
      var cvInput = document.getElementById('jobCv');

      // Comprobación básica del tamaño del CV (máx. 5 MB)
      if (cvInput && cvInput.files && cvInput.files[0]) {
        var maxBytes = 5 * 1024 * 1024;
        if (cvInput.files[0].size > maxBytes) {
          jobStatus.textContent = 'El archivo del CV pesa demasiado (máximo 5 MB). Reduce el tamaño e inténtalo de nuevo.';
          jobStatus.className = 'job-form-status is-error';
          return;
        }
      }

      var formData = new FormData(jobForm);

      jobStatus.textContent = '';
      jobStatus.className = 'job-form-status';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      fetch(jobForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            jobStatus.textContent = '¡Candidatura enviada correctamente! Te contactaremos si tu perfil encaja.';
            jobStatus.className = 'job-form-status is-success';
            jobForm.reset();
          } else {
            throw new Error('Respuesta no válida del servidor');
          }
        })
        .catch(function () {
          jobStatus.textContent = 'No se ha podido enviar la candidatura. Prueba de nuevo o escríbenos directamente por WhatsApp.';
          jobStatus.className = 'job-form-status is-error';
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar candidatura';
          }
        });
    });
  }
});
