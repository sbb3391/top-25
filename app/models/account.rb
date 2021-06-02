class Account < ApplicationRecord
  has_many :opportunities
  has_many :tasks

  def self.import(file)
    CSV.read(file, headers: true, :header_converters => :symbol, :converters => :all, quote_empty: true)
  end

  def self.import_from_csv(file)
    x = self.import(file)
    hashed = x.map {|d| d.to_hash}
    problems = []
    hashed.each do |row|
      a = self.new(row)
      if a.valid? 
        a.save
      else
        problems << a 
      end
    end
  end
end
