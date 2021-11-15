const express = require('express');
const asyncHandler = require('express-async-handler');
const Contact = require('../database/schemas/contactschema');
const bodyParser = require('body-parser');

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

router.post(

    '/add_contact',

    asyncHandler( async(req,res) => {

        const { name , email , phone , address } = req.body;
        
        const phoneExists = await Contact.findOne( { phone } );

        if(phoneExists) {
            res.status(400);
            throw new Error("Phone number already exists");
        }
        
        const contact = new Contact({
            "name": name,
            "email": email,
            "phone": phone,
            "address": address
        });
        await contact.save();

        if(contact) {
            res.status(201).json({
                message: `${contact.name} added successfully`,
                contact
            })
        }

        else {
            res.status(400);
            throw new Error("Invalid contact");
        }

    } )
)

router.get(

    '/get_contacts',

    asyncHandler( async(req,res) => {

        const contacts = await Contact.find().sort({name: 1});

        if(contacts) {
            res.status(200).json({
                message: "Contacts fetched successfully",
                contacts
            })
        }

        else {
            res.status(400);
            throw new Error("No contacts found");
        }


    } )

)

router.get(

    '/get_contacts_by_name/:id',

    asyncHandler( async(req,res) => {

        const { id } = req.params;

        const contacts = await Contact.find( { "name": id } ).sort( { "name": 1 } );

        if(contacts) {
            res.status(200).json({
                message: "Contacts fetched successfully",
                contacts
            })
        }

        else {
            res.status(400);
            throw new Error("No contacts found");
        }


    } )

)

router.get(

    '/get_contacts_by_phone/:id',

    asyncHandler( async(req,res) => {

        const { id } = req.params;

        const contacts = await Contact.find( { "phone": id } ).sort( { "name": 1 } );

        if(contacts) {
            res.status(200).json({
                message: "Contacts fetched successfully",
                contacts
            })
        }

        else {
            res.status(400);
            throw new Error("No contacts found");
        }


    } )

)

router.delete(

    '/delete_by_id/:id',

    asyncHandler( async(req,res) => {

        const { id } = req.params;

        await Contact.findByIdAndDelete(id);

        res.json({
            message: "Contact deleted successfuly"
        })

    })

)

router.delete(

    '/delete_by_phone/:id',

    asyncHandler( async(req,res) => {

        const { id } = req.params;

        await Contact.deleteOne({ "phone": id });

        res.json({
            message: "Contact deleted successfuly"
        })

    })

)

router.put(

    '/update_contact/:id',

    asyncHandler( async( req , res ) => {

        const { name , email , phone , address } = req.body;

        const { id } = req.params;

        const contact = await Contact.findOne({ "phone": id });

        if(contact) {
        
            contact.name = name || contact.name;
            contact.email = email || contact.email;
            contact.phone = phone || contact.phone;
            contact.address = address || contact.address;

            const updateContact = await contact.save();

            res.json({
                message: "Contact updated successfully",
                updateContact
            })
        
        }

        else {

            res.status(401);
            throw new Error("Contact not found");
        
        }

    } )

)

module.exports = router;