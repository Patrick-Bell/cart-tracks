class FixturesController < ApplicationController
  before_action :set_fixture, only: %i[ show update destroy ]

  # GET /fixtures
  def index
    @fixtures = Fixture.all

    @sorted_fixtures = @fixtures.sort_by(&:date)

    render json: @sorted_fixtures
  end

  # GET /fixtures/1
  def show
    render json: @fixture
  end

  # POST /fixtures
  def create
    @fixture = Fixture.new(fixture_params)

    if @fixture.save
      render json: @fixture, status: :created, location: @fixture
    else
      render json: @fixture.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /fixtures/1
  def update
    if @fixture.update(fixture_params)
      render json: @fixture
    else
      render json: @fixture.errors, status: :unprocessable_entity
    end
  end

  # DELETE /fixtures/1
  def destroy
    @fixture.destroy!
  end

  def get_next_3_games
    # Retrieve all fixtures
    @fixtures = Fixture.all
    
    # Get the current time
    today = Time.now
    
    # Filter for games in the future
    future_games = @fixtures.filter { |game| game.date > today }
    
    # Sort the future games by date
    sorted_future_games = future_games.sort_by(&:date)
    
    # Return the next 3 games
    render json: sorted_future_games.first(3)
  end

  def find_fixtures_next_month
    # Get the current time
    current_time = Time.now
    
    # Calculate the next month's start and end dates
    next_month = current_time.next_month
    start_date = next_month.beginning_of_month
    end_date = next_month.end_of_month
  
    # Query the fixtures within the date range
    @fixtures = Fixture.where(date: start_date..end_date)

    render json: @fixtures, status: :ok

  end
  
  

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_fixture
      @fixture = Fixture.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def fixture_params
      params.require(:fixture).permit(:home_team, :away_team, :stadium, :capacity, :date, :home_team_abb, :away_team_abb, :competition)
    end
end
