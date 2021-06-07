# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


25.times do 
  x = Task.create(
    description: "Testing out Scopes",
    start_date: rand((Date.today - 5)..(Date.today + 5)),
    due_date: rand((Date.today + 5)..(Date.today + 15)),
    account_id: 1,
    task_subtype: ["Order Entry", "Billing", "Prospecting Follow Up"].sample
  )
end
