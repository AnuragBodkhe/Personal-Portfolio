(function () {
  // 1) Replace with your own Public Key
  emailjs.init('Rlz_Ux_ngDxj9zVcp');   

  // 2) Attach handler
  const form = document.getElementById('contact-form');
  const sendBtn = document.getElementById('sendButton');
  const alertBox = document.getElementById('form-alert');

  form.addEventListener('submit', function (e) {
    e.preventDefault();              // stop normal form post

    const params = {
      from_name:  document.getElementById('name').value,
      from_email: document.getElementById('email').value,
      subject:    document.getElementById('subject').value,
      message:    document.getElementById('message').value
    };

    // Show spinner on button
    sendBtn.disabled = true;
    const originalHTML = sendBtn.innerHTML;
    sendBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

    // 3) Send main email; start auto-reply in the background so its failure won't break UX
    emailjs
      .send('service_x2b99xp', 'template_9fj9smd', params) // owner notification
      .then(() => {
        // Kick-off auto-reply (log errors only)
        emailjs
          .send('service_x2b99xp', 'template_cx83k4i', {
            to_name:   params.from_name,
            to_email:  params.from_email,
            reply_to:  params.from_email // for EmailJS dynamic recipient
          })
          .then(() => console.log('Auto-reply sent'))
          .catch(err => console.error('Auto-reply failed:', err));

        // Success feedback shown immediately
        alertBox.className = 'alert alert-success mt-3';
        alertBox.textContent = 'Message sent! 🎉 Check your inbox for confirmation.';
        alertBox.classList.remove('d-none');
        form.reset();
      })
      .catch((err) => {
        console.error('EmailJS main send error:', err);
        alertBox.className = 'alert alert-danger mt-3';
        alertBox.textContent = 'Sorry, the message could not be sent. Please try again later.';
        alertBox.classList.remove('d-none');
      })
      .finally(() => {
        // Restore button
        sendBtn.disabled = false;
        sendBtn.innerHTML = originalHTML;
        // Hide alert after 4s
        setTimeout(() => alertBox.classList.add('d-none'), 4000);
      });
  });
})();