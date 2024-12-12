=begin

namespace :reminders do

    desc "Send reminder emails for fixtures happening tomorrow"
    task send_game_reminders: :environment do
        start_date = Date.today
        end_date = Date.today + 1.days
        fixtures = Fixture.where(home_team: "West Ham United", date: start_date..end_date)
          fixtures.each do |fixture|
        FixtureMailer.game_reminder(fixture).deliver_now
        puts "Reminder email sent for fixture #{fixture.id} - #{fixture.home_team} v #{fixture.away_team}"
      end
      puts 'No games'
    end



    desc "Delete all messages"
    task delete_all_messages: :environment do
      Message.delete_all  # Deleting all messages from the database
      puts "All messages deleted"
    end

  end

  =end

  