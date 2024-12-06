Rails.application.routes.draw do
  get "home/index"

  scope 'api' do 
  resources :carts
  resources :managers
  resources :workers
  resources :games
  resources :fixtures

  post '/completed-game/:id', to: 'games#completed_game', as: 'completed_game'
  post '/mark-as-watch/:id', to: 'workers#mark_as_watch', as: 'mark_as_watch'
  post '/send-workers-email', to: 'workers#send_email', as: 'send_email'
  post '/add-watching/:id', to: 'workers#add_watching', as: 'add_watching'
  post '/remove-watching/:id', to: 'workers#remove_watching', as: 'remove_watching'

  patch '/enable-notifications/:id', to: 'managers#enable_notifications', as: 'enable_notifications'
  patch '/disable-notifications/:id', to: 'managers#disable_notifications', as: 'disable_notifications'

  post '/login', to: 'sessions#create', as: 'create'
  delete '/logout/:id', to: 'sessions#destroy', as: 'destroy'
  get '/current-user', to: 'sessions#current_user'

  get '/next-3-games', to: 'fixtures#get_next_3_games', as: 'get_next_3_games'
  get '/next-month-games', to: 'fixtures#find_fixtures_next_month', as: 'find_fixtures_next_month'



  end
 
end
