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

  // Formulario "Trabaja con Nosotros": envío por AJAX (sin recargar la página)
  var jobForm = document.getElementById('jobForm');
  if (jobForm) {
    var jobStatus = document.getElementById('jobFormStatus');
    var jobSubmitBtn = jobForm.querySelector('button[type="submit"]');
    var maxSizeMB = 5;

    jobForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var fileInput = document.getElementById('jobCv');
      if (fileInput && fileInput.files && fileInput.files[0]) {
        if (fileInput.files[0].size > maxSizeMB * 1024 * 1024) {
          jobStatus.textContent = 'El archivo del CV pesa demasiado. Súbelo en menos de ' + maxSizeMB + ' MB.';
          jobStatus.className = 'job-form-status is-error';
          return;
        }
      }

      var formData = new FormData(jobForm);
      var actionUrl = jobForm.getAttribute('action');

      if (jobSubmitBtn) {
        jobSubmitBtn.disabled = true;
        jobSubmitBtn.textContent = 'Enviando...';
      }
      jobStatus.textContent = '';
      jobStatus.className = 'job-form-status';

      fetch(actionUrl, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Error de red');
          }
          return response.json();
        })
        .then(function () {
          jobForm.reset();
          jobForm.hidden = true;
          jobStatus.textContent = '¡Candidatura enviada correctamente! Nos pondremos en contacto contigo lo antes posible.';
          jobStatus.className = 'job-form-status is-success';
        })
        .catch(function () {
          jobStatus.textContent = 'No se ha podido enviar el formulario. Escríbenos por WhatsApp o llámanos e intentaremos ayudarte directamente.';
          jobStatus.className = 'job-form-status is-error';
        })
        .finally(function () {
          if (jobSubmitBtn) {
            jobSubmitBtn.disabled = false;
            jobSubmitBtn.textContent = 'Enviar candidatura';
          }
        });
    });
  }
});
