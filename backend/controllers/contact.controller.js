import Contact from "../models/contact.model.js"; // Import the Contact model

// Create a new contact submission
export const createContact = async (req, res) => {
  try {
    // Create a new contact entry
    const newContact = new Contact({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      subject: req.body.subject,
      message: req.body.message,
    });

    // Save the contact entry to the database
    const savedContact = await newContact.save();

    res.status(201).send({
      success: true,
      message: "Contact message sent successfully!",
      contact: savedContact,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while sending your message. Please try again later.",
    });
  }
};

// Get all contact submissions (admin functionality)
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find(); // Fetch all contact submissions

    if (contacts.length > 0) {
      res.status(200).send({
        success: true,
        contacts: contacts,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "No contact messages found.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while fetching contact messages.",
    });
  }
};

// Delete a specific contact submission (admin functionality)
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params; // Extract contact ID from request parameters

    const deletedContact = await Contact.findByIdAndDelete(id); // Delete the contact submission

    if (deletedContact) {
      res.status(200).send({
        success: true,
        message: "Contact message deleted successfully.",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Contact message not found.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while deleting the contact message.",
    });
  }
};
