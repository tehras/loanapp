json.array!(@employees) do |employee|
  json.extract! employee, :id, :first_name, :last_name, :email, :home_number, :mobile_number, :fax_number, :street, :city, :state, :zip, :nationality, :language, :english, :years_inUs, :hha_lic, :driver_lic, :access_toCar, :notes
  json.url employee_url(employee, format: :json)
end
