(function () {
  // 1) Initialize EmailJS with your Public Key
  try {
    emailjs.init('Rlz_Ux_ngDxj9zVcp');
    console.log('EmailJS initialized successfully');
  } catch (error) {
    console.error('Failed to initialize EmailJS:', error);
  }

  // 2) Initialize DOM elements and configuration
  const form = document.getElementById('contact-form');
  const sendBtn = document.getElementById('sendButton');
  const alertBox = document.getElementById('form-alert');
  
  /**
   * Auto-reply configuration object
   * Contains all settings needed for the auto-reply functionality
   * Centralizes configuration to make future updates easier
   */
  const AUTO_REPLY_CONFIG = {
    serviceID: 'service_x2b99xp',    // EmailJS service ID for sending emails
    templateID: 'template_cx83k4i',  // EmailJS template ID for auto-replies
    fromName: 'Anurag Bodkhe',       // Sender name that appears in auto-replies
    senderEmail: 'bodkheanurag235@gmail.com' // Your email address (used as the sender, not the recipient)
  };
  
  // Log configuration to help with debugging
  console.log('Auto-reply configuration:', AUTO_REPLY_CONFIG);
  
  /**
   * Sends an auto-reply email to the contact form submitter
   * @param {Object} userDetails - The user's contact details
   * @param {string} userDetails.name - The user's name
   * @param {string} userDetails.email - The user's email address
   * @param {string} userDetails.subject - The subject of the original message
   * @param {string} userDetails.message - The content of the original message
   * @returns {Promise} - Promise that resolves when the auto-reply is sent
   */
  function sendAutoReply(userDetails) {
    console.log('Preparing auto-reply for:', userDetails.name);
    
    // Create parameters for the auto-reply email
    // Make sure these parameter names match exactly what your EmailJS template expects
    const autoReplyParams = {
      // Standard EmailJS parameters
      to_name: userDetails.name,
      name: userDetails.name,         // For templates using {{name}}
      email: userDetails.email,       // For templates using {{email}}
      to_email: userDetails.email,    // Explicit recipient email
      recipient: userDetails.email,   // Alternative recipient parameter
      to: userDetails.email,          // Another alternative recipient parameter
      from_name: AUTO_REPLY_CONFIG.fromName,
      from_email: AUTO_REPLY_CONFIG.senderEmail, // Your email as the sender
      reply_to: userDetails.email,    // Set reply_to to user's email, not your email
      
      // Content parameters
      title: userDetails.subject,      // For templates using {{title}}
      subject: `Thank you for your message: ${userDetails.subject}`,
      message: `Dear ${userDetails.name},\n\nThank you for contacting me. I've received your message about "${userDetails.subject}" and will get back to you as soon as possible.\n\nBest regards,\n${AUTO_REPLY_CONFIG.fromName}`
    };
    
    console.log('Sending auto-reply with params:', autoReplyParams);
    console.log('Auto-reply recipient email:', userDetails.email);
    console.log('Using template ID:', AUTO_REPLY_CONFIG.templateID);
    console.log('Using service ID:', AUTO_REPLY_CONFIG.serviceID);
    
    // Return the promise so the caller can handle success/failure
    return emailjs.send(
      AUTO_REPLY_CONFIG.serviceID, 
      AUTO_REPLY_CONFIG.templateID, 
      autoReplyParams
    ).then(function(response) {
      console.log('Auto-reply sent successfully:', response);
      console.log('Auto-reply was sent to:', userDetails.email);
      return response;
    }).catch(function(error) {
      console.error('Failed to send auto-reply:', error);
      console.error('Error details:', error.text || 'No additional details');
      console.error('Failed auto-reply was intended for:', userDetails.email);
      throw error; // Re-throw to let the caller handle it
    });
  }
  
  /**
   * Validates a form field and updates its styling
   * @param {HTMLElement} field - The form field to validate
   * @returns {boolean} - Whether the field is valid
   */
  function validateField(field) {
    // Check if field is empty
    if (!field.value.trim()) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      return false;
    } else {
      // Special validation for email field
      if (field.id === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
          field.classList.add('is-invalid');
          field.classList.remove('is-valid');
          return false;
        }
      }
      
      // Special validation for message field - ensure minimum length
      if (field.id === 'message' && field.value.trim().length < 10) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        field.nextElementSibling.nextElementSibling.textContent = 'Please enter a message with at least 10 characters.';
        return false;
      }
      
      field.classList.remove('is-invalid');
      field.classList.add('is-valid');
      return true;
    }
  }

  // Add input event listeners to validate on typing
  document.getElementById('name').addEventListener('input', function() {
    validateField(this);
  });
  
  document.getElementById('email').addEventListener('input', function() {
    validateField(this);
  });
  
  document.getElementById('subject').addEventListener('input', function() {
    validateField(this);
  });
  
  document.getElementById('message').addEventListener('input', function() {
    validateField(this);
  });

  /**
   * Handle form submission
   * This function manages the entire contact form submission process:
   * 1. Validates all form fields
   * 2. Sends the main notification email
   * 3. Sends an auto-reply to the user
   * 4. Handles success and error states
   * 5. Manages UI feedback
   */
  form.addEventListener('submit', function (e) {
    e.preventDefault();              // stop normal form post

    // Get form fields
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const subjectField = document.getElementById('subject');
    const messageField = document.getElementById('message');
    
    // Validate all fields
    const nameValid = validateField(nameField);
    const emailValid = validateField(emailField);
    const subjectValid = validateField(subjectField);
    const messageValid = validateField(messageField);
    
    // Check if all fields are valid
    if (!nameValid || !emailValid || !subjectValid || !messageValid) {
      alertBox.className = 'alert alert-warning mt-3';
      
      // Provide specific feedback based on which fields are invalid
      if (!nameValid) {
        alertBox.textContent = 'Please enter your name.';
      } else if (!emailValid) {
        alertBox.textContent = 'Please enter a valid email address.';
      } else if (!subjectValid) {
        alertBox.textContent = 'Please enter a subject for your message.';
      } else if (!messageValid) {
        alertBox.textContent = 'Please enter a message with at least 1 characters.';
      } else {
        alertBox.textContent = 'Please fill in all required fields correctly.';
      }
      
      alertBox.classList.remove('d-none');
      
      // Focus on the first invalid field
      if (!nameValid) nameField.focus();
      else if (!emailValid) emailField.focus();
      else if (!subjectValid) subjectField.focus();
      else if (!messageValid) messageField.focus();
      
      return; // Stop form submission
    }

    const params = {
      from_name:  nameField.value,
      from_email: emailField.value,
      subject:    subjectField.value,
      message:    messageField.value
    };

    // Show spinner on button
    sendBtn.disabled = true;
    const originalHTML = sendBtn.innerHTML;
    sendBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';

    // Track if the main email was sent successfully
    let mainEmailSent = false;
    
    // Create user details object for both emails and auto-reply
    const userDetails = {
      name: nameField.value,
      email: emailField.value,  // This is the recipient's email for the auto-reply
      subject: subjectField.value,
      message: messageField.value
    };
    
    console.log('User details for auto-reply:', userDetails);
    console.log('User email for auto-reply:', userDetails.email);
    
    // 3) First send the main notification email
    console.log('Sending main email with params:', params);
    emailjs
      .send('service_x2b99xp', 'template_9fj9smd', params)
      .then(function(mainResponse) {
        console.log('Main email sent successfully:', mainResponse);
        mainEmailSent = true;
        
        // Show success message for main email
        alertBox.className = 'alert alert-success mt-3';
        alertBox.textContent = 'Message sent! You will receive a confirmation email shortly.';
        alertBox.classList.remove('d-none');
        
        // Reset form and remove validation styling
        setTimeout(function() {
          form.reset();
          document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
            
            // Reset any custom error messages
            if (input.id === 'message') {
              input.nextElementSibling.nextElementSibling.textContent = 'Please enter your message.';
            }
          });
          
          // Scroll to the success message
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500); // Small delay for better user experience
        
        // 4) Send auto-reply using the dedicated function
        console.log('Main email sent, now sending auto-reply to:', userDetails.email);
        return sendAutoReply(userDetails);
      })
      .then(function(autoReplyResponse) {
        if (autoReplyResponse) {
          console.log('Auto-reply workflow completed successfully:', autoReplyResponse);
          console.log('Both emails sent successfully!');
        }
      })
      .catch(function(error) {
        console.error('EmailJS error:', error);
        console.error('Error details:', error.text || 'No additional details');
        
        if (mainEmailSent) {
          // Main email was sent but auto-reply failed
          console.error('Auto-reply failed, but main email was sent successfully');
          // We don't change the success message since the main functionality worked
          // But we log detailed error for debugging
          console.error('Auto-reply error details:', error);
        } else {
          // Main email failed
          alertBox.className = 'alert alert-danger mt-3';
          alertBox.textContent = 'Failed to send message. Please try again later.';
          alertBox.classList.remove('d-none');
        }
      })
      .finally(function() {
        // Re-enable the button after 2 seconds to prevent multiple submissions
        setTimeout(function() {
          sendBtn.disabled = false;
          sendBtn.innerHTML = originalHTML;
          
          // Hide the alert after 5 seconds
          setTimeout(function() {
            alertBox.classList.add('d-none');
          }, 5000);
        }, 2000);
        
        // Log completion of the entire email process
        console.log('Email process completed (success or failure)');
      });
  });
})();