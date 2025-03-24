# config/schedule.rb
set :output, "log/whenever.log"

every 1.day, at: '8:00 am' do
  rake "reminders:send_game_reminders"
end


every :sunday, at: '11:59 pm' do
    rake "reminders:delete_all_messages"
  end