json.array!(@patients) do |patient|
  json.extract! patient, :id, :first_name, :last_name, :email, :home_phone, :mobile_phone, :fax_number, :street, :city, :state, :zip, :country, :nationality, :languages_spoken, :reasons_for_service, :type_of_service, :requires_car, :require_HHA, :required_services
  json.url patient_url(patient, format: :json)
end
