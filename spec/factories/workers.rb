# spec/factories/workers.rb
FactoryBot.define do
  factory :worker do
    name { "Test Worker" }
    watching { false }
    id { 1 }
    # Add any other necessary attributes
  end
end
