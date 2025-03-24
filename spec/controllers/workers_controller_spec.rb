require 'rails_helper'

RSpec.describe "Workers API", type: :request do
  let!(:manager) { create(:manager) }
  let!(:worker) { create(:worker) }  # Create worker for testing

  # Define login_params
  let(:login_params) { { manager: { email: manager.email, password: manager.password } } }

  # Variable to hold the token
  let(:token) do
    post '/api/login', params: login_params
    JSON.parse(response.body)['token']
  end

  describe 'PATCH /api/workers/:id' do
    context 'when changing worker watching from false to true' do
      it 'changes worker watching from false to true' do
        # Ensure worker watching is initially false
        expect(worker.watching).to be(false)

        # Make the PATCH request with the correct worker ID and the 'watching' parameter set to true
        patch "/api/workers/#{worker.id}", 
              params: { worker: { watching: true } },
              headers: { 'Authorization' => "Bearer #{token}" }

        # Output the response body for debugging purposes (optional)
        puts "Response body: #{response.body}"

        # Ensure the response is 200 OK
        expect(response).to have_http_status(:ok)

        # Reload worker and check if the 'watching' status was updated
        worker.reload
        expect(worker.watching).to be(true)
      end
    end

    context 'when changing worker watching from true to false' do
      it 'changes worker watching from true to false' do
        # Set the worker watching to true for this test
        worker.update(watching: true)

        # Ensure worker watching is initially true
        expect(worker.watching).to be(true)

        # Make the PATCH request with the correct worker ID and the 'watching' parameter set to false
        patch "/api/workers/#{worker.id}", 
              params: { worker: { watching: false } },
              headers: { 'Authorization' => "Bearer #{token}" }

        # Output the response body for debugging purposes (optional)
        puts "Response body: #{response.body}"

        # Ensure the response is 200 OK
        expect(response).to have_http_status(:ok)

        # Reload worker and check if the 'watching' status was updated
        worker.reload
        expect(worker.watching).to be(false)
      end
    end

    context 'when changing worker watching from true to false with no auth' do
        it 'it brings up error message' do
          # Set the worker watching to true for this test
          worker.update(watching: true)
  
          # Ensure worker watching is initially true
          expect(worker.watching).to be(true)
  
          # Make the PATCH request with the correct worker ID and the 'watching' parameter set to false
          patch "/api/workers/#{worker.id}", 
                params: { worker: { watching: false } }
  
          # Output the response body for debugging purposes (optional)
          puts "Response body: #{response.body}"
  
          # Ensure the response is 404 OK
          expect(response).to have_http_status(:unauthorized)
  
        end
      end


  end
end
