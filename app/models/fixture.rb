class Fixture < ApplicationRecord
    
    before_create :create_name

    def create_name
        self.name ||= "#{self.home_team} v #{self.away_team} (#{self.competition})"
    end
    
end
