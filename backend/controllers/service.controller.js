const serviceService = require('../services/service.service');

async function createService(req, res) {
  try {
    const { service_name, description } = req.body;

    if (!service_name || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await serviceService.createService({ service_name, description });

    if (result.affectedRows === 0) {
      return res.status(500).json({ error: 'Failed to create service' });
    }

    return res.status(201).json({
      message: 'Service created successfully',
      data: {
        id: result.insertId,
        service_name,
        description,
      },
    });
  } catch (error) {
    console.error('Error in createService controller:', error);
    return res.status(500).json({ error: 'An error occurred while creating the service' });
  }
}

async function getAllServices(req, res) {
    console.log("getAllServices controller called")
  try {
    const services = await serviceService.getAllServices();

    if (!services || services.length === 0) {
      return res.status(404).json({ error: 'No services found' });
    }
    console.log("Services retrieved successfully")
    return res.status(200).json({
      message: 'Services retrieved successfully',
      data: services,
    });
  } catch (error) {
    console.log(error)
    console.error('Error in getAllServices controller:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving the services' });
  }
}

module.exports = {
  createService,
  getAllServices,
};
