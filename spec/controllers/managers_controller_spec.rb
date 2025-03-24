require 'rails_helper'

RSpec.describe "Managers API", type: :request do

    let!(:manager) { create(:manager) }

    let(:login_params) { { manager: { email: manager.email, password: manager.password } } }

    let(:token) do
        post '/api/login', params: login_params
        # Parse the response body to extract the token
        puts "Response body: #{response.body}"
        JSON.parse(response.body)['token']
      end


      describe 'POST /api/managers' do
        context 'when valid params are provided' do
          it 'creates a new manager' do
            # First, create the manager with unique email
            post '/api/managers', 
                 params: { manager: { email: 'test1@example.com', password: 'password123' }},
                 headers: { 'Authorization' => "Bearer #{token}" }
      
            expect(response).to have_http_status(:created)
            expect(JSON.parse(response.body)['email']).to eq('test1@example.com')
          end
        end
      
        context 'when a duplicate email is provided' do
          it 'returns conflict error' do
            # Create the first manager with the email
            post '/api/managers', 
                 params: { manager: { email: 'test1@example.com', password: 'password123' }},
                 headers: { 'Authorization' => "Bearer #{token}" }
      
            # Try to create another manager with the same email
            post '/api/managers', 
                 params: { manager: { email: 'test1@example.com', password: 'password123' }},
                 headers: { 'Authorization' => "Bearer #{token}" }
      
            # Check if the response returns a conflict status (409) due to duplicate email
            expect(response).to have_http_status(:unprocessable_entity)
            expect(JSON.parse(response.body)['email']).to include('has already been taken')
          end
        end

        
      end
    end