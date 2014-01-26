class Patient < ActiveRecord::Base
  belongs_to :case
  has_one :employee
end
