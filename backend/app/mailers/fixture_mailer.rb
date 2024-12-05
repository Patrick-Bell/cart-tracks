class FixtureMailer < ApplicationMailer
    def game_reminder(fixture)
      @fixture = fixture
      # Calculate the start times for the worker and manager
      @worker_start_time = @fixture.date - 3.hours
      @manager_start_time = @fixture.date - (5.hours + 30.minutes)
      @worker_end_time = @fixture.date + (0.hours + 45.minutes)
      @manager_end_time = @fixture.date + (3.hours + 30.minutes)
      
      # Send the email
      mail(to: ENV['EMAIL'], subject: 'Upcoming Fixture')
    end
  end
  