const vehicleService = require('../services/vehicle.service');

const getVehiclesByCustomerId = async (req, res) => {
  const customerId = req.params.customerId;
  console.log("getVehiclesByCustomerId controller called");

  try {
    const vehicles = await vehicleService.getVehiclesByCustomerId(customerId);

    if (!vehicles || vehicles.length === 0) {
      return res.status(404).json({ message: 'No vehicles found for this customer' });
    }

    res.status(200).json({
      customer_id: customerId,
      vehicles: vehicles,
    });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const addVehicle = async (req, res) => {
  console.log("add vehicle called")
  try {
    const {
      customerId,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color,
    } = req.body;
    console.log("customer id", customerId)

    if (!customerId || !vehicle_year || !vehicle_make || !vehicle_type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newVehicle = await vehicleService.createVehicle({
      customerId,
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color,
    });

    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error) {
    console.error('Error adding vehicle:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getVehiclesByCustomerId,
  addVehicle,
};
