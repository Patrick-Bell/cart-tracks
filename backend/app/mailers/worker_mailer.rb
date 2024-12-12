class WorkerMailer < ApplicationMailer

    def track_worker #when a manager clicks to track
    end

    def send_worker_email(email, email_body, subject)
        @body = email_body  # Set the email body to the HTML content
    
        # Send email with HTML body
        mail(to: email,subject: subject,
        ) do |format|
          format.html { render html: @body.html_safe }  # Render the email body as HTML
          format.text { render plain: @body }            # Optionally, also send plain text for fallback
        end
      end

    
end
