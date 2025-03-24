FactoryBot.define do
  factory :manager do
    sequence(:email) { |n| "test#{n}@example.com" }
    password { "password123" }
    online { false }
    role { "admin" } # Default role (can be overridden in tests)

   
    trait :viewer do
      role { "viewer" }
    end
  end
end
