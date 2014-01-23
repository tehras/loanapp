class User < ActiveRecord::Base
  	rolify 
  	  after_create :assign_default_role


  	
  	validates_presence_of :name
  
	# Include default devise modules. Others available are:
	# :confirmable, :lockable, :timeoutable and :omniauthable
	devise :database_authenticatable, :registerable, :confirmable,
	         :recoverable, :rememberable, :trackable, :validatable, :lockable

	 private
	 	def assign_default_role
	    	add_role(:user)
	  	end
end
