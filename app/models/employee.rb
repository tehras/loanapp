class Employee < ActiveRecord::Base
  belongs_to :case
  belongs_to :patient
end
