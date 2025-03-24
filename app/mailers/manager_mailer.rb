class ManagerMailer < ApplicationMailer

    # Method to send an email to the manager
    def new_manager(manager)
      @manager = manager
      # Define email properties
      mail(to: @manager.email, subject: "Welcome to Our Platform")
    end

    # Method to send an email to the main admin
    def new_manager_admin(manager)
        @manager = manager
        mail(to: ENV['EMAIL'], subject: "New Manager")
    end
  end
  