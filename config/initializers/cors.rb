Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3001'  # For development frontend

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end

  # Production: Allow the production frontend URL to make requests
  allow do
    origins 'https://whu-tracker-8a7906f4de54.herokuapp.com'  # For production frontend

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
