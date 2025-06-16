// js/email.js
// EmailJS contact form handling
// Replace the placeholders with your EmailJS service ID, template ID, and public key.

(function () {
  // Initialise EmailJS with your public key
  emailjs.init('Rlz_Ux_ngDxj9zVcp'); // e.g., '3bHn4lq2XxYz'
})();

// Attach submit handler to the contact form
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Send the form using EmailJS
    emailjs
      .sendForm('service_x2b99xp', 'template_9fj9smd', this)
      .then(
        function () {
          alert('Message sent successfully!');
          form.reset();
        },
        function (error) {
          console.error('FAILED...', error);
          alert('There was an error sending the message. Please try again later.');
        }
      );
  });
}
